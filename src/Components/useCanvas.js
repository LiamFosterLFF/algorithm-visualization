import { useReducer } from 'react';
import { cloneDeep } from 'lodash';

const calculateCellDimensions = (noOfCellsAcross) => {
    const noOfCellsHigh = Math.ceil(noOfCellsAcross * .45)
    const normalizedNoOfCellsHigh = (noOfCellsHigh % 2 === 0)? noOfCellsHigh + 1 : noOfCellsHigh;
    return { 
        cols: noOfCellsAcross, 
        // noOfCellsAcross must always be odd for walls to match up
        rows: normalizedNoOfCellsHigh
    };
}

const calculateCanvasDimensions = (cellGridDimensions, cellSize) => {
    return {
        width: cellGridDimensions.cols * cellSize, 
        height: cellGridDimensions.rows * cellSize
    }
}

const getFilledCanvas = (cellGridDimensions) => {
    const {rows, cols} = cellGridDimensions;
    const fillGrid = [];
    for (let row = 0; row < rows; row++) {
        fillGrid.push([]);
        for (let col = 0; col < cols; col++) {
            fillGrid[row].push("wall");
        }
    }
    return fillGrid
}

const getClearedCanvas = (cellGridDimensions) => {
    const {rows, cols} = cellGridDimensions;
    const fillGrid = [];
    for (let row = 0; row < rows; row++) {
        fillGrid.push([]);
        for (let col = 0; col < cols; col++) {
            fillGrid[row].push("path");
        }
    }
    return fillGrid
}

const calculateCellSize = (windowInnerWidth, cellGridDimensions) => {
    // Canvas should be .8 the width of the window, but this has to be set in the cellSize so that they match up
    // Not doing it here makes it too confusing to match up the width and the height of the canvas
    const viewportWidthMultiplier = .8
    return viewportWidthMultiplier * windowInnerWidth / cellGridDimensions.cols
}

const calculateCellGridDimensions = (noOfCellsAcross) => {
    const noOfCellsHigh = Math.ceil(noOfCellsAcross * .45)
    const normalizedNoOfCellsHigh = (noOfCellsHigh % 2 === 0)? noOfCellsHigh + 1 : noOfCellsHigh;
    return { 
        cols: noOfCellsAcross, 
        // noOfCellsAcross must always be odd for walls to match up
        rows: normalizedNoOfCellsHigh
    };
}

const getMouseCellLocation = (mousePosition, cellSize) => {
    // Needs canvas to subtract size of bounding box
    const canvas = document.getElementById('canvas');
    const canvasBoundingBox = canvas.getBoundingClientRect();
    // Returns [row, col]
    return [Math.floor((mousePosition.y - canvasBoundingBox.y) / cellSize), Math.floor((mousePosition.x - canvasBoundingBox.x + .5) / cellSize)]
}

const initializeCanvas = (initialState) => {
    const windowInnerWidth = initialState.windowInnerWidth
    const cellGridDimensions = calculateCellDimensions(initialState.cellGridWidth)
    const cellSize = calculateCellSize(windowInnerWidth, cellGridDimensions)
    const canvasDimensions = calculateCanvasDimensions(cellGridDimensions, cellSize)
    return {
        windowInnerWidth,
        cellGridDimensions,
        cellSize,
        canvasDimensions,
        cellGrid: getFilledCanvas(cellGridDimensions),
        // Filled canvas, for use in maze re/generation
        filledCanvas: getFilledCanvas(cellGridDimensions),
        // Stored maze, for use in resetting
        storedMaze: getFilledCanvas(cellGridDimensions),
        // Boolean for use in drawing functionality
        isDrawing: false,
        // Value for flipping cells when drawing
        fillType: null,
        // Saving previous point allows us to catch all points dragged over (as browser event has fairly slow fire rate)
        previousPoint: [null, null]
    }
}

