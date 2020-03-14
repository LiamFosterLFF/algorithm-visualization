import React, { useRef, useState, useEffect } from 'react';
import scream from './scream.jpg'
import theStarryNight from './the-starry-night.jpg'
import { scrambleImage, drawInitialImage } from '../utilities';

const PixelPainting = () => {
    const canvas = useRef(null);

    const canvasDimensions = {
        x: 950,
        y: 761
    }

    // Pixel Painting Animations 

    // Pixel Painting Bubble Sort
    const pixelPaintingBubbleSort = (origArr) => {
        if (origArr !== []) {
            // Clone the original array so as not to mutate it
            const arr = [...origArr]
            // Store the indices of the swaps made in order, to be used in the animations
            const animations = []
            const n = arr.length;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    console.log(i, j)
                    // if (arr[j] > arr[j + 1]) {
                    //     [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    //     animations.push([j, j + 1])
                    // }
                }
            }
            // return animations
        }
    }

    // Bubble Sort Pixel Painting Animation
    const bubbleSortpixelPaintingAnimation = (animations, speed) => {
        for (let i = 0; i < animations.length; i++) {
            const [ind1, ind2] = animations[i]
            setTimeout(() => {
                const parent = document.getElementsByClassName('chart');
                const child1 = parent[0].childNodes[ind1];
                const child2 = parent[0].childNodes[ind2];
                // console.log(child1);

                [child1.style.backgroundColor, child2.style.backgroundColor] = [child2.style.backgroundColor, child1.style.backgroundColor]

                setTimeout(() => {
                    // child1.style.backgroundColor = "rgb(51, 226, 217)";
                    // child2.style.backgroundColor = "rgb(51, 226, 217)";
                }, speed);
            }, i * speed);
        }
    }
    
    // useEffect(() => {
        //     bubbleSortpixelPaintingAnimation(animations, 0)
        
        // }, [])
        
        
        
    const [drawingImage, setDrawingImage] = useState(theStarryNight) 
    const [imageIndicesArray, setImageIndicesArray] = useState([]) 
    console.log(imageIndicesArray);
    const [animations, setAnimations] = useState(pixelPaintingBubbleSort(imageIndicesArray))
    console.log(animations);

    useEffect(() => {
        drawInitialImage(
            canvas,
             drawingImage,
            (scrambledImageData) => setDrawingImage(scrambledImageData),
            (scrambledImageDataIndices) => setImageIndicesArray(scrambledImageDataIndices)
            );
        
    },[])


    return (
        <div>
            <canvas ref={canvas} id="image-canvas" width={canvasDimensions.x} height={canvasDimensions.y}></canvas>
        </div>
    )
}

export default PixelPainting;







