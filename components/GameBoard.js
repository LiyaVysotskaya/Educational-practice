import Line from "./Line.js";
import Cell from "./Cell.js";

export default class GameBoard {
  constructor(parent, onCellClicked, onCellFlagged) {
    this.parent = parent;
    this.onCellClicked = onCellClicked;
    this.onCellFlagged = onCellFlagged;
  }

  draw(game) {
    const linesCount = game.field.length;
    for (let y = 0; y < linesCount; y++) {
      const line = new Line(this.parent, game, y);
      for (let x = 0; x < game.field[y].length; x++) {
        const cell = new Cell(game, this.onCellClicked, this.onCellFlagged, x, y);
        line.append(cell);
      }
    }
  }
}
