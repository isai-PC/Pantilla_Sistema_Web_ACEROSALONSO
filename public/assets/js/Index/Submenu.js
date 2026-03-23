// ================================================
// CONFIGURACIÓN
// ================================================
const API_URL_PRODUCTOS = "https://repositorio-para-vercel-tawny.vercel.app/api/productos";
const API_URL_CATEGORIAS = "https://apis-propias-a-vercel-jtww.vercel.app/api/categorias";

// ================================================
// FUNCIONES PARA PRODUCTOS
// ================================================
const mostrarCargandoProductos = () => {
    const ul = document.querySelector("#SumenuProductos ul#listaP");
    if (ul) ul.innerHTML = '<li class="px-5 py-3 text-gray-400 italic">Cargando productos...</li>';
};

const mostrarErrorProductos = (msg = "Error al cargar productos") => {
    const ul = document.querySelector("#SumenuProductos ul#listaP");
    if (ul) ul.innerHTML = `<li class="px-5 py-3 text-red-400">${msg}</li>`;
};

const renderListaProductos = (productos) => {
    const ul = document.querySelector("#SumenuProductos ul#listaP");
    if (!ul) return;

    if (!productos || productos.length === 0) {
        ul.innerHTML = '<li class="px-5 py-3 text-gray-400">No hay productos disponibles</li>';
        return;
    }

    ul.innerHTML = '';
    const fragment = document.createDocumentFragment();

    productos.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'w-full block';

        const a = document.createElement('a');
        const pagina = window.location.pathname;

        if (pagina.endsWith("index.html")) {
            a.href = `pages/VistaPublica/VistaDetalleProducto/VistaVieew.html?id=${producto.id_producto}`;
        } else {
            a.href = `../VistaDetalleProducto/VistaVieew.html?id=${producto.id_producto}`;
        }

        a.className = 'block px-5 py-3 border-b border-white/10 text-white hover:bg-orange-400 hover:pl-6 transition-all duration-200';
        a.textContent = producto.nombre_producto || '(Sin nombre)';

        li.appendChild(a);
        fragment.appendChild(li);
    });

    ul.appendChild(fragment);
};

const cargarProductosEnMenu = async () => {
    mostrarCargandoProductos();

    try {
        const res = await fetch(API_URL_PRODUCTOS);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        const productos = result.data || result;   // por si tu API devuelve directo o en .data

        renderListaProductos(productos);

    } catch (err) {
        console.error("Error productos:", err);
        mostrarErrorProductos();
    }
};

// ================================================
// FUNCIONES PARA CATEGORÍAS
// ================================================
const mostrarCargandoCategorias = () => {
    const ul = document.getElementById("listarC");
    if (ul) ul.innerHTML = '<li class="px-5 py-3 text-gray-400 italic">Cargando categorías...</li>';
};

const mostrarErrorCategorias = (msg = "Error al cargar categorías") => {
    const ul = document.getElementById("listarC");
    if (ul) ul.innerHTML = `<li class="px-5 py-3 text-red-400">${msg}</li>`;
};

const renderListaCategorias = (categorias) => {
    const ul = document.getElementById("listarC");
    if (!ul) return;

    if (!categorias || categorias.length === 0) {
        ul.innerHTML = '<li class="px-5 py-3 text-gray-400">No hay categorías disponibles</li>';
        return;
    }

    ul.innerHTML = '';
    const fragment = document.createDocumentFragment();

    categorias.forEach(cat => {
        const li = document.createElement('li');
        li.className = 'w-full block';

        const a = document.createElement('a');
        const pagina = window.location.pathname;

        if (pagina.endsWith("index.html")) {
            a.href = `pages/VistaPublica/CatalogoProductosWiew/catalogoProductosxCategoria.html?id=${cat.id_categoria}`;
        } else {
            a.href = `../CatalogoProductosWiew/catalogoProductosxCategoria.html?id=${cat.id_categoria}`;
        }

        a.className = 'block px-5 py-3 border-b border-white/10 font-normal text-sm hover:bg-orange-400 hover:pl-6 transition-all text-white no-underline';
        a.textContent = cat.nombre_categoria || '(Sin nombre)';

        li.appendChild(a);
        fragment.appendChild(li);
    });

    ul.appendChild(fragment);
};

const cargarCategoriasEnMenu = async () => {
    mostrarCargandoCategorias();

    try {
        const res = await fetch(API_URL_CATEGORIAS);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        const categorias = result.data || result;   // por si viene envuelto

        renderListaCategorias(categorias);

    } catch (err) {
        console.error("Error categorías:", err);
        mostrarErrorCategorias();
    }
};

// ================================================
// EJECUCIÓN DIRECTA
// ================================================
cargarProductosEnMenu();
cargarCategoriasEnMenu();