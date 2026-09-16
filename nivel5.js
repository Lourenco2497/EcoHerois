/**
 * Eco Heróis — Nível 5: Sala Inteligente
 * Eficiência energética: encontrar e apagar 10 pontos de luz desnecessários na sala.
 */
document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_LAMPADAS = 10;
    const TEMPO_MAXIMO = 25;

    const introScreen = document.getElementById('nivel5-intro');
    const gameContainer = document.getElementById('nivel5-fundo');
    const gameStage = document.getElementById('game-stage');
    const btnIniciar = document.getElementById('btn-iniciar');

    // Inicializar HUD de jogo
    const hud = new GameHUD({
        levelNumber: 5,
        levelTitle: 'Nível 5',
        levelSubtitle: 'Eficiência Energética',
        totalPoints: TOTAL_LAMPADAS,
        maxTime: TEMPO_MAXIMO,
        nextLevelUrl: 'index.html',
        onTimeout: () => {
            hud.showDefeatModal(
                'O tempo terminou! Manter luzes acesas sem necessidade desperdiça eletricidade e sobrecarrega a rede energética. Lembra-te: ao sair de uma divisão, apaga sempre a luz!'
            );
        }
    });

    // Criar e posicionar 10 lâmpadas de forma harmoniosa na sala
    function instanciarLampadas() {
        // Limpar qualquer lâmpada existente
        const antigas = gameStage.querySelectorAll('.lamp-node');
        antigas.forEach(l => l.remove());

        const stageWidth = gameStage.clientWidth || window.innerWidth;
        const stageHeight = gameStage.clientHeight || window.innerHeight;

        // 10 coordenadas percentuais bem distribuídas pelo cenário da sala com tamanhos aumentados
        const layoutCoords = [
            { x: 0.12, y: 0.18, size: 74 }, // Teto canto esquerdo
            { x: 0.32, y: 0.15, size: 78 }, // Candeeiro de teto
            { x: 0.50, y: 0.14, size: 84 }, // Lustre central
            { x: 0.72, y: 0.16, size: 78 }, // Candeeiro suspenso direito
            { x: 0.88, y: 0.20, size: 72 }, // Aplique teto lateral
            { x: 0.18, y: 0.44, size: 70 }, // Candeeiro de mesa esquerda
            { x: 0.42, y: 0.48, size: 68 }, // Luz ambiente móvel
            { x: 0.65, y: 0.42, size: 70 }, // Abajur estante
            { x: 0.84, y: 0.50, size: 76 }, // Candeeiro de chão
            { x: 0.28, y: 0.68, size: 68 }  // Luz auxiliar perto do sofá
        ];

        layoutCoords.forEach((coord, index) => {
            const lamp = document.createElement('div');
            lamp.className = 'lamp-node';
            lamp.id = `lampada-${index + 1}`;
            lamp.dataset.estado = 'acesa';

            const leftPx = Math.floor(stageWidth * coord.x);
            const topPx = Math.floor(stageHeight * coord.y);

            lamp.style.left = `${leftPx}px`;
            lamp.style.top = `${topPx}px`;

            const img = document.createElement('img');
            img.src = 'imagens/desligar/lampada_1.png';
            img.alt = `Lâmpada ${index + 1} acesa`;
            img.style.width = `${coord.size}px`;
            img.style.height = 'auto';

            lamp.appendChild(img);
            gameStage.appendChild(lamp);

            // Evento de clique para apagar a lâmpada
            lamp.addEventListener('click', () => {
                if (lamp.dataset.estado !== 'acesa' || hud.isEnded) return;

                lamp.dataset.estado = 'apagada';
                lamp.classList.add('off');
                img.src = 'imagens/desligar/lampada_0.png';
                img.alt = `Lâmpada ${index + 1} apagada`;

                // Efeito sonoro do interruptor
                if (window.audioManager) window.audioManager.play('switch');

                const currentPoints = hud.addPoints(1);

                if (currentPoints >= TOTAL_LAMPADAS) {
                    setTimeout(() => {
                        hud.showVictoryModal(
                            'Parabéns, Grande Eco Herói! Completaste todos os 5 desafios de sustentabilidade com sucesso. Graças a ti, o planeta é agora um lugar mais verde, limpo e consciente!'
                        );
                    }, 400);
                }
            });
        });
    }

    btnIniciar.addEventListener('click', () => {
        introScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        setTimeout(() => {
            instanciarLampadas();
            hud.startTimer();
        }, 80);
    });

    window.addEventListener('resize', () => {
        if (gameContainer.style.display !== 'none' && !hud.isEnded) {
            instanciarLampadas();
        }
    });
});
