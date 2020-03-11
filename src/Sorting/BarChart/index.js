import React, { useState, useEffect } from 'react';
import Chart from "./Chart";
import { barShuffle } from "../utilities";

const BarChart = () => {
    const [bars, setBars] = useState([]);
    const [animations, setAnimations] = useState([]);

    const bubbleSort = (origArr) => {
        // Clone the original array so as not to mutate it
        const arr = [...origArr]
        // Store the indices of the swaps made in order, to be used in the animations
        const animations =[]
        const n = arr.length;
        for (let i=0; i<n; i++) {
            for (let j=0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                    animations.push([j, j+1])
                }
            }
        }
        return animations
    }

    useEffect(() => {      
        const shuffle = barShuffle(100)
        setBars(shuffle)

        const animations  = bubbleSort(shuffle)
        setAnimations(animations)
        
    }, [])


    return (
        <Chart animations={animations} bars={bars}/>
    )
}

export default BarChart;