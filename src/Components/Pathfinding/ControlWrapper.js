import React from 'react';
import DropdownMenu from '../DropdownMenu.js';
import ControlButtons from '../ControlButtons.js';
import Slider from '../Slider';

const ControlWrapper = (props) => {
    const play = () => props.updateAnimationState({type: "play-animations"});

    const pause = () => props.updateAnimationState({type: "pause-animations"});

    const reset = () => {
        props.updateAnimationState({
            type: "reset-animations", 
            payload: { 
                resetFunction: () => props.updateCanvas({type: "load-stored-maze"})
            }
        })
    };

    const replay = () => {
        props.updateAnimationState({
            type: "replay-animations", 
            payload: { 
                resetFunction: () => props.updateCanvas({type: "load-stored-maze"})
            }
        })
    };

    const clear = () => props.updateCanvas({type: "clear-cell-grid"});
    const fill = () => props.updateCanvas({type: "fill-cell-grid"});

    const generateMaze = () => {
        props.updateAnimationState({
            type: "generate-maze-creation-animations",
            payload: {
                cellGrid: props.canvas.filledCanvas,
                mazeGenAlgo: props.mazeGenAlgo,
                updateCanvas: props.updateCanvas,
            }
        })
    }

    const solveMaze = () => {
        props.updateAnimationState({
            type: "generate-maze-solving-animations",
            payload: {
                cellGrid: props.canvas.storedMaze,
                mazeSolveAlgo: props.mazeSolveAlgo,
                loadStoredMaze: () => props.updateCanvas({type: "load-stored-maze"})
            }
        })
    }


    return (
        <>
            <Slider 
            value={props.animationState.animationSpeed}
            setValue={(newAnimationSpeed) => props.updateAnimationState({type: "set-animation-speed", payload: { animationSpeed: newAnimationSpeed }})}
            name={"animationSpeedSlider"}
            label={"Animation Speed"}
            range={{ "min": 1, "max": 100, "step": 1 }}
            />
            <Slider 
                value={props.canvas.cellGridDimensions.cols}
                setValue={(newCellGridWidth) => props.updateCanvas({type: "resize-cell", payload: { newCellGridWidth }})}
                name={"noOfCellsAcrossSlider"}
                label={"Cell Size"}
                range={{ "min": 11, "max": 201, "step": 2 }}
            />
            {props.children}
            <div>
                <div className="input-group justify-content-center" >
                    <DropdownMenu
                        type={"Maze Generation"}
                        select={props.setMazeGenAlgo}
                        title={props.mazeGenAlgo}
                        algorithms={["Eller's Algorithm", "Recursive Backtracking"]}
                    />
                    <DropdownMenu
                        type={"Maze Solving"}
                        select={props.setMazeSolveAlgo}
                        title={props.mazeSolveAlgo}
                        algorithms={["Depth-First Search", "Breadth-First Search", "Djikstra's Algorithm", "A* Search Algorithm"]}
                    />
                </div>
                <ControlButtons
                    size = {"sm"}
                    buttons={[
                        { "function": clear, text: "Clear", disabled: false },
                        { "function": fill, text: "Fill", disabled: false },
                        { "function": generateMaze, text: "Generate Maze", disabled: (props.mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        { "function": solveMaze, text: "Solve Maze", disabled: (props.mazeSolveAlgo === 'default'), tooltip: "Choose a Maze Solving Algorithm" },
                    ]}
                />
                <ControlButtons
                    size = {"sm"}
                    buttons={[
                        { "function": play, text: "Play", disabled: (props.mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        { "function": pause, text: "Pause", disabled: (props.mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        // { "function": reset, text: "Reset", disabled: (props.mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                        // { "function": replay, text: "Replay", disabled: (props.mazeGenAlgo === "default"), tooltip: "Choose a Maze Generation Algorithm" },
                    ]}
                />
            </div>
        </>
    )
}

export default ControlWrapper;