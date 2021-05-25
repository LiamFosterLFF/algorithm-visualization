import React, { useState, useEffect, useRef } from 'react';

// Import all functions from a single file as a dictionary, order them better as well
import { initializeGrid, generateMaze, getFullCanvas, getClearCanvas, calculateCanvasSize } from './PathfindingFunctions/mazeGeneratingFunctions.js';

import { solveMaze, nodeFinder } from './PathfindingFunctions/mazeSolvingFunctions.js';
import { animateMazeDrawing, animateMazeSolving, animateMazeSolvingBacktrack } from './PathfindingFunctions/mazeAnimatingFunctions.js';

import Dropdown from './PathfindingDropdown.js';
import ControlButtons from './PathfindingControlButtons.js';

const Pathfinding = () => {
    const [mazeAnimations, setMazeAnimations] = useState({ drawingAnimations: [], nodeAnimations: [] })
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
        console.log(cells);
        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                const cell = cells[row][col];
                if (cell === "wall") {
                    ctx.fillStyle = '#444';
                } else {
                    ctx.fillStyle = '#fff';
                }
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

    // Clicking turns a cell from a wall to a path or vice versa
    const handleOnClick = (e) => {
        // console.log(e.clientX, e.clientY);
        const [row, col] = getMouseCellLocation(e, cellSize);

        const newCells = [...cells];
        newCells[row][col] = (newCells[row][col] === "wall") ? "path" : "wall"
        setCells(newCells)
    };

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

    // // Generating and solving animations. Do these really need to be in a useEffect hook? The sorting ones were but those were set when the algorithm changes
    // // Possibly they do since it generates a unique maze each time but remains tbd
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




    // // Finally, the control functionality

    // const handleClearCanvas = () => {
    //     setMazeGenerated(false)
    //     const clearGrid = clearCanvas(canvas, cellSize)
    //     setGrid(clearGrid)
    // }

    // const handleFillCanvas = () => {
    //     setMazeGenerated(false)
    //     const fillGrid = fillCanvas(canvas, cellSize)
    //     setGrid(fillGrid)
    // }

    // My proposed organization is as thusly:
    // First - Pull canvas out into its own Component
    // Second - All resizing and mouse movement functionality into this new Component
    // Third - All control functionality remains here; pass it down though to new component 
    // Fourth - Fix/refactor useEffects for resizing and mousedown to make more sense

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
                    
                    onClick={(e) => handleOnClick(e)} 
                    // onMouseDown={handleMouseDown} 
                    // onMouseUp={handleMouseUp} 
                    // onMouseOut={handleMouseOut} 
                    // onMouseMove={handleMouseMove}
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
                {/* <ControlButtons
                    clear={handleClearCanvas}
                    fill={handleFillCanvas}
                    generate={setMazeGenerating}
                    solve={setMazeSolving}
                    animate={animateMazeDrawing.play}
                /> */}
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
