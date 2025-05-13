const { PuntosCliente } = require('../models');

exports.getAllPuntosCliente = async (req, res) => {
  try {
    const puntos = await PuntosCliente.findAll();
    res.json(puntos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los puntos de clientes', error });
  }
};

exports.getPuntosClienteById = async (req, res) => {
  try {
    const puntos = await PuntosCliente.findByPk(req.params.id);
    if (!puntos) return res.status(404).json({ message: 'Puntos de cliente no encontrados' });
    res.json(puntos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los puntos de cliente', error });
  }
};

exports.createPuntosCliente = async (req, res) => {
  try {
    const nuevoPuntos = await PuntosCliente.create(req.body);
    res.status(201).json(nuevoPuntos);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear los puntos de cliente', error });
  }
};

exports.updatePuntosCliente = async (req, res) => {
  try {
    const puntos = await PuntosCliente.findByPk(req.params.id);
    if (!puntos) return res.status(404).json({ message: 'Puntos de cliente no encontrados' });
    await puntos.update(req.body);
    res.json(puntos);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar los puntos de cliente', error });
  }
};

exports.deletePuntosCliente = async (req, res) => {
  try {
    const puntos = await PuntosCliente.findByPk(req.params.id);
    if (!puntos) return res.status(404).json({ message: 'Puntos de cliente no encontrados' });
    await puntos.destroy();
    res.json({ message: 'Puntos de cliente eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar los puntos de cliente', error });
  }
}; 