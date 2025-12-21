const mongoose = require('mongoose');

const PrestamoSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  libros: [{ type: String, required: true }],
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prestamo', PrestamoSchema);