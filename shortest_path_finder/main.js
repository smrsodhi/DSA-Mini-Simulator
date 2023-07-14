const map = document.querySelector('.map');
const playButton = document.querySelector('.play-button');
const clearButton = document.querySelector('.clear-button');

clearButton.disabled = true;

const table = document.createElement('table');
const tbody = document.createElement('tbody');

const rowStart = 10, rowEnd = 10;
const colStart = 10, colEnd = 40;
const totalRows = 21, totalCols = 51;

for (let i = 0; i < totalRows; i++) {
    const newRow = document.createElement('tr');

    for (let j = 0; j < totalCols; j++) {
        const cell = document.createElement('td');
        cell.id = `node-${i}-${j}`;
        newRow.appendChild(cell);
    }

    tbody.appendChild(newRow);
}

table.appendChild(tbody);
map.appendChild(table);

// SHORTEST PATH FINDER
class ShortestPathFinder {
    constructor() {
        this.state = {
            grid: [],
            isMousePressed: false
        };
    }

    didComponentMount() {
        const newGrid = this.getInitialGrid();
        this.state.grid = newGrid;
    }

    getInitialGrid() {
        const grid = [];

        for (let row = 0; row < totalRows; row++) {
            const currRow = [];

            for (let col = 0; col < totalCols; col++) {
                currRow.push(this.createNode(row, col));
            }

            grid.push(currRow);
        }

        return grid;
    }

    createNode(row, col) {
        return {
            col, row,

            isStart: row === rowStart && col === colStart,
            isEnd: row === rowEnd && col === rowEnd,

            distance: Infinity,

            isVisited: false,
            isWall: false,

            previousNode: null
        };
    }

    initialise() {
        const start = document.querySelector(`#node-${rowStart}-${colStart}`);
        start.setAttribute('class', 'node-start');
        const end = document.querySelector(`#node-${rowEnd}-${colEnd}`);
        end.setAttribute('class', 'node node-end');
    }

    addEventListeners() {
        for (let i = 0; i < totalRows; i++) {
            for (let j = 0; j < totalCols; j++) {
                if (!(i === rowStart && j === colStart) && !(i === rowEnd && j === colEnd)) {
                    const cell = document.querySelector(`#node-${i}-${j}`);

                    cell.addEventListener('mousedown', this.onMouseDown.bind(this, i, j));
                    cell.addEventListener('mouseover', this.onMouseOver.bind(this, i, j));
                    cell.addEventListener('mouseup', this.onMouseUp.bind(this, i, j));
                }
            }
        }
    }

    onMouseDown(row, col) {
        const newGrid = this.getNewGrid(this.state.grid, row, col);
        this.state.grid = newGrid;
        this.state.isMousePressed = true;
    }

    onMouseOver(row, col) {
        if (!this.state.isMousePressed)
            return;

        const newGrid = this.getNewGrid(this.state.grid, row, col);
        this.state.grid = newGrid;
    }

    onMouseUp(_row, _col) {
        this.state.isMousePressed = false;
    }

    getNewGrid(grid, row, col) {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall
        };

        newGrid[row][col] = newNode;
        
        document
            .querySelector(`#node-${row}-${col}`)
            .classList.toggle('wall');

        return newGrid;
    }

    callDijkstra() {
        const { grid } = this.state;
        const startNode = grid[rowStart][colStart];
        const endNode = grid[rowEnd][colEnd];

        const visitedNodes = dijkstra(grid, startNode, endNode);
        const shortestPath = getShortestPath(endNode);

        this.animateDijsktra(visitedNodes, shortestPath);
    }

    animateDijsktra(visitedNodes, shortestPath) {
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                setTimeout(function () {
                    animateShortestPath(shortestPath);
                }, 10 * i);

                return;
            }

            setTimeout(function () {
                const node = visitedNodes[i];

                document
                    .querySelector(`#node-${node.row}-${node.col}`)
                    .setAttribute('class', 'node node-visited');
            }, 10 * i);
        }
    }
}

// DIJKSTRA'S ALGORITHM
function dijkstra(grid, startNode, endNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);

    startNode.distance = 0;

    while (unvisitedNodes.length > 0) {
        sortNodes(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall)
            continue;

        if (closestNode.distance === Infinity)
            return visitedNodes;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === endNode)
            return visitedNodes;

        dijkstraRelax(grid, closestNode);
    }
}

function getAllNodes(grid) {
    const nodes = [];

    for (let row of grid) {
        for (let node of row) {
            nodes.push(node);
        }
    }

    return nodes;
}

function sortNodes(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function dijkstraRelax(grid, node) {
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, node);

    for (let neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance + 1;
        neighbour.previousNode = node;
    }
}

function getUnvisitedNeighbours(grid, node) {
    const neighbours = [];
    const { row, col } = node;

    if (row > 0)
        neighbours.push(grid[row - 1][col]);

    if (row < grid.length - 1)
        neighbours.push(grid[row + 1][col]);

    if (col > 0)
        neighbours.push(grid[row][col - 1]);

    if (col < grid[0].length - 1)
        neighbours.push(grid[row][col + 1]);

    return neighbours.filter(neighbour => !neighbour.isVisited);
}

// FINDING THE SHORTEST PATH BY BACKTRACKING FROM THE END NODE
function getShortestPath(endNode) {
    const shortestPath = [];
    let currNode = endNode;

    while (currNode !== null) {
        shortestPath.unshift(currNode);
        currNode = currNode.previousNode;
    }

    return shortestPath;
}

function animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
        setTimeout(function () {
            const node = shortestPath[i];

            document
                .querySelector(`#node-${node.row}-${node.col}`)
                .setAttribute('class', 'node node-shortest-path');
        }, 50 * i);
    }

    clearButton.disabled = false;
}

// INITIAL LOGIC
let mySPF = new ShortestPathFinder();
mySPF.didComponentMount();
mySPF.initialise();
mySPF.addEventListeners();

playButton.addEventListener('click', function () {
    playButton.disabled = true;
    mySPF.callDijkstra();
});

clearButton.addEventListener('click', function () {
    for (let i = 0; i < totalRows; i++) {
        for (let j = 0; j < totalCols; j++) {
            const cell = document.querySelector(`#node-${i}-${j}`);
            cell.setAttribute('class', '');
        }
    }

    mySPF.didComponentMount();
    mySPF.initialise();

    playButton.disabled = false;
    clearButton.disabled = true;
});

