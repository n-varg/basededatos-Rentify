// models/Usuario.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
    idUsuario: {
        type: String,
        index: true,
        unique: true,
      },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: require("validator").isEmail,
      message: "Email con formato inválido",
    },
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
}, {
  versionKey: false,
  timestamps: true,
});

usuarioSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Define a pre-save hook on the propietarioSchema to generate a idPropietario if not already set
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