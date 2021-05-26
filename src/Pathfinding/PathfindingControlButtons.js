import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const PathfindingControlButtons = ({ buttons }) => {

    console.log(buttons);
    return (
        <div>
            <ButtonGroup>
                {buttons.map(button => 
                     <Button onClick={button.function}>{button.text}</Button>
                )}
            </ButtonGroup>
        </div>
    )
}
// {/*disabled={!mazeGenerated}*/}
export default PathfindingControlButtons;