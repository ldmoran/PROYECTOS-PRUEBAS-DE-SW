const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  autor: String,
  anio: Number,
  ejemplares: { type: Number, default: 1 },
  isbn: { type: String }
});

module.exports = mongoose.model('Libro', LibroSchema);