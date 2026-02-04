const usuarioLogado = sessionStorage.getItem("usuario_logado");
if (usuarioLogado) {
    window.location.href = "pages/task.html";
}

function logar(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.some(u => u.email === email && u.senha === senha);
}

function cadastrar (email, senha) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({email, senha})
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    return true
}

const form_conectar = document.getElementById("conectar");
const form_cadastro = document.getElementById("cadastro");
const container_index = document.querySelector(".container-index");

function showForm(target) {
    if (!form_conectar || !form_cadastro) return;

    if (target === "conectar") {
        form_conectar.classList.remove("hidden");
        form_cadastro.classList.add("hidden");
    } else {
        form_cadastro.classList.remove("hidden");
        form_conectar.classList.add("hidden");
    }
}

if (container_index) {
    container_index.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const hash = link.getAttribute("href");
        if (hash === "#conectar" || hash === "#cadastro") {
            e.preventDefault();
            const target = hash.replace("#", "");
            showForm(target);
            window.location.hash = hash;
        }
    });

    const initial = window.location.hash === "#conectar" ? "conectar" : "cadastro";
    showForm(initial);
}

if (form_conectar) {
    form_conectar.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email_conectar").value;
        const password = document.getElementById("password_conectar").value;

        const ok = logar(email, password);

        if (ok) {
            sessionStorage.setItem("usuario_logado", email);
            window.location.href = "pages/task.html"
        } else {
            alert("Email ou senha invalidos");
        }
    });
}

if (form_cadastro) {
    form_cadastro.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email_cadastro").value;
        const password = document.getElementById("password_cadastro").value;
        const password_confirmation = document.getElementById("confirm").value;

        const password_correct = password === password_confirmation;

        if (password_correct) {
            cadastrar(email, password);
            alert("Cadastro concluido!");
            form_cadastro.reset();
        } else {
            alert("Senhas não conferem");
        }
    });
}
