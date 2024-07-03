// routes/pagos.js
const express = require("express");
const router = express.Router();
const Pago = require("../models/Pago");
const Pedido = require("../models/Pedido");
const Usuario = require("../models/Usuario");

// Crear un nuevo pago
router.post("/", async (req, res) => {
  try {
    const {
      idPedido,
      usuarioCliente,
      usuarioPropietario,
      monto,
      metodo,
      estado,
    } = req.body;

    // Validar que el pedido existe
    const pedido = await Pedido.findOne({ idPedido });
    if (!pedido) {
      return res.status(404).send({ error: "Pedido no encontrado" });
    }

    // Verificar si usuarioCliente existe
    const cliente = await Usuario.findOne({ idUsuario: usuarioCliente });
    if (!cliente) {
      return res.status(404).send({ error: "El usuario cliente no existe" });
    }

    // Verificar si usuarioPropietario existe
    const propietario = await Usuario.findOne({
      idUsuario: usuarioPropietario,
    });
    if (!propietario) {
      return res
        .status(404)
        .send({ error: "El usuario propietario no existe" });
    }

    // Crear el pago con los datos recibidos
    const nuevoPago = new Pago({
      idPedido,
      usuarioCliente,
      usuarioPropietario,
      monto,
      metodo,
      estado,
    });

    // Guardar el pago
    await nuevoPago.save();

    // Respuesta exitosa con el pago creado
    res.status(201).send(nuevoPago);
  } catch (error) {
    // Manejar errores de validación o cualquier otro error
    res.status(400).send(error);
  }
});

// Obtener todos los pagos
router.get("/", async (req, res) => {
  try {
    const pagos = await Pago.find({});
    res.status(200).send(pagos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un pago por idPago
router.get("/:idPago", async (req, res) => {
  try {
    const pago = await Pago.findOne({ idPago: req.params.idPago });
    if (!pago) {
      return res.status(404).send({ error: "Pago no encontrado" });
    }
    res.status(200).send(pago);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un pago por idPago
router.patch("/:idPago", async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ["estado", "metodo", "monto"];

  const isValidOperation = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Actualización no permitida" });
  }

  try {
    const pago = await Pago.findOneAndUpdate(
      { idPago: req.params.idPago },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!pago) {
      return res.status(404).send({ error: "Pago no encontrado" });
    }
    res.status(200).send(pago);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un pago por idPago
router.delete("/:idPago", async (req, res) => {
  try {
    const pago = await Pago.findOneAndDelete({ idPago: req.params.idPago });

    if (!pago) {
      return res.status(404).send({ error: "Pago no encontrado" });
    }

    res.status(200).send(pago);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
