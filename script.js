const gameWrapper = document.querySelector('#game-wrapper');

const gameBoard = (() => {
    let board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    const makeMove = (col,row,symbol) => {
        if (!checkEmptyPosition(col,row)) {
            console.error('position is not empty');
            return;
        }

        board[col][row] = symbol;
    }

    const checkEmptyPosition = (col,row) => {
        return board[col][row] === '';
    }
    
    return {
        board,
        makeMove,
    };
})();
