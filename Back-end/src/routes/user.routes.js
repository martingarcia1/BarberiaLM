const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Obtener perfil del usuario autenticado
router.get('/profile', protect, userController.getUserProfile);

// Actualizar perfil del usuario
router.put(
  '/profile',
  [
    protect,
    check('name', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').optional().not().isEmpty(),
    check('phone', 'El teléfono no es válido').optional().isMobilePhone()
  ],
  userController.updateUserProfile
);

// Cambiar contraseña
router.put(
  '/change-password',
  [
    protect,
    check('currentPassword', 'La contraseña actual es obligatoria').not().isEmpty(),
    check('newPassword', 'La nueva contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  userController.changePassword
);

// Buscar usuarios (solo empleados y administradores)
router.get(
  '/search',
  [protect, authorize('employee', 'admin')],
  userController.searchUsers
);

// Obtener dashboard del usuario
router.get(
  '/dashboard',
  protect,
  userController.getUserDashboard
);

module.exports = router; 