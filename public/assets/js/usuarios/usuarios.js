//asegurarnos de que el usuario esté autenticado antes de mostrar la página
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

// extraer el id del empleado de la URL para mostrar los datos del producto a editar
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// URL de la API para cargar los usuarios
const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/grupos";

// variables para controlar la paginación
let hayresultados = true;
let paginaActual = 0;
const resultadosPorPagina = 10;

// https://repositorio-para-vercel-tawny.vercel.app/api/grupos?limit=10&start=150
const cargarUsuarios = (pagina) => {
  let paginaConsulta = paginaActual;

  // si quiere avanzar
  if (pagina === 1) {
    paginaConsulta = paginaActual + 1;
  }

  // si quiere retroceder
  if (pagina === 0 && paginaActual > 0) {
    paginaConsulta = paginaActual - 1;
  }

  fetch(
    urlApi +
      "?limit=" +
      resultadosPorPagina +
      "&start=" +
      paginaConsulta * resultadosPorPagina,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  )
    .then((respuesta) => respuesta.json())
    .then((data) => {
      const usuarios = data.data;

      // si intentamos avanzar pero no hay resultados
      if (pagina === 1 && usuarios.length === 0) {
        hayresultados = false;
        return; // no cambiamos de página
      }

      // si sí hay resultados actualizamos la página
      paginaActual = paginaConsulta;

      document.getElementById("pagina1").textContent = paginaActual + 1;
      document.getElementById("pagina2").textContent = paginaActual + 2;

      mostrar(usuarios);
    })
    .catch((error) => {
      console.error("Error al cargar los usuarios:", error);
      alert("Hubo un error al cargar los datos. Revisa la consola.");
    });
};

// Función encargada de manipular el DOM
const mostrar = (usuarios) => {
  const tabla = document.getElementById("tabla-empleados");

  tabla.innerHTML = "";

  usuarios.forEach((emp) => {
    tabla.innerHTML += `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-semibold text-slate-600">${emp.Nombre}</td>
        <td class="py-3 px-4 font-semibold text-slate-600">${emp.Correo}</td>
        <td class="py-3 px-4 text-slate-600">${emp.Telefono}</td>
        <td class="py-3 px-4 text-slate-600">${emp.Departamento}</td>
        <td class="py-3 px-4 text-slate-600">${emp.Puesto}</td>
        

        <td class="py-3 px-4 text-center">
                    <a href="actualizarEmpleado.html?id=${emp.Id_Empleado}" class="inline-flex mr-2">
                        <button type="button" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">
                            Editar
                        </button>
                    </a>
                    <button type="button" onclick="borrarEmpleado(${emp.Id_Empleado})" class="inline-flex items-center justify-center text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">
                        Borrar
                    </button>
                </td>
    </tr>
    `;
  });
};

const urlValues= "https://repositorio-para-vercel-tawny.vercel.app/api/grupos/empleado-value/"

const cargarDatosEmpleado = () => {
    if(!id) return;
    fetch(urlValues + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    })
    .then(res => res.json())
    .then(respuesta=> {
      empleado = respuesta.data;
    
        document.getElementById('name').value = empleado.Nombre || '';
        document.getElementById('apellidoPaterno').value = empleado.Apellido_Paterno || '';
        document.getElementById('apellidoMaterno').value = empleado.Apellido_Materno || '';
        document.getElementById('correo').value = empleado.Correo || '';
        document.getElementById('telefono').value = empleado.Telefono || '';
        document.getElementById('comboDepartamento').value = empleado.Id_Departamento || '';
        document.getElementById('comboPuesto').value = empleado.Id_Puesto || '';
        document.getElementById('comboTipoUsuario').value = empleado.Id_Tipo_Usuario || '';
    })
    .catch(err => console.error('Error al cargar producto', err));
}



//cargar los departamentos para mostrarlos en el select del formulario
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

//cargar los puestos para mostrarlos en el select del formulario
const cargarPuestos = () => {

fetch(urlApi + "/puestos", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    },
})
.then(res => res.json())
.then(result => {

    const select = document.getElementById("comboPuesto")

    result.data.forEach(p => {

        const option = document.createElement("option")

        option.value = p.Id_Puesto
        option.textContent = p.Puesto

        select.appendChild(option)

    })

})
}

//cargar los tipos de usuario para mostrarlos en el select del formulario
const cargarTiposUsuario = () => {

fetch(urlApi + "/tipos-usuario", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    },
})
.then(res => res.json())
.then(result => {

    const select = document.getElementById("comboTipoUsuario")

    result.data.forEach(t => {

        const option = document.createElement("option")

        option.value = t.Id_Tipo_Usuario
        option.textContent = t.Usuario

        select.appendChild(option)

    })

})
}

const cargarCatalogos =  () => {

   cargarDepartamentos()
     cargarPuestos()
    cargarTiposUsuario()
     

}

