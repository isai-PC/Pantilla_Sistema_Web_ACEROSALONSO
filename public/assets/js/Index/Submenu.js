(function () {
    // Ahora API_URL solo existe dentro de esta "burbuja"
    const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";
    const menuLi = document.getElementById("SumenuProductos");

    if (!menuLi) return;

    const cargarMenu = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            const productos = result.data || result;
            const listaUl = document.getElementById("listaP")

            if (!listaUl) return;
            listaUl.innerHTML = "";

            productos.forEach(producto => {
                const id = producto.id_producto || producto.id_producto;
                listaUl.innerHTML += `
                    <li class="w-full block">
                        <a href="/public/pages/VistaPublica/VistaDetalleProducto/VistaVieew.html?id=${id}" 
                        class="block px-5 py-3 border-b border-white/10 text-white hover:bg-orange-400 transition-all">
                        ${producto.nombre_producto}
                        </a>
                    </li>`;
            });
        } catch (e) { console.error(e); }
    };

    document.addEventListener("DOMContentLoaded", cargarMenu);
})(); // Los paréntesis finales ejecutan la función


/* =====================================================
            FUNCIONAMIENTO DE CARRUSEL 
======================================================*/
document.addEventListener("DOMContentLoaded", () => {
    const carouselElement = document.getElementById('carousel');

    // 1. Buscamos los items dinámicamente usando el atributo que ya tienen
    const itemElements = carouselElement.querySelectorAll('[data-carousel-item]');
    const items = Array.from(itemElements).map((el, index) => {
        return {
            position: index,
            el: el
        };
    });

    // 2. Buscamos los indicadores (los puntitos) dinámicamente
    const indicatorElements = carouselElement.querySelectorAll('[data-carousel-slide-to]');
    const indicators = Array.from(indicatorElements).map((el, index) => {
        return {
            position: index,
            el: el
        };
    });

    // Opciones del carrusel
    const options = {
        defaultPosition: 0, // Posición inicial
        interval: 5000, // 5 segundos
        indicators: { // Configuración de los indicadores
            activeClasses: 'bg-white dark:bg-gray-800',
            inactiveClasses: 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
            items: indicators // Pasamos los indicadores encontrados
        }
    };

    if (typeof Carousel !== 'undefined') {
        const carousel = new Carousel(carouselElement, items, options);

        carousel.cycle();

        /* // 3. Programar los botones buscando por sus atributos data-
        const prevButton = carouselElement.querySelector('[data-carousel-prev]');
        const nextButton = carouselElement.querySelector('[data-carousel-next]');

        if (prevButton) {
            prevButton.addEventListener('click', () => carousel.prev());
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => carousel.next());
        } */
    } else {
        console.error("No se encontró la librería Flowbite.");
    }
});