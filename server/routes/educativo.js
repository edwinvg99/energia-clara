const express = require('express');
const Modulo = require('../models/Modulo');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Público: listado con metadatos (sin contenido ni examen)
router.get('/modulos', async (req, res) => {
  try {
    const modulos = await Modulo.find(
      {},
      'id titulo icono descripcion color contenido examen recursos -_id'
    ).lean();

    const resultado = modulos.map(({ contenido, examen, recursos, ...meta }) => ({
      ...meta,
      totalSecciones: contenido.length,
      totalPreguntas: examen.length,
      totalRecursos: recursos.length,
    }));

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los módulos' });
  }
});

// Público: detalle completo SIN las respuestas correctas del examen.
// La validación de auth aquí causaba 30-60s de cold-start del SDK externo
// en cada navegación a un módulo. Las respuestas correctas se evalúan en
// el endpoint POST /modulos/:id/evaluar (protegido).
router.get('/modulos/:id', async (req, res) => {
  try {
    const modulo = await Modulo.findOne({ id: req.params.id }, '-__v -_id').lean();
    if (!modulo) return res.status(404).json({ message: 'Módulo no encontrado' });

    if (Array.isArray(modulo.examen)) {
      modulo.examen = modulo.examen.map(({ correcta, ...rest }) => rest);
    }

    res.json(modulo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el módulo' });
  }
});

// Protegido: evalúa las respuestas del usuario en el servidor.
// El frontend envía { respuestas: { "0": 2, "1": 0, ... } } (índice de opción
// elegida por pregunta) y recibe { correctas, total }.
router.post('/modulos/:id/evaluar', authMiddleware, async (req, res) => {
  try {
    const modulo = await Modulo.findOne({ id: req.params.id }, 'examen -_id').lean();
    if (!modulo) return res.status(404).json({ message: 'Módulo no encontrado' });

    const respuestas = req.body?.respuestas;
    if (!respuestas || typeof respuestas !== 'object') {
      return res.status(400).json({ message: 'Faltan respuestas en el body' });
    }

    let correctas = 0;
    modulo.examen.forEach((preg, i) => {
      if (Number(respuestas[i]) === preg.correcta) correctas++;
    });

    res.json({ correctas, total: modulo.examen.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al evaluar el examen' });
  }
});

module.exports = router;
