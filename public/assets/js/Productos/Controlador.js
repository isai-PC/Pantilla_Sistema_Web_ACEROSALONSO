/* ======================================================
SEGURIDAD Y SESIÓN (TOKEN JWT)
====================================================== */
if (!localStorage.getItem("token")) {
    window.location.href = "../../../index.html"; 
}

const nombre = localStorage.getItem("nombre");
const token = localStorage.getItem("token");

if (nombre) {
    const elementoNombre = document.getElementById("nombre"); 
    if (elementoNombre) {
        elementoNombre.textContent = "Usuario: " + nombre;
    }
}

/* ======================================================
API BASE
====================================================== */
const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";
const CATEGORIAS_URL = "https://apis-propias-a-vercel-jtww.vercel.app/api/categorias";

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
const tituloTotal = document.querySelector("h2.text-xl");
const inpuntform = document.getElementById("inputfile");
const image = document.getElementById("imagen");
const categoriaSelect = document.getElementById("categoria_select");
const idCategoriaHidden = document.getElementById("id_categoria_hidden");
const filtroCategoria = document.getElementById("filtroCategoria");

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
CARGAR CATEGORÍAS EN LOS SELECTS
====================================================== */
async function cargarCategorias() {
    try {
        const res = await fetch(CATEGORIAS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const categorias = await res.json(); 

        if (categoriaSelect) {
            categoriaSelect.innerHTML = '<option value="">-- Seleccione una categoría --</option>';
            categorias.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id_categoria;
                option.textContent = cat.nombre_categoria;
                categoriaSelect.appendChild(option);
            });
        }

        if (filtroCategoria) {
            filtroCategoria.innerHTML = '<option value="">-- Ver Todos --</option>';
            categorias.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id_categoria;
                option.textContent = cat.nombre_categoria;
                filtroCategoria.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar categorías:", error);
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
            "Accept": "application/json",
            "Authorization": "Bearer " + token 
        },
        body: JSON.stringify(payload)
    });
};

const actualizarProducto = async (id, payload) => {
    return await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token 
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
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + token 
                }
            });
            
            const data = await response.json().catch(() => ({})); 

            if (response.ok) {
                Swal.fire('¡Borrado!', 'El producto ha sido eliminado.', 'success');
                cargarProductos(paginaActual);
            } else {
                const mensajeError = data.error || data.message || "No se pudo eliminar el producto en la base de datos";
                throw new Error(mensajeError);
            }
        } catch (error) {
            console.error("Error eliminando producto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al borrar',
                text: error.message
            });
        }
    }
};

