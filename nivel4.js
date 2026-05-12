var fimjogotimer;
var pontos = 0;
var timer = document.getElementById('timer');
var tempoRestante;
var aguaPosicoes = [];
var aguaElementos = [];
var aguaTimer = [];
var somAgua = null;
var gameOver = false;
var todosSons = [];

document.getElementById('nivel4-fundo').style.display = 'none';
document.getElementById('nivel4-ganhar').style.display = 'none';
document.getElementById('nivel4-perder').style.display = 'none';

document.getElementById('btn-iniciar').onclick = function() {
    document.getElementById('nivel4-intro').style.display = 'none';
    document.getElementById('nivel4-fundo').style.display = 'block';

    carrega_elementos();
    jogar();
}

function carrega_elementos() {
    if (gameOver) return;

    console.log("Iniciando jogo...");
    tempoRestante = 20;

    // Cria 2 elementos de água com posições fixas
    for (var i = 0; i < 2; i++) {
        var agua = document.createElement("img");
        agua.src = "imagens/desligar/agua_1.png";
        agua.id = "agua" + i;
        agua.className = "agua";
        agua.alt = "ligada";
        document.getElementById("nivel4-fundo").appendChild(agua);
        aguaElementos.push(agua);
    }

    var som = new Audio();
    som.src = "sons/torneira.wav";

    // Eventos de clique para cada elemento de água
    aguaElementos.forEach(function(agua, index) {
        var somAgua = new Audio("sons/agua.mp3");
        somAgua.loop = true;
        todosSons.push(somAgua); // Adiciona o som de água ao array
        console.log("Sons adicionados a todosSons:", todosSons);
        agua.onclick = function() {
            tocarSomTorneira();

            if (this.alt === "ligada") {
                this.alt = "desligada";
                this.src = "imagens/desligar/agua_0.png";
                pontos++;
                document.getElementById('pontos').innerHTML = '<p class="m-0" id="pontos">' + pontos + '/10</p>';


                somAgua.pause();
                somAgua.currentTime = 0;

                if (pontos === 10) {

                    fim_jogo();
                }

                // Configura o temporizador para voltar a ser agua_1 após 2 segundos
                setTimeout(function() {
                    agua.src = "imagens/desligar/agua_1.png";
                    agua.alt = "ligada";

                    // Toca o som de água em loop
                    somAgua.play();
                }, 2000);
            }
        }

        // Começar o som de água quando o nível iniciar
        if (agua.alt === "ligada") {
            somAgua.play();
        }
    });
}


var somTorneira = new Audio();
somTorneira.src = "sons/torneira.wav";
somTorneira.loop = false;

// Evitar sobreposição de som de torneira
function tocarSomTorneira() {
    if (!somTorneira.paused) {
        somTorneira.pause();
        somTorneira.currentTime = 0;
    }
    somTorneira.play();
}

function jogar() {
    posiciona_agua();
    startTimer();
}

// Função para atualizar o timer
function updateTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent =
            (minutos < 10 ? "0" + minutos : minutos) + ":" +
            (segundos < 10 ? "0" + segundos : segundos);
    }
}

// Função para iniciar o timer
let timerInterval;
function startTimer() {
    timerInterval = setInterval(function() {
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

// Função para posicionar as águas com posições fixas
function posiciona_agua() {
    var fundo = document.getElementById("nivel4-fundo");
    var larguraFundo = fundo.clientWidth;
    var alturaFundo = fundo.clientHeight;

    let aguaPosicoes = [
        { largura: larguraFundo * 0.473, altura: alturaFundo * 0.444 }, // 10% da largura, 20% da altura
        { largura: larguraFundo * 0.618, altura: alturaFundo * 0.516 }  // 50% da largura, 70% da altura
    ];

    aguaPosicoes.forEach(function(pos, index) {
        let agua = aguaElementos[index];
        agua.style.position = 'absolute';
        agua.style.top = pos.altura + 'px';
        agua.style.left = pos.largura + 'px';
        agua.style.display = 'block';
    });
}

// Função de ganhar o jogo
function fim_jogo() {
    pausarSom ();
    clearInterval(timerInterval);
    let audioGanhar = new Audio('sons/ganhar.wav');
    audioGanhar.play();
    pausarSom ();
    document.getElementById('nivel4-ganhar').style.display = 'block';
    document.getElementById('nivel4-fundo').style.display = 'none';
}

// Pausar e reiniciar todos os sons de água
function pausarSom () {
    todosSons.forEach(function(somAgua) {
        somAgua.pause();
        somAgua.currentTime = 0;
    });
}




// Função de perder o jogo
function terminarNivel() {
    pausarSom ();

    let audioPerder = new Audio('sons/perder.wav');
    audioPerder.play();

    document.getElementById('nivel4-perder').style.display = 'block';
    document.getElementById('nivel4-fundo').style.display = 'none';
}


document.getElementById('btn-voltar').onclick = function() {
    location.reload();
}
