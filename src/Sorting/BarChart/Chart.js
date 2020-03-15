import React, { useState, useEffect } from 'react';
import Bar from "./Bar";
import { barShuffle } from "../utilities";

const Chart = ({ bars, sort, animation }) => {    
    
    useEffect(() => {
        animation(sort(bars))
    }, [bars])

    const reset = (bars) => {
        console.log(bars)
        for (let i = 0; i < bars.length; i++) {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[i];
            child1.style.height = bars[i]
        }
    }

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

export default Chart;