import React, { useState, useEffect } from 'react';
import PixelBar from "./PixelBar";
import { pixelBarShuffle, pixelMapBubbleSort, bubbleSortPixelMapAnimation, selectionSort, selectionSortPixelBarChartAnimation, insertionSort, insertionSortPixelBarChartAnimation, mergeSort, mergeSortPixelBarChartAnimation, quickSort, quickSortPixelBarChartAnimation } from "../utilities";

const PixelMap = () => {

    

    const [pixelBars, setPixelBars] = useState(pixelBarShuffle())


    

    

    const [animations, setAnimations] = useState(pixelMapBubbleSort(pixelBars))
    
    useEffect(() => {
        
        
        bubbleSortPixelMapAnimation(animations, 0)
    }, [])

    return (
        <div className="chart">
            {pixelBars.map((barHeights, barIndex) => {
                return (
                    <PixelBar key={barIndex} heights={barHeights} />
                )
            })}
        </div>
    )
}

export default PixelMap;