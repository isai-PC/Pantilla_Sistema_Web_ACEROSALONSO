const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/ubicaciones";
const token = localStorage.getItem("token");

const cloudName = "dr16zjtpb";
const uploadPreset = "present5C"; 

// ================= PREVIEW IMAGEN =================
document.getElementById("imagen-input").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("img-preview");

    if (file) {
        preview.src = URL.createObjectURL(file);
    }
});

// ================= EXTRAER COORDENADAS =================
function extraerCoordenadas(url) {
    try {
        // Ejemplo:
        // https://www.google.com/maps?q=21.142177,-98.413451

        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);

        if (match) {
            return {
                latitud: match[1],
                longitud: match[2]
            };
        }

        // Otro formato:
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

    return data.secure_url; // 🔥 URL final
}

// ================= GUARDAR UBICACIÓN =================
document.getElementById("btnGuardarFinal").addEventListener("click", async (e) => {
    e.preventDefault(); // 🔥 evita submit

    const descripcion = document.getElementById("descripcion").value.trim();
    const file = document.getElementById("imagen-input").files[0];
    const urlMaps = document.getElementById("url").value.trim();

    if (!descripcion || !file || !urlMaps) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        // 1️⃣ Subir imagen
        const imageUrl = await subirImagen(file);

        // 2️⃣ Obtener coordenadas
        const coords = extraerCoordenadas(urlMaps);

        if (!coords) {
            alert("No se pudieron obtener coordenadas del link");
            return;
        }

        console.log("Coords:", coords);

        // 3️⃣ Enviar al backend
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

        // Reset
        document.querySelector("form").reset();
        document.getElementById("img-preview").src = "https://via.placeholder.com/150?text=Subir+Imagen";

    } catch (error) {
        console.error(error);
        alert("Error al guardar ubicación");
    }
});