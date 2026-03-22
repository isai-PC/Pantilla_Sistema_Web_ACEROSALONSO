const urlApi = "https://repo-vercel-m3tb-7ci1zk2ht-20241048-svgs-projects.vercel.app/api/ubicaciones";
const token = localStorage.getItem("token");

// ================= INICIO =================
document.addEventListener("DOMContentLoaded", () => {
    cargarUbicaciones();
});

// ================= LISTADO =================
async function cargarUbicaciones() {
    try {
        const res = await fetch(urlApi, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        const contenedor = document.getElementById("contenedorUbicaciones");

        contenedor.innerHTML = "";

        data.data.forEach(u => {
            contenedor.innerHTML += `
                <div class="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden flex flex-col">
                    
                    <img src="${u.imagen_nombre}" 
                        class="w-full h-48 object-cover"
                        onerror="this.src='https://via.placeholder.com/400x200?text=Sin+Imagen'">

                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="text-lg font-bold text-slate-800 mb-2">
                            ${u.descripcion}
                        </h3>

                        <a href="${u.url}" target="_blank"
                            class="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block font-semibold underline">
                            Ver en Google Maps
                        </a>

                        <div class="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                            <button onclick="editar(${u.id}, '${u.descripcion}', '${u.imagen_nombre}', '${u.url}')"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                                Editar
                            </button>

                            <button onclick="eliminar(${u.id})"
                                class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Error al cargar ubicaciones");
    }
}

// ================= EDITAR =================
function editar(id, descripcion, imagen, url) {
    localStorage.setItem("ubicacionEditar", JSON.stringify({
        id,
        descripcion,
        imagen,
        url
    }));

    window.location.href = "agregarUbicaciones.html";
}

// ================= ELIMINAR =================
async function eliminar(id) {
    if (!confirm("¿Eliminar ubicación?")) return;

    try {
        const res = await fetch(`${urlApi}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            alert("Ubicación eliminada");
            cargarUbicaciones();
        } else {
            alert("Error al eliminar");
        }

    } catch (error) {
        console.error(error);
    }
}