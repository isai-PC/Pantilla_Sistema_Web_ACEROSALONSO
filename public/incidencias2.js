
// API DEL SISTEMA
const API = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias";

// VARIABLES GLOBALES
// Estas variables almacenan los datos históricos obtenidos
// desde la API y los resultados de las predicciones.

let mesActual = 0       // faltas del mes actual
let mesAnterior = 0     // faltas del mes anterior
let mesAnterior2 = 0    // faltas de hace dos meses

// variables de predicción
let pred1 = 0
let pred2 = 0
let pred3 = 0
let pred4 = 0

// variable que guarda la gráfica de Chart.js
let chart = null


// OBTENER FECHA ACTUAL
// Esta función obtiene la fecha actual del sistema.
// Se usa para saber en qué mes estamos y cuántos días
// han transcurrido del mes actual.

const obtenerFecha = () => {

const hoy = new Date()

return {
dia: hoy.getDate(),
mes: hoy.getMonth() + 1, // el mas 1 es porque getMonth() devuelve un valor entre 0 y 11
anio: hoy.getFullYear()
}
}



// CALCULAR DÍAS DE UN MES
// Esta función devuelve cuántos días tiene un mes.
// Se usa para calcular los tiempos del modelo matemático.

const diasMes = (anio, mes) => {

return new Date(anio, mes, 0).getDate()

}




// FUNCIÓN PARA OBTENER NOMBRE DEL MES DE ACUERDO AL MES ACTUAL
// Permite mostrar los meses reales en la gráfica.
// Por ejemplo:
// mes -2 -> Enero
// mes -1 -> Febrero
// mes actual -> Marzo
// mes +1 -> Abril

const obtenerMesRelativo = (offset) => {

const hoy = new Date()

let mes = hoy.getMonth() + 1 + offset

if(mes <= 0) mes += 12
if(mes > 12) mes -= 12

const nombres = [
"Enero","Febrero","Marzo","Abril","Mayo","Junio",
"Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

return nombres[mes - 1]
}



// GENERAR LABELS DE MESES PARA LAS GRÁFICAS
const labelsMeses = () => {

return [
obtenerMesRelativo(-2),
obtenerMesRelativo(-1),
obtenerMesRelativo(0),
obtenerMesRelativo(1),
obtenerMesRelativo(2),
obtenerMesRelativo(3),
obtenerMesRelativo(4)
]

}




// MODELO MATEMÁTICO DE PREDICCIÓN
// Aquí se encuentra el MODELO EXPONENCIAL.
// Se utiliza la ecuación:
// x(t) = C * e^(k*t)
// donde:
// C = condición inicial
// k = tasa de crecimiento
// t = tiempo
// Este modelo estima la evolución de faltas a lo largo del tiempo usando crecimiento exponencial.

const calcularModelo = () => {

const hoy = new Date()

const diaActual = hoy.getDate()
const mes = hoy.getMonth() + 1
const anio = hoy.getFullYear()

// días de los meses necesarios
const diasMesActual = new Date(anio, mes, 0).getDate()
const diasMesAnterior = new Date(anio, mes - 1, 0).getDate()

const diasRestantes = diasMesActual - diaActual

const diasMes1 = new Date(anio, mes + 1, 0).getDate()
const diasMes2 = new Date(anio, mes + 2, 0).getDate()
const diasMes3 = new Date(anio, mes + 3, 0).getDate()
const diasMes4 = new Date(anio, mes + 4, 0).getDate()



// CONDICIÓN INICIAL DEL MODELO
// La condición inicial se toma como el valor del MES ANTERIOR. Esto representa el punto inicial desde donde comienza el crecimiento del modelo.
const C = mesAnterior //USA LA VARIABLE GLOBAL QUE SE ACTUALIZA CON LOS DATOS DE LA API

// SEGUNDA CONDICIÓN DEL MODELO
// Se usa el acumulado de: faltas del mes anterior + faltas registradas hasta hoy en el mes actual.
const xK = mesAnterior + mesActual

// TIEMPO ENTRE CONDICIONES
// El tiempo se calcula en días:
// días del mes anterior + días transcurridos del mes actual
const tK = diasMesAnterior + diaActual


// TIEMPOS FUTUROS PARA LAS PREDICCIONES
const tP1 = tK + diasRestantes + diasMes1
const tP2 = tP1 + diasMes2
const tP3 = tP2 + diasMes3
const tP4 = tP3 + diasMes4




// CÁLCULO DE LA TASA DE CRECIMIENTO
// Se despeja k de la ecuación exponencial.
const k = Math.log(xK / C) / tK



// CÁLCULO DE VALORES ACUMULADOS FUTUROS
const acumuladoP1 = C * Math.exp(k * tP1)
const acumuladoP2 = C * Math.exp(k * tP2)
const acumuladoP3 = C * Math.exp(k * tP3)
const acumuladoP4 = C * Math.exp(k * tP4)



// CONVERSIÓN A FALTAS POR MES
// Como el modelo genera valores acumulados se obtiene cada mes restando acumulados.

pred1 = Math.round(acumuladoP1 - xK)
pred2 = Math.round(acumuladoP2 - acumuladoP1)
pred3 = Math.round(acumuladoP3 - acumuladoP2)
pred4 = Math.round(acumuladoP4 - acumuladoP3)

// evitar valores negativos

if(pred1 < 0) pred1 = 0
if(pred2 < 0) pred2 = 0
if(pred3 < 0) pred3 = 0
if(pred4 < 0) pred4 = 0
}




// MOSTRAR RESULTADOS EN LA INTERFAZ
// Esta función actualiza los valores visibles
// en el HTML del sistema.

const mostrar = () => {

document.getElementById("historicas").innerText =
mesAnterior + mesAnterior2

document.getElementById("actuales").innerText =
mesActual

document.getElementById("pendientes").innerText =
pred1 + pred2 + pred3 + pred4

}







// CONSULTA DE FALTAS POR EMPLEADO
// Esta función consulta la API enviando el ID del empleado.
// El backend devuelve:
// mesActual
// mesAnterior
// mesAnterior2
// que son las faltas del empleado en esos meses. ejmeplo mes actual -> 5 faltas, mes anterior -> 3 faltas, mes anterior2 -> 2 faltas
// Con esos datos se ejecuta el modelo.

const generarEmpleado = async () => {
const dataStorage = JSON.parse(localStorage.getItem("seleccionPrediccion"));
const ID = dataStorage.id;
const id =
document.getElementById("idEmpleado").value
const fecha = obtenerFecha()

const res = await fetch(API + "/faltas/empleado",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

mes: fecha.mes,
anio: fecha.anio,
idEmpleado: ID

})

})

