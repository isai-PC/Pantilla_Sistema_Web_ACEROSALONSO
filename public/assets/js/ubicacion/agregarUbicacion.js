const urlApi = "https://repositorio-para-vercel-tawny.vercel.app/api/ubicaciones";
const token = localStorage.getItem("token");
const nombre = localStorage.getItem("nombre");


window.onload = function () {

    // del usuario nombre
    if (nombre) {
        const elementoNombre = document.querySelector("header a[href='paginaPrincipal.html']");
        if (elementoNombre) {
            elementoNombre.textContent = "Usuario: " + nombre;
        }
    }
};

// crear
document.getElementById("btnGuardarFinal").addEventListener("click", async () => {

    const descripcion = document.getElementById("descripcion").value.trim();
    const url = document.getElementById("url").value.trim();
    const latitud = document.getElementById("latitud").value.trim();
    const longitud = document.getElementById("longitud").value.trim();

    // vali
    if (!descripcion || !url || !latitud || !longitud) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Todos los campos son obligatorios"
        });
        return;
    }

    if (isNaN(latitud) || isNaN(longitud)) {
        Swal.fire({
            icon: "warning",
            title: "Coordenadas inválidas",
            text: "Latitud y longitud deben ser números"
        });
        return;
    }

    try {
        const res = await fetch(urlApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                descripcion: descripcion,
                url: url,
                latitud: latitud,    
                longitud: longitud
            })
        });

        const respuesta = await res.text();

        console.log("STATUS:", res.status);
        console.log("RESPUESTA:", respuesta);

        if (!res.ok) throw new Error("Error al crear");

        Swal.fire({
            icon: "success",
            title: "Ubicación creada correctamente",
            timer: 2000,
            showConfirmButton: false
        });

        // limpia formulario
        document.getElementById("descripcion").value = "";
        document.getElementById("url").value = "";
        document.getElementById("latitud").value = "";
        document.getElementById("longitud").value = "";

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la ubicación"
        });
    }
});