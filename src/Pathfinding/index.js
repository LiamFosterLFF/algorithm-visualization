import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from './useInterval'
// Import all functions from a single file as a dictionary, order them better as well
import { initializeGrid, generateMaze, getFullCanvas, getClearCanvas, calculateCanvasSize } from './PathfindingFunctions/mazeGeneratingFunctions.js';

import { solveMaze, nodeFinder } from './PathfindingFunctions/mazeSolvingFunctions.js';
import { animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './PathfindingFunctions/mazeAnimatingFunctions.js';

import DropdownMenu from '../DropdownMenu.js';
import ControlButtons from '../ControlButtons.js';
import Slider from '../Slider';

const Pathfinding = () => {
    const [animations, setAnimations] = useState({ mazeAnimations: [], nodeAnimations: [], solvingAnimations: [], backtrackingAnimations: [] })
    const [mazeGenAlgo, setMazeGenAlgo] = useState("default")
    const [mazeSolveAlgo, setMazeSolveAlgo] = useState("default")
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

    // Clicking changes the color of that cell, clicking + holding has separate functionality
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

    // Unclicking and moving out of frame/canvas releases mouse being held
    const handleMouseOutUp = () => {
        setIsDrawing(false)
        setPreviousPoint([null, null])
    }

    // Moving while mouse being held draws manhattan lines on the canvas
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

    const [ storedMaze, setStoredMaze ] = useState([])

    const handleGenerateMaze = () => {
        const fillGrid = getFullCanvas(canvasDimensions, cellSize)
        setCells(fillGrid)
        const [ mazeGrid, {mazeAnimations, nodeAnimations}, ] = generateMaze(fillGrid, mazeGenAlgo)
        console.log("A");
        setStoredMaze(mazeGrid)
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
        // Uses a set of default entry, exit, start points; these are adjustable but currently not part of state
        const defaults = { enter: [0, 1], exit: [cells.length - 1, cells[0].length - 2], start: [1, 1] };

        // // Reset cells to those stored in maze cells, in case a solution already in place
        // setCells(mazeCells)
        const {solvingAnimations, backtrackingAnimations} = solveMaze(cells, defaults, mazeSolveAlgo)
        setAnimations({
            ...animations,
            solvingAnimations,
            backtrackingAnimations
        })
        setAnimationStack([...animationStack, ...solvingAnimations, ...backtrackingAnimations])
        setPlayingAnimations(true)

        // runAnimations("backtrackingAnimations");
    }

    // Custom hook for animations - can control speed, choose type, control playback
    // Speed controlled by slider, set as a side effect
    const [ animationSpeed, setAnimationSpeed ] = useState(50)

    const [ animationStack, setAnimationStack ] = useState([])
    const [ playingAnimations, setPlayingAnimations ] = useState(false)
    useInterval(() => {     
        const newCells = [...cells];
        const remainingStack = [...animationStack]
        const noOfUpdates = animationSpeed;
        for (let i = 0; i < noOfUpdates; i++) {
            if (remainingStack.length) {
                const animation = remainingStack.shift();
                const [row, col] = animation.location;
                newCells[row][col] = animation.type;
            } else {
                setPlayingAnimations(false)
            }
        }
        setAnimationStack(remainingStack)
        setCells(newCells)
    }, playingAnimations ? 5 : null);

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
        console.log(storedMaze);
        setCells(storedMaze);
        // setAnimationCounter(0)
    }

    const replayAnimations = () => {
        resetSolvingAnimations()
        playAnimations()
    }

    // Still left:
    // Hover on main page cards
    // Get rid of all console logs
    // Make sure all comments are good
    // Bugs: 
    //      Play button needs to do something
    //      Sorting bug: why animations tarts early
    //      Get maze building working with no maze
    //      What happens if no solution to maze?
    //      Changing solving algorithm should reset to just maze w/ no solutions
    //      Reset/replay only works on the first go round, then seems to be resetting  to the solved maze
    //      Buttons overlap maze currently
    //      On first load, main page is currently blank
    
    // explanations, for
    //      Games Readme
    //      Games How to play
    //      Sorting Algorithms
    //      Sorting Complexity
    //      Pathfinding algorithms
    //      

    // Nice but not necessary:
    //      Sorting slider for bars
    //      Build a dynamic slider for maze cell size

    return (
        <div>

            <Slider 
                value={animationSpeed}
                setValue={setAnimationSpeed}
            />

            <div >
                <canvas 
                    id="canvas"
                    
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    
                    onMouseDown={(e) => handleMouseDown(e)} 
                    onMouseUp={() => handleMouseOutUp()} 
                    onMouseOut={() => handleMouseOutUp()} 
                    onMouseMove={(e) => handleMouseMove(e)}
                />

                <DropdownMenu
                    type={"Maze Generation"}
                    select={setMazeGenAlgo}
                    title={mazeGenAlgo}
                    algorithms={["Eller's Algorithm", "Recursive Backtracking"]}
                />
                <DropdownMenu
                    type={"Maze Solving"}
                    select={setMazeSolveAlgo}
                    title={mazeSolveAlgo}
                    algorithms={["Depth-First Search", "Breadth-First Search", "Djikstra's Algorithm", "A* Search Algorithm"]}
                />
                <ControlButtons
                    buttons={[
                        { "function": handleClearCanvas, text: "Clear", disabled: false },
                        { "function": handleFillCanvas, text: "Fill", disabled: false },
                        { "function": handleGenerateMaze, text: "Generate Maze", disabled: (mazeGenAlgo === "default") },
                        { "function": handleSolveMaze, text: "Solve Maze", disabled: (mazeSolveAlgo === 'default') },
                    ]}
                />
                <ControlButtons
                    buttons={[
                        { "function": playAnimations, text: "Play", disabled: (mazeGenAlgo === "default") },
                        { "function": pauseAnimations, text: "Pause", disabled: (mazeGenAlgo === "default") },
                        { "function": resetSolvingAnimations, text: "Reset", disabled: (mazeGenAlgo === "default") },
                        { "function": replayAnimations, text: "Replay", disabled: (mazeGenAlgo === "default") },
                    ]}
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
