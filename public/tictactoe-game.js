// Tic Tac Toe 3D Game - Using Three.js
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

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.cells = [];
    this.pieces = [];

    this.createLights();
    this.createBoard();

    this.onResize = [];
    this.resize();
    window.addEventListener('resize', () => this.resize(), false);

    // Mouse interaction
    this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  update() {
    // Gentle rotation
    this.scene.rotation.y += 0.001;
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.camera.position.set(0, 4, 6);
    this.camera.lookAt(0, 0, 0);

    if (this.onResize) this.onResize.forEach(cb => cb());
  }

  createLights() {
    this.lights = {
      holder: new THREE.Object3D(),
      ambient: new THREE.AmbientLight(0xffffff, 0.7),
      front: new THREE.DirectionalLight(0xffffff, 0.5),
      back: new THREE.DirectionalLight(0xffffff, 0.3),
    };

    this.lights.front.position.set(3, 5, 3);
    this.lights.back.position.set(-3, -5, -3);

    this.lights.holder.add(this.lights.ambient);
    this.lights.holder.add(this.lights.front);
    this.lights.holder.add(this.lights.back);

    this.scene.add(this.lights.holder);
  }

  createBoard() {
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x8E62AC,
      roughness: 0.3,
      metalness: 0.2
    });

    // Create grid lines
    const lineWidth = 0.08;
    const lineLength = 3.2;
    const offset = 0.53;

    // Vertical lines
    for (let i = -1; i <= 1; i += 2) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(lineWidth, 0.1, lineLength),
        boardMaterial
      );
      line.position.set(i * offset, 0, 0);
      this.scene.add(line);
    }

    // Horizontal lines
    for (let i = -1; i <= 1; i += 2) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(lineLength, 0.1, lineWidth),
        boardMaterial
      );
      line.position.set(0, 0, i * offset);
      this.scene.add(line);
    }

    // Create invisible cells for click detection
    const cellSize = 1;
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        const cell = new THREE.Mesh(
          new THREE.PlaneGeometry(cellSize, cellSize),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        cell.rotation.x = -Math.PI / 2;
        cell.position.set((x - 1) * 1.06, 0.05, (z - 1) * 1.06);
        cell.userData = { x, z };
        this.cells.push(cell);
        this.scene.add(cell);
      }
    }
  }

  onClick(event) {
    if (this.game.state !== 'playing' || this.game.currentPlayer !== 1) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cells);

    if (intersects.length > 0) {
      const cell = intersects[0].object;
      const { x, z } = cell.userData;
      this.game.makeMove(x, z);
    }
  }

  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Change cursor based on hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cells);

    if (intersects.length > 0 && this.game.state === 'playing' && this.game.currentPlayer === 1) {
      const { x, z } = intersects[0].object.userData;
      if (this.game.board[x][z] === 0) {
        this.renderer.domElement.style.cursor = 'pointer';
        return;
      }
    }
    this.renderer.domElement.style.cursor = 'default';
  }

  addPiece(x, z, player) {
    const group = new THREE.Group();
    group.position.set((x - 1) * 1.06, 0.15, (z - 1) * 1.06);

    if (player === 1) {
      // X piece - two crossed bars
      const material = new THREE.MeshStandardMaterial({
        color: 0xFFB347,
        roughness: 0.4,
        metalness: 0.3
      });

      const bar1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.15, 0.12),
        material
      );
      bar1.rotation.y = Math.PI / 4;
      group.add(bar1);

      const bar2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.15, 0.12),
        material
      );
      bar2.rotation.y = -Math.PI / 4;
      group.add(bar2);
    } else {
      // O piece - torus
      const material = new THREE.MeshStandardMaterial({
        color: 0xcda1eb,
        roughness: 0.4,
        metalness: 0.3
      });

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.08, 16, 32),
        material
      );
      torus.rotation.x = Math.PI / 2;
      group.add(torus);
    }

    // Animate piece appearing
    group.scale.set(0, 0, 0);
    this.animatePieceIn(group);

    this.pieces.push(group);
    this.scene.add(group);
  }

  animatePieceIn(piece) {
    const duration = 300;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      piece.scale.set(eased, eased, eased);
      piece.position.y = 0.15 + (1 - eased) * 0.5;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  highlightWin(line) {
    // Flash winning pieces
    const indices = line;
    let flashCount = 0;
    const maxFlash = 6;

    const flash = () => {
      flashCount++;
      indices.forEach(([x, z]) => {
        const piece = this.pieces.find(p =>
          Math.abs(p.position.x - (x - 1) * 1.06) < 0.1 &&
          Math.abs(p.position.z - (z - 1) * 1.06) < 0.1
        );
        if (piece) {
          piece.visible = flashCount % 2 === 0;
        }
      });

      if (flashCount < maxFlash) {
        setTimeout(flash, 200);
      } else {
        indices.forEach(([x, z]) => {
          const piece = this.pieces.find(p =>
            Math.abs(p.position.x - (x - 1) * 1.06) < 0.1 &&
            Math.abs(p.position.z - (z - 1) * 1.06) < 0.1
          );
          if (piece) piece.visible = true;
        });
      }
    };

    flash();
  }

  reset() {
    this.pieces.forEach(p => this.scene.remove(p));
    this.pieces = [];
  }
}

