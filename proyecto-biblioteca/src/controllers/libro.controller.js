const initialLibros = [
  { id: '1', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', isbn: '978-0307474728', ejemplares_totales: 5, ejemplares_disponibles: 3 },
  { id: '2', titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', isbn: '978-8424119958', ejemplares_totales: 10, ejemplares_disponibles: 10 },
];

class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

class LibroService {
  constructor(initialData = initialLibros) {
    this.libros = initialData.map(l => ({ ...l }));
  }

  getAll() {
    return this.libros;
  }

  findById(id) {
    const libro = this.libros.find(l => String(l.id) === String(id));
    if (!libro) throw new AppError('Libro no encontrado', 404);
    return libro;
  }

  create(data) {
    const { titulo, autor, isbn, ejemplares_totales } = data;

    if (!titulo || !autor || !isbn || ejemplares_totales == null) {
      throw new AppError('Faltan campos obligatorios (titulo, autor, isbn, ejemplares_totales)', 400);
    }

    if (!Number.isInteger(ejemplares_totales) || ejemplares_totales <= 0) {
      throw new AppError('Ejemplares totales debe ser un número entero positivo', 400);
    }

    if (this.libros.some(l => l.isbn === isbn)) {
      throw new AppError('Ya existe un libro con este ISBN', 409);
    }

    const nuevo = {
      id: Date.now().toString(),
      titulo,
      autor,
      isbn,
      ejemplares_totales,
      ejemplares_disponibles: ejemplares_totales
    };

    this.libros.push(nuevo);
    return nuevo;
  }

  update(id, data) {
    const idx = this.libros.findIndex(l => String(l.id) === String(id));
    if (idx === -1) throw new AppError('Libro no encontrado', 404);

    const existing = this.libros[idx];
    const { titulo, autor, isbn, ejemplares_totales } = data;

    if (isbn !== undefined && this.libros.some((l, i) => l.isbn === isbn && i !== idx)) {
      throw new AppError('Ya existe un libro con este ISBN', 409);
    }

    if (ejemplares_totales !== undefined) {
      if (!Number.isInteger(ejemplares_totales) || ejemplares_totales <= 0) {
        throw new AppError('Ejemplares totales debe ser un número entero positivo', 400);
      }
      const prestados = existing.ejemplares_totales - existing.ejemplares_disponibles;
      if (ejemplares_totales < prestados) {
        throw new AppError(`No se puede reducir el total por debajo de los ${prestados} ejemplares prestados`, 400);
      }
    }

    const nuevos_disponibles = ejemplares_totales !== undefined 
      ? existing.ejemplares_disponibles + (ejemplares_totales - existing.ejemplares_totales)
      : existing.ejemplares_disponibles;

    const updated = {
      id: existing.id,
      titulo: titulo ?? existing.titulo,
      autor: autor ?? existing.autor,
      isbn: isbn ?? existing.isbn,
      ejemplares_totales: ejemplares_totales ?? existing.ejemplares_totales,
      ejemplares_disponibles: nuevos_disponibles
    };

    this.libros[idx] = updated;
    return updated;
  }

  delete(id) {
    const idx = this.libros.findIndex(l => String(l.id) === String(id));
    if (idx === -1) throw new AppError('Libro no encontrado', 404);
    if (this.libros[idx].ejemplares_disponibles < this.libros[idx].ejemplares_totales) {
      throw new AppError('No se puede eliminar el libro, hay ejemplares prestados', 409);
    }
    this.libros.splice(idx, 1);
  }
}

const libroService = new LibroService(initialLibros);

const handleError = (err, req, res) => {
  const status = err.status || 500;
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    message: err.message,
    path: req.originalUrl
  });
};

const list = (req, res) => res.json(libroService.getAll());

const create = (req, res) => {
  try {
    const nuevo = libroService.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    handleError(err, req, res);
  }
};

const getById = (req, res) => {
  try {
    const libro = libroService.findById(req.params.id);
    res.json(libro);
  } catch (err) {
    handleError(err, req, res);
  }
};

const update = (req, res) => {
  try {
    const updated = libroService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    handleError(err, req, res);
  }
};

const remove = (req, res) => {
  try {
    libroService.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    handleError(err, req, res);
  }
};

module.exports = { list, create, getById, update, remove, LibroService };