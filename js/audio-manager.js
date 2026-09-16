/**
 * Eco Heróis - Gestor Central de Áudio
 * Gere os efeitos sonoros do jogo com suporte para mute, controlo de volume e persistência.
 */
class AudioManager {
    constructor() {
        this.muted = localStorage.getItem('ecoherois_muted') === 'true';
        this.sounds = {};
        this.activeLoops = new Set();
        this.audioUnlocked = false;

        // Registo de sons do projeto
        this.soundSources = {
            certo: 'sons/certo.wav',
            errado: 'sons/errado.mp3',
            ganhar: 'sons/ganhar.wav',
            perder: 'sons/perder.wav',
            torneira: 'sons/torneira.wav',
            agua: 'sons/agua.mp3',
            switch: 'sons/switch.mp3'
        };

        this.init();
    }

    init() {
        // Pré-carregar os elementos de áudio
        Object.entries(this.soundSources).forEach(([key, src]) => {
            const audio = new Audio(src);
            audio.preload = 'auto';
            this.sounds[key] = audio;
        });

        // Configurações específicas de volume
        if (this.sounds.certo) this.sounds.certo.volume = 0.7;
        if (this.sounds.errado) this.sounds.errado.volume = 0.6;
        if (this.sounds.torneira) this.sounds.torneira.volume = 0.8;
        if (this.sounds.agua) {
            this.sounds.agua.loop = true;
            this.sounds.agua.volume = 0.4;
        }

        // Desbloquear contexto de áudio na primeira interação do utilizador
        const unlockAudio = () => {
            if (!this.audioUnlocked) {
                this.audioUnlocked = true;
                const silent = new Audio();
                silent.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
        window.addEventListener('pointerdown', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });
    }

    play(soundKey, loop = false) {
        if (this.muted) return null;
        const baseAudio = this.sounds[soundKey];
        if (!baseAudio) return null;

        try {
            if (loop) {
                baseAudio.currentTime = 0;
                baseAudio.loop = true;
                this.activeLoops.add(baseAudio);
                const promise = baseAudio.play();
                if (promise) promise.catch(() => {});
                return baseAudio;
            } else {
                // Criar clone para permitir sons simultâneos rápidos (ex: cliques repetidos)
                const instance = baseAudio.cloneNode();
                instance.volume = baseAudio.volume;
                const promise = instance.play();
                if (promise) promise.catch(() => {});
                return instance;
            }
        } catch (e) {
            console.warn('Audio playback error:', e);
            return null;
        }
    }

    stop(soundKey) {
        const audio = this.sounds[soundKey];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            this.activeLoops.delete(audio);
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {}
        });
        this.activeLoops.clear();
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('ecoherois_muted', this.muted);

        if (this.muted) {
            this.activeLoops.forEach(audio => audio.pause());
        } else {
            this.activeLoops.forEach(audio => audio.play().catch(() => {}));
        }

        // Notificar ouvintes da mudança de estado
        window.dispatchEvent(new CustomEvent('ecoherois:mutechanged', { detail: { muted: this.muted } }));
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }
}

// Exportar instância global única
window.audioManager = new AudioManager();
