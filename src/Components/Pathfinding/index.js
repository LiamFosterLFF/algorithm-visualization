import React, { useState, useEffect } from 'react';
import { useInterval } from '../useInterval'
// Import all functions from a single file as a dictionary, order them better as well
import { generateMaze, getFullCanvas, getClearCanvas, calculateCanvasSize } from './PathfindingFunctions/mazeGeneratingFunctions.js';

import { solveMaze } from './PathfindingFunctions/mazeSolvingFunctions.js';

import DropdownMenu from '../DropdownMenu.js';
import ControlButtons from '../ControlButtons.js';
import Slider from '../Slider';
import { cloneDeep } from 'lodash';

const Pathfinding = () => {
    const [ animations, setAnimations ] = useState({ mazeAnimations: [], nodeAnimations: [], solvingAnimations: [], backtrackingAnimations: [] })
    const [ mazeGenAlgo, setMazeGenAlgo ] = useState("default")
    const [ mazeSolveAlgo, setMazeSolveAlgo ] = useState("default")
    // Speed controlled by slider
    const [ animationSpeed, setAnimationSpeed ] = useState(50)
    // Animations controlled using a stack, allows for pausing as well as easy repeats and works better with interval
    const [ animationStack, setAnimationStack ] = useState([])
    const [ playingAnimations, setPlayingAnimations ] = useState(false)
    const [ windowDimensions, setWindowDimensions ] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Calculate size of cells on basis of how many cells wide the maze should be (can be adjusted with slider)
    const [ noOfCellsAcross, ] = useState(100)
    const [ cellSize, ] = useState(Math.floor(windowDimensions.width / noOfCellsAcross))
    // Calculate size of canvas and cell grid on basis of cell size
    const [ canvasDimensions, setCanvasDimensions ] = useState(calculateCanvasSize(windowDimensions, cellSize))
    const [ cells, setCells ] = useState(getFullCanvas(canvasDimensions, cellSize))
    const [ storedMaze, setStoredMaze ] = useState(getFullCanvas(canvasDimensions, cellSize))

    // Reset window dimension state every time window resized (w/ cleanup function)
    useEffect(() => {
        function handleResize() {
            const newWindowDimensions = {
                height: window.innerHeight,
                width: window.innerWidth
            }
            setWindowDimensions(newWindowDimensions)
            // Recalculate canvas dimensions every time window dimensions change
            const newCanvasDimensions = calculateCanvasSize(newWindowDimensions, cellSize)
            setCanvasDimensions(newCanvasDimensions)
            // Reset grid and stored maze to completely filled in every time canvas resizes
            setCells(getFullCanvas(newCanvasDimensions, cellSize))
            setStoredMaze(getFullCanvas(newCanvasDimensions, cellSize))
        }
        window.addEventListener('resize', handleResize);

        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    // Redraw canvas cells every time array representing them are changed
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
    }, [cells, cellSize])
    
    // Mousedown starts you drawing
    const [ isDrawing, setIsDrawing ] = useState(false)
    // Moving sets all interim points to the opposite of whatever the original cell was
    const [ fillType, setFillType ] = useState(null)
    // Saving previous point allows us to catch all points dragged over (as browser event has fairly slow fire rate)
    const [ previousPoint, setPreviousPoint ] = useState([null, null])

    // Screen clicking functionality
    const getMouseCellLocation = (e, cellSize) => {
        // Needs canvas to subtract size of bounding box
        const canvas = document.getElementById('canvas');
        const canvasBoundingBox = canvas.getBoundingClientRect();
        // Returns [row, col]
        return [Math.floor((e.clientY - canvasBoundingBox.y) / cellSize), Math.floor((e.clientX - canvasBoundingBox.x + .5) / cellSize)]
    }

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
        setStoredMaze(newCells)
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
            setStoredMaze(newCells)
            setPreviousPoint([row, col])
        }
    }

    const handleGenerateMaze = () => {
        // Fill in cells for use by algorithm, default is walls
        const fillGrid = getFullCanvas(canvasDimensions, cellSize)
        setCells(fillGrid)
        const [ mazeGrid, {mazeAnimations, nodeAnimations}, ] = generateMaze(fillGrid, mazeGenAlgo)
        // Store maze for use in reset
        setStoredMaze(cloneDeep(mazeGrid))
        setAnimations({
            ...animations,
            mazeAnimations,
            nodeAnimations,
        })
        // Add to stack and play animations
        setAnimationStack([...animationStack, ...mazeAnimations])
        setPlayingAnimations(true)
    }

    const handleSolveMaze = () => {
        // Uses a set of default entry, exit, start points; these are adjustable but currently not part of state
        const defaults = { enter: [0, 1], exit: [cells.length - 1, cells[0].length - 2], start: [1, 1] };

        // // Reset cells to those stored in maze cells, in case a solution already in place
        const storedMazeClone = cloneDeep(storedMaze)
        setCells(storedMazeClone)
        const {solvingAnimations, backtrackingAnimations} = solveMaze(storedMazeClone, defaults, mazeSolveAlgo)
        setAnimations({
            ...animations,
            solvingAnimations,
            backtrackingAnimations
        })
        // Add to stack and play animations
        setAnimationStack([...animationStack, ...solvingAnimations, ...backtrackingAnimations])
        setPlayingAnimations(true)
    }


    // Custom hook for animations - can control speed, choose type, control playback
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

    // Dropdown Genearting and Solving Algorithm Change Side-effects

    useEffect(() => {
        handleFillCanvas();
    }, [mazeGenAlgo])

    useEffect(() => {
        resetSolvingAnimations();
    }, [mazeSolveAlgo])

    // Control functionality
    const handleClearCanvas = () => {
        const clearCanvas = getClearCanvas(canvasDimensions, cellSize)
        setCells(clearCanvas);
        setStoredMaze(clearCanvas);
    }

    const handleFillCanvas = () => {
        const fullCanvas = getFullCanvas(canvasDimensions, cellSize)
        setCells(fullCanvas);
        setStoredMaze(fullCanvas);
    }

    const playAnimations = () => {
        setPlayingAnimations(true);
    }

    const pauseAnimations = () => {
        setPlayingAnimations(false);
    }

    const resetSolvingAnimations = () => {
        setCells(cloneDeep(storedMaze));
    }

    const replayAnimations = () => {
        resetSolvingAnimations()
        setAnimationStack([...animationStack, ...animations.solvingAnimations, ...animations.backtrackingAnimations])

        playAnimations()
    }

    return (
        <div>
            <Slider 
                value={animationSpeed}
                setValue={setAnimationSpeed}
            />

            <div style={{ width: canvasDimensions.width, height: canvasDimensions.height }}>
                <canvas 
                    id="canvas"
                    
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    
                    onMouseDown={(e) => handleMouseDown(e)} 
                    onMouseUp={() => handleMouseOutUp()} 
                    onMouseOut={() => handleMouseOutUp()} 
                    onMouseMove={(e) => handleMouseMove(e)}
                />
            </div>
            <div>
                <div className="input-group justify-content-center" >
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
                </div>
                <ControlButtons
                    size = {"sm"}
                    buttons={[
                        { "function": handleClearCanvas, text: "Clear", disabled: false },
                        { "function": handleFillCanvas, text: "Fill", disabled: false },
                        { "function": handleGenerateMaze, text: "Generate Maze", disabled: (mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        { "function": handleSolveMaze, text: "Solve Maze", disabled: (mazeSolveAlgo === 'default'), tooltip: "Choose a Maze Solving Algorithm" },
                    ]}
                />
                <ControlButtons
                    size = {"sm"}
                    buttons={[
                        { "function": playAnimations, text: "Play", disabled: (mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        { "function": pauseAnimations, text: "Pause", disabled: (mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        { "function": resetSolvingAnimations, text: "Reset", disabled: (mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        { "function": replayAnimations, text: "Replay", disabled: (mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                    ]}
                />
            </div>
        </div>
    )
}

export default Pathfinding;

// Still left to do:
// Bugs: 
//      Below are basicall all just one bug, issues surrounding the way maze algorithms interact with state
//      Get maze building working with no maze
//      What happens if no solution to maze?
//      Replay doesn't really do a replay, kind of just resets 