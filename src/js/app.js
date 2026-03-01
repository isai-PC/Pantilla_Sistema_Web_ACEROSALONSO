//Slider de categorias---------------------------------
let currentIndex = 0;

function moveSlide(direction) {
    const slider = document.getElementById("slider");
  if (!slider) return; // Si no hay slider en esta página, no hace nada

    const items = slider.children;
  if (items.length <= 1) return; // Si solo hay 1 o 0 categorías, no hay nada que deslizar

  // Calculamos la distancia exacta entre el primer elemento y el segundo.
    const itemWidth = items[1].offsetLeft - items[0].offsetLeft;

  // Averiguamos cuántos elementos caben en la pantalla actual
    const visibleWidth = slider.parentElement.offsetWidth;
    const visibleItems = Math.round(visibleWidth / itemWidth);

  // Calculamos el límite máximo para que no se deslice hacia el vacío
    const maxIndex = items.length - visibleItems;

  // Actualizamos el índice sumando o restando (direction es 1 o -1)
    currentIndex += direction;

  // Ponemos los límites (si llega al principio o al final, lo detenemos)
    if (currentIndex < 0) {
    currentIndex = 0;
    } else if (currentIndex > maxIndex) {
    // Si quieres que al llegar al final regrese al principio, cambia esto por: currentIndex = 0;
    currentIndex = maxIndex;
    }

  // Aplicamos el movimiento usando la propiedad transform
  slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

// reseteamos el slider al inicio para que no se rompa visualmente.
window.addEventListener("resize", () => {
    currentIndex = 0;
    const slider = document.getElementById("slider");
    if (slider) {
    slider.style.transform = `translateX(0px)`;
    }
});

//Menu desplegable---------------------------

document.addEventListener('DOMContentLoaded', () => {

    const btnMenu = document.getElementById('btn-menu');
    const menuPrincipal = document.getElementById('menu-principal');

    if (btnMenu && menuPrincipal) {
        btnMenu.addEventListener('click', () => {
            menuPrincipal.classList.toggle('hidden');
        });
    }

    // logica de sub menus ---
    const submenuBtns = document.querySelectorAll('.submenu-btn');

    submenuBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            
            if (window.innerWidth < 768) {
                event.preventDefault(); 
                
                const submenu = this.nextElementSibling;
                
                if (submenu) {
                    submenu.classList.toggle('hidden');
                    submenu.classList.toggle('flex');
                } 
    }});
    });
});