// routes/auth.js
const express = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const secretKey = "rentifyllavesecreta123";

// Función para generar token JWT
function generateToken(usuario) {
  return jwt.sign(
    { idUsuario: usuario.idUsuario, rol: usuario.rol },
    secretKey,
    { expiresIn: "3h" }
  );
}

// Registro de usuario
router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const usuario = new Usuario(req.body);
    await usuario.save();
    const token = generateToken(usuario);
    res.status(201).send({ usuario, token });
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(400).send({ error: "Credenciales inválidas" });
    }

    
    const token = generateToken(usuario);
    res.send({ usuario, token });
    req.session.token = token; //se guarda el token en la sesion
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const usuario = await Usuario.find();
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un usuario por ID
router.get("/:idUsuario", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ idUsuario: req.params.idUsuario });
    if (!usuario) {
      return res.status(404).send();
    }
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un usuario por ID
router.patch("/:idUsuario", async (req, res) => {
  try {
    const usuarioUpdated = await Usuario.findOneAndUpdate(
      { idUsuario: req.params.idUsuario },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!usuarioUpdated) {
      return res.status(404).send();
    }
    res.status(200).send(usuarioUpdated);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un usuario por idUsuario en el cuerpo de la solicitud
router.delete("/:idUsuario",authMiddleware,authorize("admin"),async (req, res) => {
    try {
      const usuarioEliminado = await Usuario.findOneAndDelete({
        idUsuario: req.params.idUsuario,
      });
      if (!usuarioEliminado) {
        return res.status(404).send();
      }
      res.status(200).send(usuarioEliminado);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// Middleware de autenticación
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .send({ error: "Acceso denegado. Token no proporcionado." });
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
      return res.status(403).json({
        message:
          "Acceso denegado: no tienes permiso para realizar esta acción.",
      });
    }
    next();
  };
}

module.exports = { router, authMiddleware, authorize };