const data = await res.json()

mesActual = data.mesActual
mesAnterior = data.mesAnterior
mesAnterior2 = data.mesAnterior2

calcularModelo()

mostrar()

}



// ======================================================
// CONSULTA DE FALTAS POR DEPARTAMENTO
// ======================================================
//
// Funciona igual que la consulta por empleado,
// pero envía el ID del departamento.

const generarDepartamento = async () => {

const id =
document.getElementById("idDepartamento").value

const fecha = obtenerFecha()

const res = await fetch(API + "/faltas/departamento",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({ // lo que el api espera recibir en el body para procesar la consulta
mes: fecha.mes,
anio: fecha.anio,
idDepartamento: id
})
})

const data = await res.json()
mesActual = data.mesActual
mesAnterior = data.mesAnterior
mesAnterior2 = data.mesAnterior2
calcularModelo()
mostrar()
}



// ======================================================
// GRAFICA LINEAL
// ======================================================
//
// Muestra la evolución de faltas a lo largo del tiempo.

const graficaLineal = () => {
if(chart) chart.destroy()
const ctx =
document.getElementById("grafica")
chart = new Chart(ctx,{
type:"line",
data:{
labels: labelsMeses(),
datasets:[{
label:"Faltas",
data:[
mesAnterior2,
mesAnterior,
mesActual,
pred1,
pred2,
pred3,
pred4
]
}]
},
options:{
scales:{
y:{
beginAtZero:true,
ticks:{
stepSize:1
}
}
}
}
})
}




// GRAFICA DE BARRAS
// Representa los mismos datos pero en formato de barras.
const graficaBarras = () => {

if(chart) chart.destroy()

const ctx =
document.getElementById("grafica")

chart = new Chart(ctx,{

type:"bar",

data:{
labels: labelsMeses(),

datasets:[{

label:"Faltas",

data:[
mesAnterior2,
mesAnterior,
mesActual,
pred1,
pred2,
pred3,
pred4
]

}]

},

options:{
scales:{
y:{
beginAtZero:true,
ticks:{
stepSize:1
}
}
}
}

})

}

























const API_EMPLEADOS = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/empleados";
const API_DEPARTAMENTOS = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/departamentos";

let paginaActual = 0;
const resultadosPorPagina = 10;

let modoActual = "empleados";



// ==============================
// LISTAR EMPLEADOS
// ==============================
const listarEmpleados = () => {

    modoActual = "empleados";
    paginaActual = 0;

    configurarColumnasEmpleados();
    cargarEmpleados(0);
};


// ==============================
// CONFIGURAR COLUMNAS EMPLEADOS
// ==============================
const configurarColumnasEmpleados = () => {

    document.querySelector("thead tr").innerHTML = `
        <th class="py-3 px-4 font-bold text-slate-700">Nombre</th>
        <th class="py-3 px-4 font-bold text-slate-700">Departamento</th>
        <th class="py-3 px-4 font-bold text-slate-700">Puesto</th>
        <th class="py-3 px-4 font-bold text-slate-700 text-center">Acciones</th>
    `;
};


