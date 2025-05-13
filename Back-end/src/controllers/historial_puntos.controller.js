const { HistorialPuntos } = require('../models');

exports.getAllHistorialPuntos = async (req, res) => {
  try {
    const historial = await HistorialPuntos.findAll();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de puntos', error });
  }
};

exports.getHistorialPuntosById = async (req, res) => {
  try {
    const registro = await HistorialPuntos.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro de historial de puntos no encontrado' });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el registro de historial de puntos', error });
  }
};

exports.createHistorialPuntos = async (req, res) => {
  try {
    const nuevoRegistro = await HistorialPuntos.create(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el registro de historial de puntos', error });
  }
};

exports.updateHistorialPuntos = async (req, res) => {
  try {
    const registro = await HistorialPuntos.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro de historial de puntos no encontrado' });
    await registro.update(req.body);
    res.json(registro);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el registro de historial de puntos', error });
  }
};

exports.deleteHistorialPuntos = async (req, res) => {
  try {
    const registro = await HistorialPuntos.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro de historial de puntos no encontrado' });
    await registro.destroy();
    res.json({ message: 'Registro de historial de puntos eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el registro de historial de puntos', error });
  }
}; 