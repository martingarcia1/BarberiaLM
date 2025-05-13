const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Ruta para crear una cita (todos los usuarios autenticados)
router.post(
  '/',
  protect,
  [
    check('serviceId', 'El ID del servicio es obligatorio').not().isEmpty(),
    check('appointmentDate', 'La fecha y hora de la cita es obligatoria').not().isEmpty(),
    check('paymentMethod', 'El método de pago es obligatorio cuando no se canjean puntos').custom((value, { req }) => {
      if (!req.body.isRedeemingPoints && !value) {
        throw new Error('El método de pago es obligatorio para compras con dinero');
      }
      return true;
    })
  ],
  appointmentController.createAppointment
);

// Ruta para obtener las citas de un usuario (usuario)
router.get('/my-appointments', protect, appointmentController.getUserAppointments);

// Ruta para verificar un código de confirmación (empleado/admin)
router.get(
  '/verify/:confirmationCode',
  protect,
  authorize('employee', 'admin'),
  appointmentController.verifyConfirmationCode
);

// Ruta para actualizar el estado de una cita (empleado/admin)
router.patch(
  '/:id/status',
  protect,
  authorize('employee', 'admin'),
  appointmentController.updateAppointmentStatus
);

// Ruta para obtener las citas para un empleado (empleado/admin)
router.get(
  '/employee',
  protect,
  authorize('employee', 'admin'),
  appointmentController.getEmployeeAppointments
);

module.exports = router; 