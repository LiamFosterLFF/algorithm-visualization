import React, { useRef, useState, useEffect } from 'react';
import scream from './scream.jpg'
import theStarryNight from './the-starry-night.jpg'
import { drawInitialImage, pixelPaintingBubbleSort, pixelPaintingBubbleSortAnimation } from '../utilities/pixelPaintingFunctions';

const PixelPainting = () => {
    const canvas = useRef(null);
    const canvasDimensions = {
        x: 950,
        y: 761
    }
    const [drawingImage, setDrawingImage] = useState(theStarryNight) 
    const [imageIndicesArray, setImageIndicesArray] = useState([]) 

    useEffect(() => {
        drawInitialImage(
            canvas,
            drawingImage,
            (scrambledImageData) => setDrawingImage(scrambledImageData),
            (scrambledImageDataIndices) => setImageIndicesArray(scrambledImageDataIndices)
            );
    },[])

    useEffect(() => {
        const colorAnimations = pixelPaintingBubbleSort(imageIndicesArray)
    }, [imageIndicesArray])


    // const [sort, setSort] = useState("bubble")
    // const [animations, setAnimations] = useState([])
    // const [sortType, setSortType] = useState({ function: pixelPaintingBubbleSort });
    // const [animationType, setAnimationType] = useState({ function: pixelPaintingBubbleSortAnimation });

    // useEffect(() => {
    //     switch (sort) {
    //         case "bubble":
    //             setSortType({ function: pixelPaintingBubbleSort })
    //             setAnimationType({ function: pixelPaintingBubbleSortAnimation })
    //             break;
    // //         case "selection":
    // //             setSortType({ function: selectionSort })
    // //             setAnimationType({ function: colorMapSelectionSortAnimation })
    // //             break;
    // //         case "insertion":
    // //             setSortType({ function: insertionSort })
    // //             setAnimationType({ function: colorMapInsertionSortAnimation })
    // //             break;
    // //         case "merge":
    // //             setSortType({ function: mergeSort })
    // //             setAnimationType({ function: colorMapMergeSortAnimation })
    // //             break;
    // //         case "quick":
    // //             setSortType({ function: quickSort })
    // //             setAnimationType({ function: colorMapQuickSortAnimation })
    // //             break;
    // //         case "radix":
    // //             setSortType({ function: radixSort })
    // //             setAnimationType({ function: colorMapRadixSortAnimation })
    // //             break;
    //     }
    // }, [sort])

    useEffect(() => {
        // resetAnimations(animations)
        runAnimations(imageIndicesArray)
    }, [])

    const runAnimations = (imageIndicesArray) => {
        // const colorAnimations = animationType.function(sortType.function(imageIndicesArray))
        const colorAnimations = pixelPaintingBubbleSort(imageIndicesArray)
        console.log(colorAnimations);
        
        // setAnimations(colorAnimations)
    }

    // const playAnimations = (animations) => {
    //     animations.map((animation) => {
    //         if (animation.playState !== "finished") {
    //             animation.play()
    //         }
    //     })
    // }

    // const pauseAnimations = (animations) => {
    //     animations.map((animation) => {
    //         if (animation.playState !== "finished") {
    //             animation.pause();
    //         }
    //     })
    // }

    // const resetAnimations = animations => {
    //     animations.map((animation) => {
    //         animation.cancel()
    //     })
    // }   

    return (
        <div>
            {/* <div className="top-bar">
                <li onClick={() => setSort("bubble")}>
                    bubble
                </li>
                <li onClick={() => setSort("selection")}>
                    selection
                </li>
                <li onClick={() => setSort("insertion")}>
                    insertion
                </li>
                <li onClick={() => setSort("merge")}>
                    merge
                </li>
                <li onClick={() => setSort("quick")}>
                    quick
                </li>
                <li onClick={() => setSort("radix")}>
                    radix
                </li>
            </div> */}
            <canvas ref={canvas} id="image-canvas" width={canvasDimensions.x} height={canvasDimensions.y}></canvas>
            {/* <button onClick={() => resetAnimations(animations)}>Reset</button>
            <button onClick={() => playAnimations(animations)}>Play</button>
            <button onClick={() => pauseAnimations(animations)}>Pause</button> */}
        </div>
    )
}

export default PixelPainting;







