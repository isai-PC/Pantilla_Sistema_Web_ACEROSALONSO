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

  const id = document.getElementById("comboDepartamento").value.trim();
  const inicio = document.getElementById("fechaInicio").value.trim();
  const fin = document.getElementById("fechaFin").value.trim();

  //  Validación básica
  if (!id || !inicio || !fin) {
    Swal.fire({
      icon: "warning",
      title: "Campos requeridos",
      text: "Debes completar todos los campos"
    });
    return; //  detiene ejecución
  }

  // Si todo está bien
  const params = new URLSearchParams({
    id,
    inicio,
    fin
  });

  fetch(urlApi + "/reporte-departamento?" + params.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((respuesta) => respuesta.json())
    .then((data) => {
      const reporte = data.reporte;
      mostrar(reporte);
    })
    .catch((error) => {
      console.error("Error al cargar los reportes:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cargar los datos"
      });
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