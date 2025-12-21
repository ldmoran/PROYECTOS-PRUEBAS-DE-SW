const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cargo: { type: String, required: true },
  salario: { type: Number, required: true },
  fechaContratacion: { type: Date, default: Date.now },
  email: String
});

module.exports = mongoose.model('Empleado', EmpleadoSchema);