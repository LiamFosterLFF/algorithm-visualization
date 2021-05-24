
const shuffle = () => {
    const bars = 100;
    const barList = [];
    for (let bar = 0; bar < bars; bar++) {
        const barHeight = Math.floor(Math.random() * 1000);
        barList.push(barHeight)
    }
    return barList;
}

 const defaultSort = () => {
    return []
}

 const defaultSortAnimation = () => {
    return []
}

// Bubble Sort
 const bubbleSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                animations.push([[j, arr[j+1]], [j + 1, arr[j]]])
            }
        }
        
    }
    return animations
}

 const bubbleSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("bar");
    const duration = 3;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        const bar1 = chart[animation[0][0]];
        const bar2 = chart[animation[1][0]];
        const ht1 = `${animation[0][1] / 10}%`
        const ht2 = `${animation[1][1] / 10}%`
        

        // Highlight the two elements to be swapped, and swap their heights
        // Default as paused so they don't start automatically every time
        const animation1 = bar1.animate([{backgroundColor: 'rgb(51, 226, 217)'}, {backgroundColor: 'red'}], {duration: duration, delay: index * duration});
        const animation2 = bar1.animate([{ height: ht2 }, { height: ht2 }], { fill: "forwards", duration: duration, delay: index * duration });
        const animation3 = bar2.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'red' }], { duration: duration, delay: index * duration });
        const animation4 = bar2.animate([{ height: ht1 }, { height: ht1 }], { fill: "forwards", duration: duration, delay: index * duration });

        // Save animations for reuse
        barAnimations.push(
            animation1, animation2, animation3, animation4
        )
    })

    return barAnimations
}

// Selection Sort 
 const selectionSort = (origArr) => {
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
            // Push the base Element, the element being checked, the current minimum, and an indication of whether a swap has occurred
            animations.push([[i, arr[i]], [j, arr[j]], [minIndex, arr[minIndex]], swap])
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return animations
}

 const selectionSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("bar");
    const duration = 3;// The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];
    
    animations.forEach((animation, index) => {
        const baseChild = chart[animation[0][0]];
        const checkingChild = chart[animation[1][0]];
        const minChild = chart[animation[2][0]];
        const baseHeight = `${animation[0][1] / 10}%`
        const minHeight = `${animation[2][1] / 10}%`
        const swap = animation[3];

        // Highlight the base of the section being checked, and the current element being compared against the minimum, in bubbleSort, while the min is highlighted in red
        barAnimations.push(
            baseChild.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'blue' }], { duration: duration, delay: index * duration }),
            checkingChild.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'blue' }], { duration: duration, delay: index * duration }),
            minChild.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'red' }], { duration: duration, delay: index * duration }),
        )
        // if the two elements are to be swapped, perform the swap 
        if (swap === true) {
            barAnimations.push(
                minChild.animate([{ height: baseHeight }, { height: baseHeight }], { fill: "forwards", duration: duration, delay: index * duration }),
                baseChild.animate([{ height: minHeight }, { height: minHeight }], { fill: "forwards", duration: duration, delay: index * duration })
            )
        }
    })

    return barAnimations
}

// Insertion Sort 
 const insertionSort = (origArr) => {
    // Clone the original array so as not to mutate it
    const arr = [...origArr]
    // Store the indices of the swaps made in order, to be used in the animations
    const animations = []
    const n = arr.length;


    // Move up through the array one at a time, and insert each new element into already sorted numbers to the left in its proper (ascending) position 
    for (let i = 1; i < n; i++) {
        const key = arr[i]
        let j = i - 1;
        while (j >= 0 && arr[j] > arr[j+1]) {
            animations.push([[j, arr[j]], [j+1, arr[j+1]]]);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            j = j - 1
        }
    }
    
    return animations
}

 const insertionSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("bar");
    const duration = 3;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        const swapElLt = chart[animation[0][0]];
        const swapElLtHt = `${animation[0][1] / 10}%`;
        const swapElRt = chart[animation[1][0]];
        const swapElRtHt = `${animation[1][1] / 10}%`;
        
        // Highlight two elements being compared in green, and animate them being swapped
        barAnimations.push(
            swapElRt.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'green' }], { duration: duration, delay: index * duration }),
            swapElRt.animate([{ height: swapElLtHt }, { height: swapElLtHt }], { fill: "forwards", duration: duration, delay: index * duration }),
            swapElLt.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'green' }], { duration: duration, delay: index * duration }),
            swapElLt.animate([{ height: swapElRtHt }, { height: swapElRtHt }], { fill: "forwards", duration: duration, delay: index * duration })
        )
    })
    
    return barAnimations
}

// Merge Sort 
 const mergeSort = (origArray) => {
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

 const mergeSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("bar");
    const duration = 30;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        const compareEl1 = chart[animation.comparison[0]];
        const compareEl2 = chart[animation.comparison[1]];
        const swapEl = chart[animation.swap[0]];
        const swapHt = `${animation.swap[1] / 10}%`;

        // Highlight two elements being compared in green, and animate them being swapped
        barAnimations.push(
            compareEl1.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'green' }], { duration: duration, delay: index * duration }),
            compareEl2.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'green' }], { duration: duration, delay: index * duration }),
            swapEl.animate([{ height: swapHt }, { height: swapHt }], { fill: "forwards", duration: duration, delay: index * duration })
        )
    })

    return barAnimations
}

