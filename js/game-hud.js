/**
 * Eco Heróis - Unified Game HUD & Modals
 * Fornece a barra superior de jogo, controlo do temporizador, botões de áudio e ecrãs de vitória/derrota.
 */
class GameHUD {
    constructor(options = {}) {
        this.levelNumber = options.levelNumber || 1;
        this.levelTitle = options.levelTitle || `Nível ${this.levelNumber}`;
        this.levelSubtitle = options.levelSubtitle || '';
        this.totalPoints = options.totalPoints || 10;
        this.maxTime = options.maxTime || 40;
        this.nextLevelUrl = options.nextLevelUrl || (this.levelNumber < 5 ? `nivel${this.levelNumber + 1}.html` : 'index.html');
        this.onStart = options.onStart || (() => {});
        this.onRestart = options.onRestart || (() => window.location.reload());
        this.onTimeout = options.onTimeout || (() => {});

        this.points = 0;
        this.timeRemaining = this.maxTime;
        this.timerInterval = null;
        this.isPaused = false;
        this.isEnded = false;

        this.initHUD();
        this.bindEvents();
    }

    initHUD() {
        // Encontrar ou criar o elemento da barra superior
        let hudElement = document.getElementById('eco-game-hud');
        if (!hudElement) {
            hudElement = document.createElement('div');
            hudElement.id = 'eco-game-hud';
            hudElement.className = 'eco-game-hud';
            document.body.prepend(hudElement);
        }

        const isMuted = window.audioManager ? window.audioManager.isMuted() : false;

        hudElement.innerHTML = `
            <div class="hud-left">
                <a href="index.html" class="hud-btn hud-btn-icon" title="Voltar ao Menu Principal" aria-label="Voltar ao Menu">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </a>
                <div class="hud-level-badge">
                    <span class="hud-badge-tag">${this.levelTitle}</span>
                    <span class="hud-badge-sub">${this.levelSubtitle}</span>
                </div>
            </div>

            <div class="hud-center">
                <div class="hud-counter-card" id="hud-score-display">
                    <span class="hud-icon">🌱</span>
                    <span class="hud-value" id="hud-points-text">${this.points}/${this.totalPoints}</span>
                </div>
                <div class="hud-timer-card" id="hud-timer-display">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="hud-value" id="hud-timer-text">${this.formatTime(this.timeRemaining)}</span>
                </div>
            </div>

            <div class="hud-right">
                <button class="hud-btn hud-btn-icon" id="hud-mute-btn" title="Ligar/Desligar Som" aria-label="Ligar ou Desligar Som">
                    ${isMuted ? '🔇' : '🔊'}
                </button>
                <button class="hud-btn hud-btn-icon" id="hud-help-btn" title="Instruções da Missão" aria-label="Ver Instruções">
                    ℹ️
                </button>
            </div>
        `;

        this.pointsText = document.getElementById('hud-points-text');
        this.timerText = document.getElementById('hud-timer-text');
        this.timerCard = document.getElementById('hud-timer-display');
        this.muteBtn = document.getElementById('hud-mute-btn');
    }

