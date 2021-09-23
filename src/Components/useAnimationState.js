import { useReducer } from 'react';
import { generateMaze } from './Pathfinding/PathfindingFunctions/mazeGeneratingFunctions.js';
import { cloneDeep } from 'lodash';

const initializeAnimationState = (initialState) => {
    return {
        animations: { mazeAnimations: [], nodeAnimations: [], solvingAnimations: [], backtrackingAnimations: [] },
        animationStack: [],
        animationStackRange: [0, initialState.animationSpeed],
        currentAnimations: [],
        animationSpeed: initialState.animationSpeed,
        playingAnimations: true
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

        case "generate-maze-animations": {
            action.payload.fillCanvas()
            const [ mazeGrid, {mazeAnimations, nodeAnimations}, ] = generateMaze(cloneDeep(action.payload.cellGrid), action.payload.mazeGenAlgo)
            return {
                ...animationState,
                animations: {...animationState.animations, mazeAnimations, nodeAnimations},
                animationStack: [...mazeAnimations],
                animationStackRange: [0, animationState.animationSpeed],
                currentAnimations: [...mazeAnimations].slice(0, animationState.animationSpeed),
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

        case "reset-animations": {
            action.payload.resetFunction()
            return {
                ...animationState,
                animationStack: [],
                playingAnimations: false
            }
        }

        case "replay-animations": {
            action.payload.resetFunction()
            return {
                ...animationState,
                animationStackRange: [0, animationState.animationSpeed],
                currentAnimations: animationState.animationStack.slice(0, animationState.animationSpeed),
                playingAnimations: true
            }
        }

        case "set-animation-speed": {
            return {
                ...animationState,
                animationSpeed: action.payload.animationSpeed,
            }
        }

        default:
            throw new Error("Animation Error")
    }
}


export const useAnimationState = (initialState) => {
    return useReducer(animationStateReducer, initializeAnimationState(initialState))
}