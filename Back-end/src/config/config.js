// Configuración general de la aplicación
require('dotenv').config();

module.exports = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Configuración de la base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'barberia_db',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql'
  },
  
  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'barberia_secreto_2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: '7d'
  },
  
  // Configuración de puntos
  points: {
    minPointsToRedeem: 50, // Cantidad mínima de puntos necesarios para canjear
    pointsConversionRate: 1 // 1 punto = 1 unidad monetaria
  },
  
  // Configuración de horarios de la barbería
  businessHours: {
    openingTime: '09:00',
    closingTime: '20:00',
    daysOff: ['Sunday'] // Días de descanso
  }
}; 