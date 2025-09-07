class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;

    if (!["b", "w", ""].includes(this.color) || !["k", "q", "n", "p", "r", "b", ""].includes(this.type)) throw Error("Invalid piece!");
  }
}

class Board {
  constructor() {
    this.state = [];
    for (let i = 0; i < 64; i++) this.state.push(new Piece("", ""));
  }

  draw() {
    let board = "┌───┬───┬───┬───┬───┬───┬───┬───┐\n";

    for (let i = 0; i < 8; i++) {
      let row = "│";
      for (let j = 0; j < 8; j++) {
        let t = this.state[i + j * 8].type;
        if (t == "") {
          row += " K ";
        }

        row += "│";
      }
      board += row + "\n";
      if (i != 7) board += "├───┼───┼───┼───┼───┼───┼───┼───┤\n";
    }
    board += "└───┴───┴───┴───┴───┴───┴───┴───┘";

    return board;
  }
}
