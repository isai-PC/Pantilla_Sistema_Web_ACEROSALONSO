    const urlApi = "https://repo-vercel-m3tb.vercel.app/api/ubi";

let map;
let controlRuta;
let contenedor;

document.addEventListener("DOMContentLoaded", () => {

  contenedor = document.getElementById("contenedorUbicaciones");

  if (contenedor) {
    cargarUbicaciones();
  }
  const mapaDiv = document.getElementById("mapa");

  if (mapaDiv) {
    cargarMapaDesdeStorage();
  }

});
//para que me muestre en el rutaubi
const cargarUbicaciones = () => {

  fetch(urlApi)
    .then(res => res.json())
    .then(data => {

      contenedor.innerHTML = "";

      // Contenedor tipo grid (importante)
      contenedor.className = ` 

  
  max-w-5xl mx-auto
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
  gap-6 px-4
`;

      data.data.forEach(ubicacion => {

        const div = document.createElement("div");

        // NUEVO ESTILO UNIFORME
        div.className = `
          bg-white rounded-2xl shadow-md overflow-hidden 
          hover:shadow-xl hover:scale-[1.02] 
          transition-all duration-300 cursor-pointer
          flex flex-col
        `;

        div.innerHTML = `
          <img src="${ubicacion.url}" 
               class="w-full h-48 object-cover">

          <div class="p-4 flex flex-col justify-between flex-grow">
            
            <h2 class="text-lg font-bold text-gray-800 mb-2">
              ${ubicacion.descripcion}
            </h2>

            <p class="text-blue-600 font-semibold">Ruta</p>

          </div>
        `;

        div.addEventListener("click", () => {

          localStorage.setItem("latDestino", ubicacion.latitud);
          localStorage.setItem("lngDestino", ubicacion.longitud);
          localStorage.setItem("nombreSucursal", ubicacion.descripcion);

          window.location.href = "rutaubicacion.html"; 
        });

        contenedor.appendChild(div);
      });

    })
    .catch(error => console.error("Error:", error));
};
//aqui se genera el mapa
const cargarMapaDesdeStorage = () => {

  const latDestino = localStorage.getItem("latDestino");
  const lngDestino = localStorage.getItem("lngDestino");
  const nombre = localStorage.getItem("nombreSucursal");

  const titulo = document.querySelector("h1");
  if (titulo && nombre) {
    titulo.textContent = nombre;
  }

  if (!latDestino || !lngDestino) {
    alert("No hay ubicación seleccionada");
    return;
  }

  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {

    const latOrigen = pos.coords.latitude;
    const lngOrigen = pos.coords.longitude;

    if (map) {
      map.remove();
    }

    map = L.map('mapa').setView([latOrigen, lngOrigen], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    controlRuta = L.Routing.control({
      waypoints: [
        L.latLng(latOrigen, lngOrigen),
        L.latLng(latDestino, lngDestino)
      ],
      routeWhileDragging: false,
      language: 'es'
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, () => {
    alert("Activa la ubicación para ver la ruta");
  });

};