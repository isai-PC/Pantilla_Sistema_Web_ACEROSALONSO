
(function () {
    const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";

    const menuLi = document.getElementById("SumenuProductos");

    if (!menuLi) {
        console.warn("No se encontró #SumenuProductos en el DOM");
        return;
    }

    const ul = menuLi.querySelector("ul#listaP");

    if (!ul) {
        console.warn("No se encontró <ul id='listaP'> dentro de SumenuProductos");
        return;
    }

    const mostrarCargando = () => {
        ul.innerHTML = '<li class="px-5 py-3 text-gray-400 italic">Cargando productos...</li>';
    };

    const mostrarError = (msg = "Error al cargar productos") => {
        ul.innerHTML = `<li class="px-5 py-3 text-red-400">${msg}</li>`;
    };

    const renderListaProductos = (productos) => {
        if (!productos || productos.length === 0) {
            ul.innerHTML = '<li class="px-5 py-3 text-gray-400">No hay productos disponibles</li>';
            return;
        }
        ul.innerHTML = '';
        const fragment = document.createDocumentFragment();

        productos.forEach(producto => {
            const li = document.createElement('li');
            li.className = 'w-full block';

            const a = document.createElement('a');
            a.href = `/public/pages/VistaPublica/VistaDetalleProducto/VistaVieew.html?id=${producto.id_producto}`;//checar la direccion para que funcione el los demas apartados publicos
            a.className = 'block px-5 py-3 border-b border-white/10 text-white hover:bg-orange-400 hover:pl-6 transition-all duration-200';
            a.textContent = producto.nombre_producto || '(Sin nombre)';

            li.appendChild(a);
            fragment.appendChild(li);
        });

        ul.appendChild(fragment);
    };

    const cargarProductos = async () => {
        mostrarCargando();

        try {
            const res = await fetch(API_URL);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const result = await res.json();

            const productos = result.data || [];

            renderListaProductos(productos);

        } catch (err) {
            console.error("Error cargando menú productos:", err);
            mostrarError();
        }
    };

    // Ejecutar cuando el DOM esté listo
    document.addEventListener("DOMContentLoaded", cargarProductos);

})();


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