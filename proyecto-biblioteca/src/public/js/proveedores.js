window.renderProveedores = function (container) {
  const root = document.createElement('div');
  root.className = 'module-card';
  root.innerHTML = `
    <h3>Proveedores</h3>
    <div class="controls">
      <form id="formProveedor">
        <input id="nombreEmpresa" placeholder="Nombre empresa" required />
        <input id="ruc" placeholder="RUC (13 dígitos)" required />
        <input id="contacto" placeholder="Contacto" />
        <input id="telefono" placeholder="Teléfono (10 dígitos)" />
        <input id="email" placeholder="Email" />
        <input id="direccion" placeholder="Dirección" />
        <button type="submit">Agregar Proveedor</button>
      </form>
    </div>
    <div id="tablaProveedores"></div>
  `;
  container.appendChild(root);

  const form = root.querySelector('#formProveedor');
  let editId = null;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreEmpresa = form.querySelector('#nombreEmpresa').value.trim();
    const ruc = form.querySelector('#ruc').value.trim();
    const contacto = form.querySelector('#contacto').value.trim();
    const telefono = form.querySelector('#telefono').value.trim();
    const email = form.querySelector('#email').value.trim();
    const direccion = form.querySelector('#direccion').value.trim();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? '/api/fernandosandoval/proveedores/' + editId : '/api/fernandosandoval/proveedores';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombreEmpresa, ruc, contacto, telefono, email, direccion }) });
    if (res.status === 201 || res.status === 200) {
      toast(editId ? 'Proveedor editado' : 'Proveedor agregado');
      form.reset();
      editId = null;
      loadTabla();
      return;
    }
    const err = await res.json();
    toast(err.message || 'Error');
  });

  async function loadTabla() {
    const el = root.querySelector('#tablaProveedores');
    const res = await fetch('/api/fernandosandoval/proveedores');
    const data = await res.json();
    if (!Array.isArray(data)) return;
    let html = '<table><thead><tr><th>Empresa</th><th>RUC</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr></thead><tbody>';
    data.forEach((p) => {
      html += `<tr><td>${p.nombreEmpresa}</td><td>${p.ruc}</td><td>${p.contacto}</td><td>${p.telefono}</td><td>${p.email}</td><td class="actions"><button data-id="${p.id}" class="edit"><i class="fas fa-edit"></i> Editar</button><button data-id="${p.id}" class="del"><i class="fas fa-trash"></i> Eliminar</button></td></tr>`;
    });
    html += '</tbody></table>';
    el.innerHTML = html;
    el.querySelectorAll('.edit').forEach((b) => b.addEventListener('click', async () => {
      const id = b.dataset.id;
      const res = await fetch('/api/fernandosandoval/proveedores/' + id);
      if (res.status === 200) {
        const data = await res.json();
        form.querySelector('#nombreEmpresa').value = data.nombreEmpresa || '';
        form.querySelector('#ruc').value = data.ruc || '';
        form.querySelector('#contacto').value = data.contacto || '';
        form.querySelector('#telefono').value = data.telefono || '';
        form.querySelector('#email').value = data.email || '';
        form.querySelector('#direccion').value = data.direccion || '';
        editId = id;
        toast('Editando proveedor');
      }
    }));
    el.querySelectorAll('.del').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Eliminar proveedor?')) return;
      const id = b.dataset.id;
      const res = await fetch('/api/fernandosandoval/proveedores/' + id, { method: 'DELETE' });
      if (res.status === 204) {
        toast('Proveedor eliminado');
        loadTabla();
      }
    }));
  }

  loadTabla();
};
