import React, { useState, useEffect } from 'react';
import { useInterval } from '../useInterval'
import { useCanvas } from '../useCanvas'
import { useAnimationState } from '../useAnimationState'
import { generateMaze } from './PathfindingFunctions/mazeGeneratingFunctions.js';

import { solveMaze } from './PathfindingFunctions/mazeSolvingFunctions.js';

import { cloneDeep } from 'lodash';
import ControlWrapper from './ControlWrapper';

const Pathfinding = () => {

    const [ canvas, updateCanvas ] = useCanvas({cellGridWidth: 101, windowInnerWidth: window.innerWidth})
    const [ animationState, updateAnimationState ] = useAnimationState({ animationSpeed: 50 })

    const [ mazeGenAlgo, setMazeGenAlgo ] = useState("default")
    const [ mazeSolveAlgo, setMazeSolveAlgo ] = useState("default")

    // Reset window dimension state every time window resized (w/ cleanup function)
    useEffect(() => {
        const handleWindowResize = () => updateCanvas({type: "resize-canvas", payload: {windowInnerWidth: window.innerWidth}})
        window.addEventListener('resize', handleWindowResize);

        return _ => {
            window.removeEventListener('resize', handleWindowResize)
        }
    })

    // Redraw canvas cells every time array representing them are changed
    useEffect(() => {
        const cnv = document.getElementById('canvas');
        const ctx = cnv.getContext('2d');
        for (let row = 0; row < canvas.cellGrid.length; row++) {
            for (let col = 0; col < canvas.cellGrid[row].length; col++) {
                const cell = canvas.cellGrid[row][col];
                const colorDict = {
                    "wall": '#444',
                    "path": '#fff',
                    "node": "#0000ff",
                    "searched": "#ff0000",
                    "backtrack": "#ffff00"
                }
                ctx.fillStyle = colorDict[cell];
                ctx.fillRect(col * canvas.cellSize, row * canvas.cellSize, canvas.cellSize, canvas.cellSize);
            }
        }
    }, [canvas.cellGrid, canvas.cellSize])
    
    const handleGenerateMaze = () => {
        // Fill in cells for use by algorithm, default is walls
        updateCanvas({type: "fill-cell-grid"})
        const [ mazeGrid, {mazeAnimations, nodeAnimations}, ] = generateMaze(cloneDeep(canvas.cellGrid), mazeGenAlgo)
        // Store maze for use in 
        // updateCanvas({type: "save-stored-maze", payload: { storedMaze: cloneDeep(mazeGrid) }})
        updateAnimationState({
            type: "load-and-play-animations", 
            payload: { 
                animations: {
                    mazeAnimations,
                    nodeAnimations
                },
                animationStack: [...mazeAnimations]
            }
        })
    }

    const handleSolveMaze = () => {
        // Uses a set of default entry, exit, start points; these are adjustable but currently not part of state
        const defaults = { enter: [0, 1], exit: [canvas.cellGrid.length - 1, canvas.cellGrid[0].length - 2], start: [1, 1] };

        // // Reset cells to those stored in maze cells, in case a solution already in place
        // updateCanvas({type: "load-stored-maze"})
        const {solvingAnimations, backtrackingAnimations} = solveMaze(cloneDeep(canvas.cellGrid), defaults, mazeSolveAlgo)
        updateAnimationState({
            type: "load-and-play-animations", 
            payload: { 
                animations: {
                    solvingAnimations,
                    backtrackingAnimations
                },
                animationStack: [...solvingAnimations, ...backtrackingAnimations]
            }
        })
    }

    // Custom hook for animations - can control speed, choose type, control playback
    // Basically works by just burning through the animation stack until it's gone
    useInterval(() => {     
        const newCellGrid = [...canvas.cellGrid];
        const remainingStack = [...animationState.animationStack]
        const noOfUpdates = animationState.animationSpeed;
        for (let i = 0; i < noOfUpdates; i++) {
            if (remainingStack.length) {
                const animation = remainingStack.shift();
                const [row, col] = animation.location;
                newCellGrid[row][col] = animation.type;
            } else {
                updateAnimationState({type: "pause-animations"})
            }
        }
        updateAnimationState({
            type: "update-animation-stack", 
            payload: { 
                animationStack: remainingStack,
                canvasUpdateFunction: () => updateCanvas({type: "animate-maze", payload: { newCellGrid }})
            }
        })
    }, animationState.playingAnimations ? 5 : null);

    // Dropdown Generating and Solving Algorithm Change Side-effects

    useEffect(() => {
        updateCanvas({type: "fill-cell-grid"})
    }, [mazeGenAlgo])

    useEffect(() => {
        updateAnimationState({type: "reset-animations", payload: { resetFunction: () => updateCanvas({type: "load-stored-maze"})}})
    }, [mazeSolveAlgo])

    return (
        <ControlWrapper
            canvas={canvas} updateCanvas={updateCanvas}
            animationState={animationState} updateAnimationState={updateAnimationState}
            mazeGenAlgo={mazeGenAlgo} setMazeGenAlgo={setMazeGenAlgo}
            mazeSolveAlgo={mazeSolveAlgo} setMazeSolveAlgo={setMazeSolveAlgo}
            handleGenerateMaze={handleGenerateMaze} handleSolveMaze={handleSolveMaze}
        >
            <div style={{ width: canvas.canvasDimensions.width, height: canvas.canvasDimensions.height }}>
                <canvas 
                    id="canvas"
                    
                    width={canvas.canvasDimensions.width}
                    height={canvas.canvasDimensions.height}
                    
                    onMouseDown={(e) => updateCanvas({type: "handle-mouse-down", payload: { mousePosition : {x: e.clientX, y:e.clientY} }})} 
                    onMouseUp={() => updateCanvas({type: "handle-mouse-out-up"})} 
                    onMouseOut={() => updateCanvas({type: "handle-mouse-out-up"})} 
                    onMouseMove={(e) => updateCanvas({type: "handle-mouse-move", payload: { mousePosition : {x: e.clientX, y:e.clientY} }})}
                />
            </div>
        </ControlWrapper>
    )
}

export default Pathfinding;

// Still left to do:
// Bugs: 
//      Below are basicall all just one bug, issues surrounding the way maze algorithms interact with state
//      Get maze building working with no maze
//      What happens if no solution to maze?