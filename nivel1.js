/**
 * Eco Heróis — Nível 1: Parque da Cidade
 * Separação de resíduos nos ecopontos Azul (papel), Amarelo (plástico/metal) e Verde (vidro).
 */
document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_LIXOS = 14;
    const TEMPO_MAXIMO = 50;

    const introScreen = document.getElementById('nivel1-intro');
    const gameContainer = document.getElementById('nivel1-fundo');
    const gameStage = document.getElementById('game-stage');
    const btnIniciar = document.getElementById('btn-iniciar');
    const lixos = document.querySelectorAll('.lixo-drag');

    // Inicializar HUD de jogo
    const hud = new GameHUD({
        levelNumber: 1,
        levelTitle: 'Nível 1',
        levelSubtitle: 'Parque da Cidade',
        totalPoints: TOTAL_LIXOS,
        maxTime: TEMPO_MAXIMO,
        nextLevelUrl: 'nivel2.html',
        onTimeout: () => {
            hud.showDefeatModal(
                'O tempo esgotou-se! O vidro abandonado causa riscos de incêndio, e o plástico prejudica os animais do parque. Tenta novamente e limpa o parque a tempo!'
            );
        }
    });

    // Distribuição realista e inteligente dos resíduos no relvado e caminhos do parque
    function distribuirLixosSeguro() {
        const stageWidth = gameStage.clientWidth || window.innerWidth;
        const stageHeight = gameStage.clientHeight || window.innerHeight;

        // Definir zonas lógicas do terreno do parque (chão, relvado esquerdo, caminho central superior, relvado direito)
        // Desta forma, o lixo nunca flutua no céu/copas das árvores nem colide com os ecopontos em baixo.
        const zones = [
            // Zona 1: Relvado à esquerda (4 resíduos)
            { minX: stageWidth * 0.05, maxX: stageWidth * 0.28, minY: stageHeight * 0.48, maxY: stageHeight * 0.82 },
            { minX: stageWidth * 0.06, maxX: stageWidth * 0.29, minY: stageHeight * 0.50, maxY: stageHeight * 0.82 },
            { minX: stageWidth * 0.04, maxX: stageWidth * 0.27, minY: stageHeight * 0.46, maxY: stageHeight * 0.80 },
            { minX: stageWidth * 0.08, maxX: stageWidth * 0.30, minY: stageHeight * 0.52, maxY: stageHeight * 0.84 },

            // Zona 2: Relvado à direita (4 resíduos)
            { minX: stageWidth * 0.72, maxX: stageWidth * 0.94, minY: stageHeight * 0.48, maxY: stageHeight * 0.82 },
            { minX: stageWidth * 0.70, maxX: stageWidth * 0.93, minY: stageHeight * 0.50, maxY: stageHeight * 0.82 },
            { minX: stageWidth * 0.73, maxX: stageWidth * 0.95, minY: stageHeight * 0.46, maxY: stageHeight * 0.80 },
            { minX: stageWidth * 0.69, maxX: stageWidth * 0.92, minY: stageHeight * 0.52, maxY: stageHeight * 0.84 },

            // Zona 3: Caminho e relvado central acima dos ecopontos (6 resíduos)
            { minX: stageWidth * 0.28, maxX: stageWidth * 0.48, minY: stageHeight * 0.44, maxY: stageHeight * 0.62 },
            { minX: stageWidth * 0.48, maxX: stageWidth * 0.68, minY: stageHeight * 0.44, maxY: stageHeight * 0.62 },
            { minX: stageWidth * 0.32, maxX: stageWidth * 0.52, minY: stageHeight * 0.45, maxY: stageHeight * 0.63 },
            { minX: stageWidth * 0.45, maxX: stageWidth * 0.65, minY: stageHeight * 0.46, maxY: stageHeight * 0.64 },
            { minX: stageWidth * 0.22, maxX: stageWidth * 0.42, minY: stageHeight * 0.48, maxY: stageHeight * 0.65 },
            { minX: stageWidth * 0.55, maxX: stageWidth * 0.74, minY: stageHeight * 0.48, maxY: stageHeight * 0.65 }
        ];

        const posicoesUsadas = [];

        lixos.forEach((item, index) => {
            const zone = zones[index % zones.length];
            const itemW = item.offsetWidth || 85;
            const itemH = item.offsetHeight || 85;

            let posX, posY;
            let tentativas = 0;
            let sobreposto = true;

            while (sobreposto && tentativas < 60) {
                tentativas++;
                const spanX = Math.max(10, zone.maxX - zone.minX - itemW);
                const spanY = Math.max(10, zone.maxY - zone.minY - itemH);

                posX = Math.floor(zone.minX + Math.random() * spanX);
                posY = Math.floor(zone.minY + Math.random() * spanY);

                // Garantir distância mínima entre itens para não se taparem
                sobreposto = posicoesUsadas.some(pos => {
                    const dist = Math.hypot(pos.x - posX, pos.y - posY);
                    return dist < 82;
                });
            }

            if (sobreposto) {
                // Posição determinística segura dentro da zona
                posX = Math.floor(zone.minX + 20);
                posY = Math.floor(zone.minY + 20);
            }

            posicoesUsadas.push({ x: posX, y: posY });

            item.style.position = 'absolute';
            item.style.left = `${posX}px`;
            item.style.top = `${posY}px`;
            item.dataset.originLeft = posX;
            item.dataset.originTop = posY;
        });
    }

    // Inicializar motor de Drag and Drop
    const dnd = new DragDropEngine({
        container: gameStage,
        draggableSelector: '.lixo-drag',
        dropZoneSelector: '.ecoponto-drop',
        onDrop: (draggedElem, dropTarget) => {
            const tipoItem = draggedElem.dataset.tipo;
            const tipoAceite = dropTarget.dataset.aceita;

            if (tipoItem === tipoAceite) {
                // Acerto!
                if (window.audioManager) window.audioManager.play('certo');
                dnd.consumeItem(draggedElem, dropTarget);
                const currentPoints = hud.addPoints(1);

                if (currentPoints >= TOTAL_LIXOS) {
                    setTimeout(() => {
                        hud.showVictoryModal(
                            'Parabéns, Eco Herói! Separaste todo o lixo do parque nos ecopontos certos. O parque da cidade está limpo e seguro para todos!'
                        );
                    }, 500);
                }
                return true;
            } else {
                // Erro! Ecoponto errado
                if (window.audioManager) window.audioManager.play('errado');
                return false;
            }
        }
    });

    // Iniciar Missão ao clicar no botão
    btnIniciar.addEventListener('click', () => {
        introScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        // Pequeno delay para garantir que as dimensões do gameStage estão calculadas
        setTimeout(() => {
            distribuirLixosSeguro();
            hud.startTimer();
        }, 80);
    });

    // Redimensionamento de janela
    window.addEventListener('resize', () => {
        if (gameContainer.style.display !== 'none' && !hud.isEnded) {
            distribuirLixosSeguro();
        }
    });
});
