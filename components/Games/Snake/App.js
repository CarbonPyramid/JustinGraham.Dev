import React, { useEffect, useRef, useCallback, useState } from 'react';
import styles from './App.module.css';

const CELL_SIZE = 10;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const INITIAL_SNAKE_SIZE = 4;
const GAME_SPEED = 100;

const App = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef({
    snake: [],
    food: { x: 0, y: 0 },
    direction: 'right',
    score: 0,
    gameLoop: null,
    pressedKey: null,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initSnake = useCallback(() => {
    const snake = [];
    for (let i = 0; i < INITIAL_SNAKE_SIZE; i++) {
      snake.push({ x: i, y: 0 });
    }
    return snake;
  }, []);

  const initFood = useCallback(() => {
    return {
      x: Math.round(Math.random() * (CANVAS_WIDTH - CELL_SIZE) / CELL_SIZE),
      y: Math.round(Math.random() * (CANVAS_HEIGHT - CELL_SIZE) / CELL_SIZE),
    };
  }, []);

  const checkCollision = useCallback((nx, ny) => {
    if (nx < 0 || nx >= CANVAS_WIDTH / CELL_SIZE || ny < 0 || ny >= CANVAS_HEIGHT / CELL_SIZE) {
      return true;
    }
    return false;
  }, []);

  const drawCell = useCallback((context, x, y) => {
    context.fillStyle = 'rgb(148, 64, 243)';
    context.beginPath();
    context.arc((x * CELL_SIZE + 6), (y * CELL_SIZE + 6), 4, 0, 2 * Math.PI, false);
    context.fill();
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const game = gameRef.current;

    // Update direction based on key press
    if (game.pressedKey) {
      const keyMap = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
      const newDirection = keyMap[game.pressedKey];
      if (newDirection) {
        // Prevent reversing direction
        const opposites = { left: 'right', right: 'left', up: 'down', down: 'up' };
        if (opposites[newDirection] !== game.direction) {
          game.direction = newDirection;
        }
      }
    }

    // Clear canvas
    context.fillStyle = '#18191f';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Calculate new head position
    let nx = game.snake[0].x;
    let ny = game.snake[0].y;

    switch (game.direction) {
      case 'right': nx++; break;
      case 'left': nx--; break;
      case 'up': ny--; break;
      case 'down': ny++; break;
      default: break;
    }

    // Check collision
    if (checkCollision(nx, ny)) {
      setGameOver(true);
      if (game.gameLoop) {
        clearInterval(game.gameLoop);
        game.gameLoop = null;
      }
      return;
    }

    // Check if snake eats food
    let tail;
    if (nx === game.food.x && ny === game.food.y) {
      tail = { x: nx, y: ny };
      game.score++;
      setScore(game.score);
      game.food = initFood();
    } else {
      tail = game.snake.pop();
      tail.x = nx;
      tail.y = ny;
    }
    game.snake.unshift(tail);

    // Draw snake
    for (let i = 0; i < game.snake.length; i++) {
      const cell = game.snake[i];
      drawCell(context, cell.x, cell.y);
    }

    // Draw food
    context.fillStyle = '#00ff00';
    context.beginPath();
    context.arc((game.food.x * CELL_SIZE + 6), (game.food.y * CELL_SIZE + 6), 4, 0, 2 * Math.PI, false);
    context.fill();

    // Draw score
    context.fillStyle = '#ffffff';
    context.font = '14px helvetica';
    context.fillText('Score: ' + game.score, 10, CANVAS_HEIGHT - 10);
  }, [checkCollision, drawCell, initFood]);

  const startGame = useCallback(() => {
    const game = gameRef.current;

    // Clear existing game loop
    if (game.gameLoop) {
      clearInterval(game.gameLoop);
    }

    // Reset game state
    game.snake = initSnake();
    game.food = initFood();
    game.direction = 'right';
    game.score = 0;
    game.pressedKey = null;

    setScore(0);
    setGameOver(false);

    // Start game loop
    game.gameLoop = setInterval(drawGame, GAME_SPEED);
  }, [initSnake, initFood, drawGame]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ([37, 38, 39, 40].includes(event.which)) {
        event.preventDefault();
        gameRef.current.pressedKey = event.which;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    startGame();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (gameRef.current.gameLoop) {
        clearInterval(gameRef.current.gameLoop);
      }
    };
  }, [startGame]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        id="stage"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
      />
      <div className={styles.controls}>
        {gameOver && (
          <div className={styles.gameOver}>Game Over! Score: {score}</div>
        )}
        <button className={styles.btn} onClick={startGame}>
          {gameOver ? 'Play Again' : 'Restart'}
        </button>
        <div className={styles.instructions}>
          Use arrow keys to control the snake
        </div>
      </div>
    </div>
  );
};

App.displayName = 'SnakeGame';

export default App;
