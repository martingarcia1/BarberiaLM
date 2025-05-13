const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MetodoPago = sequelize.define('MetodoPago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}, {
    tableName: 'metodo_pago',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MetodoPago; 