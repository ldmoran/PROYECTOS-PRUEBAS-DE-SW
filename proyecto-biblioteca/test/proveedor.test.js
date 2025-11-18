const request = require('supertest');
const app = require('../src/app');

describe('Proveedor API', () => {
  let createdId = null;

  test('Crear proveedor válido (201)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Suministros SA', ruc: '1234567890123', contacto: 'Laura', telefono: '0987654321', email: 'laura@sum.com', direccion: 'Calle 1' });
    expect(res.statusCode).toBe(201);
    createdId = res.body.id;
  });

  test('Crear proveedor sin email (201)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Sin Email SA', ruc: '9999999999999', contacto: 'Pedro', telefono: '0987654322', direccion: 'Calle 2' });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBeUndefined();
  });

  test('Crear proveedor sin telefono falla (400)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Test', ruc: '8888888888888', contacto: 'Ana', email: 'ana@test.com', direccion: 'Calle 3' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por RUC faltante (400)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Test', contacto: 'Test', telefono: '0987654321', email: 'test@email.com' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por RUC duplicado (409)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Otra', ruc: '1234567890123', contacto: 'X', telefono: '0987654322', email: 'x@x.com', direccion: '' });
    expect(res.statusCode).toBe(409);
  });

  test('Error por telefono inválido (400)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Test', ruc: '1234567890125', contacto: 'X', telefono: '123', email: 'test@x.com', direccion: '' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por telefono inválido (400)', async () => {
    const res = await request(app).post('/api/fernandosandoval/proveedores').send({ nombreEmpresa: 'Test', ruc: '1234567890125', contacto: 'X', telefono: '123', email: 'test@x.com', direccion: '' });
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

  test('Error al obtener proveedor inexistente (404)', async () => {
    const res = await request(app).get('/api/fernandosandoval/proveedores/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  test('Actualizar proveedor válido (200)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      nombreEmpresa: 'Suministros SA Actualizada',
      contacto: 'Laura Actualizada',
      telefono: '0987654999',
      email: 'laura.updated@sum.com',
      direccion: 'Calle 2'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nombreEmpresa).toBe('Suministros SA Actualizada');
  });

  test('Error al actualizar con RUC duplicado (409)', async () => {
    // Crear otro proveedor
    await request(app).post('/api/fernandosandoval/proveedores').send({ 
      nombreEmpresa: 'Otro Proveedor', 
      ruc: '9876543210987', 
      contacto: 'Ana', 
      telefono: '0987654888', 
      email: 'ana@proveedor.com', 
      direccion: 'Calle 3' 
    });
    
    // Intentar actualizar con RUC que ya existe
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      ruc: '9876543210987'
    });
    expect(res.statusCode).toBe(409);
  });

  test('Error al actualizar proveedor inexistente (404)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/invalid-id').send({ 
      nombreEmpresa: 'Test'
    });
    expect(res.statusCode).toBe(404);
  });

  test('Actualizar proveedor sin email válido (200)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      nombreEmpresa: 'Actualizado Sin Email'
    });
    expect(res.statusCode).toBe(200);
  });

  test('Error al actualizar con email inválido (400)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      email: 'email-invalido'
    });
    expect(res.statusCode).toBe(400);
  });

  test('Error al actualizar con telefono inválido (400)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      telefono: '123'
    });
    expect(res.statusCode).toBe(400);
  });

  test('Error al actualizar con nombreEmpresa número (400)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      nombreEmpresa: '123'
    });
    expect(res.statusCode).toBe(400);
  });

  test('Actualizar proveedor con RUC válido (200)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      ruc: '5555555555555'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.ruc).toBe('5555555555555');
  });

  test('Error al actualizar con RUC inválido (400)', async () => {
    const res = await request(app).put('/api/fernandosandoval/proveedores/' + createdId).send({ 
      ruc: '123'
    });
    expect(res.statusCode).toBe(400);
  });

  test('Error al eliminar proveedor inexistente (404)', async () => {
    const res = await request(app).delete('/api/fernandosandoval/proveedores/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  test('Eliminar proveedor y verificar eliminación', async () => {
    const res1 = await request(app).delete('/api/fernandosandoval/proveedores/' + createdId);
    expect(res1.statusCode).toBe(204);
    const res2 = await request(app).get('/api/fernandosandoval/proveedores/' + createdId);
    expect(res2.statusCode).toBe(404);
  });
});
