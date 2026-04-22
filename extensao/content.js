const BACKEND_URL = "https://chat-ia.onrender.com/melhorar";

function criarBotao(campo) {
    if (campo.dataset.iaAtivo) return;
    campo.dataset.iaAtivo = "true";

    const botao = document.createElement("button");
    botao.innerText = "✨";
    botao.className = "botao-ia";

    document.body.appendChild(botao);

    function posicionar() {
        const rect = campo.getBoundingClientRect();

        botao.style.top = window.scrollY + rect.top + 5 + "px";
        botao.style.left = window.scrollX + rect.right - 35 + "px";
    }

    posicionar();

    window.addEventListener("scroll", posicionar);
    window.addEventListener("resize", posicionar);

    botao.addEventListener("click", async () => {
        let texto = campo.value || campo.innerText || campo.textContent;

        if (!texto.trim()) return;

        botao.innerText = "⏳";

        const resposta = await melhorarTexto(texto);

        if ("value" in campo) {
            campo.value = resposta;
        } else {
            campo.innerText = resposta;
            campo.textContent = resposta;
        }

        campo.dispatchEvent(new Event("input", { bubbles: true }));

        botao.innerText = "✨";
    });
}

async function melhorarTexto(texto) {
    try {
        const resposta = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensagem: texto
            })
        });

        const data = await resposta.json();

        return data.resposta;

    } catch (erro) {
        return "Erro ao conectar servidor.";
    }
}

function procurarCampos() {
    const campos = document.querySelectorAll(`
        textarea,
        input[type='text'],
        div[contenteditable='true'],
        [role='textbox']
    `);

    campos.forEach(campo => criarBotao(campo));
}

setInterval(procurarCampos, 1000);