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
    const [ sort, setSort ] = useState("default")
    const [ sortType, setSortType ] = useState({function: sortFunctions[chartType].defaultSort });
    const [ animationType, setAnimationType ] = useState({ function: sortFunctions[chartType].defaultSortAnimation });
    
    useEffect(() => {
        cancelAnimations(animations)
        setSort("default")
        setBars(sortFunctions[chartType].shuffle(100))
        setAnimations([])
    }, [chartType])
    
    useEffect(() => {
        const formatSortFunctionName = (sortText) => {
            console.log(`${sortText.split(' ')[0].toLowerCase()}Sort`)
            return `${sortText.split(' ')[0].toLowerCase()}Sort`
        }
        setSortType({ function: sortFunctions[chartType][formatSortFunctionName(sort)]})
        setAnimationType({ function: sortFunctions[chartType][formatSortFunctionName(sort) + 'Animation']})
    }, [sort])

    useEffect(() => {
        restartAnimations(animations, bars);
    }, [sortType])

    const buildAnimations = (bars) => {
        const barAnimations = animationType.function(sortType.function(bars));
        pauseAnimations(barAnimations)
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

    const restartAnimations = (animations) => {
        cancelAnimations(animations);
        buildAnimations(bars);
    }

    const resetAnimations = (animations) => {
        setSort("default");
    }

    const cancelAnimations = animations => {
        animations.map((animation) => {
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
                    { "function": () => playAnimations(animations), text: "Play", disabled: (sort === "default") } ,
                    { "function": () => pauseAnimations(animations), text: "Pause", disabled: (sort === "default") } ,
                    { "function": () => restartAnimations(animations), text: "Restart", disabled: (sort === "default") } ,
                    { "function": () => resetAnimations(animations), text: "Reset", disabled: (sort === "default") }
                ]}
            />
        </div>
    )
}

export default Sorting;

