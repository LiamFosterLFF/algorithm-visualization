// Draw initial Grid
export const initializeGrid = (canvas, cellSize, canvasDimensions) => {

    const ctx = canvas.current.getContext('2d');
    const [width, height] = [canvasDimensions.width, canvasDimensions.height]

    // Initialize Background
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // Initialize Grid as Clear
    const initialGrid = clearCanvas(canvas, cellSize)

    // Find x and y coordinates of canvas
    const [xCoordinate, yCoordinate] = [canvas.current.getBoundingClientRect().x, canvas.current.getBoundingClientRect().y]

    return [initialGrid, xCoordinate, yCoordinate]



}

export const clearCanvas = (canvas, cellSize) => {
    const ctx = canvas.current.getContext('2d');
    const [width, height] = [ctx.canvas.width, ctx.canvas.height]

    // Clear Background
    ctx.clearRect(0, 0, width, height);

    // Construct Grid of Cells
    const [rows, cols] = [width / cellSize, height / cellSize]
    const clearGrid = [];
    // Builds a rows*cols nested array full of walls
    for (let row = 0; row<rows; row++) {
        clearGrid.push([])
        for (let col = 0; col < cols; col++) {
            clearGrid[row].push("path")
        }
    }
    return clearGrid
}

export const fillCanvas = (canvas, cellSize) => {
    const ctx = canvas.current.getContext('2d');
    const [width, height] = [ctx.canvas.width, ctx.canvas.height]

    // Fill Background
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, width, height);

    // Construct Grid of Cells
    const [rows, cols] = [width / cellSize, height / cellSize]
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

// Generate initial maze
export const generateMaze = (grid) => {

        // Number of total columns and total rows

        let mazeGrid = JSON.parse(JSON.stringify(grid)); // Deep copy grid so as not to mutate
        const [rows, cols] = [mazeGrid.length, mazeGrid[0].length]

        // Animate drawing the entrance and exit
        const [entrance, exit, start] = [[0, 1], [mazeGrid.length - 1, mazeGrid[0].length - 2], [1, 1]]
        let drawingAnimations = [entrance, exit];

        // Add entrance and exit to state, and to grid
        mazeGrid[entrance[0]][entrance[1]] = "path";
        mazeGrid[exit[0]][exit[1]] = "path";

        // Calls with start as current and previous node; this is to allow for previous node to be used in recursive call
        let mazeFinished;
        [mazeGrid, drawingAnimations, mazeFinished] = recursiveMazeAlgorithm(start, start, mazeGrid, drawingAnimations)
        // Add a set number of loops to the maze
        const loops = 200;
        [mazeGrid, drawingAnimations] = loopMaker(mazeGrid, drawingAnimations, loops);
        console.log(mazeGrid)
        const [nodeAnimations, trash] = nodeFinder(mazeGrid, entrance, exit)

        const mazeAnimations = { drawingAnimations: drawingAnimations, nodeAnimations: nodeAnimations }

        return [mazeGrid, mazeAnimations, mazeFinished]
}


const recursiveMazeAlgorithm = (startNode, prevNode, mazeGrid, animations) => {
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
                    [mazeGrid, newAnimations, deadEnd] = recursiveMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            case 1: // Right: if two squares to the right is not over edge or filled
                if (((col + 2) < mazeGrid[row].length) && (mazeGrid[row][col + 2] === "wall")) {
                    const [midNode, newNode] = [[row, col + 1], [row, col + 2]];
                    [mazeGrid, newAnimations, deadEnd] = recursiveMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            case 2: // Down: if potential path column below is not edge or filled

                if (((row + 2) < mazeGrid.length) && (mazeGrid[row + 2][col] === "wall")) {
                    const [midNode, newNode] = [[row + 1, col], [row + 2, col]];
                    [mazeGrid, newAnimations, deadEnd] = recursiveMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
            case 3: // Left: if two squares to the left is not over edge or filled
                if (((col - 2) >= 0) && (mazeGrid[row][col - 2] === "wall")) {
                    const [midNode, newNode] = [[row, col - 1], [row, col - 2]];
                    [mazeGrid, newAnimations, deadEnd] = recursiveMazeAlgorithm(newNode, midNode, mazeGrid, newAnimations)
                }
                break;
        }
    }
    deadEnd = true
    return [mazeGrid, newAnimations, deadEnd]
}

