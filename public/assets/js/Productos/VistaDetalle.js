const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";

const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");
const contenedorPrincipal = document.getElementById("vistaDetalleP");

const cargarDetalleProducto = async () => {
    if (!idProducto) {
        contenedorPrincipal.innerHTML = `<div class="text-center py-20 text-red-500">ID de producto no válido.</div>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${idProducto}`);
        const result = await response.json();
        
        const producto = result.data || result;

        if (!p) throw new Error("Producto no encontrado");

        contenedorPrincipal.innerHTML = `
            <div class="text-sm text-gray-500 mb-6">
                <a href="../CatalogoProductosWiew/CatalogoProductos.html" class="hover:text-orange-500 transition-colors">Volver al Catálogo</a>
                <span class="mx-2">/</span>
                <span class="font-medium text-gray-800">${producto.nombre_producto || 'Producto'}</span>
            </div>

            <div class="grid md:grid-cols-2 gap-10 items-start">
                <div class="bg-white rounded-xl shadow p-6 flex justify-center">
                    <img src="${producto.ImagenesProducto || '../imagenes/placeholder.jpg'}" 
                        alt="${producto.nombre_producto}" 
                    class="max-h-96 object-contain">
                </div>

                <div class="bg-white rounded-xl shadow p-8">
                    <h1 class="text-3xl font-bold mb-3 text-slate-800">
                        ${producto.nombre_producto || 'Sin nombre'}
                    </h1>
                    <p class="text-gray-600 mb-6">
                        ${producto.unidad || 'Unidad de medida'} - ${producto.descripcion || 'Información general del producto'}
                    </p>

                    <h2 class="text-xl font-semibold mb-4 text-slate-700">
                        Especificaciones Técnicas
                    </h2>

                    <table class="w-full text-sm">
                        <tbody class="divide-y text-slate-600">
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Unidad de Medida</td>
                                <td class="py-2 text-right">${producto.unidad || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Calibre</td>
                                <td class="py-2 text-right">${producto.calibre || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Metros</td>
                                <td class="py-2 text-right">${producto.metros || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Kg</td>
                                <td class="py-2 text-right">${producto.kilos || p.kg || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Color</td>
                                <td class="py-2 text-right">${producto.color || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Ced</td>
                                <td class="py-2 text-right">${producto.cedula || p.ced || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Ton</td>
                                <td class="py-2 text-right">${producto.tonelaje || p.ton || '—'}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-semibold text-slate-800">Cm</td>
                                <td class="py-2 text-right">${producto.centimetros || p.cm || '—'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button class="w-full mt-8 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
                        Contactar Asesor
                    </button>
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error cargando detalle:", error);
        contenedorPrincipal.innerHTML = `
            <div class="text-center py-20">
                <h2 class="text-2xl font-bold text-gray-800">Ups, producto no encontrado</h2>
                <p class="text-gray-500 mb-6">Parece que el enlace es incorrecto o el producto ya no existe.</p>
                <a href="../CatalogoProductosWiew/CatalogoProductos.html" class="bg-slate-800 text-white px-6 py-2 rounded-lg">Regresar al Catálogo</a>
            </div>
        `;
    }
};

cargarDetalleProducto();