// API DEL SISTEMA
const API = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias";
const API_EMPLEADOS = API + "/empleados";
const API_DEPARTAMENTOS = API + "/departamentos";

// VARIABLES GLOBALES aparezacan cambios yaaaaaa
let mesActual = 0;
let mesAnterior = 0;
let mesAnterior2 = 0;


let pred1 = 0, pred2 = 0, pred3 = 0, pred4 = 0;
let chart = null; //para las graficas

let paginaActual = 0;
const resultadosPorPagina = 10;
let modoActual = "empleados";

//VIsual para nombre
let nombreSeleccionado = "";
let tipoSeleccionado = "";

// ==============================
// FUNCIONES VISUALES 
// ==============================
const actualizarPestanas = (modo) => {
    const btnE = document.getElementById("tab-empleados");
    const btnD = document.getElementById("tab-departamentos");
    if(!btnE || !btnD) return;

    if (modo === "empleados") {
        btnE.className = "px-5 py-2 rounded-md font-semibold text-sm transition-all bg-white text-slate-800 shadow-sm border border-slate-200";
        btnD.className = "px-5 py-2 rounded-md font-medium text-sm transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent";
    } else {
        btnD.className = "px-5 py-2 rounded-md font-semibold text-sm transition-all bg-white text-slate-800 shadow-sm border border-slate-200";
        btnE.className = "px-5 py-2 rounded-md font-medium text-sm transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent";
    }
};

const actualizarBotonesPeriodoModal = (modo) => {
    const btnMes = document.getElementById("btnMes");
    const btnSemana = document.getElementById("btnSemana");
    if(!btnMes || !btnSemana) return;

    if (modo === "mes") {
        btnMes.className = "px-4 py-2 text-sm font-semibold rounded-md transition-all bg-white border border-slate-200 text-slate-800 shadow-sm";
        btnSemana.className = "px-4 py-2 text-sm font-medium rounded-md transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/50";
    } else {
        btnSemana.className = "px-4 py-2 text-sm font-semibold rounded-md transition-all bg-white border border-slate-200 text-slate-800 shadow-sm";
        btnMes.className = "px-4 py-2 text-sm font-medium rounded-md transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/50";
    }
};

const actualizarBotonesGraficaModal = (modo) => {
    const btnBarras = document.getElementById("btnBarrasModal");
    const btnLineal = document.getElementById("btnLinealModal");
    if(!btnBarras || !btnLineal) return;

    if (modo === "barras") {
        btnBarras.className = "px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-sm transition-colors";
        btnLineal.className = "px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 shadow-sm transition-colors";
    } else {
        btnLineal.className = "px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-sm transition-colors";
        btnBarras.className = "px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 shadow-sm transition-colors";
    }
};

