if(!localStorage.getItem("token")){
    window.location.href = "../../../index.html";
}
const nombre = localStorage.getItem("nombre");

if(nombre){
    document.getElementById("nombre").textContent = "Usuario: " + nombre;
}



const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos";

let hayresultados = true;
let paginaActual = 1;
const resultadosPorPagina = 10;



const paginado = (pagina) => {
    if (pagina === 0 && paginaActual <= 1) 
        return;
    if (pagina === 1 && hayresultados){ //avanzamos y si hya resultados
        paginaActual++;
    }
   // si llega 1 adelanrte si llega 0 atra

}