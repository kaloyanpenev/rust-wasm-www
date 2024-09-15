import * as wasm from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg" 


const CELL_SIZE = 10; //px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const BORDER_SIZE = 1; //px

const universe = wasm.Universe.new();
universe.set_width(64);
universe.set_height(64);

const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + BORDER_SIZE) * height + BORDER_SIZE;
canvas.width = (CELL_SIZE + BORDER_SIZE) * width + BORDER_SIZE;

const ctx = canvas.getContext('2d');

const getIndex = (row, column) => {
    return row * width + column;
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // vertical lines
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + BORDER_SIZE) + BORDER_SIZE, 0);
        ctx.lineTo(i * (CELL_SIZE + BORDER_SIZE) + BORDER_SIZE, (CELL_SIZE + BORDER_SIZE) * height + BORDER_SIZE);
    }

    for (let i = 0; i <= height; i++) {
        ctx.moveTo(0, i * (CELL_SIZE + BORDER_SIZE) + BORDER_SIZE);
        ctx.lineTo((CELL_SIZE + BORDER_SIZE) * width + BORDER_SIZE, i * (CELL_SIZE + BORDER_SIZE) + BORDER_SIZE);
    }

    ctx.stroke();
}

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === wasm.Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + BORDER_SIZE) + BORDER_SIZE,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
}

let animationId = null;

const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    animationId = requestAnimationFrame(renderLoop);
}

const isPaused = () => {
    return animationId === null;
  };

const playPauseButton = document.getElementById("play-pause");

const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

// Mouse down event (left button held down) for drawing
canvas.addEventListener('mousedown', (e) => {
if (e.button === 0) { // 0 is for left mouse button
    canvas.addEventListener('mousemove', drawSquaresOnMouseMove);
}
});

// Mouse down event (left button held down) for drawing
canvas.addEventListener('click', (e) => {
    if (e.button === 0) { // 0 is for left mouse button
        const boundingRect = canvas.getBoundingClientRect();
        
        const scaleX = canvas.width / boundingRect.width;
        const scaleY = canvas.height / boundingRect.height;
        
        const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
        const canvasTop = (event.clientY - boundingRect.top) * scaleY;
        
        const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
        const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
        
        universe.toggle_cell(row, col);
        
        drawGrid();
        drawCells();
        }
    });

// Mouse up event (left button released) for drawing
canvas.addEventListener('mouseup', (e) => {
if (e.button === 0) {
    canvas.removeEventListener('mousemove', drawSquaresOnMouseMove);
}
});

// Mouse up event (left button released) for drawing
canvas.addEventListener('mouseleave', (e) => {
        canvas.removeEventListener('mousemove', drawSquaresOnMouseMove);
});

function drawSquaresOnMouseMove(e) {
    const boundingRect = canvas.getBoundingClientRect();
  
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;
  
    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;
  
    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
  
    universe.set_cell_status(row, col, wasm.Cell.Alive);
  
    drawGrid();
    drawCells();
  }

play();