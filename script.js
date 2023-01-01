const currentTurnDiv = document.querySelector('#current-turn');
const gameWrapper = document.querySelector('#game-wrapper');
const player1NameField = document.querySelector('#player1-name');
const spaces = document.querySelectorAll('.space');
const player2NameField = document.querySelector('#player2-name');
const xSvg = document.querySelector('.feather-x');
const xColor = document.querySelector('#x-Color');
const oSvg = document.querySelector('.feather-circle');
const oColor = document.querySelector('#o-Color');
const aiToggleBtn = document.querySelector('#ai-toggle');
const computerDifficultyForm = document.querySelector(
  '#computer-difficulty-form'
);
const easyDifficulty = document.querySelector('#easyChoice');
const gameResultContainer = document.querySelector('#gameResult-container');
const gameResultMessage = document.querySelector('#gameResult-message');
const newGameBtn = document.querySelector('#newGameBtn');

const xImg = document.createElement('img');
const oImg = document.createElement('img');
xImg.src = './images/x.svg';
oImg.src = './images/circle.svg';

const displayController = (() => {
  const displayGameResult = (result) => {
    // setTimeout(() => {
    //   gameResultContainer.style.display = 'block';
    // }, 0);
    // gameResultContainer.style.display = 'block';
    gameResultContainer.classList.toggle('hide');
    if (result === 1) {
      gameResultMessage.textContent = `${game.player1Name} wins!`;
    } else if (result === 2) {
      gameResultMessage.textContent = `${game.player2Name} wins!`;
    } else {
      gameResultMessage.textContent = 'Draw';
    }
  };

  const clearGameResultDisplay = () => {
    // gameResultMessage.style.display = 'none';
    // gameResultContainer.style.display = 'none';
    gameResultContainer.classList.toggle('hide');
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
    // spaces[divIndex].textContent = symbol;
    if (symbol === 'X') spaces[divIndex].appendChild(xSvg.cloneNode(true));
    else spaces[divIndex].appendChild(oSvg.cloneNode(true));
  };

  const clearSymbol = (row, col) => {
    const searchText = `${row}${col}`;
    const divIndex = map.indexOf(searchText);
    while (spaces[divIndex].firstChild) {
      spaces[divIndex].removeChild(spaces[divIndex].firstChild);
    }
  };

  const updateBoardDisplay = () => {
    for (let i = 0; i < spaces.length; i++) {
      const divIndex = map[i];
      const row = divIndex[0];
      const col = divIndex[1];
      spaces[i].textContent = gameBoard.board[row][col];
    }
  };

  const togglePlayerTurnDisplay = (player) => {
    currentTurnDiv.textContent =
      player === 1 ? game.player1Name : game.player2Name;
  };

  const toggleAi = () => {
    if (aiToggleBtn.textContent === 'Computer') {
      aiToggleBtn.textContent = 'Human';
      computerDifficultyForm.style.display = 'none';
    } else {
      aiToggleBtn.textContent = 'Computer';
      computerDifficultyForm.style.display = 'block';
    }
  };

  return {
    displayGameResult,
    clearGameResultDisplay,
    displaySymbol,
    clearSymbol,
    updateBoardDisplay,
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

  const getCurrentPlayer = () => game.currentPlayer;

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
    displayController.togglePlayerTurnDisplay(1);
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
    setSymbols,
    updatePlayerName,
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

  const checkEmptyPosition = (col, row) => gameBoard.board[row][col] === '';

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
        gameBoard.board[0][c] === gameBoard.board[1][c] &&
        gameBoard.board[0][c] === gameBoard.board[2][c]
      ) {
        return gameBoard.board[0][c];
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
        gameBoard.board[r][0] === gameBoard.board[r][1] &&
        gameBoard.board[r][0] === gameBoard.board[r][2]
      ) {
        return gameBoard.board[r][0];
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
        gameBoard.board[2][0] === gameBoard.board[1][1] &&
        gameBoard.board[2][0] === gameBoard.board[0][2]
      ) {
        return gameBoard.board[1][1];
      }
    }

    // Return empty string if no winner
    return '';
  };

  const makeMove = (col, row, symbol) => {
    if (!checkEmptyPosition(col, row)) {
      console.error('position is not empty');
      return;
    }

    gameBoard.board[row][col] = symbol;
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

    // If computer is playing
    if (!game.gameOver && game.vsComputer) {
      // Use the opposite of symbol for the next move
      if (symbol === game.getPlayerSymbol(1)) {
        if (easyDifficulty.checked) {
          makeRandomMove(game.getPlayerSymbol(2));
        } else {
          makeOptimalMove(game.getPlayerSymbol(2));
        }
      }

      // if (easyDifficulty.checked) {
      //   makeRandomMove(game.getPlayerSymbol(1));
      // } else {
      //   makeOptimalMove(game.getPlayerSymbol(1));
      // }
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

    gameBoard.board[row][col] = symbol;
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

  const makeOptimalMove = (symbol) => {
    function isMovesLeft() {
      for (let c = 0; c < 3; c++) {
        for (let r = 0; r < 3; r++) {
          if (checkEmptyPosition(c, r)) {
            return true;
          }
        }
      }
      return false;
    }

    function evaluateBoard() {
      let score = 0;
      const result = checkVictory();
      if (result === game.getPlayerSymbol(1)) {
        score = -10;
      } else if (result === game.getPlayerSymbol(2)) {
        score = 10;
      }
      // console.log(
      //   `evaluateBoard called with result ${result} returning score ${score}`
      // );
      return score;
    }

    function minimax(depth, maximizingPlayer) {
      // console.log(
      //   `minimax called for ${
      //     maximizingPlayer ? 'maximizing player' : 'minimizing player'
      //   }\ndepth: ${depth}`
      // );
      const score = evaluateBoard();

      if (score === 10) {
        return score;
      }
      if (score === -10) {
        return score;
      }

      if (!isMovesLeft()) {
        return 0;
      }

      if (maximizingPlayer) {
        let maxEval = -1000;

        for (let c = 0; c < 3; c++) {
          for (let r = 0; r < 3; r++) {
            if (checkEmptyPosition(c, r)) {
              // Apply move
              gameBoard.board[r][c] = symbol;

              // Evaluate child by recursively calling minimax
              maxEval = Math.max(maxEval, minimax(depth + 1, false));

              // Undo move
              gameBoard.board[r][c] = '';
            }
          }
        }
        return maxEval;
      }

      // Else: Minimizing player
      let minEval = 1000;
      for (let c = 0; c < 3; c++) {
        for (let r = 0; r < 3; r++) {
          if (checkEmptyPosition(c, r)) {
            // Apply move
            gameBoard.board[r][c] = game.getPlayerSymbol(1);

            // Evaluate child by recursively calling minimax
            minEval = Math.min(minEval, minimax(depth + 1, true));

            // Undo move
            gameBoard.board[r][c] = '';
          }
        }
      }
      return minEval;
    }

    let bestVal = -Infinity;
    let bestRow = -1;
    let bestCol = -1;
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        if (checkEmptyPosition(c, r)) {
          gameBoard.board[r][c] = symbol;

          const moveVal = minimax(0, false);
          // console.log(`Best move for row ${r} col ${c} = ${moveVal}`);

          // Undo move
          gameBoard.board[r][c] = '';

          // Update bestVal if moveVal is better
          if (moveVal > bestVal) {
            bestCol = c;
            bestRow = r;
            bestVal = moveVal;
          }
        }
      }
    }

    // console.log(`best position determined col: ${bestCol}`);
    // console.log(`best position determined row: ${bestRow}`);
    gameBoard.board[bestRow][bestCol] = symbol;
    displayController.displaySymbol(bestRow, bestCol, symbol);

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

  const resetBoard = () => {
    gameBoard.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  };

  return {
    board,
    checkEmptyPosition,
    checkVictory,
    makeOptimalMove,
    makeMove,
    resetBoard,
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

  // space.addEventListener('mouseenter', (event) => {
  //   const { className } = event.currentTarget;

  //   // Extract row and column from class name
  //   const row = parseInt(className.substring(9, 10)); // className = 'space row[#] col[#]'
  //   const col = parseInt(className.substring(14));

  //   if (!game.gameOver && gameBoard.checkEmptyPosition(row, col)) {
  //     displayController.displaySymbol(
  //       row,
  //       col,
  //       game.getPlayerSymbol(game.getCurrentPlayer())
  //     );
  //   }
  // });

  // space.addEventListener('mouseleave', (event) => {
  //   const { className } = event.currentTarget;
  //   console.log(`mouse left ${className}`);

  //   // Extract row and column from class name
  //   const row = parseInt(className.substring(9, 10)); // className = 'space row[#] col[#]'
  //   const col = parseInt(className.substring(14));

  //   if (!game.gameOver && gameBoard.checkEmptyPosition(row, col)) {
  //     displayController.clearSymbol(row, col);
  //   }
  // });
});

