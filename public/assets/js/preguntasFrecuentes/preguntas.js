const urlApi = "https://repo-vercel-m3tb.vercel.app/api/preguntas";
//cargar preguntas
const cargarPreguntas = () => {

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(data => {

      console.log("Datos recibidos:", data);

      // Validar que sí haya datos
      if (!data.data || data.data.length === 0) {
        console.warn("No hay preguntas disponibles");
        return;
      }

      const informacion = data.data[0]; // primera pregunta

      mostrar(informacion);

    })
    .catch(error => {
      console.error("Error al cargar preguntas:", error);

      // Mostrar mensaje de error en footer
      const preguntaFooter = document.getElementById("preguntaFooter");
      const respuestaFooter = document.getElementById("respuestaFooter");

      if (preguntaFooter && respuestaFooter) {
        preguntaFooter.textContent = "Error al cargar preguntas";
        respuestaFooter.textContent = "Intenta más tarde.";
      }
    });

};
//para mostrar los datos 
const mostrar = (informacion) => {

  const pregunta = document.getElementById("pregunta");
  const respuesta = document.getElementById("respuesta");

  if (pregunta && respuesta) {
    pregunta.textContent = informacion.pregunta;
    respuesta.textContent = informacion.respuesta;
  }

  // para el footer
  const preguntaFooter = document.getElementById("preguntaFooter");
  const respuestaFooter = document.getElementById("respuestaFooter");

  if (preguntaFooter && respuestaFooter) {
    preguntaFooter.textContent = informacion.pregunta;
    respuestaFooter.textContent = informacion.respuesta;
  }

};
//el inicio
document.addEventListener("DOMContentLoaded", cargarPreguntas);