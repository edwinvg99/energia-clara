const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const validateRegister = (req) => {
  const { nombre, apellido, email, password, universidad, ciudad, telefono, direccion } = req.body;
  const errors = {};

  if (!nombre || nombre.trim() === "") errors.nombre = "El nombre es requerido";
  if (!apellido || apellido.trim() === "") errors.apellido = "El apellido es requerido";
  
  if (!email || email.trim() === "") {
    errors.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email inválido";
  }

  if (!password) {
    errors.password = "La contraseña es requerida";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (!universidad) errors.universidad = "La universidad es requerida";
  if (!ciudad) errors.ciudad = "La ciudad es requerida";
  
  if (!telefono || telefono.trim() === "") {
    errors.telefono = "El teléfono es requerido";
  } else if (!/^\d{10}$/.test(telefono.replace(/\D/g, ''))) {
    errors.telefono = "El teléfono debe tener 10 dígitos";
  }

  if (!direccion || direccion.trim() === "") errors.direccion = "La dirección es requerida";

  return errors;
};

router.post('/register', async (req, res) => {
  const errors = validateRegister(req);
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validación fallida", errors });
  }

  try {
    const { nombre, apellido, email, password, universidad, ciudad, telefono, direccion } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Este email ya está registrado" });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      nombre, 
      apellido, 
      email, 
      password: hashed,
      universidad,
      ciudad,
      telefono,
      direccion
    });
    
    res.json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Credenciales inválidas" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, nombre: user.nombre, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;
