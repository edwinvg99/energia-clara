const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

// ============================================================
// ALMACENAMIENTO TEMPORAL DE TOKENS DE RECUPERACIÓN
// ============================================================
// En producción se recomienda usar Redis o la BD; para MVP
// usamos memoria con limpieza automática.
// ============================================================
const resetTokens = new Map(); // token -> { email, expiresAt }

// Limpiar tokens expirados cada 15 minutos
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of resetTokens) {
    if (now > data.expiresAt) {
      resetTokens.delete(token);
    }
  }
}, 15 * 60 * 1000);

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

// ============================================================
// RATE LIMITING SIMPLE PARA SOLICITUDES DE RESET
// ============================================================
const resetRateLimit = new Map(); // IP -> { count, resetTime }
const MAX_RESET_PER_HOUR = 5;

function checkResetRateLimit(ip) {
  const now = Date.now();
  const data = resetRateLimit.get(ip);
  if (data && now < data.resetTime) {
    if (data.count >= MAX_RESET_PER_HOUR) {
      return false;
    }
    data.count++;
    return true;
  }
  resetRateLimit.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hora
  return true;
}

// ============================================================
// POST /forgot-password
// Envía email con enlace de recuperación
// ============================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Ingresa un email válido.' });
    }

    // Rate limit
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkResetRateLimit(clientIP)) {
      return res.status(429).json({
        message: 'Demasiadas solicitudes. Intenta de nuevo en una hora.',
      });
    }

    // Buscar usuario (no revelamos si existe o no por seguridad)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Respondemos igual para no revelar si el email está registrado
      return res.json({
        message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      });
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutos

    // Eliminar tokens anteriores del mismo email
    for (const [existingToken, data] of resetTokens) {
      if (data.email === email.toLowerCase().trim()) {
        resetTokens.delete(existingToken);
      }
    }

    resetTokens.set(token, {
      email: email.toLowerCase().trim(),
      expiresAt,
    });

    // Construir URL de reset
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${frontendURL}/reset-password/${token}`;

    // Verificar configuración de email
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
      console.warn('⚠ Variables de EmailJS no configuradas. Token generado:', token);
      console.warn('⚠ URL de reset:', resetURL);
      return res.json({
        message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
        // En desarrollo, devolver el token para pruebas
        ...(process.env.NODE_ENV !== 'production' && { devToken: token, devResetURL: resetURL }),
      });
    }

    // Enviar email
    try {
      await axios.post(EMAILJS_ENDPOINT, {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        ...(process.env.EMAILJS_PRIVATE_KEY && { accessToken: process.env.EMAILJS_PRIVATE_KEY }),
        template_params: {
          name: `${user.nombre} ${user.apellido}`.trim(),
          email: user.email,
          link: resetURL,
        },
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      return res.json({
        message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      });
    } catch (emailError) {
      // Si falla el envío SMTP, logueamos el error pero NO perdemos el token
      if (emailError.response) {
        console.error('Error al enviar email:', emailError.response.status, emailError.response.data);
      } else {
        console.error('Error al enviar email:', emailError.message);
      }
      console.warn('El token de reset fue generado correctamente pero el email no pudo enviarse.');
      console.warn('URL de reset (usar manualmente):', resetURL);

      // En desarrollo, devolvemos el token para que se pueda probar sin email funcional
      if (process.env.NODE_ENV !== 'production') {
        return res.json({
          message: 'No se pudo enviar el correo, pero el enlace de recuperación fue generado.',
          devToken: token,
          devResetURL: resetURL,
          devNote: 'El email SMTP falló. Usa el enlace devResetURL directamente para restablecer la contraseña.',
        });
      }

      // En producción, respuesta genérica (no revelar detalles)
      return res.json({
        message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      });
    }
  } catch (error) {
    console.error('Error en forgot-password:', error.message);
    return res.status(500).json({
      message: 'Error al procesar la solicitud. Intenta más tarde.',
    });
  }
});

// ============================================================
// GET /verify-token/:token
// Verifica si un token de reset es válido
// ============================================================
router.get('/verify-token/:token', (req, res) => {
  const { token } = req.params;
  const data = resetTokens.get(token);

  if (!data) {
    return res.status(400).json({ valid: false, message: 'Token inválido o expirado.' });
  }

  if (Date.now() > data.expiresAt) {
    resetTokens.delete(token);
    return res.status(400).json({ valid: false, message: 'El enlace ha expirado. Solicita uno nuevo.' });
  }

  return res.json({ valid: true });
});

// ============================================================
// POST /reset-password/:token
// Establece nueva contraseña usando el token
// ============================================================
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validar contraseña
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres.',
      });
    }

    // Verificar token
    const data = resetTokens.get(token);
    if (!data) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    if (Date.now() > data.expiresAt) {
      resetTokens.delete(token);
      return res.status(400).json({ message: 'El enlace ha expirado. Solicita uno nuevo.' });
    }

    // Buscar usuario y actualizar contraseña
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    // Eliminar token usado
    resetTokens.delete(token);

    return res.json({ message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error en reset-password:', error.message);
    return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

module.exports = router;
