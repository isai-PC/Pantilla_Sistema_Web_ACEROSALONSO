// CatalogoProductosxCategoria_Controller.js
const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos/categoria";

// Leer el ID de la URL
const getCategoriaId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

// Función principal (flecha)
const cargarProductosPorCategoria = async () => {
    const id = getCategoriaId();
    const catalogo = document.getElementById("catalogoP");
    const titulo = document.getElementById("titulo-categoria");

    if (!id) {
        titulo.textContent = "Error: No se recibió categoría";
        catalogo.innerHTML = `<p class="col-span-full text-center text-red-600 py-10">No se encontró la categoría</p>`;
        return;
    }

    titulo.textContent = `Productos de la categoría ${id}`;
    catalogo.innerHTML = `<p class="col-span-full text-center py-10">Cargando productos...</p>`;

    let res;
    try {
        res = await fetch(`${API_URL}/${id}`);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const productos = await res.json();
        console.log("Productos recibidos:", productos); // Para depurar

        if (!Array.isArray(productos)) {
            throw new Error("La respuesta no es un array de productos");
        }

        if (productos.length === 0) {
            catalogo.innerHTML = `<p class="col-span-full text-center py-10 text-gray-500">No hay productos en esta categoría aún.</p>`;
            return;
        }

        catalogo.innerHTML = "";

        productos.forEach(prod => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-2xl shadow hover:shadow-2xl transition overflow-hidden";
            card.innerHTML = `
                <img src="${prod.ImagenesProducto || 'placeholder.jpg'}" 
                     alt="${prod.nombre_producto}" 
                     class="w-full h-56 object-cover">
                <div class="p-5">
                    <h3 class="font-bold text-lg line-clamp-2">${prod.nombre_producto}</h3>
                    <p class="text-green-600 font-semibold text-xl mt-2">$${parseFloat(prod.precio).toFixed(2)}</p>
                    <p class="text-sm text-gray-500 mt-1">${prod.unidad_medida || ''}</p>
                </div>
            `;
            catalogo.appendChild(card);
        });

    } catch (error) {
        console.error("Error detallado:", error);
        console.error("Respuesta:", res ? `Status: ${res.status}, ${res.statusText}` : "No response");
        catalogo.innerHTML = `<p class="col-span-full text-center text-red-600 py-10">Error al cargar los productos: ${error.message}</p>`;
    }
};

// Iniciar
document.addEventListener("DOMContentLoaded", cargarProductosPorCategoria);