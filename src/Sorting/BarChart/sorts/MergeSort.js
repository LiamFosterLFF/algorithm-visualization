import React from 'react';
import Bar from '../Bar';

const MergeSort = ({ bars, go, reset }) => {
    

    return (
        <div className="chart">
            {bars.map((barHeight, barIndex) => {
                return (
                    <Bar key={barIndex} height={barHeight} />
                        )
            })}
            <button onClick={() => go(bars)}>Go</button>
            <button onClick={() => reset(bars)}>Reset</button>
        </div>
        )
}

export default MergeSort;