const loopMaker = (mazeGrid, mazeAnimations, loopsRequired) => {
    let loopsMade = 0;
    while (loopsMade < loopsRequired) {
        // Not selecting the bottom 20 % of the maze makes loops more likely to form
        // Only selects numbers between 1 and 80% of mazeGrid length
        const randRow = Math.floor(Math.random() * (mazeGrid.length * .8 - 1)) + 1
        // Select any column except for first and last
        const randCol =  Math.floor(Math.random() * (mazeGrid[0].length - 2)) + 1
        if ( // Forms loops better by only choosing walls sandwiched between two other walls, but not 3 ways corners
            mazeGrid[randRow][randCol] === "wall" 
            && (
                (mazeGrid[randRow + 1][randCol] === "wall" && mazeGrid[randRow - 1][randCol] === "wall" && mazeGrid[randRow][randCol + 1] !== "wall" && mazeGrid[randRow][randCol - 1] !== "wall") ||
                (mazeGrid[randRow][randCol + 1] === "wall" && mazeGrid[randRow][randCol - 1] === "wall" && mazeGrid[randRow + 1][randCol] !== "wall" && mazeGrid[randRow - 1][randCol] !== "wall" )
                )
        ) {
            mazeGrid[randRow][randCol] = "path"
            mazeAnimations.push([randRow, randCol])
            loopsMade++
        }
    }

    return [mazeGrid, mazeAnimations]
} 

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
            }
        })
        nodeWeights[`${row},${col}`] = nodeDirections
    })
    return nodeWeights;
}


const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
};


// Maze-solving algorithms:

export const solveMaze = (grid, defaults, algorithm) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy of grid
    const animations = {solvingAnimations: [], backtrackingAnimations: []};

    let solvingAlgorithm = aStarSolvingAlgorithm
    switch (algorithm) {
        case "depthFirst":
            solvingAlgorithm = depthFirstSearchSolvingAlgorithm;
            break;
        case "breadthFirst":
            solvingAlgorithm = breadthFirstSearchSolvingAlgorithm
            break;
        case "dijkstras":
            solvingAlgorithm = dijkstrasSolvingAlgorithm
            break;
        case "aStar":
            solvingAlgorithm = aStarSolvingAlgorithm
            break;
    }

    solvingAlgorithm(defaults.start, defaults.enter, defaults.exit, newGrid, animations)
    return animations
}

const depthFirstSearchSolvingAlgorithm = (startNode, prevNode, endNode, newGrid, animations) => {
    const node = startNode;

    if ((node[0] === endNode[0]) && (node[1] === endNode[1])) {
        animations.backtrackingAnimations.push(node)
        animations.backtrackingAnimations.push(prevNode)
        return true
    }

    let mazeEndFound = false;
    const [row, col] = node;
    newGrid[row][col] = "checked";
    animations.solvingAnimations.push(node)

    const directionArray = shuffle([...Array(4).keys()]);
    for (let i = 0; i < 4; i++) {

        const direction = directionArray[i]

        switch (direction) {

            case 0: // Up: checks if 2 squares up is not over edge and there is a path toward that direction
                if ((row - 1 >= 0) && (newGrid[row - 1][col] === "path")) {
                    const newNode = [row - 1, col];
                    animations.solvingAnimations.push(newNode)
                    mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid, animations);

                }
                break;
            case 1: // Right: checks if 2 squares right is not over edge and there is a path toward that direction
                if ((col + 1 < newGrid[row].length) && (newGrid[row][col + 1] === "path")) {
                    const newNode = [row, col + 1];
                    animations.solvingAnimations.push(newNode)
                    mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid, animations);
                }
                break;
            case 2: // Down: checks if 2 squares down is not over edge and there is a path toward that direction
                if ((row + 1 < newGrid.length) && (newGrid[row + 1][col] === "path")) {
                    const newNode = [row + 1, col];
                    animations.solvingAnimations.push(newNode)
                    mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid, animations);
                }
                break;
            case 3: // Left: checks if 2 squares left is not over edge and there is a path toward that direction
                if ((col - 1 >= 0) && (newGrid[row][col - 1] === "path")) {
                    const newNode = [row, col - 1];
                    animations.solvingAnimations.push(newNode)
                    mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid, animations);
                }
                break;

        }
        if (mazeEndFound) {
            animations.backtrackingAnimations.push(prevNode)
            return mazeEndFound
        }

    }
    return mazeEndFound

}

