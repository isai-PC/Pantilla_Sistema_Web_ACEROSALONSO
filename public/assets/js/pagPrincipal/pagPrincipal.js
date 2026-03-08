const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";
//https://repositorio-para-vercel-tawny.vercel.app/api/productos?limit=5&start=10

const cargarPersonajes = () => {
  // Usamos fetch para hacer la petición HTTP
  fetch(urlApi+"?limit=20&start=0")
    .then((respuesta) => respuesta.json()) // Convertimos la respuesta cruda a formato JSON
    .then((data) => {
      // La API devuelve un objeto con una propiedad 'items' que contiene el array
      const personajes = data.results;

      console.log("Datos recibidos:", personajes); // Debugging en consola

      // Llamamos a la función que se encarga de dibujar en pantalla
      mostrar(personajes);
    })
    .catch((error) => {
      // Buena práctica: Manejar errores por si falla la red o la API
      console.error("Error al cargar los personajes:", error);
      alert("Hubo un error al cargar los datos. Revisa la consola.");
    });
};

// Función encargada de manipular el DOM
const mostrar = (personajes) => {
  const contenedorper = document.getElementById("contenedor-personajes");

  contenedorper.innerHTML = "";
  

  // Recorremos cada producto
  personajes.forEach((personaje) => {
    const tarjeta = document.createElement("article");

    const clases =
      "bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition";
    tarjeta.classList.add(...clases.split(" "));

    tarjeta.innerHTML = `
    <a href="vistaDetalle.html?id=${personaje.id}">
      <img src="${urlImgApi+personaje.id+".webp"}" alt="${personaje.name}"
           style="object-fit:contain;height:300px;width:100%;">
             </a>
             <br>
      <h3>${personaje.name}</h3>
      <p><strong>Edad:</strong> ${personaje.age}</p>
      <p><strong>Ocupacion:</strong> ${personaje.occupation}</p>
    `;

    contenedorper.appendChild(tarjeta);
  });
};
