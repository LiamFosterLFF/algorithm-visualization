// ***Sort Functions***
// Bubble Sort
export const bubbleSort = (origArr) => {
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
// Bubble Sort Bar Chart Animation
export const bubbleSortBarChartAnimation = (animations) => {
    for (let i = 0; i < animations.length; i++) {
        const [ind1, ind2] = animations[i]
        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[ind1];
            const child2 = parent[0].childNodes[ind2];
            child1.style.backgroundColor = "red";
            child2.style.backgroundColor = "red";
            [child1.style.height, child2.style.height] = [child2.style.height, child1.style.height]
            setTimeout(() => {
                child1.style.backgroundColor = "rgb(51, 226, 217)";
                child2.style.backgroundColor = "rgb(51, 226, 217)";
            }, 10);
        }, i * 10);
    }
}


// Selection Sort 
export const selectionSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIndex = i;
        for (let j = i; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
            // Checks if sort has reached the end of Array, if so, records that there will be a swap between i and min
            let swap = false;
            if (j === n - 1) {
                swap = true;
            }
            animations.push([i, j, minIndex, swap])
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return animations
}

// Selection Sort Bar Chart Animation
export const selectionSortBarChartAnimation = (animations) => {
    for (let i = 0; i < animations.length; i++) {
        const [baseIndex, checkIndex, minIndex, swap] = animations[i]
        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const baseChild = parent[0].childNodes[baseIndex];
            const checkingChild = parent[0].childNodes[checkIndex];
            const minChild = parent[0].childNodes[minIndex];
            baseChild.style.backgroundColor = "blue";
            checkingChild.style.backgroundColor = "green";
            // minChild.style.backgroundColor = "red";
            if (swap === true) {
                [baseChild.style.height, minChild.style.height] = [minChild.style.height, baseChild.style.height]
            }
            setTimeout(() => {
                // baseChild.style.backgroundColor = "rgb(51, 226, 217)";
                checkingChild.style.backgroundColor = "rgb(51, 226, 217)";
                // minChild.style.backgroundColor = "rgb(51, 226, 217)";
            }, 10);
        }, i * 10);
    }
}


// Insertion Sort 
export const insertionSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;
    console.log(arr)
    for (let i = 1; i < n; i++) {
        const key = arr[i]
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            animations.push([j, j + 1, "pass"])
            j = j - 1
        }
        arr[j + 1] = key
        animations.push([j + 1, key, "insert"])
    }

    return animations
}

// Insertion Sort Bar Chart Animations
export const insertionSortBarChartAnimation = (animations) => {
    for (let i = 0; i < animations.length; i++) {
        setTimeout(() => {
            // If pass, swap the heights; if swap, enter the key value as the height for selected element 
            if (animations[i][2] === "pass") {
                const [ind1, ind2] = animations[i]
                const parent = document.getElementsByClassName('chart');
                const child1 = parent[0].childNodes[ind1];
                const child2 = parent[0].childNodes[ind2];
                child2.style.height = child1.style.height
                // setTimeout(() => {
                //     child1.style.backgroundColor = "rgb(51, 226, 217)";
                //     child2.style.backgroundColor = "rgb(51, 226, 217)";
                // }, 10);
            } else if (animations[i][2] === "insert") {
                const [ind, key] = animations[i]
                const parent = document.getElementsByClassName('chart');
                const child1 = parent[0].childNodes[ind];
                // child1.style.backgroundColor = "blue";
                child1.style.height = `${key / 10}%`;
            }
        }, i * 10);
    }
}


// Merge Sort 
export const mergeSort = (origArray) => {
    const mainArray = [...origArray];
    const n = mainArray.length
    const animations = [];
    const auxArray = [...mainArray]
    if (n <= 1) {
        return mainArray
    }
    mergeSortHelper(mainArray, 0, n - 1, auxArray, animations);
    // console.log("main", mainArray, "aux", auxArray);;

    return animations;
}

const mergeSortHelper = (mainArray, startIdx, endIdx, auxArray, animations) => {
    if (startIdx === endIdx) return;
    const midIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxArray, startIdx, midIdx, mainArray, animations);
    mergeSortHelper(auxArray, midIdx + 1, endIdx, mainArray, animations);
    // console.log("main", mainArray, "aux", auxArray, "start", startIdx, "end", endIdx);

    merge(mainArray, startIdx, midIdx, endIdx, auxArray, animations)
}

