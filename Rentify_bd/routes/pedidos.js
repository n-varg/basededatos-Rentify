// routes/pedidos.js

const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");

const { authMiddleware, authorize } = require("./auth");

// Crear un nuevo pedido
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productos, usuarioCliente, usuarioPropietario } = req.body;

    // Validar que todos los productos existen
    for (let i = 0; i < productos.length; i++) {
      const producto = await Producto.findOne({
        idProducto: productos[i].idProducto,
      });
      if (!producto) {
        return res.status(404).send({
          error: `Producto con idProducto ${productos[i].idProducto} no encontrado`,
        });
      }
    }

    // Valida que existe el propietario
    const propietario = await Usuario.findOne({
      idUsuario: usuarioPropietario,
    });
    if (!propietario) {
      return res.status(404).send({ error: "Propietario no encontrado" });
    }

    // Valida que existe el cliente
    const cliente = await Usuario.findOne({ idUsuario: usuarioCliente });
    if (!cliente) {
      return res.status(404).send({ error: "Usuario cliente no encontrado" });
    }

    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).send(pedido);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los pedidos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const pedidos = await Pedido.find({});
    res.status(200).send(pedidos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un pedido por idPedido
router.get("/:idPedido", authMiddleware, async (req, res) => {
  try {
    const pedido = await Pedido.findOne({ idPedido: req.params.idPedido });
    if (!pedido) {
      return res.status(404).send({ error: "Pedido no encontrado" });
    }
    res.status(200).send(pedido);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un pedido por idPedido
router.patch("/:idPedido", async (req, res) => {
  const updates = req.body;
  const allowedUpdates = [
    "productos",
    "fechaInicio",
    "fechaFin",
    "total",
    "estado",
    "direccionEntrega",
    "metodoPago",
    "notas",
    "aceptaPedido",
  ];

  const isValidOperation = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Actualización no permitida" });
  }

  try {
    const updateData = {};
    Object.keys(updates).forEach((key) => {
      if (key === "direccionEntrega") {
        // Actualizar solo el campo específico dentro de direccionEntrega
        Object.keys(updates.direccionEntrega).forEach((subKey) => {
          updateData[`direccionEntrega.${subKey}`] =
            updates.direccionEntrega[subKey];
        });
      } else {
        updateData[key] = updates[key];
      }
    });

    const pedido = await Pedido.findOneAndUpdate(
      { idPedido: req.params.idPedido },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      return res.status(404).send({ error: "Pedido no encontrado" });
    }

    res.status(200).send(pedido);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Eliminar un pedido por idPedido
router.delete("/:idPedido", authMiddleware, async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndDelete({
      idPedido: req.params.idPedido,
    });

    if (!pedido) {
      return res.status(404).send({ error: "Pedido no encontrado" });
    }

    res.status(200).send(pedido);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
