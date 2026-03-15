
const urlBaseApi = "https://repositorio-para-vercel-tawny.vercel./api/perfil";

// Obtenemos los datos de la sesión guardados en tu login
const token = localStorage.getItem("token");
const usuarioId = localStorage.getItem("usuarioId");

window.onload = function() {
    // Si no hay token o ID, lo mandamos al login por seguridad
    if (!token || !usuarioId) {
        window.location.replace("../../Login/Login.html");
        return;
    }

    cargarDatosPerfil();

    const form = document.getElementById('form-perfil');
    if (form) form.onsubmit = guardarPerfil;
};

// --- CARGAR DATOS ACTUALES (GET) ---
async function cargarDatosPerfil() {
    const inputNombre = document.getElementById('nombre_perfil');
    const inputTelefono = document.getElementById('telefono_perfil');
    const inputCorreo = document.getElementById('correo_perfil');

    try {
        const respuesta = await fetch(`${urlBaseApi}/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Enviamos el token por seguridad
            }
        });

        if (!respuesta.ok) throw new Error("Error al obtener los datos");
        
        const perfil = await respuesta.json();
        
        // Llenamos los campos. 
        // Armamos el nombre completo concatenando lo que llega de la BD
        if (perfil) {
            inputNombre.value = `${perfil.Nombre} ${perfil.Apellido_Paterno} ${perfil.Apellido_Materno}`;
            inputTelefono.value = perfil.Telefono;
            inputCorreo.value = perfil.Correo;
        }
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Error al cargar tu información", showConfirmButton: false, timer: 4000 });
    }
}

// --- ACTUALIZAR DATOS (PUT) ---
async function guardarPerfil(evento) {
    evento.preventDefault(); 

    const btnGuardar = document.getElementById('btn-guardar');
    
    // Obtenemos los valores
    const correo = document.getElementById('correo_perfil').value;
    const telefono = document.getElementById('telefono_perfil').value;
    const contrasena = document.getElementById('contrasena_perfil').value;

    const payload = {
        correo: correo,
        telefono: telefono,
        // Solo enviamos la contraseña si el usuario escribió algo
        contrasena: contrasena.trim() !== "" ? contrasena : undefined 
    };

    try {
        btnGuardar.textContent = "Actualizando...";
        btnGuardar.disabled = true;
        
        const response = await fetch(`${urlBaseApi}/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Enviamos el token
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Perfil actualizado correctamente", showConfirmButton: false, timer: 3000 });
            // Limpiamos el campo de contraseña por seguridad
            document.getElementById('contrasena_perfil').value = ""; 
        } else {
            const errorData = await response.json();
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: errorData.message || "No se pudo actualizar el perfil", showConfirmButton: false, timer: 4000 });
        }
    } catch (error) {
        console.error("Fallo al guardar:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 4000 });
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Actualizar Datos";
    }
}