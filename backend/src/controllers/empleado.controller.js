const Empleado = require('../models/empleado.model');

// Listar empleados
async function list(req, res) {
  try {
    const empleados = await Empleado.find();
    const adaptados = empleados.map(e => ({
      id: e._id,
      nombre: e.nombre,
      cargo: e.cargo,
      salario: e.salario,
      fechaContratacion: e.fechaContratacion,
      email: e.email
    }));
    res.json(adaptados);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener empleados', error: err.message });
  }
}

// Crear empleado
async function create(req, res) {
  try {
    const { nombre, cargo, salario, fechaContratacion, email } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }
    if (!cargo) {
      return res.status(400).json({ message: 'El cargo es obligatorio' });
    }
    if (typeof salario !== 'number' || salario <= 0) {
      return res.status(400).json({ message: 'El salario debe ser un número positivo' });
    }
    const existe = await Empleado.findOne({ nombre });
    if (existe) return res.status(409).json({ message: 'El empleado ya existe' });
    const empleado = await Empleado.create({ nombre, cargo, salario, fechaContratacion, email });
    res.status(201).json(empleado);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear empleado', error: err.message });
  }
}

// Obtener empleado por ID
async function getById(req, res) {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.json({
      id: empleado._id,
      nombre: empleado.nombre,
      cargo: empleado.cargo,
      salario: empleado.salario,
      fechaContratacion: empleado.fechaContratacion,
      email: empleado.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener empleado', error: err.message });
  }
}

// Eliminar empleado
async function remove(req, res) {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar empleado', error: err.message });
  }
}

// Actualizar empleado
async function update(req, res) {
  try {
    const { nombre, cargo, salario, fechaContratacion, email } = req.body;
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    if (nombre !== undefined) empleado.nombre = nombre;
    if (cargo !== undefined) empleado.cargo = cargo;
    if (salario !== undefined) empleado.salario = salario;
    if (fechaContratacion !== undefined) empleado.fechaContratacion = fechaContratacion;
    if (email !== undefined) empleado.email = email;
    await empleado.save();
    res.json(empleado);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar empleado', error: err.message });
  }
}

module.exports = { list, create, getById, remove, update };
