const urlApiFaltas = "https://repositorio-para-vercel-tawny.vercel.app/api/incidencias/faltas";

let faltasEnero = 0;
let faltasActual = 0;

const cargarDatosIniciales = () => {

  const fechaFinal = new Date();
  const fechaHoy = fechaFinal.toISOString().split("T")[0]; // formato YYYY-MM-DD

  fetch(urlApiFaltas, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fechaHoy: fechaHoy
    })
  })
    .then((respuesta) => respuesta.json())
    .then((data) => {

      console.log("Datos recibidos:", data);

      // Guardamos en variables globales
      faltasEnero = data.faltasEnero;
      faltasActual = data.faltasActual;

      // Mostrar en pantalla
      mostrarDatos();

    })
    .catch((error) => {
      console.error("Error al cargar las faltas:", error);
      alert("Error al cargar los datos");
    });


};

const mostrarDatos = () => {
  document.getElementById("faltasEnero").textContent =
    `Faltas registradas durante el primer mes del año (Enero): ${faltasEnero}`;

  document.getElementById("faltasActuales").textContent =
    `Total de faltas registradas hasta ahora: ${faltasActual}`;
};

const calcularP1 = () => {
  const fechaInicial = new Date('2026/01/31');

  // Forzamos que 'hoy' no tenga horas/minutos
  const fechaFinal = new Date();
  fechaFinal.setHours(0, 0, 0, 0);

  const fechaInput = document.getElementById('fecha').value;
  // Usamos split y new Date(año, mes, día) para evitar errores de formato
  const [anio, mes, dia] = fechaInput.split('-');
  const fechaIngresada = new Date(anio, mes - 1, dia);

  const msPorDia = 86400000;

  // Ahora el cálculo será exacto y sin decimales molestos
  const diferenciaDias = Math.round((fechaFinal - fechaInicial) / msPorDia);
  const diferenciaDiasIngresado = Math.round((fechaIngresada - fechaInicial) / msPorDia);


  let xCI = faltasEnero; /*Condicion inical faltas de enero API */   let tCI = 0; /*tiempo 0 */
  let xK = faltasActual; /*Faltas hasta el dia actual API */    let tK = diferenciaDias; /*tiempo actual API */

  let xP1; let tP1 = diferenciaDiasIngresado;

  let C = xCI;
  const k = Math.log(xK / C) / tK;
  const P1 = C * Math.exp(k * tP1);

  document.getElementById("P1").value = ` ${P1}`;
  calcularTabla()

}

const calcularP2 = () => {
  const fechaInicial = new Date('2026/01/31');

  // Forzamos que 'hoy' no tenga horas/minutos
  const fechaFinal = new Date();
  fechaFinal.setHours(0, 0, 0, 0);

  const msPorDia = 86400000;
  const diferenciaDias = Math.round((fechaFinal - fechaInicial) / msPorDia);
  const numerofaltas = document.getElementById('faltas').value;

  let xCI = faltasEnero; /*Condicion inical faltas de enero API */   let tCI = 0; /*tiempo 0 */
  let xK = faltasActual; /*Faltas hasta el dia actual API */    let tK = diferenciaDias; /*tiempo actual API */

  let xP2 = numerofaltas; let tP2;

  // resultados
  let C = xCI;
  const k = Math.log(xK / C) / tK;
  const P2 = Math.log(xP2 / C) / k;

  document.getElementById("P2").value = ` ${P2}`;


}

/* const calcularTabla = () => {

    const fechaInicial = new Date('2026-01-31');

    const fechaFinal = new Date();
    fechaFinal.setHours(0,0,0,0);

    const msPorDia = 86400000;
    const diferenciaDias = Math.round((fechaFinal - fechaInicial) / msPorDia);

    // días acumulados por mes
    const diasMes = [0,28,59,89,120,150,181,212,242,273,303,334];

    // datos iniciales (de tu API)
    let xCI = faltasEnero;   // faltas registradas en enero
    let xK = faltasActual;   // faltas hasta hoy
    let tK = diferenciaDias; // día actual del año

    let C = xCI;

    // constante de crecimiento
    const k = Math.log(xK / C) / tK;

    // arreglo donde guardaremos resultados
    const estimacionMeses = [];

    // ciclo para recorrer meses
    for(let i = 0; i < diasMes.length; i++){

        let mes = diasMes[i];

        const p1 = C * Math.exp(k * mes);

        estimacionMeses.push(p1);

    }

    return estimacionMeses;
  

} */

const calcularTabla = () => {
  // 1. Definir fechas y diferencia de días
  const fechaInicial = new Date('2026-01-31');
  const fechaFinal = new Date();
  fechaFinal.setHours(0, 0, 0, 0);
  const msPorDia = 86400000;
  const diferenciaDias = Math.round((fechaFinal - fechaInicial) / msPorDia);

  // Días acumulados por mes (usados para la fórmula)
  const diasMes = [0, 28, 59, 89, 120, 150, 181, 212, 242, 273, 303, 334];

  // Datos iniciales
  let xCI = faltasEnero
  let xK = faltasActual
  let tK = diferenciaDias;
  let C = xCI;

  // Calcular constante k (evitando división por cero)
  const k = (tK !== 0 && C !== 0) ? Math.log(xK / C) / tK : 0;
  // arreglo donde guardaremos resultados
  const estimacionMeses = [];

  // Seleccionamos todas las celdas de datos de la tabla (los <td> del tbody)
  const celdasFaltas = document.querySelectorAll('#tablaFaltas tbody td');

  // Ciclo para calcular y mostrar en la tabla
  for (let i = 0; i < diasMes.length; i++) {
    let mes = diasMes[i];
    const p1 = C * Math.exp(k * mes);

    // Guardamos el resultado redondeado
    const resultadoFinal = Math.round(p1);
    estimacionMeses.push(resultadoFinal);

    // --- CONEXIÓN CON LA TABLA ---
    if (celdasFaltas[i]) {
      celdasFaltas[i].innerText = resultadoFinal;
    }
  }
  /* GUARDAR LOS DATOS DE FORMA TEMPORAL EN EL NAAVEGADOR PARA ENVIARLOS A LA GRAFICA Con el NOMBRE DE datosGraficaFaltas*/
  localStorage.setItem('datosGraficaFaltas', JSON.stringify(estimacionMeses));
  return estimacionMeses;
}

const pruebaModelo = () => {

  let fecha = document.getElementById('fecha').value;
  let faltas = document.getElementById('faltas').value;

  const fechaInicial = new Date('2026-01-01');
  const fechaFinal = new Date(); // hoy

  const diferenciaDias = Math.round((fechaFinal - fechaInicial) / (1000 * 60 * 60 * 24));

  // variables 
  let xCI = 13; /*Condicion inical faltas de enero API */   let tCI = 0; /*tiempo 0 */
  let xK = 28; /*Faltas hasta el dia actual API */    let tK = 69; /*tiempo actual API */

  let xP1; let tP1 = 70;
  let xP2 = 28; let tP2;

  // resultados
  let C = xCI;
  const k = Math.log(xK / C) / tK;
  const P1 = C * Math.exp(k * tP1);
  const P2 = Math.log(xP2 / C) / k;

  // mostrar resultados
  alert(
    "Resultado 1: " + k + "\n" +
    "Resultado 2: " + P1 + "\n" +
    "Resultado 3: " + P2 + "\n" +
    "Diferencia en días: " + diferenciaDias
  );
};