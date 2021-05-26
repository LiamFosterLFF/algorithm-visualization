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

const weightFinder = (nodeMazeGrid, nodeList) => { // Finds weights for building an edge graph of the maze
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
    const animations = { solvingAnimations: [], backtrackingAnimations: [] };

    let solvingAlgorithm;
    switch (algorithm) {
        case "Depth-First Search":
            solvingAlgorithm = depthFirstSearchSolvingAlgorithm;
            break;
        case "Breadth-First Search":
            solvingAlgorithm = breadthFirstSearchSolvingAlgorithm
            break;
        case "Djikstra's Algorithm":
            solvingAlgorithm = dijkstrasSolvingAlgorithm
            break;
        case "A* Search Algorithm":
            solvingAlgorithm = aStarSolvingAlgorithm
            break;
        default: 
            solvingAlgorithm = defaultSolvingAlgorithm;
            break;
    }

    solvingAlgorithm(defaults.start, defaults.enter, defaults.exit, newGrid, animations)
    const mappedSolvingAnimations = animations.solvingAnimations.map((animation) => {
        return {location: animation, type: "searched"}
    })
    const mappedBacktrackingAnimations = animations.backtrackingAnimations.map((animation) => {
        return {location: animation, type: "backtrack"}
    })
    
    const mappedAnimations = {
        solvingAnimations: mappedSolvingAnimations,
        backtrackingAnimations: mappedBacktrackingAnimations
    }
    return mappedAnimations
}

