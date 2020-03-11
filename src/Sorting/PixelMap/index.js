import React, { useState, useEffect } from 'react';
import PixelBar from "./PixelBar";
import { shuffle } from '../utilities';

const PixelMap = () => {
    const [pixelBars, setPixelBars] = useState([])

    useEffect(() => {
        const pixelBarList = [];
        const height = 200;
        for (let pixBar = 0; pixBar < height; pixBar++) {
            const pixelBarHeights = [height - pixBar - 1, 1, pixBar]
            pixelBarList.push(pixelBarHeights)
        }
        
        setPixelBars(shuffle(pixelBarList));
    }, [])

    console.log(pixelBars)
    return (
        <div className="chart">
            {pixelBars.map((barHeights, barIndex) => {
                return (
                    <PixelBar key={barIndex} heights={barHeights} />
                )
            })}
        </div>
    )
}

export default PixelMap;