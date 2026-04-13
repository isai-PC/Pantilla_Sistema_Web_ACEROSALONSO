const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/ubicaciones";
const token = localStorage.getItem("token");

const cloudName = "dr16zjtpb";
const uploadPreset = "present5C";

// ================= PREVIEW + VALIDACIÓN IMAGEN =================
document.getElementById("imagen-input").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("img-preview");

    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen (jpg, png, webp, etc.)");
        this.value = ""; // limpiar input
        preview.src = "https://via.placeholder.com/150?text=Subir+Imagen";
        return;
    }

    preview.src = URL.createObjectURL(file);
});

// ================= EXTRAER COORDENADAS =================
function extraerCoordenadas(url) {
    try {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);

        if (match) {
            return {
                latitud: match[1],
                longitud: match[2]
            };
        }

        const regex2 = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match2 = url.match(regex2);

        if (match2) {
            return {
                latitud: match2[1],
                longitud: match2[2]
            };
        }

        return null;

    } catch (error) {
        return null;
    }
}

// ================= SUBIR A CLOUDINARY =================
async function subirImagen(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error("Error al subir imagen");
    }

    return data.secure_url;
}

// ================= GUARDAR UBICACIÓN =================
document.getElementById("btnGuardarFinal").addEventListener("click", async (e) => {
    e.preventDefault();

    const descripcion = document.getElementById("descripcion").value.trim();
    const file = document.getElementById("imagen-input").files[0];
    const urlMaps = document.getElementById("url").value.trim();

    if (!descripcion || !file || !urlMaps) {
        alert("Todos los campos son obligatorios");
        return;
    }

    // Validación final de imagen
    if (!file.type.startsWith("image/")) {
        alert("El archivo seleccionado no es una imagen válida");
        return;
    }

    try {
        // Subir imagen
        const imageUrl = await subirImagen(file);

        // Obtener coordenadas
        const coords = extraerCoordenadas(urlMaps);

        if (!coords) {
            alert("No se pudieron obtener coordenadas del link");
            return;
        }

        console.log("Coords:", coords);

        const res = await fetch(urlApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                descripcion,
                imagen_nombre: file.name,
                url: imageUrl,
                latitud: coords.latitud,
                longitud: coords.longitud
            })
        });

        const data = await res.json();

        console.log("RESPUESTA:", data);

        if (!res.ok) throw new Error("Error al guardar");

        alert("Ubicación guardada correctamente");

        document.querySelector("form").reset();
        document.getElementById("img-preview").src =
            "https://via.placeholder.com/150?text=Subir+Imagen";

    } catch (error) {
        console.error(error);
        alert("Error al guardar ubicación");
    }
});