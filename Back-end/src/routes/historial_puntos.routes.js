const express = require('express');
const router = express.Router();
const historialPuntosController = require('../controllers/historial_puntos.controller');

router.get('/', historialPuntosController.getAllHistorialPuntos);
router.get('/:id', historialPuntosController.getHistorialPuntosById);
router.post('/', historialPuntosController.createHistorialPuntos);
router.put('/:id', historialPuntosController.updateHistorialPuntos);
router.delete('/:id', historialPuntosController.deleteHistorialPuntos);

module.exports = router; 