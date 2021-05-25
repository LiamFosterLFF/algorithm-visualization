import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const PathfindingControlButtons = (props) => {

    return (
        <>
            <ButtonGroup>
                <Button onClick={() => props.clear()}>Clear</Button>
                <Button onClick={() => props.fill()}>Fill</Button>
            </ButtonGroup>
            
            <ButtonGroup>
                <Button onClick={() => props.generate(true)}>Generate Maze</Button>
                <Button onClick={() => props.solve(true)} >Solve Maze</Button>
                <Button onClick ={() => props.animate()}>Play</Button>
            </ButtonGroup>
        </>
    )
}
// {/*disabled={!mazeGenerated}*/}
export default PathfindingControlButtons;