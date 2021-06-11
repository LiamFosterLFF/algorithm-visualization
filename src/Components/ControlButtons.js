import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const ControlButtons = ({ buttons, size }) => {

    return (
        <div>
            <ButtonGroup>
                {buttons.map((button, index) => 
                     <Button 
                        key={index} 
                        title={(button.disabled) ? button.tooltip: null} size={size || "lg"} 
                        onClick={() => button.function()} disabled={button.disabled}>{button.text}
                     </Button>
                )}
            </ButtonGroup>
        </div>
    )
}
export default ControlButtons;