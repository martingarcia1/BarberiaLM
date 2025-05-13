const express = require('express');
const router = express.Router();
const metodoPagoController = require('../controllers/metodo_pago.controller');

router.get('/', metodoPagoController.getAllMetodosPago);
router.get('/:id', metodoPagoController.getMetodoPagoById);
router.post('/', metodoPagoController.createMetodoPago);
router.put('/:id', metodoPagoController.updateMetodoPago);
router.delete('/:id', metodoPagoController.deleteMetodoPago);

module.exports = router; 