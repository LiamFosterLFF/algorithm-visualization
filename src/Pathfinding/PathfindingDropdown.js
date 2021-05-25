import React from 'react';
import { Dropdown } from 'react-bootstrap';

const PathfindingDropdown = (props) => {

    console.log(props);
    const menuOptions = props.algorithms.map((option, ind) => 
        <Dropdown.Item 
            onClick={() => props.select(option)} 
            href={`#/action-${ind+1}`}
        >
            {option}
        </Dropdown.Item>
    )  

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {props.title}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {menuOptions}
                </Dropdown.Menu>
            </Dropdown>

        </>
    )
}

export default PathfindingDropdown;