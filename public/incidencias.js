// API DEL SISTEMA
const API = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias";
const API_EMPLEADOS = API + "/empleados";
const API_DEPARTAMENTOS = API + "/departamentos";

// VARIABLES GLOBALES
let mesActual = 0;
let mesAnterior = 0;
let mesAnterior2 = 0;

let pred1 = 0, pred2 = 0, pred3 = 0, pred4 = 0;
let chart = null; //para las graficas

let paginaActual = 0;
const resultadosPorPagina = 10;
let modoActual = "empleados";


// CREAR TABLA DINÁMICA
const crearTabla = (columnasHTML) => {
    const contenedor = document.getElementById("contenedor-tabla");

    contenedor.innerHTML = "";

    contenedor.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
            <thead class="bg-slate-100 border-b border-slate-200">
                <tr>
                    ${columnasHTML}
                </tr>
            </thead>
            <tbody id="tabla-empleados"></tbody>
        </table>
    `;
};

// FUNCIONES DE FECHA Y MESES
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


// MODELO MATEMÁTICO DE PREDICCIÓN
const calcularModelo = () => {

    const fecha = new Date();
    const diaActual = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const diasMesAnterior = diasMes(anio, mes - 1);

    const diasMes1 = diasMes(anio, mes + 1);
    const diasMes2 = diasMes(anio, mes + 2);
    const diasMes3 = diasMes(anio, mes + 3);
    const diasMes4 = diasMes(anio, mes + 4);

    // VALIDACIÓN
    if (mesAnterior === 0) {
        pred1 = pred2 = pred3 = pred4 = 0;
        return;
    }

    // BASE DEL MODELO (igual que el original)
    const C = mesAnterior;
    const xK = mesAnterior + mesActual;
    const tK = diasMesAnterior + diaActual;

    // k ORIGINAL
    const k = Math.log(xK / C) / tK;

    //  TIEMPOS CORREGIDOS (AQUÍ ESTABA EL ERROR)
    const tP1 = tK + diasMes1;
    const tP2 = tP1 + diasMes2;
    const tP3 = tP2 + diasMes3;
    const tP4 = tP3 + diasMes4;

    // MODELO
    const acumuladoP1 = C * Math.exp(k * tP1);
    const acumuladoP2 = C * Math.exp(k * tP2);
    const acumuladoP3 = C * Math.exp(k * tP3);
    const acumuladoP4 = C * Math.exp(k * tP4);

     // DIFERENCIAS REALES (SIN REDONDEO)
    const real1 = acumuladoP1 - xK;
    const real2 = acumuladoP2 - acumuladoP1;
    const real3 = acumuladoP3 - acumuladoP2;
    const real4 = acumuladoP4 - acumuladoP3;

    // 🔍 ALERT CON VALORES REALES
    alert(
        "VALORES REALES:\n\n" +
        "Abril: " + acumuladoP1 + "\n" +
        "Mayo: " + acumuladoP2 + "\n" +
        "Junio: " + acumuladoP3 + "\n" +
        "Julio: " + acumuladoP4
    );

    // ✅ REDONDEO CORREGIDO (evita error de precisión)
    pred1 = Math.max(0, Math.round(real1 + 1e-10));
    pred2 = Math.max(0, Math.round(real2 + 1e-10));
    pred3 = Math.max(0, Math.round(real3 + 1e-10));
    pred4 = Math.max(0, Math.round(real4 + 1e-10));
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

        let ID = document.getElementById("idEmpleado").value;
        if (!ID) {
            const dataLS = JSON.parse(localStorage.getItem("seleccionPrediccion"));
            if (!dataLS) return alert("Selecciona o ingresa ID");
            ID = dataLS.id;
        }

        const fecha = obtenerFecha();

        const res = await fetch(API + "/faltas/empleado", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ mes: fecha.mes, anio: fecha.anio, idEmpleado: ID })
        });

        const data = await res.json();

        mesActual = data.mesActual;
        mesAnterior = data.mesAnterior;
        mesAnterior2 = data.mesAnterior2;

        calcularModelo();
        mostrar();
        graficaLineal();

        document.getElementById("reporte").scrollIntoView({behavior:"smooth"});

    } catch (e) {
        console.error(e);
    } finally {
        mostrarMensajeCargando(false);
    }
};


const generarDepartamento = async () => {
    try {
        mostrarMensajeCargando(true);

        let ID = document.getElementById("idDepartamento").value;
        if (!ID) {
            const dataLS = JSON.parse(localStorage.getItem("seleccionPrediccion"));
            if (!dataLS) return alert("Selecciona o ingresa ID");
            ID = dataLS.id;
        }

        const fecha = obtenerFecha();

        const res = await fetch(API + "/faltas/departamento", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ mes: fecha.mes, anio: fecha.anio, idDepartamento: ID })
        });

        const data = await res.json();

        mesActual = data.mesActual;
        mesAnterior = data.mesAnterior;
        mesAnterior2 = data.mesAnterior2;

        calcularModelo();
        mostrar();
        graficaLineal();

    } catch (e) {
        console.error(e);
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

const cargarEmpleados = (direccion = 0) => {
    modoActual = "empleados";

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

            mostrarEmpleados(empleados); // 👈 solo pinta
        })
        .catch(err => console.error(err));
};


const mostrarEmpleados = (empleados) => {
    const contenedor = document.getElementById("contenedor-tabla");

    contenedor.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
            <thead class="bg-slate-100 border-b border-slate-200">
                <tr>
                    <th class="py-3 px-4 font-bold text-slate-700">Nombre</th>
                    <th class="py-3 px-4 font-bold text-slate-700">Faltas del mes</th>
                    <th class="py-3 px-4 font-bold text-slate-700">Faltas del año</th>
                    <th class="py-3 px-4 font-bold text-slate-700 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-empleados"></tbody>
        </table>
    `;

    const tabla = document.getElementById("tabla-empleados");

    empleados.forEach(emp => {
        tabla.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-800">${emp.Nombre_Completo}</td>
            <td class="py-3 px-4 text-slate-600">${emp.faltas_mes_actual}</td>
            <td class="py-3 px-4 text-slate-600">${emp.faltas_anio_actual}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="abrirModal(${emp.Id_Empleado}, 'E')" class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">Ver</button>
                <button onclick="predecirSeleccion(${emp.Id_Empleado}, 'empleado')" class="bg-green-600 text-white px-3 py-1 rounded-lg">Predecir</button>
            </td>
        </tr>`;
    });
};


const cargarDepartamentos = () => {
    modoActual = "departamentos";

    fetch(API_DEPARTAMENTOS)
        .then(res => res.json())
        .then(data => mostrarDepartamentos(data.data))
        .catch(err => console.error(err));
};

const mostrarDepartamentos = (deps) => {
    const contenedor = document.getElementById("contenedor-tabla");

    contenedor.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
            <thead class="bg-slate-100 border-b border-slate-200">
                <tr>
                    <th class="py-3 px-4 font-bold text-slate-700">Departamento</th>
                    <th class="py-3 px-4 font-bold text-slate-700">Faltas del mes</th>
                    <th class="py-3 px-4 font-bold text-slate-700">Faltas del año</th>
                    <th class="py-3 px-4 font-bold text-slate-700 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-empleados"></tbody>
        </table>
    `;

    const tabla = document.getElementById("tabla-empleados");

    deps.forEach(dep => {
        tabla.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-800">${dep.Departamento}</td>
            <td class="py-3 px-4 text-slate-600">${dep.faltas_mes_actual}</td>
            <td class="py-3 px-4 text-slate-600">${dep.faltas_anio_actual}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="abrirModal(${dep.Id_Departamento}, 'D')" class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">Ver</button>
                <button onclick="predecirSeleccion(${dep.Id_Departamento}, 'departamento')" class="bg-green-600 text-white px-3 py-1 rounded-lg">Predecir</button>
            </td>
        </tr>`;
    });
};

const cambiarPagina = (direccion) => {
    if(modoActual === "empleados") {
        cargarEmpleados(direccion);
    }
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


// ==============================
// BUSCADOR
// ==============================









let seleccionado = {
    id: null,
    tipo: null // 'E' o 'D'
}

let datosActuales = []
let tipoVista = "" // mes | semana
let chartModal = null

const APII = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias"

// ABRIR
const abrirModal = (id, tipo) => {

    seleccionado.id = id
    seleccionado.tipo = tipo

    const modal = document.getElementById("modal")

    modal.classList.remove("hidden")
    modal.classList.add("flex")

    // limpiar
    document.getElementById("listado").innerHTML = ""
    if (chartModal) chartModal.destroy()
}

// CERRAR
const cerrarModal = () => {
    const modal = document.getElementById("modal")

    modal.classList.add("hidden")
    modal.classList.remove("flex")
}

// ================= FETCH =================

const obtenerDatos = async (modo) => {

    let url = ""

    if (modo === "mes") {
        url = seleccionado.tipo === "E"
            ? "/faltas/mes/empleado"
            : "/faltas/mes/departamento"
    } else {
        url = seleccionado.tipo === "E"
            ? "/faltas/semana/empleado"
            : "/faltas/semana/departamento"
    }

    const body = {
        anio: 2026,
        mes: new Date().getMonth() + 1,
        ...(seleccionado.tipo === "E"
            ? { idEmpleado: seleccionado.id }
            : { idDepartamento: seleccionado.id })
    }

    const res = await fetch(APII + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    const data = await res.json()

    datosActuales = data
    tipoVista = modo

    return data
}

// ================= LISTADOS =================
const cargarMes = async () => {
    const data = await obtenerDatos("mes")

    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

    let html = `
    <div class="border border-slate-200 rounded overflow-hidden h-full flex flex-col">
        <div class="overflow-y-auto">
            <table class="w-full text-xs">
                <thead class="bg-slate-100 sticky top-0">
                    <tr>
                        <th class="px-2 py-1 text-left text-slate-600">Mes</th>
                        <th class="px-2 py-1 text-left text-slate-600">Faltas</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
    `

    data.forEach((v, i) => {
        html += `
        <tr class="hover:bg-slate-50">
            <td class="px-2 py-1">${meses[i]}</td>
            <td class="px-2 py-1 font-semibold text-orange-500">${v}</td>
        </tr>
        `
    })

    html += `</tbody></table></div></div>`

    document.getElementById("listado").innerHTML = html
    datosActuales = data
    tipoVista = "mes"
}


const cargarSemana = async () => {
    const data = await obtenerDatos("semana")

    let html = `
    <div class="border border-slate-200 rounded overflow-hidden h-full flex flex-col">
        <div class="overflow-y-auto">
            <table class="w-full text-xs">
                <thead class="bg-slate-100 sticky top-0">
                    <tr>
                        <th class="px-2 py-1 text-left text-slate-600">Semana</th>
                        <th class="px-2 py-1 text-left text-slate-600">Faltas</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
    `

    data.forEach((v, i) => {
        html += `
        <tr class="hover:bg-slate-50">
            <td class="px-2 py-1">Semana ${i + 1}</td>
            <td class="px-2 py-1 font-semibold text-orange-500">${v}</td>
        </tr>
        `
    })

    html += `</tbody></table></div></div>`

    document.getElementById("listado").innerHTML = html
    datosActuales = data
    tipoVista = "semana"
}


const graficaLinealModal = () => {

    if (!datosActuales.length) {
        alert("Primero carga datos")
        return
    }

    if (chartModal) chartModal.destroy()

    const ctx = document.getElementById("graficaModal")

    chartModal = new Chart(ctx, {
        type: "line",
        data: {
            labels: datosActuales.map((_, i) =>
                tipoVista === "mes" ? `M${i+1}` : `S${i+1}`
            ),
            datasets: [{
                data: datosActuales,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { font: { size: 10 } } },
                y: { ticks: { font: { size: 10 } } }
            }
        }
    })
}

const graficaBarrasModal = () => {

    if (!datosActuales.length) {
        alert("Primero carga datos")
        return
    }

    if (chartModal) chartModal.destroy()

    const ctx = document.getElementById("graficaModal")

    chartModal = new Chart(ctx, {
        type: "bar",
        data: {
            labels: datosActuales.map((_, i) =>
                tipoVista === "mes" ? `M${i+1}` : `S${i+1}`
            ),
            datasets: [{
                data: datosActuales,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { font: { size: 10 } } },
                y: { ticks: { font: { size: 10 } } }
            }
        }
    })
}