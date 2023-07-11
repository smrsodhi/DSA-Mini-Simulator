// INITIAL LOGIC
let domain = /[1-9]/;

const sudokuBoard = document.querySelector('.sudoku-board');
sudokuBoard.addEventListener('keyup', function (event) {
    if (event.target && event.target.nodeName === "TD") {
        let cell = event.target;

        if (cell.innerText.length > 0 && domain.test(cell.innerText[0])) {
            cell.innerText = cell.innerText[0];
        } else {
            cell.innerText = "";
        }
    }
});

const solve = document.querySelector('#solve');
solve.addEventListener('click', function (_event) {
    let boardString = boardToString();
    let solution = solver(boardString);

    if (solution) {
        stringToBoard(solution);
    } else {
        alert('Invalid Board');
    }
});

const clear = document.querySelector('#clear');
clear.addEventListener('click', clearBoard);

// FUNCTIONS
function boardToString() {
    let boardString = "";
    let cells = document.querySelectorAll('td');

    for (let i = 0; i < cells.length; i++) {
        if (domain.test(cells[i].innerText)) {
            boardString += cells[i].innerText;
        } else {
            boardString += "-";
        }
    }

    return boardString;
}

function clearBoard() {
    let cells = document.querySelectorAll('td');

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
    }
}

function stringToBoard(solution) {
    let cellValues = solution.split('');
    let cells = document.querySelectorAll('td');

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = cellValues[i];
    }
}

// ACTUAL SOLVER FUNCTIONS
function solver(boardString) {
    let boardArr = boardString.split('');

    if (!isValidBoard(boardArr)) {
        return false;
    }

    return solveUtil(boardString);
}

function solveUtil(boardString) {
    let boardArr = boardString.split('');

    if (isSolvedBoard(boardArr)) {
        return boardArr.join('');
    }

    let cellAndPossibilities = getNextCellandPossibilities(boardArr);
    let nextCellIdx = cellAndPossibilities.nextCellIdx;
    let possibilities = cellAndPossibilities.possibilities;

    for (let i = 0; i < possibilities.length; i++) {
        boardArr[nextCellIdx] = possibilities[i];
        let solvedBoard = solveUtil(boardArr.join(''));

        if (solvedBoard) {
            return solvedBoard;
        }
    }

    return false;
}

function getNextCellandPossibilities(boardArr) {
    for (let i = 0; i < boardArr.length; i++) {
        if (boardArr[i] === "-") {
            let existingValues = getAllIntersections(boardArr, i);
            let nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

            let possibleNums = nums.filter(function (num) {
                return existingValues.indexOf(num) === -1;
            });

            return {
                nextCellIdx: i,
                possibilities: possibleNums
            };
        }
    }
}

function getAllIntersections(boardArr, idx) {
    let row = getRow(boardArr, idx);
    let col = getCol(boardArr, idx);
    let box = getBox(boardArr, idx);

    return row.concat(col).concat(box);
}

function isSolvedBoard(boardArr) {
    return boardArr.indexOf('-') === -1;
}

function isValidBoard(boardArr) {
    return areValidRows(boardArr) && areValidCols(boardArr) && areValidBoxes(boardArr);
}

function areValidRows(boardArr) {
    let rowIndices = [0, 9, 18, 27, 36, 45, 54, 63, 72];

    let rows = rowIndices.map(function (rowIdx) {
        return getRow(boardArr, rowIdx);
    });

    return rows.reduce(function (validity, row) {
        return validity && isValidCollection(row);
    }, true);
}

function areValidCols(boardArr) {
    let colIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let cols = colIndices.map(function (colIdx) {
        return getCol(boardArr, colIdx);
    });

    return cols.reduce(function (validity, col) {
        return validity && isValidCollection(col);
    }, true);
}

function areValidBoxes(boardArr) {
    let boxIndices = [0, 3, 6, 27, 30, 33, 54, 57, 60];

    let boxes = boxIndices.map(function (boxIdx) {
        return getBox(boardArr, boxIdx);
    });

    return boxes.reduce(function (validity, box) {
        return validity && isValidCollection(box);
    }, true);
}

function getRow(boardArr, rowIdx) {
    rowIdx = Math.floor(rowIdx / 9) * 9;
    return boardArr.slice(rowIdx, rowIdx + 9);
}

function getCol(boardArr, colIdx) {
    colIdx = Math.floor(colIdx % 9);
    let colIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    return colIndices.map(function (x) {
        return boardArr[colIdx + (x * 9)];
    });
}

function getBox(boardArr, boxIdx) {
    let boxRow = Math.floor(boxIdx / 27);
    let boxCol = Math.floor(boxIdx / 3) % 3;

    boxIdx = (boxRow * 27) + (boxCol * 3);

    let boxIndices = [0, 1, 2, 9, 10, 11, 18, 19, 20];

    return boxIndices.map(function (x) {
        return boardArr[boxIdx + x];
    });
}

function isValidCollection(collection) {
    let freq = {};

    for (let i = 0; i < collection.length; i++) {
        if (collection[i] !== "-") {
            if (freq[collection[i]] === undefined) {
                freq[collection[i]] = 1;
            } else {
                return false;
            }
        }
    }

    return true;
}