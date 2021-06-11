export const calculateCanvasSize = (windowDims, cellSize) => {
    const normalizeDimension = (dimension, cellSize) => {
        const noOfCells = Math.floor(dimension / cellSize);
        // Cells have to be odd, as maze has a path every other cell
        const oddNoOfCells = (noOfCells %2 === 0) ? noOfCells + 1 : noOfCells;
        const normalizedDim = oddNoOfCells * cellSize;
        return normalizedDim;
    }

    // Canvas dims are .8vw, .7vh
    const canvasViewportDims = {width: .8, height: .7}
    const canvasDims = {
        width: normalizeDimension(windowDims.width * canvasViewportDims.width, cellSize), 
        height: normalizeDimension(windowDims.height * canvasViewportDims.height, cellSize)
    }
    return canvasDims;
}

export const getFullCanvas = (canvasDimensions, cellSize) => {
    // Construct Grid of Cells
    const [cols, rows] = [canvasDimensions.width / cellSize, canvasDimensions.height / cellSize]
    const fillGrid = [];
    // Builds a rows*cols nested array full of walls
    for (let row = 0; row < rows; row++) {
        fillGrid.push([])
        for (let col = 0; col < cols; col++) {
            fillGrid[row].push("wall")
        }
    }
    return fillGrid
}

export const getClearCanvas = (canvasDimensions, cellSize) => {
    // Construct Grid of Cells
    const [cols, rows] = [canvasDimensions.width / cellSize, canvasDimensions.height / cellSize]
    const fillGrid = [];
    // Builds a rows*cols nested array full of walls
    for (let row = 0; row < rows; row++) {
        fillGrid.push([])
        for (let col = 0; col < cols; col++) {
            fillGrid[row].push("path")
        }
    }
    return fillGrid
}

// Generate initial maze
export const generateMaze = (grid, algorithm) => {

    // Number of total columns and total rows
    let mazeGrid = JSON.parse(JSON.stringify(grid)); // Deep copy grid so as not to mutate

    // Animate drawing the entrance and exit
    const [entrance, exit, start] = [[0, 1], [mazeGrid.length - 1, mazeGrid[0].length - 2], [1, 1]]
    let mazeAnimations = [entrance, exit];

    // Add entrance and exit to state, and to grid
    mazeGrid[entrance[0]][entrance[1]] = "path";
    mazeGrid[exit[0]][exit[1]] = "path";

    // Calls with start as current and previous node; this is to allow for previous node to be used in recursive call
    let mazeFinished;
    let mazeAlgorithm;
    switch (algorithm) {
        case "Eller's Algorithm":
            mazeAlgorithm = ellersMazeAlgorithm
            break;
        case "Recursive Backtracking":
            mazeAlgorithm = depthFirstMazeAlgorithm
            break;
        case "default" :
            mazeAlgorithm = defaultMazeAlgorithm;
            break;
        default:
            break;
    }

    [mazeGrid, mazeAnimations, mazeFinished] = mazeAlgorithm(start, start, mazeGrid, mazeAnimations)
    mazeAnimations = mazeAnimations.map((animation) => {
        return {location: animation, type: "path"}
    })
    // Add a set number of loops to the maze
    // const loops = 200;
    // [mazeGrid, mazeAnimations] = loopMaker(mazeGrid, mazeAnimations, loops);

    let [nodeAnimations, ] = nodeFinder(mazeGrid, entrance, exit)
    nodeAnimations = nodeAnimations.map((animation) => {
        return {location: animation, type: "node"}
    })
    const animations = { mazeAnimations, nodeAnimations }

    return [mazeGrid, animations, mazeFinished]
}

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
};

const defaultMazeAlgorithm = (startNode, prevNode, origMazeGrid, animations) => {
    return [origMazeGrid, animations, true]
}

