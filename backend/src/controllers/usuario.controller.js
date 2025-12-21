const Usuario = require('../models/usuario.model');

// Listar usuarios
async function list(req, res) {
  try {
    const usuarios = await Usuario.find();
    const adaptados = usuarios.map(u => ({
      id: u._id,
      nombreCompleto: u.nombre,
      email: u.email,
      telefono: u.telefono,
      membresia: u.membresia
    }));
    res.json(adaptados);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
}

// Obtener usuario por ID
async function getById(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({
      id: usuario._id,
      nombreCompleto: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      membresia: usuario.membresia
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
}

// Actualizar usuario
async function update(req, res) {
  try {
    const { nombreCompleto, email, telefono, membresia } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (nombreCompleto !== undefined) usuario.nombre = nombreCompleto;
    if (email !== undefined) usuario.email = email;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (membresia !== undefined) usuario.membresia = membresia;
    await usuario.save();
    res.json({
      id: usuario._id,
      nombreCompleto: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      membresia: usuario.membresia
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
}

module.exports = { list, getById };