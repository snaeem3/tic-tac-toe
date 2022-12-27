const currentTurnDiv = document.querySelector('#current-turn');
const gameWrapper = document.querySelector('#game-wrapper');
const spaces = document.querySelectorAll('.space');
const gameResultMessage = document.querySelector('gameResult-message');

const displayController = (() => {
  const displayGameResult = (result) => {
    if (result === 1) {
      gameResultMessage.textContent = 'Player 1 Wins';
    } else if (result === 2) {
      gameResultMessage.textContent = 'Player 2 Wins';
    } else {
      gameResultMessage.textContent = 'Tie';
    }
  };

  const displaySymbol = (row, col, symbol) => {
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

    const searchText = `${row}${col}`;
    const divIndex = map.indexOf(searchText);
    spaces[divIndex].textContent = symbol;
  };

  const updatePlayerTurnDisplay = (player) => {
    currentTurnDiv.textContent = player === 1 ? 'Player 1' : 'Player 2';
  };

  return {
    displayGameResult,
    displaySymbol,
    updatePlayerTurnDisplay,
  };
})();

const game = (() => {
  let currentPlayer = 1;
  let player1Symbol = '';
  let player2Symbol = '';
  let round = 1;
  let gameOver = false;

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

  const resetRound = () => {
    round = 0;
    gameOver = false;
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
    resetRound,
    incrementRound,
    getRound,
    gameOver,
    // endGame,
  };
})();

const gameBoard = (() => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const makeMove = (col, row, symbol) => {
    if (!checkEmptyPosition(col, row)) {
      console.error('position is not empty');
      return;
    }

    board[col][row] = symbol;
    displayController.displaySymbol(row, col, symbol);

    game.incrementRound();
    game.toggleCurrentPlayer();
    const result = checkVictory();
    console.log(`result: ${result}`);
    if (result !== '') {
      console.log(`${result} won`);
      game.gameOver = true;
    }
    console.table(board);
    console.log(game.getRound());
    if (game.getRound() > 9) {
      console.log('Tie game');
      game.gameOver = true;
    }
    console.log(`Game Over? ${game.gameOver}`);
  };

  const checkEmptyPosition = (col, row) => board[col][row] === '';

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

      if (board[c][0] === board[c][1] && board[c][0] === board[c][2]) {
        return board[c][0];
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

      if (board[0][r] === board[1][r] && board[0][r] === board[2][r]) {
        return board[0][r];
      }
    }

    // Check negative diagonal
    if (
      !checkEmptyPosition(0, 0) &&
      !checkEmptyPosition(1, 1) &&
      checkEmptyPosition(2, 2)
    ) {
      if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[1][1];
      }
    }
    // Check positive diagonal
    if (
      !checkEmptyPosition(0, 2) &&
      !checkEmptyPosition(1, 1) &&
      checkEmptyPosition(2, 0)
    ) {
      if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[1][1];
      }
    }

    // Return empty string if no winner
    return '';
  };

  const resetBoard = () => {
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  };

  return {
    board,
    makeMove,
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

// const player = (symbol) => ({ symbol });
game.setSymbols('X', 'O');
