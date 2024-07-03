// models/Pago.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const pagoSchema = new Schema({
  idPago: {
    type: String,
    unique: true,
    index:true
  },
  idPedido: {
    type: String,
    required: true,
  },
  usuarioCliente: {
    type: String,
    required: true,
  },
  usuarioPropietario: {
    type: String,
    required: true,
  },
  fechaPago: {
    type: Date,
    default: Date.now,
  },
  monto: {
    type: Number,
    required: true,
    min: 0,
  },
  metodo: {
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
  estado: {
    type: String,
    required: true,
    enum: ["Pendiente", "Completado", "Fallido"],
    default: "Pendiente",
  },
});

  // Middleware para generar idPago antes de guardar
  pagoSchema.pre("save", function (next) {
    if (!this.idPago) {
      this.idPago = generarId();

    }
    next();
  });

  // Función para generar un ID personalizado
function generarId() {
    return "PAGO_" + Math.floor(Math.random() * 100000);
  }

  

const Pago = mongoose.model("Pago", pagoSchema);
module.exports = Pago;
