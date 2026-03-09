(function() {
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
    