import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const ControlButtons = ({ buttons }) => {

    return (
        <div>
            <ButtonGroup>
                {buttons.map(button => 
                     <Button size="lg" onClick={() => button.function()} disabled={button.disabled}>{button.text}</Button>
                )}
            </ButtonGroup>
        </div>
    )
}
export default ControlButtons;