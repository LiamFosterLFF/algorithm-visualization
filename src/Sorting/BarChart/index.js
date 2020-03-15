import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import Bar from "./Bar";
import { barShuffle, bubbleSort, bubbleSortBarChartAnimation, selectionSort, selectionSortBarChartAnimation, insertionSort, insertionSortBarChartAnimation, mergeSort, mergeSortBarChartAnimation, quickSort, quickSortBarChartAnimation, barChartRadixSort, radixSortBarChartAnimation } from "../utilities";

const BarChart = () => {
    const [sort, setSort] = useState("bubble")
    const [bars, setBars] = useState(barShuffle(100));
    const [sortType, setSortType] = useState({function: bubbleSort});
    const [animationType, setAnimationType] = useState({ function: bubbleSortBarChartAnimation });
    console.log(sort);
    
    useEffect(() => {
        switch (sort) {
            case "bubble":
                setSortType({ function: bubbleSort})
                setAnimationType({ function: bubbleSortBarChartAnimation })
                break;
            case "selection":
                setSortType({ function: selectionSort})
                setAnimationType({ function: selectionSortBarChartAnimation })
                break;
            case "insertion":
                setSortType({ function: insertionSort})
                setAnimationType({ function: insertionSortBarChartAnimation })
                break;
            case "merge":
                setSortType({ function: mergeSort})
                setAnimationType({ function: mergeSortBarChartAnimation })
                break;
            case "quick":
                setSortType({ function: quickSort})
                setAnimationType({ function: quickSortBarChartAnimation })
                break;
            case "radix":
                setSortType({ function: barChartRadixSort})
                setAnimationType({ function: radixSortBarChartAnimation })
                break;
            }
        reset(bars)
    }, [sort])

    useEffect(() => {
        runAnimation(bars)
    }, [])

    const reset = (bars) => {
        for (let i = 0; i < bars.length; i++) {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[i];
            child1.style.height = `${bars[i]/10}%`
            child1.style.backgroundColor = "rgb(51, 226, 217)";

        }
    }

    const runAnimation = (bars) => {
        reset(bars)
        animationType.function(sortType.function(bars))
    }

    return (
        <div className="bar-chart">
            <div className="top-bar">
                <a onClick={() => setSort("bubble")}>Bubble</a>
                <a onClick={() => setSort("selection")}>Selection</a>
                <a onClick={() => setSort("insertion")}>Insertion</a>
                <a onClick={() => setSort("merge")}>Merge</a>
                <a onClick={() => setSort("quick")}>Quick</a>
                <a onClick={() => setSort("radix")}>Radix</a>
            </div>
            <div className="chart">
                {bars.map((barHeight, barIndex) => {
                    return (
                        <Bar key={barIndex} height={barHeight} />
                    )
                })}
            </div>
            <button onClick={() => runAnimation(bars)}>Go</button>
            <button onClick={() => reset(bars)}>Reset</button>
        </div>
    )
}

export default BarChart;