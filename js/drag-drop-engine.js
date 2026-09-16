/**
 * Eco Heróis - Unified Pointer Drag and Drop Engine
 * Compatível com Rato, Touch (mobile/tablets) e Caneta.
 * Suporta também seleção por toque/teclado como alternativa acessível.
 */
class DragDropEngine {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.draggableSelector = options.draggableSelector || '.lixo-drag';
        this.dropZoneSelector = options.dropZoneSelector || '.ecoponto-drop';
        this.onDrop = options.onDrop || (() => {});
        this.onDragStart = options.onDragStart || (() => {});
        this.onDragEnd = options.onDragEnd || (() => {});

        this.activeElement = null;
        this.selectedElement = null; // Para modo de toque / teclado
        this.startPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.currentDropTarget = null;
        this.isDragging = false;

        this.bindEvents();
    }

    bindEvents() {
        const container = this.container;

        // Pointer events para suporte unificado
        container.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        window.addEventListener('pointermove', this.handlePointerMove.bind(this));
        window.addEventListener('pointerup', this.handlePointerUp.bind(this));
        window.addEventListener('pointercancel', this.handlePointerCancel.bind(this));

        // Impedir scroll indesejado ao arrastar em mobile
        container.addEventListener('touchmove', (e) => {
            if (this.isDragging) e.preventDefault();
        }, { passive: false });
    }

    handlePointerDown(e) {
        const target = e.target.closest(this.draggableSelector);
        if (!target || target.dataset.locked === 'true') {
            // Se clicar fora de um item, limpar seleção do modo alternativo
            if (this.selectedElement && !e.target.closest(this.dropZoneSelector)) {
                this.deselectItem(this.selectedElement);
            }
            return;
        }

        // Se o utilizador já tiver um item selecionado e clicar num novo item
        if (this.selectedElement && this.selectedElement !== target) {
            this.deselectItem(this.selectedElement);
        }

        this.activeElement = target;
        this.isDragging = false; // Só vira drag se houver movimento significativo

        const rect = target.getBoundingClientRect();
        this.offset.x = e.clientX - rect.left;
        this.offset.y = e.clientY - rect.top;
        this.startPos.x = target.offsetLeft;
        this.startPos.y = target.offsetTop;

        // Guardar posição inicial se ainda não guardada
        if (!target.dataset.originLeft) {
            target.dataset.originLeft = target.offsetLeft;
            target.dataset.originTop = target.offsetTop;
        }

        target.setPointerCapture(e.pointerId);
    }

    handlePointerMove(e) {
        if (!this.activeElement) return;

        const distance = Math.hypot(e.movementX || 0, e.movementY || 0);
        if (!this.isDragging && distance > 2) {
            this.isDragging = true;
            this.activeElement.classList.add('is-dragging');
            this.activeElement.style.zIndex = '1000';
            this.activeElement.style.pointerEvents = 'none'; // Permitir que elementFromPoint encontre os alvos por baixo
            this.onDragStart(this.activeElement);
        }

        if (this.isDragging) {
            const containerRect = this.container.getBoundingClientRect();
            const x = e.clientX - containerRect.left - this.offset.x;
            const y = e.clientY - containerRect.top - this.offset.y;

            this.activeElement.style.left = `${x}px`;
            this.activeElement.style.top = `${y}px`;

            // Detetar alvo por baixo do ponteiro
            const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
            const dropTarget = elemUnder ? elemUnder.closest(this.dropZoneSelector) : null;

            if (dropTarget !== this.currentDropTarget) {
                if (this.currentDropTarget) {
                    this.currentDropTarget.classList.remove('drop-hover');
                }
                this.currentDropTarget = dropTarget;
                if (this.currentDropTarget) {
                    this.currentDropTarget.classList.add('drop-hover');
                }
            }
        }
    }

    handlePointerUp(e) {
        if (!this.activeElement) return;

        const element = this.activeElement;
        const wasDragging = this.isDragging;
        const dropTarget = this.currentDropTarget;

        element.classList.remove('is-dragging');
        element.style.pointerEvents = '';
        element.style.zIndex = '';

        if (dropTarget) {
            dropTarget.classList.remove('drop-hover');
        }

        this.activeElement = null;
        this.isDragging = false;
        this.currentDropTarget = null;

        if (wasDragging) {
            // Tentativa de largada
            if (dropTarget) {
                const accepted = this.onDrop(element, dropTarget);
                if (!accepted) {
                    this.returnToOrigin(element);
                }
            } else {
                this.returnToOrigin(element);
            }
        } else {
            // Foi apenas um toque/clique sem arrastar: ativar/desativar modo de seleção
            this.toggleSelect(element);
        }
    }

    handlePointerCancel(e) {
        if (this.activeElement) {
            this.activeElement.classList.remove('is-dragging');
            this.activeElement.style.pointerEvents = '';
            this.activeElement.style.zIndex = '';
            this.returnToOrigin(this.activeElement);
            this.activeElement = null;
            this.isDragging = false;
        }
    }

    // Modo Acessível: Toque para Selecionar -> Toque no Ecoponto para Entregar
    toggleSelect(element) {
        if (this.selectedElement === element) {
            this.deselectItem(element);
        } else {
            if (this.selectedElement) {
                this.deselectItem(this.selectedElement);
            }
            this.selectItem(element);
        }
    }

    selectItem(element) {
        this.selectedElement = element;
        element.classList.add('is-selected');
        // Adicionar ouvintes diretos nos dropzones para aceitar clique
        this.attachDropZoneClick();
    }

    deselectItem(element) {
        if (!element) return;
        element.classList.remove('is-selected');
        this.selectedElement = null;
        this.detachDropZoneClick();
    }

    attachDropZoneClick() {
        this.dropZoneClickHandler = (e) => {
            const dropTarget = e.target.closest(this.dropZoneSelector);
            if (dropTarget && this.selectedElement) {
                const elem = this.selectedElement;
                this.deselectItem(elem);
                const accepted = this.onDrop(elem, dropTarget);
                if (!accepted) {
                    this.returnToOrigin(elem);
                }
            }
        };
        this.container.addEventListener('click', this.dropZoneClickHandler);
    }

    detachDropZoneClick() {
        if (this.dropZoneClickHandler) {
            this.container.removeEventListener('click', this.dropZoneClickHandler);
            this.dropZoneClickHandler = null;
        }
    }

    returnToOrigin(element) {
        element.classList.add('returning');
        const originLeft = element.dataset.originLeft || '50%';
        const originTop = element.dataset.originTop || '50%';

        element.style.transition = 'left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
        element.style.left = `${originLeft}px`;
        element.style.top = `${originTop}px`;

        // Efeito de shake suave no erro
        element.classList.add('shake-error');

        setTimeout(() => {
            element.style.transition = '';
            element.classList.remove('returning', 'shake-error');
        }, 400);
    }

    consumeItem(element, dropTarget) {
        element.dataset.locked = 'true';
        element.classList.remove('is-selected', 'is-dragging');

        // Animação de absorção/desaparecimento no ecoponto
        const dropRect = dropTarget.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        const targetX = dropRect.left - containerRect.left + (dropRect.width / 2) - (element.offsetWidth / 2);
        const targetY = dropRect.top - containerRect.top + (dropRect.height / 3);

        element.style.transition = 'all 0.3s ease-in';
        element.style.left = `${targetX}px`;
        element.style.top = `${targetY}px`;
        element.style.transform = 'scale(0.2) rotate(15deg)';
        element.style.opacity = '0';

        // Pulso no contentor
        dropTarget.classList.add('drop-success-pulse');
        setTimeout(() => {
            dropTarget.classList.remove('drop-success-pulse');
            element.remove();
        }, 320);
    }
}

window.DragDropEngine = DragDropEngine;
