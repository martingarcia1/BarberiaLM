const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'transfer', 'points', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Detalles adicionales específicos de cada método de pago'
  }
}, {
  timestamps: true
});

module.exports = PaymentMethod; 