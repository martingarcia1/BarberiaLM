const { User, Transaction, Appointment, Service } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Obtener perfil del usuario
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil de usuario',
      error: error.message
    });
  }
};

// Actualizar perfil del usuario
exports.updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { name, lastName, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar datos del usuario
    await user.update({
      name: name || user.name,
      lastName: lastName || user.lastName,
      phone: phone || user.phone
    });

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          totalPoints: user.totalPoints
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      error: error.message
    });
  }
};

// Cambiar contraseña del usuario
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await user.update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña',
      error: error.message
    });
  }
};

// Buscar usuarios por nombre o email (para empleados/admin)
exports.searchUsers = async (req, res) => {
  try {
    // Solo empleados y administradores pueden buscar usuarios
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción'
      });
    }

    const { search, limit = 10 } = req.query;
    const condition = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ],
      role: 'user' // Solo buscar usuarios normales, no empleados ni admins
    } : {
      role: 'user'
    };

    const users = await User.findAll({
      where: condition,
      attributes: ['id', 'name', 'lastName', 'email', 'phone', 'totalPoints', 'status'],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar usuarios',
      error: error.message
    });
  }
};

// Obtener resumen del usuario (para dashboard)
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener datos de usuario
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'lastName', 'email', 'totalPoints']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener próximas citas
    const upcomingAppointments = await Appointment.findAll({
      where: { 
        userId,
        status: {
          [Op.in]: ['pending', 'confirmed']
        },
        appointmentDate: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'duration']
        }
      ],
      order: [['appointmentDate', 'ASC']],
      limit: 3
    });

    // Obtener transacciones recientes
    const recentTransactions = await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        upcomingAppointments,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Error al obtener dashboard del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del dashboard',
      error: error.message
    });
  }
}; 