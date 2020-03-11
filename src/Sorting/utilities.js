import PixelPainting from "./PixelPainting";
import ColorMap from "./ColorMap";

// ***Sort Functions***

// Bubble Sort



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

