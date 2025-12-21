const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombreEmpresa: { type: String, required: true },
  ruc: { type: String, required: true },
  contacto: String,
  telefono: String,
  email: String,
  direccion: String
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);