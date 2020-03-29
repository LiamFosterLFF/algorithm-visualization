import React, { useState, useEffect, useRef } from 'react';
import { drawGrid, generateMaze, solveMaze, animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './pathfindingFunctions.js';

const Pathfinding = () => {
    const canvas = useRef(null);
    const [cellSize, setCellSize] = useState(5) // Fix this so that it's set with number of cells, not sizee !!!!
    const [canvasDimensions, setCanvasDimensions] = useState({width: cellSize*115, height: cellSize*115, x: 0, y: 0}) //FIX SO THAT SET PROGRAMMATICALLY
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
    }, [mazeGenerating, grid])



    const [backtrackingAnimations, setBacktrackingAnimations] = useState([])
    

    const [mazeSolving, setMazeSolving] = useState(false)
    useEffect(() => {
        if (mazeSolving) {
            const animations = solveMaze(grid)
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

        const [rowNo, colNo] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
        const totalCols = canvasDimensions.width / cellSize;
        const cellNo = rowNo*totalCols + colNo;

        const newGrid = [...grid];
        
        newGrid[cellNo][2] = (newGrid[cellNo][2] !== "path") ? "path" : "wall"
        setGrid(newGrid)
    };



    return (
        <div id="canvas">
            <canvas onClick={handleOnClick} ref={canvas}></canvas>
            <button onClick={() => setMazeGenerating(true)}>Generate Maze</button>
            <button onClick={() => setMazeSolving(true)}>Solve Maze</button>

        </div>
    )
}

export default Pathfinding;
