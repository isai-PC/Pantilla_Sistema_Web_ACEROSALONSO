// ===============================
// SLIDER MODERNO AUTO + LOOP
// ===============================

let currentIndex = 0;
let autoSlideInterval = null;
let isHovered = false;

function getSliderData() {
    const slider = document.getElementById("slider");
    if (!slider) return null;

    const items = slider.children;
    if (items.length <= 1) return null;

    const itemWidth = items[1].offsetLeft - items[0].offsetLeft;
    const visibleWidth = slider.parentElement.offsetWidth;
    const visibleItems = Math.round(visibleWidth / itemWidth);
    const maxIndex = items.length - visibleItems;

    return { slider, items, itemWidth, maxIndex };
}

function moveSlide(direction = 1) {
    const data = getSliderData();
    if (!data) return;

    const { slider, itemWidth, maxIndex } = data;

    currentIndex += direction;

    // LOOP INFINITO
    if (currentIndex > maxIndex) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = maxIndex;
    }

    slider.style.transition = "transform 0.6s cubic-bezier(.4,0,.2,1)";
    slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        if (!isHovered) {
            moveSlide(1);
        }
    }, 4000); // cada 4 segundos
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// Reset elegante en resize
window.addEventListener("resize", () => {
    currentIndex = 0;
    const slider = document.getElementById("slider");
    if (slider) {
        slider.style.transition = "none";
        slider.style.transform = `translateX(0px)`;
    }
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("slider");

    if (slider) {
        startAutoSlide();

        // Pausar al pasar mouse
        slider.addEventListener("mouseenter", () => {
            isHovered = true;
        });

        slider.addEventListener("mouseleave", () => {
            isHovered = false;
        });
    }
});