// ================= VERIFICAR SESIÓN =================
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../../index.html";
}

// ================= URL API CORRECTA =================
const urlApi = "https://repo-vercel-m3tb-cuvwdar7m-20241048-svgs-projects.vercel.app/api/contacto";


// ================= FUNCIÓN SEGURA =================
const setValue = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.value = valor || "";
};


// ================= CARGAR CONTACTO =================
const cargarContacto = async () => {
    try {

        const res = await fetch(urlApi, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (!res.ok) {
            throw new Error("Error en la API");
        }

        const data = await res.json();
        console.log("Datos:", data);

        const contacto = data.contacto;

        if (!contacto) return;

        setValue("dias", contacto.dias);
        setValue("horario", contacto.horario);
        setValue("telefono", contacto.telefono);
        setValue("whatsapp", contacto.whatsapp);
        setValue("correo", contacto.correo);
        setValue("direccion", contacto.direccion);
        setValue("red1", contacto.red1);
        setValue("red2", contacto.red2);
        setValue("red3", contacto.red3);

    } catch (error) {
        console.error("Error cargando contacto:", error);
        alert("Error al cargar datos");
    }
};


// ================= GUARDAR CONTACTO =================
const guardarContacto = async (e) => {
    e.preventDefault();

    try {

        const datos = {
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

        const res = await fetch(urlApi, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Error al guardar");
        }

        alert("Datos actualizados correctamente");

    } catch (error) {
        console.error("Error guardando:", error);
        alert("Error al guardar cambios");
    }
};


// ================= EVENTO =================
document.addEventListener("DOMContentLoaded", cargarContacto);