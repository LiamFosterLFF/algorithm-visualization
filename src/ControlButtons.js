import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const ControlButtons = ({ buttons, disabled }) => {

    return (
        <div>
            <ButtonGroup>
                {buttons.map(button => 
                     <Button size="lg" onClick={button.function} disabled={disabled}>{button.text}</Button>
                )}
            </ButtonGroup>
        </div>
    )
}
export default ControlButtons;