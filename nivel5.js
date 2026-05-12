var fimjogotimer;
var pontos = 0;
var timer = document.getElementById('timer');
var tempoRestante;

document.getElementById('nivel5-fundo').style.display = 'none';
document.getElementById('nivel5-ganhar').style.display = 'none';
document.getElementById('nivel5-perder').style.display = 'none';


document.getElementById('btn-iniciar').onclick = function() {
    document.getElementById('nivel5-intro').style.display = 'none';
    document.getElementById('nivel5-fundo').style.display = 'block';

    carrega_elementos();
    jogar();
}

function carrega_elementos() {
    console.log("teste");
    tempoRestante = 20;
    for (var i = 1; i <= 10; i++) {
        document.getElementById("nivel5-fundo").innerHTML += '<img src="imagens/desligar/lampada_1.png" id="img' + i + '" class="bordamain" alt="acesa">';
    }

    var som = new Audio();
    som.src = "sons/switch.mp3";

    for (var a = 1; a <= 10; a++) {
        document.getElementById("img" + a).onclick = function () {
            som.play();

            if (this.alt === "acesa") {
                this.alt = "apagada";
                this.src = "imagens/desligar/lampada_0.png";
                pontos++;
                document.getElementById('pontos').innerHTML = '<p class="m-0" id="pontos">' + pontos + '/10</p>';

                if (pontos === 10) {
                    fim_jogo();
                }
            }
        }
    }
}

function jogar() {
    posiciona_lampadas();
    startTimer();
}

// Função para atualizar o timer
function updateTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    // Formata minutos e segundos para sempre terem 2 dígitos
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent =
            (minutos < 10 ? "0" + minutos : minutos) + ":" +
            (segundos < 10 ? "0" + segundos : segundos);
    }
}

// Função para iniciar o temporizador
let timerInterval;
function startTimer() {
    timerInterval = setInterval(function () {
        if (tempoRestante > 0) {
            tempoRestante--;
            console.log("Tempo restante:", tempoRestante); // Verificar o valor
            updateTimer();
        } else {
            clearInterval(timerInterval);
            terminarNivel();
        }
    }, 1000);
}
function posiciona_lampadas() {
    var fundo = document.getElementById("nivel5-fundo");
    var larguraFundo = fundo.clientWidth;
    var alturaFundo = fundo.clientHeight;

    // Limitar a altura a 1/3 da altura total da imagem
    var alturaMaxima = Math.floor(alturaFundo / 9);

    // Array para armazenar as posições das lâmpadas
    var lampadasPosicoes = [];

    for (var i = 1; i <= 10; i++) {
        var largura, altura;
        var overlap = true;

        // Garantir que a lâmpada não sobreponha outra
        while (overlap) {
            largura = Math.floor(Math.random() * (larguraFundo - 200)) + 100; // Largura limitada entre 100 e larguraFundo-100
            altura = Math.floor(Math.random() * alturaMaxima); // Altura limitada a 1/3

            overlap = false;

            // Verificar se a nova lâmpada não está muito perto de outras
            for (var j = 0; j < lampadasPosicoes.length; j++) {
                var lampadaExistente = lampadasPosicoes[j];

                // Verificar se a nova posição está muito perto de alguma lâmpada existente
                if (Math.abs(largura - lampadaExistente.largura) < 100 && Math.abs(altura - lampadaExistente.altura) < 100) {
                    overlap = true; // Se houver sobreposição, gerar nova posição
                    break;
                }
            }
        }

        // Armazenar a posição da lâmpada gerada
        lampadasPosicoes.push({ largura: largura, altura: altura });

        var lampada = document.getElementById("img" + i);
        lampada.style.position = 'absolute';
        lampada.style.top = altura + 'px';
        lampada.style.left = largura + 'px';

        lampada.alt = "acesa";
        lampada.src = "imagens/desligar/lampada_1.png";
    }
}

function fim_jogo(){
    clearInterval(timerInterval);

    document.getElementById('nivel5-ganhar').style.display = 'block';
    document.getElementById('nivel5-fundo').style.display = 'none';
}

function terminarNivel(){
    const audioPerder = new Audio('sons/perder.wav');
    audioPerder.play();
    document.getElementById('nivel5-perder').style.display = 'block';
    document.getElementById('nivel5-fundo').style.display = 'none';
}

document.getElementById('btn-voltar').onclick = function () {
    location.reload();
};
