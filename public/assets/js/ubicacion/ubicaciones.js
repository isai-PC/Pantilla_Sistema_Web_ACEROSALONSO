const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/ubicaciones";
const nombre = localStorage.getItem("nombre");

// ====================== INICIO ======================
window.onload = function () {
    // Detectar en qué página estamos por el ID del contenedor principal
    if (document.getElementById("contenedorUbicaciones")) {
        cargarUbicaciones();
        mostrarNombreUsuario();
    }

    if (document.getElementById("descripcion")) {
        cargarDatosEdicion();
        const btnGuardar = document.getElementById("btnGuardarFinal");
        if (btnGuardar) {
            btnGuardar.addEventListener("click", guardarEdicion);
        }
    }
};


    const elementoNombre = document.getElementById("nombre");
    if (elementoNombre) {
        elementoNombre.textContent = "Usuario: " + nombre;
    }


// ====================== LISTADO ======================
async function cargarUbicaciones() {
    const contenedor = document.getElementById("contenedorUbicaciones");
    if (!contenedor) return;

    contenedor.innerHTML = `<p class="text-center text-slate-500 font-semibold col-span-3">Cargando ubicaciones...</p>`;

    try {
        const respuesta = await fetch(urlApi);
        if (!respuesta.ok) throw new Error("Error en la petición");

        const json = await respuesta.json();
        const ubicaciones = json.data || json; // Maneja si viene envuelto en 'data' o no

        contenedor.innerHTML = "";
        if (!ubicaciones || ubicaciones.length === 0) {
            contenedor.innerHTML = `<p class="text-center text-slate-500 font-semibold col-span-3">No hay ubicaciones registradas</p>`;
            return;
        }

        ubicaciones.forEach(u => {
            const imagen = u.url || "https://via.placeholder.com/400x200?text=Sin+Imagen";
            // Corrección de URL de Google Maps
            const linkMapa = (u.latitud && u.longitud) 
                ? `https://www.google.com/maps?q=${u.latitud},${u.longitud}` 
                : "#";

            const card = document.createElement("div");
            card.className = "bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden flex flex-col";
            card.innerHTML = `
                <img src="${imagen}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/400x200?text=Error+Imagen'">
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-lg font-bold text-slate-800 mb-2">${u.descripcion || "Sin nombre"}</h3>
                    <a href="${linkMapa}" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block font-semibold underline">
                        Ver ubicación en mapa
                    </a>
                    <p class="text-xs text-slate-500 mb-3">Lat: ${u.latitud || "-"} | Lng: ${u.longitud || "-"}</p>
                    <div class="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                        <button onclick="editar(${u.id})" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md text-sm transition-colors">
                            Editar
                        </button>
                        <button onclick="eliminar(${u.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-md text-sm transition-colors">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<p class="text-center text-red-500 font-semibold col-span-3">Error al cargar datos</p>`;
    }
}

// ====================== EDICIÓN ======================
function editar(id) {
    localStorage.setItem("ubicacionEditarId", id);
    window.location.href = "editarUbicación.html";
}

async function cargarDatosEdicion() {
    const id = localStorage.getItem("ubicacionEditarId");
    if (!id) return;

    try {
        const respuesta = await fetch(`${urlApi}/${id}`);
        if (!respuesta.ok) throw new Error("No se encontró la ubicación");

        const json = await respuesta.json();
        const u = json.data || json;

        // Llenar los campos del formulario
        document.getElementById("descripcion").value = u.descripcion || "";
        document.getElementById("url").value = u.url || "";
        document.getElementById("latitud").value = u.latitud || "";
        document.getElementById("longitud").value = u.longitud || "";

        // Mostrar ID en el encabezado
        const spanId = document.querySelector("p span.text-orange-500");
        if (spanId) spanId.textContent = "#Suc-" + id;

        // Preview de imagen
        const imgPreview = document.getElementById("img-preview");
        if (imgPreview) {
            imgPreview.src = u.url || "https://via.placeholder.com/150?text=Sin+Imagen";
        }

    } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Error al obtener los datos de la sucursal.");
    }
}
async function guardarEdicion(e) {
    e.preventDefault();
    const id = localStorage.getItem("ubicacionEditarId");
    if (!id) return;

    // Creamos un objeto simple en lugar de FormData
    const datos = {
        descripcion: document.getElementById("descripcion").value,
        url: document.getElementById("url").value,
        latitud: document.getElementById("latitud").value,
        longitud: document.getElementById("longitud").value
    };

    try {
        const res = await fetch(`${urlApi}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json" // Especificamos que enviamos JSON
            },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            alert("¡Actualizado con éxito!");
            window.location.href = "listadoUbicaciones.html";
        } else {
            const errorText = await res.text();
            console.error("Respuesta error:", errorText);
            alert("Error al actualizar: " + res.status);
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error de conexión al intentar guardar.");
    }
}
// ====================== ELIMINAR ======================
async function eliminar(id) {
    if (!confirm("¿Seguro que deseas eliminar esta ubicación?")) return;

    try {
        const res = await fetch(`${urlApi}/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("Eliminado correctamente");
            cargarUbicaciones();
        } else {
            alert("No se pudo eliminar");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}