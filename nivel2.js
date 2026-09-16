/**
 * Eco Heróis — Nível 2: Quarto Tecnológico
 * Separação de pilhas gastas (Pilhão) e aparelhos eletrónicos avariados (Caixa de Eletrónicos).
 */
document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_ITENS = 10;
    const TEMPO_MAXIMO = 45;

    const introScreen = document.getElementById('nivel2-intro');
    const gameContainer = document.getElementById('nivel2-fundo');
    const gameStage = document.getElementById('game-stage');
    const btnIniciar = document.getElementById('btn-iniciar');
    const lixos = document.querySelectorAll('.lixo-drag');

    // Inicializar HUD de jogo
    const hud = new GameHUD({
        levelNumber: 2,
        levelTitle: 'Nível 2',
        levelSubtitle: 'Quarto Tecnológico',
        totalPoints: TOTAL_ITENS,
        maxTime: TEMPO_MAXIMO,
        nextLevelUrl: 'nivel3.html',
        onTimeout: () => {
            hud.showDefeatModal(
                'O tempo acabou! As pilhas deixadas no lixo comum libertam substâncias tóxicas graves no solo e na água. Os eletrónicos devem ser sempre encaminhados para reciclagem especializada!'
            );
        }
    });

    // Distribuição realista dos resíduos tecnológicos no quarto (secretária, tapete e chão)
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

        // Em Modo Horizontal: ajustar alturas para ecrãs de telemóvel na horizontal
        const isCompact = stageHeight < 550;
        const deskMinY = isCompact ? stageHeight * 0.16 : stageHeight * 0.46;
        const deskMaxY = isCompact ? stageHeight * 0.60 : stageHeight * 0.78;
        const rugMinY = isCompact ? stageHeight * 0.14 : stageHeight * 0.44;
        const rugMaxY = isCompact ? stageHeight * 0.58 : stageHeight * 0.64;

        // Zonas lógicas do quarto: secretária à esquerda, chão/tapete central e área da cama à direita
        const zones = [
            // Secretária / Mesa de estudo à esquerda (3 itens)
            { minX: stageWidth * 0.08, maxX: stageWidth * 0.28, minY: deskMinY, maxY: deskMaxY },
            { minX: stageWidth * 0.06, maxX: stageWidth * 0.26, minY: deskMinY, maxY: deskMaxY },
            { minX: stageWidth * 0.10, maxX: stageWidth * 0.30, minY: deskMinY, maxY: deskMaxY },

            // Área central do tapete e chão acima dos contentores (4 itens)
            { minX: stageWidth * 0.30, maxX: stageWidth * 0.48, minY: rugMinY, maxY: rugMaxY },
            { minX: stageWidth * 0.50, maxX: stageWidth * 0.68, minY: rugMinY, maxY: rugMaxY },
            { minX: stageWidth * 0.35, maxX: stageWidth * 0.55, minY: rugMinY, maxY: rugMaxY },
            { minX: stageWidth * 0.45, maxX: stageWidth * 0.65, minY: rugMinY, maxY: rugMaxY },

            // Área da mesinha e chão à direita (3 itens)
            { minX: stageWidth * 0.70, maxX: stageWidth * 0.90, minY: deskMinY, maxY: deskMaxY },
            { minX: stageWidth * 0.72, maxX: stageWidth * 0.92, minY: deskMinY, maxY: deskMaxY },
            { minX: stageWidth * 0.68, maxX: stageWidth * 0.88, minY: deskMinY, maxY: deskMaxY }
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
                    return dist < 85;
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
                            'Fantástico, Eco Herói! Todo o lixo eletrónico e pilhas foram encaminhados com segurança. Evitaste a contaminação do solo e salvaste recursos valiosos!'
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
