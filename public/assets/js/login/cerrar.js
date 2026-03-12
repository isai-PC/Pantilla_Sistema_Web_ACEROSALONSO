

const cerrarSesionIS = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("rol");
    window.location.replace("index.html");
    
};

const cerrarSesion = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("rol");
    window.location.replace("../../../index.html");
};