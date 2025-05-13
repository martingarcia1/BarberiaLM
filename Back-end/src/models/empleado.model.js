const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Empleado = sequelize.define('Empleado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    salario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}, {
    tableName: 'empleado',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (empleado) => {
            if (empleado.contrasena) {
                const salt = await bcrypt.genSalt(10);
                empleado.contraseña = await bcrypt.hash(empleado.contrasena, salt);
            }
        },
        beforeUpdate: async (empleado) => {
            if (empleado.changed('contrasena')) {
                const salt = await bcrypt.genSalt(10);
                empleado.contrasena = await bcrypt.hash(empleado.contrasena, salt);
            }
        }
    }
});

// Método para comparar contraseñas
Empleado.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.contrasena);
};

module.exports = Empleado; 