const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const pointsController = require('../controllers/points.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Rutas para usuarios autenticados
// Obtener saldo de puntos del usuario
router.get('/balance', protect, pointsController.getPointsBalance);

// Obtener historial de transacciones de puntos
router.get('/history', protect, pointsController.getPointsHistory);

// Rutas para empleados y administradores
// Agregar puntos manualmente a un usuario
router.post(
  '/add',
  [
    protect,
    authorize('employee', 'admin'),
    check('userId', 'El ID del usuario es obligatorio').not().isEmpty(),
    check('points', 'Los puntos deben ser un número positivo').isInt({ min: 1 })
  ],
  pointsController.addPoints
);

// Restar puntos manualmente a un usuario
router.post(
  '/subtract',
  [
    protect,
    authorize('employee', 'admin'),
    check('userId', 'El ID del usuario es obligatorio').not().isEmpty(),
    check('points', 'Los puntos deben ser un número positivo').isInt({ min: 1 })
  ],
  pointsController.subtractPoints
);

module.exports = router; 