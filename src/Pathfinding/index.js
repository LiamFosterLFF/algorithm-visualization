import React, { useState, useEffect, useRef } from 'react';

const Pathfinding = () => {
    const canvas = useRef(null);
    const [canvasDimensions, setCanvasDimensions] = useState({width: 220, height: 220, x: 0, y: 0}) //FIX SO THAT SET PROGRAMMATICALLY
    const [grid, setGrid] = useState([])
    const [animations, setAnimations] = useState([])
    const [cellSize, setCellSize] = useState(20) // Fix this so that it's set with number of cells, not sizee !!!!

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
        for (let i=0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid.push([j * cellSize, i * cellSize, "wall"])  // This is unneccessary except for the wall part; in fact, you could just make an array of size i*j with walls for errythang. Or make an array of length cols and put in rows number of times into a larger array, so it sets up properly. Clean up thing
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


    const recursiveMazeAlgorithm = (startNode, cols, newGrid) => {
        let node = startNode;
        setAnimations(animations => [...animations, node])
        const directionArray = shuffle([...Array(4).keys()]);
        for (let i = 0; i < 4; i++) {
            
            const direction = directionArray[i]

            switch (direction) {
                case 0: // Up: if potential path column above is not edge or filled
                    if (((node - cols * 2) >= 0) && (newGrid[node - cols * 2][2] === "wall")) {
                        const [midNode, newNode] = [node - cols, node - (cols * 2)];
                        newGrid[midNode][2] = "path";
                        newGrid[newNode][2] = "path";
                        setAnimations(animations => [...animations, midNode]);
                        recursiveMazeAlgorithm(newNode, cols, newGrid)
                    }
                    break;
                case 1: // Right: if two squares to the right is not over edge or filled
                    if ((((node + 2) % cols) !== 0) && (newGrid[node + 2][2] === "wall")) {
                        const [midNode, newNode] = [node + 1, node + 2];
                        newGrid[midNode][2] = "path";
                        newGrid[newNode][2] = "path";
                        setAnimations(animations => [...animations, midNode]);
                        recursiveMazeAlgorithm(newNode, cols, newGrid)
                    }
                    break;
                case 2: // Down: if potential path column below is not edge or filled
                    if (((node + cols * 2) <= newGrid.length) && (newGrid[node + cols * 2][2] === "wall")) {
                        const [midNode, newNode] = [node + cols, node + (cols * 2)];
                        newGrid[midNode][2] = "path";
                        newGrid[newNode][2] = "path";
                        setAnimations(animations => [...animations, midNode]);
                        recursiveMazeAlgorithm(newNode, cols, newGrid)
                    }
                    break;
                case 3: // Left: if two squares to the left is not over edge or filled
                    if ((((node - 2) % cols) !== 10) && (newGrid[node - 2][2] === "wall")) {
                        const [midNode, newNode] = [node - 1, node - 2];
                        newGrid[midNode][2] = "path";
                        newGrid[newNode][2] = "path";
                        setAnimations(animations => [...animations, midNode]);
                        recursiveMazeAlgorithm(newNode, cols, newGrid)
                    }
                    break;
            }
        }
        const sectionComplete = true;
        return sectionComplete
    }

    const [mazeGenerating, setMazeGenerating] = useState(false)
    useEffect(() => {
        const generateMaze = () => {
            if (mazeGenerating === true) {  // Only runs if button has been clicked, not every time grid is updated
                // Number of total columns and total rows
                const cols = canvasDimensions.width / cellSize;  
                const allNodes = [...Array(grid.length).keys()]  // All nodes in grid
                const possibleStarts = allNodes.filter((n) => (  
                    // Selects only nodes that are from odd columns and odd rows, so there is always a wall between the paths, and also does not select a node along the edges on the tops or sides
                    (Math.floor(n / cols) %2 !== 0)  &&
                    (n % 2 === 0) &&  
                    ((n % cols) !== 0) &&
                    ((n % cols) !== 10)
                ))
                
                const start = possibleStarts[Math.floor(Math.random()*possibleStarts.length)];
                const newGrid = [...grid];
                newGrid[start][2] = "path"
                setGrid(newGrid)


                


                
                
                const mazeFinished = recursiveMazeAlgorithm(start, cols, newGrid)
                if (mazeFinished) {
                    setMazeGenerating(false)
                }
            }
        }
        generateMaze()
    }, [mazeGenerating, grid])


    // Maze-solving algorithms: 
    // BREADTH FIRST
    // DEPTH FIRST
    // DJIKSTRA
    // A*
    //



    const animateGrid = (animations) => {
        console.log("Grid updated!");
        const ctx = canvas.current.getContext('2d');
        
        if (animations !== []) {
            console.log(animations);
            
            animations.forEach((animation, index) => {
                console.log("animation", animation, index);
                setTimeout(() => {
                    ctx.clearRect(grid[animation][0], grid[animation][1], cellSize, cellSize);
                }, 50 * index);

                // Maybe install backtracking here !!!!!!!!!!!!!!!!!!!!!
            })

        }
    }

    useEffect(() => {
       animateGrid(animations)
    }, [animations]);

    const handleOnClick = (e) => {
        
        const [rowNo, colNo] = [Math.floor((e.clientY - canvasDimensions.y) / cellSize), Math.floor((e.clientX - canvasDimensions.x + .5) / cellSize)];
        const totalCols = canvasDimensions.width / cellSize;
        const cellNo = rowNo*totalCols + colNo;
        console.log(rowNo, colNo, cellNo);
        
        const newGrid = [...grid];
        newGrid[cellNo][2] = (newGrid[cellNo][2] !== "path") ? "path" : "wall"
        setGrid(newGrid)
    };
    


    return (
        <div id="canvas">
            <canvas onClick={handleOnClick} ref={canvas}></canvas>
            <button onClick={() => setMazeGenerating(true)}>Generate Maze</button>
        </div> 
    )
}

export default Pathfinding;
