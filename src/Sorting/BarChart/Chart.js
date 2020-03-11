import React, { useState } from 'react';
import Bar from './Bar';

const Chart = ({ animations, bars}) => {
    console.log(bars)
    const [animationBars, setAnimationBars] = useState(bars)

    const animateSort = (anim) => {
        for (let a = 0; a < anim.length; a++) {
            const swapBars = [...animationBars];

            // [swapBars[anim[a][0]], swapBars[anim[a][1]]] = [swapBars[anim[a][1]], swapBars[anim[a][0]]];
            // console.log(swapBars);
            // setAnimationBars(swapBars)
        }
    }

    animateSort(animations)

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