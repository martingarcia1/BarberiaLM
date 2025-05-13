const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Cliente } = require('../models');

const generateToken = (cliente) => {
  return jwt.sign(
    {
      id: cliente.id_cliente,
      email: cliente.email,
      tipo: 'cliente'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, dni, telefono, contrasena } = req.body;
    // Verificar si el email ya existe
    const existing = await Cliente.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      email,
      dni,
      telefono,
      contrasena: hashedPassword
    });
    const token = generateToken(nuevoCliente);
    res.status(201).json({
      success: true,
      message: 'Cliente registrado exitosamente',
      data: {
        token,
        cliente: {
          id: nuevoCliente.id_cliente,
          email: nuevoCliente.email,
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar cliente', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const cliente = await Cliente.findOne({ where: { email } });
    if (!cliente) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const token = generateToken(cliente);
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        cliente: {
          id: cliente.id_cliente,
          email: cliente.email,
          nombre: cliente.nombre,
          apellido: cliente.apellido
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
  }
}; 