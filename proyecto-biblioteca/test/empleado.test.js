const request = require('supertest');
const app = require('../src/app');

describe('Empleado API', () => {
  let createdId = null;

  test('Crear empleado válido (201)', async () => {
    const res = await request(app).post('/api/davidmoran/empleados').send({ nombre: 'Juan Perez', cargo: 'bibliotecario', salario: 500 });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Juan Perez');
    createdId = res.body.id;
  });

  test('Error por nombre siendo número (400)', async () => {
    const res = await request(app).post('/api/davidmoran/empleados').send({ nombre: '1234', cargo: 'bibliotecario', salario: 400 });
    expect(res.statusCode).toBe(400);
  });

  test('Error por cargo inválido (400)', async () => {
    const res = await request(app).post('/api/davidmoran/empleados').send({ nombre: 'Ana', cargo: 'gerente', salario: 400 });
    expect(res.statusCode).toBe(400);
  });

  test('Listar todos los empleados (200)', async () => {
    const res = await request(app).get('/api/davidmoran/empleados');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Obtener empleado por ID (200)', async () => {
    const res = await request(app).get('/api/davidmoran/empleados/' + createdId);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  test('Error al obtener empleado inexistente (404)', async () => {
    const res = await request(app).get('/api/davidmoran/empleados/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  test('Eliminar empleado y verificar eliminación', async () => {
    const res1 = await request(app).delete('/api/davidmoran/empleados/' + createdId);
    expect(res1.statusCode).toBe(204);
    const res2 = await request(app).get('/api/davidmoran/empleados/' + createdId);
    expect(res2.statusCode).toBe(404);
  });
});
