class TicTacToe {
  constructor(player1, player2) {
    this.board = [
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"]
    ];

    this.players = [player1, player2];
    this.current = 0;
    this.lockedBy = null; // diagonal lock owner
    this.gameOver = false;
  }

  printBoard() {
    console.log("\n  1 2 3");
    console.log("A " + this.board[0].join(" "));
    console.log("B " + this.board[1].join(" "));
    console.log("C " + this.board[2].join(" "));
  }

  parseInput(input) {
    const rowMap = { A: 0, B: 1, C: 2 };
    const row = rowMap[input[0]];
    const col = parseInt(input[1]) - 1;

    if (row === undefined || col < 0 || col > 2) {
      throw new Error("Invalid coordinate!");
    }

    return { row, col };
  }

  checkDiagonalLock(player) {
    const symbol = player.symbol;

    const mainDiag =
      this.board[0][0] === symbol && this.board[2][2] === symbol;

    const antiDiag =
      this.board[0][2] === symbol && this.board[2][0] === symbol;

    if ((mainDiag || antiDiag) && this.board[1][1] === "_") {
      this.lockedBy = player.symbol;
    }
  }

  checkWin(symbol) {
    const b = this.board;

    for (let i = 0; i < 3; i++) {
      if (b[i][0] === symbol && b[i][1] === symbol && b[i][2] === symbol)
        return true;

      if (b[0][i] === symbol && b[1][i] === symbol && b[2][i] === symbol)
        return true;
    }

    if (b[0][0] === symbol && b[1][1] === symbol && b[2][2] === symbol)
      return true;

    if (b[0][2] === symbol && b[1][1] === symbol && b[2][0] === symbol)
      return true;

    return false;
  }

  checkDraw() {
    return this.board.flat().every(cell => cell !== "_");
  }

  makeMove(input) {
    if (this.gameOver) {
      console.log("Game already ended.");
      return;
    }

    const player = this.players[this.current];
    const { row, col } = this.parseInput(input);

    if (this.board[row][col] !== "_") {
      throw new Error("Cell already filled!");
    }

    // Diagonal Lock Check
    if (row === 1 && col === 1 && this.lockedBy && this.lockedBy !== player.symbol) {
      throw new Error("Center is locked for opponent!");
    }

    this.board[row][col] = player.symbol;

    this.checkDiagonalLock(player);

    if (this.checkWin(player.symbol)) {
      this.printBoard();
      console.log(`\n${player.name} wins!`);
      this.gameOver = true;
      return;
    }

    if (this.checkDraw()) {
      this.printBoard();
      console.log("\nGame Draw!");
      this.gameOver = true;
      return;
    }

    this.current = 1 - this.current;
  }
}

module.exports = TicTacToe;