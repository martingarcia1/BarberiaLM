const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Appointments',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('earn', 'redeem'),
    allowNull: false,
    comment: 'Indica si es una transacción de ganar o canjear puntos'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Cantidad de puntos ganados o canjeados'
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Saldo de puntos después de la transacción'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Services',
      key: 'id'
    },
    comment: 'Servicio relacionado con la transacción'
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Empleado que registró la transacción'
  }
}, {
  timestamps: true
});

module.exports = Transaction; 