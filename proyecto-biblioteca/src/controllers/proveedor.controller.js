const proveedores = [];

function findById(id) {
  return proveedores.find((p) => String(p.id) === String(id));
}

function list(req, res) {
  res.json(proveedores);
}

function create(req, res) {
  const { nombreEmpresa, ruc, contacto, telefono, email, direccion } = req.body;
  if (!ruc) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'RUC es obligatorio', path: req.originalUrl });
  }
  if (!/^[0-9]{13}$/.test(ruc)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'RUC inválido', path: req.originalUrl });
  }
  if (proveedores.some((p) => p.ruc === ruc)) {
    return res.status(409).json({ timestamp: new Date().toISOString(), status: 409, message: 'El RUC ya está registrado', path: req.originalUrl });
  }
  if (!nombreEmpresa || String(Number(nombreEmpresa)) === nombreEmpresa) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Nombre de empresa inválido', path: req.originalUrl });
  }
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Email inválido', path: req.originalUrl });
  }
  if (!/^[0-9]{10}$/.test(telefono || '')) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Teléfono debe tener 10 dígitos', path: req.originalUrl });
  }
  const nuevo = { id: Date.now().toString(), nombreEmpresa, ruc, contacto, telefono, email, direccion };
  proveedores.push(nuevo);
  res.status(201).json(nuevo);
}

function getById(req, res) {
  const item = findById(req.params.id);
  if (!item) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Proveedor no encontrado', path: req.originalUrl });
  }
  res.json(item);
}

function remove(req, res) {
  const idx = proveedores.findIndex((p) => String(p.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Proveedor no encontrado', path: req.originalUrl });
  }
  proveedores.splice(idx, 1);
  res.status(204).end();
}



module.exports = { list, create, getById, remove, update, proveedores };
