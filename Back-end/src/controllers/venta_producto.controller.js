const { VentaProducto } = require('../models');

exports.getAllVentasProducto = async (req, res) => {
  try {
    const ventas = await VentaProducto.findAll();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas de productos', error });
  }
};

exports.getVentaProductoById = async (req, res) => {
  try {
    const venta = await VentaProducto.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta de producto no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta de producto', error });
  }
};

exports.createVentaProducto = async (req, res) => {
  try {
    const nuevaVenta = await VentaProducto.create(req.body);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la venta de producto', error });
  }
};

exports.updateVentaProducto = async (req, res) => {
  try {
    const venta = await VentaProducto.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta de producto no encontrada' });
    await venta.update(req.body);
    res.json(venta);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la venta de producto', error });
  }
};

exports.deleteVentaProducto = async (req, res) => {
  try {
    const venta = await VentaProducto.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta de producto no encontrada' });
    await venta.destroy();
    res.json({ message: 'Venta de producto eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta de producto', error });
  }
}; 