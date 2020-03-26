const colorPicker = document.querySelector('#colorPicker');
const submitButton = document.querySelector('#add');
const colorDiv = document.querySelector("#colors");
const colorCount = document.querySelector("#colorCount");
const createGrid = document.querySelector("#create");
const colorPickerDiv = document.querySelector("#colorDisplay");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const margin = 30;

let colorGrid = []

let colorChange = false;
let colorArray = [];

colorPicker.addEventListener("change", (event) => {
    colorChange = true;
    colorPickerDiv.setAttribute('style',`background-color:${colorPicker.value}`);
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
        console.log(colorArray);
        colorChange = false;
        colorCount.innerHTML = `${colorArray.length} colors selected`;
        const div = document.createElement("DIV");
        div.setAttribute('class', 'colorShow');
        div.setAttribute('style',`background-color:${colorArray[colorArray.length - 1].hex}`);
        colorDiv.appendChild(div);
        colorPickerDiv.setAttribute('style',`background-color:white`);
    }else {
        alert('No color is selected');

    }
});

createGrid.addEventListener("click", (event) => {
    if(colorArray.length > 5) {
        makeColorArray(8,6);
        drawGrid(8,6);
        console.log(colorGrid);
    }else {
        alert('Select at least 6 colors')
    }

});

function makeColorArray(rows,columns) 
{
    colorGrid = [];
    for (let i = 0; i < rows; i++) {
        let columnColors = [];
        for (let j = 0; j < columns; j++) {
            let colorToAdd = colorArray[Math.floor(Math.random() * colorArray.length)].hex;

            let colorsChecked = 1;
            let similar = true;

            while (similar){
                similar = false;
                
                // Check in 3x3 grid if similar
                if((j != 0 && columnColors[j - 1] == colorToAdd) || 
                   (i != 0 && j != 0 && colorGrid[i - 1][j - 1] == colorToAdd) ||
                   (i != 0 && colorGrid[i - 1][j] == colorToAdd) ||
                   (i != 0 && j + 1 < columns && colorGrid[i - 1][j + 1] == colorToAdd)) {
                    
                    colorToAdd = colorArray[Math.floor(Math.random() * colorArray.length)].hex;
                    console.log("generate new color " + colorToAdd + " at " + i + " " + j);
                }
                
                colorsChecked++;
                
                if(colorsChecked == colorArray.length && similar) {
                    similar = false;
                    console.log("not possible i : " + i + " j : " + j,colorGrid, columnColors);
                }
            }
            columnColors.push(colorToAdd);
        }
        colorGrid.push(columnColors);
    }
}

function drawGrid(rows,columns) 
{
    let size = 50;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            ctx.beginPath();
            ctx.fillStyle = colorGrid[i][j];
            ctx.fillRect(10 + ((size + margin) * j),10 + ((size + margin) * i),size,size);
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
