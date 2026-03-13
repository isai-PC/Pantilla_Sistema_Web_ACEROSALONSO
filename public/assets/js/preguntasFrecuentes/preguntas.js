const urlApi = "https://repo-vercel-m3tb.vercel.app/api/preguntas";
const cargarPreguntas = () => {

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(data => {

      console.log("Datos recibidos:", data);

      const informacion = data.data[0]; // tomamos la primera pregunta

      mostrar(informacion);

    })
    .catch(error => {
      console.error("Error:", error);
    });

};

const mostrar = (informacion) => {

  document.getElementById("pregunta").textContent = informacion.pregunta;
  document.getElementById("respuesta").textContent = informacion.respuesta;

  document.getElementById("preguntaFooter").textContent = informacion.pregunta;
  document.getElementById("respuestaFooter").textContent = informacion.respuesta;

};

window.onload = cargarPreguntas;