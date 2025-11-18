// Funciones auxiliares para el módulo de libros
function createLibrosHTML() {
  return `
    <h3>Libros</h3>
    <div class="controls">
      <form id="formLibro">
        <input id="titulo" placeholder="Título" required />
        <input id="autor" placeholder="Autor" required />
        <input id="isbn" placeholder="ISBN" required />
        <input id="ejemplares_totales" type="number" min="1" placeholder="Ejemplares Totales" required />
        <button type="submit">Agregar Libro</button>
        <button type="button" id="cancelLibro" style="display:none;margin-left:8px;">Cancelar</button>
      </form>
    </div>
    <div id="tablaLibros"></div>
  `;
}

function setupLibroFormHandlers(root, API_BASE, toast) {
  const form = root.querySelector('#formLibro');
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = root.querySelector('#cancelLibro');
  let editId = null;

  const resetForm = () => {
    form.reset();
    editId = null;
    submitButton.textContent = 'Agregar Libro';
    cancelButton.style.display = 'none';
  };

  const reloadTable = () => {
    const el = root.querySelector('#tablaLibros');
    const event = new CustomEvent('reloadLibros');
    el.dispatchEvent(event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const titulo = form.querySelector('#titulo').value.trim();
    const autor = form.querySelector('#autor').value.trim();
    const isbn = form.querySelector('#isbn').value.trim();
    const ejemplaresTotales = Number(form.querySelector('#ejemplares_totales').value);

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `${API_BASE}/${editId}` : API_BASE;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, isbn, ejemplaresTotales })
      });

      if (res.ok) {
        toast(editId ? 'Libro actualizado' : 'Libro agregado');
        resetForm();
        reloadTable();
      } else {
        const err = await res.json();
        toast(err.message || 'Error desconocido');
      }
    } catch (err) {
      toast('Error de red');
    }
  };

  form.addEventListener('submit', handleSubmit);
  cancelButton.addEventListener('click', () => {
    resetForm();
    toast('Edición cancelada');
  });

  return { editId: () => editId, setEditId: (id) => { editId = id; }, resetForm, reloadTable };
}

function createTableHTML(data) {
  let html = `<table>
    <thead><tr>
      <th>Título</th>
      <th>Autor</th>
      <th>ISBN</th>
      <th>Disponibles</th>
      <th>Total</th>
      <th>Acciones</th>
    </tr></thead><tbody>`;

  if (data.length === 0) {
    html += '<tr><td colspan="6" style="text-align:center;">No hay libros registrados</td></tr>';
  } else {
    data.forEach(d => {
      html += `<tr>
        <td>${d.titulo}</td>
        <td>${d.autor}</td>
        <td>${d.isbn}</td>
        <td>${d.ejemplaresDisponibles || d.ejemplares_disponibles}</td>
        <td>${d.ejemplaresTotales || d.ejemplares_totales}</td>
        <td class="actions">
          <button data-id="${d.id}" class="edit">Editar</button>
          <button data-id="${d.id}" class="del">Eliminar</button>
        </td>
      </tr>`;
    });
  }

  html += '</tbody></table>';
  return html;
}

function setupTableEventHandlers(el, root, API_BASE, toast, formController) {
  const form = root.querySelector('#formLibro');
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = root.querySelector('#cancelLibro');

  // Editar
  el.querySelectorAll('.edit').forEach(b => b.addEventListener('click', async () => {
    const id = b.dataset.id;
    const res = await fetch(`${API_BASE}/${id}`);
    if (res.ok) {
      const data = await res.json();
      form.querySelector('#titulo').value = data.titulo;
      form.querySelector('#autor').value = data.autor;
      form.querySelector('#isbn').value = data.isbn;
      form.querySelector('#ejemplares_totales').value = data.ejemplaresTotales || data.ejemplares_totales;
      formController.setEditId(id);
      submitButton.textContent = 'Guardar Cambios';
      cancelButton.style.display = 'inline-block';
      toast('Editando libro');
    } else {
      const err = await res.json();
      toast(err.message || 'Error al cargar');
    }
  }));

  // Eliminar
  el.querySelectorAll('.del').forEach(b => b.addEventListener('click', async () => {
    const id = b.dataset.id;
    if (!confirm('¿Eliminar libro?')) return;
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast('Libro eliminado');
      formController.reloadTable();
    } else {
      const err = await res.json();
      toast(err.message || 'Error al eliminar');
    }
  }));
}

window.renderLibros = function (container) {
  const root = document.createElement('div');
  root.className = 'module-card';
  root.innerHTML = createLibrosHTML();
  container.appendChild(root);

  const toast = window.toast || function(msg) { alert(msg); };
  const API_BASE = '/api/samirmideros/libros';

  const formController = setupLibroFormHandlers(root, API_BASE, toast);
  
  // Función para cargar tabla con acceso al formController
  const loadLibrosTablaWithController = async () => {
    const el = root.querySelector('#tablaLibros');

    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      if (!Array.isArray(data)) {
        el.innerHTML = '<p>Error: La API no devolvió una lista.</p>';
        return;
      }

      el.innerHTML = createTableHTML(data);
      setupTableEventHandlers(el, root, API_BASE, toast, formController);

    } catch (error) {
      el.innerHTML = '<p>Error de red al cargar los libros.</p>';
    }
  };

  // Configurar evento de recarga
  const tablaContainer = root.querySelector('#tablaLibros');
  tablaContainer.addEventListener('reloadLibros', loadLibrosTablaWithController);
  
  // Actualizar la función reloadTable del formController
  formController.reloadTable = loadLibrosTablaWithController;

  loadLibrosTablaWithController();
};