import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

import Bar from './Bar';

import { barShuffle, defaultSort, defaultAnimations, bubbleSort, bubbleSortBarChartAnimation, selectionSort, selectionSortBarChartAnimation, insertionSort, insertionSortBarChartAnimation, mergeSort, mergeSortBarChartAnimation, quickSort, quickSortBarChartAnimation, barChartRadixSort, radixSortBarChartAnimation } from "../utilities";

const BarChart = ({ sort }) => {
    const [ bars, ] = useState(barShuffle(100));
    const [ animations, setAnimations ] = useState([])
    const [ sortType, setSortType ] = useState({function: defaultSort});
    const [ animationType, setAnimationType ] = useState({ function: defaultAnimations });
    
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
            case "default":
                setSortType({ function: defaultSort})
                setAnimationType({ function: defaultAnimations })
            break;
            }
        }, [sort])

    useEffect(() => {
        cancelAnimations(animations);
        buildAnimations(bars);
    }, [sortType])

    const buildAnimations = (bars) => {
        const barAnimations = animationType.function(sortType.function(bars));
        setAnimations(barAnimations);
    }

    const playAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.play();
            }
        })
    }

    const pauseAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.pause();
            }
        })
    }

    const cancelAnimations = animations => {
        animations.map((animation) => {
            animation.cancel();
        })
    }   


    return (
            <div className="chart">
                {bars.map((barHeight, barIndex) => {
                    return (
                        <Bar key={barIndex} height={barHeight} />
                    )
                })}
                <div className="buttons-bar">
                    <Button size="lg" onClick={() => playAnimations(animations)}>Play</Button>
                    <Button onClick={() => pauseAnimations(animations)}>Pause</Button>
                </div>
            </div>

    )
}

export default BarChart;