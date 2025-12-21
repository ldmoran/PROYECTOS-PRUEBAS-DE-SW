const usuarios = [];
const validMembresias = ['basica', 'premium', 'vip'];

function findById(id) {
  return usuarios.find((u) => String(u.id) === String(id));
}

function list(req, res) {
  res.json(usuarios);
}

function create(req, res) {
  const { nombreCompleto, email, telefono, membresia } = req.body;
  if (!email) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Email es obligatorio', path: req.originalUrl });
  }
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Email inválido', path: req.originalUrl });
  }
  if (usuarios.some((u) => u.email === email)) {
    return res.status(409).json({ timestamp: new Date().toISOString(), status: 409, message: 'El email ya está registrado', path: req.originalUrl });
  }
  if (!nombreCompleto || String(Number(nombreCompleto)) === nombreCompleto) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Nombre inválido', path: req.originalUrl });
  }
  if (!/^[0-9]{10}$/.test(telefono || '')) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Teléfono debe tener 10 dígitos', path: req.originalUrl });
  }
  if (!validMembresias.includes(membresia)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Membresía inválida', path: req.originalUrl });
  }
  const nuevo = { id: Date.now().toString(), nombreCompleto, email, telefono, fechaRegistro: new Date().toISOString(), membresia };
  usuarios.push(nuevo);
  res.status(201).json(nuevo);
}

function getById(req, res) {
  const item = findById(req.params.id);
  if (!item) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Usuario no encontrado', path: req.originalUrl });
  }
  res.json(item);
}

function remove(req, res) {
  const idx = usuarios.findIndex((u) => String(u.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Usuario no encontrado', path: req.originalUrl });
  }
  usuarios.splice(idx, 1);
  res.status(204).end();
}

function update(req, res) {
  const idx = usuarios.findIndex((u) => String(u.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Usuario no encontrado', path: req.originalUrl });
  }
  const { nombreCompleto, email, telefono, membresia } = req.body;
  if (email) {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Email inválido', path: req.originalUrl });
    }
    if (usuarios.some((u, i) => u.email === email && i !== idx)) {
      return res.status(409).json({ timestamp: new Date().toISOString(), status: 409, message: 'El email ya está registrado', path: req.originalUrl });
    }
  }
  if (nombreCompleto && String(Number(nombreCompleto)) === nombreCompleto) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Nombre inválido', path: req.originalUrl });
  }
  if (telefono && !/^[0-9]{10}$/.test(telefono)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Teléfono debe tener 10 dígitos', path: req.originalUrl });
  }
  if (membresia && !validMembresias.includes(membresia)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Membresía inválida', path: req.originalUrl });
  }
  const existing = usuarios[idx];
  usuarios[idx] = Object.assign({}, existing, {
    nombreCompleto: nombreCompleto !== undefined ? nombreCompleto : existing.nombreCompleto,
    email: email !== undefined ? email : existing.email,
    telefono: telefono !== undefined ? telefono : existing.telefono,
    membresia: membresia !== undefined ? membresia : existing.membresia
  });
  res.json(usuarios[idx]);
}

module.exports = { list, create, getById, remove, update, usuarios };