const defaultSolvingAlgorithm = (startNode, prevNode, origMazeGrid, animations) => {
    return false
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

const nodeAndWeightFinder = (mazeGrid, baseNode) => { // Finds nodes, points at which the maze either turns or forks, and their corresponding weights to the base node
    const nodeAndWeightList = []; // List of nodes with the location and directions of nearest nodes 
    const [row, col] = baseNode;
    
    for (let direction = 0; direction < 4; direction++) {
        
        let counter = 1;
        let node;
        switch (direction) {
            case 0:
                if (baseNode[0] - counter >= 0 && mazeGrid[baseNode[0] - counter][baseNode[1]] === "path") {
                    while (!isANode(mazeGrid, [baseNode[0] - counter, baseNode[1]])) { // Up: if potential path column above is path
                        counter++
                    }
                    nodeAndWeightList.push([direction, counter])
                }
                break;
            case 1:
                if (baseNode[1] + counter < mazeGrid[0].length && mazeGrid[baseNode[0]][baseNode[1] + counter] === "path") {
                    while (!isANode(mazeGrid, [baseNode[0], baseNode[1] + counter])) { // Up: if potential path column above is path
                        counter++
                    }
                    nodeAndWeightList.push([direction, counter])
                }
                break;
            case 2:
                if (baseNode[0] + counter < mazeGrid.length && mazeGrid[baseNode[0] + counter][baseNode[1]] === "path") {
                    while (!isANode(mazeGrid, [baseNode[0] + counter, baseNode[1]])) { // Up: if potential path column above is path
                        counter++
                    }
                    nodeAndWeightList.push([direction, counter])
                }
                break;
            case 3:
                if (baseNode[1] - counter >= 0 && mazeGrid[baseNode[0]][baseNode[1] - counter] === "path") {
                    while (!isANode(mazeGrid, [baseNode[0], baseNode[1] - counter])) { // Up: if potential path column above is path
                        counter++
                    }
                    nodeAndWeightList.push([direction, counter])
                }
                break;
        }
    }
    
    return nodeAndWeightList
}

const isANode = (mazeGrid, node) => { // Checks if selected location is a node or not
    // Scans four directions and 
    const [row, col] = node;
    
    const directions = [];
    if (row > 0 && mazeGrid[row - 1][col] === "path") { // Up
        directions.push(0)
    } 
    if (col < mazeGrid[0].length - 1 && mazeGrid[row][col + 1] === "path") { // Right
        directions.push(1)
    } 
    if (row < mazeGrid.length - 1 && mazeGrid[row + 1][col] === "path") { // Down
        directions.push(2)
    } 
    if (col > 0 && mazeGrid[row][col - 1] === "path") { // Left
        directions.push(3)
    }
    
    if (directions.length === 1 || directions.length > 2 || (directions[0] - directions[1]) % 2 !== 0) { 
        // Is either a dead end or a t-junction/4-way or a corner 
        return true
    }

    return false
}


const dijkstrasSolvingAlgorithm = (startNode, enterNode, exitNode, mazeGrid, animations, heuristic = false) => {
    const lowestUnvisitedNode = (distances, visitedNodes) => {
        let min = [null, Infinity];
        Object.entries(distances).forEach((distance) => {
            const currentDistanceStr = distance[0];
            if (!visitedNodes[currentDistanceStr] && distances[currentDistanceStr] < min[1]) {
                min = [currentDistanceStr, distance[1]];
            }
        })

        return (min[0] === null) ? null : min[0].split(",");
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
    let unvisitedNodes = nodeAndWeightFinder(mazeGrid, enterNode)
    
    let currentNode = enterNode;
    animations.solvingAnimations.push(enterNode)
    while (currentNode !== null && (currentNode[0] !== exitNode[0] && currentNode[1] !== exitNode[1])) { // Exits if out of nodes or at end
        // Converts back from string to number
        const [row, col] = [Number(currentNode[0]), Number(currentNode[1])];
        animations.solvingAnimations.push([row, col])

        const currentNodeStr = `${row},${col}` // String for node currently looking at, for lookup in dictionary
        const currentDistance = distances[currentNodeStr]; // Distance of current node from start
        unvisitedNodes = nodeAndWeightFinder(mazeGrid, [row, col]) // Find weights of all attached nodes, meaning distances from current node
        unvisitedNodes.forEach((edge) => { // Cycle through all nearest nodes
            const [direction, edgeDistance] = [edge[0], edge[1]] // Direction and distance/weight to that direction
            let childNode, childNodeStr, totalWeight;
            let hWeight = 0; // Additional heuristic weight, for use in A*
            const distanceFromStart = currentDistance + edgeDistance

            switch (direction) {
                case 0: //Up
                    // Make new node and node string
                    childNode = [row - edgeDistance, col];  
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    // Calculate heuristic weight based on Manhattan distance, if using heuristic
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0; 
                    totalWeight = distanceFromStart + hWeight
                    // Update distance if weight is smaller than previously recorded (if recorded at all, else weight == infinity)
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr;
                    }
                    break;
                case 1: //Right
                    // Make new node and node string
                    childNode = [row, col + edgeDistance];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    // Calculate heuristic weight based on Manhattan distance, if using heuristic
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0;
                    totalWeight = distanceFromStart + hWeight;
                    // Update distance if weight is smaller than previously recorded (if recorded at all, else weight == infinity)
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr;
                    }
                    break;
                case 2: //Down
                    // Make new node and node string
                    childNode = [row + edgeDistance, col];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    // Calculate heuristic weight based on Manhattan distance, if using heuristic
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0;
                    totalWeight = distanceFromStart + hWeight;
                    // Update distance if weight is smaller than previously recorded (if recorded at all, else weight == infinity)
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr;
                    }
                    break;
                case 3: //Left
                    // Make new node and node string
                    childNode = [row, col - edgeDistance];
                    childNodeStr = `${childNode[0]},${childNode[1]}`;
                    // Calculate heuristic weight based on Manhattan distance, if using heuristic
                    hWeight = (heuristic) ? (exitNode[0] - childNode[0]) + (exitNode[1] - childNode[1]) : 0;
                    totalWeight = distanceFromStart + hWeight;
                    // Update distance if weight is smaller than previously recorded (if recorded at all, else weight == infinity)
                    if (distances[childNodeStr] === undefined || distances[childNodeStr] > (totalWeight)) {
                        distances[childNodeStr] = totalWeight;
                        parentNodes[childNodeStr] = currentNodeStr;
                    }
                    break;
                default:
                    break;
            }
        })

        visitedNodes[currentNodeStr] = unvisitedNodes;
        currentNode = lowestUnvisitedNode(distances, visitedNodes)
    }

    if (currentNode === null || (currentNode[0] === exitNode[0] && currentNode[1] === exitNode[1])) {
        let backtrackNode = exitNode;
        animations.backtrackingAnimations.push(backtrackNode)

        while (backtrackNode[0] !== enterNode[0] && backtrackNode[1] !== enterNode[1]) {
            const newNodeStrArray = parentNodes[`${backtrackNode[0]},${backtrackNode[1]}`].split(",")
            backtrackNode = [Number(newNodeStrArray[0]), newNodeStrArray[1]]
            animations.backtrackingAnimations.push(backtrackNode)

        }
    }
}

const aStarSolvingAlgorithm = (startNode, enterNode, exitNode, mazeGrid, animations) => {
    dijkstrasSolvingAlgorithm(startNode, enterNode, exitNode, mazeGrid, animations, true)
}