// CREAR TABLA DINÁMICA
const crearTabla = (columnasHTML) => {
    const contenedor = document.getElementById("contenedor-tabla");

    contenedor.innerHTML = "";

    contenedor.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    ${columnasHTML}
                </tr>
            </thead>
            <tbody id="tabla-empleados" class="divide-y divide-slate-100"></tbody>
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
 let totalPredicho;
// MODELO MATEMÁTICO DE PREDICCIÓN
const calcularModelo = () => {

    const fecha = new Date();
    const diaActual = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const diasMesAnterior = diasMes(anio, mes - 1);

    const diasMesActual = diasMes(anio, mes);

    const diasMes1 = diasMes(anio, mes + 1);
    const diasMes2 = diasMes(anio, mes + 2);
    const diasMes3 = diasMes(anio, mes + 3);
    const diasMes4 = diasMes(anio, mes + 4);

    // VALIDACIÓN
    if (mesAnterior === 0) {
        pred1 = pred2 = pred3 = pred4 = 0;
        return;
    }

    // BASE DEL MODELO 
    const C = mesAnterior;
    const xK = mesAnterior + mesActual;
    const tK = diasMesAnterior + diaActual;

    // k ORIGINAL
    const k = Math.log(xK / C) / tK;
   

    //  TIEMPOS CORREGIDOS 
    const tP1 = diasMesAnterior+diasMesActual + diasMes1;
    const tP2 = tP1 + diasMes2;
    const tP3 = tP2 + diasMes3;
    const tP4 = tP3 + diasMes4;
    

    // MODELO
    const acumuladoP1 = C * Math.exp(k * tP1);
    const acumuladoP2 = C * Math.exp(k * tP2);
    const acumuladoP3 = C * Math.exp(k * tP3);
    const acumuladoP4 = C * Math.exp(k * tP4);

     // DIFERENCIAS REALES 
    const real1 = acumuladoP1 - xK;
    const real2 = acumuladoP2 - acumuladoP1;
    const real3 = acumuladoP3 - acumuladoP2;
    const real4 = acumuladoP4 - acumuladoP3;

    // ALERT CON VALORES REALES
    alert(
        "VALORES REALES:\n\n" +
        "Mayo: " + acumuladoP1 + "\n" +
        "Junio: " + acumuladoP2 + "\n" +
        "Julio: " + acumuladoP3 + "\n" +
        "Agosto: " + acumuladoP4
    );

    //REDONDEO CORREGIDO
    pred1 = Math.max(0, Math.round(real1 + 1e-10));
    pred2 = Math.max(0, Math.round(real2 + 1e-10));
    pred3 = Math.max(0, Math.round(real3 + 1e-10));
    pred4 = Math.max(0, Math.round(real4 + 1e-10));

     totalPredicho = acumuladoP4-mesAnterior-mesActual
};

const mostrar = () => {
    document.getElementById("historicas").innerText = mesAnterior ;
    document.getElementById("actuales").innerText = mesActual;
    document.getElementById("pendientes").innerText = Math.max(0, Math.round(totalPredicho + 1e-10));;
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

        document.getElementById("subtituloAnalisis").innerText =
    nombreSeleccionado
    ? (tipoSeleccionado === "empleado"
        ? "Empleado: " + nombreSeleccionado
        : "Departamento: " + nombreSeleccionado)
    : "";
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

        document.getElementById("subtituloAnalisis").innerText =
    nombreSeleccionado
    ? (tipoSeleccionado === "empleado"
        ? "Empleado: " + nombreSeleccionado
        : "Departamento: " + nombreSeleccionado)
    : "";

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
        div.className = "fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded shadow-lg z-50 font-bold transition-all";
        div.innerText = "Cargando...";
        document.body.appendChild(div);
    }
    div.style.display = estado ? "block" : "none";
};

// ==============================
// PREDECIR DESDE LISTADO
// ==============================
const predecirSeleccion = (id, tipo, nombre) => {
    nombreSeleccionado = nombre;
    tipoSeleccionado = tipo;

    tipoSeleccionado = tipo;localStorage.setItem("seleccionPrediccion", JSON.stringify({ id }));
    if(tipo === "empleado") generarEmpleado();
    else generarDepartamento();
};

