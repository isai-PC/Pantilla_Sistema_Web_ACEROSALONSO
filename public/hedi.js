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
    const fechaInicial = new Date('2025/12/31'); 

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
 
   
    let xCI = faltasEnero; /*Condicion inical faltas de enero API */   let tCI =0; /*tiempo 0 */ 
    let xK = faltasActual; /*Faltas hasta el dia actual API */    let tK = diferenciaDias; /*tiempo actual API */

    let xP1;  let tP1 = diferenciaDiasIngresado;

    let C=xCI;
    const k = Math.log(xK / C) / tK; 
    const P1 = C * Math.exp(k* tP1);

    document.getElementById("P1").value= ` ${P1}`;

}

const calcularP2 = () => {
        const fechaInicial = new Date('2025/12/31'); 

    // Forzamos que 'hoy' no tenga horas/minutos
    const fechaFinal = new Date(); 
    fechaFinal.setHours(0, 0, 0, 0); 

    const msPorDia = 86400000;
    const diferenciaDias = Math.round((fechaFinal - fechaInicial) / msPorDia);
    const numerofaltas = document.getElementById('faltas').value;

    let xCI = faltasEnero; /*Condicion inical faltas de enero API */   let tCI =0; /*tiempo 0 */ 
    let xK = faltasActual; /*Faltas hasta el dia actual API */    let tK = diferenciaDias; /*tiempo actual API */

    let xP2=numerofaltas;  let tP2;

    // resultados
    let C=xCI;
    const k = Math.log(xK / C) / tK; 
    const P2 = Math.log( xP2/ C) / k;

    document.getElementById("P2").value= ` ${P2}`;
}


const pruebaModelo = () => {

    let fecha= document.getElementById('fecha').value;
    let faltas = document.getElementById('faltas').value;

    const fechaInicial = new Date('2026-01-01');
    const fechaFinal = new Date(); // hoy

    const diferenciaDias = Math.round((fechaFinal - fechaInicial) / (1000 * 60 * 60 * 24));

    // variables 
    let xCI = 13; /*Condicion inical faltas de enero API */   let tCI =0; /*tiempo 0 */ 
    let xK = 28; /*Faltas hasta el dia actual API */    let tK = 69; /*tiempo actual API */

    let xP1;  let tP1 = 70;
    let xP2=28;  let tP2;

    // resultados
    let C=xCI;
    const k = Math.log(xK / C) / tK; 
    const P1 = C * Math.exp(k* tP1);
    const P2 = Math.log( xP2/ C) / k;

    // mostrar resultados
    alert(
        "Resultado 1: " + k + "\n" +
        "Resultado 2: " + P1 + "\n" +
        "Resultado 3: " + P2 + "\n" +
        "Diferencia en días: " + diferenciaDias
    );

};