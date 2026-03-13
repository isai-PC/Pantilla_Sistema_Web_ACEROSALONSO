// CatalogoProductos.js - Muestra productos de una categoría específica

const API_PRODUCTOS = "https://repositorio-para-vercel-tawny.vercel.app/api/productos/categoria";
const catalogoGrid = document.getElementById("catalogoP");
const titulo = document.querySelector("h1");

// Leer el ID de la categoría desde la URL (?id=XX)
const urlParams = new URLSearchParams(window.location.search);
const categoriaId = urlParams.get("id");

if (!categoriaId) {
    titulo.textContent = "Error: No se recibió categoría";
    catalogoGrid.innerHTML = `<p class="col-span-full text-center text-red-600 py-10">Falta el parámetro ?id= en la URL</p>`;
} else {
    titulo.textContent = `Productos de la categoría`;

    const cargarProductos = async () => {
        try {
            const res = await fetch(`${API_PRODUCTOS}/${categoriaId}`);

            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            const productos = await res.json();

            catalogoGrid.innerHTML = "";

            if (productos.length === 0) {
                catalogoGrid.innerHTML = `
                    <p class="col-span-full text-center py-12 text-gray-500 text-xl">
                        No hay productos en esta categoría aún.
                    </p>`;
                return;
            }

            productos.forEach(p => {
                const card = document.createElement("div");
                card.className = "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300";

                card.innerHTML = `
                    <img src="${p.ImagenesProducto || 'https://via.placeholder.com/300x300?text=Sin+imagen'}"
                         alt="${p.nombre_producto}"
                         class="w-full h-64 object-cover">
                    <div class="p-5">
                        <h3 class="font-bold text-lg line-clamp-2">${p.nombre_producto}</h3>
                        <p class="text-2xl font-semibold text-green-600 mt-2">$${parseFloat(p.precio).toFixed(2)}</p>
                        <p class="text-sm text-gray-500 mt-1">${p.unidad_medida || ''} ${p.calibre || ''}</p>
                    </div>
                `;

                catalogoGrid.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            catalogoGrid.innerHTML = `
                <p class="col-span-full text-center text-red-600 py-10">
                    Error al cargar los productos
                </p>`;
        }
    };

    cargarProductos();
}