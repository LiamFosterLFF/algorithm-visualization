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
        
        for (let i=0; i < Math.floor(array.length/size); i++ ) {
            pixArrayInSets.push(pixArray.slice(i*size, ((i+1)*size)))
            indexArrayInSets.push(indexArray.slice(i * size, ((i + 1) * size)))
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
        console.log(depixArray[0]);
        
        
        return depixArray
    }
    

    // Pixellates, shuffles, depixellates, turns into a Uint8ClampedArray (necessary for ImageData Obj) and returns a new ImageData obj (necessary to load into canvas)
    const [pixData, indexData] = pixellateInSets(imageData.data, 1000);
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
        context.drawImage(image, 0, 0)
        image.style.display = 'none';
        const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        const [scrambledImage, scrambledImageIndices] = scrambleImage(imageData)
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
                console.log(i, j)
                // if (arr[j] > arr[j + 1]) {
                //     [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                //     animations.push([j, j + 1])
                // }
            }
        }
        // return animations
    }
}
// Bubble Sort Pixel Painting Animation
export const bubbleSortpixelPaintingAnimation = (animations, speed) => {
    for (let i = 0; i < animations.length; i++) {
        const [ind1, ind2] = animations[i]
        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[ind1];
            const child2 = parent[0].childNodes[ind2];
            // console.log(child1);
            [child1.style.backgroundColor, child2.style.backgroundColor] = [child2.style.backgroundColor, child1.style.groundColor]
            setTimeout(() => {
                // child1.style.backgroundColor = "rgb(51, 226, 217)";
                // child2.style.backgroundColor = "rgb(51, 226, 217)";
            }, speed);
        }, i * speed);
    }
}