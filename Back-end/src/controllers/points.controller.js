const { User, Transaction } = require('../models');
const { sequelize } = require('../config/database');

// Obtener el saldo de puntos del usuario autenticado
exports.getPointsBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'lastName', 'totalPoints']
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
        userId: user.id,
        name: `${user.name} ${user.lastName}`,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    console.error('Error al obtener saldo de puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el saldo de puntos',
      error: error.message
    });
  }
};

// Obtener el historial de transacciones de puntos del usuario
exports.getPointsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'name', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener historial de puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de puntos',
      error: error.message
    });
  }
};

// Agregar puntos manualmente (solo para admin/empleados)
exports.addPoints = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { userId, points, description } = req.body;
    const employeeId = req.user.id;

    // Validar entrada
    if (!userId || !points || points <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos. Se requiere userId y una cantidad positiva de puntos.'
      });
    }

    // Buscar el usuario
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar puntos del usuario
    const newPointsTotal = user.totalPoints + points;
    await user.update({ totalPoints: newPointsTotal }, { transaction });

    // Registrar la transacción
    const pointsTransaction = await Transaction.create({
      userId,
      type: 'earn',
      points,
      balance: newPointsTotal,
      description: description || 'Puntos agregados manualmente',
      employeeId
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Puntos agregados correctamente',
      data: {
        transaction: pointsTransaction,
        newBalance: newPointsTotal
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al agregar puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar puntos',
      error: error.message
    });
  }
};

// Restar puntos manualmente (solo para admin/empleados)
exports.subtractPoints = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { userId, points, description } = req.body;
    const employeeId = req.user.id;

    // Validar entrada
    if (!userId || !points || points <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos. Se requiere userId y una cantidad positiva de puntos.'
      });
    }

    // Buscar el usuario
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que tenga suficientes puntos
    if (user.totalPoints < points) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El usuario no tiene suficientes puntos'
      });
    }

    // Actualizar puntos del usuario
    const newPointsTotal = user.totalPoints - points;
    await user.update({ totalPoints: newPointsTotal }, { transaction });

    // Registrar la transacción
    const pointsTransaction = await Transaction.create({
      userId,
      type: 'redeem',
      points,
      balance: newPointsTotal,
      description: description || 'Puntos restados manualmente',
      employeeId
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Puntos restados correctamente',
      data: {
        transaction: pointsTransaction,
        newBalance: newPointsTotal
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al restar puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restar puntos',
      error: error.message
    });
  }
}; 