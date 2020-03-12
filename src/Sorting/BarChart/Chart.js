import React, { useState, useEffect } from 'react';
import Bar from './Bar';

const Chart = ({ animations, bars}) => {

    const [colorBars, setColorBars] = useState([])

    useEffect(() => {
        for (let i=0; i<bars.length; i++) {
            bars[i] = {
                height: bars[i], 
                selected: false
            }
        }
        setColorBars(bars)
        
    }, [])
    
    useEffect(() => {
        console.log(colorBars);

    }, [colorBars])

    // const [animationBars, setAnimationBars] = useState([])

    const animateSort = (anim) => {
        for (let a = 0; a < anim.length; a++) {
            const [bar1, bar2] = anim[a]
            // setColorBars([...colorBars, colorBars[bar1]["selected"]=true])
            console.log(colorBars[bar1]);
                        
            // const swapBars = [...animationBars];
            // setAnimationBars(currentState => currentState.push(100))
            // [swapBars[anim[a][0]], swapBars[anim[a][1]]] = [swapBars[anim[a][1]], swapBars[anim[a][0]]];
            // console.log(swapBars);
            // setAnimationBars(swapBars)
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