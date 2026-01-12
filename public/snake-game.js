// Snake 3D Game - Using Three.js
// Based on the same engine pattern as The Cube

const GRID_SIZE = 20;
const CELL_SIZE = 0.4;
const GAME_SPEED = 120;

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

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);

    this.snakeMeshes = [];
    this.foodMesh = null;

    this.createLights();
    this.createBoard();

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

    // Top-down view
    const boardSize = GRID_SIZE * CELL_SIZE;
    this.camera.position.set(0, boardSize * 1.2, boardSize * 0.3);
    this.camera.lookAt(0, 0, 0);

    if (this.onResize) this.onResize.forEach(cb => cb());
  }

  createLights() {
    this.lights = {
      holder: new THREE.Object3D(),
      ambient: new THREE.AmbientLight(0xffffff, 0.7),
      front: new THREE.DirectionalLight(0xffffff, 0.5),
    };

    this.lights.front.position.set(5, 10, 5);

    this.lights.holder.add(this.lights.ambient);
    this.lights.holder.add(this.lights.front);

    this.scene.add(this.lights.holder);
  }

  createBoard() {
    const boardSize = GRID_SIZE * CELL_SIZE;

    // Board base
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x5D4E6D,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.3
    });

    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(boardSize, boardSize),
      boardMaterial
    );
    board.rotation.x = -Math.PI / 2;
    board.position.y = -0.05;
    this.scene.add(board);

    // Grid lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x757ce8,
      transparent: true,
      opacity: 0.2
    });

    const halfSize = boardSize / 2;

    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = -halfSize + i * CELL_SIZE;

      // Horizontal lines
      const hGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-halfSize, 0, pos),
        new THREE.Vector3(halfSize, 0, pos)
      ]);
      this.scene.add(new THREE.Line(hGeom, lineMaterial));

      // Vertical lines
      const vGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pos, 0, -halfSize),
        new THREE.Vector3(pos, 0, halfSize)
      ]);
      this.scene.add(new THREE.Line(vGeom, lineMaterial));
    }

    // Border
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x757ce8,
      roughness: 0.5,
      metalness: 0.2
    });

    const borderWidth = 0.1;
    const borderHeight = 0.15;

    // Top border
    const topBorder = new THREE.Mesh(
      new THREE.BoxGeometry(boardSize + borderWidth * 2, borderHeight, borderWidth),
      borderMaterial
    );
    topBorder.position.set(0, borderHeight / 2, -halfSize - borderWidth / 2);
    this.scene.add(topBorder);

    // Bottom border
    const bottomBorder = new THREE.Mesh(
      new THREE.BoxGeometry(boardSize + borderWidth * 2, borderHeight, borderWidth),
      borderMaterial
    );
    bottomBorder.position.set(0, borderHeight / 2, halfSize + borderWidth / 2);
    this.scene.add(bottomBorder);

    // Left border
    const leftBorder = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, borderHeight, boardSize),
      borderMaterial
    );
    leftBorder.position.set(-halfSize - borderWidth / 2, borderHeight / 2, 0);
    this.scene.add(leftBorder);

    // Right border
    const rightBorder = new THREE.Mesh(
      new THREE.BoxGeometry(borderWidth, borderHeight, boardSize),
      borderMaterial
    );
    rightBorder.position.set(halfSize + borderWidth / 2, borderHeight / 2, 0);
    this.scene.add(rightBorder);
  }

  gridToWorld(x, y) {
    const halfSize = (GRID_SIZE * CELL_SIZE) / 2;
    return {
      x: -halfSize + x * CELL_SIZE + CELL_SIZE / 2,
      z: -halfSize + y * CELL_SIZE + CELL_SIZE / 2
    };
  }

  updateSnake(snake) {
    // Remove old meshes
    this.snakeMeshes.forEach(m => this.scene.remove(m));
    this.snakeMeshes = [];

    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFB347,
      roughness: 0.4,
      metalness: 0.3
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x757ce8,
      roughness: 0.4,
      metalness: 0.3
    });

    snake.forEach((segment, i) => {
      const { x, z } = this.gridToWorld(segment.x, segment.y);
      const isHead = i === 0;

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(CELL_SIZE * 0.4, 16, 16),
        isHead ? headMaterial : bodyMaterial
      );
      mesh.position.set(x, CELL_SIZE * 0.4, z);

      // Head is slightly larger
      if (isHead) {
        mesh.scale.set(1.2, 1.2, 1.2);
      }

      this.snakeMeshes.push(mesh);
      this.scene.add(mesh);
    });
  }

  updateFood(food) {
    if (this.foodMesh) {
      this.scene.remove(this.foodMesh);
    }

    const { x, z } = this.gridToWorld(food.x, food.y);

    const foodMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF6B6B,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0xFF6B6B,
      emissiveIntensity: 0.2
    });

    this.foodMesh = new THREE.Mesh(
      new THREE.SphereGeometry(CELL_SIZE * 0.35, 16, 16),
      foodMaterial
    );
    this.foodMesh.position.set(x, CELL_SIZE * 0.35, z);
    this.scene.add(this.foodMesh);

    // Animate food
    this.animateFood();
  }

  animateFood() {
    if (!this.foodMesh) return;

    const startY = CELL_SIZE * 0.35;
    const animate = () => {
      if (!this.foodMesh) return;

      const time = performance.now() * 0.003;
      this.foodMesh.position.y = startY + Math.sin(time) * 0.05;
      this.foodMesh.rotation.y = time;

      requestAnimationFrame(animate);
    };
    animate();
  }

  shakeCamera() {
    const originalPos = this.camera.position.clone();
    const duration = 300;
    const startTime = performance.now();
    const amplitude = 0.2;

    const shake = () => {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const shakeAmount = Math.sin(progress * Math.PI * 6) * amplitude * (1 - progress);
        this.camera.position.x = originalPos.x + shakeAmount;
        requestAnimationFrame(shake);
      } else {
        this.camera.position.copy(originalPos);
      }
    };

    shake();
  }

  reset() {
    this.snakeMeshes.forEach(m => this.scene.remove(m));
    this.snakeMeshes = [];
    if (this.foodMesh) {
      this.scene.remove(this.foodMesh);
      this.foodMesh = null;
    }
  }
}

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
      score: document.querySelector('.text--score span'),
      message: document.querySelector('.text--message'),
      stats: document.querySelector('.ui__stats'),
      statsHighScore: document.querySelector('.stats[name="high-score"] b'),
      statsGames: document.querySelector('.stats[name="games"] b'),
      btnStats: document.querySelector('.btn--stats'),
      btnRestart: document.querySelector('.btn--restart'),
      btnBack: document.querySelector('.btn--back'),
      controls: document.querySelector('.ui__controls'),
      globalRecordScore: document.getElementById('globalRecordScore'),
      globalRecordHolder: document.getElementById('globalRecordHolder'),
      newRecordModal: document.getElementById('newRecordModal'),
      newScoreValue: document.getElementById('newScoreValue'),
      playerNameInput: document.getElementById('playerNameInput'),
      saveRecordBtn: document.getElementById('saveRecordBtn')
    };

    this.state = 'idle';
    this.snake = [];
    this.food = { x: 0, y: 0 };
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameLoop = null;

    this.globalRecord = { score: 0, holder_name: '' };
    this.pendingRecordScore = 0;

    this.stats = this.loadStats();

    this.world = new World(this);
    this.bindEvents();
    this.updateStats();
    this.initGame();
    this.loadGlobalRecord();
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('snake-stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { highScore: 0, games: 0 };
  }

  saveStats() {
    try {
      localStorage.setItem('snake-stats', JSON.stringify(this.stats));
    } catch (e) {}
  }

  updateStats() {
    this.dom.statsHighScore.textContent = this.stats.highScore;
    this.dom.statsGames.textContent = this.stats.games;
  }

  async loadGlobalRecord() {
    const record = await HighScoreAPI.getRecord('snake');
    this.globalRecord = record;
    this.updateGlobalRecordDisplay();
  }

  updateGlobalRecordDisplay() {
    this.dom.globalRecordScore.textContent = this.globalRecord.score || 0;
    this.dom.globalRecordHolder.textContent = this.globalRecord.holder_name || '-';
  }

  showNewRecordModal(score) {
    this.pendingRecordScore = score;
    this.dom.newScoreValue.textContent = score;
    this.dom.playerNameInput.value = '';
    this.dom.newRecordModal.classList.add('show');
    this.dom.playerNameInput.focus();
  }

  hideNewRecordModal() {
    this.dom.newRecordModal.classList.remove('show');
    this.pendingRecordScore = 0;
  }

  async saveNewRecord() {
    const name = this.dom.playerNameInput.value.trim();
    if (!name) {
      this.dom.playerNameInput.focus();
      return;
    }

    const result = await HighScoreAPI.saveRecord('snake', this.pendingRecordScore, name);
    if (result.success || result.isNewRecord) {
      this.globalRecord = { score: this.pendingRecordScore, holder_name: result.holder_name || name };
      this.updateGlobalRecordDisplay();
    }
    this.hideNewRecordModal();
  }

  bindEvents() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if ([37, 38, 39, 40].includes(e.which)) {
        e.preventDefault();

        if (this.state === 'idle') {
          this.startGame();
        }

        const keyMap = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
        const opposites = { left: 'right', right: 'left', up: 'down', down: 'up' };
        const newDir = keyMap[e.which];

        if (newDir && opposites[newDir] !== this.direction) {
          this.nextDirection = newDir;
        }
      }
    });

    // Touch controls
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        if (this.state === 'idle') {
          this.startGame();
        }

        const opposites = { left: 'right', right: 'left', up: 'down', down: 'up' };
        if (opposites[dir] !== this.direction) {
          this.nextDirection = dir;
        }
      });
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

    // Swipe controls
    let touchStartX = 0;
    let touchStartY = 0;

    this.dom.game.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    this.dom.game.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 30 && this.direction !== 'left') this.nextDirection = 'right';
        else if (dx < -30 && this.direction !== 'right') this.nextDirection = 'left';
      } else {
        // Vertical swipe
        if (dy > 30 && this.direction !== 'up') this.nextDirection = 'down';
        else if (dy < -30 && this.direction !== 'down') this.nextDirection = 'up';
      }

      if (this.state === 'idle') {
        this.startGame();
      }
    });
  }

  initGame() {
    // Initialize snake
    this.snake = [];
    for (let i = 3; i >= 0; i--) {
      this.snake.push({ x: i, y: Math.floor(GRID_SIZE / 2) });
    }

    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.dom.score.textContent = '0';

    this.spawnFood();

    this.world.updateSnake(this.snake);
    this.world.updateFood(this.food);
  }

  spawnFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
    } while (this.snake.some(s => s.x === x && s.y === y));

    this.food = { x, y };
  }

  startGame() {
    this.state = 'playing';
    this.dom.message.textContent = '';
    this.dom.message.classList.remove('gameover');

    this.gameLoop = setInterval(() => this.tick(), GAME_SPEED);
  }

  tick() {
    if (this.state !== 'playing') return;

    this.direction = this.nextDirection;

    // Calculate new head position
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case 'right': head.x++; break;
      case 'left': head.x--; break;
      case 'up': head.y--; break;
      case 'down': head.y++; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      this.gameOver();
      return;
    }

    // Check self collision
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this.gameOver();
      return;
    }

    // Add new head
    this.snake.unshift(head);

    // Check food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.dom.score.textContent = this.score;
      this.spawnFood();
      this.world.updateFood(this.food);
    } else {
      this.snake.pop();
    }

    this.world.updateSnake(this.snake);
  }

  gameOver() {
    this.state = 'gameover';
    clearInterval(this.gameLoop);
    this.gameLoop = null;

    this.dom.message.textContent = `Game Over! Score: ${this.score}`;
    this.dom.message.classList.add('gameover');

    this.world.shakeCamera();

    // Update stats
    this.stats.games++;
    if (this.score > this.stats.highScore) {
      this.stats.highScore = this.score;
    }
    this.saveStats();
    this.updateStats();

    // Check for new global record (must be at least 1)
    if (this.score >= 1 && this.score > this.globalRecord.score) {
      setTimeout(() => this.showNewRecordModal(this.score), 500);
    }
  }

  restartGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }

    this.state = 'idle';
    this.world.reset();
    this.initGame();
    this.dom.message.textContent = 'Press any arrow key to start!';
    this.dom.message.classList.remove('gameover');
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
