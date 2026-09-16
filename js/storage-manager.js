/**
 * Eco Heróis - Gestor de Armazenamento e Progresso
 * Guarda o progresso dos níveis, pontuações, estrelas e dados do jogador no localStorage.
 */
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'ecoherois_progress_v2';
        this.data = this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.warn('Erro ao ler progresso:', e);
        }

        return {
            unlockedLevel: 1,
            levels: {
                1: { completed: false, stars: 0, bestTime: 0, score: 0 },
                2: { completed: false, stars: 0, bestTime: 0, score: 0 },
                3: { completed: false, stars: 0, bestTime: 0, score: 0 },
                4: { completed: false, stars: 0, bestTime: 0, score: 0 },
                5: { completed: false, stars: 0, bestTime: 0, score: 0 }
            },
            totalItemsRecycled: 0,
            ecoHeroLevel: 'Iniciante'
        };
    }

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Erro ao gravar progresso:', e);
        }
    }

    isLevelUnlocked(levelNumber) {
        if (levelNumber === 1) return true;
        // Se o nível anterior estiver completo ou se unlockedLevel >= levelNumber
        return (this.data.unlockedLevel >= levelNumber) || (this.data.levels[levelNumber - 1]?.completed);
    }

    getLevelData(levelNumber) {
        return this.data.levels[levelNumber] || { completed: false, stars: 0, bestTime: 0, score: 0 };
    }

    saveLevelSuccess(levelNumber, score, timeRemaining, maxTime = 50) {
        const lvl = parseInt(levelNumber, 10);
        if (!this.data.levels[lvl]) {
            this.data.levels[lvl] = { completed: false, stars: 0, bestTime: 0, score: 0 };
        }

        // Cálculo de estrelas (1 a 3) com base no tempo restante
        let stars = 1;
        const timeRatio = timeRemaining / maxTime;
        if (timeRatio >= 0.5) stars = 3;
        else if (timeRatio >= 0.25) stars = 2;

        const currentLvl = this.data.levels[lvl];
        currentLvl.completed = true;
        currentLvl.stars = Math.max(currentLvl.stars || 0, stars);
        currentLvl.bestTime = Math.max(currentLvl.bestTime || 0, timeRemaining);
        currentLvl.score = Math.max(currentLvl.score || 0, score);

        // Desbloquear próximo nível
        if (lvl < 5 && this.data.unlockedLevel <= lvl) {
            this.data.unlockedLevel = lvl + 1;
        }

        // Estatística de impacto
        this.data.totalItemsRecycled += score;
        this.updateEcoHeroTitle();

        this.save();
        return stars;
    }

    updateEcoHeroTitle() {
        const totalStars = this.getTotalStars();
        if (totalStars >= 13) {
            this.data.ecoHeroLevel = 'Guardião da Terra';
        } else if (totalStars >= 9) {
            this.data.ecoHeroLevel = 'Super Eco Herói';
        } else if (totalStars >= 4) {
            this.data.ecoHeroLevel = 'Defensor Verde';
        } else {
            this.data.ecoHeroLevel = 'Aprendiz da Natureza';
        }
    }

    getTotalStars() {
        let count = 0;
        for (let i = 1; i <= 5; i++) {
            count += this.data.levels[i]?.stars || 0;
        }
        return count;
    }

    getCompletedCount() {
        let count = 0;
        for (let i = 1; i <= 5; i++) {
            if (this.data.levels[i]?.completed) count++;
        }
        return count;
    }

    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.data = this.load();
        this.save();
    }
}

window.storageManager = new StorageManager();
