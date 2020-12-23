import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const ButtonWrapper = (props) => {
    return (
        <div>
            {props.children}
        <ButtonGroup>
            <Button size="lg" >Play</Button>
            <Button size="lg" >Pause</Button>
        </ButtonGroup>
        </div>
    )
}

export default ButtonWrapper;