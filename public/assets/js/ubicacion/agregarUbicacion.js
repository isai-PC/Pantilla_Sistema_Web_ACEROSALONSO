document.addEventListener('DOMContentLoaded', () => {
    // Menú Hamburguesa Responsivo
    const btnMenu = document.getElementById('btn-menu');
    const menuPrincipal = document.getElementById('menu-principal');

    if (btnMenu && menuPrincipal) {
        btnMenu.addEventListener('click', () => {
            menuPrincipal.classList.toggle('hidden');
        });
    }

    // Previsualización de Imagen
    const imagenInput = document.getElementById('imagen-input');
    const imgPreview = document.getElementById('img-preview');

    if (imagenInput && imgPreview) {
        imagenInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imgPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Función Accesibilidad (Global)
window.toggleMenuAccesibilidad = function() {
    const iframe = document.getElementById('menuAccesibilidad');
    if (iframe) {
        iframe.classList.toggle('hidden');
    }
};