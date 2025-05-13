const Cliente = require('./cliente.model');
const Empleado = require('./empleado.model');
const Admin = require('./admin.model');
const Servicio = require('./servicio.model');
const Cita = require('./cita.model');
const PuntosCliente = require('./puntos_cliente.model');
const HistorialPuntos = require('./historial_puntos.model');
const Producto = require('./producto.model');
const VentaProducto = require('./venta_producto.model');
const MetodoPago = require('./metodo_pago.model');
const Pago = require('./pago.model');

// Relaciones Cliente
Cliente.hasMany(Cita, { foreignKey: 'cliente_id', as: 'citas' });
Cliente.hasOne(PuntosCliente, { foreignKey: 'cliente_id', as: 'puntos' });
Cliente.hasMany(HistorialPuntos, { foreignKey: 'cliente_id', as: 'historial_puntos' });
Cliente.hasMany(VentaProducto, { foreignKey: 'cliente_id', as: 'ventas' });

// Relaciones Empleado
Empleado.hasMany(Cita, { foreignKey: 'empleado_id', as: 'citas' });

// Relaciones Servicio
Servicio.hasMany(Cita, { foreignKey: 'servicio_id', as: 'citas' });

// Relaciones Cita
Cita.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cita.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Cita.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });
Cita.hasOne(Pago, { foreignKey: 'cita_id', as: 'pago' });

// Relaciones PuntosCliente
PuntosCliente.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Relaciones HistorialPuntos
HistorialPuntos.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Relaciones Producto
Producto.hasMany(VentaProducto, { foreignKey: 'producto_id', as: 'ventas' });

// Relaciones VentaProducto
VentaProducto.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
VentaProducto.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Relaciones MetodoPago y Pago
MetodoPago.hasMany(Pago, { foreignKey: 'metodo_pago_id', as: 'pagos_realizados' });
Pago.belongsTo(MetodoPago, { foreignKey: 'metodo_pago_id', as: 'forma_pago' });
Pago.belongsTo(Cita, { foreignKey: 'cita_id', as: 'cita_asociada' });

module.exports = {
    Cliente,
    Empleado,
    Admin,
    Servicio,
    Cita,
    PuntosCliente,
    HistorialPuntos,
    Producto,
    VentaProducto,
    MetodoPago,
    Pago
};