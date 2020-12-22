import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import ColorBar from "./ColorBar";
import { colorShuffle, defaultSort, defaultAnimations, colorMapBubbleSort, colorMapBubbleSortAnimation, selectionSort, colorMapSelectionSortAnimation, insertionSort, colorMapInsertionSortAnimation, mergeSort, colorMapMergeSortAnimation, quickSort, colorMapQuickSortAnimation, radixSort, colorMapRadixSortAnimation } from '../utilities/colorBarFunctions';

const ColorMap = ({ sort }) => {
    const [colors, ] = useState(colorShuffle(200))
    const [animations, setAnimations] = useState([])
    const [sortType, setSortType] = useState({ function: defaultSort });
    const [animationType, setAnimationType] = useState({ function: defaultAnimations });

    useEffect(() => {
        switch (sort) {
            case "bubble":
                setSortType({ function: colorMapBubbleSort })
                setAnimationType({ function: colorMapBubbleSortAnimation })
                break;
            case "selection":
                setSortType({ function: selectionSort })
                setAnimationType({ function: colorMapSelectionSortAnimation })
                break;
            case "insertion":
                setSortType({ function: insertionSort })
                setAnimationType({ function: colorMapInsertionSortAnimation })
                break;
            case "merge":
                setSortType({ function: mergeSort })
                setAnimationType({ function: colorMapMergeSortAnimation })
                break;
            case "quick":
                setSortType({ function: quickSort })
                setAnimationType({ function: colorMapQuickSortAnimation })
                break;
            case "radix":
                setSortType({ function: radixSort })
                setAnimationType({ function: colorMapRadixSortAnimation })
                break;
        }
    }, [sort])

    useEffect(() => {
        cancelAnimations(animations)
        runAnimations(colors)
    }, [sortType])

    const runAnimations = (colors) => {
        const colorAnimations = animationType.function(sortType.function(colors))
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
                <ButtonGroup>
                    <Button onClick={() => playAnimations(animations)}>Play</Button>
                    <Button onClick={() => pauseAnimations(animations)}>Pause</Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

export default ColorMap;