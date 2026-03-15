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

        if (idHidden) idHidden.value = categoria.id_categoria;
        if (nombreInput) nombreInput.value = categoria.nombre_categoria || "";
        if (textoInput) textoInput.value = categoria.texto_secundario || "";
        if (preview) preview.src = categoria.imagen_categoria || "https://via.placeholder.com/150?text=Sin+Imagen";

        return categoria;

    } catch (error) {
        console.error("Error al obtener categoría:", error);
        Swal.fire("Error", "No se pudo cargar la categoría", "error");
        return null;
    }
};

// ================================================
// ACTUALIZAR CATEGORÍA
// ================================================
const actualizarCategoria = async () => {
    const id = document.getElementById("id_categoria_hidden")?.value;
    const nombre = document.getElementById("nombre_categoria")?.value?.trim();
    const texto = document.getElementById("texto_secundario")?.value?.trim();
    const inputFile = document.getElementById("imagenInput");

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

    const textoOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"></path></svg> Actualizando...';

    const formData = new FormData();
    formData.append("nombre_categoria", nombre);
    formData.append("texto_secundario", texto);

    if (inputFile?.files?.[0]) {
        formData.append("imagen_categoria", inputFile.files[0]);
    }

    try {
        console.log("Enviando PUT a:", `${API_URL}/${id}`); // para depurar

        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token
            },
            body: formData
        });

        console.log("Status recibido:", res.status); // clave para depurar

        if (!res.ok) {
            const errorText = await res.text();
            console.log("Respuesta de error:", errorText);
            throw new Error(errorText || `Error ${res.status}`);
        }

        const respuesta = await res.json();
        console.log("Respuesta éxito:", respuesta);

        Swal.fire("¡Éxito!", respuesta.message || "Categoría actualizada", "success");
        setTimeout(() => window.location.href = "ListadoCategoriasView.html", 1500);

    } catch (error) {
        console.error("Error completo al actualizar:", error);
        Swal.fire("Error", error.message || "No se pudo actualizar la categoría", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
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