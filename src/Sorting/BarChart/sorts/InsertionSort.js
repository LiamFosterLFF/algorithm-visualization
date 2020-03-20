import React, {useEffect} from 'react';
import Bar from '../Bar';

const InsertionSort = ({ bars, go, reset }) => {
    // Insertion Sort 
    const insertionSort = (origArr) => {
        // Clone the original array so as not to mutate it
        const arr = [...origArr]
        // Store the indices of the swaps made in order, to be used in the animations
        const animations = []
        const n = arr.length;
        console.log(arr)
        for (let i = 1; i < n; i++) {
            const key = arr[i]
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                animations.push([j, j + 1, "pass"])
                j = j - 1
            }
            arr[j + 1] = key
            animations.push([j + 1, key, "insert"])
        }

        return animations
    }

    // Insertion Sort Bar Chart Animations
    const insertionSortBarChartAnimation = (animations) => {
        for (let i = 0; i < animations.length; i++) {
            setTimeout(() => {
                // If pass, swap the heights; if swap, enter the key value as the height for selected element 
                if (animations[i][2] === "pass") {
                    const [ind1, ind2] = animations[i]
                    const parent = document.getElementsByClassName('chart');
                    const child1 = parent[0].childNodes[ind1];
                    const child2 = parent[0].childNodes[ind2];
                    child2.style.height = child1.style.height
                    // setTimeout(() => {
                    //     child1.style.backgroundColor = "rgb(51, 226, 217)";
                    //     child2.style.backgroundColor = "rgb(51, 226, 217)";
                    // }, 10);
                } else if (animations[i][2] === "insert") {
                    const [ind, key] = animations[i]
                    const parent = document.getElementsByClassName('chart');
                    const child1 = parent[0].childNodes[ind];
                    // child1.style.backgroundColor = "blue";
                    child1.style.height = `${key / 10}%`;
                }
            }, i * 10);
        }
    }

    const runAnimation = () => {
        reset(bars)
        insertionSortBarChartAnimation(insertionSort(bars))
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
            <button onClick={() => go(bars)}>Go</button>
            <button onClick={() => reset(bars)}>Reset</button>
        </div>
        )
}

export default InsertionSort;