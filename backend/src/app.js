
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
// Conexión a MongoDB usando variable de entorno
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  });

const empleadoRoutes = require('./routes/empleado.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const libroRoutes = require('./routes/libro.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const authRoutes = require('./routes/auth.routes');
const prestamoRoutes = require('./routes/prestamo.routes');

function errorResponse(status, message, reqPath) {
  return {
    timestamp: new Date().toISOString(),
    status: status,
    message: message,
    path: reqPath
  };
}

const app = express();
app.use(cors());
app.use(express.json());


// Nuevas rutas para autenticación y préstamos
app.use('/api/auth', authRoutes); // /api/auth/register y /api/auth/login
app.use('/api/prestamos', prestamoRoutes); // protegidas con token

app.use('/api/davidmoran/empleados', empleadoRoutes);
app.use('/api/anthonymorales/usuarios', usuarioRoutes);
app.use('/api/samirmideros/libros', libroRoutes);
app.use('/api/fernandosandoval/proveedores', proveedorRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use((req, res) => {
  res.status(404).json(errorResponse(404, 'Recurso no encontrado', req.originalUrl));
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT);
}

module.exports = app;
