import React from 'react';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <iframe
        src="/hangman-game.html"
        title="Hangman - Word Guessing Game"
        className={styles.iframe}
        allow="accelerometer; gyroscope"
      />
    </div>
  );
};

App.displayName = 'Hangman';

export default App;
