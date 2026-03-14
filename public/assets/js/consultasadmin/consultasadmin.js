if(!localStorage.getItem("token")){
    window.location.href = "../../../index.html";
}
const nombre = localStorage.getItem("nombre");
const token = localStorage.getItem("token");

if(nombre){
    document.getElementById("nombre").textContent = "Usuario: " + nombre;
}


