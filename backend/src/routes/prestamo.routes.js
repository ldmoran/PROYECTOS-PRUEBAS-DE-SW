const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();


const Prestamo = require('../models/prestamo.model');
const Libro = require('../models/libro.model');


// Crear un préstamo (por nombres de libros)
router.post('/', auth, async (req, res) => {
  try {
    const { libros } = req.body; // array de nombres de libros
    if (!Array.isArray(libros) || libros.length === 0) return res.status(400).json({ message: 'Libros requeridos' });

    // Validar existencia y disponibilidad
    const librosPrestados = [];
    for (const nombre of libros) {
      const libro = await Libro.findOne({ nombre });
      if (!libro) return res.status(404).json({ message: `Libro no encontrado: ${nombre}` });
      if (libro.ejemplares < 1) return res.status(409).json({ message: `No hay ejemplares disponibles de: ${nombre}` });
      librosPrestados.push(libro);
    }
    // Descontar ejemplares
    for (const libro of librosPrestados) {
      libro.ejemplares -= 1;
      await libro.save();
    }
    const prestamo = await Prestamo.create({
      usuario: req.user.username,
      libros: librosPrestados.map(l => l.nombre),
      fecha: new Date()
    });
    res.status(201).json(prestamo);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear préstamo', error: err.message });
  }
});



// Listar préstamos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const userPrestamos = await Prestamo.find({ usuario: req.user.username });
    res.json(userPrestamos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener préstamos', error: err.message });
  }
});


// Eliminar préstamo por id (solo si pertenece al usuario)
router.delete('/:id', auth, async (req, res) => {
  try {
    const prestamo = await Prestamo.findOneAndDelete({ _id: req.params.id, usuario: req.user.username });
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar préstamo', error: err.message });
  }
});

module.exports = router;
