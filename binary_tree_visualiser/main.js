// INITIAL LOGIC
const arrayInput = document.querySelector('.array-input');

const completeBt = document.querySelector('.complete-bt');
const maxHeap = document.querySelector('.max-heap');
const bst = document.querySelector('.bst');

const optionTitle = document.querySelector('.option-title');
const instructions = document.querySelector('.instructions');

const binaryTree = document.querySelector('.binary-tree');
const corrArr = document.querySelector('.corr-arr');

let input, inputText;
inputText = "10 20 60 30 70 40 50";
input = inputText.trim().split(' ').map(num => parseInt(num));
optionTitle.innerHTML = "Complete Binary Tree";
instructions.innerHTML = "A binary tree where all the levels are filled except possibly the last level. Also, all the nodes of the last level are as left as possible (this will only make sense if the last level is partially filled). Click any node of the tree or any value of the array to see the corresponding array/tree element. (Note: As the number of nodes increases, you might have to zoom out to view the proper binary tree)";
createCompleteBT(input, 0, binaryTree);

arrayInput.addEventListener('input', function () {
    inputText = this.value;
});

completeBt.addEventListener('click', function () {
    optionTitle.innerHTML = "Complete Binary Tree";
    instructions.innerHTML = "A binary tree where all the levels are filled except possibly the last level. Also, all the nodes of the last level are as left as possible (this will only make sense if the last level is partially filled). Click any node of the tree or any value of the array to see the corresponding array/tree element. (Note: As the number of nodes increases, you might have to zoom out to view the proper binary tree)";

    if (inputText.value !== "") {
        input = inputText.trim().split(' ').map(num => parseInt(num));
        createCompleteBT(input, 0, binaryTree);
    }
});

maxHeap.addEventListener('click', function () {
    optionTitle.innerHTML = "Binary Max Heap";
    instructions.innerHTML = "A complete binary tree where each node has a value greater or equal to both its children's. Click any node of the tree or any value of the array to see the corresponding array/tree element. (Note: As the number of nodes increases, you might have to zoom out to view the proper binary tree)";

    if (inputText !== "") {
        input = inputText.trim().split(' ').map(num => parseInt(num));
        buildHeap(input);
        createCompleteBT(input, 0, binaryTree);
    }
});

bst.addEventListener('click', function () {
    optionTitle.innerHTML = "Binary Search Tree";
    instructions.innerHTML = "A binary tree where each node has a value greater than all nodes in its left subtree and smaller than all nodes in its right subtree. (Note: As the number of nodes increases, you might have to zoom out to view the proper binary tree)";

    if (inputText.value !== "") {
        input = inputText.trim().split(' ').map(num => parseInt(num));
        input.sort();
        createBST(input, binaryTree);
    }
});

// FUNCTIONS
function buildHeap(arr) {
    for (let i = Math.floor((arr.length - 2) / 2); i >= 0; i--)
        heapify(arr, i);
}

function heapify(arr, i) {
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    let largest = i;

    if (l < arr.length && arr[l] > arr[largest])
        largest = l;
    if (r < arr.length && arr[r] > arr[largest])
        largest = r;

    if (largest != i) {
        swap(arr, i, largest);
        heapify(arr, largest);
    }
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

function createCompleteBT(arr, idx, parentDiv) {
    if (idx >= arr.length)
        return;

    parentDiv.innerHTML = `<span class="node">${arr[idx]}</span>`;

    const row = document.createElement('div');
    row.classList.add('row', 'level');

    const colLeft = document.createElement('div');
    colLeft.classList.add('col');
    createCompleteBT(arr, 2 * idx + 1, colLeft);

    const colRight = document.createElement('div');
    colRight.classList.add('col');
    createCompleteBT(arr, 2 * idx + 2, colRight);

    row.appendChild(colLeft);
    row.appendChild(colRight);

    parentDiv.appendChild(row);
}

function createBST(arr, parentDiv) {
    if (!arr.length)
        return;

    const mid = Math.floor(arr.length / 2);
    parentDiv.innerHTML = `<span class="node">${arr[mid]}</span>`;

    const row = document.createElement('div');
    row.classList.add('row', 'level');

    const colLeft = document.createElement('div');
    colLeft.classList.add('col');
    createBST(arr.slice(0, mid), colLeft);

    const colRight = document.createElement('div');
    colRight.classList.add('col');
    createBST(arr.slice(mid+1), colRight);

    row.appendChild(colLeft);
    row.appendChild(colRight);

    parentDiv.appendChild(row);
}