window.renderEmpleados = function (container) {
  const root = document.createElement('div');
  root.className = 'module-card';
  root.innerHTML = `
    <h3>Empleados</h3>
    <div class="controls">
      <form id="formEmpleado">
        <input id="nombre" placeholder="Nombre" required />
        <select id="cargo">
          <option value="bibliotecario">bibliotecario</option>
          <option value="administrador">administrador</option>
          <option value="auxiliar">auxiliar</option>
        </select>
        <input id="salario" type="number" placeholder="Salario" required />
        <button type="submit">Agregar Empleado</button>
      </form>
    </div>
    <div id="tablaEmpleados"></div>
  `;
  container.appendChild(root);

  const form = root.querySelector('#formEmpleado');
  let editId = null;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = form.querySelector('#nombre').value.trim();
    const cargo = form.querySelector('#cargo').value;
    const salario = Number(form.querySelector('#salario').value);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? '/api/davidmoran/empleados/' + editId : '/api/davidmoran/empleados';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, cargo, salario }) });
      if (res.status === 201 || res.status === 200) {
        toast(editId ? 'Empleado editado' : 'Empleado agregado');
        form.reset();
        editId = null;
        loadTabla();
        return;
      }
      const err = await res.json();
      toast(err.message || 'Error');
    } catch (err) {
      toast('Error de red');
    }
  });

  async function loadTabla() {
    const el = root.querySelector('#tablaEmpleados');
    const res = await fetch('/api/davidmoran/empleados');
    const data = await res.json();
    if (!Array.isArray(data)) return;
    let html = '<table><thead><tr><th>Nombre</th><th>Cargo</th><th>Salario</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>';
    data.forEach((d) => {
      html += `<tr><td>${d.nombre}</td><td>${d.cargo}</td><td>${d.salario}</td><td>${new Date(d.fechaContratacion).toLocaleDateString()}</td><td class="actions"><button data-id="${d.id}" class="edit"><i class="fas fa-edit"></i> Editar</button><button data-id="${d.id}" class="del"><i class="fas fa-trash"></i> Eliminar</button></td></tr>`;
    });
    html += '</tbody></table>';
    el.innerHTML = html;
    el.querySelectorAll('.edit').forEach((b) => b.addEventListener('click', async () => {
      const id = b.dataset.id;
      const res = await fetch('/api/davidmoran/empleados/' + id);
      if (res.status === 200) {
        const data = await res.json();
        form.querySelector('#nombre').value = data.nombre || '';
        form.querySelector('#cargo').value = data.cargo || 'bibliotecario';
        form.querySelector('#salario').value = data.salario || '';
        editId = id;
        toast('Editando empleado');
      }
    }));
    el.querySelectorAll('.del').forEach((b) => b.addEventListener('click', async () => {
      const id = b.dataset.id;
      if (!confirm('Eliminar empleado?')) return;
      const res = await fetch('/api/davidmoran/empleados/' + id, { method: 'DELETE' });
      if (res.status === 204) {
        toast('Empleado eliminado');
        loadTabla();
      }
    }));
  }

  loadTabla();
};
