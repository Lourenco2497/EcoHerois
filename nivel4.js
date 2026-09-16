/**
 * Eco Heróis — Nível 4: Casa de Banho
 * Combate ao desperdício de água potável através do fecho imediato de torneiras abertas.
 */
document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_PONTOS = 10;
    const TEMPO_MAXIMO = 30;

    const introScreen = document.getElementById('nivel4-intro');
    const gameContainer = document.getElementById('nivel4-fundo');
    const btnIniciar = document.getElementById('btn-iniciar');
    const taps = document.querySelectorAll('.tap-node');

    let tapInterval = null;
    let waterAudio = null;

    // Inicializar HUD
    const hud = new GameHUD({
        levelNumber: 4,
        levelTitle: 'Nível 4',
        levelSubtitle: 'Poupança de Água',
        totalPoints: TOTAL_PONTOS,
        maxTime: TEMPO_MAXIMO,
        nextLevelUrl: 'nivel5.html',
        onTimeout: () => {
            pararJogo();
            hud.showDefeatModal(
                'O tempo esgotou-se e a água foi desperdiçada! Sabias que uma torneira aberta pode gastar mais de 10 litros de água por minuto? Tenta novamente e fecha-as mais depressa!'
            );
        }
    });

    function pararJogo() {
        clearInterval(tapInterval);
        if (window.audioManager) {
            window.audioManager.stop('agua');
        }
    }

    function atualizarSomAgua() {
        const algumaAberta = Array.from(taps).some(tap => tap.dataset.estado === 'aberta');
        if (algumaAberta) {
            if (!waterAudio && window.audioManager) {
                waterAudio = window.audioManager.play('agua', true);
            }
        } else {
            if (window.audioManager) {
                window.audioManager.stop('agua');
            }
            waterAudio = null;
        }
    }

    function abrirTorneira(tap) {
        if (hud.isEnded || hud.isPaused) return;

        tap.dataset.estado = 'aberta';
        const img = tap.querySelector('.tap-img');
        const stream = tap.querySelector('.tap-water-stream');
        const splash = tap.querySelector('.tap-splash');

        if (img) img.src = 'imagens/pagina-learn/torneira-aberta.png';
        if (stream) stream.style.display = 'block';
        if (splash) splash.style.display = 'block';

        atualizarSomAgua();
    }

    function fecharTorneira(tap) {
        if (tap.dataset.estado !== 'aberta' || hud.isEnded) return;

        tap.dataset.estado = 'fechada';
        const img = tap.querySelector('.tap-img');
        const stream = tap.querySelector('.tap-water-stream');
        const splash = tap.querySelector('.tap-splash');

        if (img) img.src = 'imagens/pagina-learn/torneira-fechada.png';
        if (stream) stream.style.display = 'none';
        if (splash) splash.style.display = 'none';

        // Efeito sonoro do clique de torneira
        if (window.audioManager) window.audioManager.play('torneira');

        // Efeito visual de sucesso no ponto da torneira
        tap.classList.add('counter-bump');
        setTimeout(() => tap.classList.remove('counter-bump'), 300);

        atualizarSomAgua();
        const currentPoints = hud.addPoints(1);

        if (currentPoints >= TOTAL_PONTOS) {
            pararJogo();
            setTimeout(() => {
                hud.showVictoryModal(
                    'Sensacional, Eco Herói! Fechaste todas as torneiras a tempo e poupaste centenas de litros de água potável. O planeta agradece!'
                );
            }, 400);
        }
    }

    // Configurar estações de torneira
    taps.forEach((tap) => {
        tap.addEventListener('click', () => fecharTorneira(tap));
        // Estado inicial: fechadas
        tap.dataset.estado = 'fechada';
        const stream = tap.querySelector('.tap-water-stream');
        const splash = tap.querySelector('.tap-splash');
        if (stream) stream.style.display = 'none';
        if (splash) splash.style.display = 'none';
    });

    function iniciarCicloAgua() {
        // Abrir a primeira torneira imediatamente
        abrirTorneira(taps[0]);

        // Ciclo periódico de ativação de torneiras
        tapInterval = setInterval(() => {
            if (hud.isEnded || hud.isPaused) return;

            const fechadas = Array.from(taps).filter(t => t.dataset.estado === 'fechada');
            if (fechadas.length > 0) {
                const sorteada = fechadas[Math.floor(Math.random() * fechadas.length)];
                abrirTorneira(sorteada);
            }
        }, 1800);
    }

    btnIniciar.addEventListener('click', () => {
        introScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        setTimeout(() => {
            hud.startTimer();
            iniciarCicloAgua();
        }, 80);
    });
});
