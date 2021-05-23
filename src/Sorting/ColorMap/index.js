import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import ColorBar from "./ColorBar";
import SortingDropdown  from '../SortingDropdown';

import { colorShuffle } from '../utilities';

import colorMapFunctions from "../utilities/colorMapFunctions";

const ColorMap = () => {
    const [ colors, ] = useState(colorShuffle(200))
    const [ animations, setAnimations] = useState([])
    const [ sort, setSort ] = useState("bubble");
    const [ sortType, setSortType] = useState({ function: colorMapFunctions.defaultSort });
    const [ animationType, setAnimationType] = useState({ function: colorMapFunctions.defaultAnimations });

    useEffect(() => {
        setSortType({ function: colorMapFunctions[`${sort}Sort`]})
        setAnimationType({ function: colorMapFunctions[`${sort}SortAnimation`]})
    }, [sort])

    useEffect(() => {
        cancelAnimations(animations)
        buildAnimations(colors)
    }, [sortType])

    const buildAnimations = (colors) => {
        const colorAnimations = animationType.function(sortType.function(colors))
        pauseAnimations(colorAnimations)
        setAnimations(colorAnimations)
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
        <div className="color-map">
            <div className="chart">
                {colors.map((color, colorIndex) => {
                    return (
                        <ColorBar key={colorIndex} color={color} />
                    )
                })}
                <SortingDropdown sortType={sort} sortFn={setSort}/>
                <ButtonGroup>
                    <Button onClick={() => playAnimations(animations)}>Play</Button>
                    <Button onClick={() => pauseAnimations(animations)}>Pause</Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

export default ColorMap;