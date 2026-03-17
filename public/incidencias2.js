const API_EMPLEADOS = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/empleados";
const API_DEPARTAMENTOS = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/departamentos";

let paginaActual = 0;
const resultadosPorPagina = 10;

let modoActual = "empleados"; // controla que listado se muestra


// ==============================
// LISTAR EMPLEADOS
// ==============================
const listarEmpleados = () => {

    modoActual = "empleados";
    paginaActual = 0;

    cargarEmpleados(0);
};


// ==============================
// CARGAR EMPLEADOS (API)
// ==============================
const cargarEmpleados = (direccion) => {

    let paginaConsulta = paginaActual;

    if (direccion === 1) {
        paginaConsulta = paginaActual + 1;
    }

    if (direccion === 0 && paginaActual > 0) {
        paginaConsulta = paginaActual - 1;
    }

    fetch(API_EMPLEADOS + "?limit=" + resultadosPorPagina + "&start=" + (paginaConsulta * resultadosPorPagina))
        .then(res => res.json())
        .then(data => {

            const empleados = data.data;

            if (direccion === 1 && empleados.length === 0) return;

            paginaActual = paginaConsulta;

            document.getElementById("paginaActual").textContent = paginaActual + 1;

            mostrarEmpleados(empleados);

        })
        .catch(err => console.error(err));
};



// ==============================
// MOSTRAR EMPLEADOS EN TABLA
// ==============================
const mostrarEmpleados = (empleados) => {

    const tabla = document.getElementById("tabla-empleados");

    tabla.innerHTML = "";

    empleados.forEach(emp => {

        tabla.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">

            <td class="py-3 px-4 font-semibold text-slate-800">
                ${emp.Nombre_Completo}
            </td>

            <td class="py-3 px-4 text-slate-600">
                ${emp.Departamento}
            </td>

            <td class="py-3 px-4 text-slate-600">
                ${emp.Puesto}
            </td>

            <td class="py-3 px-4 text-center">

                <button
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg mr-2">
                    Ver
                </button>

            </td>

        </tr>
        `;
    });

};



// ==============================
// LISTAR DEPARTAMENTOS
// ==============================
const listarDepartamentos = () => {

    modoActual = "departamentos";

    fetch(API_DEPARTAMENTOS)
        .then(res => res.json())
        .then(data => {

            mostrarDepartamentos(data.data);

        })
        .catch(err => console.error(err));

};



// ==============================
// MOSTRAR DEPARTAMENTOS
// ==============================
const mostrarDepartamentos = (deps) => {

    const tabla = document.getElementById("tabla-empleados");

    tabla.innerHTML = "";

    deps.forEach(dep => {

        tabla.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">

            <td class="py-3 px-4 font-semibold text-slate-800">
                ${dep.Departamento}
            </td>

            <td class="py-3 px-4 text-slate-600">
                ${dep.Id_Departamento}
            </td>

            <td class="py-3 px-4 text-slate-600">
                -
            </td>

            <td class="py-3 px-4 text-center">
                -
            </td>

        </tr>
        `;
    });

};



// ==============================
// PAGINACIÓN
// ==============================
const cambiarPagina = (direccion) => {

    if (modoActual === "empleados") {

        cargarEmpleados(direccion);

    }

};



// ==============================
// BUSCADOR SIMPLE
// ==============================
document.getElementById("busqueda").addEventListener("keyup", e => {

    const texto = e.target.value.toLowerCase();

    const filas = document.querySelectorAll("#tabla-empleados tr");

    filas.forEach(fila => {

        const contenido = fila.textContent.toLowerCase();

        fila.style.display = contenido.includes(texto) ? "" : "none";

    });

});