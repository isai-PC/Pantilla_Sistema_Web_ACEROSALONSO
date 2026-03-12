
const token = localStorage.getItem("token");

    const liAdmin = document.getElementById("liAdmin");
    const liLogin = document.getElementById("liLogin");
    const liLogout = document.getElementById("liLogout");

    if (token) {
        // SI HAY TOKEN
        liLogin.style.display = "none";
    } else {
        // SI NO HAY TOKEN
        liAdmin.style.display = "none";
        liLogout.style.display = "none";
    }