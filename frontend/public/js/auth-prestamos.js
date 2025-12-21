// Módulo de autenticación y préstamos
window.renderAuthAndPrestamos = function(container) {
  const root = document.createElement('div');
  root.className = 'module-card';
  root.innerHTML = `
    <h3>Acceso de Usuario</h3>
    <div class="controls">
      <form id="formLogin">
        <input id="loginUser" placeholder="Usuario" required />
        <input id="loginPass" type="password" placeholder="Clave" required />
        <button type="submit">Iniciar Sesión</button>
        <button type="button" id="showRegister">Registrarse</button>
      </form>
      <form id="formRegister" style="display:none; margin-top:8px;">
        <input id="regUser" placeholder="Usuario" required />
        <input id="regPass" type="password" placeholder="Clave" required />
        <input id="regNombre" placeholder="Nombre completo" required />
        <input id="regEmail" placeholder="Email" required />
        <input id="regTelefono" placeholder="Teléfono (10 dígitos)" required />
        <select id="regMembresia" required>
          <option value="">Membresía</option>
          <option value="basica">básica</option>
          <option value="premium">premium</option>
          <option value="vip">vip</option>
        </select>
        <button type="submit">Registrar</button>
        <button type="button" id="showLogin">Ya tengo cuenta</button>
      </form>
    </div>
    <div id="prestamoSection" style="display:none; margin-top:16px;"></div>
  `;
  container.appendChild(root);

  const formLogin = root.querySelector('#formLogin');
  const formRegister = root.querySelector('#formRegister');
  const showRegister = root.querySelector('#showRegister');
  const showLogin = root.querySelector('#showLogin');
  const prestamoSection = root.querySelector('#prestamoSection');

  showRegister.onclick = () => {
    formLogin.style.display = 'none';
    formRegister.style.display = '';
  };
  showLogin.onclick = () => {
    formRegister.style.display = 'none';
    formLogin.style.display = '';
  };

  formRegister.onsubmit = async (e) => {
    e.preventDefault();
    const username = formRegister.querySelector('#regUser').value.trim();
    const password = formRegister.querySelector('#regPass').value;
    const nombreCompleto = formRegister.querySelector('#regNombre').value.trim();
    const email = formRegister.querySelector('#regEmail').value.trim();
    const telefono = formRegister.querySelector('#regTelefono').value.trim();
    const membresia = formRegister.querySelector('#regMembresia').value;
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, nombreCompleto, email, telefono, membresia })
    });
    if (res.status === 201) {
      toast('Usuario registrado, ahora inicia sesión');
      showLogin.click();
    } else {
      const err = await res.json();
      toast(err.message || 'Error al registrar');
    }
  };

  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    const username = formLogin.querySelector('#loginUser').value.trim();
    const password = formLogin.querySelector('#loginPass').value;
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      toast('Sesión iniciada');
      formLogin.style.display = 'none';
      prestamoSection.style.display = '';
      renderPrestamos(prestamoSection);
    } else {
      const err = await res.json();
      toast(err.message || 'Error de login');
    }
  };

  // Si ya hay token, mostrar sección de préstamos
  if (localStorage.getItem('token')) {
    formLogin.style.display = 'none';
    prestamoSection.style.display = '';
    renderPrestamos(prestamoSection);
  }

  // --- Préstamos ---
  async function renderPrestamos(section) {
    // Obtener libros disponibles
    let librosDisponibles = [];
    try {
      const resLibros = await fetch('http://localhost:3000/api/samirmideros/libros');
      if (resLibros.ok) {
        librosDisponibles = await resLibros.json();
      }
    } catch {}
    section.innerHTML = `
      <h4>Préstamos</h4>
      <form id="formPrestamo" style="position:relative;">
        <label>Buscar y seleccionar libros:</label>
        <div style="display:flex;align-items:center;gap:4px;position:relative;">
          <input id="libroInput" type="text" placeholder="Escribe o despliega..." autocomplete="off" style="min-width:340px;font-size:1.1em;padding:8px 12px;" />
          <button id="libroDropdownBtn" type="button" tabindex="-1" style="background:none;border:none;cursor:pointer;font-size:1.2em;line-height:1;padding:0 6px;">&#9660;</button>
        </div>
        <div id="libroSugerencias" class="sugerencias-dropdown" style="display:none;position:absolute;left:0;top:60px;min-width:340px;background:#fff;border:1px solid #bbb;border-radius:4px;box-shadow:0 2px 8px #0002;max-height:220px;overflow-y:auto;z-index:100;"></div>
        <div id="librosSeleccionados" style="margin:6px 0 10px 0;"></div>
        <button type="submit">Solicitar Préstamo</button>
      </form>
      <div id="listaPrestamos" style="margin-top:12px;"></div>
      <button id="logout" style="margin-top:8px;">Cerrar sesión</button>
    `;
    section.querySelector('#logout').onclick = () => {
      localStorage.removeItem('token');
      location.reload();
    };
    // Autocompletado y selección múltiple
    const input = section.querySelector('#libroInput');
    const sugerencias = section.querySelector('#libroSugerencias');
    const seleccionadosDiv = section.querySelector('#librosSeleccionados');
    const dropdownBtn = section.querySelector('#libroDropdownBtn');
    let seleccionados = [];
    function renderSeleccionados() {
      seleccionadosDiv.innerHTML = seleccionados.map(t => `<span class=\"chip\">${t} <button type=\"button\" data-x=\"${t}\" style=\"border:none;background:none;color:#c00;cursor:pointer;\">&times;</button></span>`).join(' ');
      seleccionadosDiv.querySelectorAll('button[data-x]').forEach(btn => {
        btn.onclick = () => {
          seleccionados = seleccionados.filter(t => t !== btn.dataset.x);
          renderSeleccionados();
        };
      });
    }
    function showSugerencias(matches) {
      if (matches.length === 0) {
        sugerencias.style.display = 'none';
        sugerencias.innerHTML = '';
        return;
      }
      sugerencias.innerHTML = matches.map(l => `<div class=\"sugerencia-item\" style=\"padding:7px 12px;cursor:pointer;\">${l.titulo} <span style=\"color:#888;font-size:.9em;\">(${l.ejemplaresDisponibles} disp.)</span></div>`).join('');
      sugerencias.style.display = 'block';
      sugerencias.querySelectorAll('.sugerencia-item').forEach((div, i) => {
        div.onmousedown = (e) => {
          e.preventDefault();
          seleccionados.push(matches[i].titulo);
          renderSeleccionados();
          sugerencias.style.display = 'none';
          sugerencias.innerHTML = '';
          input.value = '';
        };
      });
    }
    input.addEventListener('input', () => {
      const val = input.value.toLowerCase();
      if (val.length < 2) {
        sugerencias.style.display = 'none';
        sugerencias.innerHTML = '';
        return;
      }
      const matches = librosDisponibles.filter(l => l.titulo.toLowerCase().includes(val) && !seleccionados.includes(l.titulo));
      showSugerencias(matches.slice(0, 12));
    });
    input.addEventListener('focus', () => {
      const val = input.value.toLowerCase();
      if (val.length < 2) {
        sugerencias.style.display = 'none';
        sugerencias.innerHTML = '';
        return;
      }
      const matches = librosDisponibles.filter(l => l.titulo.toLowerCase().includes(val) && !seleccionados.includes(l.titulo));
      showSugerencias(matches.slice(0, 12));
    });
    dropdownBtn.addEventListener('click', () => {
      input.focus();
      // No mostrar sugerencias al hacer clic en la flecha si no hay al menos 2 caracteres
      const val = input.value.toLowerCase();
      if (val.length < 2) {
        sugerencias.style.display = 'none';
        sugerencias.innerHTML = '';
        return;
      }
      const matches = librosDisponibles.filter(l => l.titulo.toLowerCase().includes(val) && !seleccionados.includes(l.titulo));
      showSugerencias(matches.slice(0, 12));
    });
    input.addEventListener('blur', () => setTimeout(() => {
      sugerencias.style.display = 'none';
      sugerencias.innerHTML = '';
    }, 200));
    renderSeleccionados();
    section.querySelector('#formPrestamo').onsubmit = async (e) => {
      e.preventDefault();
      if (seleccionados.length === 0) {
        toast('Selecciona al menos un libro');
        return;
      }
      const libros = seleccionados;
      const res = await fetch('http://localhost:3000/api/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ libros })
      });
      if (res.status === 201) {
        toast('Préstamo creado');
        seleccionados = [];
        renderSeleccionados();
        input.value = '';
        loadPrestamos();
      } else {
        const err = await res.json();
        toast(err.message || 'Error al crear préstamo');
      }
    };
    async function loadPrestamos() {
      const res = await fetch('http://localhost:3000/api/prestamos', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        const data = await res.json();
        let html = '<ul>';
        data.forEach(p => {
          html += `<li>Préstamo #${p._id} - Libros: ${p.libros.join(', ')} - Fecha: ${new Date(p.fecha).toLocaleString()} <button data-id="${p._id}" class="del-prestamo" style="margin-left:8px;color:#c00;background:none;border:none;cursor:pointer;">Eliminar</button></li>`;
        });
        html += '</ul>';
        section.querySelector('#listaPrestamos').innerHTML = html;
        section.querySelectorAll('.del-prestamo').forEach(btn => {
          btn.onclick = async () => {
            if (!confirm('¿Eliminar este préstamo?')) return;
            const resDel = await fetch(`http://localhost:3000/api/prestamos/${btn.dataset.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            if (resDel.status === 204) {
              toast('Préstamo eliminado');
              loadPrestamos();
            } else {
              toast('No se pudo eliminar');
            }
          };
        });
      } else {
        section.querySelector('#listaPrestamos').innerHTML = '<p>No se pudieron cargar los préstamos.</p>';
      }
    }
    loadPrestamos();
  }
};
