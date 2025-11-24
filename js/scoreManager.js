// Score management with localStorage persistence

class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.scoreElement = null;
        this.highScoreElement = null;
    }

    init() {
        // Create or get score display elements
        this.createScoreDisplay();
        this.updateDisplay();
    }

    createScoreDisplay() {
        // Check if score display already exists
        let scoreContainer = document.getElementById('scoreContainer');

        if (!scoreContainer) {
            // Create score container
            scoreContainer = document.createElement('div');
            scoreContainer.id = 'scoreContainer';
            scoreContainer.className = 'score-container';

            // Current score
            const currentScoreDiv = document.createElement('div');
            currentScoreDiv.className = 'score-item';
            currentScoreDiv.innerHTML = '<span class="score-label">Score:</span> <span id="currentScore" class="score-value">0</span>';

            // High score
            const highScoreDiv = document.createElement('div');
            highScoreDiv.className = 'score-item';
            highScoreDiv.innerHTML = '<span class="score-label">High Score:</span> <span id="highScore" class="score-value">0</span>';

            scoreContainer.appendChild(currentScoreDiv);
            scoreContainer.appendChild(highScoreDiv);

            // Add to canvas wrapper
            const canvasWrapper = document.querySelector('.canvas-wrapper');
            if (canvasWrapper) {
                canvasWrapper.appendChild(scoreContainer);
            }
        }

        this.scoreElement = document.getElementById('currentScore');
        this.highScoreElement = document.getElementById('highScore');
    }

    addPoints(points) {
        this.currentScore += points;
        this.updateDisplay();

        // Check for new high score
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
            this.showHighScoreEffect();
        }
    }

    updateDisplay() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.currentScore;
        }
        if (this.highScoreElement) {
            this.highScoreElement.textContent = this.highScore;
        }
    }

    showHighScoreEffect() {
        // Add animation class for new high score
        if (this.highScoreElement) {
            this.highScoreElement.parentElement.classList.add('new-high-score');
            setTimeout(() => {
                this.highScoreElement.parentElement.classList.remove('new-high-score');
            }, 1000);
        }
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem('kiwiTimerHighScore');
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) {
            console.error('Error loading high score:', e);
            return 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('kiwiTimerHighScore', this.highScore.toString());
        } catch (e) {
            console.error('Error saving high score:', e);
        }
    }

    reset() {
        this.currentScore = 0;
        this.updateDisplay();
    }

    getCurrentScore() {
        return this.currentScore;
    }

    getHighScore() {
        return this.highScore;
    }
}
