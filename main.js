const COLOR_GRID = []
const SPACING = 30;
const DRAW_SIZE = 50;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const COLORS = [];

let ROWS = 3;
document.querySelector("#rows", "change", e => { ROWS = e.target.value; });
let COLS = 3;
document.querySelector("#cols", "change", e => { COLS = e.target.value; });

document.querySelector("#colorDisplay").addEventListener("click", () => colorPicker.click());

document.querySelector('#colorPicker').addEventListener("change", () => {
    document.querySelector("#colorDisplay").setAttribute('style',`background-color:${colorPicker.value};color:${colorPicker.value}`);
});

document.querySelector('#add').addEventListener("click", (event) => {
    const newColor = colorPicker.value;
    if(!newColor || COLORS.includes(newColor)) {
        alert("No color or duplicate color chosen");
        return;
    }

    COLORS.push(newColor);
    document.querySelector("#colorCount").innerHTML = `${COLORS.length} colors selected`;

    const div = document.createElement("div");
    div.setAttribute('class', 'colorShow');
    div.setAttribute('style',`background-color:${COLORS[COLORS.length - 1]}`);
    
    document.querySelector("#selectedColors").appendChild(div);
    document.querySelector('#colorDisplay').setAttribute('style',`background-color:white;color:black`);
});

document.querySelector("#create").addEventListener("click", e => {
    if(COLORS.length < 6) {
        alert('Select at least 6 colors');
        return;
    }

    fillGrid();
    let _ = solve();
    drawGrid();
});

function fillGrid() {
    for (let i = 0; i < ROWS; i++) {
        let row = [];
        COLOR_GRID.push(row);
        for (let j = 0; j < COLS; j++) {
            row.push(undefined);
        }
    }
}

function validateColorAtPosition(row, column, color) {
    for (let i = row - 1; i <= row + 1; i++) {
        if(i < 0 || i >= ROWS) continue;

        for (let j = column - 1; j <= column + 1; j++) {
            if((j < 0 || j >= COLS) || (j == column && i == row)) continue;
            const colorAtColumn = COLOR_GRID[i][j];
            
            if(colorAtColumn == color) {
                return false;
            }
        }
    }

    return true;
}

function findEmpty() {
    for (let i = 0; i < COLOR_GRID.length; i++) {
        for (let j = 0; j < COLOR_GRID[i].length; j++) {
            if(COLOR_GRID[i][j] == undefined) {
                return [i, j];
            }
            
        }
    }
    return undefined;
}

function solve() {
    const emptyField = findEmpty();

    if(!emptyField) {
        return true;
    }
    
    const [row, column] = emptyField;

    for (let i = 0; i < COLORS.length; i++) {
        if(validateColorAtPosition(row, column, COLORS[i])) {
            COLOR_GRID[row][column] = COLORS[i];

            if(solve()) {
                return true;
            }

            COLOR_GRID[row][column] = undefined;
        }
    }

    return false;
}

function drawGrid() {
    canvas.setAttribute("width", (COLS * DRAW_SIZE) + (COLS * SPACING));
    canvas.setAttribute("height", (ROWS * DRAW_SIZE) + (ROWS * SPACING));

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            ctx.beginPath();
            ctx.fillStyle = COLOR_GRID[i][j];
            console.log("x", (DRAW_SIZE + SPACING) * j);
            console.log("y", (DRAW_SIZE + SPACING) * i);
            ctx.fillRect((DRAW_SIZE + SPACING) * j, (DRAW_SIZE + SPACING) * i, DRAW_SIZE, DRAW_SIZE);
        }
    }    
}
