const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/mvp";
const token = localStorage.getItem("token");
const nombre = localStorage.getItem("nombre");

// lo de clu
const cloudName = "dr16zjtpb";
const uploadPreset = "present5C";

// para ver que pagina es 
let campoTexto = "";
let campoImagen = "";
let textarea = null;

if (document.getElementById("vision")) {
    campoTexto = "vision";
    campoImagen = "img_vision";
    textarea = document.getElementById("vision");
}
else if (document.getElementById("mision")) {
    campoTexto = "mision";
    campoImagen = "img_mision";
    textarea = document.getElementById("mision");
}
else if (document.getElementById("info")) {
    campoTexto = "info";
    campoImagen = "iminfo";
    textarea = document.getElementById("info");
}

// para el inicio
window.onload = async function () {

    // Mostrar usuario
    if (nombre) {
        const elementoNombre = document.querySelector("header a[href='paginaPrincipal.html']");
        if (elementoNombre) {
            elementoNombre.textContent = "Usuario: " + nombre;
        }
    }

    const inputFile = document.getElementById("imagen-input");
    if (inputFile) {
        inputFile.addEventListener("change", previewImagen);
    }

    await cargarDatos();
};

// para ver la imagen
function previewImagen() {
    const file = this.files[0];
    const preview = document.getElementById("previewImg");

    if (file) {
        preview.src = URL.createObjectURL(file);
    }
}

// para subir la imagen
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

// cuando se carga
async function cargarDatos() {

    const inputUrl = document.getElementById("url");
    const preview = document.getElementById("previewImg");

    try {
        const res = await fetch(urlApi, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("ERROR BACKEND:", errorText);
            throw new Error("Error al cargar datos");
        }

        const json = await res.json();
        const data = json.data || json; 

        console.log("DATA:", data);

        textarea.value = data[campoTexto] || "";
        if (inputUrl) inputUrl.value = data[campoImagen] || "";
        if (preview) preview.src = data[campoImagen] || "https://via.placeholder.com/150";

        textarea.dataset.id = data.id;

    } catch (error) {
        console.error(error);
        textarea.value = "Error al cargar";
    }
}


const inputUrlGlobal = document.getElementById("url");
if (inputUrlGlobal) {
    inputUrlGlobal.addEventListener("input", function () {
        const preview = document.getElementById("previewImg");
        preview.src = this.value || "https://via.placeholder.com/150";
    });
}

// para guardar los cambios
document.getElementById("btnGuardar").addEventListener("click", async () => {

    const inputUrl = document.getElementById("url");
    const texto = textarea.value.trim();
    const url = inputUrl ? inputUrl.value.trim() : "";
    const id = textarea.dataset.id;

    const file = document.getElementById("imagen-input")?.files[0];

    try {
        let imageUrl = url;

        if (file) {
            imageUrl = await subirImagen(file);
        }

        // obtener datos actuales
        const resGet = await fetch(urlApi);
        const jsonActual = await resGet.json();
        const dataActual = jsonActual.data || jsonActual;

        // actualizar solo lo necesario por que si no luego lo borra
        dataActual[campoTexto] = texto;
        dataActual[campoImagen] = imageUrl;

        // enviar
        const res = await fetch(urlApi, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dataActual)
        });

        if (!res.ok) throw new Error("Error al actualizar");

        Swal.fire({
            icon: "success",
            title: "Actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Error al actualizar"
        });
    }
});