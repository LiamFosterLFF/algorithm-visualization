import React, { useState, useEffect } from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';

import PixelBar from "./PixelBar";
import SortingDropdown  from '../SortingDropdown';

import { pixelBarShuffle } from "../utilities";

import pixelMapFunctions from "../utilities/pixelMapFunctions";


const PixelMap = () => {
    const [pixelBars, ] = useState(pixelBarShuffle())
    const [animations, setAnimations] = useState([])
    const [ sort, setSort ] = useState("bubble");
    const [sortType, setSortType] = useState({ function: pixelMapFunctions.defaultSort });
    const [animationType, setAnimationType] = useState({ function: pixelMapFunctions.defaultAnimations });
    
    useEffect(() => {
        setSortType({ function: pixelMapFunctions[`${sort}Sort`]})
        setAnimationType({ function: pixelMapFunctions[`${sort}SortAnimation`]})
    }, [sort])

    useEffect(() => {
        cancelAnimations(animations)
        buildAnimations(pixelBars)
        
    }, [sortType])




    const buildAnimations = (pixelBars) => {
        const barAnimations = animationType.function(sortType.function(pixelBars));
        pauseAnimations(barAnimations)
        setAnimations(barAnimations)
    }

    const playAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.play()
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
            animation.cancel()
        })
    }   
    

    return (
        <>
            <SortingDropdown sortType={sort} sortFn={setSort}/>
            <ButtonGroup>
                <Button onClick={() => playAnimations(animations)}>Play</Button>
                <Button onClick={() => pauseAnimations(animations)}>Pause</Button>
            </ButtonGroup>
            <div className="pixel-map">
                <div className="chart">
                    {pixelBars.map((barHeights, barIndex) => {
                        return (
                            <PixelBar key={barIndex} heights={barHeights} />
                        )
                    })}
                </div>
            </div>
    </>
    )
}

export default PixelMap;