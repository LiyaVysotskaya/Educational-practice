import { sound } from "../pages/index.js";

export default class Game {
    constructor(x = 10, y = 10, mines = 10) {
      this.field = this.createBlankField(x, y);
      this.playerSelections = this.createBlankField(x, y);
      this.mines = mines;
      this.time = 0;
      this.clicks = 0;
      this.win = null;
    }

    createBlankField(x, y, fillBy = 0) {
      const field = [];
      for (let i = 0; i< x; i++) {
        const row = [];
        for (let j = 0; j < y; j++ ){
          row.push(fillBy)
        }
        field.push(row)
      }
      return field;
    }

    _getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _placeMines(clickedCell, clickedRow, mines) {
      for (let i = 0; i < mines; ) {
        const lineNumber = this._getRandomIntInclusive(0, this.field.length - 1);
        const line = this.field[lineNumber]
        const cellNumber = this._getRandomIntInclusive(0, line.length - 1);
        if (line[cellNumber] !== -1 && !(clickedCell === cellNumber && clickedRow === lineNumber) ) {
          line[cellNumber] = -1;
          i++
        }
      }
    }

    _placeNumbers() {
      for (let i = 0; i < this.field.length; i++) {
        for (let j = 0; j < this.field[i].length; j++) {
          if (this.field[i][j] !== -1) {
            for (let n = i-1; n<= i+1; n++){
              if (this.field[n] !== undefined && this.field[n][j-1] === -1) {
                this.field[i][j] += 1;
              }
              if (this.field[n] !== undefined && this.field[n][j] === -1) {
                this.field[i][j] += 1;
              }
              if (this.field[n] !== undefined && this.field[n][j+1] === -1) {
                this.field[i][j] += 1;
              }
            }
          }
        }
      }
    }

    _openCell(x, y) {
      if (this.playerSelections[y][x] !== 0) {
        return
      }
      this.playerSelections[y][x] = 1;
      if (this.field[y][x] === 0) {
        for (let i = x-1; i < x+2; i++) {
          for (let j = y-1; j < y+2; j++){
            if (i > -1 && i < this.field.length && j > -1 && j < this.field[i].length && this.field[y][x] == 0 ){
              this._openCell(i, j);
            }
          }
        }
      }
    }

    clickCell(x, y) {
      if (this.mines != null && this.win === null) {
        this._placeMines(x, y, this.mines);
        this._placeNumbers();
        this.mines = null;
      }
      if (this.timerID == null && this.win == null) {
        this.timerID = window.setInterval( ()=>{this.countTime()}, 1000)
      }
      if (this.playerSelections[y][x] === 0 && this.win === null) {
        this.countClicks();
        this._openCell(x, y);
        this.isEndGame(x, y);
        return true;
      }
        return false;
    }

    flagCell(x, y) {
      if (this.playerSelections[y][x] === -1) {
        this.playerSelections[y][x] = 0;
      } else if (this.playerSelections[y][x] === 0) {
        this.playerSelections[y][x] = -1;
      }
    }

    countFlags() {
      let counter = 0;
      for (let i = 0; i < this.playerSelections.length; i++) {
        for (let j = 0; j < this.playerSelections[i].length; j++) {
          if (this.playerSelections[i][j] === -1){
            counter += 1;
          }
        }
      }

      const display = document.getElementById('flagsNumber');
      display.innerText = counter.toString();
      return counter;
    }

    countTime() {
      let counter = this.time || 0;
      this.time = counter + 1;
      document.getElementById('timeNumber').innerText = this.time.toString();
    }

    countClicks() {
      this.clicks += 1;
      document.getElementById('clicksNumber').innerText = this.clicks.toString();
    }

    stopCounting() {
      if (this.timerID) {
        window.clearInterval(this.timerID);
        this.timerID = undefined;
      }
    }

    isEndGame(x,y) {
      if(this.field[y][x] === -1) {
        for (let row = 0; row < this.field.length; row++) {
          for (let cell = 0; cell < this.field[row].length; cell++) {
            if (this.field[row][cell] === -1){
              this.playerSelections[row][cell] = 0;
              this._openCell(cell, row)
            }
          }
        }

        this.stopCounting();

        this.win = false;

        if (sound === true) {
          const winSound = new Audio();
          winSound.src = './assets/lose.mp3';
          winSound.play();
        }

        document.getElementById('endGamePopup').classList.remove('win');
        document.getElementById('endGamePopup').classList.add('lose');
        document.getElementById('endGamePopup').classList.add('popuped');

        const finalMessage = document.createElement('div');
        finalMessage.id = 'finalMessage';
        finalMessage.innerText = 'Game over. Try again';
        document.getElementsByClassName('footer')[0].appendChild(finalMessage);
        return
      }

      let bombs = this.field.flat().filter((el) => el === -1).length;
      for (let row = 0; row < this.field.length; row++) {
        for (let cell = 0; cell < this.field[row].length; cell++) {
          if (this.field[cell][row] === -1 && this.playerSelections[cell][row] !== 1 ) {
            bombs -= 1;
          }
        }
      }
      if (bombs === 0 && (this.playerSelections.flat().filter((e)=> e !== 1).length === this.field.flat().filter((el) => el === -1).length)) {
        for (let row = 0; row < this.field.length; row++) {
          for (let cell = 0; cell < this.field[row].length; cell++) {
            if (this.field[row][cell] === -1){
              this.playerSelections[row][cell] = 0;
              this._openCell(cell, row)
            }
          }
        }

        this.stopCounting();

        this.win = true;

        if (sound === true) {
          const winSound = new Audio();
          winSound.src = './assets/win.mp3';
          winSound.play();
        }

        document.getElementById('endGamePopup').classList.remove('lose');
        document.getElementById('endGamePopup').classList.add('win');
        document.getElementById('endGamePopup').classList.add('popuped');

        const finalMessage = document.createElement('div');
        finalMessage.id = 'finalMessage';
        finalMessage.innerText = 'Hooray! You found all mines in ' + this.time.toString() + ' seconds and '+ this.clicks.toString() + ' moves!';
        document.getElementsByClassName('footer')[0].appendChild(finalMessage);
      }
    }
  }
