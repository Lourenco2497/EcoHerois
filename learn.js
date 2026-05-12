/* Função mudar de ecoponto */

const contentores = document.querySelectorAll('.imagens-ecopontos-learn');
const textoEcopontos = document.querySelector('.texto-ecopontos-learn');
const arrows = document.querySelectorAll('.custom-btn-learn');

const textos = [
    'Coloca o <b>vidro</b> no contentor <span class="text-success"><b>verde</b></span>.',
    'Coloca o <b>papel</b> no contentor <span class="text-primary"><b>azul</b></span>.',
    'Coloca o <b>plástico</b> ou <b>metal</b> no contentor <span class="text-warning"><b>amarelo</b></span>.'
];

let ecopontoinicial = 1;

function atualizarContentores (){
    contentores.forEach((contentor, index) =>
        contentor.classList.toggle('ecoponto-off', index !== ecopontoinicial)
    );
    textoEcopontos.innerHTML = textos[ecopontoinicial];
}


arrows[0].onclick = () => {
    ecopontoinicial = (ecopontoinicial - 1 + contentores.length) % contentores.length;
    atualizarContentores();
};
arrows[1].onclick = () => {
    ecopontoinicial = (ecopontoinicial + 1) % contentores.length;
    atualizarContentores();
};


atualizarContentores();

/* Função mudar de ecoponto */

/* Função click ecoponto/loja */

function clickEcopontoCaixa() {
    const ecopontoVermelho = document.getElementById("ecoponto-vermelho");
    const caixa = document.getElementById("caixa");
    const texto = document.getElementById("cenasfixes");

    let isCaixaAberta = false;


    ecopontoVermelho.onclick = function () {
        caixa.style.opacity = "0.5"; // Reduzir opacidade da caixa
        ecopontoVermelho.style.opacity = "1"; // Restaurar opacidade do contentor vermelho
        texto.innerHTML = 'Coloca <b>pilhas</b> no contentor <b><span class="text-danger">vermelho</span></b>.';
    };


    caixa.onclick = function () {
        isCaixaAberta = !isCaixaAberta;

        if (isCaixaAberta) {
            caixa.src = "imagens/ecopontos/caixa-aberta.png";
            caixa.classList.remove("fechar");
            caixa.classList.add("abrir");
            texto.innerHTML = "Guarda os teus <b>aparelhos estragados</b> e entrega a uma loja que os aceite para serem reutilizados.";
        } else {
            caixa.src = "imagens/lixo/papel%20e%20cartão/mais%20caixa.webp";
            caixa.classList.remove("abrir");
            caixa.classList.add("fechar");
        }

        ecopontoVermelho.style.opacity = "0.5";
        caixa.style.opacity = "1";
    };
}

clickEcopontoCaixa();


/* Função click ecoponto/loja */

/* Mini Jogo Bio */

document.addEventListener("DOMContentLoaded", function () {
    const draggableItems = document.querySelectorAll(".draggable");
    const contentor = document.querySelector(".contentor-biodegradavel img");
    const planta = document.getElementById("planta");
    const mensagem = document.getElementById("mensagem");

    const crescimentoplanta = [
        "imagens/pagina-learn/Planta-inicial.png",
        "imagens/pagina-learn/Planta1.png",
        "imagens/pagina-learn/Planta2.png",
        "imagens/pagina-learn/Planta-final.png",
    ];

    let crescimentoatual = 0;


    planta.src = crescimentoplanta[crescimentoatual];


    draggableItems.forEach(function (item) {
        item.draggable = true;

        item.ondragstart = function (event) {
            event.dataTransfer.setData("text/plain", item.alt);
        };
    });


    contentor.ondragover = function (event) {
        event.preventDefault();
    };


    contentor.ondrop = function (event) {
        event.preventDefault();
        const item = event.dataTransfer.getData("text/plain");
        if (item) {
            if (crescimentoatual < crescimentoplanta.length - 1) {
                crescimentoatual++;
                planta.src = crescimentoplanta[crescimentoatual];
                mensagem.innerText = "Boa! A planta está a crescer! 🌱";
            }

            if (crescimentoatual === crescimentoplanta.length - 1) {
                mensagem.innerText =
                    "Parabéns! 🌳 A planta cresceu completamente graças ao lixo biodegradável!";
            }
        }
    };
});

