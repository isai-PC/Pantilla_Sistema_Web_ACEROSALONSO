const cloudname = "dq63gma00";
const present = "AcerosAlonso";
const inpuntform = document.getElementById("inputfile");
const image = document.getElementById("imagen");

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
}
const resetFormulario = () => {
    image.src = "https://via.placeholder.com/150";
}

document.getElementById('formCrearProducto').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btnGuardarFinal = document.getElementById('btnGuardarFinal');
    btnGuardarFinal.disabled = true;

    let urlImagenFinal = "https://via.placeholder.com/150"; /* Imagen por defecto */
    const foto = inpuntform.files[0];

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
            Swal.fire('Error', 'No se pudo subir la imagen a la nube. Intenta de nuevo.', 'error');
            btnGuardarFinal.disabled = false;
            btnGuardarFinal.textContent = 'Guardar';
            return;
        }
    }
    btnGuardarFinal.textContent = 'Guardando datos... ';
    const payload = {
        id_categoria: parseInt(document.getElementById('id_categoria').value) || 0,
        nombre_producto: document.getElementById('nombre_producto').value,
        ImagenesProducto: urlImagenFinal,
        /* nombre_categoria: document.getElementById('id_categoria').value, */
        precio: parseFloat(document.getElementById('precio').value) || 0,
        unidad_medida: document.getElementById('unidad_medida').value,
        calibre: document.getElementById('calibre').value,
        metros: parseFloat(document.getElementById('metros').value) || 0,
        kg: parseFloat(document.getElementById('kg').value) || 0,
        color: document.getElementById('color').value,
        ced: document.getElementById('ced').value,
        ton:document.getElementById('ton').value,
        cm: parseFloat(document.getElementById('cm').value) || 0
    };

    try {
        const response = await fetch("https://repositorio-para-vercel-tawny.vercel.app/api/productos", { /* Datos env */
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const responseData = await response.json().catch(() => ({})); // Intenta parsear JSON, si falla devuelve {}
        
        if (response.ok) {
            Swal.fire('¡Éxito!', 'Producto creado correctamente', 'success');
            document.getElementById('formCrearProducto').reset();
            resetFormulario();
        } else {
            // MOSTRAR ERROR DE API - Mostrar detalles reales
            const errorMessage = responseData.message || responseData.error || 'Error desconocido del servidor';
            const errorDetails = responseData.details || '';
            
            console.error(`[API ERROR ${response.status}]:`, {
                status: response.status,
                statusText: response.statusText,
                message: errorMessage,
                details: errorDetails,
                fullResponse: responseData
            });
            
            let mensajeUsuario = errorMessage;
            if (response.status === 400) {
                mensajeUsuario = `Datos inválidos: ${errorMessage}`;
            } else if (response.status === 401) {
                mensajeUsuario = 'No autorizado para crear productos';
            } else if (response.status === 409) {
                mensajeUsuario = 'El producto ya existe';
            } else if (response.status >= 500) {
                mensajeUsuario = 'Error en el servidor. Intenta más tarde.';
            }
            
            Swal.fire('Error API', mensajeUsuario, 'error');
        }
    } catch (error) {
        console.error('Error de red/conexión:', error);
        Swal.fire('Error', 'Fallo de conexión con la API. Verifica tu internet.', 'error');
    } finally {
        btnGuardarFinal.disabled = false;
        btnGuardarFinal.textContent = 'Guardar';
    }
});