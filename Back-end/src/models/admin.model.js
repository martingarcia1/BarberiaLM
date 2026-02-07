const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_admin: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'admin',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.contrasena) {
                const salt = await bcrypt.genSalt(10);
                admin.contrasena = await bcrypt.hash(admin.contrasena, salt);
            }
            // Asegurar que updated_at tenga un valor al crear
            if (!admin.updated_at) {
                admin.updated_at = new Date();
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('contrasena')) {
                const salt = await bcrypt.genSalt(10);
                admin.contrasena = await bcrypt.hash(admin.contrasena, salt);
            }
        }
    }
});

// Método para comparar contraseñas
Admin.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.contrasena);
};

module.exports = Admin; 