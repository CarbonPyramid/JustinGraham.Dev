import React from 'react';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <iframe
        src="/tetris-game.html"
        title="Tetris - 3D Game"
        className={styles.iframe}
        allow="accelerometer; gyroscope"
      />
    </div>
  );
};

App.displayName = 'TetrisGame';

export default App;
