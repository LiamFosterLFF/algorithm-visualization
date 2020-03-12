import React, { useState, useEffect } from 'react';
import Bar from "./Bar";
import { barShuffle, bubbleSort, bubbleSortAnimation } from "../utilities";

const BarChart = () => {
    const [bars, setBars] = useState(barShuffle(100));
    // const [animations, setAnimations] = useState(bubbleSort(bars));

    const selectionSort = (origArr) => {
        // Clone the original array so as not to mutate it
        const arr = [...origArr]
        // Store the indices of the swaps made in order, to be used in the animations
        const animations = []
        const n = arr.length;
        for (let i = 0; i < n; i++) {
            let minIndex = i;
            for (let j = i; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j
                }
                // Checks if sort has reached the end of Array, if so, records that there will be a swap between i and min
                let swap = false;
                if (j === n-1) {
                    swap = true;
                }
                animations.push([i, j, minIndex, swap])
            }
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
        return animations
    }

    const [animations, setAnimations] = useState(selectionSort(bars));


    const selectionSortAnimation = () => {
        for (let i = 0; i < animations.length; i++) {
            const [baseIndex, checkIndex, minIndex, swap] = animations[i]
            setTimeout(() => {
                const parent = document.getElementsByClassName('chart');
                const baseChild = parent[0].childNodes[baseIndex];
                const checkingChild = parent[0].childNodes[checkIndex];
                const minChild = parent[0].childNodes[minIndex];
                baseChild.style.backgroundColor = "blue";
                checkingChild.style.backgroundColor = "green";
                // minChild.style.backgroundColor = "red";
                if (swap === true) {
                    [baseChild.style.height, minChild.style.height] = [minChild.style.height, baseChild.style.height]
                }
                setTimeout(() => {
                    // baseChild.style.backgroundColor = "rgb(51, 226, 217)";
                    checkingChild.style.backgroundColor = "rgb(51, 226, 217)";
                    // minChild.style.backgroundColor = "rgb(51, 226, 217)";
                }, 10);
            }, i * 10);
        }
    }

    useEffect(() => {  
        // bubbleSortAnimation(animations)
        selectionSortAnimation(animations)
    }, [])

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