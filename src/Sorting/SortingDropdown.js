import React from "react";
import { Dropdown } from 'react-bootstrap';

const SortingDropdown = ({ sortType, sortFn }) => {  

    console.log(sortType);
    const dropdownText = `${sortType.charAt(0).toUpperCase() + sortType.slice(1)} Sort Algorithm`;

    return(
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {dropdownText}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => sortFn("bubble")}>Bubble</Dropdown.Item>
                <Dropdown.Item onClick={() => sortFn("selection")}>Selection</Dropdown.Item>
                <Dropdown.Item onClick={() => sortFn("insertion")}>Insertion</Dropdown.Item>
                <Dropdown.Item onClick={() => sortFn("merge")}>Merge</Dropdown.Item>
                <Dropdown.Item onClick={() => sortFn("quick")}>Quick</Dropdown.Item>
                <Dropdown.Item onClick={() => sortFn("radix")}>Radix</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default SortingDropdown;