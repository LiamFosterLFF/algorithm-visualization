import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const PathfindingControlButtons = (props) => {

    return (
        <>
            <ButtonGroup>
                <Button onClick={() => props.clear()}>Clear</Button>
                <Button onClick={() => props.fill()}>Fill</Button>
                <Button onClick={() => props.generate(true)}>Generate Maze</Button>
                <Button onClick={() => props.solve(true)} >Solve Maze</Button>
            </ButtonGroup>
            
            <ButtonGroup>
                <Button onClick ={() => props.play()}>Play</Button>
                <Button onClick ={() => props.pause()}>Pause</Button>
                <Button onClick ={() => props.reset()}>Reset</Button>
                <Button onClick ={() => props.replay()}>Replay</Button>
            </ButtonGroup>
            
        </>
    )
}
// {/*disabled={!mazeGenerated}*/}
export default PathfindingControlButtons;