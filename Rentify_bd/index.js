// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productosRoutes = require("./routes/productos");
const pedidosRoutes = require("./routes/pedidos");
const pagosRoutes = require("./routes/pagos");
const deliveryRoutes = require("./routes/deliverys");
const session = require("express-session");

const { router: authRoutes } = require("./routes/auth");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // URL de tu frontend
  credentials: true, // Permitir el envío de credenciales
};

// Middleware para parsear JSON y permitir CORS
app.use(express.json());
app.use(cors(corsOptions));

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/rentify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// Configuración de express-session
app.use(
  session({
    secret: "rentifySesionSecreta123", // Secreto para firmar la sesión, guárdalo de manera segura
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true si usas HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la sesión en milisegundos (1 día)
    },
  })
);

// Usar las rutas de productos
app.use("/productos", productosRoutes);
// Usar las rutas de autenticación
app.use("/auth", authRoutes);
// Usar las rutas de autenticación
app.use("/pedidos", pedidosRoutes);
// Usar las rutas de autenticación
app.use("/pagos", pagosRoutes);
// Usar las rutas de delivery
app.use("/delivery", deliveryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
