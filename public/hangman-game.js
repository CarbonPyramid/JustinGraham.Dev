// Hangman 3D Game - Using Three.js
// Based on the same engine pattern as The Cube

const animationEngine = (() => {
  let uniqueID = 0;

  class AnimationEngine {
    constructor() {
      this.ids = [];
      this.animations = {};
      this.update = this.update.bind(this);
      this.raf = 0;
      this.time = 0;
    }

    update() {
      const now = performance.now();
      const delta = now - this.time;
      this.time = now;

      let i = this.ids.length;
      this.raf = i ? requestAnimationFrame(this.update) : 0;

      while (i--)
        this.animations[this.ids[i]] && this.animations[this.ids[i]].update(delta);
    }

    add(animation) {
      animation.id = uniqueID++;
      this.ids.push(animation.id);
      this.animations[animation.id] = animation;

      if (this.raf !== 0) return;
      this.time = performance.now();
      this.raf = requestAnimationFrame(this.update);
    }

    remove(animation) {
      const index = this.ids.indexOf(animation.id);
      if (index < 0) return;

      this.ids.splice(index, 1);
      delete this.animations[animation.id];
      animation = null;
    }
  }

  return new AnimationEngine();
})();

class Animation {
  constructor(start) {
    if (start === true) this.start();
  }

  start() {
    animationEngine.add(this);
  }

  stop() {
    animationEngine.remove(this);
  }

  update(delta) {}
}

// World class - handles Three.js scene
class World extends Animation {
  constructor(game) {
    super(true);

    this.game = game;
    this.container = this.game.dom.game;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    this.createLights();
    this.createGallows();
    this.createHangman();

    this.onResize = [];
    this.resize();
    window.addEventListener('resize', () => this.resize(), false);
  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 1, 0);

    if (this.onResize) this.onResize.forEach(cb => cb());
  }

  createLights() {
    this.lights = {
      holder: new THREE.Object3D(),
      ambient: new THREE.AmbientLight(0xffffff, 0.6),
      front: new THREE.DirectionalLight(0xffffff, 0.4),
      back: new THREE.DirectionalLight(0xffffff, 0.2),
    };

    this.lights.front.position.set(2, 4, 4);
    this.lights.back.position.set(-2, -4, -4);

    this.lights.holder.add(this.lights.ambient);
    this.lights.holder.add(this.lights.front);
    this.lights.holder.add(this.lights.back);

    this.scene.add(this.lights.holder);
  }

  createGallows() {
    const gallowsMaterial = new THREE.MeshStandardMaterial({
      color: 0x5D4E6D,
      roughness: 0.8,
      metalness: 0.1
    });

    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.2, 1),
      gallowsMaterial
    );
    base.position.set(0, -2, 0);
    this.scene.add(base);

    // Vertical pole
    const pole = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 5, 0.2),
      gallowsMaterial
    );
    pole.position.set(-1.2, 0.4, 0);
    this.scene.add(pole);

    // Horizontal beam
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.2, 0.2),
      gallowsMaterial
    );
    beam.position.set(0, 2.8, 0);
    this.scene.add(beam);

    // Support
    const support = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.15, 0.15),
      gallowsMaterial
    );
    support.position.set(-0.6, 2.2, 0);
    support.rotation.z = Math.PI / 4;
    this.scene.add(support);

    // Rope
    const ropeMaterial = new THREE.MeshStandardMaterial({
      color: 0x757ce8,
      roughness: 1
    });
    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8),
      ropeMaterial
    );
    rope.position.set(0.8, 2.5, 0);
    this.scene.add(rope);
  }

  createHangman() {
    this.hangmanParts = [];
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFB347,
      roughness: 0.5,
      metalness: 0.3,
      transparent: true,
      opacity: 0
    });

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 32, 32),
      bodyMaterial.clone()
    );
    head.position.set(0.8, 1.85, 0);
    this.hangmanParts.push(head);
    this.scene.add(head);

    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.12, 1, 16),
      bodyMaterial.clone()
    );
    body.position.set(0.8, 1, 0);
    this.hangmanParts.push(body);
    this.scene.add(body);

    // Left arm
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.7, 8),
      bodyMaterial.clone()
    );
    leftArm.position.set(0.4, 1.2, 0);
    leftArm.rotation.z = Math.PI / 3;
    this.hangmanParts.push(leftArm);
    this.scene.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.7, 8),
      bodyMaterial.clone()
    );
    rightArm.position.set(1.2, 1.2, 0);
    rightArm.rotation.z = -Math.PI / 3;
    this.hangmanParts.push(rightArm);
    this.scene.add(rightArm);

    // Left leg (thicker at top/thigh, thinner at bottom/ankle)
    const leftLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.05, 0.8, 8),
      bodyMaterial.clone()
    );
    leftLeg.position.set(0.55, 0.15, 0);
    leftLeg.rotation.set(Math.PI, 0, Math.PI / 6);
    this.hangmanParts.push(leftLeg);
    this.scene.add(leftLeg);

    // Right leg (thicker at top/thigh, thinner at bottom/ankle)
    const rightLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.05, 0.8, 8),
      bodyMaterial.clone()
    );
    rightLeg.position.set(1.05, 0.15, 0);
    rightLeg.rotation.set(Math.PI, 0, -Math.PI / 6);
    this.hangmanParts.push(rightLeg);
    this.scene.add(rightLeg);
  }

  showPart(index) {
    if (index >= 0 && index < this.hangmanParts.length) {
      const part = this.hangmanParts[index];
      this.animatePartIn(part);
    }
  }

  animatePartIn(part) {
    const duration = 300;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);

      part.material.opacity = eased;
      part.scale.set(eased, eased, eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  resetHangman() {
    this.hangmanParts.forEach(part => {
      part.material.opacity = 0;
      part.scale.set(0, 0, 0);
    });
  }

  shakeHangman() {
    const duration = 500;
    const startTime = performance.now();
    const amplitude = 0.1;

    const originalPositions = this.hangmanParts.map(p => p.position.x);

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const shake = Math.sin(progress * Math.PI * 8) * amplitude * (1 - progress);
        this.hangmanParts.forEach((part, i) => {
          part.position.x = originalPositions[i] + shake;
        });
        requestAnimationFrame(animate);
      } else {
        this.hangmanParts.forEach((part, i) => {
          part.position.x = originalPositions[i];
        });
      }
    };

    animate();
  }
}

