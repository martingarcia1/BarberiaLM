const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');

// Rutas públicas
router.get('/disponibilidad', citaController.getDisponibilidad);

// Rutas de citas
router.get('/', citaController.getAllCitas);
router.get('/:id', citaController.getCitaById);
router.post('/', citaController.createCita);
router.put('/:id', citaController.updateCita);
router.delete('/:id', citaController.deleteCita);

// Rutas específicas para estado de citas
router.put('/:id/estado', citaController.updateEstadoCita);

module.exports = router; 