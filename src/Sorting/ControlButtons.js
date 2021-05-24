import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const ControlButtons = (props) => {
    
    return (
        <div>
        <ButtonGroup>
            <Button size="lg" onClick={props.play} disabled={props.disabled}>Play</Button>
            <Button size="lg" onClick={props.pause} disabled={props.disabled}>Pause</Button>
            <Button size="lg" onClick={props.restart} disabled={props.disabled}>Restart</Button>
            <Button size="lg" onClick={props.reset} disabled={props.disabled}>Reset</Button>
        </ButtonGroup>
        </div>
    )
}

export default ControlButtons;