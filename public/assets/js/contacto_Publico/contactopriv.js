
if (!localStorage.getItem("token")) {
    window.location.href = "../../../index.html"; 
}

const nombre = localStorage.getItem("nombre");
const token = localStorage.getItem("token");

if (nombre) {
    const elementoNombre = document.getElementById("nombre"); 
    if (elementoNombre) {
        elementoNombre.textContent = "Usuario: " + nombre;
    }
}

const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/contacto";


window.onload = function () {
    cargarContacto();

    const form = document.getElementById("form-contacto");
    if (form) {
        form.onsubmit = actualizarContacto;
    }
};

// ================= OBTENER DATOS =================
async function cargarContacto() {
    try {
        const respuesta = await fetch(urlApi);
        if (!respuesta.ok) throw new Error("No se pudo obtener el contacto");

        const data = await respuesta.json();
        
        // REVISIÓN DE ESTRUCTURA: Intentamos obtener el objeto de contacto
        const contacto = data.contacto || (Array.isArray(data) ? data[0] : data);

        if (!contacto) {
            console.warn("No se encontró información de contacto en la respuesta");
            return;
        }

        // Asignación segura con encadenamiento opcional o strings vacíos
        document.getElementById("dias").value = contacto.dias || "";
        document.getElementById("horario").value = contacto.horario || "";
        document.getElementById("telefono").value = contacto.telefono || "";
        document.getElementById("whatsapp").value = contacto.whatsapp || "";
        document.getElementById("correo").value = contacto.correo || "";
        document.getElementById("direccion").value = contacto.direccion || "";
        document.getElementById("red1").value = contacto.red_social_1 || "";
        document.getElementById("red2").value = contacto.red_social_2 || "";
        document.getElementById("red3").value = contacto.red_social_3 || "";

        console.log("Datos cargados correctamente:", contacto);

    } catch (error) {
        console.error("Error al cargar:", error);
        // Solo funcionará si añades el script de SweetAlert en el HTML
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Error al cargar datos",
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
}
// ================= ACTUALIZAR =================
async function actualizarContacto(e) {
    e.preventDefault();
    const btn = document.getElementById("btnGuardar");

    const payload = {
        dias: document.getElementById("dias").value,
        horario: document.getElementById("horario").value,
        telefono: document.getElementById("telefono").value,
        whatsapp: document.getElementById("whatsapp").value,
        correo: document.getElementById("correo").value,
        direccion: document.getElementById("direccion").value,
        // CAMBIA ESTAS 3 LÍNEAS (Quita el _social_):
        red1: document.getElementById("red1").value, 
        red2: document.getElementById("red2").value,
        red3: document.getElementById("red3").value
    };

    try {
        btn.textContent = "Actualizando...";
        btn.disabled = true;

        // IMPORTANTE: Asegúrate de que la URL termine en /1 
        // porque tu route.js dice router.put('/:_id')
        const response = await fetch(`${urlApi}/1`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "¡Guardado!",
                text: "Los datos de Aceros Alonso se actualizaron correctamente.",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            Swal.fire({ icon: "error", title: "Error", text: errorData.message });
        }
    } catch (error) {
        console.error("Error de red:", error);
    } finally {
        btn.disabled = false;
        btn.textContent = "Guardar cambios";
    }
}