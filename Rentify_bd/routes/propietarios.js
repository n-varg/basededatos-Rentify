// routes/propietarios.js
const express = require("express");
const Propietario = require("../models/Propietario");
const { authMiddleware, authorize } = require("./auth");
const router = express.Router();


// Crear un nuevo propietario
router.post("/", async (req, res) => {
  try {
    const nuevoPropietario = new Propietario(req.body);
    await nuevoPropietario.save();
    res.status(201).send(nuevoPropietario);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los propietarios
router.get("/", async (req, res) => {
  try {
    const propietario = await Propietario.find();
    res.status(200).send(propietario);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un propietario por ID
router.get("/:idPropietario", async (req, res) => {
  try {
    const propietario = await Propietario.findOne({ idPropietario: req.params.idPropietario });
    if (!propietario) {
      return res.status(404).send();
    }
    res.status(200).send(propietario);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Actualizar un propietario por ID
router.patch("/:idPropietario", async (req, res) => {
  try {
    const propietarioActualizado = await Propietario.findOneAndUpdate(
      { idPropietario: req.params.idPropietario },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!propietarioActualizado) {
      return res.status(404).send();
    }
    res.status(200).send(propietarioActualizado);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un propietario por idPropietario en el cuerpo de la solicitud
router.delete("/delete", authMiddleware, authorize("admin"), async (req, res) => {
  const { idPropietario } = req.body;
  try {
    const propietarioEliminado = await Propietario.findOneAndDelete({
      idPropietario: idPropietario
    });
    if (!propietarioEliminado) {
      return res.status(404).send();
    }
    res.status(200).send(propietarioEliminado);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
