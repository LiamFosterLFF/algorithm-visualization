import React from 'react';
import ColorBar from "./ColorBar";

const ColorMap = ({ bars }) => {

    return (
            <div className="chart">
                {bars.map((color, colorIndex) => {
                    return (
                        <ColorBar key={colorIndex} color={color} />
                    )
                })}
            </div>
    )
}

export default ColorMap;