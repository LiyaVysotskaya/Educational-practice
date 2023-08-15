import Game from "../components/Game.js";
import GameBoard from "../components/GameBoard.js";
import LocalStorageWrapper from "../components/LocalStorageWrapper.js";
import { body,
  welcomePopup, welcomeButton,
  newGameButton, showScores, changeMode,
  newGamePopup, easyMode, mediumMode, hardMode, range, mineMinus, minePlus, startNewGame, cancelNewGame,
  table, hideScores,
  wrapper, endGamePopup, closeGameoverPopup,
  timeNumber, minesNumber, flagsNumber, clicksNumber,
  modes,
  finalMessage,
  scoresPopup,
  soundButton, musicButton,
  buttonSound, themeSong, soundCell, missClick, soundFlag } from "../utils/constants.js";

export let sound = true;
let music = true;
let darkMode = false;

function createDisplays(mines, initialTime, initialFlags, initialClicks) {
  timeNumber.innerText = initialTime;
  minesNumber.innerText = mines.toString();
  flagsNumber.innerText = initialFlags;
  clicksNumber.innerText = initialClicks;
}

function hidePopup(popup) {
  popup.classList.remove('popuped');
}

function makeScores(source) {
  Array.from(table.children).forEach(child => child.remove());
  const size = Array.from(source.getScores()).length;
  for (let i = size -1; i >= 0; i--) {
    let element = Array.from(source.getScores())[i];
    let line = document.createElement('div');
    line.classList.add('scoresLine');
    line.innerText = element['time'] + ' seconds ' + ' - ' + (element['clicks']) + ' clicks ' + ' - ' + element['size'] + "*" + element['size'] + ' cells ' + ' - ' + element['mines'] + ' mines'
    table.appendChild(line);
    }
  }

window.addEventListener('load', () => {
  const onCellClicked = (x, y) => {
    if (game.clickCell(x, y) === true) {
      if (sound === true) {
        soundCell.play();
      }
    } else {
      if (sound === true) {
        missClick.play();
      }
    }

    if (game.win === true) {
      lsWrapper.addScore(game.time, game.clicks, game.field.length, game.field.flat().filter(e=> e === -1).length);
    }
    lsWrapper.saveGame(game);
    gameBoard.draw(game);
  }

  const onCellFlagged = (x, y) => {
    if (game.win == null) {
      game.flagCell(x, y);
      soundFlag.play()
      game.countFlags();
      gameBoard.draw(game);
    }
  }

  let lsWrapper = new LocalStorageWrapper();
  let game = lsWrapper.loadGame();
  let gameBoard = new GameBoard(wrapper, onCellClicked, onCellFlagged);

  setInterval(()=> lsWrapper.saveGame(game), 1000);

  createDisplays(10, game.time, game.playerSelections.flat().filter(e=> e=== -1).length, game.clicks);

  gameBoard.draw(game);

  newGameButton.addEventListener('click', () => {
    if (newGamePopup.classList.contains('popuped')) {
      newGamePopup.classList.remove('popuped');
    } else {
      newGamePopup.classList.add('popuped');
    }
  })

  easyMode.addEventListener('click', () => {
    modes.forEach(mode => {
      mode.classList.remove('buttonPressed');
    });
    easyMode.classList.add('buttonPressed');
  });

  mediumMode.addEventListener('click', () => {
    modes.forEach(mode => {
      mode.classList.remove('buttonPressed');
    });
    mediumMode.classList.add('buttonPressed');
  });

  hardMode.addEventListener('click', () => {
    modes.forEach(mode => {
      mode.classList.remove('buttonPressed');
    });
    hardMode.classList.add('buttonPressed');
  });

  mineMinus.addEventListener('click', () => {
    if (parseInt(range.value) > 10) {
      range.value = parseInt(range.value) - 1;
    };
  });

  minePlus.addEventListener('click', ()=> {
    if (parseInt(range.value) < 99) {
      range.value = parseInt(range.value) + 1;
    };
  });

  startNewGame.addEventListener('click', () => {
    let size;
    switch (true) {
      case hardMode.classList.contains('buttonPressed'):
        size = 25;
        break;
      case mediumMode.classList.contains('buttonPressed'):
        size = 15;
        break
      default:
        size = 10;
    };

    let mines = parseInt(range.value);
    if (mines > 99) {
      mines = 99;
    }
    if (mines < 10) {
      mines = 10;
    }
    game.stopCounting();

    game = new Game(size, size, mines);

    if (finalMessage != null) {
      finalMessage.remove();
    };

    newGamePopup.classList.remove('popuped');
    minesNumber.innerText = mines.toString();
    flagsNumber.innerText = '0';
    clicksNumber.innerText = '0000';
    timeNumber.innerText = '0000';
    Array.from(wrapper.children).forEach(child => {child.remove()})
    gameBoard.draw(game);
  });

  cancelNewGame.addEventListener('click', () => {
    newGamePopup.classList.remove('popuped');
  });

  closeGameoverPopup.addEventListener('click', ()=> {
    hidePopup(endGamePopup);
  });

  showScores.addEventListener('click', () => {
    if (scoresPopup.classList.contains('popuped')) {
      scoresPopup.classList.remove('popuped');
    } else {
      scoresPopup.classList.add('popuped');
      makeScores(lsWrapper);
    };
  });

  hideScores.addEventListener('click', () => {
    scoresPopup.classList.remove('popuped');
  })

  buttonSound.src = './assets/button.wav';
  themeSong.src = './assets/main.m4a';
  soundCell.src = './assets/clickcell.wav'
  missClick.src ='./assets/misclick.wav';
  soundFlag.src = './assets/flag.wav';


  musicButton.onmouseover = function () {
    if (sound === true) {
      buttonSound.play();
    }
  }

  soundButton.onmouseover = function () {
    if (sound === true) {
      buttonSound.play();
    }
  }
  newGameButton.onmouseover = function () {
    if (sound === true) {
      buttonSound.play();
    }
  }
  showScores.onmouseover = function () {
    if (sound === true) {
      buttonSound.play();
    }
  }
  changeMode.onmouseover = function () {
    if (sound === true) {
      buttonSound.play();
    }
  }

  soundButton.addEventListener('click', () => {
    if (buttonSound.volume === 1) {
      soundButton.classList.add('muted');
      sound = false;
      soundCell.volume = 0;
      buttonSound.volume = 0;
      soundFlag.volume = 0;
    } else {
      soundButton.classList.remove('muted');
      sound = true;
      soundCell.volume = 1;
      buttonSound.volume = 1;
      soundFlag.volume = 1;
    };
  });

  musicButton.addEventListener('click', () => {
    if (themeSong.volume === 1) {
      musicButton.classList.add('muted');
      themeSong.volume = 0;
    } else {
      musicButton.classList.remove('muted');
      themeSong.volume = 1;
    };
  });

  welcomeButton.addEventListener('click', () => {
    if (music === true){
      themeSong.volume = 1
    } else {
      themeSong.volume = 0
    };

    themeSong.loop = true;
    themeSong.play();
    welcomePopup.remove();
  });

  changeMode.addEventListener('click', () => {
    if (darkMode === false) {
      darkMode = true;
      changeMode.innerText = 'Dark Mode';
      body.classList.add('darkmode');
    } else {
      darkMode = false;
      changeMode.innerText = 'Light Mode';
      body.classList.remove('darkmode');
    };
  });
});
