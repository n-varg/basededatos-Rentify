const express = require("express");
const router = express.Router();
const Pago = require("../models/Pago");
const Pedido = require("../models/Pedido");
const Usuario = require("../models/Usuario");

const { authMiddleware, authorize } = require("./auth");

// Crear un nuevo pago
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { idPedido, usuarioCliente, usuarioPropietario, monto, metodo } = req.body;

    // Validar que el pedido existe
    const pedido = await Pedido.findById(idPedido);
    if (!pedido) {
      return res.status(404).send({ error: "Pedido no encontrado" });
    }

    // Validar que existe el propietario
    const propietario = await Usuario.findById(usuarioPropietario);
    if (!propietario) {
      return res.status(404).send({ error: "Propietario no encontrado" });
    }

    // Validar que existe el cliente
    const cliente = await Usuario.findById(usuarioCliente);
    if (!cliente) {
      return res.status(404).send({ error: "Cliente no encontrado" });
    }

    const pago = new Pago({
      idPedido,
      usuarioCliente,
      usuarioPropietario,
      monto,
      metodo,
    });

    await pago.save();
    res.status(201).send(pago);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Obtener todos los pagos
router.get("/", authMiddleware, authorize("admin"), async (req, res) => {
  try {
    const pagos = await Pago.find({});
    res.status(200).send(pagos);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Obtener un pago por idPago
router.get("/:idPago", authMiddleware, async (req, res) => {
  try {
    const pago = await Pago.findOne({ idPago: req.params.idPago });
    if (!pago) {
      return res.status(404).send({ error: "Pago no encontrado" });
    }
    res.status(200).send(pago);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Actualizar un pago por idPago
router.patch("/:idPago", authMiddleware, async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ["estado"];

  const isValidOperation = Object.keys(updates).every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Actualización no permitida" });
  }

  try {
    const pago = await Pago.findOne({ idPago: req.params.idPago });

    if (!pago) {
      return res.status(404).send({ error: "Pago no encontrado" });
    }

    Object.keys(updates).forEach(key => {
      pago[key] = updates[key];
    });

    await pago.save();
    res.status(200).send(pago);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Eliminar un pago por idPago
router.delete("/:idPago", authMiddleware, authorize("admin"), async (req, res) => {
  try {
    const pago = await Pago.findOneAndDelete({ idPago: req.params.idPago });

    if (!pago) {
      return res.status(404).send({ error: "Pago no encontrado" });
    }

    res.status(200).send(pago);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
