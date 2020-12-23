// Animations

export const animateMazeDrawing = (mazeAnimations, canvas, cellSize) => {
    const ctx = canvas.current.getContext('2d');

    let counter = 0;
    let stepId;
    function drawPath() {
        if (mazeAnimations.drawingAnimations.length !== 0) {

            for (let i = 0; i < 725; i++) {
                if (counter < mazeAnimations.drawingAnimations.length) {
                    const animation = mazeAnimations.drawingAnimations[counter];
                    const [row, col] = animation;
                    ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
                    counter++
                }
            }

            stepId = window.requestAnimationFrame(drawPath);
            

        }
    }
    const play = () => {
        window.requestAnimationFrame(drawPath)
    }

    const stopMazeDrawingAnimations = () => {
        cancelAnimationFrame(stepId)
        return stepId
    }

    play()

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