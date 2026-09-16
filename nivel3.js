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
        const isPortrait = (stageHeight > stageWidth) || (stageWidth <= 640);
        const posicoesUsadas = [];

        if (isPortrait) {
            // Em ecrãs verticais, distribuir em grelha adaptada (3 colunas x 4 linhas)
            const cols = 3;
            const rows = 4;
            const startY = stageHeight * 0.08;
            const endY = stageHeight * 0.68;
            const colWidth = stageWidth / cols;
            const rowHeight = (endY - startY) / rows;

            lixos.forEach((item, index) => {
                const c = index % cols;
                const r = Math.floor(index / cols);

                const itemW = item.offsetWidth || 56;
                const itemH = item.offsetHeight || 56;

                const jitterX = (Math.random() - 0.5) * 16;
                const jitterY = (Math.random() - 0.5) * 14;

                const posX = Math.floor((c * colWidth) + (colWidth / 2) - (itemW / 2) + jitterX);
                const posY = Math.floor(startY + (r * rowHeight) + (rowHeight / 2) - (itemH / 2) + jitterY);

                item.style.position = 'absolute';
                item.style.left = `${Math.max(10, Math.min(stageWidth - itemW - 10, posX))}px`;
                item.style.top = `${posY}px`;
                item.dataset.originLeft = item.style.left.replace('px', '');
                item.dataset.originTop = item.style.top.replace('px', '');
            });
            return;
        }

        // Em Modo Horizontal: ajustar alturas para telemóveis na horizontal
        const isCompact = stageHeight < 550;
        const soilMinY = isCompact ? stageHeight * 0.16 : stageHeight * 0.48;
        const soilMaxY = isCompact ? stageHeight * 0.60 : stageHeight * 0.82;
        const centerMinY = isCompact ? stageHeight * 0.14 : stageHeight * 0.44;
        const centerMaxY = isCompact ? stageHeight * 0.58 : stageHeight * 0.62;

        // Zonas lógicas da horta: canteiro esquerdo, solo/horta direita e caminho central acima da composteira
        const zones = [
            // Canteiro e terra à esquerda (4 resíduos)
            { minX: stageWidth * 0.06, maxX: stageWidth * 0.30, minY: soilMinY, maxY: soilMaxY },
            { minX: stageWidth * 0.08, maxX: stageWidth * 0.28, minY: soilMinY, maxY: soilMaxY },
            { minX: stageWidth * 0.05, maxX: stageWidth * 0.29, minY: soilMinY, maxY: soilMaxY },
            { minX: stageWidth * 0.09, maxX: stageWidth * 0.32, minY: soilMinY, maxY: soilMaxY },

            // Solo e relva à direita (4 resíduos)
            { minX: stageWidth * 0.70, maxX: stageWidth * 0.94, minY: soilMinY, maxY: soilMaxY },
            { minX: stageWidth * 0.72, maxX: stageWidth * 0.92, minY: soilMinY, maxY: soilMaxY },
            { minX: stageWidth * 0.68, maxX: stageWidth * 0.90, minY: soilMinY, maxY: soilMaxY },
            { minX: stageWidth * 0.71, maxX: stageWidth * 0.93, minY: soilMinY, maxY: soilMaxY },

            // Área central da terra acima da composteira (3 resíduos)
            { minX: stageWidth * 0.30, maxX: stageWidth * 0.48, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.52, maxX: stageWidth * 0.70, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.38, maxX: stageWidth * 0.62, minY: centerMinY, maxY: centerMaxY }
        ];

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