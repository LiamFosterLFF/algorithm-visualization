import React, { useState, useEffect } from 'react';
import Bar from "./Bar";

const BarChart = () => {
    const [bars, setBars] = useState([])

    useEffect(() => {
        const barList = [];
        for (let bar = 0; bar < 100; bar++) {
            const barHeight = Math.floor(Math.random() * 1000);
            barList.push(barHeight)
        }
        setBars(barList)
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