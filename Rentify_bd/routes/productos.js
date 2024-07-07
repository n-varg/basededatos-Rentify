const express = require("express");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const { authMiddleware, authorize } = require("./auth");

const router = express.Router();

//Agregar al router pos authMiddleware,

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
  console.log('POST /productos called');
  console.log('Request body:', req.body);
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

// Obtener productos por nombre de categoría
router.get("/categoria/:nombreCategoria", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: req.params.nombreCategoria });
    
    if (productos.length === 0) {
      return res.status(404).send({ error: "No se encontraron productos para esta categoría" });
    }

    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener productos por nombre
router.get("/buscar/:nombreProducto", async (req, res) => {
  try {
    const regex = new RegExp(req.params.nombreProducto, 'i'); 
    const productos = await Producto.find({ nombre: { $regex: regex } });

    if (productos.length === 0) {
      return res.status(404).send({ error: "No se encontraron productos con ese nombre" });
    }

    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener productos por rango de precio
router.get("/precio/:min/:max", async (req, res) => {
  const { min, max } = req.params;

  try {
    const productos = await Producto.find({
      precioPorDia: { $gte: min, $lte: max }
    });

    if (productos.length === 0) {
      return res.status(404).send({ error: "No se encontraron productos en ese rango de precio" });
    }

    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener productos por rango de precio y nombre
router.get("/precio/:min/:max/:nombreProducto", async (req, res) => {
  const { min, max, nombreProducto } = req.params;

  try {
    const regex = new RegExp(nombreProducto, 'i');
    const productos = await Producto.find({
      precioPorDia: { $gte: min, $lte: max },
      nombre: { $regex: regex }
    });

    if (productos.length === 0) {
      return res.status(404).send({ error: "No se encontraron productos con esas características" });
    }

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

// Obtener productos por propietario
router.get("/propietario/:idPropietario", async (req, res) => {
  const { idPropietario } = req.params;

  try {
    const productos = await Producto.find({ propietario: idPropietario });

    if (productos.length === 0) {
      return res.status(404).send({ error: "No se encontraron productos para este propietario" });
    }

    res.status(200).send(productos);
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
