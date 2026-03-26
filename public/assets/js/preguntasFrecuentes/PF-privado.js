//seguridad y datos
if (!localStorage.getItem("token")) {
    window.location.href = "../../../index.html"; // Redirige si no está logueado
}
const urlApi = "https://repo-copia-vercel.vercel.app/api/preguntas"; 
const token = localStorage.getItem("token");
const nombre = localStorage.getItem("nombre"); 

window.onload = function() {
    //Mostrar el nombre del usuario
    if (nombre) {
        const elementoNombre = document.getElementById("nombre");

        if (elementoNombre) {
            elementoNombre.textContent = "Usuario: " + nombre;
        }
    }

    // Cargar la tabla
    cargarPreguntas();
};

// --- OBTENER Y MOSTRAR PREGUNTAS  ---
async function cargarPreguntas() {
    const tbody = document.getElementById('tbody-preguntas');
    tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-slate-500 font-semibold">Cargando preguntas...</td></tr>`;

    try {
        const respuesta = await fetch(urlApi);
        if (!respuesta.ok) throw new Error("Error en la petición");
        
        const json = await respuesta.json();
        const preguntas = json.data;

        tbody.innerHTML = '';

        if (preguntas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-slate-500 font-semibold">No hay preguntas registradas.</td></tr>`;
            return;
        }

        preguntas.forEach(item => {
            const fila = document.createElement('tr');
            fila.className = "hover:bg-slate-50 transition border-b border-slate-200";
            
            const textoPregunta = item.pregunta || item.Pregunta || "Sin texto";
            const textoRespuesta = item.respuesta || item.Respuesta || "Sin respuesta";
            const idReal = item.id || item.Id || item.Id_Pregunta;

            fila.innerHTML = `
                <td class="py-5 px-6 text-slate-700 font-medium">${textoPregunta}</td>
                <td class="py-5 px-6 text-slate-600">${textoRespuesta}</td>
                <td class="py-5 px-6">
                    <div class="flex justify-center items-center gap-4">
                        <a href="editarPregunta.html?id=${idReal}">
                            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition">Editar</button>
                        </a>
                        <button onclick="borrarPregunta(${idReal})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition">Borrar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-red-500 font-semibold">Ocurrió un error al cargar los datos.</td></tr>`;
    }
}

// --- AGREGAR PREGUNTA ---
async function agregarPregunta(event) {
    event.preventDefault(); 
    const preguntaInput = document.getElementById("input-pregunta").value;
    const respuestaInput = document.getElementById("input-respuesta").value;

    if (!preguntaInput || !respuestaInput) {
        Swal.fire({ icon: 'warning', title: 'Campos vacíos', text: 'Por favor llena la pregunta y la respuesta.' });
        return;
    }

    const nuevaPregunta = {
        pregunta: preguntaInput,
        respuesta: respuestaInput
    };

    try {
        const response = await fetch(urlApi, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(nuevaPregunta)
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Pregunta agregada",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = "listadoPreguntasFrecuentes.html"; 
            });
        } else {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar la pregunta." });
        }
    } catch (error) {
        Swal.fire({ icon: "error", title: "Fallo de conexión", text: "Error de red." });
    }
}

// --- BORRAR PREGUNTA ---
async function borrarPregunta(id) {
    const confirmacion = await Swal.fire({
        title: '¿Borrar pregunta?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
        const response = await fetch(`${urlApi}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Pregunta eliminada", showConfirmButton: false, timer: 3000 });
            cargarPreguntas(); 
        } else {
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudo borrar", showConfirmButton: false, timer: 3000 });
        }
    } catch (error) {
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 3000 });
    }
}