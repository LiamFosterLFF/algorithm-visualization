import React, { useState, useEffect } from 'react';
import PixelBar from "./PixelBar";
import { pixelBarShuffle } from "../utilities/pixelMapFunctions";
// pixelMapBubbleSort, bubbleSortPixelMapAnimation, selectionSort, selectionSortPixelBarChartAnimation, insertionSort, insertionSortPixelBarChartAnimation, mergeSort, mergeSortPixelBarChartAnimation, quickSort, quickSortPixelBarChartAnimation

const PixelMap = () => {
    const [sort, setSort] = useState("bubble")
    const [pixelBars, setPixelBars] = useState(pixelBarShuffle())
    const [animations, setAnimations] = useState([])
    // const [sortType, setSortType] = useState({ function: bubbleSort });
    // const [animationType, setAnimationType] = useState({ function: bubbleSortBarChartAnimation });

    // useEffect(() => {
        // switch (sort) {
        //     case "bubble":
        //         setSortType({ function: bubbleSort })
        //         setAnimationType({ function: bubbleSortBarChartAnimation })
        //         break;
            // case "selection":
            //     setSortType({ function: selectionSort })
            //     setAnimationType({ function: selectionSortBarChartAnimation })
            //     break;
            // case "insertion":
            //     setSortType({ function: insertionSort })
            //     setAnimationType({ function: insertionSortBarChartAnimation })
            //     break;
            // case "merge":
            //     setSortType({ function: mergeSort })
            //     setAnimationType({ function: mergeSortBarChartAnimation })
            //     break;
            // case "quick":
            //     setSortType({ function: quickSort })
            //     setAnimationType({ function: quickSortBarChartAnimation })
            //     break;
            // case "radix":
            //     setSortType({ function: barChartRadixSort })
            //     setAnimationType({ function: radixSortBarChartAnimation })
            //     break;
    //     }
    // }, [sort])

    // useEffect(() => {
    //     resetAnimations(animations)
    //     runAnimations(bars)

    // }, [sortType])




    // const runAnimations = (bars) => {
    //     const barAnimations = animationType.function(sortType.function(bars))
    //     setAnimations(barAnimations)
    // }

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

    



    

    

    
    useEffect(() => {
        
        
        // bubbleSortPixelMapAnimation(animations, 0)
    }, [])

    return (
        <div className="chart">
            <div className="top-bar">
                <li onClick={() => setSort("bubble")}>
                    bubble
                </li>
                <li onClick={() => setSort("selection")}>
                    selection
                </li>
                <li onClick={() => setSort("insertion")}>
                    insertion
                </li>
                <li onClick={() => setSort("merge")}>
                    merge
                </li>
                <li onClick={() => setSort("quick")}>
                    quick
                </li>
                <li onClick={() => setSort("radix")}>
                    radix
                </li>
            </div>
            {pixelBars.map((barHeights, barIndex) => {
                return (
                    <PixelBar key={barIndex} heights={barHeights} />
                )
            })}
            <button onClick={() => resetAnimations(animations)}>Reset</button>
            <button onClick={() => playAnimations(animations)}>Play</button>
            <button onClick={() => pauseAnimations(animations)}>Pause</button>
        </div>
    )
}

export default PixelMap;