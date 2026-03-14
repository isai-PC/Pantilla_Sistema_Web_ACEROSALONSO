/* ======================================================
API BASE
====================================================== */
const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";

/* ======================================================
OBTENER PARAMETROS DE URL
====================================================== */
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");
const modoEditar = idProducto !== null;

/* ======================================================
ELEMENTOS HTML
====================================================== */
const titulo = document.getElementById("tituloFormulario");
const descripcion = document.getElementById("descripcionFormulario");
const form = document.getElementById("formCrearProducto");
const btnGuardarFinal = document.getElementById("btnGuardarFinal");
const tbody = document.querySelector("tbody");
const tituloTotal = document.querySelector("h2.text-xl"); // Total de productos
const inpuntform = document.getElementById("inputfile");
const image = document.getElementById("imagen");

/* ======================================================
VARIABLES DE PAGINACIÓN 
====================================================== */
let hayresultados = true;
let paginaActual = 0;
const resultadosPorPagina = 10;

/* ======================================================
ELEMENTOS DE PAGINACIÓN
====================================================== */
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const pagina1 = document.getElementById("pagina1");
const pagina2 = document.getElementById("pagina2");

/* ======================================================
CLOUDINARY CONFIG
====================================================== */
const cloudname = "dq63gma00";
const present = "AcerosAlonso";

/* ======================================================
INICIALIZACIÓN DE TEXTOS
====================================================== */
if (titulo && descripcion) {
    if (modoEditar) {
        titulo.textContent = "Actualizar Producto";
        descripcion.textContent = "Modifica los datos del producto";
    } else {
        titulo.textContent = "Crear Nuevo Producto";
        descripcion.textContent = "Completa los campos para registrar un nuevo producto";
    }
}

/* ======================================================
FUNCIONES API
====================================================== */
const crearProducto = async (payload) => {
    return await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    });
};

const actualizarProducto = async (id, payload) => {
    return await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    });
};

const eliminarProducto = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, borrar producto',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (response.ok) {
                Swal.fire('¡Borrado!', 'El producto ha sido eliminado.', 'success');
                cargarProductos(0);  // Recargamos la página actual, no toda la lista
            } else {
                throw new Error("No se pudo eliminar el producto");
            }
        } catch (error) {
            console.error("Error eliminando producto:", error);
            Swal.fire('Error', 'No se pudo conectar con el servidor para eliminar.', 'error');
        }
    }
};

/* ======================================================
CARGAR PRODUCTOS PAGINADOS
====================================================== */
const cargarProductos = (pagina) => {
    let paginaConsulta = paginaActual;

    // Avanzar
    if (pagina === 1) {
        paginaConsulta = paginaActual + 1;
    }

    // Retroceder
    if (pagina === 0 && paginaActual > 0) {
        paginaConsulta = paginaActual - 1;
    }

    fetch(
        API_URL + "?limit=" + resultadosPorPagina + "&start=" + (paginaConsulta * resultadosPorPagina),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                //Authorization: "Bearer " + token, 
            },
        }
    )
    .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        return respuesta.json();
    })
    .then((data) => {
        const productos = data.data || [];

        // Si intentamos avanzar pero no hay resultados
        if (pagina === 1 && productos.length === 0) {
            hayresultados = false;
            actualizarBotones();
            return;
        }

        // Actualizamos página
        paginaActual = paginaConsulta;
        hayresultados = productos.length === resultadosPorPagina;

        // Actualizar números de página visibles
        if (pagina1) pagina1.textContent = paginaActual + 1;
        if (pagina2) pagina2.textContent = paginaActual + 2;

        // Actualizar total si la API lo envía 
        if (data.total !== undefined && tituloTotal) {
            tituloTotal.textContent = `Listado de Productos (Total: ${data.total})`;
        }

        // Mostrar los productos
        mostrarProductos(productos);

        // Actualizar estado de botones
        actualizarBotones();
    })
    .catch((error) => {
        console.error("Error al cargar los productos:", error);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-red-600">Error al cargar los productos. Intenta recargar.</td></tr>`;
        }
    });
};

