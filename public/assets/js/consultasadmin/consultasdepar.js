if (!localStorage.getItem("token")) {
  window.location.href = "../../../index.html";
}

//extraer el nombre y token del localStorage para mostrar el nombre del usuario y usar el token en las peticiones featch a la API
const nombre = localStorage.getItem("nombre");
const token = localStorage.getItem("token");

// mostrar el nombre del usuario en la página
if (nombre) {
  document.getElementById("nombre").textContent = "Usuario: " + nombre;
}


// URL de la API para cargar los usuarios
const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos";

const cargarDepartamentos = () => {

fetch(urlApi + "/departamentos", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    },
})
.then(res => res.json())
.then(result => {

    const select = document.getElementById("comboDepartamento")

    result.data.forEach(dep => {

        const option = document.createElement("option")

        option.value = dep.Id_Departamento
        option.textContent = dep.Departamento

        select.appendChild(option)

    })

})
}




const cargarReporte = () => {
 const params = new URLSearchParams({
  id: document.getElementById("comboDepartamento").value,
  inicio: document.getElementById("fechaInicio").value,
  fin: document.getElementById("fechaFin").value
});

  fetch(urlApi+"/reporte-departamento?"+params.toString(), {
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
  const contenido = document.getElementById("reporte-departamentos");
  contenido.innerHTML = "";
  // Recorremos cada producto
  reporte.forEach((dato) => {
  

const fecha = new Date(dato.Fecha).toLocaleDateString("es-MX");

    contenido.innerHTML += ` <tr
              class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="py-3 px-4 font-semibold text-slate-800">${fecha}</td>
              <td class="py-3 px-4 font-semibold text-slate-800">
               ${dato.TotalAsistencias}
              </td>
              <td class="py-3 px-4 text-slate-600"> ${dato.TotalFaltas}</td>
              <td class="py-3 px-4 text-slate-600"> ${dato.TotalHoras}</td>
              <td class="py-3 px-4 text-slate-600">${dato.TotalPermisos}</td>
              <td class="py-3 px-4 text-slate-600 text-center">
                ${dato.TotalHorasTrabajadas}
              </td>
            </tr>
    `;
  });
};