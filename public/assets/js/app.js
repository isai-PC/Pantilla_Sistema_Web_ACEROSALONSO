// Carrusel de Categorías Mejorado (con botones fuera + pausa hover + loop infinito)

const API_CATEGORIAS = "https://apis-propias-a-vercel-jtww.vercel.app/api/categorias";

let currentIndexCat = 0;
let autoSlideCat = null;
let isHoveredCat = false;

const moveSlideCategorias = (direction) => {
    const slider = document.getElementById("slider-categorias");
    if (!slider) return;

    const items = slider.children;
    if (items.length <= 1) return;

    const itemWidth = items[0].offsetWidth + 20; // gap-5 = 20px
    const containerWidth = slider.parentElement.offsetWidth;
    const visibleCount = Math.floor(containerWidth / itemWidth);
    const maxIndex = Math.max(0, items.length - visibleCount);

    currentIndexCat += direction;

    // Loop infinito
    if (currentIndexCat > maxIndex) currentIndexCat = 0;
    if (currentIndexCat < 0) currentIndexCat = maxIndex;

    slider.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    slider.style.transform = `translateX(-${currentIndexCat * itemWidth}px)`;
};

const startAutoSlideCat = () => {
    stopAutoSlideCat();
    autoSlideCat = setInterval(() => {
        if (!isHoveredCat) moveSlideCategorias(1);
    }, 4500); // 4.5 segundos
};

const stopAutoSlideCat = () => {
    if (autoSlideCat) clearInterval(autoSlideCat);
};

const cargarCategoriasCarrusel = async () => {
    const slider = document.getElementById("slider-categorias");
    if (!slider) return;

    slider.innerHTML = '<div class="w-full text-center py-10 text-slate-500">Cargando categorías...</div>';

    try {
        const res = await fetch(API_CATEGORIAS);
        if (!res.ok) throw new Error("Error al cargar categorías");

        const categorias = await res.json();

        slider.innerHTML = "";

        categorias.forEach(cat => {
            const article = document.createElement("article");
            article.className = "min-w-full md:min-w-[calc(50%-20px)] lg:min-w-[calc(33.333%-20px)] mx-2 md:mx-[10px] h-auto md:h-[250px] relative bg-white rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:z-10 md:hover:h-[400px] text-center box-border group/card overflow-hidden md:hover:overflow-visible";

            article.innerHTML = `
                <a href="pages/VistaPublica/CatalogoProductosWiew/CatalogoProductosxCategoria.html?id=${cat.id_categoria}"
                   class="block no-underline text-inherit h-full relative z-10">
                    <img src="${cat.imagen_categoria || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}" 
                         alt="${cat.nombre_categoria}"
                         class="w-full h-[140px] md:h-[150px] object-cover transition-transform group-hover:scale-105">
                    <div class="text-slate-800 p-3 md:p-4">
                        <h3 class="font-bold text-lg md:text-xl mb-2 line-clamp-1">${cat.nombre_categoria}</h3>
                        <p class="text-sm text-slate-600 line-clamp-2">${cat.texto_secundario || 'Explora nuestra selección'}</p>
                    </div>
                </a>
            `;

            slider.appendChild(article);
        });

        // Iniciar auto-slide
        startAutoSlideCat();

        // Pausar al hover
        const container = slider.parentElement.parentElement;
        container.addEventListener("mouseenter", () => { isHoveredCat = true; });
        container.addEventListener("mouseleave", () => { isHoveredCat = false; });

    } catch (error) {
        console.error("Error en carrusel categorías:", error);
        slider.innerHTML = '<div class="w-full text-center py-10 text-red-600">No pudimos cargar las categorías</div>';
    }
};

// Iniciar
document.addEventListener("DOMContentLoaded", cargarCategoriasCarrusel);