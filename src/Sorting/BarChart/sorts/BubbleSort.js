import React, { useEffect } from 'react';
import Bar from '../Bar';

const BubbleSort = ({ bars, reset }) => {
    
    // Bubble Sort
    const bubbleSort = (origArr) => {
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

    // Bubble Sort Bar Chart Animation
    const bubbleSortBarChartAnimation = (animations) => {
        for (let i = 0; i < animations.length; i++) {
            const [ind1, ind2] = animations[i]
            setTimeout(() => {
                const parent = document.getElementsByClassName('chart');
                const child1 = parent[0].childNodes[ind1];
                const child2 = parent[0].childNodes[ind2];

                child1.style.backgroundColor = "red";
                child2.style.backgroundColor = "red";
                [child1.style.height, child2.style.height] = [child2.style.height, child1.style.height]
                setTimeout(() => {
                    child1.style.backgroundColor = "rgb(51, 226, 217)";
                    child2.style.backgroundColor = "rgb(51, 226, 217)";
                }, 1);
            }, i * 1);
        }
    }   

    const runAnimation = () => {
        reset(bars)
        bubbleSortBarChartAnimation(bubbleSort(bars))
    }

    useEffect(() => {
        runAnimation(bars)
        
    }, [])
    
    return (
        <div className="chart">
            {bars.map((barHeight, barIndex) => {
                return (
                    <Bar key={barIndex} height={barHeight} />
                )
            })}
            <button onClick={() => runAnimation(bars)}>Go</button>
            <button onClick={() => reset(bars)}>Reset</button>
        </div>
        )
}

export default BubbleSort;