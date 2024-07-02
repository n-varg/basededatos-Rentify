// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productosRoutes = require("./routes/productos");
const pedidosRoutes = require("./routes/pedidos");

const { router: authRoutes } = require("./routes/auth");


const app = express();

// Middleware para parsear JSON y permitir CORS
app.use(express.json());
app.use(cors());

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



// Usar las rutas de productos
app.use("/productos", productosRoutes);
// Usar las rutas de autenticación
app.use("/auth", authRoutes);
// Usar las rutas de autenticación
app.use("/pedidos", pedidosRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
