const tabla = document.getElementById("tablaFaltas");

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