// Confetti effect
const Confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  colors: ['#FFB347', '#757ce8', '#FF6B6B', '#4ECDC4', '#45B7D1', '#98D8C8', '#F7DC6F'],

  init() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  launch() {
    this.init();
    this.particles = [];

    // Create particles
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    this.animate();
  },

  animate() {
    if (!this.particles.length) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.rotation += p.rotationSpeed;
      p.vx *= 0.99; // air resistance

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation * Math.PI / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      return p.y < this.canvas.height + 20;
    });

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};

// Word list
const WORDS = [
  'JAVASCRIPT', 'PROGRAMMING', 'DEVELOPER', 'ALGORITHM', 'FUNCTION',
  'VARIABLE', 'COMPONENT', 'FRAMEWORK', 'DATABASE', 'INTERFACE',
  'TERMINAL', 'BROWSER', 'KEYBOARD', 'COMPUTER', 'SOFTWARE',
  'HARDWARE', 'NETWORK', 'SECURITY', 'DEBUGGING', 'COMPILER',
  'ABSTRACT', 'ADVENTURE', 'BEAUTIFUL', 'BRILLIANT', 'CHALLENGE',
  'CREATIVE', 'DISCOVER', 'ELEPHANT', 'FANTASTIC', 'GRATEFUL',
  'HANGMAN', 'INTERNET', 'JOURNEY', 'KNOWLEDGE', 'LANGUAGE',
  'MOUNTAIN', 'NAVIGATE', 'OBSERVER', 'PARADISE', 'QUESTION',
  'RAINBOW', 'SOLUTION', 'TOGETHER', 'UNIVERSE', 'VICTORY',
  'WONDERFUL', 'XENOLITH', 'YOURSELF', 'ZEPPELIN'
];

