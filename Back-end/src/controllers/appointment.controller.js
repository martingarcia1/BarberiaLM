const { Appointment, User, Service, Transaction } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Crear una nueva cita
exports.createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      serviceId, 
      appointmentDate, 
      notes, 
      isRedeemingPoints, 
      paymentMethod 
    } = req.body;

    // Obtener usuario del token (middleware de autenticación)
    const userId = req.user.id;

    // Verificar si el servicio existe
    const service = await Service.findByPk(serviceId);
    if (!service) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'El servicio no existe'
      });
    }

    // Verificar si es un servicio exclusivo y requiere canje de puntos
    if (service.isExclusive && !isRedeemingPoints) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Este servicio solo puede ser adquirido mediante canje de puntos'
      });
    }

    // Obtener datos del usuario para validación de puntos
    const user = await User.findByPk(userId);
    
    let pointsUsed = 0;
    let pointsEarned = 0;

    // Si está canjeando puntos, verificar que tenga suficientes
    if (isRedeemingPoints) {
      if (!service.pointsCost) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Este servicio no se puede canjear por puntos'
        });
      }

      if (user.totalPoints < service.pointsCost) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'No tienes suficientes puntos para canjear este servicio'
        });
      }

      pointsUsed = service.pointsCost;
    } else {
      // Si no está canjeando puntos, ganará puntos
      pointsEarned = service.pointsValue;
    }

    // Crear la cita con un código de confirmación único
    const appointment = await Appointment.create({
      userId,
      serviceId,
      appointmentDate,
      notes,
      isRedeemingPoints,
      paymentMethod: isRedeemingPoints ? 'points' : paymentMethod,
      pointsUsed,
      pointsEarned
    }, { transaction });

    // Actualizar los puntos del usuario
    if (isRedeemingPoints) {
      await User.update(
        { totalPoints: user.totalPoints - pointsUsed },
        { where: { id: userId }, transaction }
      );

      // Registrar la transacción de puntos (canje)
      await Transaction.create({
        userId,
        appointmentId: appointment.id,
        type: 'redeem',
        points: pointsUsed,
        balance: user.totalPoints - pointsUsed,
        description: `Canje de ${pointsUsed} puntos por el servicio: ${service.name}`,
        serviceId,
        employeeId: userId // Como es el sistema el que registra, usamos el mismo userId (aunque no sea empleado)
      }, { transaction });
    } else if (pointsEarned > 0) {
      await User.update(
        { totalPoints: user.totalPoints + pointsEarned },
        { where: { id: userId }, transaction }
      );

      // Registrar la transacción de puntos (ganancia)
      await Transaction.create({
        userId,
        appointmentId: appointment.id,
        type: 'earn',
        points: pointsEarned,
        balance: user.totalPoints + pointsEarned,
        description: `Ganó ${pointsEarned} puntos por el servicio: ${service.name}`,
        serviceId,
        employeeId: userId // Como es el sistema el que registra, usamos el mismo userId (aunque no sea empleado)
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Cita agendada correctamente',
      data: {
        appointment: {
          ...appointment.toJSON(),
          service: {
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.duration
          }
        },
        confirmationCode: appointment.confirmationCode
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear la cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agendar la cita',
      error: error.message
    });
  }
};

// Obtener las citas de un usuario
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'duration', 'pointsValue', 'pointsCost']
        },
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'name', 'lastName']
        }
      ],
      order: [['appointmentDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Error al obtener las citas del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas',
      error: error.message
    });
  }
};

// Verificar un código de confirmación (usado por los empleados)
exports.verifyConfirmationCode = async (req, res) => {
  try {
    const { confirmationCode } = req.params;

    const appointment = await Appointment.findOne({
      where: { confirmationCode },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastName', 'email', 'phone', 'totalPoints']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'duration', 'pointsValue', 'pointsCost']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Código de confirmación no válido'
      });
    }

    // Si la cita ya fue completada o cancelada
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Esta cita ya ha sido ${appointment.status === 'completed' ? 'completada' : 'cancelada'}`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Error al verificar el código de confirmación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el código',
      error: error.message
    });
  }
};

// Actualizar estado de la cita (usado por los empleados)
exports.updateAppointmentStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Solo empleados y administradores pueden actualizar el estado de las citas
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción'
      });
    }

    const { id } = req.params;
    const { status, employeeId } = req.body;

    // Validar el estado
    const validStatus = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatus.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    // Buscar la cita
    const appointment = await Appointment.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'user' 
        },
        { 
          model: Service, 
          as: 'service' 
        }
      ]
    });

    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Si ya está en el mismo estado
    if (appointment.status === status) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `La cita ya está en estado "${status}"`
      });
    }

    // Si la cita ya fue completada o cancelada
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `No se puede cambiar el estado de una cita que ya está ${appointment.status === 'completed' ? 'completada' : 'cancelada'}`
      });
    }

    // Actualizar la cita
    await appointment.update({
      status,
      employeeId: employeeId || req.user.id // Si no se especifica, usar el ID del empleado que hace la actualización
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Estado de la cita actualizado correctamente',
      data: {
        appointment
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar el estado de la cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de la cita',
      error: error.message
    });
  }
};

// Obtener las citas para un empleado
exports.getEmployeeAppointments = async (req, res) => {
  try {
    // Solo empleados y administradores pueden ver estas citas
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción'
      });
    }

    const { date, status } = req.query;
    const employeeId = req.user.role === 'employee' ? req.user.id : req.query.employeeId;

    const whereClause = {};

    // Filtrar por empleado
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    // Filtrar por fecha
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause.appointmentDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Filtrar por estado
    if (status) {
      whereClause.status = status;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastName', 'email', 'phone', 'totalPoints']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'duration', 'pointsValue', 'pointsCost']
        },
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'name', 'lastName']
        }
      ],
      order: [['appointmentDate', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Error al obtener las citas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas',
      error: error.message
    });
  }
}; 