// AI Logic - Minimax algorithm
class TicTacToeAI {
  static CORNERS = [[0, 0], [2, 0], [0, 2], [2, 2]];
  static MAX_DEPTH = 9;

  static getOpenSpaces(board) {
    const spaces = [];
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        if (board[x][z] === 0) spaces.push([x, z]);
      }
    }
    return spaces;
  }

  static checkWinner(board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return { winner: board[i][0], line: [[i, 0], [i, 1], [i, 2]] };
      }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return { winner: board[0][i], line: [[0, i], [1, i], [2, i]] };
      }
    }
    // Check diagonals
    if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return { winner: board[0][0], line: [[0, 0], [1, 1], [2, 2]] };
    }
    if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return { winner: board[0][2], line: [[0, 2], [1, 1], [2, 0]] };
    }
    // Check draw
    if (this.getOpenSpaces(board).length === 0) {
      return { winner: -1, line: null };
    }
    return { winner: 0, line: null };
  }

  static cloneBoard(board) {
    return board.map(row => [...row]);
  }

  static score(winner, depth) {
    if (winner === 0) return 0;
    return depth + (winner === 1 ? this.MAX_DEPTH : -this.MAX_DEPTH);
  }

  static minimax(board, player, depth = 0) {
    if (depth >= this.MAX_DEPTH) return { score: 0 };

    const { winner } = this.checkWinner(board);
    if (winner !== 0) return { score: this.score(winner, depth) };

    const moves = [];
    const scores = [];

    this.getOpenSpaces(board).forEach(([x, z]) => {
      const newBoard = this.cloneBoard(board);
      newBoard[x][z] = player;
      const { score } = this.minimax(newBoard, player === 1 ? 2 : 1, depth + 1);
      moves.push([x, z]);
      scores.push(score);
    });

    const index = scores.indexOf(
      Math[player === 1 ? 'max' : 'min'].apply(Math, scores)
    );

    return { move: moves[index], score: scores[index] };
  }

  static getBestMove(board) {
    const openSpaces = this.getOpenSpaces(board);

    // Opening move optimization
    if (openSpaces.length === 8) {
      // Play center or random corner
      return board[1][1] === 0 ? [1, 1] : this.CORNERS[Math.floor(Math.random() * 4)];
    }

    return this.minimax(board, 2).move;
  }
}

