import React from 'react';
import PixelBar from "./PixelBar";

const PixelMap = ({ bars }) => {

    return (
        <div className="chart">
            {bars.map((barHeights, barIndex) => {
                return (
                    <PixelBar key={barIndex} heights={barHeights} />
                )
            })}
        </div>
    )
}

export default PixelMap;