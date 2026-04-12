// =============================================================================
// 1. CONFIGURACIÓN Y VARIABLES GLOBALES
// =============================================================================
const API = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias";
const API_EMPLEADOS = API + "/empleados";
const API_DEPARTAMENTOS = API + "/departamentos";

// Estado global
let mesActual = 0, mesAnterior = 0, mesAnterior2 = 0;
let pred1 = 0, pred2 = 0, pred3 = 0, pred4 = 0;
let chart = null;              // Gráfica principal
let paginaActual = 0;
const resultadosPorPagina = 10;
let modoActual = "empleados";
let nombreSeleccionado = "";
let tipoSeleccionado = "";
let ID = null;                 // ID del elemento seleccionado para predicción

// Estado para el modal de detalles
let seleccionado = { id: null, tipo: null };
let datosActuales = [];
let tipoVista = "mes";        // "mes" o "semana"
let chartModal = null;

// =============================================================================
// 2. UTILIDADES DE FECHA Y MESES
// =============================================================================
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

// =============================================================================
// 3. FUNCIONES DE INTERFAZ DE USUARIO (Botones, mensajes, etc.)
// =============================================================================
const mostrarMensajeCargando = (estado) => {
    let div = document.getElementById("mensaje-cargando");
    if (!div) {
        div = document.createElement("div");
        div.id = "mensaje-cargando";
        div.className = "fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded shadow-lg z-50 font-bold transition-all";
        div.innerText = "Cargando...";
        document.body.appendChild(div);
    }
    div.style.display = estado ? "block" : "none";
};

// Actualiza el estilo de las pestañas (Empleados / Departamentos)
const actualizarPestanas = (modo) => {
    const btnE = document.getElementById("tab-empleados");
    const btnD = document.getElementById("tab-departamentos");
    if (!btnE || !btnD) return;
    const claseActiva = "px-5 py-2 rounded-md font-semibold text-sm transition-all bg-white text-slate-800 shadow-sm border border-slate-200";
    const claseInactiva = "px-5 py-2 rounded-md font-medium text-sm transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent";
    if (modo === "empleados") {
        btnE.className = claseActiva;
        btnD.className = claseInactiva;
    } else {
        btnD.className = claseActiva;
        btnE.className = claseInactiva;
    }
};

// Actualiza botones de período (Mes / Semana) dentro del modal
const actualizarBotonesPeriodoModal = (modo) => {
    const btnMes = document.getElementById("btnMes");
    const btnSemana = document.getElementById("btnSemana");
    if (!btnMes || !btnSemana) return;
    const claseActiva = "px-4 py-2 text-sm font-semibold rounded-md transition-all bg-white border border-slate-200 text-slate-800 shadow-sm";
    const claseInactiva = "px-4 py-2 text-sm font-medium rounded-md transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/50";
    if (modo === "mes") {
        btnMes.className = claseActiva;
        btnSemana.className = claseInactiva;
    } else {
        btnSemana.className = claseActiva;
        btnMes.className = claseInactiva;
    }
};

// Actualiza botones de tipo de gráfica (Barras / Lineal) dentro del modal
const actualizarBotonesGraficaModal = (modo) => {
    const btnBarras = document.getElementById("btnBarrasModal");
    const btnLineal = document.getElementById("btnLinealModal");
    if (!btnBarras || !btnLineal) return;
    if (modo === "barras") {
        btnBarras.className = "px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-sm transition-colors";
        btnLineal.className = "px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 shadow-sm transition-colors";
    } else {
        btnLineal.className = "px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-sm transition-colors";
        btnBarras.className = "px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 shadow-sm transition-colors";
    }
};

// =============================================================================
// 4. MODELO MATEMÁTICO DE PREDICCIÓN
// =============================================================================
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

    if (mesAnterior === 0) {
        pred1 = pred2 = pred3 = pred4 = 0;
        return;
    }

    const C = mesAnterior;
    const xK = mesAnterior + mesActual;
    const tK = diasMesAnterior + diaActual;
    const k = Math.log(xK / C) / tK;

    const tP1 = diasMesAnterior + diasMesActual + diasMes1;
    const tP2 = tP1 + diasMes2;
    const tP3 = tP2 + diasMes3;
    const tP4 = tP3 + diasMes4;

    const acumuladoP1 = C * Math.exp(k * tP1);
    const acumuladoP2 = C * Math.exp(k * tP2);
    const acumuladoP3 = C * Math.exp(k * tP3);
    const acumuladoP4 = C * Math.exp(k * tP4);

    const real1 = acumuladoP1 - xK;
    const real2 = acumuladoP2 - acumuladoP1;
    const real3 = acumuladoP3 - acumuladoP2;
    const real4 = acumuladoP4 - acumuladoP3;

    alert("VALORES REALES:\n\nAbril: " + acumuladoP1 + "\nMayo: " + acumuladoP2 + "\nJunio: " + acumuladoP3 + "\nJulio: " + acumuladoP4);

    pred1 = Math.max(0, Math.round(real1 + 1e-10));
    pred2 = Math.max(0, Math.round(real2 + 1e-10));
    pred3 = Math.max(0, Math.round(real3 + 1e-10));
    pred4 = Math.max(0, Math.round(real4 + 1e-10));
};

