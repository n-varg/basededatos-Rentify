// routes/productos.js
const express = require("express");
const Producto = require("../models/Producto");
const router = express.Router();

// Crear un nuevo producto
router.post("/", async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  try {
    await nuevoProducto.save();
    res.status(201).send(nuevoProducto);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send();
    }
    res.status(200).send(producto);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un producto por ID
router.patch("/:id", async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!productoActualizado) {
      return res.status(404).send();
    }
    res.status(200).send(productoActualizado);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).send();
    }
    res.status(200).send(productoEliminado);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
