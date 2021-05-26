import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from './useInterval'
// Import all functions from a single file as a dictionary, order them better as well
import { initializeGrid, generateMaze, getFullCanvas, getClearCanvas, calculateCanvasSize } from './PathfindingFunctions/mazeGeneratingFunctions.js';

import { solveMaze, nodeFinder } from './PathfindingFunctions/mazeSolvingFunctions.js';
import { animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './PathfindingFunctions/mazeAnimatingFunctions.js';

import Dropdown from './PathfindingDropdown.js';
import ControlButtons from './PathfindingControlButtons.js';

const Pathfinding = () => {
    const [animations, setAnimations] = useState({ mazeAnimations: [], nodeAnimations: [], solvingAnimations: [], backtrackingAnimations: [] })
    const [solvingAnimations, setSolvingAnimations] = useState([])
    const [drawSpeed, setDrawSpeed] = useState(0)
    const [mazeGenAlgo, setMazeGenAlgo] = useState("default")
    const [mazeSolveAlgo, setMazeSolveAlgo] = useState("default")
    const [mazeGenerating, setMazeGenerating] = useState(false)
    const [mazeGenerated, setMazeGenerated] = useState(false)


    // const fillCanvas = () => {
    //     setGrid(getFullCanvas())
    // }

    const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Calculate size of cells on basis of how many cells wide the maze should be (can be adjusted with slider)
    const [noOfCellsAcross, setNoOfCellsAcross] = useState(100)
    const [cellSize, setCellSize] = useState(Math.floor(windowDimensions.width / noOfCellsAcross))

    // Calculate size of canvas on basis of cell size
    const [canvasDimensions, setCanvasDimensions] = useState(calculateCanvasSize(windowDimensions, cellSize))

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

    // Recalculate canvas dimensions every time window dimensions change
    useEffect(() => {
        setCanvasDimensions(calculateCanvasSize(windowDimensions, cellSize))
    }, [windowDimensions])

    const [cells, setCells] = useState(getFullCanvas(canvasDimensions, cellSize))
    // Reset grid to completely filled in every time canvas resizes
    useEffect(() => {
        setCells(getFullCanvas(canvasDimensions, cellSize))
    }, [canvasDimensions])

    // Redraw canvas cells every time it is changed
    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                const cell = cells[row][col];
                const colorDict = {
                    "wall": '#444',
                    "path": '#fff',
                    "node": "#0000ff",
                    "searched": "#ff0000",
                    "backtrack": "#ffff00"
                }
                ctx.fillStyle = colorDict[cell];
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }, [cells])

    // // Yet another useEffect hook, do we really need this many?
    // // useEffect(() => {
    // //     const [initialGrid, x, y] = initializeGrid(canvas, cellSize, canvasDimensions)
    // //     setGrid(initialGrid)
    // //     setMazeGenerated(false)
    // //     const fillGrid = fillCanvas(canvas, cellSize)
    // //     setGrid(fillGrid)   
    // // }, [canvasDimensions, mazeGenAlgo, mazeSolveAlgo])




    // Screen clicking functionality
    const getMouseCellLocation = (e, cellSize) => {
        // Needs canvas to subtract size of bounding box
        const canvas = document.getElementById('canvas');
        const canvasBoundingBox = canvas.getBoundingClientRect();
        // Returns [row, col]
        return [Math.floor((e.clientY - canvasBoundingBox.y) / cellSize), Math.floor((e.clientX - canvasBoundingBox.x + .5) / cellSize)]
    }

    // Mousedown starts you drawing
    const [ isDrawing, setIsDrawing ] = useState(false)
    // Moving sets all interim points to the opposite of whatever the original cell was
    const [ fillType, setFillType ] = useState(null)
    // Saving previous point allows us to catch all points dragged over (as browser event has fairly slow fire rate)
    const [ previousPoint, setPreviousPoint ] = useState([null, null])
    const handleMouseDown = (e) => {
        const [row, col] = getMouseCellLocation(e, cellSize);
        setPreviousPoint([row, col])
        const newCells = [...cells];
        // Fill type remains constant as the opposite of cell content before the click, so you can draw lines after click
        const flippedCellContent = (newCells[row][col] === "wall") ? "path" : "wall"
        setFillType(flippedCellContent)
        newCells[row][col] = flippedCellContent;
        setCells(newCells)
        setIsDrawing(true)
    }

    const handleMouseOutUp = () => {
        setIsDrawing(false)
        setPreviousPoint([null, null])
    }

    const handleMouseMove = (e) => {
        const [row, col] = getMouseCellLocation(e, cellSize);
        const isPreviousPoint = (row === previousPoint[0] && col === previousPoint[1])
        if (isDrawing && !isPreviousPoint) {
            const newCells = [...cells];
            // Find all cells in between two points by:
            // Finding Manhattan distance values between the two points
            const [rowDiff, colDiff] = [row - previousPoint[0], col - previousPoint[1]];
            // Choosing which one is larger (in absolute terms)
            const maxDiff = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
            // Cycling through all cells in between previousPoint and current one
            // Add the smallest jump along the line between cells that will change value of one of the cells
            for (let i = 0; i < maxDiff; i++) {
                const [rowJump, colJump] = [rowDiff * ((i+1) / maxDiff), colDiff * ((i+1) / maxDiff)];
                const [mRow, mCol] = [Math.floor(previousPoint[0] + rowJump), Math.floor(previousPoint[1] + colJump)];
                newCells[mRow][mCol] = fillType;

            }
            setCells(newCells)
            setPreviousPoint([row, col])
        }
    }

    const [ mazeCells, setMazeCells ] = useState([])

    const handleGenerateMaze = () => {
        const fillGrid = getFullCanvas(canvasDimensions, cellSize)
        setCells(fillGrid)
        const [ mazeGrid, {mazeAnimations, nodeAnimations}, ] = generateMaze(fillGrid, mazeGenAlgo)
        setMazeCells(mazeGrid)
        setAnimations({
            ...animations,
            mazeAnimations,
            nodeAnimations,
        })
        setAnimationStack([...animationStack, ...mazeAnimations])
        setPlayingAnimations(true)
        // runAnimations("mazeAnimations")
    }

    const handleSolveMaze = () => {
        const defaults = { enter: [0, 1], exit: [cells.length - 1, cells[0].length - 2], start: [1, 1] };
        const {solvingAnimations, backtrackingAnimations} = solveMaze(cells, defaults, mazeSolveAlgo)

        setAnimations({
            ...animations,
            solvingAnimations,
            backtrackingAnimations
        })
        console.log(solvingAnimations);
        setAnimationStack([...animationStack, ...solvingAnimations, ...backtrackingAnimations])
        setPlayingAnimations(true)

        // runAnimations("backtrackingAnimations");
    }

    // useEffect(() => {

    //     if(mazeGenerating) {
    //         const fillGrid = fillCanvas(canvas, cellSize)

    //         const [mazeGrid, animations, mazeFinished] = generateMaze(fillGrid, mazeGenAlgo)

    //         setMazeAnimations(animations)
    //         setGrid(mazeGrid)
    //         if (mazeFinished) {
    //             setMazeGenerating(false)
    //             setMazeGenerated(true)
    //         }

    //     }
    // }, [mazeGenerating])

    // // Probably could afford/benefit from moving these to the top
    // const [backtrackingAnimations, setBacktrackingAnimations] = useState([])
    // const [mazeSolving, setMazeSolving] = useState(false)
    // useEffect(() => {
    //     if (mazeSolving) {
    //         const defaults = { enter: [0, 1], exit: [grid.length - 1, grid[0].length - 2], start: [1, 1] };
    //         const animations = solveMaze(grid, defaults, mazeSolveAlgo)

    //         setSolvingAnimations(animations.solvingAnimations)
    //         setBacktrackingAnimations(animations.backtrackingAnimations)
    //         setMazeSolving(false)
    //     }

    // }, [mazeSolving, grid])

    // // The animation and solving/backtracking animations; these also possibly don't need a useEffect hook although it ain't currently broke
    // useEffect(() => {
    //     const test = animateMazeDrawing(mazeAnimations, canvas, cellSize, drawSpeed);
    // }, [mazeAnimations]);

    // useEffect(() => {
    //     animateMazeSolving(solvingAnimations, canvas, cellSize, drawSpeed)
    // }, [ solvingAnimations]);

    // useEffect(() => {
    //     const delay = solvingAnimations.length * drawSpeed;
    //     animateMazeSolvingBacktrack(backtrackingAnimations, canvas, cellSize, drawSpeed, delay)
    // }, [backtrackingAnimations]);





    // Custom hook for animations - can control speed, choose type, control playback
    const [ animationSpeed, setAnimationSpeed ] = useState({interval: 4, updates: 100})
    const [ animationStack, setAnimationStack ] = useState([])
    const [ playingAnimations, setPlayingAnimations ] = useState(false)
    useInterval(() => {
        // const fillDict = {
        //     "mazeAnimations": "path",
        //     "nodeAnimations": "node",
        //     "solvingAnimations": "searched",
        //     "backtrackingAnimations": "backtrack",
        // }
        // const fill = fillDict[animationType]
        
        const newCells = [...cells];
        const remainingStack = [...animationStack]
        const noOfUpdates = animationSpeed.updates;
        for (let i = 0; i < noOfUpdates; i++) {
            if (remainingStack.length) {
                const animation = remainingStack.shift();
                const [row, col] = animation.location;
                console.log(row, col);
                newCells[row][col] = animation.type;
            } else {
                setPlayingAnimations(false)
            }
        }
        setAnimationStack(remainingStack)
        setCells(newCells)
    }, playingAnimations ? animationSpeed.interval : null);

    // Control functionality
    const handleClearCanvas = () => {
        setCells(getClearCanvas(canvasDimensions, cellSize));
    }

    const handleFillCanvas = () => {
        setCells(getFullCanvas(canvasDimensions, cellSize));
    }

    const playAnimations = (animationType) => {
        setPlayingAnimations(true);
    }

    const pauseAnimations = () => {
        setPlayingAnimations(false);
    }

    const resetSolvingAnimations = () => {
        handleFillCanvas()
        setCells(mazeCells);
        // setAnimationCounter(0)
    }

    const replayAnimations = () => {
        resetSolvingAnimations()
        playAnimations()
    }

    // Still left:
    // Set up all animations to use useinterval hook
    // Set up animation control functions
    // Get slider working for speed
    // Build a dynamic slider for maze cell size
    // Buttons inactive if no algo chosen and set dropdown name
    // Get maze building working with no maze
    // What happens if no solution to maze?
    // Fix name of tab
    // Sorting slider for bars
    // Sorting bug: why animations tarts early
    // Hover on main page cards
    // Get rid of all console logs
    // explanations, for
    //      Games Readme
    //      Games How to play
    //      Sorting Algorithms
    //      Sorting Complexity
    //      Pathfinding algorithms
    //      

    return (
        <div>

            {/* <div className="sliders-bar">
<input onChange="" type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
</div> */}
            <div >
                {/* <canvas onClick={handleOnClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} ref={canvas}></canvas> */}

                <canvas 
                    id="canvas"
                    
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    
                    onMouseDown={(e) => handleMouseDown(e)} 
                    onMouseUp={() => handleMouseOutUp()} 
                    onMouseOut={() => handleMouseOutUp()} 
                    onMouseMove={(e) => handleMouseMove(e)}
                />

                <Dropdown
                    select={setMazeGenAlgo}
                    title={mazeGenAlgo}
                    algorithms={["Eller's Algorithm", "Recursive Backtracking"]}
                />
                <Dropdown
                    select={setMazeSolveAlgo}
                    title={mazeSolveAlgo}
                    algorithms={["Depth-First Search", "Breadth-First Search", "Djikstra's Algorithm", "A* Search Algorithm"]}
                />
                <ControlButtons
                    clear={handleClearCanvas}
                    fill={handleFillCanvas}
                    generate={handleGenerateMaze}
                    solve={handleSolveMaze}
                    play={playAnimations}
                    pause={pauseAnimations}
                    reset={() => resetSolvingAnimations()}
                    replay={replayAnimations}
                />
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
