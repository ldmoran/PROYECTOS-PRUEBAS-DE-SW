const express = require('express');
const path = require('path');
const cors = require('cors');

const empleadoRoutes = require('./routes/empleado.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const libroRoutes = require('./routes/libro.routes');
const proveedorRoutes = require('./routes/proveedor.routes');

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

app.use('/api/davidmoran/empleados', empleadoRoutes);
app.use('/api/anthonymorales/usuarios', usuarioRoutes);
app.use('/api/samirmideros/libros', libroRoutes);
app.use('/api/fernandosandoval/proveedores', proveedorRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use((req, res, next) => {
  res.status(404).json(errorResponse(404, 'Recurso no encontrado', req.originalUrl));
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT);
}

module.exports = app;