/* Mini Jogo Bio */

/* Atividade Interativa água */

document.addEventListener("DOMContentLoaded", function () {
    const botaoComecar = document.getElementById("botao-comecar-agua");
    const jogoTorneiras = document.getElementById("jogo-torneiras");
    const progresso = document.getElementById("desperdicio");
    const resultado = document.getElementById("resultado");

    let jogoAtivo = false;
    let progressoInterval;
    let progressoAtual = 0;

    // Função para criar as torneiras
    function criarTorneiras() {
        jogoTorneiras.innerHTML = ""; // Limpa as torneiras anteriores
        for (let i = 0; i < 5; i++) {
            const torneira = document.createElement("img");
            torneira.src = "imagens/pagina-learn/torneira-aberta.png";
            torneira.alt = "Torneira aberta";
            torneira.classList.add("torneira");
            torneira.addEventListener("click", function () {
                if (jogoAtivo && torneira.alt === "Torneira aberta") {
                    torneira.src = "imagens/pagina-learn/torneira-fechada.png";
                    torneira.alt = "Torneira fechada";
                    verificarFimJogo();
                }
            });
            jogoTorneiras.appendChild(torneira);
        }
    }

    // Função para verificar se todas as torneiras estão fechadas
    function verificarFimJogo() {
        const todasTorneiras = document.querySelectorAll(".torneira");
        const todasFechadas = Array.from(todasTorneiras).every(
            (t) => t.alt === "Torneira fechada"
        );
        if (todasFechadas) {
            terminarJogo("Parabéns! Fechas-te todas as torneiras a tempo! 🎉");
        }
    }

    // Função para iniciar o progresso
    function iniciarProgresso() {
        progresso.style.width = "0%";
        progressoAtual = 0;
        progressoInterval = setInterval(function () {
            progressoAtual += 1;
            progresso.style.width = progressoAtual + "%";
            if (progressoAtual >= 100) {
                terminarJogo("Oh não! Algumas torneiras ficaram abertas e muita água foi desperdiçada. 😢");
            }
        }, 100);
    }

    // Função para terminar o jogo
    function terminarJogo(mensagem) {
        clearInterval(progressoInterval);
        jogoAtivo = false;
        resultado.textContent = mensagem;
    }

    // Evento de clique no botão "Começar o Jogo"
    botaoComecar.addEventListener("click", function () {
        if (!jogoAtivo) {
            jogoAtivo = true;
            resultado.textContent = "";
            criarTorneiras();
            iniciarProgresso();
        }
    });
});


/* Atividade Interativa água */

/* Atividade Interativa luz */

document.addEventListener("DOMContentLoaded", function () {
    const lampada = document.getElementById("lampada");
    const energia = document.getElementById("energia");

    let energiaDesperdicada = 0;
    let lampadaAcesa = false;
    let intervalo;

    // Função para ligar a lâmpada
    function ligarLampada() {
        lampada.src = "imagens/pagina-learn/luz-ligada.png";
        lampada.alt = "Lâmpada acesa";
        lampadaAcesa = true;

        // Incrementa o desperdício de energia a cada segundo
        intervalo = setInterval(() => {
            if (lampadaAcesa) {
                energiaDesperdicada++;
                energia.textContent = energiaDesperdicada;
            }
        }, 1000);
    }

    // Função para desligar a lâmpada
    function desligarLampada() {
        lampada.src = "imagens/pagina-learn/luz-desligada.png";
        lampada.alt = "Lâmpada apagada";
        lampadaAcesa = false;

        // Para o contador de desperdício
        clearInterval(intervalo);
    }

    // Clique na lâmpada para alternar entre ligar e desligar
    lampada.addEventListener("click", function () {
        if (lampadaAcesa) {
            desligarLampada();
        } else {
            ligarLampada();
        }
    });

    // Liga a lâmpada automaticamente ao iniciar
    ligarLampada();
});



/* Atividade Interativa luz */