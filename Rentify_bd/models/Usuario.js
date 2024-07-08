// models/Usuario.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const usuarioSchema = new mongoose.Schema(
  {
    idUsuario: {
      type: String,
      index: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: require("validator").isEmail,
        message: "Email con formato inválido",
      },
    },
    telefono: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.matches(v, /^(\+507) \d{4}-\d{4}$/);
        },
        message:
          "Teléfono inválido (debe ser en formato de Panamá: +507 1234-5678)",
      },
    },
    direccion: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["admin", "user"],
      default:"user"
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

usuarioSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Define a pre-save hook on the usuarioSchema to generate a idPropietario if not already set
usuarioSchema.pre("save", function (next) {
  if (!this.idUsuario) {
    // Call the generarId function to generate a custom ID
    this.idUsuario = generarId();
  }
  next();
});

// Function to generate a custom ID
function generarId() {
  // Placeholder logic to generate a custom ID
  return "USER_" + Math.floor(Math.random() * 10000);
}

const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
