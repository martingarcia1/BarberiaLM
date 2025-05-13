const { Admin } = require('../models');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    console.log('Intentando iniciar sesión con email:', email);
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      console.log('Admin no encontrado');
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    const isMatch = await admin.comparePassword(contrasena);
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, nombre_admin: admin.nombre_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Token generado:', token);

    res.json({ token, admin: { id: admin.id, email: admin.email, nombre_admin: admin.nombre_admin } });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el login', error });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'nombre_admin', 'email']
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los administradores', error });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: ['id', 'nombre_admin', 'email']
    });
    if (!admin) return res.status(404).json({ message: 'Administrador no encontrado' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el administrador', error });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { nombre_admin, email, contrasena } = req.body;
    const nuevoAdmin = await Admin.create({
      nombre_admin,
      email,
      contrasena
    });
    res.status(201).json({
      id: nuevoAdmin.id,
      nombre_admin: nuevoAdmin.nombre_admin,
      email: nuevoAdmin.email
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el administrador', error });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Administrador no encontrado' });
    const { nombre_admin, email, contrasena } = req.body;
    await admin.update({
      nombre_admin,
      email,
      ...(contrasena ? { contrasena } : {})
    });
    res.json({
      id: admin.id,
      nombre_admin: admin.nombre_admin,
      email: admin.email,
      contrasena: admin.contrasena
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el administrador', error });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Administrador no encontrado' });
    await admin.destroy();
    res.json({ message: 'Administrador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el administrador', error });
  }
};