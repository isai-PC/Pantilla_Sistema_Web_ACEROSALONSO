const urlApi = "https://repo-vercel-m3tb-a98m2v5ue-20241048-svgs-projects.vercel.app/api/ubicaciones";
const nombre = localStorage.getItem("nombre");

// ================= INICIO =================
window.onload = function () {
    cargarUbicaciones();

    // Mostrar nombre usuario
    if (nombre) {
        const elementoNombre = document.getElementById("nombre");
        if (elementoNombre) {
            elementoNombre.textContent = "Usuario: " + nombre;
        }
    }
};

// ================= LISTADO =================
async function cargarUbicaciones() {

    const contenedor = document.getElementById("contenedorUbicaciones");

    contenedor.innerHTML = `
        <p class="text-center text-slate-500 font-semibold col-span-3">
            Cargando ubicaciones...
        </p>
    `;

    try {
        const respuesta = await fetch(urlApi);

        if (!respuesta.ok) throw new Error("Error en la petición");

        const json = await respuesta.json();
        const ubicaciones = json.data;

        contenedor.innerHTML = "";

        if (!ubicaciones || ubicaciones.length === 0) {
            contenedor.innerHTML = `
                <p class="text-center text-slate-500 font-semibold col-span-3">
                    No hay ubicaciones registradas
                </p>
            `;
            return;
        }

        ubicaciones.forEach(u => {

            const imagen = u.url || "https://via.placeholder.com/400x200?text=Sin+Imagen";

            const linkMapa = (u.latitud && u.longitud)
                ? `https://www.google.com/maps?q=${u.latitud},${u.longitud}`
                : "#";

            const card = document.createElement("div");
            card.className = "bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden flex flex-col";

            card.innerHTML = `
                <img src="${imagen}" 
                    class="w-full h-48 object-cover"
                    onerror="this.src='https://via.placeholder.com/400x200?text=Sin+Imagen'">

                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-lg font-bold text-slate-800 mb-2">
                        ${u.descripcion || "Sin nombre"}
                    </h3>

                    <a href="${linkMapa}" target="_blank"
                        class="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block font-semibold underline">
                        Ver ubicación en mapa
                    </a>

                    <p class="text-xs text-slate-500 mb-3">
                        Lat: ${u.latitud || "-"} | Lng: ${u.longitud || "-"}
                    </p>

                    <div class="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                        <button onclick="editar(${u.id})"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                            Editar
                        </button>

                        <button onclick="eliminar(${u.id})"
                            class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;

            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);

        contenedor.innerHTML = `
            <p class="text-center text-red-500 font-semibold col-span-3">
                Error al cargar ubicaciones (CORS o API)
            </p>
        `;
    }
}

// ================= EDITAR =================
function editar(id) {
    localStorage.setItem("ubicacionEditarId", id);
    window.location.href = "agregarUbicaciones.html";
}

// ================= ELIMINAR =================
async function eliminar(id) {

    if (!confirm("¿Eliminar ubicación?")) return;

    try {
        const response = await fetch(`${urlApi}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Ubicación eliminada");
            cargarUbicaciones();
        } else {
            alert("No se pudo eliminar");
        }

    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error de conexión");
    }
}