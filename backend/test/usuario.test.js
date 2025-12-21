const request = require('supertest');
const app = require('../src/app');

describe('Usuario API', () => {
  let createdId = null;

  test('Crear usuario válido (201)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '0987654321', membresia: 'basica' });
    expect(res.statusCode).toBe(201);
    createdId = res.body.id;
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

  test('Error al obtener usuario inexistente (404)', async () => {
    const res = await request(app).get('/api/anthonymorales/usuarios/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  test('Error por email duplicado (409)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Otro', email: 'carlos@example.com', telefono: '0987654322', membresia: 'vip' });
    expect(res.statusCode).toBe(409);
  });

  test('Actualizar usuario válido (200)', async () => {
    const res = await request(app).put('/api/anthonymorales/usuarios/' + createdId).send({ 
      nombreCompleto: 'Carlos Ruiz Actualizado', 
      email: 'carlos.updated@example.com', 
      telefono: '0987654999', 
      membresia: 'premium' 
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nombreCompleto).toBe('Carlos Ruiz Actualizado');
  });

  test('Error al actualizar usuario inexistente (404)', async () => {
    const res = await request(app).put('/api/anthonymorales/usuarios/invalid-id').send({ 
      nombreCompleto: 'Test'
    });
    expect(res.statusCode).toBe(404);
  });

  test('Error al actualizar con nombreCompleto número (400)', async () => {
    const res = await request(app).put('/api/anthonymorales/usuarios/' + createdId).send({ 
      nombreCompleto: '123'
    });
    expect(res.statusCode).toBe(400);
  });

  // Tests de validaciones para el email 

  test('Error por email vacío (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'X', email: '', telefono: '0987654322', membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por email inválido (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Test', email: 'invalid-email', telefono: '0987654322', membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  test('Error al actualizar con email inválido (400)', async () => {
    const res = await request(app).put('/api/anthonymorales/usuarios/' + createdId).send({ 
      email: 'email-invalido'
    });
    expect(res.statusCode).toBe(400);
  });

    test('Error por email incorrecto (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Nombre Valido', email: 'anthonymoralesgmail.com', telefono: '0987654322', membresia: 'basica' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por email incorrecto (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Anthony Morales', email: 'aamorales@', telefono: '0999999999', membresia: 'basica' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por email incorrecto (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Anthony Morales', email: 'aamorales@.com', telefono: '0999999999', membresia: 'basica' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por email incorrecto (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Anthony Morales', email: 'aamorales@gmail', telefono: '0999999999', membresia: 'basica' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por email incorrecto (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Alexis Cham', email: 'alexis @example.com', telefono: '0988888888', membresia: 'basica' });
    expect(res.statusCode).toBe(400);
  });

  test('Error al actualizar con email duplicado (409)', async () => {
    // Crear otro usuario
    await request(app).post('/api/anthonymorales/usuarios').send({ 
      nombreCompleto: 'Otro Usuario', 
      email: 'otro@example.com', 
      telefono: '0987654888', 
      membresia: 'basica' 
    });
    
    // Intentar actualizar con email que ya existe
    const res = await request(app).put('/api/anthonymorales/usuarios/' + createdId).send({ 
      email: 'otro@example.com'
    });
    expect(res.statusCode).toBe(409);
  });

  // Tests de validaciones para el teléfono

  test('Error por telefono inválido (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Test', email: 'test@example.com', telefono: '123', membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  test('Error al actualizar con telefono inválido (400)', async () => {
    const res = await request(app).put('/api/anthonymorales/usuarios/' + createdId).send({ 
      telefono: '123'
    });
    expect(res.statusCode).toBe(400);
  });

  test('Error por telefono null (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Ariel', email: 'ariel@example.com', telefono: null, membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  test('Error por telefono indefinido (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Ariel', email: 'ariel@example.com', membresia: 'vip' });
    expect(res.statusCode).toBe(400);
  });

  // Tests de validaciones para la membresía

  test('Error por membresia inválida (400)', async () => {
    const res = await request(app).post('/api/anthonymorales/usuarios').send({ nombreCompleto: 'Test', email: 'test2@example.com', telefono: '0987654322', membresia: 'invalid' });
    expect(res.statusCode).toBe(400);
  });

  test('Error al actualizar con membresia inválida (400)', async () => {
    const res = await request(app).put('/api/anthonymorales/usuarios/' + createdId).send({ 
      membresia: 'invalida'
    });
    expect(res.statusCode).toBe(400);
  });

  test('Error al eliminar usuario inexistente (404)', async () => {
    const res = await request(app).delete('/api/anthonymorales/usuarios/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  test('Eliminar usuario y verificar eliminación', async () => {
    const res1 = await request(app).delete('/api/anthonymorales/usuarios/' + createdId);
    expect(res1.statusCode).toBe(204);
    const res2 = await request(app).get('/api/anthonymorales/usuarios/' + createdId);
    expect(res2.statusCode).toBe(404);
  });
});