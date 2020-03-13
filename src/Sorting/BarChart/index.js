import React, { useState, useEffect } from 'react';
import Bar from "./Bar";
import { barShuffle, bubbleSort, bubbleSortAnimation, selectionSort, selectionSortAnimation, insertionSort, insertionSortAnimation, mergeSort, mergeSortAnimation, quickSort, quickSortAnimation } from "../utilities";

const BarChart = () => {
    const [bars, setBars] = useState(barShuffle(100));
    // const [animations, setAnimations] = useState(bubbleSort(bars));
    // const [animations, setAnimations] = useState(selectionSort(bars))
    // const [animations, setAnimations] = useState(insertionSort(bars))
    // const [animations, setAnimations] = useState(mergeSort(bars))
    // const [animations, setAnimations] = useState(quickSort(bars))
    // const [animations, setAnimations] = useState(heapSort(bars))


    
    
    useEffect(() => {  
        // bubbleSortAnimation(animations)
        // selectionSortAnimation(animations)
        // insertionSortAnimation(animations)
        // mergeSortAnimation(animations, 50)
        // quickSortAnimation(animations, 100)
        // heapSortAnimation(animations, 100)



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