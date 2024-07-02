// models/Pedido.js
const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  idPedido: {
    type: String,
    index: true,
    unique: true,
  },
  productos: [{
    idProducto: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  usuario: {
    type: String,
    required: true,
  },
  fechaPedido: {
    type: Date,
    default: Date.now,
  },
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  estado: {
    type: String,
    required: true,
    enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
    default: "Pendiente",
  },
  direccionEntrega: {
    Provincia: {
      type: String,
      required: true,
      trim: true,
    },
    Distrito: {
      type: String,
      required: true,
      trim: true,
    },
    Corregimiento: {
      type: String,
      required: true,
      trim: true,
    },
    Calle: {
      type: String,
      required: true,
      trim: true,
    },
    Destino: {
      type: String,
      required: true,
    },
  },
  metodoPago: {
    type: String,
    required: true,
    enum: ["Tarjeta de Crédito", "PayPal", "Transferencia Bancaria", "Efectivo", "Yappy"],
  },
  notas: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware para actualizar updatedAt antes de guardar
pedidoSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para actualizar updatedAt antes de actualizar
pedidoSchema.pre("findOneAndUpdate", function(next) {
  this._update.updatedAt = Date.now();
  next();
});

// Middleware para generar idPedido antes de guardar
pedidoSchema.pre("save", function(next) {
  if (!this.idPedido) {
    this.idPedido = generarId();
  }
  next();
});

// Función para generar un ID personalizado
function generarId() {
  return "PEDIDO_" + Math.floor(Math.random() * 100000);
}

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;
