const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");
const nombre = localStorage.getItem("nombre");
const id = localStorage.getItem("id");

if (token) {

    if (rol == 2) {
        // window.location.href = "pages/VistaPrivada/consultas/consultasE.html";
        window.location.replace("pages/VistaPrivada/consultas/consultasE.html");
    }
    else {
        //window.location.href = "pages/VistaPrivada/UsuariosLimit/perfil.html";
        window.location.replace("pages/VistaPrivada/UsuariosLimit/perfil.html");
    }

}




/* const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos/login"; */
const urlApi = "https://apis-propias-a-vercel.vercel.app/api/grupos/login";

const verficarSesion = () => {
    // Usamos fetch para hacer la petición HTTP

    fetch(urlApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            correo: document.getElementById("correo").value,
            contrasena: document.getElementById("password").value
        })
    })
        .then((respuesta) => respuesta.json()) // Convertimos la respuesta cruda a formato JSON

        .then((data) => {
            // La API devuelve un objeto con una propiedad 'items' que contiene el array

            if (data.message) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message
                });
                return;
            }

            const token = data.token
            const usuario = data.usuario
            const nombre = usuario.nombre
            const id = usuario.id

            localStorage.setItem("token", token);
            localStorage.setItem("rol", usuario.rol);
            localStorage.setItem("nombre", nombre);
            localStorage.setItem("id", id);


            // alert("Datos recibidos:"+ usuario.id); // Debugging en consola

            if (usuario.rol == 2) { //admin
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Inicio de sesión como administrador"
                }).then(() => {
                    window.location.href = "pages/VistaPrivada/consultas/consultasE.html";
                });
                //window.location.href = "pages/VistaPrivada/consultas/consultasE.html";
            }
            else {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Inicio de sesión como empleado"
                }).then(() => {
                    window.location.href = "pages/VistaPrivada/UsuariosLimit/perfil.html";
                });
                // window.location.href = "pages/VistaPrivada/UsuariosLimit/perfil.html";
            }
        })
        .catch((error) => {
            // Buena práctica: Manejar errores por si falla la red o la API
            console.error("Error:", error);
            alert("Hubo un error al cargar los datos. Revisa la consola.");
        });
};


function togglePassword() {
    const input = document.getElementById("password");

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}
/* INICIACCION DE SING IN WITH GOOGLE */
// Espera a que la página cargue completamente
window.onload = function () {
    // Inicializa Google (solo una vez)
    google.accounts.id.initialize({
        client_id: '958089774528-chpu3ll36ask9p4ersov7986glfu1568.apps.googleusercontent.com',  // <- My Client ID de Google Isaí
        callback: handleGoogleSignIn,  // Función que se llama cuando el usuario acepta
        auto_select: false,            // No auto-login (evita popups molestos)
        cancel_on_tap_outside: true    // Cierra si click fuera
    });
    // Renderiza el botón de Google en el div
    google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
            theme: "outline",          //  outline, filled_blue, filled_black
            size: "large",             // large / medium / small
            text: "continue_with",     // "signin_with" | "continue_with" | "signup_with"
            shape: "rectangular",
            logo_alignment: "left",
            width: 300                 // Ancho
        }
    );
    // google.accounts.id.prompt();
};
// Callback cuando el usuario completa login con Google
function handleGoogleSignIn(response) {
    if (!response.credential) {
        console.error("No credential recibido de Google");
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se recibió token de Google. Intenta de nuevo."
        });
        return;
    }
    const idTokenGoogle = response.credential;  // Este es el ID token JWT de Google

    // Enviar al repositorio
    /* fetch("https://repositorio-para-vercel-tawny.vercel.app/api/grupos/google-login", { */
    fetch("https://https://apis-propias-a-vercel.vercel.app/api/grupos/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: idTokenGoogle })
    })
        .then(respuesta => respuesta.json())
        .then(data => {
            if (data.message) {  // Error desde backend
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message
                });
                return;
            }

            // Éxito
            const token = data.token;
            const usuario = data.usuario;
            const nombre = usuario.nombre;
            const id = usuario.id;

            localStorage.setItem("token", token);
            localStorage.setItem("rol", usuario.rol);
            localStorage.setItem("nombre", nombre);
            localStorage.setItem("id", id);

            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: usuario.rol == 2 ? "Inicio de sesión como administrador" : "Inicio de sesión como empleado"
            }).then(() => {
                if (usuario.rol == 2) {
                    window.location.replace("pages/VistaPrivada/consultas/consultasE.html");
                } else {
                    window.location.replace("pages/VistaPrivada/UsuariosLimit/perfil.html");
                }
            });
        })
        .catch(error => {
            console.error("Error en Google login:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al conectar con Google. Intenta de nuevo o usa tu correo/contraseña."
            });
        });
}