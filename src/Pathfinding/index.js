import React, { useState, useEffect, useRef } from 'react';
import { drawGrid, generateMaze, solveMaze, animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './pathfindingFunctions.js';

const Pathfinding = () => {
    const canvas = useRef(null);
    const [cellSize, setCellSize] = useState(20) // Fix this so that it's set with number of cells, not sizee !!!!
    const [canvasDimensions, setCanvasDimensions] = useState({width: cellSize*45, height: cellSize*45, x: 0, y: 0}) //FIX SO THAT SET PROGRAMMATICALLY
    const [grid, setGrid] = useState([])
    const [animations, setAnimations] = useState([])
    const [solvingAnimations, setSolvingAnimations] = useState([])

    useEffect(() => {
        const [grid, x, y] = drawGrid(canvas, cellSize, canvasDimensions)
        
        setGrid(grid)
        setCanvasDimensions({
            ...canvasDimensions,
            x,
            y
        })

    }, [])

    


    

    const [mazeGenerating, setMazeGenerating] = useState(false)

    useEffect(() => {
        
        if(mazeGenerating) {
            const [mazeGrid, mazeAnimations, mazeFinished] = generateMaze(grid)
    
            setAnimations(mazeAnimations)
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

    const [drawSpeed, setDrawSpeed] = useState(10)

    

    useEffect(() => {
        animateMazeDrawing(animations, canvas, cellSize, drawSpeed)
    }, [animations]);

    

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
    const handleMouseDown = (e) => {
        setMouseDown(true)
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
            if (grid[row][col] !== "wall") {
                ctx.fillStyle = "#444";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            } else {
                ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }

            newGrid[row][col] = (newGrid[row][col] === "wall") ? "wall" : "path"
            setGrid(newGrid)
        }
    }

    return (
        <div id="canvas">
            <canvas onClick={handleOnClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} ref={canvas}></canvas>
            <button onClick={() => setMazeGenerating(true)}>Generate Maze</button>
            <button onClick={() => setMazeSolving(true)}>Solve Maze</button>

        </div>
    )
}

export default Pathfinding;
