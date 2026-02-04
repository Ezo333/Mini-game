/**
 * Mini 1v1 Guessing Game - Phaser 3 Logic
 * Handles guess validation, feedback rendering, and communication with React Native
 */

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.secretNumber = null;
    this.guessHistory = [];
    this.feedbackSprites = [];
  }

  preload() {
    // No assets needed for now, using shapes and text
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);

    // Title
    this.add.text(width / 2, 60, '🎮 Guess Game', {
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Instructions
    this.add.text(width / 2, 120, 'Waiting for guess...', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#9ca3af',
    }).setOrigin(0.5);

    // Feedback display area
    this.feedbackContainer = this.add.container(width / 2, 200);

    // Message listener from React Native
    this.setupMessageListener();

    // Send ready signal
    this.sendToReactNative({ type: 'ready' });
  }

  setupMessageListener() {
    // Listen for messages from React Native WebView
    if (window.ReactNativeWebView) {
      window.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    }

    // For web testing
    document.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  }

  handleMessage(data) {
    switch (data.type) {
      case 'setSecret':
        this.secretNumber = data.secret;
        console.log('Secret number set');
        break;
      case 'guess':
        this.handleGuess(data.guess);
        break;
      case 'reset':
        this.resetGame();
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  handleGuess(guess) {
    if (!this.secretNumber) {
      console.error('No secret number set!');
      return;
    }

    const guessStr = String(guess);
    const secretStr = String(this.secretNumber);

    // Validate guess length
    if (guessStr.length !== secretStr.length) {
      this.sendToReactNative({
        type: 'error',
        message: `Guess must be ${secretStr.length} digits`,
      });
      return;
    }

    // Evaluate the guess
    const feedback = this.evaluateGuess(guessStr, secretStr);

    // Store in history
    this.guessHistory.push({ guess: guessStr, feedback });

    // Display feedback
    this.displayFeedback(feedback, guessStr);

    // Check if won
    const isWin = feedback.every(f => f === 'correct');

    // Send feedback to React Native
    this.sendToReactNative({
      type: 'feedback',
      guess: guessStr,
      feedback,
      isWin,
      attempts: this.guessHistory.length,
    });
  }

  evaluateGuess(guess, secret) {
    const feedback = [];
    const secretDigits = secret.split('');
    const guessDigits = guess.split('');
    const usedSecretIndices = new Set();
    const usedGuessIndices = new Set();

    // First pass: find correct positions (green)
    for (let i = 0; i < guessDigits.length; i++) {
      if (guessDigits[i] === secretDigits[i]) {
        feedback[i] = 'correct';
        usedSecretIndices.add(i);
        usedGuessIndices.add(i);
      }
    }

    // Second pass: find wrong positions (yellow)
    for (let i = 0; i < guessDigits.length; i++) {
      if (usedGuessIndices.has(i)) continue;

      const digit = guessDigits[i];
      let foundAt = -1;

      // Look for this digit in unused positions of secret
      for (let j = 0; j < secretDigits.length; j++) {
        if (!usedSecretIndices.has(j) && secretDigits[j] === digit) {
          foundAt = j;
          break;
        }
      }

      if (foundAt !== -1) {
        feedback[i] = 'wrongPosition';
        usedSecretIndices.add(foundAt);
      } else {
        feedback[i] = 'notInNumber';
      }
    }

    return feedback;
  }

  displayFeedback(feedback, guess) {
    // Clear previous feedback
    this.feedbackContainer.removeAll(true);

    const startX = -((feedback.length * 70) / 2);
    const guessDigits = guess.split('');

    feedback.forEach((status, index) => {
      const x = startX + index * 70;
      const digit = guessDigits[index];

      // Get emoji and color based on digit and status
      const { emoji, color } = this.getDigitDisplay(digit, status);

      // Background circle
      const circle = this.add.circle(x, 0, 30, color, 0.3);
      circle.setStrokeStyle(3, color);
      this.feedbackContainer.add(circle);

      // Digit or emoji text
      const text = this.add.text(x, 0, emoji, {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.feedbackContainer.add(text);
    });

    // Animate in
    this.tweens.add({
      targets: this.feedbackContainer,
      y: 200 + (this.guessHistory.length * 80),
      duration: 300,
      ease: 'Back.easeOut',
    });
  }

  getDigitDisplay(digit, status) {
    // Easter egg: 6 and 9 get special emojis
    let emoji = digit;
    if (digit === '6') {
      emoji = '🔄';
    } else if (digit === '9') {
      emoji = '🔁';
    }

    // Color based on feedback status
    let color;
    switch (status) {
      case 'correct':
        color = 0x10b981; // Green
        break;
      case 'wrongPosition':
        color = 0xf59e0b; // Yellow/Orange
        break;
      case 'notInNumber':
        color = 0xef4444; // Red
        break;
      default:
        color = 0x6b7280; // Gray
    }

    return { emoji, color };
  }

  resetGame() {
    this.secretNumber = null;
    this.guessHistory = [];
    this.feedbackContainer.removeAll(true);
    this.feedbackContainer.y = 200;
  }

  sendToReactNative(data) {
    const message = JSON.stringify(data);

    // Send to React Native WebView
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(message);
    }

    // For web testing
    console.log('Sending to React Native:', data);
  }

  update() {
    // Game loop (not needed for turn-based game)
  }
}

// Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 375,
  height: 667,
  parent: 'game-container',
  backgroundColor: '#111827',
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// Initialize Phaser game
const game = new Phaser.Game(config);

// Expose for debugging
window.game = game;
window.GameScene = GameScene;
