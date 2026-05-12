const express = require('express');
const Modulo = require('../models/Modulo');

const router = express.Router();

router.get('/modulos', async (req, res) => {
  try {
    const modulos = await Modulo.find({}, '-__v').lean();
    res.json(modulos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los módulos' });
  }
});

router.get('/modulos/:id', async (req, res) => {
  try {
    const modulo = await Modulo.findOne({ id: req.params.id }, '-__v').lean();
    if (!modulo) return res.status(404).json({ message: 'Módulo no encontrado' });
    res.json(modulo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el módulo' });
  }
});

module.exports = router;
