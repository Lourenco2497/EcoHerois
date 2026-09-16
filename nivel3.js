/**
 * Eco Heróis — Nível 3: Jardim Sustentável
 * Recolha de resíduos orgânicos para compostagem e produção de adubo biológico.
 */
document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_ITENS = 11;
    const TEMPO_MAXIMO = 45;

    const introScreen = document.getElementById('nivel3-intro');
    const gameContainer = document.getElementById('nivel3-fundo');
    const gameStage = document.getElementById('game-stage');
    const btnIniciar = document.getElementById('btn-iniciar');
    const lixos = document.querySelectorAll('.lixo-drag');

    // Inicializar HUD de jogo
    const hud = new GameHUD({
        levelNumber: 3,
        levelTitle: 'Nível 3',
        levelSubtitle: 'Jardim Sustentável',
        totalPoints: TOTAL_ITENS,
        maxTime: TEMPO_MAXIMO,
        nextLevelUrl: 'nivel4.html',
        onTimeout: () => {
            hud.showDefeatModal(
                'O tempo terminou! Quando a matéria orgânica vai parar a aterros comuns, decompõe-se sem oxigénio e gera gás metano. A compostagem é o caminho certo para nutrir o solo!'
            );
        }
    });

    // Distribuição realista e inteligente dos resíduos orgânicos pelo jardim e horta
    function distribuirLixosSeguro() {
        const stageWidth = gameStage.clientWidth || window.innerWidth;
        const stageHeight = gameStage.clientHeight || window.innerHeight;

        // Zonas lógicas da horta: canteiro esquerdo, solo/horta direita e caminho central acima da composteira
        const zones = [
            // Canteiro e terra à esquerda (4 resíduos)
            { minX: stageWidth * 0.06, maxX: stageWidth * 0.30, minY: stageHeight * 0.48, maxY: stageHeight * 0.82 },
            { minX: stageWidth * 0.08, maxX: stageWidth * 0.28, minY: stageHeight * 0.50, maxY: stageHeight * 0.80 },
            { minX: stageWidth * 0.05, maxX: stageWidth * 0.29, minY: stageHeight * 0.45, maxY: stageHeight * 0.76 },
            { minX: stageWidth * 0.09, maxX: stageWidth * 0.32, minY: stageHeight * 0.52, maxY: stageHeight * 0.84 },

            // Solo e relva à direita (4 resíduos)
            { minX: stageWidth * 0.70, maxX: stageWidth * 0.94, minY: stageHeight * 0.48, maxY: stageHeight * 0.82 },
            { minX: stageWidth * 0.72, maxX: stageWidth * 0.92, minY: stageHeight * 0.50, maxY: stageHeight * 0.80 },
            { minX: stageWidth * 0.68, maxX: stageWidth * 0.90, minY: stageHeight * 0.45, maxY: stageHeight * 0.76 },
            { minX: stageWidth * 0.71, maxX: stageWidth * 0.93, minY: stageHeight * 0.52, maxY: stageHeight * 0.84 },

            // Área central da terra acima da composteira (3 resíduos)
            { minX: stageWidth * 0.30, maxX: stageWidth * 0.48, minY: stageHeight * 0.44, maxY: stageHeight * 0.62 },
            { minX: stageWidth * 0.52, maxX: stageWidth * 0.70, minY: stageHeight * 0.44, maxY: stageHeight * 0.62 },
            { minX: stageWidth * 0.38, maxX: stageWidth * 0.62, minY: stageHeight * 0.46, maxY: stageHeight * 0.64 }
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

                sobreposto = posicoesUsadas.some(pos => {
                    const dist = Math.hypot(pos.x - posX, pos.y - posY);
                    return dist < 88;
                });
            }

            if (sobreposto) {
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

    // Motor de Drag and Drop
    const dnd = new DragDropEngine({
        container: gameStage,
        draggableSelector: '.lixo-drag',
        dropZoneSelector: '.ecoponto-drop',
        onDrop: (draggedElem, dropTarget) => {
            const tipoItem = draggedElem.dataset.tipo;
            const tipoAceite = dropTarget.dataset.aceita;

            if (tipoItem === tipoAceite) {
                if (window.audioManager) window.audioManager.play('certo');
                dnd.consumeItem(draggedElem, dropTarget);
                const currentPoints = hud.addPoints(1);

                if (currentPoints >= TOTAL_ITENS) {
                    setTimeout(() => {
                        hud.showVictoryModal(
                            'Excelente trabalho na horta! Todos os restos de comida foram para a composteira. Dentro de poucas semanas teremos um adubo orgânico fantástico para flores e vegetais!'
                        );
                    }, 500);
                }
                return true;
            } else {
                if (window.audioManager) window.audioManager.play('errado');
                return false;
            }
        }
    });

    btnIniciar.addEventListener('click', () => {
        introScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        setTimeout(() => {
            distribuirLixosSeguro();
            hud.startTimer();
        }, 80);
    });

    window.addEventListener('resize', () => {
        if (gameContainer.style.display !== 'none' && !hud.isEnded) {
            distribuirLixosSeguro();
        }
    });
});