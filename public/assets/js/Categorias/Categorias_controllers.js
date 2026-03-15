// categorias_Controller.js
// Listado dinámico de categorías con manejo completo de token y errores

const API_URL = "https://apis-propias-a-vercel-jtww.vercel.app/api/categorias";
const TOKEN_KEY = "token";
/* PAGINACION */
let paginaActual = 0;
const resultadosPorPagina = 10;

// ================================================
// FUNCIONES AUXILIARES
// ================================================
/* OBTENER TOKEN */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/* REDIRIGIR AL LOGIN CUANDO NO HAY TOKEN */
const redirigirIndex = () => {
    messages.error("Sesion expirada o no estás autenticado. Inicia sesión nuevamente");
    localStorage.removeItem(TOKEN_KEY);/* Limpiar token */
    window.location.href = "../../index.html";
}
/* CARGAR las CATEGORIAS CON PAGINACION */
const cargarCategorias = async () => {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;/* Si no hay tbody, salir */
    const token = getToken();/* Obtener token */
    /* SI NO HAY TOKEN */
    if (!token) {
        redirigirIndex();
        return;
    }
    tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8">Cargando categorías...</td></tr>'; /* Mostrar cragando */
    try {
        const url = `${API_URL}?limit=${resultadosPorPagina}&start=${paginaActual * resultadosPorPagina}`;/* paginacion */
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token   // ← formato exacto que usas
            }
        });
        /*  if (!response.ok) {
             if (response.status === 401 || response.status === 403) {
                 redirigirIndex();
                 return;
             }
             throw new Error(`Error ${response.status}`);
         } */
        const data = await response.json();
        const categorias = data.data || data; /* Si no hay data, tomar data */
        if (categorias.length === 0 || !categorias) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8">Sin categorias registradas</td></tr>'; /* Mostrar cragando */
            return;
        }
        /* SI TODO FUNCI0ONA A EMPEZAR A REALIZAR LA TABLA */
        tbody.innerHTML = "";
        categorias.forEach((cat) => {
            /* FILAS */
            const fila = document.createElement("tr");
            fila.className = "border-b border-slate-100 hover:bg-slate-50 transition-colors";
            /* CONTENIDO DE LAS FILAS */
            fila.innerHTML = `
            <td class="py-3 px-4">
                            <img src="${cat.imagen_categoria}" class="w-12 h-12 object-cover rounded shadow-sm border border-slate-200"> 
                        </td>                      
                        <td class="py-3 px-4 text-slate-600">${cat.nombre_categoria}</td>
                        <td class="py-3 px-4 text-center">

                            <a href="Actualizar.html?id=${cat.id_categoria}" class="inline-flex mr-2">
                                <button type="button"
                                    class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">
                                    Editar
                                </button>
                            </a>

                            <button onclick="eliminarCategoria(${cat.id_categoria})" 
                            class="bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm">
                        Borrar
                    </button>

                        </td>
        `;
            tbody.appendChild(fila);
        });
        /* ACTUALKIZAR Y NU,MEROS DE PAGINAS */
        const paginacionSpan = document.getElementById("pagina-actual");
        if (paginacionSpan) paginacionSpan.textContent = paginaActual + 1;


    } catch (error) {
        console.error("Error cargando categorías:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-8 text-red-600">Error al cargar categorías</td></tr>`;
    }

}
/* =================ELIMINAR CATEGORIA ================*/
const eliminarCategoria = async (id) => {
    /* AGREGAR LO QUE SE HIXO EN PRODUCTOS */
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    const token = obtenerToken();
    if (!token) {
        redirigirAlLogin();
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

        if (!res.ok) throw new Error("No se pudo eliminar");

        alert("Categoría eliminada correctamente");/* MODIFICAR A ALA ALERTA  */
        cargarCategorias(); // RECINICIAR LA TABLA

    } catch (error) {
        alert("Error al eliminar la categoría");
        console.error(error);
    }
};
/* ===================== PAGINACIÓN ===================== */
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

/* ===================== INICIO ===================== */

    cargarCategorias();
