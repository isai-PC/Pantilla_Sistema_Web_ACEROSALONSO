const urlpreguntas = "https://repo-vercel-m3tb.vercel.app/api/preguntas";

document.addEventListener("DOMContentLoaded", function () {

  
  const contenedor = document.getElementById("contenedorPreguntas");
  const preguntaFooter = document.getElementById("preguntaFooter");
  const respuestaFooter = document.getElementById("respuestaFooter");

  fetch(urlpreguntas)
    .then(res => res.json())
    .then(data => {

      console.log("DATA:", data);

      if (!data.data || data.data.length === 0) {

        if (preguntaFooter && respuestaFooter) {
          preguntaFooter.textContent = "Sin datos";
          respuestaFooter.textContent = "";
        }

        return;
      }

      // 🔥 LISTADO (solo si existe)
      if (contenedor) {

        contenedor.innerHTML = "";

        data.data.forEach(info => {

          const bloque = document.createElement("div");
          bloque.className = "bg-gray-100 rounded-xl shadow-md overflow-hidden mb-4";

          bloque.innerHTML = `
            <button class="w-full text-left px-6 py-4 font-semibold text-gray-800">
              ${info.pregunta}
            </button>
            <div class="px-6 py-4 text-gray-600 bg-white">
              ${info.respuesta}
            </div>
          `;

          contenedor.appendChild(bloque);
        });
      }

      // 🔥 FOOTER (siempre)
      const random = data.data[Math.floor(Math.random() * data.data.length)];

      if (preguntaFooter && respuestaFooter) {
        preguntaFooter.textContent = random.pregunta;
        respuestaFooter.textContent = random.respuesta;
      }

    })
    .catch(error => {
      console.error("ERROR:", error);

      if (preguntaFooter && respuestaFooter) {
        preguntaFooter.textContent = "Error";
        respuestaFooter.textContent = "No disponible";
      }
    });

});