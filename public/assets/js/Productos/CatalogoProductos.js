const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";
const contenedor = document.getElementById("catalogoP");

const mostrarGaleriaCompleta = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error en la respuesta del Servidor");

        const result = await response.json();
        const productos = result.data || [];

        if (!contenedor) return;
        contenedor.innerHTML = ""; 

        if (productos.length === 0) {
            contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500">No hay productos disponibles.</p>`;
            return;
        }

        productos.forEach(producto => {

            contenedor.innerHTML += `
            <a href="../VistaDetalleProducto/VistaVieew.html?id=${producto.id_producto}" class="block group">
                <article class="relative w-full max-w-xs bg-white rounded-xl shadow-lg overflow-hidden">
                    
                    <figure class="h-48 overflow-hidden">
                        <img src="${producto.ImagenesProducto || '../imagenes/placeholder.jpg'}" 
                            alt="${producto.nombre_producto}"
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
                    </figure>

                    <div class="p-4">
                        <h3 class="text-lg font-semibold">${producto.nombre_producto}</h3>
                        <p class="text-sm text-gray-600">${producto.unidad || 'Unidad'} · Cal: ${producto.calibre || 'N/A'}</p>
                    </div>

                    <div class="absolute inset-0 bg-slate-800/95 text-white 
                                flex flex-col justify-center items-center text-left
                                p-6 opacity-0 
                                transition-all duration-300
                                group-hover:opacity-100">
                        <h4 class="text-lg font-semibold mb-3">Detalles Técnicos</h4>
                        <ul class="space-y-1 text-sm">
                            <li><span class="font-semibold">Metros:</span> ${producto.metros || '-'}</li>
                            <li><span class="font-semibold">Kilos:</span> ${producto.kilos || '-'}</li>
                            <li><span class="font-semibold">Color:</span> ${producto.color || '-'}</li>
                        </ul>
                        <span class="mt-4 bg-orange-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition">
                            Ver detalle
                        </span>
                    </div>
                </article>
            </a>
            `;
        });
    } catch (error) {
        console.error("Error cargando galería:", error);
        contenedor.innerHTML = "<p class=col-span-full text-center> Error al conectar con el servidor.</p>";
    }
};

mostrarGaleriaCompleta();