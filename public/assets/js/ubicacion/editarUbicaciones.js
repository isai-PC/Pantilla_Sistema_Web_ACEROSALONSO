const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/ubicaciones";
//estos dos son de cloudinary 
const cloudName = "dr16zjtpb";
const uploadPreset = "present5C";

const id = localStorage.getItem("ubicacionEditarId");

// para el inicio
window.onload = function () {
    if (!id) {
        Swal.fire("Error", "No hay ID", "error");
        return;
    }

    cargarDatos();

    document.getElementById("btnGuardarFinal")
        .addEventListener("click", guardarEdicion);

    document.getElementById("imagen-input")
        .addEventListener("change", previewImagen);
};

// la imagen
function previewImagen() {
    const file = this.files[0];
    const preview = document.getElementById("img-preview");

    if (file) {
        preview.src = URL.createObjectURL(file);
    }
}

// donde se saca las corde
function extraerCoordenadas(url) {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = url.match(regex);

    if (match) return { lat: match[1], lng: match[2] };

    const regex2 = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match2 = url.match(regex2);

    if (match2) return { lat: match2[1], lng: match2[2] };

    return null;
}

// para subir la imagen a cloudinary
async function subirImagen(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    return data.secure_url;
}

// cargar los datos de la ubicacion
async function cargarDatos() {
    try {
        const res = await fetch(`${urlApi}/${id}`);
        const json = await res.json();
        const u = json.data || json;

        document.getElementById("descripcion").value = u.descripcion;
        document.getElementById("url").value =
            `https://www.google.com/maps?q=${u.latitud},${u.longitud}`;

        document.getElementById("img-preview").src = u.url;

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
}

// y para a guardar
async function guardarEdicion(e) {
    e.preventDefault();

    const descripcion = document.getElementById("descripcion").value.trim();
    const file = document.getElementById("imagen-input").files[0];
    const urlMaps = document.getElementById("url").value.trim();

    if (!descripcion || !urlMaps) {
        Swal.fire("Campos incompletos", "Faltan datos", "warning");
        return;
    }

    try {
        let imageUrl = document.getElementById("img-preview").src;

        //por si hay otra imagen
        if (file) {
            Swal.fire({
                title: "Subiendo imagen...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            imageUrl = await subirImagen(file);
        }

        const coords = extraerCoordenadas(urlMaps);

        if (!coords) {
            Swal.fire("Error", "Link inválido de Google Maps", "error");
            return;
        }

        const res = await fetch(`${urlApi}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descripcion,
                url: imageUrl,
                latitud: coords.lat,
                longitud: coords.lng
            })
        });

        if (res.ok) {
            Swal.fire("Éxito", "Actualizado correctamente", "success")
                .then(() => {
                    window.location.href = "listadoUbicaciones.html";
                });
        } else {
            Swal.fire("Error", "Error al actualizar", "error");
        }

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrió un problema", "error");
    }
}