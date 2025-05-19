const { Empleado } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getAllEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      attributes: { exclude: ['contrasena'] }
    });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados', error: error.message });
  }
};

exports.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena'] }
    });
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el empleado', error: error.message });
  }
};

exports.createEmpleado = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, contrasena } = req.body;

    // Verificar si el email ya existe
    const existingEmpleado = await Empleado.findOne({ 
      where: { email },
      transaction: t 
    });

    if (existingEmpleado) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }

    // Crear el empleado
    const nuevoEmpleado = await Empleado.create(req.body, { transaction: t });

    await t.commit();

    // Excluir la contraseña de la respuesta
    const empleadoResponse = nuevoEmpleado.toJSON();
    delete empleadoResponse.contrasena;

    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: empleadoResponse
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear el empleado', 
      error: error.message 
    });
  }
};

exports.updateEmpleado = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      await t.rollback();
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Si se está actualizando el email, verificar que no exista
    if (req.body.email && req.body.email !== empleado.email) {
      const existingEmail = await Empleado.findOne({
        where: { email: req.body.email },
        transaction: t
      });

      if (existingEmail) {
        await t.rollback();
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    await empleado.update(req.body, { transaction: t });
    await t.commit();

    // Excluir la contraseña de la respuesta
    const empleadoResponse = empleado.toJSON();
    delete empleadoResponse.contrasena;

    res.json({
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: empleadoResponse
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar el empleado', 
      error: error.message 
    });
  }
};

exports.deleteEmpleado = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      await t.rollback();
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await empleado.destroy({ transaction: t });
    await t.commit();
    
    res.json({ 
      success: true, 
      message: 'Empleado eliminado correctamente' 
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el empleado', 
      error: error.message 
    });
  }
};