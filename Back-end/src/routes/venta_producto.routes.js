const express = require('express');
const router = express.Router();
const ventaProductoController = require('../controllers/venta_producto.controller');

router.get('/', ventaProductoController.getAllVentasProducto);
router.get('/:id', ventaProductoController.getVentaProductoById);
router.post('/', ventaProductoController.createVentaProducto);
router.put('/:id', ventaProductoController.updateVentaProducto);
router.delete('/:id', ventaProductoController.deleteVentaProducto);

module.exports = router; 