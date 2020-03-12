import React, { useState, useEffect } from 'react';
import Bar from "./Bar";
import { barShuffle, bubbleSort, bubbleSortAnimation } from "../utilities";

const BarChart = () => {
    const [bars, setBars] = useState(barShuffle(100));
    const [animations, setAnimations] = useState(bubbleSort(bars));

    useEffect(() => {  
        bubbleSortAnimation(animations)
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