// Quick Sort 
 const quickSort = (origArray) => {
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

 const quickSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("bar");
    const duration = 30;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {
        
        const leftEl = chart[animation[0][0]];
        const rightEl = chart[animation[1][0]];
        const pivot = chart[animation[2][0]];
        const leftHt = `${animation[0][1] / 10}%`;
        const rightHt = `${animation[1][1] / 10}%`;


        // Highlight two elements being compared in green, and pivot in red, and animate them being swapped
        barAnimations.push(
            leftEl.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'green' }], { duration: duration, delay: index * duration }),
            leftEl.animate([{ height: leftHt }, { height: rightHt }], { fill: "forwards", duration: duration, delay: index * duration }),
            rightEl.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'green' }], { duration: duration, delay: index * duration }),
            rightEl.animate([{ height: rightHt }, { height: leftHt }], { fill: "forwards", duration: duration, delay: index * duration }),
            pivot.animate([{ backgroundColor: 'rgb(51, 226, 217)' }, { backgroundColor: 'red' }], { duration: duration, delay: index * duration })
        )
    })

    return barAnimations
}

// Radix Bar Sort 
 const radixSort = (origArr) => {
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

 const radixSortAnimation = (animations) => {
    // Sets the animations using the Web Animations API
    const chart = document.getElementsByClassName("bar");
    const duration = 30;   // The base duration, for easy changing later (duration can also be changed via the API)
    const barAnimations = [];

    animations.forEach((animation, index) => {

        const element = chart[animation[1]];
        const height = `${animation[0] / 10}%`;


        // Highlight two elements being compared in green, and pivot in red, and animate them being swapped
        barAnimations.push(
            element.animate([{ backgroundColor: 'red' }, { backgroundColor: 'red' }], { duration: duration, delay: index * duration }),
            element.animate([{ height: height }, { height: height }], { fill: "forwards", duration: duration, delay: index * duration })
        )
    })

    return barAnimations
}

const barChartFunctions = {
    shuffle,
    defaultSort,
    defaultSortAnimation,
    bubbleSort, 
    bubbleSortAnimation, 
    selectionSort,
    selectionSortAnimation,
    insertionSort,
    insertionSortAnimation,
    mergeSort,
    mergeSortAnimation,
    quickSort,
    quickSortAnimation,
    radixSort,
    radixSortAnimation,
}

export default barChartFunctions;
// // Color Map Animations

// // Bubble Sort Color Map Animation
// export const colorMapBubbleSortAnimation = (animations) => {
//     // Sets the animations using the Web Animations API
//     const chart = document.getElementsByClassName("color-bar");
//     const duration = .5;   // The base duration, for easy changing later (duration can also be changed via the API)
//     const barAnimations = [];
//     animations.forEach((animation, index) => {
//         const compareEl1 = chart[animation[0][0]];
//         const compareEl2 = chart[animation[1][0]];
//         const swapColor1 = animation[0][1];
//         const swapColor2 = animation[1][1];


//         // Exchange the colors of the two elements being selected
//         barAnimations.push(
//             compareEl1.animate([{ backgroundColor: `hsl(${swapColor2}, 100%, 50%)` }, { backgroundColor: `hsl(${swapColor2}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration }),
//             compareEl2.animate([{ backgroundColor: `hsl(${swapColor1}, 100%, 50%)` }, { backgroundColor: `hsl(${swapColor1}, 100%, 50%)` }], { fill: "forwards", duration: duration, delay: index * duration }),

//         )

//     })
//     return barAnimations
// }


// // PixelMap Animations 

// // Pixel Map Bubble Sort
// export const pixelMapBubbleSort = (origArr) => {
//     // Clone the original array so as not to mutate it
//     const arr = [...origArr]
//     // Store the indices of the swaps made in order, to be used in the animations
//     const animations = []
//     const n = arr.length;
//     for (let i = 0; i < n; i++) {
//         for (let j = 0; j < n - i - 1; j++) {
//             if (arr[j][0] > arr[j + 1][0]) {
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//                 animations.push([j, j + 1])
//             }
//         }
//     }
//     return animations
// }

// // Bubble Sort Pixel Map Animation
// export const bubbleSortPixelMapAnimation = (animations, speed) => {
//     for (let i = 0; i < animations.length; i++) {
//         const [ind1, ind2] = animations[i]
//         setTimeout(() => {
//             const parent = document.getElementsByClassName('chart');
//             const child1 = parent[0].childNodes[ind1];
//             const child2 = parent[0].childNodes[ind2];

//             // child1.style.backgroundColor = "red";
//             // child2.style.backgroundColor = "red";
//             for (let i = 0; i <= 2; i++) {
//                 [child1.childNodes[i].style.height, child2.childNodes[i].style.height] = [child2.childNodes[i].style.height, child1.childNodes[i].style.height]

//             }
//             setTimeout(() => {
//                 // child1.style.backgroundColor = "rgb(51, 226, 217)";
//                 // child2.style.backgroundColor = "rgb(51, 226, 217)";
//             }, speed);
//         }, i * speed);
//     }
// }





// // ***Display Functions***

// // BarChart
// export const barShuffle = (bars) => {
//     const barList = [];
//     for (let bar = 0; bar < bars; bar++) {
//         const barHeight = Math.floor(Math.random() * 1000);
//         barList.push(barHeight)
//     }
//     return barList;
// }


// // ColorMap





// // PixelMap
// const shuffle = (array) => {

//     for (let i = array.length - 1; i > 0; i--) {
//         let j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array
// };


// export const pixelBarShuffle = () => {
//     const pixelBarList = [];
//     const height = 200;
//     for (let pixBar = 0; pixBar < height; pixBar++) {
//         const pixelBarHeights = [height - pixBar - 1, 1, pixBar]
//         pixelBarList.push(pixelBarHeights)
//     }
//     return shuffle(pixelBarList)
// }


// // PixelPainting








