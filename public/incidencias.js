// API DEL SISTEMA
const API = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias";
const API_EMPLEADOS = API + "/empleados";
const API_DEPARTAMENTOS = API + "/departamentos";

// VARIABLES GLOBALES
let mesActual = 0;
let mesAnterior = 0;
let mesAnterior2 = 0;

let pred1 = 0, pred2 = 0, pred3 = 0, pred4 = 0;
let chart = null;

let paginaActual = 0;
const resultadosPorPagina = 10;
let modoActual = "empleados";

// ==============================
// FUNCIONES DE FECHA Y MESES
// ==============================
const obtenerFecha = () => {
    const hoy = new Date();
    return { dia: hoy.getDate(), mes: hoy.getMonth() + 1, anio: hoy.getFullYear() };
};

const diasMes = (anio, mes) => new Date(anio, mes, 0).getDate();

const obtenerMesRelativo = (offset) => {
    const hoy = new Date();
    let mes = hoy.getMonth() + 1 + offset;
    if (mes <= 0) mes += 12;
    if (mes > 12) mes -= 12;
    const nombres = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return nombres[mes - 1];
};

const labelsMeses = () => [
    obtenerMesRelativo(-2),
    obtenerMesRelativo(-1),
    obtenerMesRelativo(0),
    obtenerMesRelativo(1),
    obtenerMesRelativo(2),
    obtenerMesRelativo(3),
    obtenerMesRelativo(4)
];

// ==============================
// MODELO MATEMÁTICO DE PREDICCIÓN
// ==============================
const calcularModelo = () => {
    const fecha = new Date();
    const diaActual = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const diasMesActual = diasMes(anio, mes);
    const diasMesAnterior = diasMes(anio, mes - 1);
    const diasRestantes = diasMesActual - diaActual;

    const diasMes1 = diasMes(anio, mes + 1);
    const diasMes2 = diasMes(anio, mes + 2);
    const diasMes3 = diasMes(anio, mes + 3);
    const diasMes4 = diasMes(anio, mes + 4);

    const C = mesAnterior;
    const xK = mesAnterior + mesActual;
    const tK = diasMesAnterior + diaActual;

    const tP1 = tK + diasRestantes + diasMes1;
    const tP2 = tP1 + diasMes2;
    const tP3 = tP2 + diasMes3;
    const tP4 = tP3 + diasMes4;

    const k = Math.log(xK / C) / tK;

    const acumuladoP1 = C * Math.exp(k * tP1);
    const acumuladoP2 = C * Math.exp(k * tP2);
    const acumuladoP3 = C * Math.exp(k * tP3);
    const acumuladoP4 = C * Math.exp(k * tP4);

    pred1 = Math.max(0, Math.round(acumuladoP1 - xK));
    pred2 = Math.max(0, Math.round(acumuladoP2 - acumuladoP1));
    pred3 = Math.max(0, Math.round(acumuladoP3 - acumuladoP2));
    pred4 = Math.max(0, Math.round(acumuladoP4 - acumuladoP3));
};

const mostrar = () => {
    document.getElementById("historicas").innerText = mesAnterior + mesAnterior2;
    document.getElementById("actuales").innerText = mesActual;
    document.getElementById("pendientes").innerText = pred1 + pred2 + pred3 + pred4;
};

// ==============================
// FUNCIONES GENERAR
// ==============================
const generarEmpleado = async () => {
    try {
        mostrarMensajeCargando(true);
        const ID = JSON.parse(localStorage.getItem("seleccionPrediccion")).id;
        const fecha = obtenerFecha();
        const res = await fetch(API + "/faltas/empleado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mes: fecha.mes, anio: fecha.anio, idEmpleado: ID })
        });
        const data = await res.json();
        mesActual = data.mesActual;
        mesAnterior = data.mesAnterior;
        mesAnterior2 = data.mesAnterior2;
        calcularModelo();
        mostrar();
    } catch (error) {
        console.error(error);
        alert("Error al consultar API de empleado");
    } finally {
        mostrarMensajeCargando(false);
    }
};

const generarDepartamento = async () => {
    try {
        mostrarMensajeCargando(true);
        const ID = JSON.parse(localStorage.getItem("seleccionPrediccion")).id;
        const fecha = obtenerFecha();
        const res = await fetch(API + "/faltas/departamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mes: fecha.mes, anio: fecha.anio, idDepartamento: ID })
        });
        const data = await res.json();
        mesActual = data.mesActual;
        mesAnterior = data.mesAnterior;
        mesAnterior2 = data.mesAnterior2;
        calcularModelo();
        mostrar();
    } catch (error) {
        console.error(error);
        alert("Error al consultar API de departamento");
    } finally {
        mostrarMensajeCargando(false);
    }
};

// ==============================
// MENSAJE EMERGENTE CARGANDO
// ==============================
const mostrarMensajeCargando = (estado) => {
    let div = document.getElementById("mensaje-cargando");
    if(!div) {
        div = document.createElement("div");
        div.id = "mensaje-cargando";
        div.className = "fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded shadow z-50";
        div.innerText = "Cargando...";
        document.body.appendChild(div);
    }
    div.style.display = estado ? "block" : "none";
};

