import React from 'react';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <iframe
        src="/cube-game.html"
        title="The Cube - Rubik's Cube Game"
        className={styles.iframe}
        allow="accelerometer; gyroscope"
      />
    </div>
  );
};

App.displayName = 'TheCube';

export default App;
