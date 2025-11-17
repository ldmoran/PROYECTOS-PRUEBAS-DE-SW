// Sistema de navegación entre módulos
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  const content = document.getElementById('content');
  
  // Función toast para mostrar mensajes
  window.toast = function(message, type = 'success') {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Mostrar toast con animación
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Ocultar toast después de 3 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };
  
  // Manejar clics en botones del sidebar
  sidebar.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
      const module = button.getAttribute('data-module');
      
      if (module) {
        // Remover clase activa de todos los botones
        sidebar.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Agregar clase activa al botón clickeado
        button.classList.add('active');
        
        // Limpiar contenido
        content.innerHTML = '';
        
        // Cargar el módulo correspondiente
        switch(module) {
          case 'empleados':
            if (typeof window.renderEmpleados === 'function') {
              window.renderEmpleados(content);
            } else {
              content.innerHTML = '<p>Error: Módulo de empleados no disponible</p>';
            }
            break;
          case 'usuarios':
            if (typeof window.renderUsuarios === 'function') {
              window.renderUsuarios(content);
            } else {
              content.innerHTML = '<p>Error: Módulo de usuarios no disponible</p>';
            }
            break;
          case 'libros':
            if (typeof window.renderLibros === 'function') {
              window.renderLibros(content);
            } else {
              content.innerHTML = '<p>Error: Módulo de libros no disponible</p>';
            }
            break;
          case 'proveedores':
            if (typeof window.renderProveedores === 'function') {
              window.renderProveedores(content);
            } else {
              content.innerHTML = '<p>Error: Módulo de proveedores no disponible</p>';
            }
            break;
          default:
            content.innerHTML = '<p>Módulo no encontrado</p>';
        }
      }
    }
  });
  
  // Mostrar página de inicio por defecto
  function showHome() {
    content.innerHTML = `
      <section class="home">
        <h2>Bienvenido al Sistema Integral de Biblioteca</h2>
        <p>Usa el menú lateral para navegar entre módulos.</p>
        <div class="home-cards">
          <div class="card">
            <i class="fas fa-users"></i>
            <h3>Empleados</h3>
            <p>Gestión de personal de la biblioteca</p>
          </div>
          <div class="card">
            <i class="fas fa-user-circle"></i>
            <h3>Usuarios</h3>
            <p>Administración de usuarios registrados</p>
          </div>
          <div class="card">
            <i class="fas fa-book-open"></i>
            <h3>Libros</h3>
            <p>Catálogo y gestión de libros</p>
          </div>
          <div class="card">
            <i class="fas fa-building"></i>
            <h3>Proveedores</h3>
            <p>Gestión de proveedores de libros</p>
          </div>
        </div>
      </section>
    `;
  }
  
  // Mostrar home al cargar
  showHome();
});