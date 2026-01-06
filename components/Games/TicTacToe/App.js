import React from 'react';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <iframe
        src="/tictactoe-game.html"
        title="Tic Tac Toe - 3D Game"
        className={styles.iframe}
        allow="accelerometer; gyroscope"
      />
    </div>
  );
};

App.displayName = 'TicTacToe';

export default App;