const mostrarResumenPrediccion = () => {
    document.getElementById("historicas").innerText = mesAnterior + mesAnterior2;
    document.getElementById("actuales").innerText = mesActual;
    document.getElementById("pendientes").innerText = pred1 + pred2 + pred3 + pred4;
};

// =============================================================================
// 5. FUNCIONES DE GENERACIÓN DE REPORTES (Unificadas)
// =============================================================================
// Reporte unificado para empleado o departamento
const generarPrediccion = async (tipo) => {
    try {
        mostrarMensajeCargando(true);
        const dataLS = JSON.parse(localStorage.getItem("seleccionPrediccion"));
        if (!dataLS) return alert("Selecciona o ingresa ID");
        const id = dataLS.id;

        const fecha = obtenerFecha();
        const endpoint = tipo === "empleado" ? "/faltas/empleado" : "/faltas/departamento";
        const body = tipo === "empleado"
            ? { mes: fecha.mes, anio: fecha.anio, idEmpleado: id }
            : { mes: fecha.mes, anio: fecha.anio, idDepartamento: id };

        const res = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        mesActual = data.mesActual;
        mesAnterior = data.mesAnterior;
        mesAnterior2 = data.mesAnterior2;

        calcularModelo();
        mostrarResumenPrediccion();
        actualizarGraficaPrincipal("lineal");   // Por defecto gráfica lineal

        document.getElementById("subtituloAnalisis").innerText =
            nombreSeleccionado
                ? (tipoSeleccionado === "empleado" ? "Empleado: " + nombreSeleccionado : "Departamento: " + nombreSeleccionado)
                : "";
        document.getElementById("reporte").scrollIntoView({ behavior: "smooth" });
    } catch (e) {
        console.error(e);
    } finally {
        mostrarMensajeCargando(false);
    }
};

// Funciones que mantienen el nombre original para compatibilidad con HTML
const generarEmpleado = () => generarPrediccion("empleado");
const generarDepartamento = () => generarPrediccion("departamento");

// =============================================================================
// 6. TABLAS DINÁMICAS (Empleados / Departamentos)
// =============================================================================
// Renderiza cualquier tabla con columnas y datos
const renderizarTabla = (columnas, datos, tipo) => {
    const contenedor = document.getElementById("contenedor-tabla");
    if (!contenedor) return;

    let theadHTML = "<thead class='bg-slate-50 border-b border-slate-200'><tr>";
    columnas.forEach(col => {
        theadHTML += `<th class="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">${col.titulo}</th>`;
    });
    theadHTML += "</tr></thead>";

    let tbodyHTML = "<tbody id='tabla-empleados' class='divide-y divide-slate-100'>";
    datos.forEach(item => {
        tbodyHTML += "<tr class='hover:bg-slate-50 transition-colors'>";
        columnas.forEach(col => {
            let valor = item[col.campo] !== undefined ? item[col.campo] : "";
            tbodyHTML += `<td class="py-3 px-4 ${col.clase || 'text-slate-600 text-sm'}">${valor}</td>`;
        });
        // Columna de acciones
        const id = tipo === "empleado" ? item.Id_Empleado : item.Id_Departamento;
        const nombre = tipo === "empleado" ? item.Nombre_Completo : item.Departamento;
        tbodyHTML += `
            <td class="py-3 px-4 text-center">
                <button onclick="abrirModal(${id}, '${tipo === "empleado" ? "E" : "D"}')" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">Ver</button>
                <button onclick="predecirSeleccion(${id}, '${tipo}', '${nombre.replace(/'/g, "\\'")}')" class="inline-flex items-center justify-center text-white bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">Predecir</button>
            </td>
        `;
        tbodyHTML += "</tr>";
    });
    tbodyHTML += "</tbody>";

    contenedor.innerHTML = `<table class="w-full text-left border-collapse min-w-[600px]">${theadHTML}${tbodyHTML}</table>`;
};

