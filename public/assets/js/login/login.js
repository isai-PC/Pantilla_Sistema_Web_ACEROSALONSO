const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");
const nombre = localStorage.getItem("nombre");

if(token){

    if(rol == 2){
       // window.location.href = "pages/VistaPrivada/consultas/consultasE.html";
window.location.replace("pages/VistaPrivada/consultas/consultasE.html");
    }
    else{
        //window.location.href = "pages/VistaPrivada/UsuariosLimit/perfil.html";
window.location.replace("pages/VistaPrivada/UsuariosLimit/perfil.html");
    }

}




const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos/login";

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
     
          if(data.message){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message
        });
        return;
    }

    const token= data.token
    const usuario = data.usuario
    const nombre = usuario.nombre

    localStorage.setItem("token", token);
    localStorage.setItem("usuarioId", usuario.id);
    localStorage.setItem("rol", usuario.rol);
    localStorage.setItem("nombre", nombre);


     // alert("Datos recibidos:"+ usuario.id); // Debugging en consola

    if(usuario.rol == 2){ //admin
         Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Inicio de sesión como administrador"
    }).then(() => {
        window.location.href = "pages/VistaPrivada/consultas/consultasE.html";
    });
        //window.location.href = "pages/VistaPrivada/consultas/consultasE.html";
    }
    else{
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
