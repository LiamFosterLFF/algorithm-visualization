import React, { useState, useEffect, useRef } from 'react';
import { initializeGrid, generateMaze, clearCanvas, fillCanvas } from './PathfindingFunctions/mazeGeneratingFunctions.js';
import { solveMaze, nodeFinder } from './PathfindingFunctions/mazeSolvingFunctions.js';
import { animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './PathfindingFunctions/mazeAnimatingFunctions.js';


const Pathfinding = () => {
    const canvas = useRef(null);
    const [cellSize, setCellSize] = useState(10) // Fix this so that it's set with number of cells, not sizee !!!!
    const [canvasDimensions, setCanvasDimensions] = useState({width: cellSize*51, height: cellSize*51, x: 0, y: 0}) //FIX SO THAT SET PROGRAMMATICALLY
    const [grid, setGrid] = useState([])
    const [mazeAnimations, setMazeAnimations] = useState({ drawingAnimations: [], nodeAnimations: [] })
    const [solvingAnimations, setSolvingAnimations] = useState([])
    const [drawSpeed, setDrawSpeed] = useState(0)
    const [mazeGenAlgo, setMazeGenAlgo] = useState("eller's")
    const [mazeSolveAlgo, setMazeSolveAlgo] = useState("depthFirst")

    useEffect(() => {
        const [initialGrid, x, y] = initializeGrid(canvas, cellSize, canvasDimensions)
        console.log(window.innerHeight);
        
        setGrid(initialGrid)
        setCanvasDimensions({
            ...canvasDimensions,
            x,
            y
        })

    }, [])

    
    

    // Get all algorithms to work on the non-maze board
    // Once finished, fix up website and prepare for deployment

    // Possible add-ons
        // Pixelpainting descrambler
        // Other maze-building algos - Hunt & kill, sidewinder, prims, kruskal, ellers
        // Other algorithms - 
            // Pathfinding - best first search
            // Sorting Heap Sort
        // More animations - 
            //Pathfinding - show red backtrack and removal for backtracking building algo, current node highlighted in green, path in rainbow colors, show nodes of node graph and connnxns, make a binary search tree and animate it being built
            // Sorting - 
        // More functionality 
            //Pathfinding - can go forwards and reverse, adjust number of loops, adjust size, adjust speed, reset maze solve or build, make it possible to skip animations, random wall generation, A* draws the optimal path, Dijkstra draws the optimal path?

    

    const [mazeGenerating, setMazeGenerating] = useState(false)

    useEffect(() => {
        
        if(mazeGenerating) {
            const fillGrid = fillCanvas(canvas, cellSize)

            const [mazeGrid, animations, mazeFinished] = generateMaze(fillGrid, mazeGenAlgo)

            setMazeAnimations(animations)
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
            const animations = solveMaze(grid, defaults, mazeSolveAlgo)
            console.log("maze done");
            
            setSolvingAnimations(animations.solvingAnimations)
            setBacktrackingAnimations(animations.backtrackingAnimations)
            setMazeSolving(false)
        }
        
    }, [mazeSolving, grid])


    

    useEffect(() => {
        const test = animateMazeDrawing(mazeAnimations, canvas, cellSize, drawSpeed);
        console.log(test);
        
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
        <div>
            <div className="nav-bar">
                <div className="gen-algo-bar">
                    <button onClick={() => setMazeGenAlgo("eller's")}>Eller's</button>
                    <button onClick={() => setMazeGenAlgo("depthFirst")}>Depth First</button>
                </div>
                <div className="gen-algo-bar">
                    <button onClick={() => setMazeSolveAlgo("depthFirst")}>Depth First</button>
                    <button onClick={() => setMazeSolveAlgo("breadthFirst")}>Breadth First</button>
                    <button onClick={() => setMazeSolveAlgo("dijkstra's")}>Dijkstra's</button>
                    <button onClick={() => setMazeSolveAlgo("a-star")}>A-star</button>
                </div>
                <div className="sliders-bar">
                    <input onChange="" type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
                </div>
            </div>
            <div id="canvas">
                <button onClick={handleClearCanvas}>Clear</button>
                <button onClick={handleFillCanvas}>Fill</button>
                <canvas onClick={handleOnClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} ref={canvas}></canvas>
                <button onClick={() => setMazeGenerating(true)}>Generate Maze</button>
                <button onClick={() => setMazeSolving(true)}>Solve Maze</button>
                <button onClick ={() => animateMazeDrawing.play()}>Play</button>
            </div>
        </div>
    )
}

export default Pathfinding;