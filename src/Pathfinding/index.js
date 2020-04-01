import React, { useState, useEffect, useRef } from 'react';
import { initializeGrid, generateMaze, solveMaze, nodeFinder, animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack, clearCanvas, fillCanvas } from './pathfindingFunctions.js';

const Pathfinding = () => {
    const canvas = useRef(null);
    const [cellSize, setCellSize] = useState(60) // Fix this so that it's set with number of cells, not sizee !!!!
    const [canvasDimensions, setCanvasDimensions] = useState({width: cellSize*9, height: cellSize*9, x: 0, y: 0}) //FIX SO THAT SET PROGRAMMATICALLY
    const [grid, setGrid] = useState([])
    const [mazeAnimations, setMazeAnimations] = useState({ drawingAnimations: [], nodeAnimations: [] })
    const [solvingAnimations, setSolvingAnimations] = useState([])
    const [drawSpeed, setDrawSpeed] = useState(80)

    useEffect(() => {
        const [initialGrid, x, y] = initializeGrid(canvas, cellSize, canvasDimensions)
        
        setGrid(initialGrid)
        setCanvasDimensions({
            ...canvasDimensions,
            x,
            y
        })

    }, [])

    
    

    

    const [mazeGenerating, setMazeGenerating] = useState(false)

    useEffect(() => {
        
        if(mazeGenerating) {
            const fillGrid = fillCanvas(canvas, cellSize)

            const [mazeGrid, drawingAnimations, mazeFinished] = generateMaze(fillGrid)
            mazeAnimations.drawinganimations = drawingAnimations

            const nodeAnimations = nodeFinder(mazeGrid)
            console.log(nodeAnimations);
            
            setMazeAnimations({ drawingAnimations: drawingAnimations, nodeAnimations: nodeAnimations })
            setGrid(mazeGrid)
            if (mazeFinished) {
                setMazeGenerating(false)
            }

        }
    }, [mazeGenerating])



    const [backtrackingAnimations, setBacktrackingAnimations] = useState([])
    

    const [mazeSolving, setMazeSolving] = useState(false)
    useEffect(() => {
        if (mazeSolving) {
            const defaults = { enter: [0, 1], exit: [grid.length - 1, grid[0].length - 2], start: [1, 1] };
            const animations = solveMaze(grid, defaults)
            setSolvingAnimations(animations.solvingAnimations)
            setBacktrackingAnimations(animations.backtrackingAnimations)
            setMazeSolving(false)
        }
        
    }, [mazeSolving, grid])


    

    useEffect(() => {
        animateMazeDrawing(mazeAnimations, canvas, cellSize, drawSpeed)
    }, [mazeAnimations]);


    

    useEffect(() => {
        animateMazeSolving(solvingAnimations, canvas, cellSize, drawSpeed)
    }, [ solvingAnimations]);

    

    useEffect(() => {
        const delay = solvingAnimations.length * drawSpeed;
        animateMazeSolvingBacktrack(backtrackingAnimations, canvas, cellSize, drawSpeed, delay)
    }, [backtrackingAnimations]);
    
    const handleOnClick = (e) => {
        
        const [row, col] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
        
        const newGrid = [...grid];

        const ctx = canvas.current.getContext('2d');
        if (grid[row][col] !== "wall") {
            ctx.fillStyle = "#444";
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        } else {
            ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }

        newGrid[row][col] = (newGrid[row][col] === "wall") ? "wall" : "path"
        setGrid(newGrid)
    };


    const [mouseDown, setMouseDown] = useState(false)
    const [fillType, setFillType] = useState("wall")
    const handleMouseDown = (e) => {
        setMouseDown(true)
        console.log(e);
        const [row, col] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
        setFillType((grid[row][col] === "wall") ? "path" : "wall")
    }

    const handleMouseUp = (e) => {
        setMouseDown(false)
    }

    const handleMouseOut = (e) => {
        setMouseDown(false)
    }

    const handleMouseMove = (e) => {
        if (mouseDown) {
            const [row, col] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];

            const newGrid = [...grid];

            const ctx = canvas.current.getContext('2d');
            if (fillType === "wall") {
                ctx.fillStyle = "#444";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                newGrid[row][col] = "wall";
            } else {
                ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
                newGrid[row][col] = "path";
            }

            setGrid(newGrid)
        }
    }

    const handleClearCanvas = () => {
        const clearGrid = clearCanvas(canvas, cellSize)
        setGrid(clearGrid)
    }

    const handleFillCanvas = () => {
        const fillGrid = fillCanvas(canvas, cellSize)
        setGrid(fillGrid)
    }

    return (
        <div id="canvas">
            <button onClick={handleClearCanvas}>Clear</button>
            <button onClick={handleFillCanvas}>Fill</button>
            <canvas onClick={handleOnClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} ref={canvas}></canvas>
            <button onClick={() => setMazeGenerating(true)}>Generate Maze</button>
            <button onClick={() => setMazeSolving(true)}>Solve Maze</button>

        </div>
    )
}

export default Pathfinding;
