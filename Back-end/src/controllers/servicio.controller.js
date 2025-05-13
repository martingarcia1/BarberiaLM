const { Servicio } = require('../models');

exports.getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios', error });
  }
};

exports.getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el servicio', error });
  }
};

exports.createServicio = async (req, res) => {
  try {
    const nuevoServicio = await Servicio.create(req.body);
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el servicio', error });
  }
};

exports.updateServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
    await servicio.update(req.body);
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el servicio', error });
  }
};

exports.deleteServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
    await servicio.destroy();
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error });
  }
}; 