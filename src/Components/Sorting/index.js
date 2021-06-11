import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import DropdownMenu from '../DropdownMenu';
import ControlButtons from '../ControlButtons';
import sortFunctions from "./utilities";

import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [ chartType, setChartType ] = useState("barChart");
    const [ bars, setBars] = useState(sortFunctions[chartType].shuffle());
    const [ animations, setAnimations ] = useState([])
    // Sort value used to set sorts and animations, honestly following three could be a single state item
    const [ sort, setSort ] = useState("default")
    const [ sortType, setSortType ] = useState({function: sortFunctions[chartType].defaultSort });
    const [ animationType, setAnimationType ] = useState({ function: sortFunctions[chartType].defaultSortAnimation });
    
    // Side effect for changing chart type, resets bars and animations every time chart is changed (currently, could save possibly)
    useEffect(() => {
        cancelAnimations(animations);
        setSort("default")
        // Currently, bars are set by their personal functions but this will need to change if they are to be changeable dynamically
        setBars(sortFunctions[chartType].shuffle())
        setAnimations([])
    }, [chartType])
    
    // As said above, this would probably be better if it were a single usestate hook but this is how sorts are changed presently
    useEffect(() => {
        const formatSortFunctionName = (sortText) => {
            return `${sortText.split(' ')[0].toLowerCase()}Sort`
        }
        setSortType({ function: sortFunctions[chartType][formatSortFunctionName(sort)]})
        setAnimationType({ function: sortFunctions[chartType][formatSortFunctionName(sort) + 'Animation']})
    }, [sort, chartType])

    // Changing the sort type cancels the previous animations and sets new ones
    useEffect(() => {
        restartAnimations(animations, bars);
    }, [sortType, bars])


    // Control functionality
    const playAnimations = (animations) => {
        animations.forEach((animation) => {
            if (animation.playState !== "finished") { animation.play() }
        })
    }

    const pauseAnimations = (animations) => {
        animations.forEach((animation) => {
            if (animation.playState !== "finished") { animation.pause() }
        })
    }

    const restartAnimations = (animations) => {
        cancelAnimations(animations);
        const barAnimations = animationType.function(sortType.function(bars));
        pauseAnimations(barAnimations)
        setAnimations(barAnimations);
    }

    const resetAnimations = () => {
        setSort("default");
    }

    const cancelAnimations = animations => {
        animations.forEach((animation) => {
            animation.cancel();
        })
    }   

    return (
        <div>
            <Tabs
                id="controlled-tab-example"
                activeKey={chartType}
                onSelect={(chart) => setChartType(chart)}
            >
                <Tab eventKey="barChart" title="Bar Chart">
                    <BarChart bars={bars}/>
                </Tab>
                <Tab eventKey="colorMap" title="Color Map">
                    <ColorMap bars={bars}/>
                </Tab>
                <Tab eventKey="pixelMap" title="Pixel Map">
                    <PixelMap bars={bars}/>
                </Tab>
            </Tabs>
            <DropdownMenu
                type={"Sorting"}
                select={setSort}
                title={sort}
                algorithms={["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort", "Radix Sort"]}
            />
            <ControlButtons 
                buttons={[
                    { "function": () => playAnimations(animations), text: "Play", disabled: (sort === "default"), tooltip: "Choose a Sorting Algorithm" } ,
                    { "function": () => pauseAnimations(animations), text: "Pause", disabled: (sort === "default"), tooltip: "Choose a Sorting Algorithm" } ,
                    { "function": () => restartAnimations(animations), text: "Restart", disabled: (sort === "default"), tooltip: "Choose a Sorting Algorithm" } ,
                    { "function": () => resetAnimations(animations), text: "Reset", disabled: (sort === "default"), tooltip: "Choose a Sorting Algorithm" }
                ]}
            />
        </div>
    )
}

export default Sorting;

