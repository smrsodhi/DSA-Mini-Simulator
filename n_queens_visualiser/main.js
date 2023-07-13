const numberBox = document.querySelector('.number-box');
const slider = document.querySelector('.slider');

const playButton = document.querySelector('.play-button');
const abortButton = document.querySelector('.abort-button');

abortButton.disabled = true;

const arrangements = document.querySelector('.n-queen-arrangements');
const chessBoard = document.querySelector('.n-queen-board');

const queen = '<i class="fa-solid fa-crown"></i>';
const numOfArrangements = [0, 1, 0, 0, 2, 10, 4, 40, 92];

let n, q, Board;

let speed = (100 - slider.value) * 10;
slider.addEventListener('input', function () {
    speed = (100 - this.value) * 10;
});

class Queen {
    constructor() {
        this.position = {};
        this.uuid = [];
    }

    async clearColor(board) {
        for (let i = 0; i < n; i++) {
            const table = document.querySelector(`#table-${this.uuid[board]}`);
            const row = table.firstChild.childNodes[i];

            for (let j = 0; j < n; j++) {
                (i + j) & 1
                    ? (row.querySelectorAll('td')[j].style.backgroundColor = "#4362ee85")
                    : (row.querySelectorAll('td')[j].style.backgroundColor = "#f7258585");
            }
        }
    }

    async nQueen() {
        Board = 0;
        this.position[`${Board}`] = {};

        numberBox.disabled = true;
        abortButton.disabled = false;

        await q.solveQueen(Board, 0, n);
        await q.clearColor(Board);

        numberBox.disabled = false;
        abortButton.disabled = true;
    }

    async isValid(board, r, col, n) {
        const table = document.querySelector(`#table-${this.uuid[board]}`);
        const currRow = table.firstChild.childNodes[r];
        const currCol = currRow.querySelectorAll('td')[col];

        currCol.innerHTML = queen;

        await q.delay();

        // Checking if there's a queen in the same column
        for (let i = r - 1; i >= 0; i--) {
            const row = table.firstChild.childNodes[i];
            const column = row.querySelectorAll('td')[col];
            const value = column.innerHTML;

            if (value === queen) {
                column.style.backgroundColor = "#fb5607";
                currCol.innerHTML = "-";
                return false;
            }

            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // Checking if there's a queen in the upper left diagonal
        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            const row = table.firstChild.childNodes[i];
            const column = row.querySelectorAll('td')[j];
            const value = column.innerHTML;

            if (value === queen) {
                column.style.backgroundColor = "#fb5607";
                currCol.innerHTML = "-";
                return false;
            }

            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // Checking if there's a queen in the upper right diagonal
        for (let i = r - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            const row = table.firstChild.childNodes[i];
            const column = row.querySelectorAll('td')[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#fb5607";
                currCol.innerHTML = "-";
                return false;
            }

            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        return true;
    }

    async delay() {
        await new Promise((done) => setTimeout(() => done(), speed));
    };

    async solveQueen(board, r, n) {
        if (r == n) {
            Board++;

            const table = document.querySelector(`#table-${this.uuid[Board]}`);

            for (let k = 0; k < n; k++) {
                const row = table.firstChild.childNodes[k];
                row.querySelectorAll('td')[this.position[board][k]].innerHTML = queen;
            }

            this.position[Board] = this.position[board];

            return;
        }

        for (let i = 0; i < n; i++) {
            await q.delay();
            await q.clearColor(board);

            if (await q.isValid(board, r, i, n)) {
                await q.delay();
                await q.clearColor(board);

                let table = document.querySelector(`#table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];

                row.querySelectorAll('td')[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await q.solveQueen(board, r + 1, n))
                    await q.clearColor(board);

                await q.delay();

                board = Board;
                table = document.querySelector(`#table-${this.uuid[board]}`);

                row = table.firstChild.childNodes[r];
                row.querySelectorAll('td')[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }
}

playButton.addEventListener('click', async function () {
    n = numberBox.value;

    if (n === "Select number of Queens") {
        alert("Please select number of Queens!");
        return;
    }

    arrangements.innerHTML = "";
    chessBoard.innerHTML = "";

    const p = document.createElement('p');
    p.innerText = `Arrangements possible: ${numOfArrangements[n]}`;
    p.classList.add('queen-info');
    arrangements.appendChild(p);

    q = new Queen();
    if (chessBoard.childElementCount === 0) {
        for (let i = 0; i <= numOfArrangements[n]; i++) {
            q.uuid.push(i);

            const div = document.createElement('div');
            div.classList.add('arrangement-card');

            const header = document.createElement('h4');
            const table = document.createElement('table');

            header.innerText = `Arrangement ${i + 1}`;

            table.id = `table-${q.uuid[i]}`;
            header.id = `paragraph-${i}`;

            div.appendChild(header);
            div.appendChild(table);
            chessBoard.appendChild(div);
        }
    }

    for (let k = 0; k <= numOfArrangements[n]; k++) {
        const table = document.querySelector(`#table-${q.uuid[k]}`);

        for (let i = 0; i < n; i++) {
            const row = table.insertRow(i);
            row.id = `Row${i}`;

            for (let j = 0; j < n; j++) {
                const col = row.insertCell(j);
                col.innerHTML = "-";
            }
        }

        await q.clearColor(k);
    }

    await q.nQueen();
});

abortButton.addEventListener('click', function () {
    arrangements.innerHTML = "";
    chessBoard.innerHTML = "";
    this.disabled = true;
    numberBox.disabled = false;
})