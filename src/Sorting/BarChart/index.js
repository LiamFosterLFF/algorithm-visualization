import React, { useState, useEffect } from 'react';
import Bar from "./Bar";
import { barShuffle, bubbleSort, bubbleSortAnimation, selectionSort, selectionSortAnimation, insertionSort, insertionSortAnimation, mergeSort, mergeSortAnimation } from "../utilities";

const BarChart = () => {
    const [bars, setBars] = useState(barShuffle(100));
    // const [animations, setAnimations] = useState(bubbleSort(bars));
    // const [animations, setAnimations] = useState(selectionSort(bars))
    const [animations, setAnimations] = useState(insertionSort(bars))
    // const [animations, setAnimations] = useState(mergeSort(bars))

    useEffect(() => {  
        // bubbleSortAnimation(animations)
        // selectionSortAnimation(animations)
        insertionSortAnimation(animations)
        // mergeSortAnimation(animations, 50)

    }, [])

    return (
        <div className="chart">
            {bars.map((barHeight, barIndex) => {
                return (
                    <Bar key={barIndex} height={barHeight} />
                )
            })}
        </div>
    )
}

export default BarChart;