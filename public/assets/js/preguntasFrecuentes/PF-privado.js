const urlApi = "https://repo-copia-vercel.vercel.app/api/preguntas";
const token = localStorage.getItem("token");

window.onload = function() {
    // Llamamos a la función en cuanto carga la página
    cargarPreguntas();
};

// --- OBTENER Y MOSTRAR PREGUNTAS ---
async function cargarPreguntas() {
    const tbody = document.getElementById('tbody-preguntas');
    
    tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-slate-500 font-semibold">Cargando preguntas...</td></tr>`;

    try {
        const respuesta = await fetch(urlApi);
        if (!respuesta.ok) throw new Error("Error en la petición");
        
        const json = await respuesta.json();
        const preguntas = json.data;

        tbody.innerHTML = ''

        // Si la tabla está vacía
        if (preguntas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-slate-500 font-semibold">No hay preguntas registradas en la base de datos.</td></tr>`;
            return;
        }

        // Recorremos las preguntas y armamos las filas respetando tus estilos de Tailwind
        preguntas.forEach(item => {
            const fila = document.createElement('tr');
            fila.className = "hover:bg-slate-50 transition border-b border-slate-200";
            
            fila.innerHTML = `
                <td class="py-5 px-6 text-slate-700 font-medium">
                    ${item.pregunta}
                </td>
                <td class="py-5 px-6 text-slate-600">
                    ${item.respuesta}
                </td>
                <td class="py-5 px-6">
                    <div class="flex justify-center items-center gap-4">
                        <a href="editarPregunta.html?id=${item.id}">
                            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition">
                                Editar
                            </button>
                        </a>
                        
                        <button onclick="borrarPregunta(${item.id})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition">
                            Borrar
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-red-500 font-semibold">Ocurrió un error al cargar los datos. Revisa la consola.</td></tr>`;
    }
}

// --- 2. BORRAR PREGUNTA (DELETE) ---
async function borrarPregunta(id) {
    // Mostramos la alerta de confirmación con SweetAlert2
    const confirmacion = await Swal.fire({
        title: '¿Borrar pregunta?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Color rojo de Tailwind (red-500)
        cancelButtonColor: '#94a3b8', // Color gris de Tailwind (slate-400)
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    });

    // Si el usuario le da a "Cancelar", detenemos la función
    if (!confirmacion.isConfirmed) return;

    try {
        // Hacemos la petición DELETE a la API
        const response = await fetch(`${urlApi}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Enviamos el token del administrador
            }
        });

        if (response.ok) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Pregunta eliminada", showConfirmButton: false, timer: 3000 });
            // Recargamos la tabla para que desaparezca la fila borrada
            cargarPreguntas(); 
        } else {
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudo borrar", showConfirmButton: false, timer: 3000 });
        }
    } catch (error) {
        console.error("Error al borrar:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 3000 });
    }
}