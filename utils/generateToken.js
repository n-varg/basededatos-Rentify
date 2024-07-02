// utils/generateToken.js
const jwt = require("jsonwebtoken");
const secretKey = "rentifyllavesecreta123";

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email, rol: user.rol }, secretKey, {
    expiresIn: "1h",
  });
}

module.exports = generateToken;
