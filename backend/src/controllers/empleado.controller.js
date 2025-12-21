const validCargos = ['bibliotecario', 'administrador', 'auxiliar'];
const empleados = [];

function findById(id) {
  return empleados.find((e) => String(e.id) === String(id));
}

function list(req, res) {
  res.json(empleados);
}

function create(req, res) {
  const { nombre, cargo, salario, fechaContratacion } = req.body;
  if (!nombre || String(Number(nombre)) === nombre) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'El nombre no puede ser vacío ni número', path: req.originalUrl });
  }
  if (!validCargos.includes(cargo)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Cargo inválido', path: req.originalUrl });
  }
  if (typeof salario !== 'number' || salario <= 0) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Salario debe ser número positivo', path: req.originalUrl });
  }
  if (empleados.some((e) => e.nombre === nombre)) {
    return res.status(409).json({ timestamp: new Date().toISOString(), status: 409, message: 'El empleado ya existe', path: req.originalUrl });
  }
  const nuevo = { id: Date.now().toString(), nombre, cargo, salario, fechaContratacion: fechaContratacion || new Date().toISOString() };
  empleados.push(nuevo);
  res.status(201).json(nuevo);
}

function getById(req, res) {
  const item = findById(req.params.id);
  if (!item) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Empleado no encontrado', path: req.originalUrl });
  }
  res.json(item);
}

function remove(req, res) {
  const idx = empleados.findIndex((e) => String(e.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Empleado no encontrado', path: req.originalUrl });
  }
  empleados.splice(idx, 1);
  res.status(204).end();
}

function update(req, res) {
  const idx = empleados.findIndex((e) => String(e.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ timestamp: new Date().toISOString(), status: 404, message: 'Empleado no encontrado', path: req.originalUrl });
  }
  const { nombre, cargo, salario, fechaContratacion } = req.body;
  if (nombre && String(Number(nombre)) === nombre) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'El nombre no puede ser un número', path: req.originalUrl });
  }
  if (cargo && !validCargos.includes(cargo)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Cargo inválido', path: req.originalUrl });
  }
  if (salario !== undefined && (typeof salario !== 'number' || salario <= 0)) {
    return res.status(400).json({ timestamp: new Date().toISOString(), status: 400, message: 'Salario debe ser número positivo', path: req.originalUrl });
  }
  if (nombre && empleados.some((e, i) => e.nombre === nombre && i !== idx)) {
    return res.status(409).json({ timestamp: new Date().toISOString(), status: 409, message: 'El empleado ya existe', path: req.originalUrl });
  }
  const existing = empleados[idx];
  empleados[idx] = Object.assign({}, existing, {
    nombre: nombre !== undefined ? nombre : existing.nombre,
    cargo: cargo !== undefined ? cargo : existing.cargo,
    salario: salario !== undefined ? salario : existing.salario,
    fechaContratacion: fechaContratacion !== undefined ? fechaContratacion : existing.fechaContratacion
  });
  res.json(empleados[idx]);
}

module.exports = { list, create, getById, remove, update, empleados };
