// categorias_Controller.js
// Listado dinámico de categorías con manejo completo de token y errores

const API_URL = "https://apis-propias-a-vercel-jtww.vercel.app/api/categorias";
const TOKEN_KEY = "token_admin_aceros"; // misma clave que usas en login

// ================================================
// FUNCIONES AUXILIARES
// ================================================

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function mostrarMensaje(tipo, texto) {
    const success = document.querySelector('.bg-green-100');
    const error = document.querySelector('.bg-red-100');

    if (!success || !error) return;

    success.classList.add('hidden');
    error.classList.add('hidden');

    if (tipo === 'success') {
        success.textContent = texto;
        success.classList.remove('hidden');
    } else {
        error.textContent = texto;
        error.classList.remove('hidden');
    }

    setTimeout(() => {
        success.classList.add('hidden');
        error.classList.add('hidden');
    }, 5000);
}

// Redirige a login y limpia token
function redirigirAlLogin(mensaje = "Sesión expirada. Inicia sesión nuevamente.") {
    mostrarMensaje('error', mensaje);
    localStorage.removeItem(TOKEN_KEY);
    setTimeout(() => {
        window.location.href = "../Login/Login.html";
    }, 1500);
}

// ================================================
// CARGAR Y MOSTRAR CATEGORÍAS
// ================================================
async function cargarCategorias() {
    const tbody = document.querySelector('tbody');
    if (!tbody) {
        console.error("No se encontró <tbody> en la página");
        return;
    }

    // Limpiar tabla
    tbody.innerHTML = '<tr><td colspan="3" class="py-8 text-center">Cargando categorías...</td></tr>';

    const token = getToken();

    // 1. No hay token → redirigir
    if (!token) {
        redirigirAlLogin("No estás autenticado. Inicia sesión.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // 2. Manejo de códigos de error comunes
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                redirigirAlLogin("Token inválido o expirado.");
                return;
            }
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Error ${response.status}`);
        }

        const categorias = await response.json();

        // 3. Tabla vacía
        if (!categorias || categorias.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="py-8 text-center text-slate-500">
                        No hay categorías registradas aún.
                    </td>
                </tr>
            `;
            return;
        }

        // 4. Renderizar filas
        tbody.innerHTML = ''; // limpiar mensaje de carga

        categorias.forEach(cat => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors';

            tr.innerHTML = `
                <td class="py-3 px-4">
                    ${cat.imagen_categoria ? `
                        <img src="${cat.imagen_categoria}" alt="${cat.nombre_categoria}"
                             class="w-12 h-12 object-cover rounded shadow-sm border border-slate-200">
                    ` : `
                        <div class="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs">
                            Sin imagen
                        </div>
                    `}
                </td>
                <td class="py-3 px-4 text-slate-600 font-medium">
                    ${cat.nombre_categoria}
                    ${cat.texto_secundario ? `<br><small class="text-slate-500">${cat.texto_secundario}</small>` : ''}
                </td>
                <td class="py-3 px-4 text-center flex gap-2 justify-center">
                    <a href="Actualizar.html?id=${cat.id_categoria}" class="inline-flex">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold transition">
                            Editar
                        </button>
                    </a>
                    <button onclick="eliminarCategoria(${cat.id_categoria})"
                            class="bg-red-500 hover:bg-red-700 text-white px-4 py-1.5 rounded font-bold transition">
                        Borrar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="py-8 text-center text-red-600">
                    Error al cargar las categorías
                </td>
            </tr>
        `;
        mostrarMensaje('error', `No se pudieron cargar las categorías: ${error.message}`);
    }
}

// ================================================
// ELIMINAR CATEGORÍA (ejemplo básico)
// ================================================
async function eliminarCategoria(id) {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    const token = getToken();
    if (!token) {
        redirigirAlLogin();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo eliminar la categoría");
        }

        mostrarMensaje('success', "Categoría eliminada correctamente");
        cargarCategorias(); // recargar tabla

    } catch (error) {
        mostrarMensaje('error', `Error al eliminar: ${error.message}`);
    }
}

// ================================================
// INICIO
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
});