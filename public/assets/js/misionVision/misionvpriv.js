const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/mvp";
const token = localStorage.getItem("token");
const nombre = localStorage.getItem("nombre");

// Detectar qué página es
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

// ================= INICIO =================
window.onload = async function () {

    // Mostrar usuario
    if (nombre) {
        const elementoNombre = document.querySelector("header a[href='paginaPrincipal.html']");
        if (elementoNombre) {
            elementoNombre.textContent = "Usuario: " + nombre;
        }
    }

    await cargarDatos();
};

// ================= CARGAR =================
async function cargarDatos() {

    const inputUrl = document.getElementById("url");
    const preview = document.getElementById("previewImg");

    try {
        const res = await fetch(urlApi, {
            headers: {
                "Authorization": `Bearer ${token}` // ✔ por si tu backend lo pide
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("ERROR BACKEND:", errorText);
            throw new Error("Error al cargar datos");
        }

        const data = await res.json();

        console.log("DATA:", data);

        textarea.value = data[campoTexto] || "";
        inputUrl.value = data[campoImagen] || "";
        preview.src = data[campoImagen] || "https://via.placeholder.com/150";

        textarea.dataset.id = data.id;

    } catch (error) {
        console.error(error);
        textarea.value = "Error al cargar";
    }
}

// ================= PREVIEW =================
document.getElementById("url").addEventListener("input", function () {
    const preview = document.getElementById("previewImg");
    preview.src = this.value || "https://via.placeholder.com/150";
});

// ================= GUARDAR =================
document.getElementById("btnGuardar").addEventListener("click", async () => {

    const inputUrl = document.getElementById("url");

    const texto = textarea.value.trim();
    const url = inputUrl.value.trim();
    const id = textarea.dataset.id;

    console.log("ID:", id);
    console.log("Texto:", texto);
    console.log("URL:", url);

    if (!id) {
        alert("ERROR: No hay ID cargado");
        return;
    }

    try {
        const res = await fetch(urlApi, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                [campoTexto]: texto,
                [campoImagen]: url
            })
        });

        const respuesta = await res.text();

        console.log("STATUS:", res.status);
        console.log("RESPUESTA:", respuesta);

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