document.addEventListener('DOMContentLoaded', () => {
    // Lógica para el botón Hamburguesa 
    const btnAdminMenu = document.getElementById('btn-admin-menu');
    const adminAside = document.getElementById('admin-aside');

    if (btnAdminMenu && adminAside) {
        btnAdminMenu.addEventListener('click', () => {
            adminAside.classList.toggle('hidden');
        });
    }

    //Lógica para el submenú
    const adminSubmenuBtns = document.querySelectorAll('.admin-submenu-btn');

    adminSubmenuBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            if (window.innerWidth < 768) {
                event.preventDefault(); 
                
                const submenuContainer = this.nextElementSibling;
                
                if (submenuContainer) {
                    submenuContainer.classList.toggle('hidden');
                    submenuContainer.classList.toggle('block'); 
                }
            }
        });
    });

});