/* ======================================================
CARGAR PRODUCTOS PAGINADOS
====================================================== */
const cargarProductos = (pagina) => {
    let paginaConsulta = paginaActual;

    if (pagina === 1) {
        paginaConsulta = paginaActual + 1;
    }

    if (pagina === 0 && paginaActual > 0) {
        paginaConsulta = paginaActual - 1;
    }

    fetch(
        API_URL + "?limit=" + resultadosPorPagina + "&start=" + (paginaConsulta * resultadosPorPagina),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token 
            },
        }
    )
    .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        return respuesta.json();
    })
    .then((data) => {
        const productos = data.data || [];

        if (pagina === 1 && productos.length === 0) {
            hayresultados = false;
            actualizarBotones();
            return;
        }

        paginaActual = paginaConsulta;
        hayresultados = productos.length === resultadosPorPagina;

        if (pagina1) pagina1.textContent = paginaActual + 1;
        if (pagina2) pagina2.textContent = paginaActual + 2;

        if (data.total !== undefined && tituloTotal) {
            tituloTotal.textContent = `Listado de Productos (Total: ${data.total})`;
        }

        mostrarProductos(productos);
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
            <td class="py-3 px-4 text-slate-600">${p.nombre_categoria || 'Categoría desconocida'}</td>
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
ACTUALIZAR ESTADO DE LOS BOTONES
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
CARGAR PRODUCTO POR ID (PARA EDITAR)
====================================================== */
const cargarProducto = async () => {
    try {
        const response = await fetch(`${API_URL}/${idProducto}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token 
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        const p = data.data || data;

        if (!p) throw new Error("Producto no encontrado");

        document.getElementById('nombre_producto').value = p.nombre_producto || "";
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

        if (categoriaSelect && p.id_categoria) {
            categoriaSelect.value = p.id_categoria;
            if (idCategoriaHidden) idCategoriaHidden.value = p.id_categoria;
        }

    } catch (error) {
        console.error("Error al cargar producto:", error);
        Swal.fire({
            icon: "error",
            title: "Error al cargar",
            text: error.message || "No se pudo cargar el producto. Verifica el ID o intenta de nuevo.",
            confirmButtonText: "OK"
        });
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
        Swal.fire({
            icon: "warning",
            title: "Formato inválido",
            text: "Seleccione un formato de imagen válido (JPG, PNG, WEBP)",
            confirmButtonText: "Entendido"
        });
        inpuntform.value = "";
        return;
    }
    if (image.src !== "" && !image.src.includes("placeholder")) {
        URL.revokeObjectURL(image.src);
    }
    image.src = URL.createObjectURL(foto);
};

/* ======================================================
SUBMIT FORMULARIO 
====================================================== */
if (form) {
    form.onsubmit = async function (e) {
        e.preventDefault(); // Evitamos que la página se recargue

        btnGuardarFinal.disabled = true;
        let urlImagenFinal = "https://via.placeholder.com/150";
        const foto = inpuntform.files[0];

        if (!idCategoriaHidden.value) {
            Swal.fire({
                icon: "warning",
                title: "Campos requeridos",
                text: "Debes seleccionar una categoría antes de continuar",
                confirmButtonText: "Entendido"
            });
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = modoEditar ? "Actualizar Producto" : "Guardar";
            return;
        }

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
                btnGuardarFinal.textContent = modoEditar ? "Actualizar Producto" : "Guardar";
                return;
            }
        } else if (modoEditar && image && image.src !== "") {
            urlImagenFinal = image.src;
        }

        const payload = {
            id_categoria: parseInt(idCategoriaHidden.value) || 0,
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
                Swal.fire({ 
                    toast: true, 
                    position: "bottom-end", 
                    icon: "success", 
                    title: mensajeExito, 
                    showConfirmButton: false, 
                    timer: 3000 
                });
                if (!modoEditar) {
                    form.reset();
                    if (idCategoriaHidden) idCategoriaHidden.value = "";
                }
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
            console.error("EL ERROR REAL AL GUARDAR ES:", error);
            Swal.fire({ 
                toast: true, 
                position: "bottom-end", 
                icon: "error", 
                title: "Fallo de conexión", 
                showConfirmButton: false, 
                timer: 4000 
            });
        } finally {
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = modoEditar ? "Actualizar Producto" : "Guardar";
        }
    };
}

/* ======================================================
INICIALIZACIÓN AL CARGAR LA PÁGINA
====================================================== */
window.onload = async function() { 

    if (tbody) {
        cargarProductos(0);
    }

    await cargarCategorias();

    if (modoEditar) {
        await cargarProducto();
    }

    // Asignamos los eventos "onchange" en lugar de "addEventListener"
    if (categoriaSelect && idCategoriaHidden) {
        categoriaSelect.onchange = function() {
            idCategoriaHidden.value = categoriaSelect.value;
        };
    }

    if (filtroCategoria) {
        filtroCategoria.onchange = async function(e) {
            const idCategoria = e.target.value;

            if (!idCategoria) {
                cargarProductos(0); 
                return;
            }

            try {
                tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-500">Cargando productos...</td></tr>`;
                
                const response = await fetch(`${API_URL}/categoria/${idCategoria}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token 
                    }
                });
                
                if (!response.ok) throw new Error("Error al filtrar");

                const data = await response.json();
                const productosFiltrados = data.productos || []; 

                mostrarProductos(productosFiltrados);

                if (tituloTotal) {
                    tituloTotal.textContent = `Listado de Productos (Total: ${data.total_productos})`;
                }

                if (btnAnterior) btnAnterior.disabled = true;
                if (btnSiguiente) btnSiguiente.disabled = true;

            } catch (error) {
                console.error("Error filtrando:", error);
                Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    icon: "error",
                    title: "No se pudo cargar el filtro",
                    showConfirmButton: false,
                    timer: 3000
                });
                tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-red-600">Error al filtrar.</td></tr>`;
            }
        };
    }
};