const cargarEmpleados = (direccion = 0) => {
    modoActual = "empleados";
    actualizarPestanas("empleados"); 

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
    const contenedor = document.getElementById("contenedor-tabla");

    contenedor.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Nombre</th>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Faltas del mes</th>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Faltas del año</th>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-empleados" class="divide-y divide-slate-100"></tbody>
        </table>
    `;

    const tabla = document.getElementById("tabla-empleados");

    empleados.forEach(emp => {
        tabla.innerHTML += `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-700 text-sm">${emp.Nombre_Completo}</td>
            <td class="py-3 px-4 text-slate-600 text-sm">${emp.faltas_mes_actual}</td>
            <td class="py-3 px-4 text-slate-600 text-sm">${emp.faltas_anio_actual}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="abrirModal(${emp.Id_Empleado}, 'E')" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">Ver</button>
                <button onclick="predecirSeleccion(${emp.Id_Empleado}, 'empleado', '${emp.Nombre_Completo}'); graficaPorDepartamento(${emp.Id_Empleado}, '${emp.Departamento}')" class="inline-flex items-center justify-center text-white bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">Predecir</button>
            </td>
        </tr>`;
    });
};

const cargarDepartamentos = () => {
    modoActual = "departamentos";
    actualizarPestanas("departamentos"); 

    fetch(API_DEPARTAMENTOS)
        .then(res => res.json())
        .then(data => mostrarDepartamentos(data.data))
        .catch(err => console.error(err));
};

const mostrarDepartamentos = (deps) => {
    const contenedor = document.getElementById("contenedor-tabla");

    contenedor.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Departamento</th>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Faltas del mes</th>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Faltas del año</th>
                    <th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-empleados" class="divide-y divide-slate-100"></tbody>
        </table>
    `;

    const tabla = document.getElementById("tabla-empleados");

    deps.forEach(dep => {
        tabla.innerHTML += `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-700 text-sm">${dep.Departamento}</td>
            <td class="py-3 px-4 text-slate-600 text-sm">${dep.faltas_mes_actual}</td>
            <td class="py-3 px-4 text-slate-600 text-sm">${dep.faltas_anio_actual}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="abrirModal(${dep.Id_Departamento}, 'D')" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">Ver</button>
                <button onclick="predecirSeleccion(${dep.Id_Departamento}, 'departamento', '${dep.Departamento}'); graficaDepartamentosGeneral(${dep.Id_Departamento})" class="inline-flex items-center justify-center text-white bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">Predecir</button>
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

let seleccionado = {
    id: null,
    tipo: null 
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

 document.getElementById("subtituloModal").innerText =
    nombreSeleccionado
    ? (tipo === "E"
        ? "Empleado: " + nombreSeleccionado
        : "Departamento: " + nombreSeleccionado)
    : (tipo === "E"
        ? "Empleado ID: " + id
        : "Departamento ID: " + id);
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
    actualizarBotonesPeriodoModal("mes"); 

    const data = await obtenerDatos("mes")

    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

    let html = `
    <div class="h-full flex flex-col">
        <div class="overflow-y-auto">
            <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 sticky top-0 border-b border-slate-200">
                    <tr>
                        <th class="px-3 py-2 text-slate-600 font-bold uppercase">Mes</th>
                        <th class="px-3 py-2 text-slate-600 font-bold uppercase">Faltas</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
    `

    data.forEach((v, i) => {
        html += `
        <tr class="hover:bg-slate-50">
            <td class="px-3 py-2 font-medium text-slate-700">${meses[i]}</td>
            <td class="px-3 py-2 font-bold text-orange-500">${v}</td>
        </tr>
        `
    })

    html += `</tbody></table></div></div>`

    document.getElementById("listado").innerHTML = html
    datosActuales = data
    tipoVista = "mes"
}

//funcion unicamnte visual complicado joven
const generarMesesPorSemanas = (totalSemanas) => {

    const mesesBase = [
        obtenerMesRelativo(-2),
        obtenerMesRelativo(-1),
        obtenerMesRelativo(0)
    ];

    // semanas aproximadas por mes (dinámico)
    const semanasPorMes = Math.ceil(totalSemanas / 3);

    let resultado = [];

    mesesBase.forEach(mes => {
        for (let i = 0; i < semanasPorMes; i++) {
            resultado.push(mes);
        }
    });

    // ajustar exactamente al tamaño del API
    return resultado.slice(0, totalSemanas);
};

const cargarSemana = async () => {
    actualizarBotonesPeriodoModal("semana"); 

    const data = await obtenerDatos("semana")
    

    let html = `
    <div class="h-full flex flex-col">
        <div class="overflow-y-auto">
            <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 sticky top-0 border-b border-slate-200">
                    <tr>
                        <th class="px-3 py-2 text-slate-600 font-bold uppercase">Semana</th>
                        <th class="px-3 py-2 text-slate-600 font-bold uppercase">Faltas</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
    `

const mesesPorSemana = generarMesesPorSemanas(data.length);
    data.forEach((v, i) => {
        html += `
        <tr class="hover:bg-slate-50">
            <td class="px-3 py-2 font-medium text-slate-700">
            Semana ${i + 1} - ${mesesPorSemana[i]}</td>
            <td class="px-3 py-2 font-bold text-orange-500">${v}</td>
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
    
    actualizarBotonesGraficaModal("lineal"); 

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
                pointRadius: 2,
                borderColor: '#f97316',
                backgroundColor: '#f97316'
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

    actualizarBotonesGraficaModal("barras");

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
                borderWidth: 1,
                backgroundColor: '#3b82f6'
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



const graficaPorDepartamento = async (idEmpleado, departamento) => {

    // Por ahora solo mostramos datos
    alert(`Empleado ID: ${idEmpleado} - Departamento: ${departamento}`);

        try {

        const URL = `https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/faltas/mes/departamento/empleados?departamento=${departamento}`;

        const res = await fetch(URL);
        const data = await res.json();

        // mostrar sección
        document.getElementById("seccionDepto").classList.remove("hidden");

        // generar gráfica
        generarGraficaDepto(data, idEmpleado);

    } catch (error) {
        console.error("Error:", error);
    }
};

let graficaDepto;

const generarGraficaDepto = (datos, idEmpleado) => {

    const labels = datos.map(e => `${e.Nombre} (${e.TotalFaltas})`); 
    //ahora la leyenda incluye faltas

    const valores = datos.map(e => e.TotalFaltas);

    // colores diferentes 
    const baseColores = [
        '#38bdf8', 
        '#22c55e', 
        '#eab308', 
        '#a78bfa', 
        '#f43f5e', 
        '#14b8a6', 
        '#f97316', 
        '#6366f1'  
    ];

    const colores = datos.map((e, i) => {

        let color = baseColores[i % baseColores.length];

        // si no es seleccionado hacerlo opaco
        if (e.Id_Empleado != idEmpleado) {
            color += '80'; // transparencia (hex)
        }

        return color;
    });

    const ctx = document.getElementById('graficaDepto');

    if (graficaDepto) graficaDepto.destroy();

    graficaDepto = new Chart(ctx, {
        type: 'pie',

        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: colores,
                borderColor: '#1e293b',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,


            maintainAspectRatio: false, // permite altura personalizada

            plugins: {

                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#1e293b',
                        font: {
                            size: 12
                        }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}`;
                        }
                    }
                }

            }
        }
    });

};








const graficaDepartamentosGeneral = async (idDepartamento) => {

    try {

        const URL = `https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/faltas/mes/departamentos`;

        const res = await fetch(URL);
        const data = await res.json();

        // mostrar sección
        document.getElementById("seccionDeptosGeneral").classList.remove("hidden");

        // generar gráfica
        generarGraficaDeptos(data, idDepartamento);

    } catch (error) {
        console.error("Error:", error);
    }

};


let graficaDeptos;

const generarGraficaDeptos = (datos, idDepartamento) => {

    const labels = datos.map(d => `${d.Departamento} (${d.TotalFaltas})`);
    const valores = datos.map(d => d.TotalFaltas);

    const baseColores = [
        '#38bdf8',
        '#22c55e',
        '#eab308',
        '#a78bfa',
        '#f43f5e',
        '#14b8a6',
        '#f97316',
        '#6366f1'
    ];

    const colores = datos.map((d, i) => {

        let color = baseColores[i % baseColores.length];
        if (d.Id_Departamento != idDepartamento) {
            color += '80'; // opacidad
        }

        return color;
    });

   const ctx = document.getElementById('graficaDeptosGeneral');

    if (graficaDeptos) graficaDeptos.destroy();

    graficaDeptos = new Chart(ctx, {
        type: 'pie',

        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: colores,
                borderColor: '#1e293b',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#1e293b',
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}`;
                        }
                    }
                }
            }
        }
    });

};