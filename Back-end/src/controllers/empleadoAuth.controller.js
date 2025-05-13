const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Empleado } = require('../models');

const generateToken = (empleado) => {
  return jwt.sign(
    {
      id: empleado.id,
      email: empleado.email,
      tipo: 'empleado'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, especialidad, salario, contraseña } = req.body;
    // Verificar si el email ya existe
    const existing = await Empleado.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoEmpleado = await Empleado.create({
      nombre,
      apellido,
      email,
      telefono,
      especialidad,
      salario,
      contraseña: hashedPassword
    });
    const token = generateToken(nuevoEmpleado);
    res.status(201).json({
      success: true,
      message: 'Empleado registrado exitosamente',
      data: {
        token,
        empleado: {
          id: nuevoEmpleado.id,
          email: nuevoEmpleado.email,
          nombre: nuevoEmpleado.nombre,
          apellido: nuevoEmpleado.apellido
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar empleado', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const empleado = await Empleado.findOne({ where: { email } });
    if (!empleado) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(contraseña, empleado.contraseña);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const token = generateToken(empleado);
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        empleado: {
          id: empleado.id,
          email: empleado.email,
          nombre: empleado.nombre,
          apellido: empleado.apellido
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
  }
}; 