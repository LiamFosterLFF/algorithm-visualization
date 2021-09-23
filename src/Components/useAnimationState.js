import { useReducer } from 'react';
import { generateMaze } from './Pathfinding/PathfindingFunctions/mazeGeneratingFunctions.js';
import { solveMaze } from './Pathfinding/PathfindingFunctions/mazeSolvingFunctions.js';
import { cloneDeep } from 'lodash';

const initializeAnimationState = (initialState) => {
    return {
        animations: { mazeAnimations: [], nodeAnimations: [], solvingAnimations: [], backtrackingAnimations: [] },
        animationStack: [],
        animationStackRange: [0, initialState.animationSpeed],
        currentAnimations: [],
        animationSpeed: initialState.animationSpeed,
        playingAnimations: true,
    }
}

const animationStateReducer = (animationState, action) => {
    switch (action.type) {
        case "load-and-play-animations": {
            return {
                ...animationState,
                animations: {...animationState.animations, ...action.payload.animations},
                animationStack: [...action.payload.animationStack],
                currentAnimations: action.payload.animationStack.slice(animationState.animationStackRange[0], animationState.animationStackRange[1]),
                playingAnimations: true
            }
        }

        case "generate-maze-creation-animations": {
            action.payload.updateCanvas({type: "fill-cell-grid"})
            const [ mazeGrid, {mazeAnimations, nodeAnimations}, ] = generateMaze(cloneDeep(action.payload.cellGrid), action.payload.mazeGenAlgo)
            action.payload.updateCanvas({
                type: "save-stored-maze",
                payload: {
                    storedMaze: mazeGrid
                }
            })
            return {
                ...animationState,
                animations: {...animationState.animations, mazeAnimations, nodeAnimations},
                animationStack: [...mazeAnimations],
                animationStackRange: [0, animationState.animationSpeed],
                currentAnimations: [...mazeAnimations].slice(0, animationState.animationSpeed),
                playingAnimations: true,
            }
        }

        case "generate-maze-solving-animations": {
            // Reset cells to those stored in maze cells, in case a solution already in place
            action.payload.loadStoredMaze()

            // Uses a set of default entry, exit, start points; these are adjustable but currently not part of state
            const defaults = { enter: [0, 1], exit: [action.payload.cellGrid.length - 1, action.payload.cellGrid[0].length - 2], start: [1, 1] };

            // Generate solving animations
            const {solvingAnimations, backtrackingAnimations} = solveMaze(cloneDeep(action.payload.cellGrid), defaults, action.payload.mazeSolveAlgo)
            const newAnimationStack = [...solvingAnimations, ...backtrackingAnimations]
            console.log(newAnimationStack);
            return {
                ...animationState,
                animations: {...animationState.animations, solvingAnimations, backtrackingAnimations},
                animationStack: newAnimationStack,
                animationStackRange: [0, animationState.animationSpeed],
                currentAnimations: newAnimationStack.slice(0, animationState.animationSpeed),
                playingAnimations: true
            }
        }

        case "update-animation-stack": {
            const reachedEndOfAnimations = animationState.animationStackRange[0] + animationState.animationSpeed > animationState.animationStack.length;

            if (!reachedEndOfAnimations) {
                const newRange = [
                    animationState.animationStackRange[1], 
                    animationState.animationStackRange[1] + animationState.animationSpeed
                ]
                return {
                    ...animationState,
                    animationStackRange: newRange,
                    currentAnimations: animationState.animationStack.slice(newRange[0], newRange[1])
                }
            } else {
                const newRange = [
                    animationState.animationStackRange[1], 
                    animationState.animationStack.length
                ]
                return {
                    ...animationState,
                    animationStackRange: newRange,
                    currentAnimations: animationState.animationStack.slice(newRange[0], -1),
                    playingAnimations: false
                }
            }
            
        }

        case "play-animations": {
            return {
                ...animationState,
                playingAnimations: true
            }
        }

        case "pause-animations": {
            return {
                ...animationState,
                playingAnimations: false
            }
        }

        case "set-animation-speed": {
            const newSpeed = Number(action.payload.animationSpeed);
            if (newSpeed !== NaN) {
                return {
                    ...animationState,
                    animationSpeed: newSpeed
                }
            }
            return {...animationState}
        }

        default:
            throw new Error("Animation Error")
    }
}


export const useAnimationState = (initialState) => {
    return useReducer(animationStateReducer, initializeAnimationState(initialState))
}