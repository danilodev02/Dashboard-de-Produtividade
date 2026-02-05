const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("usuario_logado");
        window.location.href = "../index.html";
    });
}
