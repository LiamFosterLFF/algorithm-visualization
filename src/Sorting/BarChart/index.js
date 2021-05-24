import React from 'react';
import Bar from './Bar';

const BarChart = ({ bars }) => {
    console.log(bars);
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