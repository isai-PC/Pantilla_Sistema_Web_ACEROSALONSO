
document.addEventListener('DOMContentLoaded', () => {
    
    // ---Control del Menú Hamburguesa (Móvil) ---
    const btnMenu = document.getElementById('btn-menu');
    const menuPrincipal = document.getElementById('menu-principal');

    if (btnMenu && menuPrincipal) {
        btnMenu.addEventListener('click', () => {
            menuPrincipal.classList.toggle('hidden');
        });
    }

    // ---Previsualización de Imagen ---
    const inputFoto = document.getElementById('ImagenesProducto');
    const imgPreview = document.getElementById('imagen-preview');

    if (inputFoto && imgPreview) {
        inputFoto.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imgPreview.src = e.target.result;
                    imgPreview.classList.remove('opacity-50'); 
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

// ---Menú de Accesibilidad ---
window.toggleMenuAccesibilidad = function() {
    const iframe = document.getElementById('menuAccesibilidad');
    if (iframe) {
        iframe.classList.toggle('hidden');
    }
};