player1NameField.addEventListener('focusout', (event) => {
  game.updatePlayerName(1, player1NameField.textContent);
});

player2NameField.addEventListener('focusout', (event) => {
  game.updatePlayerName(2, player2NameField.textContent);
});

newGameBtn.addEventListener('click', () => {
  game.resetGame();
});

aiToggleBtn.addEventListener('click', () => {
  game.resetGame();
  game.vsComputer = !game.vsComputer;
  displayController.toggleAi();
});

xColor.addEventListener(
  'input',
  (event) => {
    document.querySelectorAll('.feather-x').forEach((x) => {
      x.style.stroke = event.target.value;
    });
  },
  false
);
xColor.addEventListener('change', (event) => {
  document.querySelectorAll('.feather-x').forEach((x) => {
    x.style.stroke = event.target.value;
  });
});

oColor.addEventListener(
  'input',
  (event) => {
    document.querySelectorAll('.feather-circle').forEach((o) => {
      o.style.stroke = event.target.value;
    });
  },
  false
);
oColor.addEventListener('change', (event) => {
  document.querySelectorAll('.feather-circle').forEach((o) => {
    o.style.stroke = event.target.value;
  });
});

// const player = (symbol) => ({ symbol });
game.setSymbols('X', 'O');
game.resetGame();