const actualizarEmpleado = async () => {
    const nombre = document.getElementById('name').value.trim();
    const apellidoP = document.getElementById('apellidoPaterno').value.trim();
    const apellidoM = document.getElementById('apellidoMaterno').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const departamento = document.getElementById('comboDepartamento').value;
    const puesto = document.getElementById('comboPuesto').value;
    const tipoUsuario = document.getElementById('comboTipoUsuario').value;
    

    if(!nombre || !apellidoP || !apellidoM || !correo || !telefono || !departamento || !puesto || !tipoUsuario){
        
        Swal.fire({
            icon: "warning",
            title: "Campos requeridos",
            text: "Debes completar todos los campos obligatorios"
        });

        return;
    }

    const empleado = {
        nombre: nombre,
        apaterno: apellidoP,
        amaterno: apellidoM,
        correo: correo,
        telefono: telefono,
        contrasena: contrasena,
        tipo_usuario: parseInt(tipoUsuario),
        departamento: parseInt(departamento),
        puesto: parseInt(puesto)
    };

    try {

        const response = await fetch(urlApi + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(empleado)
        });

        const data = await response.json();

        if(!response.ok){
            Swal.fire({ 
                toast: true, 
                position: "bottom-end", 
                icon: "error", 
                title: "error", 
                showConfirmButton: false, 
                timer: 4000 
                });
            return;
            
            
        }

            Swal.fire({ 
            toast: true, 
            position: "bottom-end", 
            icon: "success", 
            title: "Empleado actualizado",
            text:"El empleado fue actualizado correctamente", 
            showConfirmButton: false, 
            timer: 3000 
            });

        console.log("Respuesta API:", data);
        limpiarCampos()

    } catch(error){
        Swal.fire({ 
            toast: true, 
            position: "bottom-end",         
            icon: "error", 
            title: "Error del servidor",
            text: "No se pudo actualizar el empleado",
            showConfirmButton: false, 
            timer: 4000 
            });

        console.error(error);
    }

};




const borrarEmpleado = async (id) => {

    if(!id){
        Swal.fire({ 
            toast: true, 
            position: "bottom-end",        
            icon: "error", 
            title: "Error",
            text: "No se encontró el id del empleado",
            showConfirmButton: false, 
            timer: 4000 
        });
        return;
    }

    // confirmación antes de borrar
    const result = await Swal.fire({ 
        title: "¿Eliminar empleado?",
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if(!result.isConfirmed){ 
        return;
    }

    try{
        const response = await fetch(urlApi + "/" + id, {
            method: "DELETE",
            headers:{
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json().catch(() => ({}));

        if(!response.ok){
            Swal.fire({
                icon: 'error',
                title: 'Error al borrar',
                text: data.message || data.error || "No se pudo eliminar el empleado" 
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Empleado eliminado",
            text: "El empleado fue eliminado correctamente"
        }).then(()=>{
            // redirigir al listado
            window.location.href = "listadoUsuarios.html";
            
        });

    }catch(error){
        Swal.fire({ 
            toast: true, 
            position: "bottom-end",        
            icon: "error", 
            title: "Error del servidor",
            text: "No se pudo eliminar el empleado",
            showConfirmButton: false, 
            timer: 4000 
        });

        console.error(error);
    }
};

window.borrarEmpleado = borrarEmpleado;




const crearEmpleado = async () => {
    const nombre = document.getElementById('name').value.trim();
    const apellidoP = document.getElementById('apellidoPaterno').value.trim();
    const apellidoM = document.getElementById('apellidoMaterno').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const departamento = document.getElementById('comboDepartamento').value;
    const puesto = document.getElementById('comboPuesto').value;
    const tipoUsuario = document.getElementById('comboTipoUsuario').value;
    const contrasena = document.getElementById('contrasena').value.trim();

    if(!nombre || !apellidoP || !apellidoM || !correo || !telefono || !departamento || !puesto || !tipoUsuario || !contrasena){
        
                    Swal.fire({ 
            toast: true, 
            position: "bottom-end",         
            icon: "warning", 
            title: "Campos requeridos",
            text: "Debes completar todos los campos obligatorios",
            showConfirmButton: false, 
            timer: 4000 
            });
        return;
    }

    const empleado = {
        nombre: nombre,
        apaterno: apellidoP,
        amaterno: apellidoM,
        correo: correo,
        telefono: telefono,
        contrasena: contrasena,
        tipo_usuario: parseInt(tipoUsuario),
        departamento: parseInt(departamento),
        puesto: parseInt(puesto)
    };

    try {

        const response = await fetch(urlApi + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(empleado)
        });

        const data = await response.json();

        if(!response.ok){
            Swal.fire({ 
                toast: true, 
                position: "bottom-end", 
                icon: "error", 
                title: "error", 
                showConfirmButton: false, 
                timer: 4000 
                });
            return;
        }
            Swal.fire({ 
            toast: true, 
            position: "bottom-end", 
            icon: "success", 
            title: "Empleado Creado",
            text:"El empleado fue creado correctamente", 
            showConfirmButton: false, 
            timer: 3000 
            });
        console.log("Respuesta API:", data);
        limpiarCampos()

    } catch(error){
            Swal.fire({ 
            toast: true, 
            position: "bottom-end",         
            icon: "error", 
            title: "Error del servidor",
            text: "No se pudo crear el empleado",
            showConfirmButton: false, 
            timer: 4000 
            });

        console.error(error);
    }

};





const limpiarCampos = () => {
  document.getElementById('name').value = '';
  document.getElementById('apellidoPaterno').value = '';
  document.getElementById('apellidoMaterno').value = '';
  document.getElementById('correo').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('contrasena').value = '';
};