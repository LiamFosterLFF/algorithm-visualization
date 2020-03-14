import React, { useState, useEffect } from 'react';
import ColorBar from "./ColorBar";
import { colorShuffle } from '../utilities';

const ColorMap = () => {
    const [colors, setColors] = useState(colorShuffle(1000))
    
    // ColorMap Animations 

    // ColorMap Bubble Sort
    const colorMapBubbleSort = (origArr) => {
        // Clone the original array so as not to mutate it
        const arr = [...origArr]
        // Store the indices of the swaps made in order, to be used in the animations
        const animations = []
        const n = arr.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    animations.push([j, j + 1])
                }
            }
        }
        return animations
    }

    // Bubble Sort Color Map Animation
    const bubbleSortColorMapAnimation = (animations, speed) => {
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
    const [animations, setAnimations] = useState(colorMapBubbleSort(colors))
    
    useEffect(() => {
        bubbleSortColorMapAnimation(animations, 0)

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