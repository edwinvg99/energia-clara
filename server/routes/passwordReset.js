const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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

// ============================================================
// CONFIGURACIÓN DE TRANSPORTE DE EMAIL
// ============================================================
function createTransporter() {
  // Transporte por defecto: Gmail SMTP con IPv4 forzado.
  // Ajustar host/port si se usa otro proveedor.
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      servername: process.env.SMTP_HOST || 'smtp.gmail.com',
      rejectUnauthorized: false,
    },
    socketOptions: { family: 4 },
  });
}

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
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠ Variables EMAIL_USER y EMAIL_PASS no configuradas. Token generado:', token);
      console.warn('⚠ URL de reset:', resetURL);
      return res.json({
        message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
        // En desarrollo, devolver el token para pruebas
        ...(process.env.NODE_ENV !== 'production' && { devToken: token, devResetURL: resetURL }),
      });
    }

    // Enviar email
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Energía Clara" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña - Energía Clara',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #10b981; margin: 0; font-size: 24px;">Energía Clara</h1>
              <p style="color: #94a3b8; margin: 8px 0 0;">Plataforma Educativa TDEA</p>
            </div>
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
              <h2 style="color: #1e293b; font-size: 20px;">Recuperación de contraseña</h2>
              <p style="color: #475569; line-height: 1.6;">
                Hola <strong>${user.nombre}</strong>,
              </p>
              <p style="color: #475569; line-height: 1.6;">
                Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetURL}" style="background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                  Restablecer contraseña
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                Este enlace expira en <strong>30 minutos</strong>. Si no solicitaste este cambio, ignora este correo.
              </p>
              <p style="color: #cbd5e1; font-size: 11px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <a href="${resetURL}" style="color: #10b981;">${resetURL}</a>
              </p>
            </div>
            <div style="background: #f8fafc; padding: 15px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e2e8f0; border-top: none;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Tecnológico de Antioquia - TDEA</p>
            </div>
          </div>
        `,
      });

      return res.json({
        message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      });
    } catch (emailError) {
      // Si falla el envío SMTP, logueamos el error pero NO perdemos el token
      console.error('Error al enviar email SMTP:', emailError.message);
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