const ellersMazeAlgorithm = (startNode, prevNode, origMazeGrid, animations) => {
    const mazeGrid = JSON.parse(JSON.stringify(origMazeGrid)) // Deep copy so as not to mutate original array

    let setNoCounter = 1; // To keep track of set names, so there's no repeats
    for (let i = 1; i < mazeGrid[1].length - 1; i += 2) {
        mazeGrid[1][i] = setNoCounter; // Initialize the cells of the first row to each exist in their own set.
        animations.push([1,i])
        setNoCounter++;
    }

    for (let j = 1; j < mazeGrid.length - 2; j += 2) {  // Repeat until the last row is reached
        
        for (let i = 1; i < mazeGrid[j].length - 1; i += 2) {// Randomly join adjacent cells, but only if they are not in the same set.
            if (mazeGrid[j][i+2] !== undefined && mazeGrid[j][i] !== mazeGrid[j][i + 2]) {
                if (Math.random() < .5) { // Some of the cells joined together, so left side and right of wall must match
                    mazeGrid[j][i + 1] = mazeGrid[j][i];
                    mazeGrid[j][i + 2] = mazeGrid[j][i];
                    animations.push([j, i+1])
                }
            }
        }
        
        let placeHolder = 1;
        while (placeHolder < mazeGrid[j].length ) {// For each set, randomly create vertical connections downward to the next row
            
            const setNo = mazeGrid[j][placeHolder] // Number stored in grid for current set
            let setCounter = 1;
            while (mazeGrid[j][placeHolder + setCounter * 2] === setNo) { // Counts how many in a row have the same setNo
                setCounter += 1
            }
            
            // For each set, randomly create a random number (1+) of vertical connections downward to the next row.
            const extensionNo = 1 + Math.floor(Math.random() * setCounter) * .5;
            let extensionCounter = 0;
            while (extensionCounter < extensionNo) {  // Keeps cycling until correct number of columns are created
                const extensionColumn = Math.floor(Math.random() * setCounter) * 2;
                if (mazeGrid[j + 1][placeHolder + extensionColumn] === "wall") {
                    mazeGrid[j + 1][placeHolder + extensionColumn] = setNo;
                    animations.push([j + 1, placeHolder + extensionColumn]);
                    mazeGrid[j + 2][placeHolder + extensionColumn] = setNo;
                    animations.push([j + 2, placeHolder + extensionColumn]);
                    extensionCounter ++
                }
            } // Consecutive columns are linked together in next section

            

            placeHolder += setCounter*2; // Moves to the next set
        }
        
        for (let l = 1; l < mazeGrid[j].length - 1; l += 2) { 
            if (mazeGrid[j + 2][l] === "wall") {// Flesh out the next row by putting any remaining cells into their own sets.
                mazeGrid[j + 2][l] = setNoCounter;
                animations.push([j + 2, l])
                setNoCounter++
            } 
        }
    }
    for (let i = 1; i < mazeGrid[0].length - 2; i+=2) { //For the last row, join all adjacent cells that do not share a set
        if (mazeGrid[mazeGrid.length - 2][i] !== mazeGrid[mazeGrid.length - 2][i + 2]) {
            mazeGrid[mazeGrid.length - 2][i + 1] = mazeGrid[mazeGrid.length - 2][i];
            animations.push([mazeGrid.length - 2, i + 1]);
            mazeGrid[mazeGrid.length - 2][i + 2] = mazeGrid[mazeGrid.length - 2][i];
            animations.push([mazeGrid.length - 2, i + 2]);
        }
    }

    const pathMazeGrid = []
    for (let i = 0; i < mazeGrid.length; i++) {
        const row = [];
        for (let j = 0; j < mazeGrid[i].length; j++) {
            if (mazeGrid[i][j] !== "wall") {
                row.push("path")
            } else {
                row.push("wall")
            }
        }
        pathMazeGrid.push(row)
    }
    

    
    return [pathMazeGrid, animations, true]
    
}

