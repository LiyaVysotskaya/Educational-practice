export default class Cell {
  constructor(game, onCellClicked, onCellFlagged, id, lineId) {
    this.game = game;
    this.id= id;
    this.lineId = lineId;
    this.line = game.field[lineId];
    this.onCellClicked = onCellClicked;
    this.onCellFlagged = onCellFlagged;

    this.cellId = "cell" + id + "." + lineId;
    this.cellElement = document.getElementById(this.cellId);

    this.currentCell = this.line[id];

    this._create();
  }

  _create() {
    if (this.cellElement == null) {
      this.cellElement = document.createElement("div");
      this.cellElement.id = this.cellId;
      this.cellElement.addEventListener("click", () => {
        this.onCellClicked(this.id, this.lineId);
      });

      this.cellElement.addEventListener('contextmenu', (e)=> {
        e.preventDefault();
      });

      this.cellElement.addEventListener('mouseup', (event) => {
        let btnCode= event.button;
        if (btnCode === 2) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.onCellFlagged(this.id, this.lineId);
        }
      });

      this.cellElement.classList.add('cell');

      switch (true) {
        case this.line.length <= 10:
          this.cellElement.classList.add('cell_smallField')
          break
        case this.line.length <= 15:
          this.cellElement.classList.add('cell_mediumField')
          break
        default:
          this.cellElement.classList.add('cell_largeField')
      };
    }

    this.cellElement.classList.remove('flagged');
    switch (this.game.playerSelections[this.lineId][this.id]) {
      case 0:
        break
      case 1:
        this.cellElement.classList.add('open');
        switch (true) {
          case this.currentCell === 0:
            break
          case this.currentCell === -1:
            this.cellElement.classList.add('mine', 'boom')
            break
          default:
            this.cellElement.innerText = this.currentCell.toString();
            this.cellElement.classList.add('mines' + this.currentCell.toString())
            break
        }
        break
      case -1:
        this.cellElement.classList.add('flagged');
        break
    }
  }
}
