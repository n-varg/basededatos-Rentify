// models/Pedido.js
const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  idPedido: {
    type: String,
    index: true,
    unique: true,
  },
  productos: [
    {
      idProducto: {
        type: String,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  usuarioCliente: {
    type: String,
    required: true,
  },
  usuarioPropietario: {
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
        "Comarca Guna Yala (anteriormente conocida como San Blas)",
        "Comarca Emberá-Wounaan",
        "Comarca Ngäbe-Buglé",
      ],
    },
    Calle: {
      type: String,
    },
    Destino: {
      type: String,
    },
  },
  metodoPago: {
    type: String,
    required: true,
    enum: [
      "Tarjeta de Crédito",
      "PayPal",
      "Transferencia Bancaria",
      "Efectivo",
      "Yappy",
    ],
  },
  notas: {
    type: String,
  },
  aceptaPedido: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar updatedAt antes de guardar
pedidoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para actualizar updatedAt antes de actualizar
pedidoSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

// Middleware para generar idPedido antes de guardar
pedidoSchema.pre("save", function (next) {
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
