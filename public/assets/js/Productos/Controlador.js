/* ======================================================
API BASE
====================================================== */
const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";

/* ======================================================
CLOUDINARY CONFIG
====================================================== */
const cloudname = "dq63gma00";
const present = "AcerosAlonso";

/* ======================================================
ELEMENTOS (se obtienen cuando el DOM ya cargó)
====================================================== */
let titulo, descripcion, form, btnGuardarFinal, inpuntform, image;

/* ======================================================
FUNCIÓN QUE SE EJECUTA CUANDO EL DOM CARGÓ (onload del body)
====================================================== */
function inicializarFormulario() {
    // Obtener elementos
    titulo = document.getElementById("tituloFormulario");
    descripcion = document.getElementById("descripcionFormulario");
    form = document.getElementById("formCrearProducto");
    btnGuardarFinal = document.getElementById("btnGuardarFinal");
    inpuntform = document.getElementById("inputfile");
    image = document.getElementById("imagen");

    // Verificar que existan
    if (!form || !btnGuardarFinal || !inpuntform || !image) {
        alert("Error: No se encontraron elementos del formulario. Revisa el HTML.");
        return;
    }

    // Inicializar textos
    if (modoEditar) {
        titulo.textContent = "Actualizar Producto";
        descripcion.textContent = "Modifica los datos del producto";
    } else {
        titulo.textContent = "Crear Nuevo Producto";
        descripcion.textContent = "Completa los campos para registrar un nuevo producto";
    }

    // Reset inicial
    resetFormulario();
}

/* ======================================================
PREVISUALIZAR IMAGEN (llamado desde onchange del input file)
====================================================== */
function previsualizar() {
    if (!inpuntform || !image) return;

    const foto = inpuntform.files[0];
    if (!foto) return;

    if (!foto.type.startsWith("image/")) {
        alert("Solo se permiten imágenes (jpg, png, webp)");
        inpuntform.value = "";
        return;
    }

    // Limpiar memoria anterior
    if (image.src && !image.src.includes("placeholder")) {
        URL.revokeObjectURL(image.src);
    }

    image.src = URL.createObjectURL(foto);
}

/* ======================================================
RESET FORMULARIO (llamado desde onclick del botón Cancelar)
====================================================== */
function resetFormulario() {
    if (image) image.src = "https://via.placeholder.com/150";
    if (inpuntform) inpuntform.value = "";
    if (form) form.reset();
}

/* ======================================================
ENVIAR FORMULARIO (llamado desde onsubmit del form)
====================================================== */
function enviarFormulario(event) {
    event.preventDefault();  // evita recargar la página

    if (!btnGuardarFinal) return;

    btnGuardarFinal.disabled = true;
    btnGuardarFinal.textContent = "Guardando...";

    // Validación básica
    const nombreProducto = document.getElementById("nombre_producto")?.value.trim();
    const idCategoria = document.getElementById("id_categoria")?.value.trim();
    const precio = document.getElementById("precio")?.value.trim();
    const unidadMedida = document.getElementById("unidad_medida")?.value.trim();

    if (!nombreProducto || !idCategoria || !precio || !unidadMedida) {
        alert("Completa los campos obligatorios: Nombre, Categoría, Precio y Unidad de medida");
        btnGuardarFinal.disabled = false;
        btnGuardarFinal.textContent = "Guardar";
        return;
    }

    let urlImagenFinal = "https://via.placeholder.com/150";
    const foto = inpuntform?.files[0];

    if (foto) {
        btnGuardarFinal.textContent = "Subiendo imagen...";

        const formData = new FormData();
        formData.append("file", foto);
        formData.append("upload_preset", present);

        fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error("Error Cloudinary");
            return res.json();
        })
        .then(cloudData => {
            urlImagenFinal = cloudData.secure_url;
            guardarProducto(urlImagenFinal);
        })
        .catch(error => {
            alert("No se pudo subir la imagen");
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = "Guardar";
        });
    } else {
        guardarProducto(urlImagenFinal);
    }

    return false;  // evita envío por defecto
}

/* ======================================================
GUARDAR PRODUCTO
====================================================== */
function guardarProducto(urlImagenFinal) {
    const payload = {
        id_categoria: parseInt(document.getElementById("id_categoria")?.value) || 0,
        nombre_producto: document.getElementById("nombre_producto")?.value || "",
        ImagenesProducto: urlImagenFinal,
        precio: parseFloat(document.getElementById("precio")?.value) || 0,
        unidad_medida: document.getElementById("unidad_medida")?.value || "",
        calibre: document.getElementById("calibre")?.value || "",
        metros: parseFloat(document.getElementById("metros")?.value) || 0,
        kg: parseFloat(document.getElementById("kg")?.value) || 0,
        cm: parseFloat(document.getElementById("cm")?.value) || 0,
        ton: document.getElementById("ton")?.value || "",
        ced: document.getElementById("ced")?.value || "",
        color: document.getElementById("color")?.value || ""
    };

    const method = modoEditar ? "PUT" : "POST";
    const url = modoEditar ? API_URL + "/" + idProducto : API_URL;

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: "success",
            title: modoEditar ? "Producto actualizado" : "Producto creado",
            text: modoEditar ? "El producto fue actualizado correctamente" : "El producto fue creado correctamente",
            timer: 3000,
            showConfirmButton: false
        });

        if (!modoEditar) {
            form.reset();
            resetFormulario();
        }
    })
    .catch(error => {
        console.error("Error al guardar:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "No se pudo guardar el producto"
        });
    })
    .finally(() => {
        if (btnGuardarFinal) {
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = "Guardar";
        }
    });
}