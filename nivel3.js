window.onload = function() {
    const lixos = document.querySelectorAll('.lixo-drag');
    const ecopontos = document.querySelectorAll('.ecoponto-drop');
    let beingDragged;

    let pontos = 0;
    let tempoRestante = 20;
    const timer = document.getElementById('timer');

    const fundo = document.getElementById('nivel3-fundo');
    const posicaoUsada = [];

    // Função para atualizar o timer
    function atualizarTimer() {
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;

        // Formata minutos e segundos para sempre terem 2 dígitos
        timer.innerHTML =
            (minutos < 10 ? "0" + minutos : minutos) + ":" +
            (segundos < 10 ? "0" + segundos : segundos);
    }

// Função para iniciar o temporizador
    let timerInterval

    function startTimer() {
        timerInterval = setInterval(function () {
            if (tempoRestante > 0) {
                tempoRestante--;
                atualizarTimer();
            } else {
                clearInterval(timerInterval);
                tempoAcaba();
            }
        }, 1000);
    }

// Função chamada quando o tempo acaba
    function tempoAcaba() {
        const audioPerder = new Audio('sons/perder.wav');
        audioPerder.play();
        document.getElementById('nivel3-fundo').style.display = 'none';
        document.getElementById('nivel3-perder').style.display = 'block';
    }

    document.getElementById('btn-voltar').onclick = function() {
        window.location.href = 'nivel3.html';
        console.log('voltar ao nível 3');
    }


    function posAleatoria() {
        const fundoWidth = fundo.offsetWidth;
        const fundoHeight = fundo.offsetHeight;
        const imagemWidth = 100;
        const imagemHeight = 100;

        // Define os limites de posicionamento
        const minY = fundoHeight * 0.70;
        const maxY = fundoHeight - 10;

        let randomX, randomY;
        let overlapping;
        let tentativas = 0;
        const maxTentativas = 1000;

        do {
            // Posição aleatória dentro dos limites
            randomX = Math.random() * (fundoWidth - imagemWidth);
            randomY = minY + Math.random() * (maxY - minY - imagemHeight);

            // Verificar sobreposição com outras posições de lixo
            overlapping = posicaoUsada.some(pos => {
                return (
                    Math.abs(pos.x - randomX) < imagemWidth &&
                    Math.abs(pos.y - randomY) < imagemHeight
                );
            });

            tentativas++;
            if (tentativas >= maxTentativas) {
                console.warn('Não foi possível encontrar uma posição não sobreposta após ' + maxTentativas + ' tentativas.');
                break;
            }
        } while (overlapping);

        // Guardar a posição usada
        posicaoUsada.push({ x: randomX, y: randomY });
        return { x: randomX, y: randomY };

    }

    function resetLixos() {
        for (let i = 0; i < lixos.length; i++) {
            const imagem = lixos[i];
            const posAleatoria1 = posAleatoria();
            imagem.style.position = 'absolute';
            imagem.style.left = posAleatoria1.x + 'px';
            imagem.style.top = posAleatoria1.y + 'px';
        }
    }


    document.getElementById('btn-iniciar').onclick = function() {
    document.getElementById('nivel3-intro').style.display = 'none';
    document.getElementById('nivel3-fundo').style.display = 'block';

    resetLixos();
    startTimer();
}

    // Drag and drop
    for (let i = 0; i < lixos.length; i++) {
        const lixo = lixos[i];
        lixo.setAttribute('draggable', 'true');
        lixo.addEventListener('dragstart', dragStart);
        lixo.addEventListener('drag', dragging);
    }

    for (let j = 0; j < ecopontos.length; j++) {
        const ecoponto = ecopontos[j];
        ecoponto.addEventListener('dragover', dragOver);
        ecoponto.addEventListener('dragenter', dragEnter);
        ecoponto.addEventListener('dragleave', dragLeave);
        ecoponto.addEventListener('drop', dragDrop);
    }

    function dragStart(e) {
        beingDragged = e.target;
        // Guardar a posição inicial do lixo
        beingDragged.dataset.startX = beingDragged.offsetLeft;
        beingDragged.dataset.startY = beingDragged.offsetTop;
        console.log('drag iniciado no ' + beingDragged.id);
    }

    function dragging(e) {
        console.log('dragging ' + beingDragged.id);
    }

    function dragOver(e) {
        e.preventDefault();
        console.log('dragging over ' + e.target.id);
    }


    function dragEnter(e) {
        console.log('a entrar no' + e.target.id);
    }

    function dragLeave(e) {
        console.log('a sair de' + e.target.id);
    }

    function dragDrop(e) {
        e.preventDefault();
        console.log('drop realizado no: ' + e.target.id);
        verificarLixo(e);

    }

    function dragEnd(e) {
        console.log('acabou no' + e.target.id);
    }

    function verificarLixo(e) {
        const lixoClass = beingDragged.classList;

        const audioCerto = new Audio('sons/certo.wav');
        audioCerto.volume = 0.7;

        if (lixoClass.contains('bio')) {
            console.log('Lixo correto');
            e.target.append(beingDragged);
            pontos++;
            document.getElementById('pontos').innerHTML = '<p class="m-0" id="pontos">' + pontos + '/11</p>';
            audioCerto.play();
        } else {
            console.log('Lixo errado');
            lixoPosInicial()
        }

        if (pontos === 11) {
            floresNascem();
        }

    }

    function floresNascem(){
        clearInterval(timerInterval);
        let audioGanhar = new Audio('sons/ganhar.wav');
        audioGanhar.play();
        document.getElementById('nivel3-fundo').style.display = 'none';
        document.getElementById('nivel3-flores').style.display = 'block';
        passarParaNivel4();
    }

}

function passarParaNivel4() {
    const audioGanhar = new Audio('sons/ganhar.wav');
    audioGanhar.play();
    document.getElementById('btn-proximo').onclick = function() {
        window.location.href = 'nivel4.html';
        console.log('passar para nível 4');
    }
}

// Voltar à posição inicial
function lixoPosInicial() {
    beingDragged.style.left = beingDragged.dataset.startX + 'px';
    beingDragged.style.top = beingDragged.dataset.startY + 'px';
    console.log('Lixo voltou à posição inicial.');

}