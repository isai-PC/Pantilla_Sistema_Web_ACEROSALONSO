const urlBaseApi = "https://repositorio-para-vercel-tawny.vercel.app/api/perfil";

// Obtenemos los datos de la sesión
const token = localStorage.getItem("token");
const usuarioId = localStorage.getItem("id");
const nombre = localStorage.getItem("nombre"); 
window.onload = function() {
    // Si no hay sesión, mostramos alerta y mandamos al login
    if (!token || !usuarioId) {
        Swal.fire({ toast: true, position: "bottom-end", icon: "warning", title: "Inicia sesión para continuar", showConfirmButton: false, timer: 3000 }).then(() => {
            window.location.replace("../../Login/Login.html");
        });
        return;
    }
    
    // Mostrar el nombre del usuario en el menú de navegación
    if (nombre) {
        const elementoNombre = document.getElementById("nombre");
        if (elementoNombre) {
            elementoNombre.textContent = "Usuario: " + nombre;
        }
    }

    // Cargar los datos al abrir la página
    cargarDatosPerfil();

    // Conectar el formulario para guardar
    const form = document.getElementById('form-perfil');
    if (form) {
        form.onsubmit = guardarPerfil;
    }
};

// --- OBTENER DATOS ---
async function cargarDatosPerfil() {
    try {
        const respuesta = await fetch(`${urlBaseApi}/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error("Error al obtener los datos");
        
        const perfil = await respuesta.json();
        
        // Llenamos los campos si todo salió bien 
        if(perfil) {
            document.getElementById('nombre_perfil').value = `${perfil.Nombre} ${perfil.Apellido_Paterno} ${perfil.Apellido_Materno}`;
            document.getElementById('telefono_perfil').value = perfil.Telefono;
            document.getElementById('correo_perfil').value = perfil.Correo;
        }

    } catch (error) {
        console.error("Error al cargar:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No pudimos cargar tus datos", showConfirmButton: false, timer: 4000 });
    }
}

// --- ACTUALIZAR DATOS  ---
async function guardarPerfil(evento) {
    evento.preventDefault(); 

    const btnGuardar = document.getElementById('btn-guardar');
    
    // Sacamos los datos
    const correo = document.getElementById('correo_perfil').value;
    const telefono = document.getElementById('telefono_perfil').value;
    const contrasena = document.getElementById('contrasena_perfil').value;

    const payload = {
        correo: correo,
        telefono: telefono,
        // Si el usuario no escribió contraseña, no la mandamos
        contrasena: contrasena.trim() !== "" ? contrasena : undefined 
    };

    try {
        // Bloqueamos el botón mientras guarda
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

        // Evaluamos la respuesta de la API
        if (response.ok) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Perfil actualizado correctamente", showConfirmButton: false, timer: 3000 });
            
            document.getElementById('contrasena_perfil').value = ""; 
        } else {
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "No se pudo actualizar el perfil", showConfirmButton: false, timer: 4000 });
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Fallo de conexión", showConfirmButton: false, timer: 4000 });
    } finally {
        // Restauramos el botón
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Actualizar Datos";
    }
}

// --- FUNCIÓN PARA MOSTRAR/OCULTAR CONTRASEÑA ---
function togglePassword() {
    const input = document.getElementById("contrasena_perfil");

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}