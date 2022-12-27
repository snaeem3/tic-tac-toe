const currentTurnDiv = document.querySelector('#current-turn');
const gameWrapper = document.querySelector('#game-wrapper');
const spaces = document.querySelectorAll('.space');
const gameResultMessage = document.querySelector('#gameResult-message');
const newGameBtn = document.querySelector('#newGameBtn');

const displayController = (() => {
  const displayGameResult = (result) => {
    if (result === 1) {
      gameResultMessage.textContent = 'Player 1 Wins';
    } else if (result === 2) {
      gameResultMessage.textContent = 'Player 2 Wins';
    } else {
      gameResultMessage.textContent = 'Draw';
    }
  };

  // Array to map the row and col to specific div
  const map = [
    // 'rc'
    '00',
    '01',
    '02',
    '10',
    '11',
    '12',
    '20',
    '21',
    '22',
  ];
  const displaySymbol = (row, col, symbol) => {
    const searchText = `${row}${col}`;
    const divIndex = map.indexOf(searchText);
    spaces[divIndex].textContent = symbol;
  };

  const updateBoardDisplay = () => {
    for (let i = 0; i < spaces.length; i++) {
      const divIndex = map[i];
      const row = divIndex[0];
      const col = divIndex[1];
      spaces[i].textContent = gameBoard.board[col][row];
    }
  };

  const updatePlayerTurnDisplay = (player) => {
    currentTurnDiv.textContent = player === 1 ? 'Player 1' : 'Player 2';
  };

  return {
    displayGameResult,
    displaySymbol,
    updatePlayerTurnDisplay,
    updateBoardDisplay,
  };
})();

const game = (() => {
  let currentPlayer = 1;
  let player1Symbol = '';
  let player2Symbol = '';
  let round = 1;
  const gameOver = false;

  const getCurrentPlayer = () => currentPlayer;

  // return the inputted player Symbol or current player symbol by default
  const getPlayerSymbol = (player = getCurrentPlayer()) =>
    player === 1 ? player1Symbol : player2Symbol;

  const toggleCurrentPlayer = () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayController.updatePlayerTurnDisplay(getCurrentPlayer());
  };

  const setSymbols = (player1, player2) => {
    player1Symbol = player1;
    player2Symbol = player2;
  };

  const getRound = () => round;

  const resetGame = () => {
    round = 0;
    game.gameOver = false;
    gameBoard.resetBoard();
  };

  const incrementRound = () => {
    round += 1;
  };

  // const endGame = () => {gameOver = true;};

  return {
    getCurrentPlayer,
    getPlayerSymbol,
    toggleCurrentPlayer,
    setSymbols,
    resetGame,
    incrementRound,
    getRound,
    gameOver,
    // endGame,
  };
})();

const gameBoard = (() => {
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const makeMove = (col, row, symbol) => {
    if (!checkEmptyPosition(col, row)) {
      console.error('position is not empty');
      return;
    }

    gameBoard.board[col][row] = symbol;
    displayController.displaySymbol(row, col, symbol);

    game.incrementRound();
    game.toggleCurrentPlayer();
    const result = checkVictory();
    console.log(`result: ${result}`);
    if (result !== '') {
      console.log(`${result} won`);
      game.gameOver = true;
    }
    console.table(gameBoard.board);
    console.log(game.getRound());
    if (game.getRound() > 9) {
      console.log('Tie game');
      displayController.displayGameResult(0); // display tie message
      game.gameOver = true;
    }
    console.log(`Game Over? ${game.gameOver}`);
  };

  const checkEmptyPosition = (col, row) => gameBoard.board[col][row] === '';

  const checkVictory = () => {
    // Checks gameBoard for 3 identical symbols and returns the symbol that won

    // Check each column
    for (let c = 0; c < 3; c++) {
      if (
        checkEmptyPosition(c, 0) ||
        checkEmptyPosition(c, 1) ||
        checkEmptyPosition(c, 2)
      ) {
        continue;
      }

      if (
        gameBoard.board[c][0] === gameBoard.board[c][1] &&
        gameBoard.board[c][0] === gameBoard.board[c][2]
      ) {
        return gameBoard.board[c][0];
      }
    }
    // Check each row
    for (let r = 0; r < 3; r++) {
      if (
        checkEmptyPosition(0, r) ||
        checkEmptyPosition(1, r) ||
        checkEmptyPosition(2, r)
      ) {
        continue;
      }

      if (
        gameBoard.board[0][r] === gameBoard.board[1][r] &&
        gameBoard.board[0][r] === gameBoard.board[2][r]
      ) {
        return gameBoard.board[0][r];
      }
    }

    // Check negative diagonal
    if (
      !checkEmptyPosition(0, 0) &&
      !checkEmptyPosition(1, 1) &&
      !checkEmptyPosition(2, 2)
    ) {
      if (
        gameBoard.board[0][0] === gameBoard.board[1][1] &&
        gameBoard.board[0][0] === gameBoard.board[2][2]
      ) {
        return gameBoard.board[1][1];
      }
    }
    // Check positive diagonal
    if (
      !checkEmptyPosition(0, 2) &&
      !checkEmptyPosition(1, 1) &&
      !checkEmptyPosition(2, 0)
    ) {
      if (
        gameBoard.board[0][2] === gameBoard.board[1][1] &&
        gameBoard.board[0][2] === gameBoard.board[2][0]
      ) {
        return gameBoard.board[1][1];
      }
    }

    // Return empty string if no winner
    return '';
  };

  const resetBoard = () => {
    gameBoard.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  };

  return {
    board,
    makeMove,
    resetBoard,
    checkVictory,
  };
})();

spaces.forEach((space) => {
  space.addEventListener('click', (event) => {
    const { className } = event.currentTarget;

    // Extract row and column from class name
    const row = parseInt(className.substring(9, 10)); // className = 'space row[#] col[#]'
    const col = parseInt(className.substring(14));

    if (!game.gameOver) {
      gameBoard.makeMove(
        col,
        row,
        game.getPlayerSymbol(game.getCurrentPlayer())
      );
    }
  });
});

newGameBtn.addEventListener('click', () => {
  game.resetGame();
  displayController.updateBoardDisplay();
});

// const player = (symbol) => ({ symbol });
game.setSymbols('X', 'O');
game.resetGame();
