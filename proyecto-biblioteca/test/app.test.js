const request = require('supertest');
const app = require('../src/app');

describe('App API - General Tests', () => {
  test('GET /health devuelve status ok (200)', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET ruta inexistente devuelve 404', async () => {
    const res = await request(app).get('/ruta/inexistente');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Recurso no encontrado');
    expect(res.body.status).toBe(404);
  });

  test('POST ruta inexistente devuelve 404', async () => {
    const res = await request(app).post('/ruta/inexistente').send({ data: 'test' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Recurso no encontrado');
  });

  test('PUT ruta inexistente devuelve 404', async () => {
    const res = await request(app).put('/ruta/inexistente').send({ data: 'test' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Recurso no encontrado');
  });

  test('DELETE ruta inexistente devuelve 404', async () => {
    const res = await request(app).delete('/ruta/inexistente');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Recurso no encontrado');
  });

  test('Acceso a archivo estático index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/html');
  });

  test('Acceso a archivo CSS', async () => {
    const res = await request(app).get('/css/styles.css');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/css');
  });
});