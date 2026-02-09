require('dotenv').config({ path: '.env' });
const { sequelize } = require('./src/config/database');
const Admin = require('./src/models/admin.model');
const bcrypt = require('bcryptjs');

const encryptPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a base de datos exitosa.');

        const email = 'martingarcia.code@gmail.com';
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            console.log('Admin no encontrado');
            process.exit(1);
        }

        console.log(`Admin encontrado: ${admin.nombre_admin}`);

        // Encriptar contraseña manualmente
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('MartinAdmin7804', salt);

        // Actualizar directamente en la base de datos sin pasar por hooks si es necesario, 
        // pero aquí usamos update normal.
        // Importante: Al asignar el hash directo, evitamos que el hook lo vuelva a hashear 
        // si el hook detecta cambio.
        // Pero nuestro hook busca `admin.changed('contrasena')`.
        // Si asignamos el hash, 'contrasena' cambia.
        // El hook volvería a hashear el hash. ¡OJO!

        // Forma segura: Usar el hook.
        // Asignamos la contraseña en texto plano y dejamos que el hook actúe.
        // Pero el problema era que si la contraseña es IGUAL a la actual (texto plano),
        // sequelize quizás no detecte cambio.

        // Mejor opción: Actualizar directamente via SQL o desactivando hooks.

        await Admin.update(
            { contrasena: hashedPassword },
            {
                where: { id: admin.id },
                hooks: false // Desactivamos hooks para guardar el hash directamente
            }
        );

        console.log('Contraseña encriptada correctamente.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

encryptPassword();
