const readline = require("readline");
const TicTacToe = require("./TicTacToe");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function startGame() {
  const name1 = await ask("Player 1 Name: ");
  let symbol1 = await ask("Player 1 Symbol: ");

  if (symbol1 === "_") {
    console.log("Symbol cannot be _");
    process.exit();
  }

  const name2 = await ask("Player 2 Name: ");
  let symbol2 = await ask("Player 2 Symbol: ");

  if (symbol2 === "_" || symbol1 === symbol2) {
    console.log("Invalid symbol selection.");
    process.exit();
  }

  const game = new TicTacToe(
    { name: name1, symbol: symbol1 },
    { name: name2, symbol: symbol2 }
  );

  game.printBoard();

  while (!game.gameOver) {
    const currentPlayer = game.players[game.current];
    try {
      const move = await ask(`${currentPlayer.name} (${currentPlayer.symbol}) move: `);
      game.makeMove(move.toUpperCase());
      game.printBoard();
    } catch (err) {
      console.log(err.message);
    }
  }

  rl.close();
}

startGame();