// ==============================
// PREDECIR DESDE LISTADO
// ==============================
const predecirSeleccion = (id, tipo) => {
    localStorage.setItem("seleccionPrediccion", JSON.stringify({ id }));
    if(tipo === "empleado") generarEmpleado();
    else generarDepartamento();
};

// ==============================
// LISTAR EMPLEADOS
// ==============================
const listarEmpleados = () => {
    modoActual = "empleados";
    paginaActual = 0;
    configurarColumnasEmpleados();
    cargarEmpleados(0);
};

const configurarColumnasEmpleados = () => {
    document.querySelector("thead tr").innerHTML = `
        <th class="py-3 px-4 font-bold text-slate-700">Nombre</th>
        <th class="py-3 px-4 font-bold text-slate-700">Departamento</th>
        <th class="py-3 px-4 font-bold text-slate-700">Puesto</th>
        <th class="py-3 px-4 font-bold text-slate-700 text-center">Acciones</th>
    `;
};

const cargarEmpleados = (direccion) => {
    let paginaConsulta = paginaActual;
    if(direccion === 1) paginaConsulta++;
    if(direccion === 0 && paginaActual > 0) paginaConsulta--;
    fetch(API_EMPLEADOS + "?limit=" + resultadosPorPagina + "&start=" + (paginaConsulta * resultadosPorPagina))
        .then(res => res.json())
        .then(data => {
            const empleados = data.data;
            if(direccion === 1 && empleados.length === 0) return;
            paginaActual = paginaConsulta;
            document.getElementById("paginaActual").textContent = paginaActual + 1;
            mostrarEmpleados(empleados);
        })
        .catch(err => console.error(err));
};

const mostrarEmpleados = (empleados) => {
    const tabla = document.getElementById("tabla-empleados");
    tabla.innerHTML = "";
    empleados.forEach(emp => {
        tabla.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-800">${emp.Nombre_Completo}</td>
            <td class="py-3 px-4 text-slate-600">${emp.Departamento}</td>
            <td class="py-3 px-4 text-slate-600">${emp.Puesto}</td>
            <td class="py-3 px-4 text-center">
                <button class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">Ver</button>
                <button onclick="predecirSeleccion(${emp.Id_Empleado}, 'empleado')" class="bg-green-600 text-white px-3 py-1 rounded-lg">Predecir</button>
            </td>
        </tr>`;
    });
};

// ==============================
// LISTAR DEPARTAMENTOS
// ==============================
const listarDepartamentos = () => {
    modoActual = "departamentos";
    configurarColumnasDepartamentos();
    fetch(API_DEPARTAMENTOS)
        .then(res => res.json())
        .then(data => mostrarDepartamentos(data.data))
        .catch(err => console.error(err));
};

const configurarColumnasDepartamentos = () => {
    document.querySelector("thead tr").innerHTML = `
        <th class="py-3 px-4 font-bold text-slate-700">Departamento</th>
        <th class="py-3 px-4 font-bold text-slate-700">ID</th>
        <th class="py-3 px-4 font-bold text-slate-700 text-center">Acciones</th>
    `;
};

const mostrarDepartamentos = (deps) => {
    const tabla = document.getElementById("tabla-empleados");
    tabla.innerHTML = "";
    deps.forEach(dep => {
        tabla.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-800">${dep.Departamento}</td>
            <td class="py-3 px-4 text-slate-600">${dep.Id_Departamento}</td>
            <td class="py-3 px-4 text-center">
                <button class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">Ver</button>
                <button onclick="predecirSeleccion(${dep.Id_Departamento}, 'departamento')" class="bg-green-600 text-white px-3 py-1 rounded-lg">Predecir</button>
            </td>
        </tr>`;
    });
};

// ==============================
// GRÁFICAS
// ==============================
const graficaLineal = () => {
    if(chart) chart.destroy();
    const ctx = document.getElementById("grafica");
    chart = new Chart(ctx,{
        type:"line",
        data:{
            labels: labelsMeses(),
            datasets:[{ label:"Faltas", data:[mesAnterior2, mesAnterior, mesActual, pred1, pred2, pred3, pred4] }]
        },
        options:{ scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1 }}}}
    });
};

const graficaBarras = () => {
    if(chart) chart.destroy();
    const ctx = document.getElementById("grafica");
    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels: labelsMeses(),
            datasets:[{ label:"Faltas", data:[mesAnterior2, mesAnterior, mesActual, pred1, pred2, pred3, pred4] }]
        },
        options:{ scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1 }}}}
    });
};

// ==============================
// PAGINACIÓN
// ==============================
const cambiarPagina = (direccion) => {
    if(modoActual === "empleados") cargarEmpleados(direccion);
};

// ==============================
// BUSCADOR
// ==============================
document.getElementById("busqueda").addEventListener("keyup", e => {
    const texto = e.target.value.toLowerCase();
    document.querySelectorAll("#tabla-empleados tr").forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(texto) ? "" : "none";
    });
});