import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const ControlButtons = (props) => {
    
    return (
        <div>
        <ButtonGroup>
            <Button size="lg" onClick={props.play}>Play</Button>
            <Button size="lg" onClick={props.pause}>Pause</Button>
            <Button size="lg" onClick={props.restart}>Restart</Button>
            <Button size="lg" onClick={props.reset}>Reset</Button>
        </ButtonGroup>
        </div>
    )
}

export default ControlButtons;