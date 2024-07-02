const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido'); 
const { authMiddleware, authorize } = require("./auth");

// Crear un nuevo pedido
router.post('/',authMiddleware, async (req, res) => {
  try {
    const { productos } = req.body;

    // Validar que todos los productos existen
    for (let i = 0; i < productos.length; i++) {
      const producto = await Producto.findOne({ idProducto: productos[i].idProducto });
      if (!producto) {
        return res.status(404).send({ error: `Producto con idProducto ${productos[i].idProducto} no encontrado` });
      }
    }

    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).send(pedido);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los pedidos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pedidos = await Pedido.find({});
    res.status(200).send(pedidos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un pedido por idPedido
router.get('/:idPedido', authMiddleware, async (req, res) => {
  try {
    const pedido = await Pedido.findOne({ idPedido: req.params.idPedido });
    if (!pedido) {
      return res.status(404).send({ error: 'Pedido no encontrado' });
    }
    res.status(200).send(pedido);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un pedido por idPedido
router.patch('/:idPedido', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['productos', 'fechaInicio', 'fechaFin', 'total', 'estado', 'direccionEntrega', 'metodoPago', 'notas'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Actualización no permitida' });
  }

  try {
    const pedido = await Pedido.findOne({ idPedido: req.params.idPedido });

    if (!pedido) {
      return res.status(404).send({ error: 'Pedido no encontrado' });
    }

    updates.forEach((update) => (pedido[update] = req.body[update]));
    await pedido.save();

    res.status(200).send(pedido);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un pedido por idPedido
router.delete('/:idPedido', authMiddleware, async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndDelete({ idPedido: req.params.idPedido });

    if (!pedido) {
      return res.status(404).send({ error: 'Pedido no encontrado' });
    }

    res.status(200).send(pedido);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
