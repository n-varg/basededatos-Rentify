// models/Producto.js
const mongoose = require("mongoose");
const { type } = require("os");
// Definición del esquema del producto
const productSchema = new mongoose.Schema(
  {
    idProducto: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    // idPropietario: {
    //   // type: mongoose.Schema.Types.ObjectId,
    //   // ref: "Propietario",
    //   // required: true,
    // },
    nombreProducto: {
      type: String,
      required: true,
    },
    descripcionProducto: {
      type: String,
      required: true,
    },
    categoriaProducto: {
      type: String,
      required: true,
    },
    precioProducto: {
      type: Number,
      required: true,
    },
    existenciaProducto: {
      type: Boolean,
      required: true,
      default: true,
    },
    fechaPublicacionProducto: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Creación del modelo de producto
const Producto = mongoose.model("Producto", productSchema);
module.exports = Producto;
