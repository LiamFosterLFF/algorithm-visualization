import React, { useState, useEffect } from 'react';
import PixelBar from "./PixelBar";
import { pixelBarShuffle, bubbleSort, pixelMapBubbleSortAnimation, pixelMapSelectionSort, pixelMapSelectionSortAnimation, pixelMapInsertionSort, pixelMapInsertionSortAnimation, pixelMapMergeSort, pixelMapMergeSortAnimation, pixelMapQuickSort, pixelMapQuickSortAnimation, pixelMapRadixSort, pixelMapRadixSortAnimation } from "../utilities/pixelMapFunctions";

const PixelMap = ({ sort }) => {
    const [pixelBars, setPixelBars] = useState(pixelBarShuffle())
    const [animations, setAnimations] = useState([])
    const [sortType, setSortType] = useState({ function: bubbleSort });
    const [animationType, setAnimationType] = useState({ function: pixelMapBubbleSortAnimation });
    
    useEffect(() => {
        switch (sort) {
            case "bubble":
                setSortType({ function: bubbleSort })
                setAnimationType({ function: pixelMapBubbleSortAnimation })
                break;
            case "selection":
                setSortType({ function: pixelMapSelectionSort })
                setAnimationType({ function: pixelMapSelectionSortAnimation })
                break;
            case "insertion":
                setSortType({ function: pixelMapInsertionSort })
                setAnimationType({ function: pixelMapInsertionSortAnimation })
                break;
            case "merge":
                setSortType({ function: pixelMapMergeSort })
                setAnimationType({ function: pixelMapMergeSortAnimation })
                break;
            case "quick":
                setSortType({ function: pixelMapQuickSort })
                setAnimationType({ function: pixelMapQuickSortAnimation })
                break;
            case "radix":
                setSortType({ function: pixelMapRadixSort })
                setAnimationType({ function: pixelMapRadixSortAnimation })
                break;
        }
    }, [sort])

    useEffect(() => {
        resetAnimations(animations)
        runAnimations(pixelBars)
        
    }, [sortType])




    const runAnimations = (pixelBars) => {
        const barAnimations = animationType.function(sortType.function(pixelBars))
        setAnimations(barAnimations)
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
        <div className="pixel-map">
            <div className="chart">
                {pixelBars.map((barHeights, barIndex) => {
                    return (
                        <PixelBar key={barIndex} heights={barHeights} />
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

export default PixelMap;