// ==============================
// CARGAR EMPLEADOS
// ==============================
const cargarEmpleados = (direccion) => {

    let paginaConsulta = paginaActual;

    if (direccion === 1) paginaConsulta++;

    if (direccion === 0 && paginaActual > 0) paginaConsulta--;

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
// MOSTRAR EMPLEADOS
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

                <button class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">
                    Ver
                </button>

                <button
                    onclick="predecirSeleccion(${emp.Id_Empleado})"
                    class="bg-green-600 text-white px-3 py-1 rounded-lg">
                    Predecir
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

    configurarColumnasDepartamentos();

    fetch(API_DEPARTAMENTOS)
        .then(res => res.json())
        .then(data => {

            mostrarDepartamentos(data.data);

        })
        .catch(err => console.error(err));

};


// ==============================
// CONFIGURAR COLUMNAS DEPARTAMENTOS
// ==============================
const configurarColumnasDepartamentos = () => {

    document.querySelector("thead tr").innerHTML = `
        <th class="py-3 px-4 font-bold text-slate-700">Departamento</th>
        <th class="py-3 px-4 font-bold text-slate-700">ID</th>
        <th class="py-3 px-4 font-bold text-slate-700 text-center">Acciones</th>
    `;
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

            <td class="py-3 px-4 text-center">

                <button class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">
                    Ver
                </button>

                <button
                    onclick="predecirSeleccion(${dep.Id_Departamento})"
                    class="bg-green-600 text-white px-3 py-1 rounded-lg">
                    Predecir
                </button>

            </td>

        </tr>
        `;
    });

};


// ==============================
// FUNCIÓN PREDECIR (LA CLAVE 🔥)
// ==============================
const predecirSeleccion = (id) => {

    const datos = {
        id: id
    };

    localStorage.setItem("seleccionPrediccion", JSON.stringify(datos));

    generarEmpleado()
    
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
// BUSCADOR
// ==============================
document.getElementById("busqueda").addEventListener("keyup", e => {

    const texto = e.target.value.toLowerCase();

    const filas = document.querySelectorAll("#tabla-empleados tr");

    filas.forEach(fila => {

        const contenido = fila.textContent.toLowerCase();

        fila.style.display = contenido.includes(texto) ? "" : "none";

    });

});




const calcularModelo8 = () => {
    //FECHA ACTUAL
    const fecha = new Date();
    const diaActual = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const diasMesAnterior = diasMes(anio, mes - 1);
    const diasMesActual = diasMes(anio, mes);

    //  VALIDACIÓN
    // Evita división por 0
    if (mesAnterior === 0) {
        pred1 = pred2 = pred3 = pred4 = 0;
        return;
    }

 // PUNTOS REALES DEL MODELO
    // NO usamos tiempo 


    // Punto 1 (mes anterior completo)
    const t1 = diasMesAnterior;
    const x1 = mesAnterior;

    // Punto 2 (mes actual acumulado)
    const t2 = diasMesAnterior + diaActual;
    const x2 = mesAnterior + mesActual;


    //CALCULO DE k
    // k = ln(x2/x1) / (t2 - t1)
    const k = Math.log(x2 / x1) / (t2 - t1);

    // CALCULO DE C
    // C = x1 / e^(k*t1)

    const C = x1 / Math.exp(k * t1);

    // =========================
    //TIEMPOS FUTUROS
    // =========================

    const diasRestantes = diasMesActual - diaActual;

    const diasMes1 = diasMes(anio, mes + 1);
    const diasMes2 = diasMes(anio, mes + 2);
    const diasMes3 = diasMes(anio, mes + 3);
    const diasMes4 = diasMes(anio, mes + 4);

    // Tiempo base = tiempo actual acumulado
    const tBase = t2;

    const tP1 = tBase + diasRestantes + diasMes1;
    const tP2 = tP1 + diasMes2;
    const tP3 = tP2 + diasMes3;
    const tP4 = tP3 + diasMes4;

    // =========================
    // 🔹 MODELO EXPONENCIAL
    // x(t) = C * e^(k*t)
    // =========================

    const acumuladoActual = x2;

    const acumuladoP1 = C * Math.exp(k * tP1);
    const acumuladoP2 = C * Math.exp(k * tP2);
    const acumuladoP3 = C * Math.exp(k * tP3);
    const acumuladoP4 = C * Math.exp(k * tP4);

    // =========================
    // 🔹 RESULTADO FINAL
    // Convertimos acumulado → mensual
    // =========================

    pred1 = Math.max(0, Math.round(acumuladoP1 - acumuladoActual));
    pred2 = Math.max(0, Math.round(acumuladoP2 - acumuladoP1));
    pred3 = Math.max(0, Math.round(acumuladoP3 - acumuladoP2));
    pred4 = Math.max(0, Math.round(acumuladoP4 - acumuladoP3));
};