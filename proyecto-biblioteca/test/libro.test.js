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
      ejemplares_totales: 5
    });
    expect(libro.titulo).toBe('1984');
    expect(libro.ejemplares_disponibles).toBe(5);
  });

  test('falla si falta campo obligatorio', () => {
    expect(() => service.create({ titulo: 'Test' }))
      .toThrow('Faltan campos obligatorios');
  });

  test('falla con ISBN duplicado', () => {
    service.create({
      titulo: 'A', autor: 'B', isbn: '123', ejemplares_totales: 1
    });
    expect(() => service.create({
      titulo: 'B', autor: 'C', isbn: '123', ejemplares_totales: 1
    })).toThrow('Ya existe un libro con este ISBN');
  });

  test('actualiza libro parcialmente', () => {
    const creado = service.create({
      titulo: 'Original', autor: 'A', isbn: '111', ejemplares_totales: 3
    });
    const actualizado = service.update(creado.id, { titulo: 'Nuevo Titulo' });
    expect(actualizado.titulo).toBe('Nuevo Titulo');
    expect(actualizado.autor).toBe('A');
  });

  test('no permite reducir total bajo prestados', () => {
    const libro = service.create({
      titulo: 'Test', autor: 'A', isbn: '999', ejemplares_totales: 5
    });
    service.update(libro.id, { ejemplares_totales: 3 });
    service.libros[0].ejemplares_disponibles = 2;

    expect(() => service.update(libro.id, { ejemplares_totales: 2 }))
      .toThrow('No se puede reducir el total por debajo de los 3');
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
        ejemplares_totales: 7
      })
      .expect(201);

    expect(res.body.titulo).toBe('El principito');
    expect(res.body.ejemplares_disponibles).toBe(7);
    libroId = res.body.id;
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

  test('PUT /api/samirmideros/libros/:id actualiza libro', async () => {
    const res = await request(app)
      .put(`/api/samirmideros/libros/${libroId}`)
      .send({ titulo: 'El principito (edición especial)' })
      .expect(200);

    expect(res.body.titulo).toBe('El principito (edición especial)');
  });

  test('DELETE falla si hay ejemplares prestados', async () => {
    await request(app)
      .put(`/api/samirmideros/libros/${libroId}`)
      .send({ ejemplares_totales: 7 });

    await request(app)
      .delete(`/api/samirmideros/libros/${libroId}`)
      .expect(409);
  });

  test('DELETE elimina libro sin préstamos', async () => {
    const creado = await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Libro temporal',
        autor: 'Test',
        isbn: `978-test-${Date.now()}`,
        ejemplares_totales: 1
      });

    await request(app)
      .delete(`/api/samirmideros/libros/${creado.body.id}`)
      .expect(204);
  });

  test('POST falla con ISBN duplicado', async () => {
    await request(app)
      .post('/api/samirmideros/libros')
      .send({
        titulo: 'Duplicado',
        autor: 'Test',
        isbn: '978-0451524935',
        ejemplares_totales: 1
      })
      .expect(409);
  });

  test('GET libro inexistente devuelve 404', async () => {
    await request(app)
      .get('/api/samirmideros/libros/9999999999999')
      .expect(404);
  });
});