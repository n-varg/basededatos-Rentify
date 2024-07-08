const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  idDelivery: {
    type: String,
    unique: true,
    index: true,
  },
  idPedido: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["En camino", "Entregado", "Pendiente"],
    default: "Pendiente",
    required: true,
  },
  fechaEntrega: {
    type: Date,
    required: true,
  },
  detalles: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar updatedAt antes de guardar
deliverySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para generar idDelivery antes de guardar
deliverySchema.pre("save", function (next) {
  if (!this.idDelivery) {
    this.idDelivery = generarId();
  }
  next();
});

// Función para generar un ID personalizado
function generarId() {
  return "DELIVERY_" + Math.floor(Math.random() * 100000);
}

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
