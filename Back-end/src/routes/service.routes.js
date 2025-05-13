const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Validaciones
const serviceValidation = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('description').notEmpty().withMessage('La descripción es requerida'),
  body('price').isNumeric().withMessage('El precio debe ser un número'),
  body('duration').isNumeric().withMessage('La duración debe ser un número'),
  body('category').isIn(['corte', 'barba', 'combo', 'tratamiento', 'otro'])
    .withMessage('Categoría inválida')
];

// Rutas públicas
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

// Rutas protegidas (solo admin)
router.post('/', authMiddleware, serviceValidation, serviceController.createService);
router.put('/:id', authMiddleware, serviceValidation, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router; 