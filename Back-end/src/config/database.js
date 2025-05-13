const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos con los datos de MySQL Workbench
const sequelize = new Sequelize(
  'sistema_barberia', // nombre de la base de datos EXACTO
  'root',        // usuario
  '0110Martin', // pon aquí tu contraseña real
  {
    host: '127.0.0.1',
    port: 3300,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

// Exportamos sequelize y la función de prueba
module.exports = {
  sequelize,
  testConnection
}; 