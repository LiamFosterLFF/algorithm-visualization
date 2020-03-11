import React, { useState, useEffect } from 'react';
import ColorBar from "./ColorBar";
import { colorShuffle } from '../utilities';

const ColorMap = () => {
    const [colors, setColors] = useState([])

    useEffect(() => {
        setColors(colorShuffle(1000))
    }, [])

    return (
        <div className="chart">
            {colors.map((color, colorIndex) => {
                return (
                    <ColorBar key={colorIndex} color={color} />
                )
            })}
        </div>
    )
}

export default ColorMap;