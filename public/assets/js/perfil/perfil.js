const urlBaseApi = "https://repositorio-para-vercel-tawny.vercel.app/api/perfil";
const token = localStorage.getItem("token");
const usuarioId = localStorage.getItem("usuarioId");

window.onload = function() {
    // Verificamos si hay sesión
    if (!token || !usuarioId) {
        alert("No hay sesión activa. Por favor inicia sesión.");
        window.location.replace("../../Login/Login.html");
        return;
    }
    
    // Llamamos a la función
    cargarDatosPerfil();
};

async function cargarDatosPerfil() {
    
    try {
        const respuesta = await fetch(`${urlBaseApi}/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        if (!respuesta.ok) {
            alert("El servidor respondió con error: " + respuesta.status);
            return;
        }
        
        const perfil = await respuesta.json();
        console.log("4. Datos que llegaron de la base de datos:", perfil);
        
        // Llenamos los campos si todo salió bien
        if(perfil) {
            document.getElementById('nombre_perfil').value = `${perfil.Nombre} ${perfil.Apellido_Paterno} ${perfil.Apellido_Materno}`;
            document.getElementById('telefono_perfil').value = perfil.Telefono;
            document.getElementById('correo_perfil').value = perfil.Correo;
            alert("¡Datos cargados con éxito!");
        }

    } catch (error) {
        console.error("--- ERROR DETECTADO ---");
        console.error(error);
        alert("La petición falló. Mira la consola (F12) para ver por qué Vercel rechazó la conexión.");
    }
}

// Actualiza tu window.onload para agregar el evento del formulario
window.onload = function() {
    if (!token || !usuarioId) {
        alert("No hay sesión activa. Por favor inicia sesión.");
        window.location.replace("../../Login/Login.html");
        return;
    }
    cargarDatosPerfil();

    // NUEVO: Conectamos el botón de guardar
    const form = document.getElementById('form-perfil');
    if (form) {
        form.onsubmit = guardarPerfil;
    }
};

// ... (Aquí va tu función cargarDatosPerfil que ya funciona) ...

// --- NUEVA FUNCIÓN PARA GUARDAR (PUT) ---
async function guardarPerfil(evento) {
    evento.preventDefault(); 
    console.log("--- INICIANDO GUARDADO ---");

    const btnGuardar = document.getElementById('btn-guardar');
    
    // Sacamos los datos que escribiste en las cajitas
    const correo = document.getElementById('correo_perfil').value;
    const telefono = document.getElementById('telefono_perfil').value;
    const contrasena = document.getElementById('contrasena_perfil').value;

    const payload = {
        correo: correo,
        telefono: telefono,
        // Si dejaste la contraseña en blanco, no la enviamos
        contrasena: contrasena.trim() !== "" ? contrasena : undefined 
    };

    console.log("1. Datos que vamos a enviar a Vercel:", payload);

    try {
        btnGuardar.textContent = "Actualizando...";
        btnGuardar.disabled = true;
        
        const response = await fetch(`${urlBaseApi}/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        console.log("2. Status de respuesta al guardar:", response.status);

        if (response.ok) {
            alert("¡Tus datos se actualizaron correctamente!");
            document.getElementById('contrasena_perfil').value = ""; // Limpiamos la contraseña
        } else {
            const errorData = await response.json();
            console.error("Error del backend:", errorData);
            alert("No se pudo actualizar: " + (errorData.message || "Revisa la consola"));
        }
    } catch (error) {
        console.error("--- ERROR AL GUARDAR ---", error);
        alert("Fallo la conexión al intentar guardar los datos.");
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Actualizar Datos";
    }
}