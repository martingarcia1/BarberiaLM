const express = require('express');
const router = express.Router();
const puntosClienteController = require('../controllers/puntos_cliente.controller');

router.get('/', puntosClienteController.getAllPuntosCliente);
router.get('/:id', puntosClienteController.getPuntosClienteById);
router.post('/', puntosClienteController.createPuntosCliente);
router.put('/:id', puntosClienteController.updatePuntosCliente);
router.delete('/:id', puntosClienteController.deletePuntosCliente);

module.exports = router; 