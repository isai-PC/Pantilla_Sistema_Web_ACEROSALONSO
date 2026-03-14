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
