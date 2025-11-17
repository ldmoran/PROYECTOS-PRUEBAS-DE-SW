window.renderUsuarios = function (container) {
  const root = document.createElement('div');
  root.className = 'module-card';
  root.innerHTML = `
    <h3>Usuarios</h3>
    <div class="controls">
      <form id="formUsuario">
        <input id="nombreCompleto" placeholder="Nombre completo" required />
        <input id="email" placeholder="Email" required />
        <input id="telefono" placeholder="Teléfono (10 dígitos)" required />
        <select id="membresia">
          <option value="basica">Basica</option>
          <option value="premium">Premium</option>
          <option value="vip">Vip</option>
        </select>
        <button type="submit">Agregar Usuario</button>
      </form>
    </div>
    <div id="listaUsuarios"></div>
  `;
  container.appendChild(root);

  const form = root.querySelector('#formUsuario');
  let editId = null;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreCompleto = form.querySelector('#nombreCompleto').value.trim();
    const email = form.querySelector('#email').value.trim();
    const telefono = form.querySelector('#telefono').value.trim();
    const membresia = form.querySelector('#membresia').value;
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? '/api/anthonymorales/usuarios/' + editId : '/api/anthonymorales/usuarios';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombreCompleto, email, telefono, membresia }) });
    if (res.status === 201 || res.status === 200) {
      toast(editId ? 'Usuario editado' : 'Usuario creado');
      form.reset();
      editId = null;
      loadLista();
      return;
    }
    const err = await res.json();
    toast(err.message || 'Error');
  });

  async function loadLista() {
    const el = root.querySelector('#listaUsuarios');
    const res = await fetch('/api/anthonymorales/usuarios');
    const data = await res.json();
    if (!Array.isArray(data)) return;
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">';
    data.forEach((u) => {
      html += `<div class="card" style="background:#fff;padding:8px;border-radius:6px"><div style="font-weight:600">${u.nombreCompleto}</div><div style="font-size:.9rem;color:#666">${u.email}</div><div style="margin-top:.5rem"><span style="background:#eee;padding:.2rem .5rem;border-radius:4px;font-size:.8rem">${u.membresia}</span></div><div style="margin-top:.5rem"><button data-id="${u.id}" class="edit"><i class="fas fa-edit"></i> Editar</button><button data-id="${u.id}" class="del"><i class="fas fa-trash"></i> Eliminar</button></div></div>`;
    });
    html += '</div>';
    el.innerHTML = html;
    el.querySelectorAll('.edit').forEach((b) => b.addEventListener('click', async () => {
      const id = b.dataset.id;
      const res = await fetch('/api/anthonymorales/usuarios/' + id);
      if (res.status === 200) {
        const data = await res.json();
        form.querySelector('#nombreCompleto').value = data.nombreCompleto || '';
        form.querySelector('#email').value = data.email || '';
        form.querySelector('#telefono').value = data.telefono || '';
        form.querySelector('#membresia').value = data.membresia || 'basica';
        editId = id;
        toast('Editando usuario');
      }
    }));
    el.querySelectorAll('.del').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Eliminar usuario?')) return;
      const id = b.dataset.id;
      const res = await fetch('/api/anthonymorales/usuarios/' + id, { method: 'DELETE' });
      if (res.status === 204) {
        toast('Usuario eliminado');
        loadLista();
      }
    }));
  }

  loadLista();
};