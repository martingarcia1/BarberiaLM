# Sistema de Puntos para Barbería - Backend

Este proyecto implementa el backend para un sistema de gestión de barbería que incluye un programa de fidelización con puntos. Los usuarios pueden acumular puntos por cada servicio adquirido y canjearlos por servicios exclusivos.

## Características principales

- **Gestión de usuarios** con roles (admin, empleado, cliente)
- **Sistema de puntos** para fidelización de clientes
- **Gestión de citas** con códigos de confirmación únicos
- **Seguimiento de transacciones** de puntos (ganancias y canjes)
- **Múltiples métodos de pago**
- **API RESTful** completa para integrarse con cualquier frontend

## Estructura del proyecto

```
src/
├── config/          # Configuraciones (base de datos, variables de entorno)
├── controllers/     # Controladores para manejar la lógica de negocio
├── database/        # Scripts para inicialización y seeders
│   ├── migrations/  # Migraciones de la base de datos
│   └── seeders/     # Datos de prueba para desarrollo
├── middleware/      # Middleware personalizado (auth, validación, etc.)
├── models/          # Modelos de datos (Sequelize)
├── routes/          # Definición de rutas de la API
├── services/        # Servicios para lógica de negocio compleja
├── utils/           # Utilidades y helpers
└── index.js         # Punto de entrada de la aplicación
```

## Requisitos previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   cd barberia-backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto usando `.env.example` como referencia
   - Configura la conexión a la base de datos y demás variables

4. Crea la base de datos MySQL:
   ```
   CREATE DATABASE barberia_db;
   ```

5. Inicializa la base de datos con datos de prueba:
   ```
   npm run seed
   ```

## Uso

Para iniciar el servidor en modo desarrollo:
```
npm run dev
```

Para iniciar el servidor en modo producción:
```
npm start
```

## API Endpoints principales

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener información del usuario autenticado

### Usuarios
- `GET /api/users/profile` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil de usuario

### Servicios
- `GET /api/services` - Listar todos los servicios disponibles
- `GET /api/services/:id` - Detalles de un servicio específico

### Citas
- `POST /api/appointments` - Crear una nueva cita
- `GET /api/appointments/my-appointments` - Listar citas del usuario
- `GET /api/appointments/verify/:confirmationCode` - Verificar código de cita (empleados)
- `PATCH /api/appointments/:id/status` - Actualizar estado de cita (empleados)

### Puntos y Transacciones
- `GET /api/points/balance` - Consultar saldo de puntos
- `GET /api/points/history` - Historial de transacciones

## Roles y permisos

### Administrador
- Acceso total al sistema
- Gestión de empleados
- Visualización de ingresos
- Generación de reportes

### Empleado
- Verificación de usuarios
- Gestión de servicios y citas
- Registro de transacciones

### Usuario
- Registro e inicio de sesión
- Consulta de servicios
- Reserva de citas
- Consulta de puntos

## Credenciales de prueba

### Administrador
- Email: admin@barberia.com
- Password: admin123

### Empleado
- Email: barbero@barberia.com
- Password: barbero123

### Usuario
- Email: cliente@ejemplo.com
- Password: usuario123

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia ISC. 