const { MetodoPago } = require('../models');

exports.getAllMetodosPago = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll();
    res.json(metodos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los métodos de pago', error });
  }
};

exports.getMetodoPagoById = async (req, res) => {
  try {
    const metodo = await MetodoPago.findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ message: 'Método de pago no encontrado' });
    res.json(metodo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el método de pago', error });
  }
};

exports.createMetodoPago = async (req, res) => {
  try {
    const nuevoMetodo = await MetodoPago.create(req.body);
    res.status(201).json(nuevoMetodo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el método de pago', error });
  }
};

exports.updateMetodoPago = async (req, res) => {
  try {
    const metodo = await MetodoPago.findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ message: 'Método de pago no encontrado' });
    await metodo.update(req.body);
    res.json(metodo);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el método de pago', error });
  }
};

exports.deleteMetodoPago = async (req, res) => {
  try {
    const metodo = await MetodoPago.findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ message: 'Método de pago no encontrado' });
    await metodo.destroy();
    res.json({ message: 'Método de pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el método de pago', error });
  }
}; 