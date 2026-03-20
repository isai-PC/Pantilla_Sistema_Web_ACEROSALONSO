const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/terminos";

document.addEventListener('DOMContentLoaded', cargarTerminos);

function cargarTerminos() {
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const container = document.getElementById('terminos-contenido');

    if (loading) loading.style.display = 'block';

    fetch(urlApi)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
            }
            return respuesta.json();
        })
        .then(data => {
            if (loading) loading.style.display = 'none';

            const terminos = data;

            console.log("Términos recibidos:", terminos);

            if (!terminos || !terminos.titulo || !terminos.contenido) {
                mostrarError("No se encontraron términos y condiciones disponibles.");
                return;
            }

            mostrar(terminos);
        })
        .catch(error => {
            console.error("Error al cargar términos:", error);
            if (loading) loading.style.display = 'none';
            mostrarError("No pudimos cargar los términos y condiciones. Intenta más tarde.");
        });
}

function mostrar(terminos) {
    const container = document.getElementById('terminos-contenido');

    let contenidoFormateado = terminos.contenido
        .replace(/\r\n\r\n|\n\n/g, '</p><p class="mb-6">')   // párrafos con margen abajo
        .replace(/\r\n|\n/g, '<br>');                        // saltos simples

    // Si no hay párrafos, envolvemos todo en <p>
    if (!contenidoFormateado.includes('<p')) {
        contenidoFormateado = `<p class="mb-6">${contenidoFormateado}</p>`;
    } else {
        contenidoFormateado = `<p class="mb-6">${contenidoFormateado}</p>`;
    }

    const html = `
        <article class="space-y-8 max-w-4xl mx-auto">
            <h2 class="text-2xl md:text-3xl font-bold text-black border-b-2 border-orange-400 pb-3 inline-block">
                ${terminos.titulo}
            </h2>
            
            <div class="text-slate-800 leading-relaxed text-lg prose prose-slate prose-headings:text-black prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2 max-w-none">
                ${contenidoFormateado}
            </div>

            ${
                terminos.fecha 
                ? `<p class="text-sm text-slate-500 italic mt-8 border-t border-slate-200 pt-4">
                    Última actualización: ${new Date(terminos.fecha).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>`
                : ''
            }
        </article>
    `;

    container.innerHTML = html;
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.classList.remove('hidden');
    }
}