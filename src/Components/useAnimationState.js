import { useReducer } from 'react';

const initializeAnimationState = (initialState) => {
    return {
        animations: { mazeAnimations: [], nodeAnimations: [], solvingAnimations: [], backtrackingAnimations: [] },
        animationStack: [],
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
                playingAnimations: true
            }
        }
        case "update-animation-stack": {
            action.payload.canvasUpdateFunction();
            return {
                ...animationState,
                animationStack: [...action.payload.animationStack]
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
                animationStack: [...animationState.animations.solvingAnimations, ...animationState.animations.backtrackingAnimations],
                playingAnimations: true
            }
        }
        case "set-animation-speed": {
            return {
                ...animationState,
                animationSpeed: action.payload.animationSpeed
            }
        }
        default:
            throw new Error()
    }
}


export const useAnimationState = (initialState) => {
    return useReducer(animationStateReducer, initializeAnimationState(initialState))
}