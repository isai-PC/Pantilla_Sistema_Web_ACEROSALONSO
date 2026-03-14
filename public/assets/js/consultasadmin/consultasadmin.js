if(!localStorage.getItem("token")){
    window.location.href = "../../../index.html";
}
const nombre = localStorage.getItem("nombre");
const token = localStorage.getItem("token");

if(nombre){
    document.getElementById("nombre").textContent = "Usuario: " + nombre;
}

const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos";


const cargarReporte = () => {
 const params = new URLSearchParams({
  id: document.getElementById("idEmpleado").value,
  inicio: document.getElementById("fechaInicio").value,
  fin: document.getElementById("fechaFin").value
});

  fetch(urlApi+"/reporte-empleado?"+params.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }
  )
    .then((respuesta) => respuesta.json()) // Convertimos la respuesta cruda a formato JSON
    .then((data) => {
      // La API devuelve un objeto con una propiedad 'items' que contiene el array
      const reporte = data.reporte
       
      mostrar(reporte);
    })
    .catch((error) => {
      // Buena práctica: Manejar errores por si falla la red o la API
      console.error("Error al cargar los reportes:", error);
      alert("Hubo un error al cargar los datos. Revisa la consola.");
    });
};

// Función encargada de manipular el DOM
const mostrar = (reporte) => {
  const contenido = document.getElementById("reporte-empleados");
  contenido.innerHTML = "";
  // Recorremos cada producto
  reporte.forEach((dato) => {
  
let horas = Math.max(0, parseInt(dato.TotalHoras) - 9);
const fecha = new Date(dato.Fecha).toLocaleDateString("es-MX");

    contenido.innerHTML += ` <tr
              class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="py-3 px-4 font-semibold text-slate-800">${fecha}</td>
              <td class="py-3 px-4 font-semibold text-slate-800">
               ${dato.HoraEntrada}
              </td>
              <td class="py-3 px-4 text-slate-600"> ${dato.HoraSalida}</td>
              <td class="py-3 px-4 text-slate-600"> ${dato.TotalHora}</td>
              <td class="py-3 px-4 text-slate-600">${horas}</td>
              <td class="py-3 px-4 text-slate-600 text-center">
                ${dato.Incidencia}
              </td>
            </tr>
    `;
  });
};