const breadthFirstSearchSolvingAlgorithm = (startNode, prevNode, endNode, newGrid, animations) => {

    const frontierQueue = [];
    const backtrackDictionary = {};
    frontierQueue.push(prevNode);
    let checking = true;

    
    const breadthFirstRecursion = (frontierQueue, endNode, newGrid, animations, backtrackDictionary) => {
        const node = frontierQueue.shift();
        
        if (node[0] === endNode[0] && node[1] === endNode[1]) return false

        animations.solvingAnimations.push(node);

        const [row, col] = [node[0], node[1]];
        newGrid[row][col] = "checked";

        for (let i = 0; i < 4; i++) {
            const direction = i;

            switch (direction) {

                case 0: // Up: checks if 2 squares up is not over edge and there is a path toward that direction
                    if ((row - 1 >= 0) && (newGrid[row - 1][col] === "path")) {
                        const newNode = [row - 1, col];
                        frontierQueue.push(newNode);
                        backtrackDictionary[newNode] = node;
                    }
                    break;

                case 1: // Right: checks if 2 squares right is not over edge and there is a path toward that direction
                    if ((col + 1 < newGrid[row].length) && (newGrid[row][col + 1] === "path")) {
                        const newNode = [row, col + 1];
                        frontierQueue.push(newNode);
                        backtrackDictionary[newNode] = node;
                    }
                    break;

                case 2: // Down: checks if 2 squares down is not over edge and there is a path toward that direction
                    if ((row + 1 < newGrid.length) && (newGrid[row + 1][col] === "path")) {
                        const newNode = [row + 1, col];
                        frontierQueue.push(newNode);
                        backtrackDictionary[newNode] = node;
                    }
                    break;

                case 3: // Left: checks if 2 squares left is not over edge and there is a path toward that direction
                    if ((col - 1 >= 0) && (newGrid[row][col - 1] === "path")) {
                        const newNode = [row, col - 1];
                        frontierQueue.push(newNode);
                        backtrackDictionary[newNode] = node;
                    }
                    break;

            }
        }
        return (frontierQueue.length > 0)
    }

    while (checking) {
        checking = breadthFirstRecursion(frontierQueue, endNode, newGrid, animations, backtrackDictionary);
    }
    
    let btNode = endNode;
    animations.backtrackingAnimations.push(btNode);
    while (!((btNode[0] === startNode[0]) && (btNode[1] === startNode[1]))) {
        const dictionaryString = `${btNode[0]},${btNode[1]}`;
        btNode = backtrackDictionary[dictionaryString]
        animations.backtrackingAnimations.push(btNode);        
    }
    
}