/* ======================================================
RENDERIZAR LOS PRODUCTOS EN LA TABLA
====================================================== */
const mostrarProductos = (productos) => {
    if (!tbody) return;

    tbody.innerHTML = "";

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-4 px-4 text-center text-slate-500">No hay productos en esta página.</td></tr>`;
        return;
    }

    productos.forEach(p => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-slate-100 hover:bg-slate-50 transition-colors";
        const imagenSrc = p.ImagenesProducto ? p.ImagenesProducto : "../../imagenes/placeholder.jpg";
        const id = p.id_producto || p.id;

        tr.innerHTML = `
            <td class="py-3 px-4">
                <img src="${imagenSrc}" alt="${p.nombre_producto}" class="w-12 h-12 object-cover rounded shadow-sm border border-slate-200">
            </td>
            <td class="py-3 px-4 font-semibold text-slate-800">${p.nombre_producto}</td>
            <td class="py-3 px-4 text-slate-600">${p.nombre_categoria || 'Cat: ' + p.id_categoria}</td>
            <td class="py-3 px-4 text-center">
                <a href="../../../pages/VistaPrivada/Productos/FormularioActualizar.html?id=${id}" class="inline-flex mr-2">
                    <button type="button" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">
                        Editar
                    </button>
                </a>
                <button type="button" onclick="eliminarProducto(${id})" class="inline-flex items-center justify-center text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">
                    Borrar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

/* ======================================================
ACTUALIZAR ESTADO VISUAL DE LOS BOTONES
====================================================== */
const actualizarBotones = () => {
    if (btnAnterior) {
        btnAnterior.disabled = (paginaActual === 0);
    }
    if (btnSiguiente) {
        btnSiguiente.disabled = !hayresultados;
    }
};

/* ======================================================
CARGAR PRODUCTO POR ID 
====================================================== */
const cargarProducto = async () => {
    try {
        let response = await fetch(`${API_URL}/${idProducto}`);
        let p = null;

        if (response.ok) {
            const data = await response.json();
            p = data.data || data;
        } else {
            console.warn("La API no soporta búsqueda por ID. Aplicando Plan B...");
            const resLista = await fetch(API_URL);
            const listaData = await resLista.json();
            const productos = listaData.data || listaData;
            p = productos.find(item => (item.id_producto || item.id).toString() === idProducto.toString());
        }

        if (p && form) {
            console.log("Producto encontrado para editar:", p);

            if (document.getElementById('nombre_producto')) document.getElementById('nombre_producto').value = p.nombre_producto || "";
            if (document.getElementById('id_categoria')) document.getElementById('id_categoria').value = p.id_categoria || "";
            if (document.getElementById('precio')) document.getElementById('precio').value = p.precio || "";
            if (document.getElementById('unidad_medida')) document.getElementById('unidad_medida').value = p.unidad_medida || "";
            if (document.getElementById('calibre')) document.getElementById('calibre').value = p.calibre || "";
            if (document.getElementById('metros')) document.getElementById('metros').value = p.metros || "";
            if (document.getElementById('kg')) document.getElementById('kg').value = p.kg || "";
            if (document.getElementById('cm')) document.getElementById('cm').value = p.cm || "";
            if (document.getElementById('ton')) document.getElementById('ton').value = p.ton || "";
            if (document.getElementById('ced')) document.getElementById('ced').value = p.ced || "";
            if (document.getElementById('color')) document.getElementById('color').value = p.color || "";

            if (p.ImagenesProducto && image) {
                image.src = p.ImagenesProducto;
            }
        } else {
            console.error("No se encontró el producto con ID:", idProducto);
        }
    } catch (error) {
        console.error("Error crítico en cargarProducto:", error);
    }
};

/* ======================================================
PREVISUALIZAR IMAGEN
====================================================== */
const previsualizar = () => {
    if (!inpuntform) return;
    const foto = inpuntform.files[0];
    if (!foto) return;
    if (!foto.type.startsWith("image/")) {
        Swal.fire('Error', 'Seleccione un formato de imagen válido', 'error');
        inpuntform.value = "";
        return;
    }
    if (image.src !== "" && !image.src.includes("placeholder")) {
        URL.revokeObjectURL(image.src);
    }
    image.src = URL.createObjectURL(foto);
};

/* ======================================================
RESET FORMULARIO
====================================================== */
const resetFormulario = () => {
    if (image) image.src = "https://via.placeholder.com/150";
};

/* ======================================================
SUBMIT FORMULARIO
====================================================== */
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        btnGuardarFinal.disabled = true;
        let urlImagenFinal = "https://via.placeholder.com/150";
        const foto = inpuntform.files[0];

        if (foto) {
            btnGuardarFinal.textContent = "Subiendo imagen...";
            const formData = new FormData();
            formData.append("file", foto);
            formData.append("upload_preset", present);
            try {
                const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, {
                    method: "POST",
                    body: formData
                });
                if (!cloudRes.ok) throw new Error("Error en Cloudinary");
                const cloudData = await cloudRes.json();
                urlImagenFinal = cloudData.secure_url;
            } catch (error) {
                Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudo subir la imagen", showConfirmButton: false, timer: 4000 });
                btnGuardarFinal.disabled = false;
                btnGuardarFinal.textContent = "Guardar";
                return;
            }
        } else if (modoEditar && image && image.src !== "") {
            urlImagenFinal = image.src;
        }

        const payload = {
            id_categoria: parseInt(document.getElementById('id_categoria').value) || 0,
            nombre_producto: document.getElementById('nombre_producto').value,
            ImagenesProducto: urlImagenFinal,
            precio: parseFloat(document.getElementById('precio').value) || 0,
            unidad_medida: document.getElementById('unidad_medida').value,
            calibre: document.getElementById('calibre').value,
            metros: parseFloat(document.getElementById('metros').value) || 0,
            kg: parseFloat(document.getElementById('kg').value) || 0,
            color: document.getElementById('color').value,
            ced: document.getElementById('ced').value,
            ton: document.getElementById('ton').value,
            cm: parseFloat(document.getElementById('cm').value) || 0
        };

        try {
            btnGuardarFinal.textContent = "Guardando...";
            let response;
            if (modoEditar) {
                response = await actualizarProducto(idProducto, payload);
            } else {
                response = await crearProducto(payload);
            }

            const mensajeExito = modoEditar ? "Producto actualizado correctamente" : "Producto creado correctamente";

            if (response.ok) {
                Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: mensajeExito, showConfirmButton: false, timer: 3000 });
                if (!modoEditar) {
                    form.reset();
                    resetFormulario();
                }
            } else {
                Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudo guardar el producto", showConfirmButton: false, timer: 4000 });
            }
        } catch (error) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 4000 });
        } finally {
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = "Guardar";
        }
    });
}

/* ======================================================
INICIALIZACIÓN AL CARGAR LA PÁGINA
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Si hay tabla, estamos en el listado, cargamos paginado
    if (tbody) {
        cargarProductos(0);  // primera página
    }

    // Si estamos editando, cargamos el producto
    if (modoEditar) {
        cargarProducto();
    }
});