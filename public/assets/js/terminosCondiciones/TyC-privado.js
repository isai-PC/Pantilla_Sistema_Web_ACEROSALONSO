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

    try {
        const respuesta = await fetch(urlApi);
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        
        const data = await respuesta.json();
        
        // Llenamos los inputs con la información de la API
        if (data.titulo && inputTitulo) inputTitulo.value = data.titulo;
        if (data.contenido && txtContenido) txtContenido.value = data.contenido;
    } catch (error) {
        console.error("Error al cargar términos:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No pudimos cargar los términos", showConfirmButton: false, timer: 4000 });
    }
}

async function actualizarTyC(payload) {
    return await fetch(urlApi, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

// --- FUNCIÓN PARA GUARDAR ---
async function guardarTerminos(evento) {
    // Evita que la página parpadee o se recargue
    evento.preventDefault(); 

    const btnGuardarFinal = document.getElementById('btn-actualizar');
    
    // Armamos el payload con lo que el usuario escribió
    const payload = {
        titulo: document.getElementById('titulo_1col').value,
        contenido: document.getElementById('desc_1col').value
    };

    try {
        // Cambiamos estado del botón
        btnGuardarFinal.textContent = "actualizando...";
        btnGuardarFinal.disabled = true;
        
        // Llamamos a la API
        let response = await actualizarTyC(payload);

        // Evaluamos la respuesta de la API y lanzamos el SweetAlert
        if (response.ok) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Términos actualizados correctamente", showConfirmButton: false, timer: 3000 });
        } else {
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudieron actualizar los términos", showConfirmButton: false, timer: 4000 });
        }
    } catch (error) {
        console.error("Fallo al actualizar:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 4000 });
    } finally {
        // Restauramos el botón sin importar si hubo error o éxito
        btnGuardarFinal.disabled = false;
        btnGuardarFinal.textContent = "actualizar Cambios";
    }
}