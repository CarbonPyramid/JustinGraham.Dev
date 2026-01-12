// Animation Engine
const animationEngine = (() => {
  let uniqueID = 0;

  class Animation {
    constructor(duration, update, timing) {
      this.duration = duration;
      this.update = update;
      this.timing = timing;
      this.startTime = null;
      this.running = false;
      this.finished = false;
      this.id = uniqueID++;
    }
    start() {
      this.running = true;
      this.startTime = null;
    }
    stop() {
      this.running = false;
    }
    reset() {
      this.running = false;
      this.finished = false;
      this.startTime = null;
    }
  }

  const animations = new Map();

  const update = (time) => {
    for (const [id, anim] of animations) {
      if (!anim.running) continue;
      if (anim.startTime === null) anim.startTime = time;

      let elapsed = (time - anim.startTime) / anim.duration;

      if (elapsed >= 1) {
        elapsed = 1;
        anim.finished = true;
        anim.running = false;
      }

      const t = anim.timing ? anim.timing(elapsed) : elapsed;
      anim.update(t);
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);

  return {
    Animation,
    add: (anim) => {
      animations.set(anim.id, anim);
      return anim;
    },
    remove: (anim) => animations.delete(anim.id),
  };
})();

// Easing functions
const Ease = {
  linear: (t) => t,
  inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    else return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

// Tetromino shapes and colors
const TETROMINOES = {
  I: { shape: [[1,1,1,1]], color: 0x00CED1 },          // Cyan
  O: { shape: [[1,1],[1,1]], color: 0xFFB347 },        // Yellow/Orange (theme)
  T: { shape: [[0,1,0],[1,1,1]], color: 0x757ce8 },    // Purple (theme)
  S: { shape: [[0,1,1],[1,1,0]], color: 0x98FB98 },    // Light green
  Z: { shape: [[1,1,0],[0,1,1]], color: 0xFF6B6B },    // Light red
  J: { shape: [[1,0,0],[1,1,1]], color: 0x6495ED },    // Cornflower blue
  L: { shape: [[0,0,1],[1,1,1]], color: 0xDDA0DD },    // Plum
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 0.45;
const BLOCK_GAP = 0.05;

// World (Three.js setup)
class World {
  constructor() {
    this.container = document.querySelector('.ui__game');
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 18);
    this.camera.lookAt(0, 0, 0);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(5, 10, 7);
    this.scene.add(this.directionalLight);

    this.pointLight = new THREE.PointLight(0x757ce8, 0.5, 30);
    this.pointLight.position.set(-5, 5, 5);
    this.scene.add(this.pointLight);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
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

// Tetris Game
class TetrisGame {
  constructor() {
    this.world = new World();
    this.board = [];
    this.boardMeshes = [];
    this.currentPiece = null;
    this.currentPieceMeshes = [];
    this.nextPiece = null;
    this.nextPieceMeshes = [];
    this.ghostMeshes = [];

    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.dropInterval = 1000;
    this.lastDrop = 0;

    this.globalRecord = { score: 0, holder_name: '' };
    this.pendingRecordScore = 0;

    this.boardGroup = new THREE.Group();
    this.world.scene.add(this.boardGroup);

    // Center the board
    const offsetX = -(BOARD_WIDTH * (BLOCK_SIZE + BLOCK_GAP)) / 2 + BLOCK_SIZE / 2;
    const offsetY = -(BOARD_HEIGHT * (BLOCK_SIZE + BLOCK_GAP)) / 2 + BLOCK_SIZE / 2;
    this.boardGroup.position.set(offsetX, offsetY, 0);

    this.ui = {
      score: document.querySelector('.text--score span'),
      level: document.querySelector('.text--level span'),
      message: document.querySelector('.text--message'),
      stats: document.querySelector('.ui__stats'),
      highScore: document.querySelector('.stats[name="high-score"] b'),
      totalLines: document.querySelector('.stats[name="lines"] b'),
      games: document.querySelector('.stats[name="games"] b'),
      statsBtn: document.querySelector('.btn--stats'),
      restartBtn: document.querySelector('.btn--restart'),
      backBtn: document.querySelector('.btn--back'),
      nextPiece: document.querySelector('.next-piece'),
      globalRecordScore: document.getElementById('globalRecordScore'),
      globalRecordHolder: document.getElementById('globalRecordHolder'),
      newRecordModal: document.getElementById('newRecordModal'),
      newScoreValue: document.getElementById('newScoreValue'),
      playerNameInput: document.getElementById('playerNameInput'),
      saveRecordBtn: document.getElementById('saveRecordBtn'),
    };

    this.stats = this.loadStats();
    this.updateStatsDisplay();

    this.createBoard();
    this.createBoardBorder();
    this.initNextPieceRenderer();
    this.bindEvents();
    this.animate();
    this.loadGlobalRecord();
  }

  loadStats() {
    const saved = localStorage.getItem('tetris-stats');
    return saved ? JSON.parse(saved) : { highScore: 0, totalLines: 0, games: 0 };
  }

  saveStats() {
    localStorage.setItem('tetris-stats', JSON.stringify(this.stats));
  }

  updateStatsDisplay() {
    this.ui.highScore.textContent = this.stats.highScore;
    this.ui.totalLines.textContent = this.stats.totalLines;
    this.ui.games.textContent = this.stats.games;
  }

  async loadGlobalRecord() {
    const record = await HighScoreAPI.getRecord('tetris');
    this.globalRecord = record;
    this.updateGlobalRecordDisplay();
  }

  updateGlobalRecordDisplay() {
    this.ui.globalRecordScore.textContent = this.globalRecord.score || 0;
    this.ui.globalRecordHolder.textContent = this.globalRecord.holder_name || '-';
  }

  showNewRecordModal(score) {
    this.pendingRecordScore = score;
    this.ui.newScoreValue.textContent = score;
    this.ui.playerNameInput.value = '';
    this.ui.newRecordModal.classList.add('show');
    this.ui.playerNameInput.focus();
  }

  hideNewRecordModal() {
    this.ui.newRecordModal.classList.remove('show');
    this.pendingRecordScore = 0;
  }

  async saveNewRecord() {
    const name = this.ui.playerNameInput.value.trim();
    if (!name) {
      this.ui.playerNameInput.focus();
      return;
    }

    const result = await HighScoreAPI.saveRecord('tetris', this.pendingRecordScore, name);
    if (result.success || result.isNewRecord) {
      this.globalRecord = { score: this.pendingRecordScore, holder_name: result.holder_name || name };
      this.updateGlobalRecordDisplay();
    }
    this.hideNewRecordModal();
  }

  createBoard() {
    this.board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
  }

  createBoardBorder() {
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x757ce8,
      transparent: true,
      opacity: 0.3,
    });

    const width = BOARD_WIDTH * (BLOCK_SIZE + BLOCK_GAP);
    const height = BOARD_HEIGHT * (BLOCK_SIZE + BLOCK_GAP);
    const thickness = 0.1;

    // Left border
    const leftGeom = new THREE.BoxGeometry(thickness, height, BLOCK_SIZE);
    const leftMesh = new THREE.Mesh(leftGeom, borderMaterial);
    leftMesh.position.set(-BLOCK_SIZE/2 - thickness/2, height/2 - BLOCK_SIZE/2, 0);
    this.boardGroup.add(leftMesh);

    // Right border
    const rightMesh = new THREE.Mesh(leftGeom, borderMaterial);
    rightMesh.position.set(width - BLOCK_SIZE/2 + thickness/2, height/2 - BLOCK_SIZE/2, 0);
    this.boardGroup.add(rightMesh);

    // Bottom border
    const bottomGeom = new THREE.BoxGeometry(width + thickness * 2, thickness, BLOCK_SIZE);
    const bottomMesh = new THREE.Mesh(bottomGeom, borderMaterial);
    bottomMesh.position.set(width/2 - BLOCK_SIZE/2, -BLOCK_SIZE/2 - thickness/2, 0);
    this.boardGroup.add(bottomMesh);
  }

  createBlockMesh(color, ghost = false) {
    const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      transparent: ghost,
      opacity: ghost ? 0.3 : 1,
      metalness: 0.3,
      roughness: 0.6,
    });
    return new THREE.Mesh(geometry, material);
  }

  getRandomPiece() {
    const types = Object.keys(TETROMINOES);
    const type = types[Math.floor(Math.random() * types.length)];
    const tetromino = TETROMINOES[type];
    return {
      type,
      shape: tetromino.shape.map(row => [...row]),
      color: tetromino.color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: BOARD_HEIGHT - 1,
    };
  }

  spawnPiece() {
    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
      this.currentPiece.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
      this.currentPiece.y = BOARD_HEIGHT - 1;
    } else {
      this.currentPiece = this.getRandomPiece();
    }

    this.nextPiece = this.getRandomPiece();
    this.updateNextPieceDisplay();

    // Check if spawn position is valid
    if (!this.isValidPosition(this.currentPiece)) {
      this.endGame();
      return false;
    }

    this.updateCurrentPieceMeshes();
    this.updateGhostPiece();
    return true;
  }

  initNextPieceRenderer() {
    const container = document.querySelector('.next-piece');
    this.nextScene = new THREE.Scene();
    this.nextRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.nextRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.nextRenderer.setClearColor(0x000000, 0);
    this.nextRenderer.setSize(76, 76); // Slightly smaller to fit within border
    this.nextRenderer.domElement.style.borderRadius = '6px';
    container.appendChild(this.nextRenderer.domElement);

    this.nextCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.nextCamera.position.set(0, 0, 3);
    this.nextCamera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.nextScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(2, 4, 3);
    this.nextScene.add(directionalLight);
  }

  updateNextPieceDisplay() {
    // Clear previous meshes
    this.nextPieceMeshes.forEach(mesh => {
      this.nextScene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.nextPieceMeshes = [];

    if (!this.nextPiece) return;

    const shape = this.nextPiece.shape;
    const pieceWidth = shape[0].length;
    const pieceHeight = shape.length;

    const blockSize = 0.4;
    const gap = 0.05;

    for (let row = 0; row < pieceHeight; row++) {
      for (let col = 0; col < pieceWidth; col++) {
        if (shape[row][col]) {
          const mesh = this.createBlockMesh(this.nextPiece.color);
          mesh.scale.setScalar(blockSize / BLOCK_SIZE);
          mesh.position.set(
            (col - pieceWidth / 2 + 0.5) * (blockSize + gap),
            (pieceHeight / 2 - 0.5 - row) * (blockSize + gap),
            0
          );
          this.nextScene.add(mesh);
          this.nextPieceMeshes.push(mesh);
        }
      }
    }

    this.nextRenderer.render(this.nextScene, this.nextCamera);
  }

  updateCurrentPieceMeshes() {
    // Clear previous meshes
    this.currentPieceMeshes.forEach(mesh => {
      this.boardGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.currentPieceMeshes = [];

    if (!this.currentPiece) return;

    const { shape, color, x, y } = this.currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const mesh = this.createBlockMesh(color);
          const posY = y - row;
          const posX = x + col;
          mesh.position.set(
            posX * (BLOCK_SIZE + BLOCK_GAP),
            posY * (BLOCK_SIZE + BLOCK_GAP),
            0
          );
          this.boardGroup.add(mesh);
          this.currentPieceMeshes.push(mesh);
        }
      }
    }
  }

  updateGhostPiece() {
    // Clear previous ghost meshes
    this.ghostMeshes.forEach(mesh => {
      this.boardGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.ghostMeshes = [];

    if (!this.currentPiece) return;

    // Find drop position
    const ghostPiece = { ...this.currentPiece };
    while (this.isValidPosition({ ...ghostPiece, y: ghostPiece.y - 1 })) {
      ghostPiece.y--;
    }

    if (ghostPiece.y === this.currentPiece.y) return;

    const { shape, color, x, y } = ghostPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const mesh = this.createBlockMesh(color, true);
          const posY = y - row;
          const posX = x + col;
          mesh.position.set(
            posX * (BLOCK_SIZE + BLOCK_GAP),
            posY * (BLOCK_SIZE + BLOCK_GAP),
            0
          );
          this.boardGroup.add(mesh);
          this.ghostMeshes.push(mesh);
        }
      }
    }
  }

  updateBoardMeshes() {
    // Clear previous board meshes
    this.boardMeshes.forEach(mesh => {
      this.boardGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.boardMeshes = [];

    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (this.board[row][col]) {
          const mesh = this.createBlockMesh(this.board[row][col]);
          mesh.position.set(
            col * (BLOCK_SIZE + BLOCK_GAP),
            row * (BLOCK_SIZE + BLOCK_GAP),
            0
          );
          this.boardGroup.add(mesh);
          this.boardMeshes.push(mesh);
        }
      }
    }
  }

  isValidPosition(piece) {
    const { shape, x, y } = piece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const posX = x + col;
          const posY = y - row;

          if (posX < 0 || posX >= BOARD_WIDTH || posY < 0) {
            return false;
          }

          if (posY < BOARD_HEIGHT && this.board[posY][posX]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  movePiece(dx, dy) {
    if (!this.currentPiece || this.gameOver) return false;

    const newPiece = {
      ...this.currentPiece,
      x: this.currentPiece.x + dx,
      y: this.currentPiece.y + dy,
    };

    if (this.isValidPosition(newPiece)) {
      this.currentPiece = newPiece;
      this.updateCurrentPieceMeshes();
      this.updateGhostPiece();
      return true;
    }
    return false;
  }

  rotatePiece() {
    if (!this.currentPiece || this.gameOver) return false;

    const shape = this.currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;

    // Rotate 90 degrees clockwise
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[col][rows - 1 - row] = shape[row][col];
      }
    }

    const newPiece = {
      ...this.currentPiece,
      shape: rotated,
    };

    // Wall kick - try positions if rotation puts piece out of bounds
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      const testPiece = { ...newPiece, x: newPiece.x + kick };
      if (this.isValidPosition(testPiece)) {
        this.currentPiece = testPiece;
        this.updateCurrentPieceMeshes();
        this.updateGhostPiece();
        return true;
      }
    }
    return false;
  }

  dropPiece() {
    if (!this.movePiece(0, -1)) {
      this.lockPiece();
    }
  }

  hardDrop() {
    if (!this.currentPiece || this.gameOver) return;

    let dropDistance = 0;
    while (this.movePiece(0, -1)) {
      dropDistance++;
    }
    this.score += dropDistance * 2;
    this.updateScore();
    this.lockPiece();
  }

  lockPiece() {
    if (!this.currentPiece) return;

    const { shape, color, x, y } = this.currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const posY = y - row;
          const posX = x + col;
          if (posY >= 0 && posY < BOARD_HEIGHT) {
            this.board[posY][posX] = color;
          }
        }
      }
    }

    this.clearLines();
    this.updateBoardMeshes();

    if (!this.spawnPiece()) {
      return;
    }
  }

  clearLines() {
    let linesCleared = 0;

    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== 0)) {
        this.board.splice(row, 1);
        this.board.push(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        row++; // Check same row again
      }
    }

    if (linesCleared > 0) {
      this.linesCleared += linesCleared;
      this.stats.totalLines += linesCleared;

      // Scoring: 100, 300, 500, 800 for 1, 2, 3, 4 lines
      const lineScores = [0, 100, 300, 500, 800];
      this.score += lineScores[linesCleared] * this.level;

      // Level up every 10 lines
      const newLevel = Math.floor(this.linesCleared / 10) + 1;
      if (newLevel > this.level) {
        this.level = newLevel;
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        this.ui.level.textContent = this.level;
      }

      this.updateScore();
      this.saveStats();
    }
  }

  updateScore() {
    this.ui.score.textContent = this.score;

    if (this.score > this.stats.highScore) {
      this.stats.highScore = this.score;
      this.updateStatsDisplay();
      this.saveStats();
    }
  }

  startGame() {
    if (this.gameStarted) return;

    this.gameStarted = true;
    this.gameOver = false;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.dropInterval = 1000;

    this.ui.score.textContent = '0';
    this.ui.level.textContent = '1';
    this.ui.message.textContent = '';
    this.ui.message.classList.remove('gameover');

    this.createBoard();
    this.updateBoardMeshes();
    this.spawnPiece();

    this.stats.games++;
    this.saveStats();
    this.updateStatsDisplay();

    this.lastDrop = performance.now();
  }

  endGame() {
    this.gameOver = true;
    this.gameStarted = false;
    this.ui.message.textContent = 'Game Over! Press any key to restart';
    this.ui.message.classList.add('gameover');

    // Check for new global record (must be at least 1)
    if (this.score >= 1 && this.score > this.globalRecord.score) {
      setTimeout(() => this.showNewRecordModal(this.score), 500);
    }
  }

  restart() {
    // Clear all meshes
    this.currentPieceMeshes.forEach(mesh => {
      this.boardGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.currentPieceMeshes = [];

    this.ghostMeshes.forEach(mesh => {
      this.boardGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.ghostMeshes = [];

    this.boardMeshes.forEach(mesh => {
      this.boardGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.boardMeshes = [];

    this.nextPieceMeshes.forEach(mesh => {
      this.world.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.nextPieceMeshes = [];

    this.currentPiece = null;
    this.nextPiece = null;
    this.gameStarted = false;
    this.gameOver = false;

    this.createBoard();
    this.ui.message.textContent = 'Press any arrow key to start!';
    this.ui.message.classList.remove('gameover');
    this.ui.score.textContent = '0';
    this.ui.level.textContent = '1';
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!this.gameStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          this.startGame();
        }
        return;
      }

      if (this.gameOver) {
        this.restart();
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          this.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.movePiece(1, 0);
          break;
        case 'ArrowDown':
          this.dropPiece();
          this.score++;
          this.updateScore();
          break;
        case 'ArrowUp':
          this.rotatePiece();
          break;
        case ' ':
          this.hardDrop();
          break;
      }
    });

    // Touch controls
    document.querySelectorAll('.control-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;

        if (!this.gameStarted) {
          this.startGame();
          return;
        }

        if (this.gameOver) {
          this.restart();
          return;
        }

        switch (action) {
          case 'left':
            this.movePiece(-1, 0);
            break;
          case 'right':
            this.movePiece(1, 0);
            break;
          case 'down':
            this.dropPiece();
            this.score++;
            this.updateScore();
            break;
          case 'rotate':
            this.rotatePiece();
            break;
          case 'drop':
            this.hardDrop();
            break;
        }
      });
    });

    // UI buttons
    this.ui.statsBtn.addEventListener('click', () => {
      this.ui.stats.classList.add('show');
    });

    this.ui.backBtn.addEventListener('click', () => {
      this.ui.stats.classList.remove('show');
    });

    this.ui.restartBtn.addEventListener('click', () => {
      this.restart();
    });

    // New record modal
    this.ui.saveRecordBtn.addEventListener('click', () => this.saveNewRecord());
    this.ui.playerNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.saveNewRecord();
    });

    // Touch swipe controls
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('.ui__buttons') || e.target.closest('.ui__controls') || e.target.closest('.ui__stats')) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (e.target.closest('.ui__buttons') || e.target.closest('.ui__controls') || e.target.closest('.ui__stats')) {
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchDuration = Date.now() - touchStartTime;

      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      const minSwipe = 30;

      // Quick tap to rotate
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && touchDuration < 200) {
        if (!this.gameStarted) {
          this.startGame();
        } else if (this.gameOver) {
          this.restart();
        } else {
          this.rotatePiece();
        }
        return;
      }

      if (!this.gameStarted || this.gameOver) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > minSwipe) {
          this.movePiece(1, 0);
        } else if (dx < -minSwipe) {
          this.movePiece(-1, 0);
        }
      } else {
        if (dy > minSwipe) {
          this.hardDrop();
        } else if (dy < -minSwipe) {
          this.rotatePiece();
        }
      }
    }, { passive: true });
  }

  animate() {
    const loop = (time) => {
      requestAnimationFrame(loop);

      if (this.gameStarted && !this.gameOver) {
        if (time - this.lastDrop > this.dropInterval) {
          this.dropPiece();
          this.lastDrop = time;
        }
      }

      // Subtle rotation animation for the board
      this.boardGroup.rotation.y = Math.sin(time * 0.0005) * 0.05;
      this.boardGroup.rotation.x = Math.sin(time * 0.0003) * 0.02;

      this.world.render();
    };
    loop(0);
  }
}

// Initialize game
const game = new TetrisGame();