    bindEvents() {
        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => {
                if (window.audioManager) {
                    const muted = window.audioManager.toggleMute();
                    this.muteBtn.textContent = muted ? '🔇' : '🔊';
                }
            });
        }

        window.addEventListener('ecoherois:mutechanged', (e) => {
            if (this.muteBtn) {
                this.muteBtn.textContent = e.detail.muted ? '🔇' : '🔊';
            }
        });

        const helpBtn = document.getElementById('hud-help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showInstructionsModal();
            });
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            if (this.isPaused || this.isEnded) return;

            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateTimerDisplay();

                if (this.timeRemaining <= 10) {
                    this.timerCard.classList.add('timer-warning');
                }
            } else {
                clearInterval(this.timerInterval);
                this.timerCard.classList.remove('timer-warning');
                this.onTimeout();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    updateTimerDisplay() {
        if (this.timerText) {
            this.timerText.textContent = this.formatTime(this.timeRemaining);
        }
    }

    addPoints(amount = 1) {
        this.points = Math.min(this.totalPoints, this.points + amount);
        if (this.pointsText) {
            this.pointsText.textContent = `${this.points}/${this.totalPoints}`;
            const card = document.getElementById('hud-score-display');
            if (card) {
                card.classList.add('counter-bump');
                setTimeout(() => card.classList.remove('counter-bump'), 300);
            }
        }
        return this.points;
    }

    showVictoryModal(customMessage = null) {
        this.isEnded = true;
        this.stopTimer();

        if (window.audioManager) {
            window.audioManager.stopAll();
            window.audioManager.play('ganhar');
        }

        let stars = 1;
        if (window.storageManager) {
            stars = window.storageManager.saveLevelSuccess(
                this.levelNumber,
                this.points,
                this.timeRemaining,
                this.maxTime
            );
        }

        const starsHtml = `
            <div class="victory-stars">
                <span class="star ${stars >= 1 ? 'active' : ''}">⭐</span>
                <span class="star ${stars >= 2 ? 'active' : ''}">⭐</span>
                <span class="star ${stars >= 3 ? 'active' : ''}">⭐</span>
            </div>
        `;

        const isLastLevel = this.levelNumber >= 5;
        const defaultMsg = isLastLevel 
            ? 'Incrível! Completaste todas as 5 missões ecológicas e tornaste o planeta muito mais verde!'
            : 'Excelente trabalho, Eco Herói! Separaste e protegeste a natureza com distinção!';

        const modal = document.createElement('div');
        modal.className = 'eco-modal-backdrop fade-in';
        modal.innerHTML = `
            <div class="eco-modal-card scale-in">
                <div class="eco-modal-mascot-header">
                    <img src="imagens/mascote_final_fixe.png" alt="EcoFox Mascote" class="modal-mascot-img">
                </div>
                <h2 class="eco-modal-title">Missão Cumprida!</h2>
                ${starsHtml}
                <p class="eco-modal-body">${customMessage || defaultMsg}</p>
                <div class="eco-modal-stats">
                    <div class="stat-pill">
                        <span class="stat-label">Pontuação</span>
                        <span class="stat-val">${this.points}/${this.totalPoints}</span>
                    </div>
                    <div class="stat-pill">
                        <span class="stat-label">Tempo Restante</span>
                        <span class="stat-val">${this.formatTime(this.timeRemaining)}</span>
                    </div>
                </div>
                <div class="eco-modal-actions">
                    <button class="eco-btn eco-btn-secondary" id="modal-replay-btn">
                        🔄 Repetir
                    </button>
                    <a href="${this.nextLevelUrl}" class="eco-btn eco-btn-primary" id="modal-next-btn">
                        ${isLastLevel ? '🌍 Concluir e Voltar ao Menu' : 'Próxima Missão ➔'}
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#modal-replay-btn').addEventListener('click', () => {
            modal.remove();
            this.onRestart();
        });
    }

    showDefeatModal(educationalReason = '') {
        this.isEnded = true;
        this.stopTimer();

        if (window.audioManager) {
            window.audioManager.stopAll();
            window.audioManager.play('perder');
        }

        const defaultReason = 'O tempo esgotou-se e o ambiente sofreu com o desperdício! Lembra-te de que cada segundo e cada ação contam para salvar o planeta.';

        const modal = document.createElement('div');
        modal.className = 'eco-modal-backdrop fade-in';
        modal.innerHTML = `
            <div class="eco-modal-card eco-modal-defeat scale-in">
                <div class="eco-modal-mascot-header">
                    <img src="imagens/BONECO.png" alt="EcoFox Alerta" class="modal-mascot-img">
                </div>
                <h2 class="eco-modal-title defeat-title">O Planeta Precisa de Ti!</h2>
                <div class="defeat-speech-bubble">
                    <p>${educationalReason || defaultReason}</p>
                </div>
                <div class="eco-modal-actions">
                    <a href="index.html" class="eco-btn eco-btn-secondary">
                        🏠 Menu
                    </a>
                    <button class="eco-btn eco-btn-danger" id="modal-retry-btn">
                        ⚡ Tentar Novamente
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#modal-retry-btn').addEventListener('click', () => {
            modal.remove();
            this.onRestart();
        });
    }

    showInstructionsModal(content = null) {
        this.isPaused = true;
        const modal = document.createElement('div');
        modal.className = 'eco-modal-backdrop fade-in';
        modal.innerHTML = `
            <div class="eco-modal-card scale-in">
                <h2 class="eco-modal-title">${this.levelTitle}</h2>
                <p class="eco-modal-body">
                    ${content || 'Arrasta os elementos ou toca neles para os colocares no local correto antes que o tempo termine!'}
                </p>
                <div class="eco-modal-actions">
                    <button class="eco-btn eco-btn-primary" id="modal-resume-btn">
                        Continuar a Jogar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#modal-resume-btn').addEventListener('click', () => {
            modal.remove();
            this.isPaused = false;
        });
    }
}

window.GameHUD = GameHUD;
