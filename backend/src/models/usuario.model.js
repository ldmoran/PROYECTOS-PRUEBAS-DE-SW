const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nombre: String,
  email: { type: String, required: true, unique: true },
  telefono: String,
  membresia: String,
  password: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);