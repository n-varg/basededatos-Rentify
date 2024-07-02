// routes/auth.js
const express = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

const router = express.Router();
const secretKey = "rentifyllavesecreta123";

// Registro de usuario
router.post("/registrar", async (req, res) => {
  try {
    const {email, password, rol } = req.body;
    const usuario = new Usuario({ email, password, rol });
    await usuario.save();
    const token = generateToken(usuario);
    res.status(201).send({ usuario, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !await bcrypt.compare(password, usuario.password)) {
      return res.status(400).send({ error: "Credenciales inválidas" });
    }

    const token = generateToken(usuario);
    res.send({ usuario, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Middleware de autenticación
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: "Autenticación fallida." });
  }
}

// Middleware de autorización
function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: "Acceso denegado: no tienes permiso para realizar esta acción." });
    }
    next();
  };
}

module.exports = { router, authMiddleware, authorize };
