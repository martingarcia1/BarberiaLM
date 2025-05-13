const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pago.controller');

// Rutas existentes
router.get('/', pagoController.getAllPagos);
router.get('/:id', pagoController.getPagoById);
router.post('/', pagoController.createPago);
router.put('/:id', pagoController.updatePago);
router.delete('/:id', pagoController.deletePago);

// Nuevas rutas para Mercado Pago
router.post('/crear-pago', pagoController.crearPago);
router.post('/webhook', pagoController.webhookMP);

module.exports = router;