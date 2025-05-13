const { sequelize } = require('../config/database');
const { User, Service, PaymentMethod } = require('../models');
const bcrypt = require('bcryptjs');

// Función para inicializar la base de datos
const initDatabase = async () => {
  try {
    // Sincronizar todos los modelos con la base de datos
    // USAR SOLO EN DESARROLLO - En producción usar migraciones
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada correctamente.');

    // Crear usuario administrador por defecto
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      name: 'Admin',
      lastName: 'Principal',
      email: 'admin@barberia.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('Administrador creado:', admin.email);

    // Crear un empleado por defecto
    const employeePassword = await bcrypt.hash('barbero123', salt);
    const employee = await User.create({
      name: 'Juan',
      lastName: 'Pérez',
      email: 'barbero@barberia.com',
      password: employeePassword,
      role: 'employee',
      status: 'active'
    });

    console.log('Empleado creado:', employee.email);

    // Crear un usuario de prueba
    const userPassword = await bcrypt.hash('usuario123', salt);
    const user = await User.create({
      name: 'Cliente',
      lastName: 'Ejemplo',
      email: 'cliente@ejemplo.com',
      password: userPassword,
      phone: '1234567890',
      role: 'user',
      status: 'active',
      totalPoints: 100 // Puntos iniciales para pruebas
    });

    console.log('Usuario de prueba creado:', user.email);

    // Crear servicios de ejemplo
    const services = await Service.bulkCreate([
      {
        name: 'Corte de Cabello',
        description: 'Corte clásico con máquina y tijera',
        price: 15.00,
        duration: 30,
        pointsValue: 15,
        isExclusive: false
      },
      {
        name: 'Afeitado Tradicional',
        description: 'Afeitado con navaja y toallas calientes',
        price: 12.00,
        duration: 25,
        pointsValue: 12,
        isExclusive: false
      },
      {
        name: 'Corte y Barba',
        description: 'Incluye corte de cabello y arreglo de barba',
        price: 25.00,
        duration: 45,
        pointsValue: 25,
        isExclusive: false
      },
      {
        name: 'Tratamiento Capilar',
        description: 'Tratamiento hidratante para el cabello',
        price: 20.00,
        duration: 30,
        pointsValue: 20,
        isExclusive: false
      },
      {
        name: 'Servicio VIP',
        description: 'Corte, barba, masaje facial y bebida',
        price: 40.00,
        duration: 60,
        pointsValue: 0,
        pointsCost: 200,
        isExclusive: true
      }
    ]);

    console.log(`${services.length} servicios creados.`);

    // Crear métodos de pago
    const paymentMethods = await PaymentMethod.bulkCreate([
      {
        name: 'Efectivo',
        description: 'Pago en efectivo al finalizar el servicio',
        type: 'cash',
        isActive: true
      },
      {
        name: 'Tarjeta de Crédito',
        description: 'Pago con tarjeta de crédito',
        type: 'credit_card',
        isActive: true
      },
      {
        name: 'Tarjeta de Débito',
        description: 'Pago con tarjeta de débito',
        type: 'debit_card',
        isActive: true
      },
      {
        name: 'Transferencia',
        description: 'Pago por transferencia bancaria',
        type: 'transfer',
        isActive: true
      },
      {
        name: 'Puntos',
        description: 'Canje de puntos acumulados',
        type: 'points',
        isActive: true
      }
    ]);

    console.log(`${paymentMethods.length} métodos de pago creados.`);

    console.log('Base de datos inicializada correctamente con datos de prueba.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

// Si este archivo se ejecuta directamente, inicializar la base de datos
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Proceso completado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error durante la inicialización:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 