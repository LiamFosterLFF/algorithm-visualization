import React, { useState, useEffect } from 'react';
import ColorBar from "./ColorBar";
import { colorShuffle, colorMapBubbleSort, colorMapBubbleSortAnimation, selectionSort, colorMapSelectionSortAnimation, insertionSort, colorMapInsertionSortAnimation, mergeSort, colorMapMergeSortAnimation } from '../utilities/colorBarFunctions';

const ColorMap = () => {
    const [colors, setColors] = useState(colorShuffle(200))
    const [sort, setSort] = useState("bubble")
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
            // case "quick":
            //     setSortType({ function: quickSort })
            //     setAnimationType({ function: colorMapQuickSortAnimation })
            //     break;
            // case "radix":
            //     setSortType({ function: barChartRadixSort })
            //     setAnimationType({ function: colorMapRadixSortAnimation })
            //     break;
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
                {/*<li onClick={() => setSort("quick")}>
                    quick
                </li>
                <li onClick={() => setSort("radix")}>
                    radix
                </li> */}
            </div>
            {colors.map((color, colorIndex) => {
                return (
                    <ColorBar key={colorIndex} color={color} />
                )
            })}
            <button onClick={() => resetAnimations(animations)}>Reset</button>
            <button onClick={() => playAnimations(animations)}>Play</button>
            <button onClick={() => pauseAnimations(animations)}>Pause</button>
        </div>
    )
}

export default ColorMap;