const cargarEmpleados = async (direccion = 0) => {
    modoActual = "empleados";
    actualizarPestanas("empleados");
    let paginaConsulta = paginaActual;
    if (direccion === 1) paginaConsulta++;
    if (direccion === 0 && paginaActual > 0) paginaConsulta--;

    try {
        const res = await fetch(API_EMPLEADOS + `?limit=${resultadosPorPagina}&start=${paginaConsulta * resultadosPorPagina}`);
        const data = await res.json();
        if (direccion === 1 && data.data.length === 0) return;
        paginaActual = paginaConsulta;
        document.getElementById("paginaActual").textContent = paginaActual + 1;
        const columnas = [
            { titulo: "Nombre", campo: "Nombre_Completo", clase: "font-semibold text-slate-700 text-sm" },
            { titulo: "Faltas del mes", campo: "faltas_mes_actual", clase: "text-slate-600 text-sm" },
            { titulo: "Faltas del año", campo: "faltas_anio_actual", clase: "text-slate-600 text-sm" }
        ];
        renderizarTabla(columnas, data.data, "empleado");
    } catch (err) {
        console.error(err);
    }
};

const cargarDepartamentos = async () => {
    modoActual = "departamentos";
    actualizarPestanas("departamentos");
    try {
        const res = await fetch(API_DEPARTAMENTOS);
        const data = await res.json();
        const columnas = [
            { titulo: "Departamento", campo: "Departamento", clase: "font-semibold text-slate-700 text-sm" },
            { titulo: "Faltas del mes", campo: "faltas_mes_actual", clase: "text-slate-600 text-sm" },
            { titulo: "Faltas del año", campo: "faltas_anio_actual", clase: "text-slate-600 text-sm" }
        ];
        renderizarTabla(columnas, data.data, "departamento");
    } catch (err) {
        console.error(err);
    }
};

const cambiarPagina = (direccion) => {
    if (modoActual === "empleados") cargarEmpleados(direccion);
};

