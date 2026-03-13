if(!localStorage.getItem("token")){
    window.location.href = "../../../index.html";
}
const nombre = localStorage.getItem("nombre");
const token = localStorage.getItem("token");

if(nombre){
    document.getElementById("nombre").textContent = "Usuario: " + nombre;
}



const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos";

let hayresultados = true;
let paginaActual = 0;
const resultadosPorPagina = 10;


const paginado = (pagina) => {
    if (pagina === 0 && paginaActual <= 0) 
        return;
    if (pagina === 1 && hayresultados){ //avanzamos y si hya resultados
        paginaActual++;
    }

    if (pagina === 0 && paginaActual > 0) { //retrocedemos y si no estamos en la primera pagina
        paginaActual--;
    }
   // si llega 1 adelanrte si llega 0 atra

   document.getElementById("pagina1").textContent = paginaActual + 1;
    document.getElementById("pagina2").textContent = paginaActual + 2;
    cargarUsuarios();

}


// https://repositorio-para-vercel-tawny.vercel.app/api/grupos?limit=10&start=150
const cargarUsuarios = () => {
  // Usamos fetch para hacer la petición HTTP
  fetch(urlApi + "?limit=" + resultadosPorPagina + "&start=" + (paginaActual  * resultadosPorPagina), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  })
    .then((respuesta) => respuesta.json()) // Convertimos la respuesta cruda a formato JSON
    .then((data) => {
     
      const usuarios = data.data;

      if(data.data.length === 0){ //validar que vemngna resultados
    hayresultados = false;
}
     

     

      // Llamamos a la función que se encarga de dibujar en pantalla
      mostrar(usuarios);
    })
    .catch((error) => {
      // Buena práctica: Manejar errores por si falla la red o la API
      console.error("Error al cargar los usuarios:", error);
      alert("Hubo un error al cargar los datos. Revisa la consola.");
    });
};

// Función encargada de manipular el DOM
const mostrar = (usuarios) => {
  const tabla = document.getElementById("tabla-empleados");

  tabla.innerHTML = "";
  

    
usuarios.forEach(emp => {

    tabla.innerHTML += `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-semibold text-slate-600">${emp.Nombre}</td>
        <td class="py-3 px-4 font-semibold text-slate-600">${emp.Correo}</td>
        <td class="py-3 px-4 text-slate-600">${emp.Telefono}</td>
        <td class="py-3 px-4 text-slate-600">${emp.Departamento}</td>
        <td class="py-3 px-4 text-slate-600">${emp.Puesto}</td>
        

        <td class="py-3 px-4 text-center">
                    <a href="../../../pages/VistaPrivada/Productos/FormularioActualizar.html?id=${id}" class="inline-flex mr-2">
                        <button type="button" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">
                            Editar
                        </button>
                    </a>
                    <button type="button" onclick="eliminarProducto(${id})" class="inline-flex items-center justify-center text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">
                        Borrar
                    </button>
                </td>
    </tr>
    `;
  });
};

