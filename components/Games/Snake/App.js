import React from 'react';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <iframe
        src="/snake-game.html"
        title="Snake - 3D Game"
        className={styles.iframe}
        allow="accelerometer; gyroscope"
      />
    </div>
  );
};

App.displayName = 'SnakeGame';

export default App;