const canvasReducer = (canvas, action) => {   
    switch (action.type) {
        case "resize-canvas": {
            // Recalculate canvas dimensions every time window dimensions change
            const newWindowInnerWidth = action.payload.windowInnerWidth
            const newCellSize = calculateCellSize(newWindowInnerWidth, canvas.cellGridDimensions)
            const newCanvasDimensions = calculateCanvasDimensions(canvas.cellGridDimensions, newCellSize)
            return {
                ...canvas,
                windowInnerWidth: newWindowInnerWidth,
                cellSize: newCellSize,
                canvasDimensions: newCanvasDimensions,
                cellGrid: getFilledCanvas(canvas.cellGridDimensions),
                filledCanvas: getFilledCanvas(canvas.cellGridDimensions),
                storedMaze: getFilledCanvas(canvas.cellGridDimensions)
            }
        }
        case "resize-cell": {
            // Recalculate cell size based on slider movement
            const newCellGridDimensions = calculateCellGridDimensions(action.payload.newCellGridWidth)
            const newCellSize = calculateCellSize(canvas.windowInnerWidth, newCellGridDimensions);
            const newCanvasDimensions = calculateCanvasDimensions(newCellGridDimensions, newCellSize)
            return {
                ...canvas,
                cellGridDimensions: newCellGridDimensions,
                cellSize: newCellSize,
                canvasDimensions: newCanvasDimensions,
                cellGrid: getFilledCanvas(newCellGridDimensions),
                filledCanvas: getFilledCanvas(newCellGridDimensions),
                storedMaze: getFilledCanvas(newCellGridDimensions)
            }
        }
        case "handle-mouse-down": {
            const newCellGrid = cloneDeep(canvas.cellGrid);
            // Clicking changes the color of that cell, clicking + holding has separate (line-drawing) functionality
            const [row, col] = getMouseCellLocation(action.payload.mousePosition, canvas.cellSize);
            // Fill type remains constant as the opposite of cell content before the click, so you can draw lines after click
            const flippedCellContent = (newCellGrid[row][col] === "wall") ? "path" : "wall"
            newCellGrid[row][col] = flippedCellContent;
            return {
                ...canvas,
                isDrawing: true,
                previousPoint: [row, col],
                fillType: flippedCellContent,
                cellGrid: newCellGrid,
                storedMaze: cloneDeep(canvas.cellGrid)
            }
        }
        case "handle-mouse-out-up": {
            // Unclicking and moving out of frame/canvas turns drawing off
            return {
                ...canvas,
                isDrawing: false,
                previousPoint: [null, null]
            }
        }
        case "handle-mouse-move": {
            // Moving while mouse being held draws manhattan lines on the canvas (if drawing)
            const [row, col] = getMouseCellLocation(action.payload.mousePosition, canvas.cellSize);
            const isPreviousPoint = (row === canvas.previousPoint[0] && col === canvas.previousPoint[1])
            if (canvas.isDrawing && !isPreviousPoint) {
                const newCells = [...canvas.cellGrid];
                // Find all cells in between two points by:
                // Finding Manhattan distance values between the two points
                const [rowDiff, colDiff] = [row - canvas.previousPoint[0], col - canvas.previousPoint[1]];
                // Choosing which one is larger (in absolute terms)
                const maxDiff = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
                // Cycling through all cells in between previousPoint and current one
                // Add the smallest jump along the line between cells that will change value of one of the cells
                for (let i = 0; i < maxDiff; i++) {
                    const [rowJump, colJump] = [rowDiff * ((i+1) / maxDiff), colDiff * ((i+1) / maxDiff)];
                    const [mRow, mCol] = [Math.floor(canvas.previousPoint[0] + rowJump), Math.floor(canvas.previousPoint[1] + colJump)];
                    newCells[mRow][mCol] = canvas.fillType;
    
                }
                return {
                    ...canvas,
                    cellGrid: newCells,
                    storedMaze: cloneDeep(newCells),
                    previousPoint: [row, col]
                }
            }
            return {...canvas}
        }
        case "fill-cell-grid": {
            return {
                ...canvas,
                cellGrid: getFilledCanvas(canvas.cellGridDimensions),
                storedMaze: getFilledCanvas(canvas.cellGridDimensions)
            }
        }
        case "clear-cell-grid": {
            return {
                ...canvas,
                cellGrid: getClearedCanvas(canvas.cellGridDimensions),
                storedMaze: getClearedCanvas(canvas.cellGridDimensions)
            }
        }
        case "save-stored-maze": {
            return {
                ...canvas,
                storedMaze: action.payload.storedMaze
            }
        }
        case "load-stored-maze": {
            return {
                ...canvas,
                cellGrid: cloneDeep(canvas.storedMaze)
            }
        }

        case "animate-maze": {
            const newCellGrid = cloneDeep(canvas.cellGrid);
            for (let i = 0; i < action.payload.animations.length; i++) {
                const animation = action.payload.animations[i]
                const [row, col] = animation.location;
                newCellGrid[row][col] = animation.type;
            }
            return {
                ...canvas,
                cellGrid: newCellGrid
            }
        }
        // case "draw-cells": {
        //     const colorDict = {
        //         "wall": '#444',
        //         "path": '#fff',
        //         "node": "#0000ff",
        //         "searched": "#ff0000",
        //         "backtrack": "#ffff00"
        //     }
        //     const ctx = action.payload.cnv.getContext('2d');
        //     for (let row = 0; row < canvas.cellGrid.length; row++) {
        //         for (let col = 0; col < canvas.cellGrid[row].length; col++) {
        //             const cell = canvas.cellGrid[row][col];
                    
        //             ctx.fillStyle = colorDict[cell];
        //             ctx.fillRect(col * canvas.cellSize, row * canvas.cellSize, canvas.cellSize, canvas.cellSize);
        //         }
        //     }
        // }
        default:
            throw new Error()
    }
}

export const useCanvas = (initialState) => {
    return useReducer(canvasReducer, initializeCanvas(initialState))
}