// Game class
class Game {
  constructor() {
    this.dom = {
      ui: document.querySelector('.ui'),
      game: document.querySelector('.ui__game'),
      message: document.querySelector('.text--message'),
      turn: document.querySelector('.text--turn'),
      stats: document.querySelector('.ui__stats'),
      statsWins: document.querySelector('.stats[name="wins"] b'),
      statsLosses: document.querySelector('.stats[name="losses"] b'),
      statsDraws: document.querySelector('.stats[name="draws"] b'),
      btnStats: document.querySelector('.btn--stats'),
      btnRestart: document.querySelector('.btn--restart'),
      btnBack: document.querySelector('.btn--back')
    };

    this.state = 'playing';
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.currentPlayer = 1; // 1 = human (X), 2 = AI (O)

    this.stats = this.loadStats();

    this.world = new World(this);
    this.bindEvents();
    this.updateStats();
    this.updateTurn();
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('tictactoe-stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { wins: 0, losses: 0, draws: 0 };
  }

  saveStats() {
    try {
      localStorage.setItem('tictactoe-stats', JSON.stringify(this.stats));
    } catch (e) {}
  }

  updateStats() {
    this.dom.statsWins.textContent = this.stats.wins;
    this.dom.statsLosses.textContent = this.stats.losses;
    this.dom.statsDraws.textContent = this.stats.draws;
  }

  updateTurn() {
    if (this.state !== 'playing') {
      this.dom.turn.style.display = 'none';
      return;
    }
    this.dom.turn.style.display = 'block';
    if (this.currentPlayer === 1) {
      this.dom.turn.textContent = 'Your turn (X)';
      this.dom.turn.classList.remove('thinking');
    } else {
      this.dom.turn.textContent = 'AI thinking...';
      this.dom.turn.classList.add('thinking');
    }
  }

  bindEvents() {
    this.dom.btnStats.addEventListener('click', () => this.showStats());
    this.dom.btnBack.addEventListener('click', () => this.hideStats());
    this.dom.btnRestart.addEventListener('click', () => this.resetGame());
  }

  makeMove(x, z) {
    if (this.state !== 'playing') return;
    if (this.board[x][z] !== 0) return;
    if (this.currentPlayer !== 1) return;

    this.board[x][z] = 1;
    this.world.addPiece(x, z, 1);

    const result = TicTacToeAI.checkWinner(this.board);
    if (result.winner !== 0) {
      this.endGame(result);
      return;
    }

    this.currentPlayer = 2;
    this.updateTurn();

    // AI move after delay
    setTimeout(() => this.aiMove(), 500);
  }

  aiMove() {
    if (this.state !== 'playing') return;

    const move = TicTacToeAI.getBestMove(this.board);
    if (!move) return;

    const [x, z] = move;
    this.board[x][z] = 2;
    this.world.addPiece(x, z, 2);

    const result = TicTacToeAI.checkWinner(this.board);
    if (result.winner !== 0) {
      this.endGame(result);
      return;
    }

    this.currentPlayer = 1;
    this.updateTurn();
  }

  endGame(result) {
    this.state = 'gameover';

    if (result.winner === 1) {
      this.dom.message.textContent = 'You Win!';
      this.dom.message.className = 'text text--message win';
      this.stats.wins++;
      if (result.line) this.world.highlightWin(result.line);
    } else if (result.winner === 2) {
      this.dom.message.textContent = 'AI Wins!';
      this.dom.message.className = 'text text--message lose';
      this.stats.losses++;
      if (result.line) this.world.highlightWin(result.line);
    } else {
      this.dom.message.textContent = "It's a Draw!";
      this.dom.message.className = 'text text--message draw';
      this.stats.draws++;
    }

    this.updateTurn();
    this.saveStats();
    this.updateStats();
  }

  resetGame() {
    this.state = 'playing';
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.currentPlayer = 1;

    this.dom.message.textContent = 'Click a cell to play!';
    this.dom.message.className = 'text text--message';

    this.world.reset();
    this.updateTurn();
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
