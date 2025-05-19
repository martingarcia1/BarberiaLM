const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Cliente } = require('../models');
const { sequelize } = require('../config/database');

const generateToken = (cliente) => {
  return jwt.sign(
    {
      id: cliente.id_cliente,
      email: cliente.email,
      tipo: 'cliente'
    },
    process.env.JWT_SECRET || 'tu_clave_secreta_temporal',
    { expiresIn: '24h' }
  );
};

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { 
      nombre, 
      apellido, 
      email, 
      dni, 
      telefono, 
      contrasena,
      fecha_nacimiento,
      genero 
    } = req.body;

    // Verificar si el email ya existe
    const existingEmail = await Cliente.findOne({ 
      where: { email },
      transaction: t 
    });
    
    if (existingEmail) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }

    // Verificar si el DNI ya existe
    const existingDNI = await Cliente.findOne({ 
      where: { dni },
      transaction: t 
    });
    
    if (existingDNI) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'El DNI ya está registrado' 
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      email,
      dni,
      telefono,
      contrasena: hashedPassword,
      fecha_nacimiento,
      genero,
      estado: 'activo'
    }, { transaction: t });

    // Generar token
    const token = generateToken(nuevoCliente);

    await t.commit();

    // Enviar respuesta exitosa
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
    await t.rollback();
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar cliente', 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    
    // Buscar el cliente
    const cliente = await Cliente.findOne({ 
      where: { 
        email,
        estado: 'activo'
      } 
    });

    if (!cliente) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generateToken(cliente);

    // Enviar respuesta exitosa
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
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión', 
      error: error.message 
    });
  }
};