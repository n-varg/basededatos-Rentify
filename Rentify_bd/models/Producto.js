// models/Producto.js
const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  idProducto: {
    type: String,
    index: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "Electrónica",
      "Muebles",
      "Vehículos",
      "Ropa",
      "Herramientas",
      "Juguetes",
      "Deportes",
      "Otros",
    ],
  },
  precioPorDia: {
    type: Number,
    required: true,
    min: 0,
  },
  disponibilidad: {
    type: Boolean,
    default: true,
  },
  imagenes: [
    {
      type: String,
    },
  ],
  propietario: {
    type: String,
    required: true,
  },
  provincia: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "Bocas del Toro",
      "Coclé",
      "Colón",
      "Chiriquí",
      "Darién",
      "Herrera",
      "Los Santos",
      "Panamá",
      "Veraguas",
      "Panamá Oeste",
      "Emberá",
      "Kuna Yala",
      "Ngäbe-Buglé",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  calificacionPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reseñas: [
    {
      usuario: {
        type: String,
        required: true,
      },
      comentario: {
        type: String,
        trim: true,
      },
      calificacion: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};*/

// Middleware para actualizar updatedAt antes de guardar
productoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para actualizar updatedAt antes de actualizar
productoSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

// Define a pre-save hook on the productoSchema to generate a idPropietario if not already set
productoSchema.pre("save", function (next) {
  if (!this.idProducto) {
    // Call the generarId function to generate a custom ID
    this.idProducto = generarId();
  }
  next();
});

// Function to generate a custom ID
function generarId() {
  // Placeholder logic to generate a custom ID
  return "PRODUCTO_" + Math.floor(Math.random() * 100000);
}

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
