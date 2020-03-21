// Generate Random Pixel Bars
const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
};

export const pixelBarShuffle = (height) => {
    const pixelBarList = [];
    for (let pixBar = 0; pixBar < height; pixBar++) {
        const pixelBarHeights = [pixBar, 1, height - pixBar - 1]
        pixelBarList.push(pixelBarHeights)
    }
    return shuffle(pixelBarList)
}


// ColorMap Bubble Sort
export const bubbleSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j][0] > arr[j + 1][0]) {
                animations.push([[j, arr[j]], [j + 1, arr[j + 1]]]);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return animations
}



// Bubble Sort Color Map Animation
export const pixelMapBubbleSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("pixel-bar");
    const duration = .5;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];
    animations.forEach((animation, index) => {
        const compareEl1Bottom = chart[animation[0][0]].childNodes[0];
        const compareEl1Top = chart[animation[0][0]].childNodes[2];
        const compareEl2Bottom = chart[animation[1][0]].childNodes[0];
        const compareEl2Top = chart[animation[1][0]].childNodes[2];

        const swapHt1Top = animation[0][1][0];
        const swapHt1Bottom = animation[0][1][2];

        const swapHt2Top = animation[1][1][0];
        const swapHt2Bottom = animation[1][1][2];

        

        // Exchange the colors of the two elements being selected
        barAnimations.push(
            compareEl1Bottom.animate([{ height: `${3 * swapHt2Bottom}px` }, { height: `${3 * swapHt2Bottom}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
            compareEl1Top.animate([{ height: `${3 * swapHt2Top}px` }, { height: `${3 * swapHt2Top}px` }], { fill: "forwards", duration: duration, delay: index * duration }), 
            compareEl2Bottom.animate([{ height: `${3 * swapHt1Bottom}px` }, { height: `${3 * swapHt1Bottom}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
            compareEl2Top.animate([{ height: `${3 * swapHt1Top}px` }, { height: `${3 * swapHt1Top}px` }], { fill: "forwards", duration: duration, delay: index * duration })
        )

    })
    return barAnimations
}

// Selection Sort 
export const pixelMapSelectionSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIndex = i;
        for (let j = i; j < n; j++) {
            if (arr[j][0] < arr[minIndex][0]) {
                minIndex = j
            }
            // Checks if sort has reached the end of Array, if so, records that there will be a swap between i and min
            let swap = false;
            if (j === n - 1) {
                swap = true;
            }
            // Push the base Element, the element being checked, the current minimum, and an indication of whether a swap has occurred
            animations.push([[i, arr[i]], [j, arr[j]], [minIndex, arr[minIndex]], swap])
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    
    return animations
}


export const pixelMapSelectionSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("pixel-bar");
    const duration = .5;// The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        const baseChildTop = chart[animation[0][0]].childNodes[0];
        const baseChildBottom = chart[animation[0][0]].childNodes[2];
        const minChildTop = chart[animation[2][0]].childNodes[0];
        const minChildBottom = chart[animation[2][0]].childNodes[2];
        const baseTopHeight = animation[0][1][2];
        const baseBottomHeight = animation[0][1][0];
        const minTopHeight = animation[2][1][2];
        const minBottomHeight = animation[2][1][0];
        const swap = animation[3];
        
        // if the two elements are to be swapped, perform the swap 
        if (swap === true) {
            barAnimations.push(
                minChildTop.animate([{ height: `${3 * baseTopHeight}px` }, { height: `${3 * baseTopHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
                baseChildTop.animate([{ height: `${3 * minTopHeight}px` }, { height: `${3 * minTopHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
                minChildBottom.animate([{ height: `${3 * baseBottomHeight}px` }, { height: `${3 * baseBottomHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
                baseChildBottom.animate([{ height: `${3 * minBottomHeight}px` }, { height: `${3 * minBottomHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration })
            )
        }
    })

    return barAnimations
}

// Insertion Sort 
export const pixelMapInsertionSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;


    // Move up through the array one at a time, and insert each new element into already sorted numbers to the left in its proper (ascending) position 
    for (let i = 1; i < n; i++) {
        const key = arr[i]
        let j = i - 1;
        while (j >= 0 && arr[j][0] > arr[j + 1][0]) {
            animations.push([[j, arr[j]], [j + 1, arr[j + 1]]]);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            j = j - 1
        }
    }

    return animations
}


export const pixelMapInsertionSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("pixel-bar");
    const duration = 3;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        const swapElLtTop = chart[animation[0][0]].childNodes[0];
        const swapElLtBottom = chart[animation[0][0]].childNodes[2];
        const swapElLtTopHeight = animation[0][1][2];
        const swapElLtBottomHeight = animation[0][1][0];
        const swapElRtTop = chart[animation[1][0]].childNodes[0];
        const swapElRtBottom = chart[animation[1][0]].childNodes[2];
        const swapElRtTopHeight = animation[1][1][2];
        const swapElRtBottomHeight = animation[1][1][0];

        // Highlight two elements being compared in green, and animate them being swapped
        barAnimations.push(
            swapElLtTop.animate([{ height: `${3 * swapElRtTopHeight}px` }, { height: `${3 * swapElRtTopHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
            swapElLtBottom.animate([{ height: `${3 * swapElRtBottomHeight}px` }, { height: `${3 * swapElRtBottomHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
            swapElRtTop.animate([{ height: `${3 * swapElLtTopHeight}px` }, { height: `${3 * swapElLtTopHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
            swapElRtBottom.animate([{ height: `${3 * swapElLtBottomHeight}px` }, { height: `${3 * swapElLtBottomHeight}px` }], { fill: "forwards", duration: duration, delay: index * duration }),
        )
    })

    return barAnimations
}


// Merge Sort 
export const pixelMapMergeSort = (origArray) => {
    // Two separate arrays, one main one and one to hold swapped values until they can be unswapped. Avoids having to create a buffer array during the sorting process
    const mainArray = [...origArray];
    const auxArray = [...mainArray]
    const n = mainArray.length
    const animations = [];
    if (n <= 1) {
        return mainArray
    }
    // Initialize first function call
    mergeSortHelper(mainArray, 0, n - 1, auxArray, animations);
    // console.log("main", mainArray, "aux", auxArray);;

    return animations;
}

const mergeSortHelper = (mainArray, startIdx, endIdx, auxArray, animations) => {
    // Base case, returns if only one element in array
    if (startIdx === endIdx) return;

    // Find middle index of array, place to split before coming merge
    const midIdx = Math.floor((startIdx + endIdx) / 2);

    // recursively call function on each half of the array, to keep splitting until base case of 1 is reached. Also, notice that auxArray and mainArray are swapped from initial function call; it's complicated but basically this allows the aux array and main array to keep switching back and forth and save the values from the previous merge, which means that I don't have to create a temporary array to hold the values
    mergeSortHelper(auxArray, startIdx, midIdx, mainArray, animations);
    mergeSortHelper(auxArray, midIdx + 1, endIdx, mainArray, animations);

    // Call the merge function to sort the values and combine back together
    merge(mainArray, startIdx, midIdx, endIdx, auxArray, animations)
}

const merge = (mainArray, startIdx, midIdx, endIdx, auxArray, animations) => {
    // Copies the values of the aux array into the main array, putting the next lowest value from either array at value k
    let i = startIdx;
    let j = midIdx + 1;
    let k = startIdx;

    // Pick the lowest value from either array and put it into the main array
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

    // While there are still values in only one of the two arrays being merged, copy them in; they are already ordered from previous sorts 
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

export const pixelMapMergeSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("pixel-bar");
    const duration = 5;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        const swapEl = chart[animation.swap[0]];
        const swapColor = animation.swap[1];

        // Highlight two elements being compared in green, and animate them being swapped
        barAnimations.push(
            swapEl.animate([{ backgroundColor: `hsl(${swapColor}, 100%, 50%)` }, { backgroundColor: `hsl(${swapColor}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration }),
        )
    })

    return barAnimations
}

// Quick Sort 
export const pixelMapQuickSort = (origArray) => {
    // Copy original array so as not to mutate it 
    const array = [...origArray];
    const animations = [];

    const quickSortHelper = (array, left, right, animations) => {
        if (left >= right) return;

        // Find the center index, by sorting from the two ends and so that everything to the left of the pivot is smaller, and everything right is larger
        const index = partition(array, left, right);

        // split the array into two halves, and call recursively on the two halves 
        quickSortHelper(array, left, index - 1, animations);
        quickSortHelper(array, index, right, animations);
    }

    const partition = (array, left, right) => {
        // Pivot starts from right end of subarray 
        const pivot = right;
        right--;
        // Keep moving pointers towards middle until two pointers cross one another
        while (left <= right) {
            // Find a left side element smaller than pivot, and a right side one larger, and switch them 
            while (array[left] < array[pivot]) {
                left++
            }
            while (array[right] > array[pivot]) {
                right--
            }
            if (left <= right) {
                animations.push([[left, array[left]], [right, array[right]], [pivot, array[pivot]]]);
                [array[left], array[right]] = [array[right], array[left]]
                left++
                right--
            }
        }
        // Move the pivot into the middle 
        animations.push([[left, array[left]], [pivot, array[pivot]], [pivot, array[pivot]]]);
        [array[left], array[pivot]] = [array[pivot], array[left]]
        return left;
    }
    // Initial function call 
    quickSortHelper(array, 0, array.length - 1)

    return animations
}

export const pixelMapQuickSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("pixel-bar");
    const duration = 5;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {

        const leftEl = chart[animation[0][0]];
        const rightEl = chart[animation[1][0]];
        const leftColor = animation[0][1];
        const rightColor = animation[1][1];


        // Highlight two elements being compared in green, and pivot in red, and animate them being swapped
        barAnimations.push(
            leftEl.animate([{ backgroundColor: `hsl(${rightColor}, 100%, 50%)` }, { backgroundColor: `hsl(${rightColor}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration }),
            rightEl.animate([{ backgroundColor: `hsl(${leftColor}, 100%, 50%)` }, { backgroundColor: `hsl(${leftColor}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration })
        )
    })

    return barAnimations
}


// Radix Bar Sort 
export const pixelMapRadixSort = (origArr) => {
    const arr = [...origArr] // Copy original array so as not to mutate it
    const animations = [];

    // initialize an array subarrays representing numbers 0 through 9, according to their index in parent array 
    const countBuckets = [];
    for (let i = 0; i < 10; i++) {
        countBuckets[i] = []
    }

    let max = 0;
    // find length of longest number by digits, by converting it to string and measuring its length, then comparing to all other numbers 
    for (let j = 0; j < arr.length; j++) {
        max = (arr[j].toString().length > max) ? arr[j].toString().length : max;
    }

    // cycle through array once for each digit in longest number from array 
    for (let l = 0; l < max; l++) {

        while (arr.length) {
            const stringNum = arr[0].toString()  // Convert front number in array to string
            const d = stringNum.length - l - 1 // Starting from rightmost digit on first iteration, then moving left on next iteration
            const digit = (stringNum[d]) ? stringNum[d] : 0 // Select either that digit, or (if too short) use 0
            countBuckets[digit].push(arr.shift()) // Remove number from array and place into bucket array corresponding to that digit
        }
        let counter = 0;
        for (let i = 0; i < 10; i++) { // Cycle through all 10 counter arrays, from lowest to highest
            while (countBuckets[i].length) {  // Cycle through counter array until empty
                const num = countBuckets[i].shift() // Save number in variable, so it can be added both to old array and to animation
                arr.push(num)
                animations.push([num, counter])
                counter++
            }
        }
    }
    return animations

}

export const pixelMapRadixSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("pixel-bar");
    const duration = 5;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {

        const element = chart[animation[1]];
        const color = animation[0];


        // Highlight two elements being compared in green, and pivot in red, and animate them being swapped
        barAnimations.push(
            element.animate([{ backgroundColor: `hsl(${color}, 100%, 50%)` }, { backgroundColor: `hsl(${color}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration })
        )
    })

    return barAnimations
}