// routes/usuarios.js
const express = require("express");
const Producto = require("../models/Producto");
const router = express.Router();

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  try {
    await nuevoProducto.save();
    res.status(201).send(nuevoProducto);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Producto.find();
    res.status(200).send(usuarios);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Producto.findById(req.params.id);
    if (!usuario) {
      return res.status(404).send();
    }
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un usuario por ID
router.patch("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!usuarioActualizado) {
      return res.status(404).send();
    }
    res.status(200).send(usuarioActualizado);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).send();
    }
    res.status(200).send(usuarioEliminado);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
