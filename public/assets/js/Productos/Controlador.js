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
VARIABLES GLOBALES
====================================================== */
let modoEditar = false;
let idProducto = null;

/* ======================================================
FUNCIÓN QUE SE EJECUTA AL CARGAR LA PÁGINA 
====================================================== */
function inicializarFormulario() {
    // Obtener elementos
    const titulo = document.getElementById("tituloFormulario");
    const descripcion = document.getElementById("descripcionFormulario");
    const form = document.getElementById("formCrearProducto");
    const btnGuardarFinal = document.getElementById("btnGuardarFinal");
    const inpuntform = document.getElementById("inputfile");
    const image = document.getElementById("imagen");

    // Verificar que existan
    if (!form || !btnGuardarFinal || !inpuntform || !image) {
        alert("Error: No se encontraron elementos del formulario");
        return;
    }

    // Detectar si es editar o crear
    const params = new URLSearchParams(window.location.search);
    idProducto = params.get("id");
    modoEditar = idProducto !== null;

    if (modoEditar) {
        titulo.textContent = "Actualizar Producto";
        descripcion.textContent = "Modifica los datos del producto";
        cargarProducto();  // Cargar datos del producto a editar
    } else {
        titulo.textContent = "Crear Nuevo Producto";
        descripcion.textContent = "Completa los campos para registrar un nuevo producto";
        resetFormulario(); // Reset inicial
    }
}

/* ======================================================
PREVISUALIZAR IMAGEN 
====================================================== */
function previsualizar() {
    const inpuntform = document.getElementById("inputfile");
    const image = document.getElementById("imagen");

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
RESET FORMULARIO 
====================================================== */
function resetFormulario() {
    const form = document.getElementById("formCrearProducto");
    const image = document.getElementById("imagen");
    const inpuntform = document.getElementById("inputfile");

    if (form) form.reset();
    if (inpuntform) inpuntform.value = "";
    if (image) image.src = "https://via.placeholder.com/150";
}

/* ======================================================
ENVIAR FORMULARIO
====================================================== */
function enviarFormulario(event) {
    event.preventDefault();

    const btnGuardarFinal = document.getElementById("btnGuardarFinal");
    if (!btnGuardarFinal) return;

    btnGuardarFinal.disabled = true;
    btnGuardarFinal.textContent = "Guardando...";

    // Validación básica
    const nombreProducto = document.getElementById("nombre_producto")?.value.trim();
    const idCategoria = document.getElementById("id_categoria")?.value.trim();
    const precio = document.getElementById("precio")?.value.trim();
    const unidadMedida = document.getElementById("unidad_medida")?.value.trim();

    if (!nombreProducto || !idCategoria || !precio || !unidadMedida) {
        Swal.fire({
            icon: "warning",
            title: "Campos requeridos",
            text: "Completa: Nombre, Categoría, Precio y Unidad de medida"
        });
        btnGuardarFinal.disabled = false;
        btnGuardarFinal.textContent = "Guardar";
        return false;
    }

    let urlImagenFinal = "https://via.placeholder.com/150";
    const inpuntform = document.getElementById("inputfile");
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
            if (!res.ok) throw new Error("Error en Cloudinary");
            return res.json();
        })
        .then(cloudData => {
            urlImagenFinal = cloudData.secure_url;
            guardarProducto(urlImagenFinal);
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo subir la imagen"
            });
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = "Guardar";
        });
    } else {
        guardarProducto(urlImagenFinal);
    }

    return false;  // Evita envío por defecto
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
            document.getElementById("formCrearProducto").reset();
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