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
  const id = document.getElementById("idEmpleado").value.trim();
  const inicio = document.getElementById("fechaInicio").value.trim();
  const fin = document.getElementById("fechaFin").value.trim();

  //  Validación básica
  if (!id || !inicio || !fin) {
    Swal.fire({
      icon: "warning",
      title: "Campos requeridos",
      text: "Debes completar todos los campos"
    });
    return; //  detiene la ejecución
  }

  //  Si todo está lleno, sigue normal
  const params = new URLSearchParams({
    id,
    inicio,
    fin
  });

  fetch(urlApi + "/reporte-empleado?" + params.toString(), {
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
      cargarDatos()
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


const cargarDatos = () => {

const id = localStorage.getItem("id");
  //  Si todo está lleno, sigue normal
  fetch("https://repositorio-para-vercel-tawny.vercel.app/api/grupos/empleados/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(res => res.json())
    .then(respuesta=> {
      const empleado = respuesta
    
        document.getElementById('NOMBRE').value = empleado.Nombre +" "+empleado.Apellido_Paterno+" "+empleado.Apellido_Materno || '';
        document.getElementById('PUESTO').value = empleado.Puesto || '';
        document.getElementById('DEPARTAMENTO').value = empleado.Departamento || '';
    
    })
    .catch(err => console.error('Error al cargar producto', err));

};