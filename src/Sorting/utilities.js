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

// Bubble Sort Animation
export const bubbleSortAnimation = (animations) => {
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

// Selection Sort Animation
export const selectionSortAnimation = (animations) => {
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

// Insertion Sort Animations
export const insertionSortAnimation = (animations) => {
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

// Merge Sort Animation 
export const mergeSortAnimation = (animations, speed) => {
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
export const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
};


// PixelPainting
export const scrambleImage = (imageData) => {

    const pixellate = (array) => {
        // Breaks the color data up by pixel, to make it easier to shuffle
        const pixArray = [];
        for (let i = 0; i < array.length; i += 4) {
            const pixel = [array[i], array[i + 1], array[i + 2], array[i + 3]];
            pixArray.push(pixel)
        }
        return pixArray
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
    const pixData = pixellate(imageData.data);
    const shuffledPixData = shuffle(pixData);
    const shuffledData = dePixellate(shuffledPixData);
    const newUint8ClampedArray = new Uint8ClampedArray(shuffledData)
    const newImageData = new ImageData(newUint8ClampedArray, imageData.width, imageData.height)
    return newImageData
}
;

