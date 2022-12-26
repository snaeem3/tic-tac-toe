const gameWrapper = document.querySelector('#game-wrapper');
const spaces = document.querySelectorAll('.space');

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

    board[col][row] = symbol;
    console.table(board);
    return checkVictory();
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
  });
});

const player = (symbol) => ({ symbol });
