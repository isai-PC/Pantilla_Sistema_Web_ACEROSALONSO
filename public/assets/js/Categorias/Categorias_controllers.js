// Categorias_controllers.js - Versión FINAL corregida

const API_URL = "https://apis-propias-a-vercel-jtww.vercel.app/api/categorias";
const TOKEN_KEY = "token";

let paginaActual = 0;
const resultadosPorPagina = 10;

// ================================================
// AUXILIARES
// ================================================
const getToken = () => localStorage.getItem(TOKEN_KEY);

const mostrarMensaje = (tipo, titulo, texto) => {
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,
        timer: 3000,
        showConfirmButton: false
    });
};

// Constantes para Cloudinary
const CLOUD_NAME = "dq63gma00";
const UPLOAD_PRESET = "AcerosAlonso";

// ================================================
// CARGAR LISTADO
// ================================================
const cargarCategorias = async () => {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    const token = getToken();
    if (!token) {
        mostrarMensaje("warning", "Sesión requerida", "Inicia sesión para ver las categorías");
        return;
    }

    tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8">Cargando categorías...</td></tr>';

    try {
        const url = `${API_URL}?limit=${resultadosPorPagina}&start=${paginaActual * resultadosPorPagina}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                mostrarMensaje("warning", "Sesión expirada", "Inicia sesión nuevamente");
                return;
            }
            throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        const categorias = data.data || data;

        if (!categorias || categorias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8 text-slate-500">No hay categorías registradas</td></tr>';
            return;
        }

        tbody.innerHTML = "";

        categorias.forEach(cat => {
            const fila = document.createElement("tr");
            fila.className = "border-b border-slate-100 hover:bg-slate-50 transition-colors";

            fila.innerHTML = `
                <td class="py-3 px-4">
                    ${cat.imagen_categoria
                    ? `<img src="${cat.imagen_categoria}" class="w-12 h-12 object-cover rounded shadow-sm border border-slate-200">`
                    : `<img src="https://via.placeholder.com/48x48?text=Sin+Img" class="w-12 h-12 object-cover rounded shadow-sm border border-slate-200">`}
                </td>
                <td class="py-3 px-4 font-medium">${cat.nombre_categoria}</td>
                <td class="py-3 px-4 text-center">
                    <a href="Actualizar.html?id=${cat.id_categoria}" class="inline-flex mr-2">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm">Editar</button>
                    </a>
                    <button onclick="eliminarCategoria(${cat.id_categoria})" 
                            class="bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm">
                        Borrar
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        const paginaSpan = document.getElementById("pagina-actual");
        if (paginaSpan) paginaSpan.textContent = paginaActual + 1;

    } catch (error) {
        console.error("Error cargando categorías:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-8 text-red-600">Error al cargar categorías</td></tr>`;
    }
};

// ================================================
// ELIMINAR CATEGORÍA
// ================================================
const eliminarCategoria = async (id) => {
    const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    const token = getToken();
    if (!token) {
        mostrarMensaje("warning", "Sesión requerida", "Inicia sesión para eliminar");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                mostrarMensaje("warning", "Sesión expirada", "Inicia sesión nuevamente");
                return;
            }
            const errorText = await res.text();
            throw new Error(errorText || `Error ${res.status}`);
        }

        Swal.fire("Eliminado", "Categoría eliminada correctamente", "success");
        cargarCategorias();

    } catch (error) {
        Swal.fire("Error", error.message || "No se pudo eliminar la categoría", "error");
        console.error(error);
    }
};

// ================================================
// OBTENER DATOS PARA ACTUALIZAR
// ================================================
const obtenerDatosCategoria = async (id) => {
    const token = getToken();
    if (!token) {
        mostrarMensaje("warning", "Sesión requerida", "Inicia sesión para editar");
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        });

        if (!res.ok) {
            if (res.status === 404) {
                Swal.fire("No encontrada", "La categoría no existe", "warning");
                return null;
            }
            throw new Error(`Error ${res.status}`);
        }

        const data = await res.json();
        const categoria = data.data || data;

        if (!categoria || !categoria.id_categoria) {
            Swal.fire("Error", "Datos inválidos de la categoría", "error");
            return null;
        }

        // Llenar campos (IDs corregidos)
        const idHidden = document.getElementById("id_categoria_hidden");
        const nombreInput = document.getElementById("nombre_categoria");
        const textoInput = document.getElementById("texto_secundario");
        const preview = document.getElementById("imagenPreview");
        const imagenActualInput = document.getElementById("imagen_actual");

        if (idHidden) idHidden.value = categoria.id_categoria;
        if (nombreInput) nombreInput.value = categoria.nombre_categoria || "";
        if (textoInput) textoInput.value = categoria.texto_secundario || "";
        if (preview) preview.src = categoria.imagen_categoria || "https://via.placeholder.com/150?text=Sin+Imagen";
        if (imagenActualInput) imagenActualInput.value = categoria.imagen_categoria || "";

        return categoria;

    } catch (error) {
        console.error("Error al obtener categoría:", error);
        Swal.fire("Error", "No se pudo cargar la categoría", "error");
        return null;
    }
};

// ================================================
// PREVISUALIZAR IMAGEN
// ================================================
const previsualizarImagen = () => {
    const inputFile = document.getElementById("imagenInput");
    const preview = document.getElementById("imagenPreview");

    // Si no existe el input o la imagen de previsualización → salir
    if (!inputFile || !preview) {
        console.warn("No se encontraron elementos para previsualizar imagen");
        return;
    }

    const file = inputFile.files[0];

    // Validación: no hay archivo seleccionado
    if (!file) {
        Swal.fire({
            icon: "info",
            title: "Selecciona una imagen",
            text: "No has elegido ningún archivo aún",
            timer: 2000
        });
        return;
    }

    // Validación: debe ser imagen
    if (!file.type.startsWith("image/")) {
        Swal.fire({
            icon: "error",
            title: "Formato inválido",
            text: "Solo se permiten imágenes (jpg, png, webp)",
            timer: 2500
        });
        inputFile.value = ""; // limpiar input
        return;
    }

    // Liberar memoria de la imagen anterior (si existe y no es placeholder)
    if (preview.src && !preview.src.includes("placeholder")) {
        URL.revokeObjectURL(preview.src);
    }

    // Mostrar previsualización
    preview.src = URL.createObjectURL(file);
    preview.alt = file.name;
};

// ================================================
// ACTUALIZAR CATEGORÍA
// ================================================
const actualizarCategoria = async () => {
    const id = document.getElementById("id_categoria_hidden")?.value;
    const nombre = document.getElementById("nombre_categoria")?.value?.trim();
    const texto = document.getElementById("texto_secundario")?.value?.trim();
    const inputFile = document.getElementById("imagenInput");

    // Validaciones obligatorias
    if (!id || !nombre || !texto) {
        Swal.fire("Campos incompletos", "Nombre y descripción son obligatorios", "warning");
        return;
    }

    const token = getToken();
    if (!token) {
        mostrarMensaje("warning", "Sesión requerida", "Inicia sesión para actualizar");
        return;
    }

    const btn = document.getElementById("btnActualizar");
    if (!btn) return;

    const textoBtn = document.getElementById("textoBtn");
    const spinner = document.getElementById("spinner");

    btn.disabled = true;
    if (textoBtn) textoBtn.textContent = "Actualizando...";
    if (spinner) spinner.classList.remove("hidden");

    let urlImagen = null;

    // Subir imagen a Cloudinary y devolver la URL
    const subirImagenCloudinary = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error("Error al subir imagen a Cloudinary");
            }

            const data = await res.json();
            return data.secure_url;  // ← esta es la URL que guardas en la BD

        } catch (error) {
            console.error("Error subiendo a Cloudinary:", error);
            Swal.fire("Error", "No se pudo subir la imagen", "error");
            return null;
        }
    };
    // Si hay nueva imagen, subirla a Cloudinary primero
    if (inputFile?.files?.[0]) {
        const file = inputFile.files[0];
        if (!file.type.startsWith("image/")) {
            Swal.fire("Error", "Selecciona una imagen válida", "error");
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
            return;
        }

        urlImagen = await subirImagenCloudinary(file);
        if (!urlImagen) {
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
            return; // ya mostró error Swal
        }
    }

    // Preparar payload (solo JSON)
    const imagenActual = document.getElementById("imagen_actual")?.value || "";
    const payload = {
        nombre_categoria: nombre,
        texto_secundario: texto,
        imagen_categoria: urlImagen || imagenActual
    };

    try {
        console.log("Enviando PUT:", payload);

        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.log("Error del servidor:", errorText);
            throw new Error(errorText || `Error ${res.status}`);
        }

        const respuesta = await res.json();
        console.log("Éxito:", respuesta);

        Swal.fire("¡Éxito!", respuesta.message || "Categoría actualizada", "success");
        setTimeout(() => window.location.href = "ListadoCategoriasView.html", 1500);

    } catch (error) {
        console.error("Error al actualizar:", error);
        Swal.fire("Error", error.message || "No se pudo actualizar la categoría", "error");
    } finally {
        btn.disabled = false;
        if (textoBtn) textoBtn.textContent = "Actualizar Categoría";
        if (spinner) spinner.classList.add("hidden");
    }
};

// ================================================
// PAGINACIÓN Y OTRAS FUNCIONES
// ================================================
const anterior = () => {
    if (paginaActual > 0) {
        paginaActual--;
        cargarCategorias();
    }
};

const siguiente = () => {
    paginaActual++;
    cargarCategorias();
};

// ================================================
// INICIO
// ================================================
cargarCategorias();  // Listado

const id = new URLSearchParams(window.location.search).get("id");
if (id) {
    obtenerDatosCategoria(id);
}

// Exponer funciones
window.eliminarCategoria = eliminarCategoria;
window.actualizarCategoria = actualizarCategoria;
window.cancelar = () => window.location.href = "ListadoCategoriasView.html";
window.previsualizarImagen = previsualizarImagen;