// Global record API functions
const HighScoreAPI = {
  baseUrl: '/api/highscores',

  async getRecord(game) {
    try {
      const response = await fetch(`${this.baseUrl}?game=${game}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (e) {
      console.error('Error fetching high score:', e);
      return { score: 0, holder_name: '' };
    }
  },

  async saveRecord(game, score, name) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, score, name })
      });
      if (!response.ok) throw new Error('Failed to save');
      return await response.json();
    } catch (e) {
      console.error('Error saving high score:', e);
      return { success: false };
    }
  }
};

// Game class
class Game {
  constructor() {
    this.dom = {
      ui: document.querySelector('.ui'),
      game: document.querySelector('.ui__game'),
      title: document.querySelector('.text--title'),
      note: document.querySelector('.text--note'),
      word: document.querySelector('.text--word'),
      message: document.querySelector('.text--message'),
      failed: document.querySelector('.text--failed'),
      keyboard: document.querySelector('.keyboard'),
      stats: document.querySelector('.ui__stats'),
      statsWins: document.querySelector('.stats[name="wins"] b'),
      statsLosses: document.querySelector('.stats[name="losses"] b'),
      statsStreak: document.querySelector('.stats[name="streak"] b'),
      btnStats: document.querySelector('.btn--stats'),
      btnRestart: document.querySelector('.btn--restart'),
      btnBack: document.querySelector('.btn--back'),
      globalRecordScore: document.getElementById('globalRecordScore'),
      globalRecordHolder: document.getElementById('globalRecordHolder'),
      newRecordModal: document.getElementById('newRecordModal'),
      newStreakValue: document.getElementById('newStreakValue'),
      playerNameInput: document.getElementById('playerNameInput'),
      saveRecordBtn: document.getElementById('saveRecordBtn')
    };

    this.state = 'idle';
    this.word = '';
    this.guessedLetters = [];
    this.wrongGuesses = 0;
    this.maxWrong = 6;

    this.globalRecord = { score: 0, holder_name: '' };
    this.pendingRecordStreak = 0;

    this.stats = this.loadStats();

    this.world = new World(this);
    this.createKeyboard();
    this.bindEvents();
    this.updateStats();
    this.loadGlobalRecord();
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('hangman-stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { wins: 0, losses: 0, streak: 0 };
  }

  saveStats() {
    try {
      localStorage.setItem('hangman-stats', JSON.stringify(this.stats));
    } catch (e) {}
  }

  updateStats() {
    this.dom.statsWins.textContent = this.stats.wins;
    this.dom.statsLosses.textContent = this.stats.losses;
    this.dom.statsStreak.textContent = this.stats.streak;
  }

  async loadGlobalRecord() {
    const record = await HighScoreAPI.getRecord('hangman');
    this.globalRecord = record;
    this.updateGlobalRecordDisplay();
  }

  updateGlobalRecordDisplay() {
    this.dom.globalRecordScore.textContent = this.globalRecord.score || 0;
    this.dom.globalRecordHolder.textContent = this.globalRecord.holder_name || '-';
  }

  showNewRecordModal(streak) {
    this.pendingRecordStreak = streak;
    this.dom.newStreakValue.textContent = streak;
    this.dom.playerNameInput.value = '';
    this.dom.newRecordModal.classList.add('show');
    this.dom.playerNameInput.focus();
  }

  hideNewRecordModal() {
    this.dom.newRecordModal.classList.remove('show');
    this.pendingRecordStreak = 0;
  }

  async saveNewRecord() {
    const name = this.dom.playerNameInput.value.trim();
    if (!name) {
      this.dom.playerNameInput.focus();
      return;
    }

    const result = await HighScoreAPI.saveRecord('hangman', this.pendingRecordStreak, name);
    if (result.success || result.isNewRecord) {
      this.globalRecord = { score: this.pendingRecordStreak, holder_name: result.holder_name || name };
      this.updateGlobalRecordDisplay();
    }
    this.hideNewRecordModal();
  }

  createKeyboard() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach(letter => {
      const key = document.createElement('button');
      key.className = 'key';
      key.textContent = letter;
      key.dataset.letter = letter;
      this.dom.keyboard.appendChild(key);
    });
  }

  bindEvents() {
    // Keyboard click
    this.dom.keyboard.addEventListener('click', (e) => {
      if (e.target.classList.contains('key') && this.state === 'playing') {
        const letter = e.target.dataset.letter;
        this.guessLetter(letter, e.target);
      }
    });

    // Physical keyboard
    document.addEventListener('keydown', (e) => {
      if (this.state === 'idle') {
        this.startGame();
        return;
      }

      if (this.state === 'playing') {
        const letter = e.key.toUpperCase();
        if (/^[A-Z]$/.test(letter)) {
          const keyBtn = this.dom.keyboard.querySelector(`[data-letter="${letter}"]`);
          if (keyBtn && !keyBtn.classList.contains('correct') && !keyBtn.classList.contains('wrong')) {
            this.guessLetter(letter, keyBtn);
          }
        }
      }
    });

    // Double tap/click to start
    let lastTap = 0;
    this.dom.ui.addEventListener('click', (e) => {
      if (e.target.closest('.btn') || e.target.closest('.key')) return;

      const now = Date.now();
      if (now - lastTap < 300 && this.state === 'idle') {
        this.startGame();
      }
      lastTap = now;
    });

    // Buttons
    this.dom.btnStats.addEventListener('click', () => this.showStats());
    this.dom.btnBack.addEventListener('click', () => this.hideStats());
    this.dom.btnRestart.addEventListener('click', () => this.restartGame());

    // New record modal
    this.dom.saveRecordBtn.addEventListener('click', () => this.saveNewRecord());
    this.dom.playerNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.saveNewRecord();
    });
  }

  startGame() {
    this.state = 'playing';
    this.dom.ui.classList.add('playing');
    this.dom.ui.classList.remove('gameover');

    this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
    this.guessedLetters = [];
    this.wrongGuesses = 0;

    this.world.resetHangman();
    this.resetKeyboard();
    this.updateWordDisplay();

    this.dom.message.className = 'text text--message';
    this.dom.message.textContent = '';
    this.dom.failed.innerHTML = '';
    this.dom.note.style.display = 'none';
  }

  restartGame() {
    if (this.state === 'gameover') {
      this.startGame();
    }
  }

  resetKeyboard() {
    const keys = this.dom.keyboard.querySelectorAll('.key');
    keys.forEach(key => {
      key.classList.remove('correct', 'wrong', 'disabled');
    });
  }

  guessLetter(letter, keyElement) {
    if (this.guessedLetters.includes(letter)) return;

    this.guessedLetters.push(letter);

    if (this.word.includes(letter)) {
      keyElement.classList.add('correct');
      this.updateWordDisplay();

      if (this.checkWin()) {
        this.endGame(true);
      }
    } else {
      keyElement.classList.add('wrong');
      this.wrongGuesses++;
      this.world.showPart(this.wrongGuesses - 1);
      this.updateFailedLetters();

      if (this.wrongGuesses >= this.maxWrong) {
        this.endGame(false);
      }
    }
  }

  updateWordDisplay() {
    let html = '';
    for (let char of this.word) {
      if (char === ' ') {
        html += '<span class="letter space"> </span>';
      } else if (this.guessedLetters.includes(char)) {
        html += `<span class="letter revealed">${char}</span>`;
      } else {
        html += '<span class="letter">_</span>';
      }
    }
    this.dom.word.innerHTML = html;
  }

  updateFailedLetters() {
    const failed = this.guessedLetters.filter(l => !this.word.includes(l));
    this.dom.failed.innerHTML = failed.map(l => `<span class="letter">${l}</span>`).join('');
  }

  checkWin() {
    return this.word.split('').every(char =>
      char === ' ' || this.guessedLetters.includes(char)
    );
  }

  endGame(won) {
    this.state = 'gameover';
    this.dom.ui.classList.add('gameover');

    if (won) {
      this.dom.message.textContent = 'YOU WIN!';
      this.dom.message.className = 'text text--message win';
      this.stats.wins++;
      this.stats.streak++;

      // Launch confetti!
      Confetti.launch();

      // Check for new global record (must be at least 1)
      if (this.stats.streak >= 1 && this.stats.streak > this.globalRecord.score) {
        setTimeout(() => this.showNewRecordModal(this.stats.streak), 500);
      }
    } else {
      this.dom.message.textContent = `GAME OVER! The word was: ${this.word}`;
      this.dom.message.className = 'text text--message lose';
      this.stats.losses++;
      this.stats.streak = 0;
      this.world.shakeHangman();

      // Reveal the word
      let html = '';
      for (let char of this.word) {
        if (char === ' ') {
          html += '<span class="letter space"> </span>';
        } else {
          const revealed = this.guessedLetters.includes(char);
          html += `<span class="letter revealed" style="color: ${revealed ? '#00ff88' : '#e94560'}">${char}</span>`;
        }
      }
      this.dom.word.innerHTML = html;
    }

    this.saveStats();
    this.updateStats();

    // Disable remaining keys
    const keys = this.dom.keyboard.querySelectorAll('.key:not(.correct):not(.wrong)');
    keys.forEach(key => key.classList.add('disabled'));
  }

  showStats() {
    this.dom.stats.classList.add('show');
  }

  hideStats() {
    this.dom.stats.classList.remove('show');
  }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
