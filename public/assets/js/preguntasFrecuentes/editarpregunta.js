const urlApi = "https://repo-copia-vercel.vercel.app/api/preguntas";
const token = localStorage.getItem("token");

// Extraer el ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const idPregunta = urlParams.get('id');

window.onload = function() {
    if (!idPregunta) {
        window.location.replace("listadoPreguntasFrecuentes.html");
        return;
    }

    cargarDatosPregunta();

    const form = document.getElementById('form-editar');
    if (form) {
        form.onsubmit = actualizarPregunta;
    }
};

// --- OBTENER LOS DATOS ACTUALES ---
async function cargarDatosPregunta() {
    try {
        const respuesta = await fetch(`${urlApi}/${idPregunta}`);
        if (!respuesta.ok) throw new Error("No se pudo obtener la pregunta");
        
        const pregunta = await respuesta.json();

        document.getElementById('titulo_1col').value = pregunta.pregunta;
        document.getElementById('desc_1col').value = pregunta.respuesta;

    } catch (error) {
        console.error("Error al cargar:", error);
        // Usamos SweetAlert2 para el error
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Error al cargar datos", showConfirmButton: false, timer: 3000 });
    }
}

// --- ACTUALIZAR DATOS ---
async function actualizarPregunta(evento) {
    evento.preventDefault(); 

    const btnGuardar = document.getElementById('btnGuardarFinal');
    
    const payload = {
        pregunta: document.getElementById('titulo_1col').value,
        respuesta: document.getElementById('desc_1col').value
    };

    try {
        btnGuardar.textContent = "Actualizando...";
        btnGuardar.disabled = true;

        const response = await fetch(`${urlApi}/${idPregunta}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // AQUÍ ESTÁ EL MENSAJE CON SWEETALERT2 (Sin redireccionar)
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Pregunta actualizada correctamente", showConfirmButton: false, timer: 3000 });
        } else {
            // MENSAJE DE ERROR CON SWEETALERT2
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudo actualizar", showConfirmButton: false, timer: 3000 });
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 3000 });
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Actualizar Pregunta";
    }
}