require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // En desarrollo, permitir todos los orígenes
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/clientes', require('./routes/cliente.routes'));
app.use('/api/empleados', require('./routes/empleado.routes'));
app.use('/api/admins', require('./routes/admin.routes'));
app.use('/api/servicios', require('./routes/servicio.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/venta-productos', require('./routes/venta_producto.routes'));
app.use('/api/metodos-pago', require('./routes/metodo_pago.routes'));
app.use('/api/pagos', require('./routes/pago.routes'));
app.use('/api/puntos-clientes', require('./routes/puntos_cliente.routes'));
app.use('/api/historial-puntos', require('./routes/historial_puntos.routes'));

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de la Barbería' });
});

// Puerto
const PORT = process.env.PORT || 3001;

// Iniciar servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();
        
        // Inicializar base de datos (comentar esta línea en producción)
        await initDatabase();
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();