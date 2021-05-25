import React, { useState, useEffect, useRef } from 'react';
import { initializeGrid, generateMaze, clearCanvas, getFullCanvas } from './PathfindingFunctions/mazeGeneratingFunctions.js';

const Canvas = (props) => {
    const [ windowDimensions, setWindowDimensions ] = useState({width: window.innerWidth, height: window.innerHeight});
    
    // Calculate size of cells on basis of how many cells wide the maze should be (can be adjusted with slider)
    const [ noOfCellsAcross, setNoOfCellsAcross ] = useState(100)
    const [cellSize, setCellSize] = useState(Math.floor(windowDimensions.width / noOfCellsAcross)) 
    
    // Calculate size of canvas on basis of cell size

    const [canvasDimensions, setCanvasDimensions] = useState(calculateCanvasSize(windowDimensions, canvas))
        
    
    // Recalculate canvas dimensions every time window dimensions change
    useEffect(() => {

        setCanvasDimensions(calculateCanvasSize(windowDimensions, canvas))

        const fillGrid = getFullCanvas(canvas, cellSize)
        // setGrid(fillGrid)
    }, [windowDimensions])

    // Reset window dimension state every time window resized (w/ cleanup function)
    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        window.addEventListener('resize', handleResize);

        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })
    
        // // Yet another useEffect hook, do we really need this many?
        // // useEffect(() => {
        // //     const [initialGrid, x, y] = initializeGrid(canvas, cellSize, canvasDimensions)
        // //     setGrid(initialGrid)
        // //     setMazeGenerated(false)
        // //     const fillGrid = fillCanvas(canvas, cellSize)
        // //     setGrid(fillGrid)   
        // // }, [canvasDimensions, mazeGenAlgo, mazeSolveAlgo])
    

    
    
        //  // Screen clicking functionality - works by tracking if mouse is down and then drawing to the screen, currently
        //  const handleOnClick = (e) => {
            
        //     const [row, col] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
            
        //     const newGrid = [...grid];
    
        //     const ctx = canvas.current.getContext('2d');
        //     if (grid[row][col] !== "wall") {
        //         ctx.fillStyle = "#444";
        //         ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        //     } else {
        //         ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
        //     }
    
        //     newGrid[row][col] = (newGrid[row][col] === "wall") ? "wall" : "path"
        //     setGrid(newGrid)
        // };
    
        // const [mouseDown, setMouseDown] = useState(false)
        // const [fillType, setFillType] = useState("wall")
        // const handleMouseDown = (e) => {
        //     setMouseDown(true)
        //     const [row, col] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
        //     setFillType((grid[row][col] === "wall") ? "path" : "wall")
        // }
    
        // const handleMouseUp = (e) => {
        //     setMouseDown(false)
        // }
    
        // const handleMouseOut = (e) => {
        //     setMouseDown(false)
        // }
    
        // const handleMouseMove = (e) => {
        //     if (mouseDown) {
        //         const [row, col] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
    
        //         const newGrid = [...grid];
    
        //         const ctx = canvas.current.getContext('2d');
        //         if (fillType === "wall") {
        //             ctx.fillStyle = "#444";
        //             ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        //             newGrid[row][col] = "wall";
        //         } else {
        //             ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
        //             newGrid[row][col] = "path";
        //         }
    
        //         setGrid(newGrid)
        //     }
        // }

    return (

    )
}

export default Canvas;