if(!localStorage.getItem("token")){
    window.location.href = "../../../index.html";
}
const nombre = localStorage.getItem("nombre");

if(nombre){
    document.getElementById("nombre").textContent = "Usuario: " + nombre;
}
