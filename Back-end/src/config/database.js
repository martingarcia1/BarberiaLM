const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos con los datos de MySQL Workbench
// Configura la conexión a la base de datos
let sequelize;

if (process.env.DATABASE_URL) {
  // Configuración para producción (Railway/Vercel) usando la URL de conexión
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Configuración para desarrollo local
  sequelize = new Sequelize(
    process.env.DB_NAME || 'sistema_barberia',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '0110Martin',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3300,
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
}

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