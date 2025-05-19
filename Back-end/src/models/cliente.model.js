const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Cliente = sequelize.define('Cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    genero: {
        type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
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
    dni: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
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
    tableName: 'cliente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (cliente) => {
            if (cliente.contrasena) {
                const salt = await bcrypt.genSalt(10);
                cliente.contrasena = await bcrypt.hash(cliente.contrasena, salt);
            }
        },
        beforeUpdate: async (cliente) => {
            if (cliente.changed('contrasena')) {
                const salt = await bcrypt.genSalt(10);
                cliente.contrasena = await bcrypt.hash(cliente.contrasena, salt);
            }
        }
    }
});

// Método para comparar contraseñas
Cliente.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.contrasena);
};

module.exports = Cliente;