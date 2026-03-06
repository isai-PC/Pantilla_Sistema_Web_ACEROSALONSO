
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para el Menú Hamburguesa Responsivo ---
    const btnMenu = document.getElementById('btn-menu');
    const menuPrincipal = document.getElementById('menu-principal');

    // Escucha el clic en el botón de las tres rayitas (móvil)
    if (btnMenu && menuPrincipal) {
        btnMenu.addEventListener('click', () => {
            menuPrincipal.classList.toggle('hidden');
        });
    }
});

// ---Lógica para el Menú de Accesibilidad ---
// Esta función se deja global (fuera del DOMContentLoaded) para que 
// el atributo onclick="" en el HTML pueda encontrarla y ejecutarla.
window.toggleMenuAccesibilidad = function() {
    const iframe = document.getElementById('menuAccesibilidad');
    if (iframe) {
        // Toggle quita la clase si la tiene, y se la pone si no la tiene
        iframe.classList.toggle('hidden');
    }
};