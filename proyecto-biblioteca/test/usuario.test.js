const request = require('supertest');
const app = require('../src/app');

describe('Usuario API', () => {
  let createdId = null;

  test('Crear usuario válido (201)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '0987654321', membresia: 'basica' });
    expect(res.statusCode).toBe(201);
    createdId = res.body.id;
  });

  test('Error por email duplicado (409)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Otro', email: 'carlos@example.com', telefono: '0987654322', membresia: 'vip' });
    expect(res.statusCode).toBe(409);
  });

  test('Error por email vacío (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'X', email: '', telefono: '0987654322', membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por nombreCompleto siendo número (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: '1234', email: 'n1@example.com', telefono: '0987654322', membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  test('Listar todos los usuarios (200)', async () => {
    const res = await request(app).get('/api/anthonymorales/usuarios');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Obtener usuario por ID (200)', async () => {
    const res = await request(app).get('/api/anthonymorales/usuarios/' + createdId);
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar usuario y verificar eliminación', async () => {
    const res1 = await request(app).delete('/api/anthonymorales/usuarios/' + createdId);
    expect(res1.statusCode).toBe(204);
    const res2 = await request(app).get('/api/anthonymorales/usuarios/' + createdId);
    expect(res2.statusCode).toBe(404);
  });
});