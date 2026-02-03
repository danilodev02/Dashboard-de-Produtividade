const saved = localStorage.getItem("theme");
if (saved) {
    document.documentElement.dataset.theme = saved;
}

const html = document.documentElement;
const btn = document.getElementById("theme-toggle");

if (btn) {
    const label = btn.querySelector(".theme-toggle__label");

    const updateLabel = (theme) => {
        const text = theme === "dark" ? "Modo Claro" : "Modo Escuro";
        if (label) label.textContent = text;
        btn.setAttribute("aria-label", text);
    };

    btn.addEventListener("click", () => {
        const current = html.dataset.theme || "light";
        const next = current === "dark" ? "light" : "dark";

        html.dataset.theme = next;
        localStorage.setItem("theme", next);

        updateLabel(next);
    });

    updateLabel(html.dataset.theme || "light");
}
