// Draw initial Grid
export const drawGrid = (canvas, cellSize, canvasDimensions) => {

    const ctx = canvas.current.getContext('2d');
    const [width, height] = [canvasDimensions.width, canvasDimensions.height]

    // Draw Initial Background
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, width, height);

    // Construct Grid of Cells
    const [rows, cols] = [width / cellSize, height / cellSize]
    const grid = [];
    // Builds a rows*cols nested array full of walls
    for (let row = 0; row < rows; row++) {
        grid.push([])
        for (let col = 0; col < cols; col++) {
            grid[row].push("wall")
        }
    }

    const [xCoordinate, yCoordinate] = [canvas.current.getBoundingClientRect().x, canvas.current.getBoundingClientRect().y]

    return [grid, xCoordinate, yCoordinate]



}

// Generate initial maze
export const generateMaze = (grid) => {
  
        // Number of total columns and total rows
        
        let mazeGrid = JSON.parse(JSON.stringify(grid)); // Deep copy grid so as not to mutate
        const [rows, cols] = [mazeGrid.length, mazeGrid[0].length]

        // Animate drawing the entrance and exit
        const [entrance, exit, start] = [[0, 1], [mazeGrid.length - 1, mazeGrid[0].length - 2], [1, 1]]
        let mazeAnimations = [entrance, exit];

        // Add entrance and exit to state, and to grid
        mazeGrid[entrance[0]][entrance[1]] = "path";
        mazeGrid[exit[0]][exit[1]] = "path";

        // Calls with start as current and previous node; this is to allow for previous node to be used in recursive call
        let mazeFinished;
        [mazeGrid, mazeAnimations, mazeFinished] = recursiveMazeAlgorithm(start, start, mazeGrid, mazeAnimations)

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


const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
};


// Maze-solving algorithms:

export const solveMaze = (grid) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy of grid
    const [enter, exit, start] = [[0, 1], [grid.length - 1, grid[0].length - 2], [1, 1]]
    const animations = {solvingAnimations: [], backtrackingAnimations: []};
    
    depthFirstSearchSolvingAlgorithm(start, enter, exit, newGrid, animations)
    return animations
}

export const depthFirstSearchSolvingAlgorithm = (startNode, prevNode, endNode, newGrid, animations) => {
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



// Animations 

export const animateMazeDrawing = (animations, canvas, cellSize, drawSpeed) => {
    const ctx = canvas.current.getContext('2d');

    if (animations !== []) {
        animations.forEach((animation, index) => {
            setTimeout(() => {
                const [row, col] = animation;
                ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }, drawSpeed * index);
        })
    }
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