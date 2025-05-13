const express = require('express');
const router = express.Router();
const clienteAuthController = require('../controllers/clienteAuth.controller');

router.post('/register', clienteAuthController.register);
router.post('/login', clienteAuthController.login);

module.exports = router; 