/* const tabla = document.getElementById("tablaFaltas");

const meses = [];
const faltas = [];

const filaMeses = tabla.rows[0].cells;
const filaFaltas = tabla.rows[1].cells;

for (let i = 1; i < filaMeses.length; i++) {
    meses.push(filaMeses[i].innerText);
    faltas.push(parseInt(filaFaltas[i].innerText));
}

const ctx = document.getElementById('graficaFaltas');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: meses,
        datasets: [{
            label: 'Faltas por mes',
            data: faltas,
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
 */

// 1. Recuperar los datos del localStorage
const datosGuardados = localStorage.getItem('datosGraficaFaltas');

// 2 Convertir el texto guardado de vuelta a un arreglo numérico. 
const faltas = datosGuardados ? JSON.parse(datosGuardados) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 3meses
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// 4. Configurar e instanciar la gráfica
const ctx = document.getElementById('graficaFaltas').getContext('2d');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: meses,
        datasets: [{
            label: 'Estimación de Faltas por Mes',
            data: faltas,
            borderWidth: 3,
            borderColor: '#f97316', // Naranja (Tailwind orange-500) para que combine con tu diseño
            backgroundColor: 'rgba(249, 115, 22, 0.2)', // Fondo semitransparente bajo la línea
            fill: true, // Rellena el área bajo la curva
            tension: 0.3, // Le da una curva suave a la línea exponencial
            pointBackgroundColor: '#0f172a' // Puntos color oscuro (slate-900)
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});