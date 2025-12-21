const Proveedor = require('../models/proveedor.model');

// Listar proveedores
async function list(req, res) {
  try {
    const proveedores = await Proveedor.find();
    const adaptados = proveedores.map(p => ({
      id: p._id,
      nombreEmpresa: p.nombreEmpresa,
      ruc: p.ruc,
      contacto: p.contacto,
      telefono: p.telefono,
      email: p.email,
      direccion: p.direccion
    }));
    res.json(adaptados);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener proveedores', error: err.message });
  }
}

// Crear proveedor
async function create(req, res) {
  try {
    const { nombreEmpresa, ruc, contacto, telefono, email, direccion } = req.body;
    if (!nombreEmpresa) {
      return res.status(400).json({ message: 'El nombre de empresa es obligatorio' });
    }
    if (!ruc) {
      return res.status(400).json({ message: 'El RUC es obligatorio' });
    }
    const existe = await Proveedor.findOne({ ruc });
    if (existe) return res.status(409).json({ message: 'El proveedor ya existe' });
    const proveedor = await Proveedor.create({ nombreEmpresa, ruc, contacto, telefono, email, direccion });
    res.status(201).json(proveedor);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear proveedor', error: err.message });
  }
}

// Obtener proveedor por ID
async function getById(req, res) {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({
      id: proveedor._id,
      nombreEmpresa: proveedor.nombreEmpresa,
      ruc: proveedor.ruc,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener proveedor', error: err.message });
  }
}

// Eliminar proveedor
async function remove(req, res) {
  try {
    const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar proveedor', error: err.message });
  }
}

// Actualizar proveedor
async function update(req, res) {
  try {
    const { nombreEmpresa, ruc, contacto, telefono, email, direccion } = req.body;
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    if (nombreEmpresa !== undefined) proveedor.nombreEmpresa = nombreEmpresa;
    if (ruc !== undefined) proveedor.ruc = ruc;
    if (contacto !== undefined) proveedor.contacto = contacto;
    if (telefono !== undefined) proveedor.telefono = telefono;
    if (email !== undefined) proveedor.email = email;
    if (direccion !== undefined) proveedor.direccion = direccion;
    await proveedor.save();
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar proveedor', error: err.message });
  }
}

module.exports = { list, create, getById, remove, update };