const merge = (mainArray, startIdx, midIdx, endIdx, auxArray, animations) => {
    let i = startIdx;
    let j = midIdx + 1;
    let k = startIdx;
    while (i <= midIdx && j <= endIdx) {
        const animation = {};
        animation.comparison = [i, j];
        animation.range = [startIdx, endIdx]
        if (auxArray[i] >= auxArray[j]) {
            animation.swap = [k, auxArray[j]]
            mainArray[k++] = auxArray[j++]
        } else {
            animation.swap = [k, auxArray[i]]
            mainArray[k++] = auxArray[i++]
        }
        animations.push(animation);
    }
    while (j <= endIdx) {
        animations.push({
            comparison: [j, j],
            swap: [k, auxArray[j]],
            range: [startIdx, endIdx]
        })
        mainArray[k++] = auxArray[j++]

    }
    while (i <= midIdx) {
        animations.push({
            comparison: [i, i],
            swap: [k, auxArray[i]],
            range: [startIdx, endIdx]
        })
        mainArray[k++] = auxArray[i++]
    }
}

// Merge Sort Bar Chart Animation 
export const mergeSortBarChartAnimation = (animations, speed) => {
    for (let i = 0; i < animations.length; i++) {
        const { comparison, swap, range } = animations[i]

        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const comparison1 = parent[0].childNodes[comparison[0]];
            const comparison2 = parent[0].childNodes[comparison[1]];
            const swap1 = parent[0].childNodes[swap[0]];
            comparison1.style.backgroundColor = "red";
            comparison2.style.backgroundColor = "red";
            setTimeout(() => {
                swap1.style.height = `${swap[1] / 10}%`;
                comparison1.style.backgroundColor = "rgb(51, 226, 217)";
                comparison2.style.backgroundColor = "rgb(51, 226, 217)";
            }, speed);
        }, i * speed);
    }
}


// Quick Sort 
export const quickSort = (origArray) => {
    const array = [...origArray];
    const animations = [];
    const quickSortHelper = (array, left, right, animations) => {
        if (left >= right) return;

        const pivot = array[Math.floor((left + right) / 2)];
        const index = partition(array, left, right, pivot);

        quickSortHelper(array, left, index - 1, animations);
        quickSortHelper(array, index, right, animations);
    }

    const partition = (array, left, right, pivot) => {
        while (left <= right) {
            while (array[left] < pivot) {
                left++
            }
            while (array[right] > pivot) {
                right--
            }
            if (left <= right) {
                [array[left], array[right]] = [array[right], array[left]]
                animations.push([left, right])
                left++
                right--
            }
        }
        return left;
    }
    quickSortHelper(array, 0, array.length - 1)
    return animations
}

// Quick Sort Bar Chart Animations 
export const quickSortBarChartAnimation = (animations, speed) => {
    for (let i = 0; i < animations.length; i++) {
        const [left, right] = animations[i];

        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[left];
            const child2 = parent[0].childNodes[right];
            child1.style.backgroundColor = "red";
            child2.style.backgroundColor = "red";
            setTimeout(() => {
                [child1.style.height, child2.style.height] = [child2.style.height, child1.style.height]
                child1.style.backgroundColor = "rgb(51, 226, 217)";
                child2.style.backgroundColor = "rgb(51, 226, 217)";
            }, speed);
        }, i * speed);
    }
}

// Radix Sort

// Heap Sort


// PixelMap Animations 

// Pixel Map Bubble Sort
export const pixelMapBubbleSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j][0] > arr[j + 1][0]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                animations.push([j, j + 1])
            }
        }
    }
    return animations
}

