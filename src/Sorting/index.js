import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import SortingDropdown  from './SortingDropdown';
import ControlButtons from './ControlButtons';
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
        setSortType({ function: sortFunctions[chartType][`${sort}Sort`]})
        setAnimationType({ function: sortFunctions[chartType][`${sort}SortAnimation`]})
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
            <SortingDropdown sortType={sort} sortFn={setSort}/>
            <ControlButtons 
                disabled={sort === "default"}
                play={() => playAnimations(animations)} 
                pause={() => pauseAnimations(animations)}
                restart={() => restartAnimations(animations)}
                reset={() => resetAnimations(animations)}
            />
        </div>
    )
}

export default Sorting;

