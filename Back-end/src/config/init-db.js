const { sequelize } = require('./database');
const { Cliente, Empleado, Admin, Servicio, Cita, PuntosCliente, HistorialPuntos, Producto, VentaProducto, MetodoPago, Pago } = require('../models');

const initDatabase = async () => {
    try {
        // Eliminar tablas en orden inverso a las dependencias
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Primero eliminar tablas que dependen de otras
        await Pago.drop();
        await Cita.drop();
        await VentaProducto.drop();
        await HistorialPuntos.drop();
        await PuntosCliente.drop();
        
        // Luego eliminar tablas base
        await Producto.drop();
        await Servicio.drop();
        await Cliente.drop();
        await Empleado.drop();
        await Admin.drop();
        await MetodoPago.drop();

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Sincronizar modelos con la base de datos
        await sequelize.sync({ force: true });

        // Crear datos iniciales
        await createInitialData();
        
        console.log('Base de datos inicializada correctamente.');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
};

const createInitialData = async () => {
    // Verificar si ya existe un administrador con el mismo correo electrónico
    const existingAdmin = await Admin.findOne({ where: { email: 'Lorenamontenegro.avanzar@gmail.com' } });
    if (!existingAdmin) {
        await Admin.create({
            nombre_admin: 'Admin Principal',
            email: 'Lorenamontenegro.avanzar@gmail.com',
            contrasena: 'LoreAdmin2398' // En producción, esto debería estar hasheado
        });
    } else {
        console.log('El administrador ya existe, no se creará uno nuevo.');
    }

    // Crear métodos de pago por defecto
    await MetodoPago.bulkCreate([
        { nombre_metodo_pago: 'Efectivo' },
        { nombre_metodo_pago: 'Tarjeta de Crédito' },
        { nombre_metodo_pago: 'Tarjeta de Débito' },
        { nombre_metodo_pago: 'MercadoPago' }
    ], { ignoreDuplicates: true });

    // Crear servicios por defecto
    await Servicio.bulkCreate([
        {
            nombre_servicio: 'Corte de Cabello',
            descripcion: 'Corte de cabello tradicional',
            precio: 15.00,
            duracion: 30
        },
        {
            nombre_servicio: 'Barba',
            descripcion: 'Arreglo de barba',
            precio: 10.00,
            duracion: 20
        },
        {
            nombre_servicio: 'Corte + Barba',
            descripcion: 'Corte de cabello y arreglo de barba',
            precio: 20.00,
            duracion: 45
        }
    ], { ignoreDuplicates: true });
};

module.exports = initDatabase;