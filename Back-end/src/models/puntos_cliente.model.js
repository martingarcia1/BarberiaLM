const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PuntosCliente = sequelize.define('PuntosCliente', {
    cliente_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'cliente',
            key: 'id_cliente'
        }
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'puntos_cliente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = PuntosCliente; 