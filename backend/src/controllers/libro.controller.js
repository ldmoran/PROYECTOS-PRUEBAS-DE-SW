const Libro = require('../models/libro.model');

// Listar todos los libros (adaptar campos para frontend)
const list = async (req, res) => {
  try {
    const libros = await Libro.find();
    // Adaptar los campos para compatibilidad con frontend
    const adaptados = libros.map(l => ({
      id: l._id,
      titulo: l.nombre,
      autor: l.autor,
      isbn: l.isbn,
      ejemplaresTotales: l.ejemplares,
      ejemplaresDisponibles: l.ejemplares, // Si tienes lógica de préstamos, cámbialo
    }));
    res.json(adaptados);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener libros', error: err.message });
  }
};

// Crear un libro (acepta nombre/titulo y ejemplares/ejemplaresTotales)
const create = async (req, res) => {
  try {
    let { nombre, titulo, autor, anio, ejemplares, ejemplaresTotales, isbn } = req.body;
    // Compatibilidad: si viene 'titulo', úsalo como 'nombre'
    if (!nombre && titulo) nombre = titulo;
    // Compatibilidad: si viene 'ejemplaresTotales', úsalo como 'ejemplares'
    if (ejemplares === undefined && ejemplaresTotales !== undefined) ejemplares = ejemplaresTotales;
    if (!nombre || !autor || ejemplares === undefined) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (nombre/titulo, autor, ejemplares/ejemplaresTotales)' });
    }
    const existe = await Libro.findOne({ nombre });
    if (existe) return res.status(409).json({ message: 'Ya existe un libro con ese nombre' });
    const libro = await Libro.create({ nombre, autor, anio, ejemplares, isbn });
    res.status(201).json({
      id: libro._id,
      titulo: libro.nombre,
      autor: libro.autor,
      isbn: libro.isbn,
      ejemplaresTotales: libro.ejemplares,
      ejemplaresDisponibles: libro.ejemplares
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear libro', error: err.message });
  }
};

// Obtener libro por ID (adaptar campos)
const getById = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json({
      id: libro._id,
      titulo: libro.nombre,
      autor: libro.autor,
      isbn: libro.isbn,
      ejemplaresTotales: libro.ejemplares,
      ejemplaresDisponibles: libro.ejemplares
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener libro', error: err.message });
  }
};

// Actualizar libro (adaptar campos)
const update = async (req, res) => {
  try {
    let { nombre, titulo, autor, anio, ejemplares, ejemplaresTotales, isbn } = req.body;
    if (!nombre && titulo) nombre = titulo;
    if (ejemplares === undefined && ejemplaresTotales !== undefined) ejemplares = ejemplaresTotales;
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    if (nombre !== undefined) libro.nombre = nombre;
    if (autor !== undefined) libro.autor = autor;
    if (anio !== undefined) libro.anio = anio;
    if (ejemplares !== undefined) libro.ejemplares = ejemplares;
    if (isbn !== undefined) libro.isbn = isbn;
    await libro.save();
    res.json({
      id: libro._id,
      titulo: libro.nombre,
      autor: libro.autor,
      isbn: libro.isbn,
      ejemplaresTotales: libro.ejemplares,
      ejemplaresDisponibles: libro.ejemplares
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar libro', error: err.message });
  }
};

// Eliminar libro
const remove = async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar libro', error: err.message });
  }
};

module.exports = { list, create, getById, update, remove };