import React, { useState, useEffect, useRef } from 'react';

const Pathfinding = () => {
    const canvas = useRef(null);
    const [cellSize, setCellSize] = useState(5) // Fix this so that it's set with number of cells, not sizee !!!!
    const [canvasDimensions, setCanvasDimensions] = useState({width: cellSize*105, height: cellSize*105, x: 0, y: 0}) //FIX SO THAT SET PROGRAMMATICALLY
    const [grid, setGrid] = useState([])
    const [animations, setAnimations] = useState([])
    const [solvingAnimations, setSolvingAnimations] = useState([])

    useEffect(() => {
        drawGrid(canvas, cellSize, canvasDimensions)

    }, [])

    const drawGrid = (canvas, cellSize, canvasDimensions) => {

        const ctx = canvas.current.getContext('2d');
        const [width, height] = [canvasDimensions.width, canvasDimensions.height]

        // Draw Initial Background
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.fillStyle = "#444";
        ctx.fillRect(0, 0, width, height);

        // Construct Grid of Cells
        const [rows, cols] = [width/cellSize, height/cellSize]
        const grid = [];
        // Builds a rows*cols nested array full of walls
        for (let row = 0; row < rows; row++) {
            grid.push([])
            for(let col = 0; col < cols; col++) {
                grid[row].push("wall")
            }
        }




        setGrid(grid)
        setCanvasDimensions({
            ...canvasDimensions,
            x: canvas.current.getBoundingClientRect().x,
            y: canvas.current.getBoundingClientRect().y
        })

    }

    const shuffle = (array) => {

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    };


    const recursiveMazeAlgorithm = (startNode, prevNode, newGrid) => {
        const node = startNode;
        
        const [row, col] = node;
        
        newGrid[row][col] = "path";
        const [prevRow, prevCol] = prevNode
        newGrid[prevRow][prevCol] = "path";
        
        setAnimations(animations => [...animations, prevNode, node,]) // Add current node to path animation
        const directionArray = shuffle([...Array(4).keys()]); // Create a random array of directions to choose from
        for (let i = 0; i < 4; i++) {  // Choose the next direction to go in, or return dead end

            const direction = directionArray[i]
            switch (direction) {
                case 0: // Up: if potential path column above is not edge or filled
                    if (((row - 2) >= 0) && (newGrid[row - 2][col] === "wall")) {
                        const [midNode, newNode] = [[row - 1, col], [row - 2, col]];
                        recursiveMazeAlgorithm(newNode, midNode,newGrid)
                    }
                    break;
                case 1: // Right: if two squares to the right is not over edge or filled
                    if (((col + 2) < newGrid[row].length) && (newGrid[row][col + 2] === "wall")) {
                        const [midNode, newNode] = [[row, col + 1], [row, col + 2]];
                        recursiveMazeAlgorithm(newNode, midNode, newGrid)
                    }
                    break;
                case 2: // Down: if potential path column below is not edge or filled
                    
                    if (((row + 2) < newGrid.length) && (newGrid[row + 2][col] === "wall")) {
                        const [midNode, newNode] = [[row + 1, col], [row + 2, col]];
                        recursiveMazeAlgorithm(newNode, midNode, newGrid)
                    }
                    break;
                case 3: // Left: if two squares to the left is not over edge or filled
                    if (((col - 2) >= 0) && (newGrid[row][col - 2] === "wall")) {
                        const [midNode, newNode] = [[row, col - 1], [row, col - 2]];
                        recursiveMazeAlgorithm(newNode, midNode,newGrid)
                    }
                    break;
            }
        }
        const deadEnd = true;
        return [deadEnd, newGrid]
    }

    const [mazeGenerating, setMazeGenerating] = useState(false)
    const [mazeDefaults, setMazeDefaults] = useState({})
    useEffect(() => {
        const generateMaze = () => {
            if (mazeGenerating === true) {  // Only runs if button has been clicked, not every time grid is updated
                // Number of total columns and total rows
                const [rows, cols] = [grid.length, grid[0].length]
                
                const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy grid so as not to mutate
                
                // Animate drawing the entrance and exit
                const [entrance, exit, start] = [[0, 1], [grid.length - 1, grid[0].length - 2], [1,1]]
                setAnimations(animations => [...animations, entrance, exit])

                // Add entrance and exit to state, and to grid
                setMazeDefaults({ 'entrance': entrance, 'exit': exit, 'start': start });
                newGrid[entrance[0]][entrance[1]] = "path";
                newGrid[exit[0]][exit[1]] = "path";
                
                // Calls with start as current and previous node; this is to allow for previous node to be used in recursive call
                const [mazeFinished, mazeGrid] = recursiveMazeAlgorithm(start, start, newGrid) 
                
                setGrid(mazeGrid)
                if (mazeFinished) {
                    setMazeGenerating(false)
                }
            }
        }
        generateMaze()
    }, [mazeGenerating, grid])


    const [backtrackingAnimations, setBacktrackingAnimations] = useState([])
    // Maze-solving algorithms:
    const depthFirstSearchSolvingAlgorithm = (startNode, prevNode, endNode, newGrid) => {
        const node = startNode;
        console.log(node, endNode);
        
        if ((node[0] === endNode[0]) && (node[1] === endNode[1])) {
            setBacktrackingAnimations(backtrackingAnimations => [...backtrackingAnimations, node])
            return true
        }

        let mazeEndFound = false; 
        const [row, col] = node;
        newGrid[row][col] = "checked";
        setSolvingAnimations(solvingAnimations => [...solvingAnimations, node])
        console.log(node);
        
        const directionArray = shuffle([...Array(4).keys()]);
        for (let i = 0; i < 4; i++) {
            
            const direction = directionArray[i]
            
            switch (direction) {

                case 0: // Up: checks if 2 squares up is not over edge and there is a path toward that direction
                    if ((row - 1 >= 0) && (newGrid[row - 1][col] === "path")) {
                        const newNode =  [row - 1, col];
                        setSolvingAnimations(solvingAnimations => [...solvingAnimations, newNode]);
                        mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid);
                    }
                    break;
                case 1: // Right: checks if 2 squares right is not over edge and there is a path toward that direction
                    if ((col + 1 < newGrid[row].length) && (newGrid[row][col + 1] === "path")) {
                        const newNode = [row, col + 1];
                        setSolvingAnimations(solvingAnimations => [...solvingAnimations, newNode]);
                        mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid);
                    }
                    break;
                case 2: // Down: checks if 2 squares down is not over edge and there is a path toward that direction
                    if ((row + 1 < newGrid.length) && (newGrid[row + 1][col] === "path")) {
                        const newNode = [row + 1, col];
                        setSolvingAnimations(solvingAnimations => [...solvingAnimations, newNode]);
                        mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid);
                    }
                    break;
                case 3: // Left: checks if 2 squares left is not over edge and there is a path toward that direction
                    if ((col - 1 >= 0) && (newGrid[row][col - 1] === "path")) {
                        const newNode = [row, col - 1];
                        setSolvingAnimations(solvingAnimations => [...solvingAnimations, newNode]);
                        mazeEndFound = depthFirstSearchSolvingAlgorithm(newNode, node, endNode, newGrid);
                    }
                    break;
                    
            }
            if (mazeEndFound) {
                setBacktrackingAnimations(backtrackingAnimations => [...backtrackingAnimations, node])
                return true;
            }
        }
        
    }

    const [mazeSolving, setMazeSolving] = useState(false)
    useEffect(() => {
        const solveMaze = () => {
            if (mazeSolving === true) {  // Only runs if button has been clicked, not every time grid is updated
                const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy of grid

                const mazeSolved = depthFirstSearchSolvingAlgorithm(mazeDefaults.entrance, mazeDefaults.entrance, mazeDefaults.exit, newGrid)
                
                setMazeGenerating(false)
            }
        }
        solveMaze()
        
    }, [mazeSolving, grid])

    const [drawSpeed, setDrawSpeed] = useState(.5)

    const animateMazeDrawing = (animations) => {
        const ctx = canvas.current.getContext('2d');

        if (animations !== []) {
            animations.forEach((animation, index) => {
                setTimeout(() => {
                    const [row, col] = animation;
                    ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }, drawSpeed * index);

                // Maybe install backtracking here !!!!!!!!!!!!!!!!!!!!!
            })
        }
    }

    useEffect(() => {
       animateMazeDrawing(animations)
    }, [animations]);

    const animateMazeSolving = (solvingAnimations) => {
        const ctx = canvas.current.getContext('2d');

        if (solvingAnimations !== []) {

            solvingAnimations.forEach((animation, index) => {
                setTimeout(() => {
                    ctx.fillStyle = "#ff0000"
                    const [row, col] = animation;
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }, drawSpeed * index);

                // Maybe install backtracking here !!!!!!!!!!!!!!!!!!!!!
            })

        }
    }

    useEffect(() => {
        animateMazeSolving(solvingAnimations)
    }, [ solvingAnimations]);

    const animateMazeSolvingBacktrack = (backtrackingAnimations) => {
        const ctx = canvas.current.getContext('2d');

        if (backtrackingAnimations !== []) {

            backtrackingAnimations.forEach((animation, index) => {
                setTimeout(() => {
                    ctx.fillStyle = "#fcf000"
                    const [row, col] = animation;
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }, drawSpeed * solvingAnimations.length + drawSpeed*index);

                // Maybe install backtracking here !!!!!!!!!!!!!!!!!!!!!
            })

        }
    }

    useEffect(() => {
        animateMazeSolvingBacktrack(backtrackingAnimations)
    }, [backtrackingAnimations]);
    
    const handleOnClick = (e) => {

        const [rowNo, colNo] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
        const totalCols = canvasDimensions.width / cellSize;
        const cellNo = rowNo*totalCols + colNo;

        const newGrid = [...grid];
        
        newGrid[cellNo][2] = (newGrid[cellNo][2] !== "path") ? "path" : "wall"
        setGrid(newGrid)
    };



    return (
        <div id="canvas">
            <canvas onClick={handleOnClick} ref={canvas}></canvas>
            <button onClick={() => setMazeGenerating(true)}>Generate Maze</button>
            <button onClick={() => setMazeSolving(true)}>Solve Maze</button>

        </div>
    )
}

export default Pathfinding;
