document.addEventListener('DOMContentLoaded', () => {
    // Menú Hamburguesa
    const btnMenu = document.getElementById('btn-menu');
    const menuPrincipal = document.getElementById('menu-principal');

    if (btnMenu && menuPrincipal) {
        btnMenu.addEventListener('click', () => {
            menuPrincipal.classList.toggle('hidden');
        });
    }

    // Previsualización de Imagen
    const inputFoto = document.getElementById('inputfile');
    const imgPreview = document.getElementById('imagen');

    if (inputFoto && imgPreview) {
        inputFoto.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imgPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

function toggleMenuAccesibilidad() {
    const iframe = document.getElementById('menuAccesibilidad');
    if (iframe) iframe.classList.toggle('hidden');
}