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
        const isPortrait = (stageHeight > stageWidth) || (stageWidth <= 640);
        const posicoesUsadas = [];

        if (isPortrait) {
            // Em ecrãs verticais, distribuir em grelha adaptada (3 ou 4 colunas)
            // de modo a que os 14 itens fiquem bem espaçados e nunca sobreponham os ecopontos em baixo.
            const cols = stageWidth < 500 ? 3 : 4;
            const rows = Math.ceil(TOTAL_LIXOS / cols);
            const startY = stageHeight * 0.05;
            const endY = stageHeight * 0.68;
            const colWidth = stageWidth / cols;
            const rowHeight = (endY - startY) / rows;

            lixos.forEach((item, index) => {
                const c = index % cols;
                const r = Math.floor(index / cols);

                const itemW = item.offsetWidth || 54;
                const itemH = item.offsetHeight || 54;

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

        // Em Modo Horizontal: ajustar alturas se o telemóvel estiver na horizontal (ecrã estreito em altura)
        const isCompact = stageHeight < 550;
        const groundMinY = isCompact ? stageHeight * 0.16 : stageHeight * 0.48;
        const groundMaxY = isCompact ? stageHeight * 0.62 : stageHeight * 0.82;
        const centerMinY = isCompact ? stageHeight * 0.14 : stageHeight * 0.44;
        const centerMaxY = isCompact ? stageHeight * 0.58 : stageHeight * 0.64;

        // Zonas de terreno realistas (relvados e caminhos)
        const zones = [
            // Zona 1: Relvado à esquerda (4 resíduos)
            { minX: stageWidth * 0.05, maxX: stageWidth * 0.28, minY: groundMinY, maxY: groundMaxY },
            { minX: stageWidth * 0.06, maxX: stageWidth * 0.29, minY: groundMinY, maxY: groundMaxY },
            { minX: stageWidth * 0.04, maxX: stageWidth * 0.27, minY: groundMinY, maxY: groundMaxY },
            { minX: stageWidth * 0.08, maxX: stageWidth * 0.30, minY: groundMinY, maxY: groundMaxY },

            // Zona 2: Relvado à direita (4 resíduos)
            { minX: stageWidth * 0.72, maxX: stageWidth * 0.94, minY: groundMinY, maxY: groundMaxY },
            { minX: stageWidth * 0.70, maxX: stageWidth * 0.93, minY: groundMinY, maxY: groundMaxY },
            { minX: stageWidth * 0.73, maxX: stageWidth * 0.95, minY: groundMinY, maxY: groundMaxY },
            { minX: stageWidth * 0.69, maxX: stageWidth * 0.92, minY: groundMinY, maxY: groundMaxY },

            // Zona 3: Caminho e relvado central acima dos ecopontos (6 resíduos)
            { minX: stageWidth * 0.28, maxX: stageWidth * 0.48, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.48, maxX: stageWidth * 0.68, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.32, maxX: stageWidth * 0.52, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.45, maxX: stageWidth * 0.65, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.22, maxX: stageWidth * 0.42, minY: centerMinY, maxY: centerMaxY },
            { minX: stageWidth * 0.55, maxX: stageWidth * 0.74, minY: centerMinY, maxY: centerMaxY }
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
                    return dist < 82;
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
