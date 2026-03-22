const urlApi = "https://repo-vercel-m3tb-cuvwdar7m-20241048-svgs-projects.vercel.app/api/contacto";
const token = localStorage.getItem("token");

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
        const contacto = data.contacto;

        if (!contacto) return;

        document.getElementById("dias").value = contacto.dias || "";
        document.getElementById("horario").value = contacto.horario || "";
        document.getElementById("telefono").value = contacto.telefono || "";
        document.getElementById("whatsapp").value = contacto.whatsapp || "";
        document.getElementById("correo").value = contacto.correo || "";
        document.getElementById("direccion").value = contacto.direccion || "";
        document.getElementById("red1").value = contacto.red1 || "";
        document.getElementById("red2").value = contacto.red2 || "";
        document.getElementById("red3").value = contacto.red3 || "";

    } catch (error) {
        console.error("Error al cargar:", error);

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
        red1: document.getElementById("red1").value,
        red2: document.getElementById("red2").value,
        red3: document.getElementById("red3").value
    };

    try {
        btn.textContent = "Actualizando...";
        btn.disabled = true;

        const response = await fetch(urlApi, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // ⚠️ SOLO si usas auth real
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: "Contacto actualizado correctamente",
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "No se pudo actualizar",
                showConfirmButton: false,
                timer: 3000
            });
        }

    } catch (error) {
        console.error("Error:", error);

        Swal.fire({
            toast: true,
            position: "bottom-end",
            icon: "error",
            title: "Fallo de conexión",
            showConfirmButton: false,
            timer: 3000
        });

    } finally {
        btn.disabled = false;
        btn.textContent = "Guardar Cambios";
    }
}