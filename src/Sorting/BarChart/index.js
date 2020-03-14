import React, { useState, useEffect } from 'react';
import Bar from "./Bar";
import { barShuffle, bubbleSort, bubbleSortBarChartAnimation, selectionSort, selectionSortBarChartAnimation, insertionSort, insertionSortBarChartAnimation, mergeSort, mergeSortBarChartAnimation, quickSort, quickSortBarChartAnimation, barChartRadixSort, radixSortBarChartAnimation } from "../utilities";

const BarChart = () => {
    const [bars, setBars] = useState(barShuffle(100));
    
    



    // const [animations, setAnimations] = useState(bubbleSort(bars));
    // const [animations, setAnimations] = useState(selectionSort(bars))
    // const [animations, setAnimations] = useState(insertionSort(bars))
    // const [animations, setAnimations] = useState(mergeSort(bars))
    // const [animations, setAnimations] = useState(quickSort(bars))
    // const [animations, setAnimations] = useState(barChartRadixSort(bars))
    // const [animations, setAnimations] = useState(heapSort(bars))

    
    
    
    useEffect(() => {  
        // bubbleSortBarChartAnimation(animations)
        // selectionSortBarChartAnimation(animations)
        // insertionSortBarChartAnimation(animations)
        // mergeSortBarChartAnimation(animations, 50)
        // quickSortBarChartAnimation(animations, 100)
        // radixSortBarChartAnimation(animations, 50)
        // heapSortBarChartAnimation(animations, 100)



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