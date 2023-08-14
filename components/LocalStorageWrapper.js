import Game from "./Game.js";

export default class LocalStorageWrapper {
  constructor() {
  }

  getScores() {
    const stringifiedScores = localStorage.getItem('scores');
    if (stringifiedScores == null) {
      return []
    } else {
      return JSON.parse(stringifiedScores);
    }
  }

  addScore(time, clicks, size, mines) {
    const scores = this.getScores();
    if (scores.length > 9) {
      scores.shift();
    }
    let scoreElement = {};
    scoreElement['time'] = time;
    scoreElement['clicks'] = clicks;
    scoreElement['size'] = size;
    scoreElement['mines'] = mines;
    scores.push(scoreElement);
    localStorage.setItem('scores', JSON.stringify(scores));
  }

  saveGame(game) {
    const gameObject = Object.assign({}, game);
    gameObject['timerID'] = undefined;
    const stringifiedGame = JSON.stringify(gameObject);
    localStorage.setItem('game', stringifiedGame);
  }

  loadGame() {
    const savedGame = localStorage.getItem('game');
    let game = new Game();
    if (savedGame != null){
      Object.assign(game, JSON.parse(savedGame));
    }
    return game;
  }
}
