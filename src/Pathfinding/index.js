import React, { useState, useEffect, useRef } from 'react';
import { initializeGrid, generateMaze, clearCanvas, fillCanvas } from './PathfindingFunctions/mazeGeneratingFunctions.js';
import { solveMaze, nodeFinder } from './PathfindingFunctions/mazeSolvingFunctions.js';
import { animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './PathfindingFunctions/mazeAnimatingFunctions.js';
import { Dropdown, Button, ButtonGroup, Nav } from 'react-bootstrap';
import PathfindingDropdown from './PathfindingDropdown.js';


const Pathfinding = () => {
    const canvas = useRef(null);
    const [grid, setGrid] = useState([])
    const [ windowDimensions, setWindowDimensions ] = useState({width: window.innerWidth, height: window.innerHeight});
    const [mazeAnimations, setMazeAnimations] = useState({ drawingAnimations: [], nodeAnimations: [] })
    const [solvingAnimations, setSolvingAnimations] = useState([])
    const [drawSpeed, setDrawSpeed] = useState(0)
    const [mazeGenAlgo, setMazeGenAlgo] = useState("Eller's Algorithm")
    const [mazeSolveAlgo, setMazeSolveAlgo] = useState("Depth-First Search")
    const [mazeGenerating, setMazeGenerating] = useState(false)
    const [mazeGenerated, setMazeGenerated] = useState(false)
    const calculateCellSize = () => {
        let cellSz = (window.innerWidth < 450) ? 5 : 10;
        return cellSz;
    }

    console.log(mazeGenAlgo);

    const [cellSize, setCellSize] = useState(calculateCellSize()) 

    const calculateCanvasDimensions = () => {
        const normalizeDimension = (dimension) => {
            const dimCellMult = Math.floor(dimension / cellSize);
            const oddDimCellMult = (dimCellMult %2 === 0) ? dimCellMult + 1 : dimCellMult;
            const normalizedDim = oddDimCellMult * cellSize;
            return normalizedDim;
        }

        const dimensions = {width: 0, height: 0, x: 0, y: 0};
        
        dimensions["width"] = normalizeDimension(windowDimensions.width * .8);
        dimensions["height"] = normalizeDimension(windowDimensions.height * .7);
        return dimensions;
    };

    const [canvasDimensions, setCanvasDimensions] = useState(calculateCanvasDimensions())
    useEffect(() => {
        const initialDimensions = calculateCanvasDimensions();
        const [initialGrid, x, y] = initializeGrid(canvas, cellSize, initialDimensions)
        initialDimensions.x = x;
        initialDimensions.y = y;

        setCanvasDimensions({
            ...initialDimensions
        })
        
    }, [windowDimensions, cellSize])



        

    useEffect(() => {
        const [initialGrid, x, y] = initializeGrid(canvas, cellSize, canvasDimensions)
        setGrid(initialGrid)
        setMazeGenerated(false)
        const fillGrid = fillCanvas(canvas, cellSize)
        setGrid(fillGrid)   
    }, [canvasDimensions, mazeGenAlgo, mazeSolveAlgo])


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
    
    


    



    useEffect(() => {
        
        if(mazeGenerating) {
            const fillGrid = fillCanvas(canvas, cellSize)

            const [mazeGrid, animations, mazeFinished] = generateMaze(fillGrid, mazeGenAlgo)

            setMazeAnimations(animations)
            setGrid(mazeGrid)
            if (mazeFinished) {
                setMazeGenerating(false)
                setMazeGenerated(true)
            }

        }
    }, [mazeGenerating])



    const [backtrackingAnimations, setBacktrackingAnimations] = useState([])
    

    const [mazeSolving, setMazeSolving] = useState(false)
    useEffect(() => {
        if (mazeSolving) {
            const defaults = { enter: [0, 1], exit: [grid.length - 1, grid[0].length - 2], start: [1, 1] };
            const animations = solveMaze(grid, defaults, mazeSolveAlgo)
            
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
        setMazeGenerated(false)
        const clearGrid = clearCanvas(canvas, cellSize)
        setGrid(clearGrid)
    }

    const handleFillCanvas = () => {
        setMazeGenerated(false)
        const fillGrid = fillCanvas(canvas, cellSize)
        setGrid(fillGrid)
    }

    const [ mazeGenAlgoTitle, setMazeGenAlgoTitle ] = useState("Eller's Algorithm");
    const handleMazeGenSelect = (algorithm, title) => {
        setMazeGenAlgo(algorithm);
        setMazeGenAlgoTitle(title);
    }

    const [ mazeSolveAlgoTitle, setMazeSolveAlgoTitle ] = useState("Depth-First Search");
    const handleMazeSolveSelect = (algorithm, title) => {
        setMazeSolveAlgo(algorithm);
        setMazeSolveAlgoTitle(title);

    }

    const mazeGenAlgos = ["Eller's Algorithm", "Recursive Backtracking"];
    const mazeSolveAlgos = ["Depth-First Search", "Breadth-First Search", "Djikstra's Algorithm", "A* Search Algorithm"];

    return (
        <div>
            <PathfindingDropdown
                select={setMazeGenAlgo}
                title={mazeGenAlgo}
                algorithms={mazeGenAlgos}
            />
            <PathfindingDropdown
                select={setMazeSolveAlgo}
                title={mazeSolveAlgo}
                algorithms={mazeSolveAlgos}
            />
            <div id="canvas">
                <ButtonGroup>
                    <Button onClick={handleClearCanvas}>Clear</Button>
                    <Button onClick={handleFillCanvas}>Fill</Button>
                </ButtonGroup>
                
                <canvas onClick={handleOnClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} ref={canvas}></canvas>
                <Button onClick={() => setMazeGenerating(true)}>Generate Maze</Button>
                <Button onClick={() => setMazeSolving(true)} disabled={!mazeGenerated}>Solve Maze</Button>
                <Button onClick ={() => animateMazeDrawing.play()}>Play</Button>
            </div>
        </div>
    )
}

export default Pathfinding;


    // Get all algorithms to work on the non-maze board

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
