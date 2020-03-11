import React, { useRef, useEffect } from 'react';
import scream from './scream.jpg'
import theStarryNight from './the-starry-night.jpg'
import { scrambleImage } from '../utilities';

const PixelPainting = () => {
    const canvas = useRef(null);

    const imageDimensions = {
        x: 950,
        y: 761
    }


    useEffect(() => {

    const context = canvas.current.getContext('2d');
    const image = new Image()
    image.src = theStarryNight

    image.onload = () => {
        context.drawImage(image, 0, 0)
        image.style.display = 'none';
        const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        
        const shuffledImageData = scrambleImage(imageData)
        
        context.putImageData(shuffledImageData, 0, 0)
    }
})

    return (
        <div>
            <canvas ref={canvas} id="image-canvas" width={imageDimensions.x} height={imageDimensions.y}></canvas>
        </div>
    )
}

export default PixelPainting;