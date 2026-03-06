/* API */
const API_URL = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";

/* OBTENER PARAMETROS DE URL */
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

/* DETECTAR SI ES MODO EDITAR */
const modoEditar = idProducto !== null;

/* CAMBIAR TITULO */
const titulo = document.getElementById("tituloFormulario");
const descripcion = document.getElementById("descripcionFormulario");
if (modoEditar) {
    titulo.textContent = "Actualizar Producto";
    descripcion.textContent = "Modifica los datos del producto";
} else {
    titulo.textContent = "Crear Nuevo Producto";
    descripcion.textContent = "Completa los campos para registrar un nuevo producto";
}
/* DEFINIR METODO Y URL */
const metodo = modoEditar ? "PUT" : "POST";
const url = modoEditar ? `${API_URL}/${idProducto}` : API_URL;
/* FUNCION PARA CARGAR PRODUCTO */
const cargarProducto = async () => {
    try {
        const response = await fetch(`${API_URL}/${idProducto}`);
        const data = await response.json();
        document.getElementById('nombre_producto').value = data.nombre_producto || "";
        document.getElementById('id_categoria').value = data.id_categoria || "";
        document.getElementById('precio').value = data.precio || "";
        document.getElementById('unidad_medida').value = data.unidad_medida || "";
        document.getElementById('calibre').value = data.calibre || "";
        document.getElementById('metros').value = data.metros || "";
        document.getElementById('kg').value = data.kg || "";
        document.getElementById('cm').value = data.cm || "";
        document.getElementById('ton').value = data.ton || "";
        document.getElementById('ced').value = data.ced || "";
        document.getElementById('color').value = data.color || "";
        if (data.ImagenesProducto) {
            image.src = data.ImagenesProducto;
        }
    } catch (error) {
        console.error("Error cargando producto:", error);
    }
};
/* CARGAR DATOS SI ES EDICION */
if (modoEditar) {
    cargarProducto();
}
/* DATOS CLOUDINARY */
const cloudname = "dq63gma00";
const present = "AcerosAlonso";
const inpuntform = document.getElementById("inputfile");
const image = document.getElementById("imagen");
/* PREVISUALIZAR IMAGEN */
const previsualizar = () => {
    const foto = inpuntform.files[0];
    if (!foto) return;
    if (!foto.type.startsWith("image/")) {
        Swal.fire('Error', 'Seleccione un formato de imagen válido', 'error');
        inpuntform.value = "";
        return;
    }
    if (image.src !== "" && !image.src.includes("placeholder")) {
        URL.revokeObjectURL(image.src);
    }
    image.src = URL.createObjectURL(foto);
};
/* RESET FORM */
const resetFormulario = () => {
    image.src = "https://via.placeholder.com/150";
};
/* SUBMIT FORM */
document.getElementById('formCrearProducto').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btnGuardarFinal = document.getElementById('btnGuardarFinal');
    btnGuardarFinal.disabled = true;
    let urlImagenFinal = "https://via.placeholder.com/150";
    const foto = inpuntform.files[0];
    /* SUBIR IMAGEN A CLOUDINARY */
    if (foto) {
        btnGuardarFinal.textContent = 'Subiendo imagen...';
        const formData = new FormData();
        formData.append("file", foto);
        formData.append("upload_preset", present);
        try {
            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, {
                method: "POST",
                body: formData
            });
            if (!cloudRes.ok) throw new Error("Error en Cloudinary");
            const cloudData = await cloudRes.json();
            urlImagenFinal = cloudData.secure_url;
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'error',
                title: 'No se pudo subir la imagen a la nube.',
                showConfirmButton: false,
                timer: 4000
            });
            btnGuardarFinal.disabled = false;
            return;
        }
    }
    btnGuardarFinal.textContent = 'Guardando datos...';
    const payload = {
        id_categoria: parseInt(document.getElementById('id_categoria').value) || 0,
        nombre_producto: document.getElementById('nombre_producto').value,
        ImagenesProducto: urlImagenFinal,
        precio: parseFloat(document.getElementById('precio').value) || 0,
        unidad_medida: document.getElementById('unidad_medida').value,
        calibre: document.getElementById('calibre').value,
        metros: parseFloat(document.getElementById('metros').value) || 0,
        kg: parseFloat(document.getElementById('kg').value) || 0,
        color: document.getElementById('color').value,
        ced: document.getElementById('ced').value,
        ton: document.getElementById('ton').value,
        cm: parseFloat(document.getElementById('cm').value) || 0
    };
    try {
        const response = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const mensajeExito = modoEditar
            ? "Producto actualizado correctamente"
            : "Producto creado correctamente";
        if (response.ok) {
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: mensajeExito,
                showConfirmButton: false,
                timer: 3000
            });
            document.getElementById('formCrearProducto').reset();
            resetFormulario();
        } else {
            Swal.fire('Error API', 'No se pudo guardar el producto', 'error');
        }

    } catch (error) {

        console.error('Error de red/conexión:', error);

        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: 'Fallo de conexión con la API',
            showConfirmButton: false,
            timer: 4000
        });
    } finally {
        btnGuardarFinal.disabled = false;
        btnGuardarFinal.textContent = 'Guardar';
    }
});