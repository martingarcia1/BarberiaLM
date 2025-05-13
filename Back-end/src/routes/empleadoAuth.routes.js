const express = require('express');
const router = express.Router();
const empleadoAuthController = require('../controllers/empleadoAuth.controller');

router.post('/register', empleadoAuthController.register);
router.post('/login', empleadoAuthController.login);

module.exports = router; 