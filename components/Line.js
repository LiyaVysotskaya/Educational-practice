export default class Line {
  constructor(parent, game, id) {
    this.id = id;
    this.line = game.field[id];
    this.lineElement = document.getElementById("line" + id);

    this._draw(parent);
  }

  append(cell) {
    this.lineElement.appendChild(cell.cellElement);
  }

  _draw(parent) {
    if (this.lineElement == null) {
      this.lineElement = document.createElement("div");
      this.lineElement.id = "line" + this.id;
      this.lineElement.classList.add('line');
      parent.appendChild(this.lineElement);
    }
  }
}
