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
CAMBIAR TITULO SEGUN MODO
====================================================== */
if (modoEditar) {
    titulo.textContent = "Actualizar Producto";
    descripcion.textContent = "Modifica los datos del producto";
} else {
    titulo.textContent = "Crear Nuevo Producto";
    descripcion.textContent = "Completa los campos para registrar un nuevo producto";
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
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                Swal.fire('¡Borrado!', 'El producto ha sido eliminado exitosamente.', 'success');
                ListarProductos(); // Recargamos la tabla
            } else {
                throw new Error("No se pudo eliminar el producto");
            }
        } catch (error) {
            console.error("Error eliminando producto:", error);
            Swal.fire('Error', 'No se pudo conectar con el servidor para eliminar.', 'error');
        }
    }
};
/* =====================================================
CARGAR TODODS LOS PRODUCTOS
===================================================== */
const ListarProductos = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const result = await response.json();
        const productos = result.data || [];

        if (tituloTotal) {
            tituloTotal.textContent = `Listado de Productos (Total: ${productos.length})`;
        }

        if (!tbody) return; // Seguridad extra

        tbody.innerHTML = "";

        if (productos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="py-4 px-4 text-center text-slate-500">
                        No hay productos registrados en este momento.
                    </td>
                </tr>`;
            return;
        }

        productos.forEach(p => {
            const tr = document.createElement("tr");
            tr.className = "border-b border-slate-100 hover:bg-slate-50 transition-colors";
            const imagenSrc = p.ImagenesProducto ? p.ImagenesProducto : "../../imagenes/placeholder.jpg";
            const id = p.id_producto || p.id;

            // ATENCIÓN AQUI: Asegúrate de que esta ruta al formulario sea la correcta en tus carpetas
            tr.innerHTML = `
                <td class="py-3 px-4">
                    <img src="${imagenSrc}" alt="${p.nombre_producto}" class="w-12 h-12 object-cover rounded shadow-sm border border-slate-200">
                </td>
                <td class="py-3 px-4 font-semibold text-slate-800">${p.nombre_producto}</td>
                <td class="py-3 px-4 text-slate-600">${p.nombre_categoria || 'Cat: ' + p.id_categoria}</td>
                <td class="py-3 px-4 text-center">
                    <a href="editardetalle.html?id=${id}" class="inline-flex mr-2">
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
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al cargar los productos.'
        });
    }
};

/* ======================================================
CARGAR PRODUCTO POR ID
====================================================== */
const cargarProducto = async () => {
    try {
        const response = await fetch(`${API_URL}/${idProducto}`);
        const data = await response.json(); // Se corrigió 'res' por 'data'
        console.log("Respuesta de la API:", data);
        const p = data.data || data; // Fallback por si la data viene directa
        if (p && form) { // Verificamos que exista data y que estemos en el form
            document.getElementById('nombre_producto').value = p.nombre_producto || "";
            document.getElementById('id_categoria').value = p.id_categoria || "";
            document.getElementById('precio').value = p.precio || "";
            document.getElementById('unidad_medida').value = p.unidad_medida || "";
            document.getElementById('calibre').value = p.calibre || "";
            document.getElementById('metros').value = p.metros || "";
            document.getElementById('kg').value = p.kg || "";
            document.getElementById('cm').value = p.cm || "";
            document.getElementById('ton').value = p.ton || "";
            document.getElementById('ced').value = p.ced || "";
            document.getElementById('color').value = p.color || "";
            if (p.ImagenesProducto && image) {
                image.src = p.ImagenesProducto;
            }
        }
    } catch (error) {
        console.error("Error cargando producto:", error);
    }
};


if (modoEditar) {
    cargarProducto();
}
/* ======================================================
CLOUDINARY CONFIG
====================================================== */
const cloudname = "dq63gma00";
const present = "AcerosAlonso";
/* ======================================================
PREVISUALIZAR IMAGEN
====================================================== */
const previsualizar = () => {
    const foto = inpuntform.files[0];
    if (!foto) return;
    if (!foto.type.startsWith("image/")) {
        Swal.fire('Error', 'Seleccione un formato de imagen válido', 'error');
        inpuntform.value = "";
        return;
    }
    if (image.src !== "" && !image.src.includes("placeholder")) {
        URL.revokeObjectURL(image.src);

    } image.src = URL.createObjectURL(foto);
};
/* ======================================================
RESET FORMULARIO
======================================================*/
const resetFormulario = () => {
    image.src = "https://via.placeholder.com/150";
};
/* ======================================================
SUBMIT FORMULARIO
====================================================== */
if{form.addEventListener('submit', async function (e) {
    e.preventDefault();
    btnGuardarFinal.disabled = true;
    let urlImagenFinal = "https://via.placeholder.com/150";
    const foto = inpuntform.files[0];
    /* SUBIR IMAGEN CLOUDINARY */
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
            console.error("Error subiendo imagen:", error);
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "No se pudo subir la imagen",
                showConfirmButton: false,
                timer: 4000
            });
            btnGuardarFinal.disabled = false;
            return;
        }

    }
    /* PAYLOAD */
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
    /* GUARDAR */
    try {
        btnGuardarFinal.textContent = "Guardando...";
        let response;
        if (modoEditar) {
            response = await actualizarProducto(idProducto, payload);

        } else {
            response = await crearProducto(payload);
        }
        const mensajeExito = modoEditar
            ? "Producto actualizado correctamente"
            : "Producto creado correctamente";
        if (response.ok) {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: mensajeExito,
                showConfirmButton: false,
                timer: 3000
            });
            form.reset();
            resetFormulario();
        } else {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "No se pudo guardar el producto",
                showConfirmButton: false,
                timer: 4000
            });
        }
    } catch (error) {
        console.error("Error de red:", error);

        Swal.fire({
            toast: true,
            position: "bottom-end",
            icon: "error",
            title: "Fallo de conexión con la API",
            showConfirmButton: false,
            timer: 4000
        });
    } finally {

        btnGuardarFinal.disabled = false;
        btnGuardarFinal.textContent = "Guardar";

    }

});
}
document.addEventListener("DOMContentLoaded", () => {
    // Si existe la tabla (tbody) en la página, entonces lista los productos
    if (tbody) {
        ListarProductos();
    }
});