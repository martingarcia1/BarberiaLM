const express = require('express');
const router = express.Router();
const clienteAuthController = require('../controllers/clienteAuth.controller');

// Ruta para registro de clientes
router.post('/register', clienteAuthController.register);

// Ruta para login de clientes
router.post('/login', clienteAuthController.login);

module.exports = router;