// Bubble Sort Pixel Mpa Animation
export const bubbleSortPixelMapAnimation = (animations, speed) => {
    for (let i = 0; i < animations.length; i++) {
        const [ind1, ind2] = animations[i]
        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[ind1];
            const child2 = parent[0].childNodes[ind2];
            // console.log(child1);

            // child1.style.backgroundColor = "red";
            // child2.style.backgroundColor = "red";
            for (let i = 0; i <= 2; i++) {
                [child1.childNodes[i].style.height, child2.childNodes[i].style.height] = [child2.childNodes[i].style.height, child1.childNodes[i].style.height]

            }
            setTimeout(() => {
                // child1.style.backgroundColor = "rgb(51, 226, 217)";
                // child2.style.backgroundColor = "rgb(51, 226, 217)";
            }, speed);
        }, i * speed);
    }
}


// Radix Bar Sort 
export const barChartRadixSort = (origArr) => {
    const arr = [...origArr]
    const animations = [];
    const countBuckets = [];
    for (let i = 0; i < 10; i++) {
        countBuckets[i] = []
    }

    let max = 0;
    const strArray = []
    for (let j = 0; j < arr.length; j++) {
        max = (arr[j].toString().length > max) ? arr[j].toString().length : max;
    }

    for (let l = 0; l < max; l++) {

        while (arr.length) {
            const stringNum = arr[0].toString()
            const d = stringNum.length - l - 1
            const digit = (stringNum[d]) ? stringNum[d] : 0
            countBuckets[digit].push(arr.shift())
        }
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            while (countBuckets[i].length) {
                const num = countBuckets[i].shift()

                arr.push(num)
                animations.push([num, counter])
                counter++
            }
        }


    }
    return animations

}


// Radix Bar Sort Animation 
export const radixSortBarChartAnimation = (animations, speed) => {
    for (let i = 0; i < animations.length; i++) {
        const [ht, ind1] = animations[i]
        setTimeout(() => {
            const parent = document.getElementsByClassName('chart');
            const child1 = parent[0].childNodes[ind1];
            child1.style.height = `${ht / 10}%`
            // setTimeout(() => {
            //     // child1.style.backgroundColor = "rgb(51, 226, 217)";
            //     // child2.style.backgroundColor = "rgb(51, 226, 217)";
            // }, speed);
        }, i * speed);
    }
}


// ***Display Functions***

// BarChart
export const barShuffle = (bars) => {
    const barList = [];
    for (let bar = 0; bar < bars; bar++) {
        const barHeight = Math.floor(Math.random() * 1000);
        barList.push(barHeight)
    }
    return barList;
}


// ColorMap
export const colorShuffle = (bars) => {
    const colorList = [];
    for (let color = 0; color < bars; color++) {
        const hueValue = Math.floor(Math.random() * 359)

        colorList.push(hueValue)
    }
    return colorList
}


// PixelMap
const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
};


export const pixelBarShuffle = () => {
    const pixelBarList = [];
    const height = 200;
    for (let pixBar = 0; pixBar < height; pixBar++) {
        const pixelBarHeights = [height - pixBar - 1, 1, pixBar]
        pixelBarList.push(pixelBarHeights)
    }
    return shuffle(pixelBarList)
}


// PixelPainting




export const scrambleImage = (imageData) => {

    const pixellate = (array) => {
        // Breaks the color data up by pixel, to make it easier to shuffle
        const pixArray = [];
        const indexArray = []
        for (let i = 0; i < array.length; i += 4) {
            const pixel = [array[i], array[i + 1], array[i + 2], array[i + 3]];
            pixArray.push(pixel)
            indexArray.push(i/4)
        }
        return [pixArray, indexArray]
    };

    const pixelPaintingShuffle = (array, indexArray) => {

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
        }
        return [array, indexArray]
    };

    const dePixellate = (array) => {
        // Returns the data to it's original form, all in a single-depth array
        const depixArray = [];
        for (let j = 0; j < array.length; j++) {
            depixArray.push(
                array[j][0],
                array[j][1],
                array[j][2],
                array[j][3]
            );
        }
        return depixArray
    };

    // Pixellates, shuffles, depixellates, turns into a Uint8ClampedArray (necessary for ImageData Obj) and returns a new ImageData obj (necessary to load into canvas)
    const [pixData, indexData] = pixellate(imageData.data);
    const [scrambledPixData, scrambledIndexData] = pixelPaintingShuffle(pixData, indexData);    
    const scrambledData = dePixellate(scrambledPixData);
    
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



