const request = require('supertest');
const app = require('../src/app');
const { LibroService } = require('../src/controllers/libro.controller');

describe('LibroService - Unit Tests', () => {
  let service;

  beforeEach(() => {
    service = new LibroService([]);
  });

  test('crea libro correctamente', () => {
    const libro = service.create({
      titulo: '1984',
      autor: 'George Orwell',
      isbn: '978-0451524935',
      ejemplaresTotales: 5
    });
    expect(libro.titulo).toBe('1984');
    expect(libro.ejemplaresDisponibles).toBe(5);
  });

  test('falla si falta campo obligatorio', () => {
    expect(() => service.create({ titulo: 'Test' }))
      .toThrow('Faltan campos obligatorios');
  });

  test('falla con ISBN duplicado', () => {
    service.create({
      titulo: 'A', autor: 'B', isbn: '123', ejemplaresTotales: 1
    });
    expect(() => service.create({
      titulo: 'B', autor: 'C', isbn: '123', ejemplaresTotales: 1
    })).toThrow('Ya existe un libro con este ISBN');
  });

  test('actualiza libro parcialmente', () => {
    const creado = service.create({
      titulo: 'Original', autor: 'A', isbn: '111', ejemplaresTotales: 3
    });
    const actualizado = service.update(creado.id, { titulo: 'Nuevo Titulo' });
    expect(actualizado.titulo).toBe('Nuevo Titulo');
    expect(actualizado.autor).toBe('A');
  });

  test('actualiza ejemplares disponibles correctamente', () => {
    const libro = service.create({
      titulo: 'Test', autor: 'A', isbn: '999', ejemplaresTotales: 5
    });
    const actualizado = service.update(libro.id, { ejemplaresTotales: 8 });
    expect(actualizado.ejemplaresTotales).toBe(8);
    expect(actualizado.ejemplaresDisponibles).toBe(8);
  });
});

describe('Libros API - Integration Tests', () => {
  let libroId;

  test('POST /api/samirmideros/libros crea libro', async () => {
    const res = await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'El principito',
        autor: 'Antoine de Saint-Exupéry',
        isbn: '978-0156013987',
        ejemplaresTotales: 7
      })
      .expect(201);

    expect(res.body.titulo).toBe('El principito');
    expect(res.body.ejemplaresDisponibles).toBe(7);
    libroId = res.body.id;
  });

  test('POST falla con campos faltantes (400)', async () => {
    await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Solo titulo'
      })
      .expect(400);
  });

  test('POST falla con ejemplares_totales inválido (400)', async () => {
    await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Test',
        autor: 'Test',
        isbn: '978-test-invalid',
        ejemplaresTotales: -1
      })
      .expect(400);
  });

  test('POST falla con ejemplares_totales no numérico (400)', async () => {
    await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Test',
        autor: 'Test',
        isbn: '978-test-invalid2',
        ejemplaresTotales: 'texto'
      })
      .expect(400);
  });

  test('POST falla con ISBN duplicado (409)', async () => {
    await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Duplicado',
        autor: 'Test',
        isbn: '978-0156013987',
        ejemplaresTotales: 1
      })
      .expect(409);
  });

  test('GET /api/samirmideros/libros lista libros', async () => {
    const res = await request(app)
      .get('/api/samirmideros/libros')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/samirmideros/libros/:id devuelve libro', async () => {
    await request(app)
      .get(`/api/samirmideros/libros/${libroId}`)
      .expect(200);
  });

  test('GET libro inexistente devuelve 404', async () => {
    await request(app)
      .get('/api/samirmideros/libros/9999999999999')
      .expect(404);
  });

  test('PUT /api/samirmideros/libros/:id actualiza libro', async () => {
    const res = await request(app)
      .put(`/api/samirmideros/libros/${libroId}`)
      .send({ titulo: 'El principito (edición especial)' })
      .expect(200);

    expect(res.body.titulo).toBe('El principito (edición especial)');
  });

  test('PUT falla con ejemplares_totales inválido (400)', async () => {
    await request(app)
      .put(`/api/samirmideros/libros/${libroId}`)
      .send({ ejemplaresTotales: -5 })
      .expect(400);
  });

  test('PUT falla con ISBN duplicado (409)', async () => {
    // Crear otro libro
    const res = await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Otro libro',
        autor: 'Otro autor',
        isbn: '978-otro-isbn',
        ejemplaresTotales: 3
      });

    // Intentar actualizar con ISBN existente
    await request(app)
      .put(`/api/samirmideros/libros/${res.body.id}`)
      .send({ isbn: '978-0156013987' })
      .expect(409);
  });

  test('PUT actualiza ejemplares_totales correctamente', async () => {
    const res = await request(app)
      .put(`/api/samirmideros/libros/${libroId}`)
      .send({ ejemplaresTotales: 10 })
      .expect(200);

    expect(res.body.ejemplaresTotales).toBe(10);
    expect(res.body.ejemplaresDisponibles).toBe(10);
  });

  test('DELETE elimina libro correctamente', async () => {
    await request(app)
      .delete(`/api/samirmideros/libros/${libroId}`)
      .expect(204);
  });

  test('PUT libro inexistente devuelve 404', async () => {
    await request(app)
      .put('/api/samirmideros/libros/9999999999999')
      .send({ titulo: 'Test' })
      .expect(404);
  });

  test('DELETE libro inexistente devuelve 404', async () => {
    await request(app)
      .delete('/api/samirmideros/libros/9999999999999')
      .expect(404);
  });

  test('DELETE elimina libro sin préstamos', async () => {
    const creado = await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Libro temporal',
        autor: 'Test',
        isbn: `978-test-${Date.now()}`,
        ejemplaresTotales: 1
      });

    await request(app)
      .delete(`/api/samirmideros/libros/${creado.body.id}`)
      .expect(204);
  });
});