const depthFirstMazeAlgorithm = (startNode, prevNode, mazeGrid, animations) => {
    // Draws maze using recursive depth-first algorithm
    const node = startNode;

    const [row, col] = node;

    mazeGrid[row][col] = "path";
    const [prevRow, prevCol] = prevNode
    mazeGrid[prevRow][prevCol] = "path";
    let deadEnd = false;

    let newAnimations = [...animations, prevNode, node] // Add current node to path animation
    const directionArray = shuffle([...Array(4).keys()]); // Create a random array of directions to choose from
    for (let i = 0; i < 4; i++) {  // Choose the next direction to go in, or return dead end
        const direction = directionArray[i]
        switch (direction) {
            case 0: // Up: if potential path column above is not edge or filled
                if (((row - 2) >= 0) && (mazeGrid[row - 2][col] === "wall")) {
                    const [midNode, newNode] = [[row - 1, col], [row - 2, col]];
                    [mazeGrid, newAnimations, deadEnd] = depthFirstMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            case 1: // Right: if two squares to the right is not over edge or filled
                if (((col + 2) < mazeGrid[row].length) && (mazeGrid[row][col + 2] === "wall")) {
                    const [midNode, newNode] = [[row, col + 1], [row, col + 2]];
                    [mazeGrid, newAnimations, deadEnd] = depthFirstMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            case 2: // Down: if potential path column below is not edge or filled

                if (((row + 2) < mazeGrid.length) && (mazeGrid[row + 2][col] === "wall")) {
                    const [midNode, newNode] = [[row + 1, col], [row + 2, col]];
                    [mazeGrid, newAnimations, deadEnd] = depthFirstMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            case 3: // Left: if two squares to the left is not over edge or filled
                if (((col - 2) >= 0) && (mazeGrid[row][col - 2] === "wall")) {
                    const [midNode, newNode] = [[row, col - 1], [row, col - 2]];
                    [mazeGrid, newAnimations, deadEnd] = depthFirstMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            default:
                break;
        }
    }
    deadEnd = true
    return [mazeGrid, newAnimations, deadEnd]
}

// const loopMaker = (mazeGrid, mazeAnimations, loopsRequired) => {
//     let loopsMade = 0;
//     while (loopsMade < loopsRequired) {
//         // Not selecting the bottom 20 % of the maze makes loops more likely to form
//         // Only selects numbers between 1 and 80% of mazeGrid length
//         const randRow = Math.floor(Math.random() * (mazeGrid.length * .8 - 1)) + 1
//         // Select any column except for first and last
//         const randCol = Math.floor(Math.random() * (mazeGrid[0].length - 2)) + 1
//         if ( // Forms loops better by only choosing walls sandwiched between two other walls, but not 3 ways corners
//             mazeGrid[randRow][randCol] === "wall"
//             && (
//                 (mazeGrid[randRow + 1][randCol] === "wall" && mazeGrid[randRow - 1][randCol] === "wall" && mazeGrid[randRow][randCol + 1] !== "wall" && mazeGrid[randRow][randCol - 1] !== "wall") ||
//                 (mazeGrid[randRow][randCol + 1] === "wall" && mazeGrid[randRow][randCol - 1] === "wall" && mazeGrid[randRow + 1][randCol] !== "wall" && mazeGrid[randRow - 1][randCol] !== "wall")
//             )
//         ) {
//             mazeGrid[randRow][randCol] = "path"
//             mazeAnimations.push([randRow, randCol])
//             loopsMade++
//         }
//     }

//     return [mazeGrid, mazeAnimations]
// }

export const nodeFinder = (mazeGrid, entrance, exit) => { // Finds nodes, points at which the maze either turns or forks, for use in building graphs
    const nodeAnimations = [];
    const nodeList = []; // List of nodes with the location and directions of nearest nodes

    // Add the start of the maze to the animations
    nodeAnimations.push(entrance)

    nodeList.push([...entrance, [2]])

    for (let row = 1; row < mazeGrid.length - 1; row++) { // Cycles through rows and columns, searching for nodes in each odd row/col
        for (let col = 1; col < mazeGrid[0].length - 1; col++) {
            const directions = [];
            for (let direction = 0; direction < 4; direction++) {

                switch (direction) {
                    case 0:
                        if (mazeGrid[row][col] === "path" && mazeGrid[row - 1][col] === "path") { // Up: if potential path column above is path
                            directions.push(direction)
                        }
                        break;
                    case 1:
                        if (mazeGrid[row][col] === "path" && mazeGrid[row][col + 1] === "path") { // Right: if potential path column right is path
                            directions.push(direction)
                        }
                        break;
                    case 2:
                        if (mazeGrid[row][col] === "path" && mazeGrid[row + 1][col] === "path") { // Down: if potential path column down is path
                            directions.push(direction)
                        }
                        break;
                    case 3:
                        if (mazeGrid[row][col] === "path" && mazeGrid[row][col - 1] === "path") { // Left: if potential path column above is path
                            directions.push(direction)
                        }
                        break;
                    default:
                        break;
                }
            }
            if (directions.length === 1) { // If dead end, corner, or intersection
                nodeAnimations.push([row, col])
                nodeList.push([row, col, directions])
            } else if (directions.length === 2 && (directions[0] - directions[1]) % 2 !== 0) {
                nodeAnimations.push([row, col])
                nodeList.push([row, col, directions])
            } else if (directions.length === 3 || directions.length === 4) {
                nodeAnimations.push([row, col])
                nodeList.push([row, col, directions])
            }

        }
    }
    // Add the end of the maze to the animations
    nodeAnimations.push(exit)
    nodeList.push([...exit, [0]])

    const nodeMazeGrid = JSON.parse(JSON.stringify(mazeGrid))    // Deep copy the maze grid
    nodeList.forEach(node => nodeMazeGrid[node[0]][node[1]] = "node")

    const nodeWeights = weightFinder(nodeMazeGrid, nodeList)

    return [nodeAnimations, nodeWeights]
}

const weightFinder = (nodeMazeGrid, nodeList) => {
    const nodeWeights = {};
    nodeList.forEach(node => {
        const [row, col] = [node[0], node[1]];
        const nodeDirections = []
        const directions = node[2]
        directions.forEach(direction => {
            let i = 1;


            switch (direction) {
                case 0: // Up
                    while (row - i >= 0 && nodeMazeGrid[row - i][col] !== "node") {
                        i++
                    }
                    nodeDirections.push([direction, i])
                    break;
                case 1: // Right
                    while (col + i < nodeMazeGrid[row].length && nodeMazeGrid[row][col + i] !== "node") {
                        i++
                    }
                    nodeDirections.push([direction, i])
                    break;
                case 2: // Down
                    while (row + i < nodeMazeGrid.length && nodeMazeGrid[row + i][col] !== "node") {
                        i++
                    }
                    nodeDirections.push([direction, i])
                    break;
                case 3: // Left
                    while (col - i >= 0 && nodeMazeGrid[row][col - i] !== "node") {
                        i++
                    }
                    nodeDirections.push([direction, i])
                    break;
                default:
                    break;
            }
        })
        nodeWeights[`${row},${col}`] = nodeDirections
    })
    return nodeWeights;
}
