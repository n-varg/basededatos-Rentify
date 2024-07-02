// models/Propietario.js
const mongoose = require("mongoose");
const validator = require("validator");

// Definición del esquema del propietario
const propietarioSchema = new mongoose.Schema(
  {
    idPropietario: {
      type: String,
      index: true,
      unique: true,
    },
    nombrePropietario: {
      type: String,
      required: true,
    },
    apellidoPropietario: {
      type: String,
      required: true,
    },
    emailPropietario: {
      type: String,
      required: true,
      validate: {
        validator: validator.isEmail,
        message: "Email con formato inválido",
      },
    },
    telefonoPropietario: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.matches(v, /^(\+507) \d{4}-\d{4}$/);
        },
        message: "Teléfono inválido (debe ser en formato de Panamá: +507 1234-5678)",
      },
    },
    direccionPropietario: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Define a pre-save hook on the propietarioSchema to generate a idPropietario if not already set
propietarioSchema.pre("save", function (next) {
  if (!this.idPropietario) {
    // Call the generarId function to generate a custom ID
    this.idPropietario = generarId();
  }
  next();
});

// Function to generate a custom ID
function generarId() {
  // Placeholder logic to generate a custom ID
  return "PROP-" + Math.floor(Math.random() * 10000);
}

// Creación del modelo de propietario
const Propietario = mongoose.model("Propietario", propietarioSchema);
module.exports = Propietario;
