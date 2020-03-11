import React, { useState, useEffect } from 'react';
import ColorBar from "./ColorBar";

const ColorMap = () => {
    const [colors, setColors] = useState([])

    useEffect(() => {
        const colorList = [];
        for (let color = 0; color < 1000; color++) {
            const hueValue = Math.floor(Math.random() * 359)
            
            colorList.push(hueValue)
        }
        setColors(colorList)

    }, [])

    console.log(colors)
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