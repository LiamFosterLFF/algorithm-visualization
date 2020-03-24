import React, { useState, useEffect } from 'react';
import ColorBar from "./ColorBar";
import { colorShuffle, colorMapBubbleSort, colorMapBubbleSortAnimation, selectionSort, colorMapSelectionSortAnimation, insertionSort, colorMapInsertionSortAnimation, mergeSort, colorMapMergeSortAnimation, quickSort, colorMapQuickSortAnimation, radixSort, colorMapRadixSortAnimation } from '../utilities/colorBarFunctions';

const ColorMap = ({ sort }) => {
    const [colors, setColors] = useState(colorShuffle(200))
    const [animations, setAnimations] = useState([])
    const [sortType, setSortType] = useState({ function: colorMapBubbleSort });
    const [animationType, setAnimationType] = useState({ function: colorMapBubbleSortAnimation });

    useEffect(() => {
        switch (sort) {
            case "bubble":
                setSortType({ function: colorMapBubbleSort })
                setAnimationType({ function: colorMapBubbleSortAnimation })
                break;
            case "selection":
                setSortType({ function: selectionSort })
                setAnimationType({ function: colorMapSelectionSortAnimation })
                break;
            case "insertion":
                setSortType({ function: insertionSort })
                setAnimationType({ function: colorMapInsertionSortAnimation })
                break;
            case "merge":
                setSortType({ function: mergeSort })
                setAnimationType({ function: colorMapMergeSortAnimation })
                break;
            case "quick":
                setSortType({ function: quickSort })
                setAnimationType({ function: colorMapQuickSortAnimation })
                break;
            case "radix":
                setSortType({ function: radixSort })
                setAnimationType({ function: colorMapRadixSortAnimation })
                break;
        }
    }, [sort])

    useEffect(() => {
        resetAnimations(animations)
        runAnimations(colors)
    }, [sortType])

    const runAnimations = (colors) => {
        const colorAnimations = animationType.function(sortType.function(colors))
        setAnimations(colorAnimations)
    }

    const playAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.play()
            }
        })
    }

    const pauseAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.pause();
            }
        })
    }

    const resetAnimations = animations => {
        animations.map((animation) => {
            animation.cancel()
        })
    }   
    

    return (
        <div className="color-map">
            <div className="chart">
                {colors.map((color, colorIndex) => {
                    return (
                        <ColorBar key={colorIndex} color={color} />
                    )
                })}
                <div className="buttons-bar">
                    <button onClick={() => resetAnimations(animations)}>Reset</button>
                    <button onClick={() => playAnimations(animations)}>Play</button>
                    <button onClick={() => pauseAnimations(animations)}>Pause</button>
                </div>
            </div>
        </div>
    )
}

export default ColorMap;