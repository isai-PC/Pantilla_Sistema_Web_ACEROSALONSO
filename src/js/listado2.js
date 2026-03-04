document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btn-menu');
    const navPrincipal = document.getElementById('nav-principal');

    // Toggle en móvil
    btnMenu.addEventListener('click', () => {
        navPrincipal.classList.toggle('hidden');
    });

    // Cuando cambia el tamaño de pantalla
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            navPrincipal.classList.remove('hidden');
        } else {
            navPrincipal.classList.add('hidden');
        }
    });
});