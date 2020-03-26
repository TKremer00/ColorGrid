const colorPicker = document.querySelector('#colorPicker');
const submitButton = document.querySelector('#add');
const colorDiv = document.querySelector("#colors");
const colorCount = document.querySelector("#colorCount");
const createGrid = document.querySelector("#create");
const colorPickerDiv = document.querySelector("#colorDisplay");
const errors = document.querySelector("#errors");
const rowsDiv = document.querySelector("#rows");
const columnsDiv = document.querySelector("#columns");

let rows = 3;
let columns = 3;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const margin = 30;
const startPoint = 10;
const size = 50;
const maxTrys = 20;
let trys = 0;

let colorGrid = []

let colorChange = false;
let colorArray = [];

colorPicker.addEventListener("change", (event) => {
    colorChange = true;
    colorPickerDiv.setAttribute('style',`background-color:${colorPicker.value};color:${colorPicker.value}`);
});

colorPickerDiv.addEventListener("click", (event) => {
    colorPicker.focus();
    colorPicker.click();
});

submitButton.addEventListener("click", (event) => {
    if(colorChange)
    {
        const color = {
            hex:"",
            rgb:[],
        };
        color.hex = colorPicker.value;
        color.rgb = hexToRgb(color.hex);
        colorArray.push(color);
        colorChange = false;
        colorCount.innerHTML = `${colorArray.length} colors selected`;
        const div = document.createElement("DIV");
        div.setAttribute('class', 'colorShow');
        div.setAttribute('style',`background-color:${colorArray[colorArray.length - 1].hex}`);
        colorDiv.appendChild(div);
        colorPickerDiv.setAttribute('style',`background-color:white;color:black`);
    }else {
        alert('No color is selected');

    }
});

createGrid.addEventListener("click", (event) => {
    if(colorArray.length > 5) {
        columns = columnsDiv.value;
        rows = rowsDiv.value;
        makeColorArray();
        calculateCanvasSize();
        drawGrid();
        errors.innerHTML = "";
    }else {
        alert('Select at least 6 colors')
    }

});

function makeColorArray() 
{
    colorGrid = [];
    let impossible = false;
    for (let i = 0; i < rows; i++) {
        let columnColors = [];
        let cantAdd = false; 
        for (let j = 0; j < columns; j++) {
            let colorToAdd = colorArray[Math.floor(Math.random() * colorArray.length)].hex;

            let colorsChecked = 1;
            let similar = true;
            let checkedColors = [];
            while (similar){
                similar = false;
                
                // Check in 3x3 grid if similar
                // check left 
                if(j != 0) 
                {
                    if(columnColors[j - 1] === colorToAdd){               
                        similar = true;
                    }
                }

                if(i != 0) 
                {
                    // check top left
                    if(colorGrid[i - 1][j - 1] === colorToAdd) {
                        similar = true;
                    }

                    // check top
                    if(colorGrid[i - 1][j] === colorToAdd) {
                        similar = true;
                    }

                    // check top right
                    if(j + 1 < columns && colorGrid[i - 1][j + 1] === colorToAdd) {
                        similar = true;
                    }
                }
    
                colorsChecked++;
                
                if(similar) {
                    checkedColors.push(colorToAdd);
                    colorToAdd = colorArray[Math.floor(Math.random() * colorArray.length)].hex;

                    while(checkedColors.includes(colorToAdd)) 
                    {
                        colorToAdd = colorArray[Math.floor(Math.random() * colorArray.length)].hex;
                    }
                }

                if(colorsChecked == colorArray.length && similar) 
                {
                    similar = false;
                    impossible = true;
                }
            }
            columnColors.push(colorToAdd);
        }
        if(impossible && trys < maxTrys) {
            trys++;
            makeColorArray(rows,columns);
        }
        colorGrid.push(columnColors);
    }
}

function drawGrid() 
{
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            ctx.beginPath();
            ctx.fillStyle = colorGrid[i][j];
            ctx.fillRect(startPoint + ((size + margin) * j),startPoint + ((size + margin) * i),size,size);
        }
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function calculateCanvasSize() {
    let w = (columns * size) + (columns * margin) - startPoint;
    let h = (rows * size) + (rows * margin) - startPoint;
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
}