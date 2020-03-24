export const scrambleImage = (imageData) => {

    const pixellateInSets = (array, size) => {
        // Breaks the color data up by pixel, to make it easier to shuffle
        
        const pixArray = [];
        const indexArray = []
        for (let i = 0; i < array.length; i += 4) {
            const pixel = [array[i], array[i + 1], array[i + 2], array[i + 3]];
            pixArray.push(pixel)
            indexArray.push(i / 4)
        }
        const pixArrayInSets = [];
        const indexArrayInSets=[];
        
        for (let i=0; i < Math.floor(pixArray.length/size) + 1; i++ ) {
            pixArrayInSets.push(pixArray.slice(i*size, ((i+1)*size)))
            indexArrayInSets.push(indexArray[i * size])
        };
        
        return [pixArrayInSets, indexArrayInSets]
    };

    const pixelPaintingShuffle = (array, indexArray) => {
        for (let i = array.length - 1; i > 0; i--) {
            
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
        }
        return [array, indexArray]
    };

    const dePixellateFromSets = (array) => {
        // Returns the data to it's original form, all in a single-depth array
        const depixArray = [];
        array.forEach((set) => {
            set.forEach((pixel) => {
                depixArray.push(
                    pixel[0],
                    pixel[1],
                    pixel[2],
                    pixel[3]
                );
            })
        })
        
        
        return depixArray
    }
    

    // Pixellates, shuffles, depixellates, turns into a Uint8ClampedArray (necessary for ImageData Obj) and returns a new ImageData obj (necessary to load into canvas)
    const [pixData, indexData] = pixellateInSets(imageData.data, 10000);
    const [scrambledPixData, scrambledIndexData] = pixelPaintingShuffle(pixData, indexData);
    const scrambledData = dePixellateFromSets(scrambledPixData);

    return [scrambledData, scrambledIndexData]
}

// Draw the Initial Image to the Screen 
export const drawInitialImage = (canvas, img, returnScrambledImageCallback, returnScrambledIndexCallback) => {
    const context = canvas.current.getContext('2d');
    const image = new Image()
    image.src = img

    image.onload = () => {
        // Draws image, hides it, gets imagedata from it, scrambles that data, returns that data to be used in pixelPaintingBubbleSortAnimation, then sets that same data as a new imagedata object and draws to screen 
        context.drawImage(image, 0, 0)
        image.style.display = 'none';
        const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        const [scrambledImage, scrambledImageIndices] = scrambleImage(imageData)
        console.log("a", scrambledImage);
        console.log("B", scrambledImageIndices);
        
        returnScrambledImageCallback(scrambledImage)
        returnScrambledIndexCallback(scrambledImageIndices)
        
        const scrambledUint8ClampedArray = new Uint8ClampedArray(scrambledImage)
        const scrambledImageData = new ImageData(scrambledUint8ClampedArray, imageData.width, imageData.height)
        context.putImageData(scrambledImageData, 0, 0)
    }
}




// Pixel Painting Bubble Sort
export const pixelPaintingBubbleSort = (origArr) => {
    
    if (origArr !== []) {
        // Clone the original array so as not to mutate it
        const arr = [...origArr]
        // Store the indices of the swaps made in order, to be used in the animations
        const animations = []
        const n = arr.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    animations.push([j, j + 1])
                }
            }
        }
        
        return animations
    }
}
// // Bubble Sort Pixel Painting Animation
// export const pixelPaintingBubbleSortAnimation = (animations, canvas, speed) => {
//     const duration = 5;   // The base duration, for easy changing later (duration can also be changed via the API)

//     animations.forEach((animation, index) => {

//         const element = chart[animation[1]];
//         const color = animation[0];


//         // Highlight two elements being compared in green, and pivot in red, and animate them being swapped
//         barAnimations.push(
//             element.animate([{ backgroundColor: `hsl(${color}, 100%, 50%)` }, { backgroundColor: `hsl(${color}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration })
//         )
//     })

//     return barAnimations
// }