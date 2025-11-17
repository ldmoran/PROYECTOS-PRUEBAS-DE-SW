const request = require('supertest');
const app = require('../src/app');

describe('Proveedor API', () => {
  let createdId = null;

  test('Crear proveedor válido (201)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Suministros SA', ruc: '1234567890123', contacto: 'Laura', telefono: '0987654321', email: 'laura@sum.com', direccion: 'Calle 1' });
    expect(res.statusCode).toBe(201);
    createdId = res.body.id;
  });

  test('Error por RUC duplicado (409)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Otra', ruc: '1234567890123', contacto: 'X', telefono: '0987654322', email: 'x@x.com', direccion: '' });
    expect(res.statusCode).toBe(409);
  });

  test('Error por email inválido (400)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'E', ruc: '1234567890124', contacto: 'X', telefono: '0987654322', email: 'invalid', direccion: '' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por nombreEmpresa siendo número (400)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: '1234', ruc: '1234567890125', contacto: 'X', telefono: '0987654322', email: 'x2@x.com', direccion: '' });
    expect(res.statusCode).toBe(400);
  });

  test('Listar todos los proveedores (200)', async () => {
    const res = await request(app).get('/api/fernandosandoval/proveedores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Obtener proveedor por ID (200)', async () => {
    const res = await request(app).get('/api/fernandosandoval/proveedores/' + createdId);
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar proveedor y verificar eliminación', async () => {
    const res1 = await request(app).delete('/api/fernandosandoval/proveedores/' + createdId);
    expect(res1.statusCode).toBe(204);
    const res2 = await request(app).get('/api/fernandosandoval/proveedores/' + createdId);
    expect(res2.statusCode).toBe(404);
  });
});
