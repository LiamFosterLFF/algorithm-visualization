import React from 'react';
import { Dropdown } from 'react-bootstrap';

const DropdownMenu = (props) => {

    const toggleText = (props.title === "default") ? `Choose ${props.type} Algorithm` : props.title;
    const menuOptions = props.algorithms.map((option, index) => 
        <Dropdown.Item 
            key={index}
            onClick={() => props.select(option)} 
            href={`#/action-${index+1}`}
        >
            {option}
        </Dropdown.Item>
    )  

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {toggleText}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {menuOptions}
                </Dropdown.Menu>
            </Dropdown>

        </>
    ) 
}

export default DropdownMenu;