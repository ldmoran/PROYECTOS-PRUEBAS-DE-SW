window.renderUsuarios = function (container) {
  const root = document.createElement('div');
  root.className = 'module-card';
  root.innerHTML = `
    <h3>Usuarios</h3>
    <div id="listaUsuarios"></div>
  `;
  container.appendChild(root);

  async function loadLista() {
    const el = root.querySelector('#listaUsuarios');
    const res = await fetch('http://localhost:3000/api/anthonymorales/usuarios');
    const data = await res.json();
    if (!Array.isArray(data)) return;
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">';
    data.forEach((u) => {
      html += `<div class="card" style="background:#fff;padding:8px;border-radius:6px"><div style="font-weight:600">${u.nombreCompleto}</div><div style="font-size:.9rem;color:#666">${u.email}</div><div style="margin-top:.5rem"><span style="background:#eee;padding:.2rem .5rem;border-radius:4px;font-size:.8rem">${u.membresia}</span></div></div>`;
    });
    html += '</div>';
    el.innerHTML = html;
  }

  loadLista();
};
