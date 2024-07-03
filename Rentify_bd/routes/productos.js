const express = require("express");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const { authMiddleware, authorize } = require("./auth");

const router = express.Router();

// Ruta para agregar un nuevo producto
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      precioPorDia,
      disponibilidad,
      propietario,
    } = req.body;

    // Verificar si el propietario (idUsuario) existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ idUsuario: propietario });
    if (!usuarioExistente) {
      return res
        .status(404)
        .json({ error: "El propietario especificado no existe" });
    }

    // Verificar que el propietario coincida con el usuario autenticado
    if (propietario !== req.user.idUsuario) {
      return res.status(403).json({
        error: "No tienes permiso para agregar productos para otro propietario",
      });
    }

    // Crear el nuevo producto
    const producto = new Producto({
      nombre,
      descripcion,
      categoria,
      precioPorDia,
      disponibilidad,
      propietario,
    });

    // Guardar el producto en la base de datos
    await producto.save();

    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().populate(
      "propietario",
      "nombre email"
    );
    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate(
      "propietario",
      "nombre email"
    );
    if (!producto) {
      return res.status(404).send();
    }
    res.status(200).send(producto);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un producto por ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send();
    }
    if (producto.propietario.toString() !== req.user.idUsuario) {
      return res
        .status(403)
        .send({ error: "No tienes permiso para actualizar este producto." });
    }
    Object.keys(req.body).forEach((key) => (producto[key] = req.body[key]));
    await producto.save();
    res.status(200).send(producto);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un producto por idProducto
router.delete("/:idProducto", authMiddleware, async (req, res) => {
  try {
    // Encuentra el producto por su idProducto
    const producto = await Producto.findOne({ idProducto: req.params.idProducto });
    if (!producto) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }
    // Verifica si el propietario del producto es el usuario autenticado
    if (producto.propietario.toString() !== req.user.idUsuario) {
      return res.status(403).send({ error: "No tienes permiso para eliminar este producto." });
    }
    // Elimina el producto
    await Producto.findOneAndDelete({ idProducto: req.params.idProducto });
    res.status(200).send(producto);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
