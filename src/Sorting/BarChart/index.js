import React, { useEffect, useState } from 'react';

import Bar from './Bar';

import { barShuffle, bubbleSort, bubbleSortBarChartAnimation, selectionSort, selectionSortBarChartAnimation, insertionSort, insertionSortBarChartAnimation, mergeSort, mergeSortBarChartAnimation, quickSort, quickSortBarChartAnimation, barChartRadixSort, radixSortBarChartAnimation } from "../utilities";

const BarChart = ({ sort }) => {
    const [bars, setBars] = useState(barShuffle(100));
    const [animations, setAnimations] = useState([])
    const [sortType, setSortType] = useState({function: bubbleSort});
    const [animationType, setAnimationType] = useState({ function: bubbleSortBarChartAnimation });
    
    useEffect(() => {
        switch (sort) {
            case "bubble":
                setSortType({ function: bubbleSort})
                setAnimationType({ function: bubbleSortBarChartAnimation })
                break;
            case "selection":
                setSortType({ function: selectionSort})
                setAnimationType({ function: selectionSortBarChartAnimation })
                break;
            case "insertion":
                setSortType({ function: insertionSort})
                setAnimationType({ function: insertionSortBarChartAnimation })
                break;
            case "merge":
                setSortType({ function: mergeSort})
                setAnimationType({ function: mergeSortBarChartAnimation })
                break;
            case "quick":
                setSortType({ function: quickSort})
                setAnimationType({ function: quickSortBarChartAnimation })
                break;
            case "radix":
                setSortType({ function: barChartRadixSort})
                setAnimationType({ function: radixSortBarChartAnimation })
                break;
            }
        }, [sort])

    useEffect(() => {
        resetAnimations(animations)
        runAnimations(bars)

    }, [sortType])




    const runAnimations = (bars) => {
        const barAnimations = animationType.function(sortType.function(bars))
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
            <div className="chart">
                {bars.map((barHeight, barIndex) => {
                    return (
                        <Bar key={barIndex} height={barHeight} />
                    )
                })}
                <div className="buttons-bar">
                    <button onClick={() => resetAnimations(animations)}>Reset</button>
                    <button onClick={() => playAnimations(animations)}>Play</button>
                    <button onClick={() => pauseAnimations(animations)}>Pause</button>
                </div>
            </div>

    )
}

export default BarChart;