const dijkstrasSolvingAlgorithm = (startNode, enterNode, exitNode, mazeGrid, animations, heuristic=false) => {
    const lowestUnvisitedNode = (distances, visitedNodes) => {
        let min = [null, Infinity];
        Object.entries(distances).forEach((distance) => {
            const currentDistanceStr = distance[0];
            if (!visitedNodes[currentDistanceStr] && distances[currentDistanceStr] < min[1]) {
                min = [currentDistanceStr, distance[1]];
            }
        })

        return (min[0] === null) ? null: min[0].split(",");
    }
    
    // Initialize distances dictionary for start and end nodes
    const distances = {};
    distances[`${enterNode[0]},${enterNode[1]}`] = 0;
    distances[`${exitNode[0]},${exitNode[1]}`] = Infinity;

    // Initialize parent nodes dictionary
    const parentNodes = {};
    parentNodes[`${exitNode[0]},${exitNode[1]}`] = null;

    // Initialize arrays for visited and unvisited nodes
    const visitedNodes = {};
    const [trash, unvisitedNodes] = nodeFinder(mazeGrid, enterNode, exitNode);

    let currentNode = enterNode;
    animations.solvingAnimations.push([enterNode])
    while (currentNode !== null && (currentNode[0] !== exitNode[0] && currentNode[1] !== exitNode[1])) {
        
        const [row, col] = [Number(currentNode[0]), Number(currentNode[1])];
        animations.solvingAnimations.push([row, col])
        const currentNodeStr = `${row},${col}`
        const currentDistance = distances[currentNodeStr];
        const edges = unvisitedNodes[currentNodeStr]
        edges.forEach((edge) => {
            const [direction, edgeDistance] = [edge[0], edge[1]]
            let childNode, childNodeStr, totalWeight;
            let hWeight = 0;
            const distanceFromStart = currentDistance + edgeDistance
            
            switch (direction) {
                case 0: //Up
                    childNode = [row - edgeDistance, col];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0
                    totalWeight = distanceFromStart + hWeight
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr
                    }
                    break;
                case 1: //Right
                    childNode = [row, col + edgeDistance];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0;
                    totalWeight = distanceFromStart + hWeight;
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr
                    }
                    break;
                case 2: //Down
                    childNode = [row + edgeDistance, col];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0;
                    totalWeight = distanceFromStart + hWeight;
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr
                    }
                    break;
                case 3: //Left
                    childNode = [row, col - edgeDistance];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0;
                    totalWeight = distanceFromStart + hWeight;
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr
                    }
                    break;
                default:
                    break;
            }
        })
        
        visitedNodes[currentNodeStr] = edges;
        delete unvisitedNodes[currentNodeStr];
        currentNode = lowestUnvisitedNode(distances, visitedNodes)
    }
        
    if (currentNode === null || (currentNode[0] === exitNode[0] && currentNode[1] === exitNode[1])) {
        let backtrackNode = exitNode;
        animations.backtrackingAnimations.push(backtrackNode)
    
        while (backtrackNode[0] !== enterNode[0] && backtrackNode[1] !== enterNode[1]) {
            console.log(`${backtrackNode[0]},${backtrackNode[1]}`);
            console.log(parentNodes)
            const newNodeStrArray = parentNodes[`${backtrackNode[0]},${backtrackNode[1]}`].split(",")
            backtrackNode = [Number(newNodeStrArray[0]), newNodeStrArray[1]]
            animations.backtrackingAnimations.push(backtrackNode)
    
        }
    }
    
    
}

const aStarSolvingAlgorithm = (startNode, enterNode, exitNode, mazeGrid, animations) => {
    dijkstrasSolvingAlgorithm(startNode, enterNode, exitNode, mazeGrid, animations, true)
}

// Animations

export const animateMazeDrawing = (mazeAnimations, canvas, cellSize, drawSpeed) => {
    const ctx = canvas.current.getContext('2d');
    
    if (mazeAnimations.drawingAnimations.length !== 0) {
        mazeAnimations.drawingAnimations.forEach((animation, index) => {
            setTimeout(() => {
                const [row, col] = animation;
                ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }, drawSpeed * index);
        })
    }

    // if (mazeAnimations.nodeAnimations.length !== 0) {
    //     mazeAnimations.nodeAnimations.forEach((animation, index) => {
    //         setTimeout(() => {
    //             const [row, col] = animation;
    //             ctx.fillStyle = "#ff0000"
    //             ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    //         }, drawSpeed * mazeAnimations.drawingAnimations.length + drawSpeed * index); // Set a delay based on the time to finish the drawing animation, before drawing the nodes
    //     })
    // }
}

export const animateMazeSolving = (solvingAnimations, canvas, cellSize, drawSpeed) => {
    const ctx = canvas.current.getContext('2d');

    if (solvingAnimations !== []) {

        solvingAnimations.forEach((animation, index) => {
            setTimeout(() => {
                ctx.fillStyle = "#ff0000"
                const [row, col] = animation;
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }, drawSpeed * index);
        })

    }
}

export const animateMazeSolvingBacktrack = (backtrackingAnimations, canvas, cellSize, drawSpeed, delay) => {
    const ctx = canvas.current.getContext('2d');

    if (backtrackingAnimations !== []) {

        backtrackingAnimations.forEach((animation, index) => {
            setTimeout(() => {
                ctx.fillStyle = "#fcf000"
                const [row, col] = animation;
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }, delay + drawSpeed * index);
        })

    }
}