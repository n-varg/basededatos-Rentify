const express = require("express");
const Delivery = require("../models/Delivery");

const router = express.Router();

// Crear una nueva entrega
router.post("/", async (req, res) => {
  try {
    const {
      idPedido,
      estado,
      fechaEntrega,
      detalles
    } = req.body;

    // Crear la nueva entrega
    const entrega = new Delivery({
      idPedido,
      estado,
      fechaEntrega,
      detalles
    });

    // Guardar la entrega en la base de datos
    await entrega.save();

    res.status(201).json(entrega);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los delivery
router.get("/", async (req, res) => {
  try {
    const deliverys = await Delivery.find();
    res.status(200).json(deliverys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una delivery por idDelivery
router.get("/:idDelivery", async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.idDelivery);
    if (!delivery) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una delivery por idDelivery
router.patch("/:idDelivery", async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ["estado", "fechaEntrega", "detalles"];

  const isValidOperation = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Actualización no permitida" });
  }

  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.idDelivery, updates, {
      new: true,
      runValidators: true,
    });

    if (!delivery) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un delivery por idDelivery
router.delete("/:idDelivery", async (req, res) => {
  try {
    const entrega = await Delivery.findByIdAndDelete(req.params.idDelivery);
    if (!entrega) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }
    res.status(200).json(entrega);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
