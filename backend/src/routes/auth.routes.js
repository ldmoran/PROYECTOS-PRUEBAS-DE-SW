const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Usuario = require('../models/usuario.model');
const validMembresias = ['basica', 'premium', 'vip'];

// Registro unificado
router.post('/register', async (req, res) => {
  const { username, password, nombreCompleto, email, telefono, membresia } = req.body;
  if (!username || !password || !nombreCompleto || !email || !telefono || !membresia) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ message: 'Email inválido' });
  if (!/^[0-9]{10}$/.test(telefono)) return res.status(400).json({ message: 'Teléfono debe tener 10 dígitos' });
  if (!validMembresias.includes(membresia)) return res.status(400).json({ message: 'Membresía inválida' });
  try {
    const existeUsername = await Usuario.findOne({ username });
    if (existeUsername) return res.status(409).json({ message: 'El nombre de usuario ya está registrado' });
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) return res.status(409).json({ message: 'El email ya está registrado' });
    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      username,
      nombre: nombreCompleto,
      email,
      telefono,
      membresia,
      password: hash
    });
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    console.error('Error en /auth/register:', err);
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Permitir login por username o email
    const user = await Usuario.findOne({ $or: [ { username }, { email: username } ] });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user._id, nombreCompleto: user.nombre, email: user.email, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
});

module.exports = router;
