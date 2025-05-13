const { Cliente } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login de cliente
exports.loginCliente = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log('Email recibido:', email);
    console.log('Contraseña recibida:', contrasena);

    const cliente = await Cliente.findOne({ where: { email } });
    console.log('Cliente encontrado:', cliente);

    if (!cliente) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verifica la contraseña
    console.log('Contraseña en BD:', cliente.contrasena);
    console.log('Comparando:', contrasena, 'vs', cliente.contrasena);
    const esValida = await bcrypt.compare(contrasena, cliente.contrasena);
    console.log('¿Contraseña válida?', esValida);

    if (!esValida) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: cliente.id_cliente, email: cliente.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      cliente: {
        id: cliente.id_cliente,
        nombre: cliente.nombre,
        email: cliente.email,
        contrasena: cliente.contrasena
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message || error });
  }
};

// Registrar un nuevo cliente
exports.registerCliente = async (req, res) => {
  try {
    const { contrasena, ...resto } = req.body;
    const nuevoCliente = await Cliente.create({ ...resto, contrasena });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar cliente', error: error.message || error });
  }
};

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  try {
    const nuevoCliente = await Cliente.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el cliente', error });
  }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    await cliente.update(req.body);
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente', error });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    await cliente.destroy();
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
}; 