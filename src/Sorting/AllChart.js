import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import Bar from './Bar';
import SortingDropdown  from '../SortingDropdown';

import sortFunctions from "../utilities";

const AllChart = () => {
    const [ chartType, setChartType ] = useState("barChart"); // Add in functionality from parent
    const [ bars, ] = useState(barShuffle(100)); // Combine all three to use the same shuffl function from the functions import
    const [ animations, setAnimations ] = useState([])
    const [ sort, setSort ] = useState("bubble")
    const [ sortType, setSortType ] = useState({function: defaultSort });
    const [ animationType, setAnimationType ] = useState({ function: defaultAnimations });
    
    useEffect(() => {
        setSortType({ function: sortFunctions[chartType][`${sort}Sort`]})
        setAnimationType({ function: sortFunctions[chartType][`${sort}SortAnimation`]})
        }, [sort])

    useEffect(() => {
        cancelAnimations(animations);
        buildAnimations(bars);
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

    const cancelAnimations = animations => {
        animations.map((animation) => {
            animation.cancel();
        })
    }   

// Replace chart with a component import depending on chart Type
// Replace buttons with their own component also
    return (
            <div className="chart">
                {bars.map((barHeight, barIndex) => {
                    return (
                        <Bar key={barIndex} height={barHeight} />
                    )
                })}
                <SortingDropdown sortType={sort} sortFn={setSort}/>
                <ButtonGroup>
                    <Button size="lg" onClick={() => playAnimations(animations)}>Play</Button>
                    <Button size="lg" onClick={() => pauseAnimations(animations)}>Pause</Button>
                </ButtonGroup>
            </div>
           
            
    )
}

export default AllChart;