// =============================================================================
// 7. GRÁFICAS PRINCIPALES (unificadas)
// =============================================================================
const actualizarGraficaPrincipal = (tipo = "lineal") => {
    if (chart) chart.destroy();
    const ctx = document.getElementById("grafica");
    const data = [mesAnterior2, mesAnterior, mesActual, pred1, pred2, pred3, pred4];
    const labels = labelsMeses();
    chart = new Chart(ctx, {
        type: tipo,
        data: { labels, datasets: [{ label: "Faltas", data }] },
        options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
};

// Funciones compatibles con HTML
const graficaLineal = () => actualizarGraficaPrincipal("lineal");
const graficaBarras = () => actualizarGraficaPrincipal("bar");

// =============================================================================
// 8. MODAL: DETALLES POR MES/SEMANA Y GRÁFICAS
// =============================================================================
const abrirModal = (id, tipo) => {
    seleccionado.id = id;
    seleccionado.tipo = tipo;
    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.getElementById("listado").innerHTML = "";
    if (chartModal) chartModal.destroy();
    document.getElementById("subtituloModal").innerText =
        nombreSeleccionado
            ? (tipo === "E" ? "Empleado: " + nombreSeleccionado : "Departamento: " + nombreSeleccionado)
            : (tipo === "E" ? "Empleado ID: " + id : "Departamento ID: " + id);
};

const cerrarModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

// Carga de datos para el modal (unificada)
const cargarDatosPeriodo = async (periodo) => {
    const url = periodo === "mes"
        ? (seleccionado.tipo === "E" ? "/faltas/mes/empleado" : "/faltas/mes/departamento")
        : (seleccionado.tipo === "E" ? "/faltas/semana/empleado" : "/faltas/semana/departamento");
    const body = {
        anio: 2026,
        mes: new Date().getMonth() + 1,
        ...(seleccionado.tipo === "E" ? { idEmpleado: seleccionado.id } : { idDepartamento: seleccionado.id })
    };
    const res = await fetch(API + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    datosActuales = data;
    tipoVista = periodo;
    return data;
};

// Renderiza la tabla en el modal según el período
const cargarPeriodoModal = async (periodo) => {
    actualizarBotonesPeriodoModal(periodo);
    const data = await cargarDatosPeriodo(periodo);
    const mesesNombres = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let html = `<div class="h-full flex flex-col"><div class="overflow-y-auto"><table class="w-full text-xs text-left"><thead class="bg-slate-100 sticky top-0 border-b border-slate-200"><tr><th class="px-3 py-2 text-slate-600 font-bold uppercase">${periodo === "mes" ? "Mes" : "Semana"}</th><th class="px-3 py-2 text-slate-600 font-bold uppercase">Faltas</th></tr></thead><tbody class="divide-y divide-slate-100">`;
    if (periodo === "mes") {
        data.forEach((v, i) => {
            html += `<tr class="hover:bg-slate-50"><td class="px-3 py-2 font-medium text-slate-700">${mesesNombres[i]}</td><td class="px-3 py-2 font-bold text-orange-500">${v}</td></tr>`;
        });
    } else {
        // Generar etiquetas con meses aproximados
        const totalSemanas = data.length;
        const mesesBase = [obtenerMesRelativo(-2), obtenerMesRelativo(-1), obtenerMesRelativo(0)];
        const semanasPorMes = Math.ceil(totalSemanas / 3);
        let resultado = [];
        mesesBase.forEach(mes => {
            for (let i = 0; i < semanasPorMes; i++) resultado.push(mes);
        });
        resultado = resultado.slice(0, totalSemanas);
        data.forEach((v, i) => {
            html += `<tr class="hover:bg-slate-50"><td class="px-3 py-2 font-medium text-slate-700">Semana ${i+1} - ${resultado[i]}</td><td class="px-3 py-2 font-bold text-orange-500">${v}</td></tr>`;
        });
    }
    html += `</tbody></table></div></div>`;
    document.getElementById("listado").innerHTML = html;
};

// Funciones compatibles con HTML
const cargarMes = () => cargarPeriodoModal("mes");
const cargarSemana = () => cargarPeriodoModal("semana");

// Gráficas dentro del modal (unificadas)
const actualizarGraficaModal = (tipo) => {
    if (!datosActuales.length) {
        alert("Primero carga datos");
        return;
    }
    actualizarBotonesGraficaModal(tipo);
    if (chartModal) chartModal.destroy();
    const ctx = document.getElementById("graficaModal");
    chartModal = new Chart(ctx, {
        type: tipo,
        data: {
            labels: datosActuales.map((_, i) => tipoVista === "mes" ? `M${i+1}` : `S${i+1}`),
            datasets: [{
                data: datosActuales,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2,
                borderColor: '#f97316',
                backgroundColor: tipo === "line" ? '#f97316' : '#3b82f6'
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
    });
};

const graficaLinealModal = () => actualizarGraficaModal("line");
const graficaBarrasModal = () => actualizarGraficaModal("bar");

// =============================================================================
// 9. GRÁFICAS COMPARATIVAS (Departamento vs Empleados / General)
// =============================================================================
let graficaDepto, graficaDeptos;

const generarGraficaComparativa = (datos, idDestacado, tipoId, contenedorId, chartVar) => {
    const labels = datos.map(d => `${tipoId === "empleado" ? d.Nombre : d.Departamento} (${d.TotalFaltas})`);
    const valores = datos.map(d => d.TotalFaltas);
    const baseColores = ['#38bdf8', '#22c55e', '#eab308', '#a78bfa', '#f43f5e', '#14b8a6', '#f97316', '#6366f1'];
    const colores = datos.map((d, i) => {
        let color = baseColores[i % baseColores.length];
        if ((tipoId === "empleado" && d.Id_Empleado !== idDestacado) ||
            (tipoId === "departamento" && d.Id_Departamento !== idDestacado)) {
            color += '80';
        }
        return color;
    });
    const ctx = document.getElementById(contenedorId);
    if (window[chartVar]) window[chartVar].destroy();
    window[chartVar] = new Chart(ctx, {
        type: 'pie',
        data: { labels, datasets: [{ data: valores, backgroundColor: colores, borderColor: '#1e293b', borderWidth: 1 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#1e293b', font: { size: 12 } } },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}` } }
            }
        }
    });
};

const graficaPorDepartamento = async (idEmpleado, departamento) => {
    try {
        const url = `https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/faltas/mes/departamento/empleados?departamento=${departamento}`;
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById("seccionDepto").classList.remove("hidden");
        generarGraficaComparativa(data, idEmpleado, "empleado", "graficaDepto", "graficaDepto");
    } catch (error) {
        console.error(error);
    }
};

const graficaDepartamentosGeneral = async (idDepartamento) => {
    try {
        const url = `https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/faltas/mes/departamentos`;
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById("seccionDeptosGeneral").classList.remove("hidden");
        generarGraficaComparativa(data, idDepartamento, "departamento", "graficaDeptosGeneral", "graficaDeptos");
    } catch (error) {
        console.error(error);
    }
};

// =============================================================================
// 10. FUNCIÓN PARA PREDECIR DESDE LISTADO (compatible con HTML)
// =============================================================================
const predecirSeleccion = (id, tipo, nombre) => {
    nombreSeleccionado = nombre;
    tipoSeleccionado = tipo;
    localStorage.setItem("seleccionPrediccion", JSON.stringify({ id }));
    if (tipo === "empleado") generarEmpleado();
    else generarDepartamento();
};