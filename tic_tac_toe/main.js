const COMPUTER = 1, HUMAN = 2, SIDE = 3;

const X = `<i class="fa-solid fa-x always-blue"></i>`;
const O = `<i class="fa-solid fa-o always-red"></i>`

const xButton = document.querySelector('.start-x');
const oButton = document.querySelector('.start-o');
const result = document.querySelector('.result');
const cells = document.querySelectorAll('td');

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

let moveIndex, whoseTurn;
let COMPUTERMOVE, HUMANMOVE;

xButton.addEventListener('click', function () {
    xButton.disabled = true;
    oButton.disabled = true;
    
    whoseTurn = HUMAN;
    COMPUTERMOVE = O;
    HUMANMOVE = X;

    moveIndex = 0;
    initialiseBoard();
    showBoard();

    cells.forEach(function (cell) {
        cell.addEventListener('click', handleCellClick)
    });
});

oButton.addEventListener('click', function () {
    xButton.disabled = true;
    oButton.disabled = true;

    whoseTurn = COMPUTER;
    COMPUTERMOVE = X;
    HUMANMOVE = O;

    moveIndex = 0;
    initialiseBoard();
    showBoard();

    const { x: compX, y: compY } = bestMove(moveIndex);
    board[compX][compY] = COMPUTERMOVE;
    showBoard();
    moveIndex++;
    whoseTurn = HUMAN;

    cells.forEach(function (cell) {
        cell.addEventListener('click', handleCellClick)
    });
});

function initialiseBoard() {
    for (let i = 0; i < SIDE; i++) {
        for (let j = 0; j < SIDE; j++) {
            board[i][j] = '';
        }
    }

    result.innerHTML = "";
}

function showBoard() {
    for (let i = 0; i < SIDE; i++) {
        for (let j = 0; j < SIDE; j++) {
            cells[i * SIDE + j].innerHTML = board[i][j];
        }
    }
}

function handleCellClick(event) {
    if (whoseTurn === COMPUTER) return;

    const cellIndex = Array.from(cells).indexOf(event.target);
    const x = Math.floor(cellIndex / SIDE);
    const y = cellIndex % SIDE;

    if (board[x][y] === '') {
        board[x][y] = HUMANMOVE;
        showBoard();
        moveIndex++;

        if (gameOver()) {
            declareWinner(whoseTurn);
        } else if (moveIndex === SIDE * SIDE) {
            result.innerHTML = "It's a draw :|";
            xButton.disabled = false;
            oButton.disabled = false;
        } else {
            whoseTurn = COMPUTER;
            const { x: compX, y: compY } = bestMove(moveIndex);
            board[compX][compY] = COMPUTERMOVE;
            showBoard();
            moveIndex++;
            if (gameOver()) {
                declareWinner(whoseTurn);
                xButton.disabled = false;
                oButton.disabled = false;
            } else if (moveIndex === SIDE * SIDE) {
                result.innerHTML = "It's a draw :|";
                xButton.disabled = false;
                oButton.disabled = false;
            } else {
                whoseTurn = HUMAN;
            }
        }
    } else {
        alert('Position is occupied, select any one place from the available places.');
    }
}

function gameOver() {
    return rowCrossed() || columnCrossed() || diagonalCrossed();
}

function declareWinner(whoseTurn) {
    if (whoseTurn === COMPUTER) {
        result.innerHTML = "Computer won :(";
    } else {
        result.innerHTML = "You won :)";
    }
}

function bestMove(moveIndex) {
    let x = -1;
    let y = -1;
    let score = 0;
    let bestScore = -999;

    for (let i = 0; i < SIDE; i++) {
        for (let j = 0; j < SIDE; j++) {
            if (board[i][j] === '') {
                board[i][j] = COMPUTERMOVE;
                score = minimax(moveIndex + 1, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    x = i;
                    y = j;
                }
            }
        }
    }
    return { x, y };
}

function minimax(depth, isAI) {
    let score = 0;
    let bestScore = 0;

    if (gameOver()) {
        return isAI ? -10 : 10;
    } else {
        if (depth < 9) {
            if (isAI) {
                bestScore = -999;
                for (let i = 0; i < SIDE; i++) {
                    for (let j = 0; j < SIDE; j++) {
                        if (board[i][j] === '') {
                            board[i][j] = COMPUTERMOVE;
                            score = minimax(depth + 1, false);
                            board[i][j] = '';
                            if (score > bestScore) {
                                bestScore = score;
                            }
                        }
                    }
                }
                return bestScore;
            } else {
                bestScore = 999;
                for (let i = 0; i < SIDE; i++) {
                    for (let j = 0; j < SIDE; j++) {
                        if (board[i][j] === '') {
                            board[i][j] = HUMANMOVE;
                            score = minimax(depth + 1, true);
                            board[i][j] = '';
                            if (score < bestScore) {
                                bestScore = score;
                            }
                        }
                    }
                }
                return bestScore;
            }
        } else {
            return 0;
        }
    }
}

function rowCrossed() {
    for (let i = 0; i < SIDE; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
            return true;
        }
    }
    return false;
}

function columnCrossed() {
    for (let i = 0; i < SIDE; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
            return true;
        }
    }
    return false;
}

function diagonalCrossed() {
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        return true;
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
        return true;
    }
    return false;
}