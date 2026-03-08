const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/misvis";

const cargarInfo = () => {
  // Usamos fetch para hacer la petición HTTP
  fetch(urlApi)
    .then((respuesta) => respuesta.json()) // Convertimos la respuesta cruda a formato JSON
    .then((data) => {
      // La API devuelve un objeto con una propiedad 'items' que contiene el array
      const informacion = data[0]; // Accedemos al primer elemento del array

      console.log("Datos recibidos:", informacion); // Debugging en consola

      // Llamamos a la función que se encarga de dibujar en pantalla
      mostrar(informacion);
    })
    .catch((error) => {
      // Buena práctica: Manejar errores por si falla la red o la API
      console.error("Error al cargar la informacion:", error);
      alert("Hubo un error al cargar los datos. Revisa la consola.");
    });
};

// Función encargada de manipular el DOM
const mostrar = (informacion) => {
  document.getElementById("mision").textContent = informacion.mision;
  document.getElementById("vision").textContent = informacion.vision;
 document.getElementById("PE").textContent = informacion.info;

  document.getElementById("imgMision").src = informacion.img_mision;
  document.getElementById("imgVision").src = informacion.img_vision;
document.getElementById("imgPE").src = informacion.iminfo;
};
