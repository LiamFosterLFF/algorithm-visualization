import React, { useState, useEffect, useRef } from 'react';
import { initializeGrid, generateMaze, clearCanvas, fillCanvas } from './PathfindingFunctions/mazeGeneratingFunctions.js';
import { solveMaze, nodeFinder } from './PathfindingFunctions/mazeSolvingFunctions.js';
import { animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './PathfindingFunctions/mazeAnimatingFunctions.js';
import { Dropdown, Button, ButtonGroup, Nav } from 'react-bootstrap';


const Pathfinding = () => {
    const canvas = useRef(null);
    const [grid, setGrid] = useState([])
    const [ windowDimensions, setWindowDimensions ] = useState({width: window.innerWidth, height: window.innerHeight});
    const [mazeAnimations, setMazeAnimations] = useState({ drawingAnimations: [], nodeAnimations: [] })
    const [solvingAnimations, setSolvingAnimations] = useState([])
    const [drawSpeed, setDrawSpeed] = useState(0)
    const [mazeGenAlgo, setMazeGenAlgo] = useState("eller's")
    const [mazeSolveAlgo, setMazeSolveAlgo] = useState("depthFirst")

    const calculateCellSize = () => {
        const cellSz = (window.innerWidth < 450) ? 5 : 10;
        return cellSz;
    }

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
        const [initialGrid, x, y] = initializeGrid(canvas, cellSize, canvasDimensions)
        const { width, height } = calculateCanvasDimensions();
        setGrid(initialGrid)
        setCanvasDimensions({
            width,
            height,
            x,
            y
        })
        

    }, [windowDimensions])

    useEffect(() => {
        const fillGrid = fillCanvas(canvas, cellSize)
        setGrid(fillGrid)   
    }, [canvasDimensions])


    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        console.log(windowDimensions, canvasDimensions);
        
        window.addEventListener('resize', handleResize);

        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })
    
    

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
    
    return (
        <div>
            <div className="nav-bar">
                <Nav>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {mazeGenAlgoTitle}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleMazeGenSelect("eller's", "Eller's Algorithm")} href="#/action-1">Eller's Algorithm</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMazeGenSelect("depthFirst", "Recursive Backtracking")} href="#/action-2">Recursive Backtracking</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {mazeSolveAlgoTitle}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleMazeSolveSelect("depthFirst", "Depth-First Search")}>Depth-First Search</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMazeSolveSelect("breadthFirst", "Breadth-First Search")}>Breadth-First Search</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMazeSolveSelect("dijkstra's", "Djikstra's Algorithm")}>Dijkstra's Algorithm</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMazeSolveSelect("a-star", "A* Search Algorithm")}>A* Search Algorith</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="sliders-bar">
                        <input onChange="" type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
                    </div>
                </Nav>
                
            </div>
            <div id="canvas">
                <ButtonGroup>
                    <Button onClick={handleClearCanvas}>Clear</Button>
                    <Button onClick={handleFillCanvas}>Fill</Button>
                </ButtonGroup>
                
                <canvas onClick={handleOnClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} ref={canvas}></canvas>
                <Button onClick={() => setMazeGenerating(true)}>Generate Maze</Button>
                <Button onClick={() => setMazeSolving(true)}>Solve Maze</Button>
                <Button onClick ={() => animateMazeDrawing.play()}>Play</Button>
            </div>
        </div>
    )
}

export default Pathfinding;
