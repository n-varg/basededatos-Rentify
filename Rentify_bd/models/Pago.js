const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  idPago: {
    type: String,
    required: true,
    unique: true,
  },
  idPedido: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Pedido",
  },
  usuarioCliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  usuarioPropietario: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
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
    this.idPago = generarIdPago();
  }
  next();
});

// Función para generar un ID personalizado para pagos
function generarIdPago() {
  return "PAGO_" + Math.floor(Math.random() * 100000);
}

const Pago = mongoose.model("Pago", pagoSchema);

module.exports = Pago;
