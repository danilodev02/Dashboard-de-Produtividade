const saved = localStorage.getItem("theme");
if (saved) {
    document.documentElement.dataset.theme = saved;
}

const html = document.documentElement;
const btn = document.getElementById("theme-toggle");

btn.addEventListener("click", () => {
    const current = html.dataset.theme || "light";
    const next = current === "dark" ? "light" : "dark";

    html.dataset.theme = next;
    localStorage.setItem("theme", next);

    btn.textContent = html.dataset.theme === "dark" ? "Modo Claro" : "Modo Escuro";
});

