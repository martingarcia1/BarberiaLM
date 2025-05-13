const { Empleado } = require('../models');

exports.getAllEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados', error });
  }
};

exports.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el empleado', error });
  }
};

exports.createEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = await Empleado.create(req.body);
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el empleado', error });
  }
};

exports.updateEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    await empleado.update(req.body);
    res.json(empleado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el empleado', error });
  }
};

exports.deleteEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    await empleado.destroy();
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado', error });
  }
}; 