-- High scores table for all games
CREATE TABLE IF NOT EXISTS high_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  holder_name TEXT NOT NULL DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Initialize with default values for each game
INSERT OR IGNORE INTO high_scores (game, score, holder_name) VALUES ('hangman', 0, '');
INSERT OR IGNORE INTO high_scores (game, score, holder_name) VALUES ('snake', 0, '');
INSERT OR IGNORE INTO high_scores (game, score, holder_name) VALUES ('tetris', 0, '');
