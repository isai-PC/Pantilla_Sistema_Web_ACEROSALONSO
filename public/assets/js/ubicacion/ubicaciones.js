const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/ubicaciones";
const nombre = localStorage.getItem("nombre");

// para que al inicio aparezca 
window.onload = function () {
    mostrarNombreUsuario();
    cargarUbicaciones();
};

// y el nombre del usuario
function mostrarNombreUsuario() {
    const elementoNombre = document.getElementById("nombre");
    if (elementoNombre && nombre) {
        elementoNombre.textContent = "Usuario: " + nombre;
    }
}

// para listado
async function cargarUbicaciones() {
    const contenedor = document.getElementById("contenedorUbicaciones");
    if (!contenedor) return;

    contenedor.innerHTML = `<p class="text-center">Cargando...</p>`;

    try {
        const res = await fetch(urlApi);
        const json = await res.json();
        const ubicaciones = json.data;

        contenedor.innerHTML = "";

        ubicaciones.forEach(u => {
            const linkMapa = `https://www.google.com/maps?q=${u.latitud},${u.longitud}`;

            const card = `
                <div class="bg-white p-4 rounded shadow">
                    <img src="${u.url}" class="w-full h-40 object-cover mb-2">
                    <h3 class="font-bold">${u.descripcion}</h3>

                    <a href="${linkMapa}" target="_blank" class="text-blue-500 underline">
                        Ver mapa
                    </a>

                    <p class="text-xs">Lat: ${u.latitud} | Lng: ${u.longitud}</p>

                    <div class="flex gap-2 mt-3">
                        <button onclick="editar(${u.id})" class="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors">
                            Editar
                        </button>
                        <button onclick="eliminar(${u.id})"  class="inline-flex items-center justify-center text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<p>Error al cargar</p>`;
    }
}

// me lleva a editar
function editar(id) {
    localStorage.setItem("ubicacionEditarId", id);
    window.location.href = "editarUbicación.html";
}

// para eliminar la ubi
async function eliminar(id) {
    const result = await Swal.fire({
        title: "¿Eliminar ubicación?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar"
    });

    if (!result.isConfirmed) return;

    try {
        const res = await fetch(`${urlApi}/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                timer: 1500,
                showConfirmButton: false
            });
            cargarUbicaciones();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error al eliminar"
            });
        }

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión"
        });
    }
}