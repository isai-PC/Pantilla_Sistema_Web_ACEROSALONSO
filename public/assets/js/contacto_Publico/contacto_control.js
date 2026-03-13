// contacto_Controller.js
// Controlador público para mostrar datos de contacto desde la API

const API_URL = "https://apis-propias-a-vercel-jtww.vercel.app/api/contacto";

// ================================================
// Función principal: cargar y mostrar datos de contacto
// ================================================
const cargarContacto = async () => {
    // Elementos del DOM donde vamos a inyectar la información
    const diasEl = document.querySelector("#dias");
    const horarioEl = document.querySelector("#horario");
    const telefonoEl = document.querySelector("#telefono");
    const whatsappEl = document.querySelector("#whatsapp");
    const correoEl = document.querySelector("#correo");
    const direccionEl = document.querySelector("#direccion");
    const facebookEl = document.querySelector("#facebook");
    const instagramEl = document.querySelector("#instagram");
    const xEl = document.querySelector("#x");

    // Mensaje de carga temporal (opcional)
    if (diasEl) diasEl.textContent = "Cargando...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            if (response.status === 404) {
                mostrarError("No hay información de contacto registrada aún.");
                return;
            }
            throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();

        // Inyectar datos en los elementos (usa IDs que agregaremos al HTML)
        if (diasEl) diasEl.textContent = data.dias || "No especificado";
        if (horarioEl) horarioEl.textContent = data.horario || "No especificado";
        if (telefonoEl) telefonoEl.textContent = data.telefono || "No disponible";
        if (whatsappEl) whatsappEl.textContent = data.whatsapp || "No disponible";
        if (correoEl) correoEl.textContent = data.correo || "No disponible";
        if (direccionEl) direccionEl.textContent = data.direccion || "No disponible";

        // Redes sociales (enlaces)
        if (facebookEl && data.red_social_1) {
            facebookEl.href = data.red_social_1;
            facebookEl.textContent = "Facebook";
        }
        if (instagramEl && data.red_social_2) {
            instagramEl.href = data.red_social_2;
            instagramEl.textContent = "Instagram";
        }
        if (xEl && data.red_social_3) {
            xEl.href = data.red_social_3;
            xEl.textContent = "X";
        }

    } catch (error) {
        console.error("Error al cargar contacto:", error);
        mostrarError("No pudimos cargar la información de contacto. Intenta más tarde.");
    }
};

// Función auxiliar para mostrar error en la sección
const mostrarError = (mensaje) => {
    const seccion = document.querySelector("fieldset");
    if (seccion) {
        seccion.innerHTML += `
            <p class="text-red-600 text-center mt-4 font-semibold">
                ${mensaje}
            </p>
        `;
    }
};

// ================================================
// Iniciar al cargar la página
// ================================================
document.addEventListener("DOMContentLoaded", () => {
    cargarContacto();
});