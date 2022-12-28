const currentTurnDiv = document.querySelector('#current-turn');
const gameWrapper = document.querySelector('#game-wrapper');
const player1NameField = document.querySelector('#player1-name');
const spaces = document.querySelectorAll('.space');
const player2NameField = document.querySelector('#player2-name');
const aiToggleBtn = document.querySelector('#ai-toggle');
const gameResultMessage = document.querySelector('#gameResult-message');
const newGameBtn = document.querySelector('#newGameBtn');

const displayController = (() => {
  const displayGameResult = (result) => {
    gameResultMessage.style.display = 'block';
    if (result === 1) {
      gameResultMessage.textContent = 'Player 1 Wins';
    } else if (result === 2) {
      gameResultMessage.textContent = 'Player 2 Wins';
    } else {
      gameResultMessage.textContent = 'Draw';
    }
  };

  const clearGameResultDisplay = () => {
    gameResultMessage.style.display = 'none';
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

  const togglePlayerTurnDisplay = (player) => {
    currentTurnDiv.textContent =
      player === 1 ? game.player1Name : game.player2Name;
  };

  const toggleAi = () => {
    if (aiToggleBtn.textContent === 'Computer') {
      aiToggleBtn.textContent = 'Human';
    } else {
      aiToggleBtn.textContent = 'Computer';
    }
  };

  return {
    displayGameResult,
    displaySymbol,
    updateBoardDisplay,
    clearGameResultDisplay,
    togglePlayerTurnDisplay,
    toggleAi,
  };
})();

const game = (() => {
  const currentPlayer = 1;
  const player1Name = 'Player 1';
  const player2Name = 'Player 2';
  let player1Symbol = '';
  let player2Symbol = '';
  const round = 1;
  const gameOver = false;
  const vsComputer = false;

  const getCurrentPlayer = () => currentPlayer;

  // return the inputted player Symbol or current player symbol by default
  const getPlayerSymbol = (player = getCurrentPlayer()) =>
    player === 1 ? player1Symbol : player2Symbol;

  const toggleCurrentPlayer = () => {
    game.currentPlayer = game.currentPlayer === 1 ? 2 : 1;
    displayController.togglePlayerTurnDisplay(getCurrentPlayer());
  };

  const setSymbols = (player1, player2) => {
    player1Symbol = player1;
    player2Symbol = player2;
  };

  const updatePlayerName = (playerNum, newName) => {
    if (playerNum === 1) {
      game.player1Name = newName;
    } else {
      game.player2Name = newName;
    }
  };

  // const getRound = () => round;

  const resetGame = () => {
    game.round = 1;
    game.gameOver = false;
    game.currentPlayer = 1;
    gameBoard.resetBoard();
    displayController.updateBoardDisplay();
    displayController.clearGameResultDisplay();
  };

  const incrementRound = () => {
    game.round += 1;
  };

  // const endGame = () => {gameOver = true;};

  return {
    player1Name,
    player2Name,
    round,
    gameOver,
    vsComputer,
    getCurrentPlayer,
    getPlayerSymbol,
    toggleCurrentPlayer,
    updatePlayerName,
    setSymbols,
    resetGame,
    incrementRound,
    // getRound,
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
    // console.log(`result: ${result}`);
    if (result !== '') {
      console.log(`${result} won`);
      if (result === game.getPlayerSymbol(1)) {
        displayController.displayGameResult(1);
      } else {
        displayController.displayGameResult(2);
      }
      game.gameOver = true;
    }
    console.table(gameBoard.board);
    console.log(game.round);
    if (game.round > 9) {
      console.log('Tie game');
      displayController.displayGameResult(0); // display tie message
      game.gameOver = true;
    }
    console.log(`Game Over? ${game.gameOver}`);

    if (!game.gameOver && game.vsComputer) {
      makeRandomMove(game.getPlayerSymbol(2));
    }
  };

  const makeRandomMove = (symbol) => {
    const emptyPositions = [];
    // populate emptyPositions array with
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (checkEmptyPosition(c, r)) {
          emptyPositions.push([r, c]);
        }
      }
    }

    // choose random position from remaining empty positions
    const emptyPositionIndex = Math.floor(
      Math.random() * (emptyPositions.length - 0) + 0
    );

    // extract row and column from selected empty position
    const row = emptyPositions[emptyPositionIndex][0];
    const col = emptyPositions[emptyPositionIndex][1];

    gameBoard.board[col][row] = symbol;
    displayController.displaySymbol(row, col, symbol);

    game.incrementRound();
    game.toggleCurrentPlayer();
    const result = checkVictory();
    // console.log(`result: ${result}`);
    if (result !== '') {
      console.log(`${result} won`);
      if (result === game.getPlayerSymbol(1)) {
        displayController.displayGameResult(1);
      } else {
        displayController.displayGameResult(2);
      }
      game.gameOver = true;
    }
    console.table(gameBoard.board);
    console.log(game.round);
    if (game.round > 9) {
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
});

player1NameField.addEventListener('focusout', (event) => {
  game.updatePlayerName(1, player1NameField.textContent);
});

player2NameField.addEventListener('focusout', (event) => {
  game.updatePlayerName(2, player2NameField.textContent);
});

aiToggleBtn.addEventListener('click', () => {
  game.resetGame();
  game.vsComputer = !game.vsComputer;
  displayController.toggleAi();
});

// const player = (symbol) => ({ symbol });
game.setSymbols('X', 'O');
game.resetGame();
