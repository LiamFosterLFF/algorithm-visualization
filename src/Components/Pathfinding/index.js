import React, { useState, useEffect } from 'react';
import { useInterval } from '../useInterval'
import { useCanvas } from '../useCanvas'
import { useAnimationState } from '../useAnimationState'
import ControlWrapper from './ControlWrapper';

const Pathfinding = () => {

    const [ canvas, updateCanvas ] = useCanvas({cellGridWidth: 101, windowInnerWidth: window.innerWidth})
    const [ animationState, updateAnimationState ] = useAnimationState({ animationSpeed: 50 })
    const [ mazeGenAlgo, setMazeGenAlgo ] = useState("default")
    const [ mazeSolveAlgo, setMazeSolveAlgo ] = useState("default")

    // Reset window dimension state every time window resized (w/ cleanup function)
    useEffect(() => {
        const handleWindowResize = () => {
            updateCanvas({type: "resize-canvas", payload: {windowInnerWidth: window.innerWidth}});
            updateAnimationState({ type: "clear-animations" });
        }
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
                ctx.fillRect(col * canvas.cellSize - 1, row * canvas.cellSize -1 , canvas.cellSize + 1, canvas.cellSize + 1);
            }
        }
    }, [canvas.cellGrid, canvas.cellSize])

    // Custom hook for animations - can control speed, choose type, control playback
    useInterval(() => {   
        updateAnimationState({
            type: "update-animation-stack", 
        })

        updateCanvas({
            type: "animate-maze", 
            payload: {
                animations: animationState.currentAnimations
            }
        })

    }, animationState.playingAnimations ? 5 : null);

    return (
        <ControlWrapper
            canvas={canvas} updateCanvas={updateCanvas}
            animationState={animationState} updateAnimationState={updateAnimationState}
            mazeGenAlgo={mazeGenAlgo} setMazeGenAlgo={setMazeGenAlgo}
            mazeSolveAlgo={mazeSolveAlgo} setMazeSolveAlgo={setMazeSolveAlgo}
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