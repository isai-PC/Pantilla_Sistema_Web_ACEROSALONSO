const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/terminos";

window.onload = function() {
    // Cargar los datos al abrir la página
    cargarTerminos();

    // Asignar la función de guardar al formulario
    const form = document.getElementById('form-tyc');
    if (form) {
        form.onsubmit = guardarTerminos;
    } else {
        console.error("Error: No se encontró el formulario con el id 'form-tyc' en el HTML.");
    }
};

// --- FUNCIÓN PARA CARGAR LOS DATOS ---
async function cargarTerminos() {
    const inputTitulo = document.getElementById('titulo_1col');
    const txtContenido = document.getElementById('desc_1col');

    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    if (loading) loading.classList.remove('hidden');

    try {
        const respuesta = await fetch(urlApi);
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        
        const data = await respuesta.json();
        
        // Llenamos los inputs
        if (data.titulo && inputTitulo) inputTitulo.value = data.titulo;
        if (data.contenido && txtContenido) txtContenido.value = data.contenido;

        if (loading) loading.classList.add('hidden');
    } catch (error) {
        console.error("Error al cargar términos:", error);
        if (errorDiv) {
            errorDiv.textContent = "No pudimos cargar los términos. Intenta recargar la página.";
            errorDiv.classList.remove('hidden');
        }
        if (loading) loading.classList.add('hidden');
    }
}

// --- FUNCIÓN PARA ACTUALIZAR---
async function actualizarTyC(payload) {
    return await fetch(urlApi, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

// --- FUNCIÓN PARA GUARDAR CON VALIDACIÓN ---
function guardarTerminos(evento) {
    evento.preventDefault(); // Evita recargar la página

    const btnGuardarFinal = document.getElementById('btn-actualizar');
    const inputTitulo = document.getElementById('titulo_1col');
    const txtContenido = document.getElementById('desc_1col');

    // === VALIDACIÓN DE CAMPOS VACÍOS ===
    const tituloValor = inputTitulo?.value.trim();
    const contenidoValor = txtContenido?.value.trim();

    if (!tituloValor || !contenidoValor) {
        Swal.fire({
            icon: "warning",
            title: "Campos requeridos",
            text: "El título y el contenido no pueden estar vacíos",
            confirmButtonText: "Entendido"
        });
        return false; // No envía
    }

    // === Si pasa la validación, procedemos ===
    const payload = {
        titulo: tituloValor,
        contenido: contenidoValor
    };

    btnGuardarFinal.textContent = "actualizando...";
    btnGuardarFinal.disabled = true;

    actualizarTyC(payload)
        .then(response => {
            if (response.ok) {
                Swal.fire({ 
                    toast: true, 
                    position: "bottom-end", 
                    icon: "success", 
                    title: "Términos actualizados correctamente", 
                    showConfirmButton: false, 
                    timer: 3000 
                });
            } else {
                Swal.fire({ 
                    toast: true, 
                    position: "bottom-end", 
                    icon: "error", 
                    title: "No se pudieron actualizar los términos", 
                    showConfirmButton: false, 
                    timer: 4000 
                });
            }
        })
        .catch(error => {
            console.error("Fallo al actualizar:", error);
            Swal.fire({ 
                toast: true, 
                position: "bottom-end", 
                icon: "error", 
                title: "Fallo de conexión", 
                showConfirmButton: false, 
                timer: 4000 
            });
        })
        .finally(() => {
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = "Actualizar Cambios";
        });

    return false; // Evita envío por defecto
}