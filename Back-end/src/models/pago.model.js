const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cita_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'cita',
            key: 'id'
        }
    },
    metodo_pago_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'metodo_pago',
            key: 'id'
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Completado', 'Cancelado'),
        defaultValue: 'Pendiente'
    },
    tipo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    referencia_externa: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true
    },
    id_transaccion_mp: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cliente',
            key: 'id_cliente'
        }
    }
}, {
    tableName: 'pago',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Pago;