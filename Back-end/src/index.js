require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { testConnection } = require('./config/database');
const initDatabase = require('./config/init-db');

const app = express();

// Configuración CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);

    // Para simplificar el despliegue y evitar errores de CORS, permitimos todos los orígenes
    // En producción idealmente se deberían restringir, pero para este caso de uso es aceptable
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/clientes/auth', require('./routes/clienteAuth.routes'));
app.use('/api/empleados/auth', require('./routes/empleadoAuth.routes'));

// Rutas principales
app.use('/api/clientes', require('./routes/cliente.routes'));
app.use('/api/empleados', require('./routes/empleado.routes'));
app.use('/api/admins', require('./routes/admin.routes'));
app.use('/api/servicios', require('./routes/servicio.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/puntos', require('./routes/puntos_cliente.routes'));
app.use('/api/venta-productos', require('./routes/venta_producto.routes'));
app.use('/api/metodos-pago', require('./routes/metodo_pago.routes'));
app.use('/api/pagos', require('./routes/pago.routes'));
app.use('/api/puntos-clientes', require('./routes/puntos_cliente.routes'));
app.use('/api/historial-puntos', require('./routes/historial_puntos.routes'));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Puerto
const PORT = process.env.PORT || 3001;

// Iniciar servidor solo si no estamos en modo test o importado por Vercel
if (require.main === module) {
  const startServer = async () => {
    try {
      // Probar conexión a la base de datos
      await testConnection();

      // Inicializar base de datos (comentar esta línea en producción si se usan migraciones)
      // await initDatabase();

      app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
    }
  };

  startServer();
}

module.exports = app;