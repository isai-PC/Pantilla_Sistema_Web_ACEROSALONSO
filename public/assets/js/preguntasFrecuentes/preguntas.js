alert("hayresultados")
const urlApi = "https://repo-vercel-m3tb.vercel.app/api/preguntas";

window.onload = function () {

  const preguntaFooter = document.getElementById("preguntaFooter");
  const respuestaFooter = document.getElementById("respuestaFooter");

  // 🔴 si no encuentra el div, aquí está el problema
  if (!preguntaFooter || !respuestaFooter) {
    console.error("NO EXISTE EL FOOTER EN EL DOM");
    return;
  }

  fetch(urlApi)
    .then(res => res.json())
    .then(data => {

      if (!data.data || data.data.length === 0) {
        preguntaFooter.textContent = "Sin preguntas";
        respuestaFooter.textContent = "";
        return;
      }

      // 🔥 usa random para probar que sí cambia
      const info = data.data[Math.floor(Math.random() * data.data.length)];

      preguntaFooter.textContent = info.pregunta;
      respuestaFooter.textContent = info.respuesta;

    })
    .catch(() => {
      preguntaFooter.textContent = "Error al cargar";
      respuestaFooter.textContent = "Intenta más tarde";
    });

};