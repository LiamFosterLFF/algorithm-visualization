import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Fade, Nav, Dropdown, ButtonGroup, Button } from 'react-bootstrap';

import ButtonWrapper from './ButtonWrapper';
import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
import { defaultAnimations } from './utilities';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [ sort, setSort ] = useState("default");
    const [ dropdownText, setDropdownText ] = useState("Choose Sorting Algorithm");
    const [ showDropdown, setShowDropdown ] = useState(false);
    const [ showButton, setShowButton ] = useState(false);

    const handleChartTypeClick = () => {
        setSort("default");
        setDropdownText("Choose Sorting Algorithm");
        setShowDropdown(true);
    }

    const handleSortTypeClick = (type) => {
        setSort(type);
        setShowDropdown(true);
        setDropdownText(`${type.charAt(0).toUpperCase() + type.slice(1)} Sort Algorithm`);
    }




    const FadeVariety = () => {
        if (showDropdown) {
            return (
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {dropdownText}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSortTypeClick("bubble")}>Bubble</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortTypeClick("selection")}>Selection</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortTypeClick("insertion")}>Insertion</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortTypeClick("merge")}>Merge</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortTypeClick("quick")}>Quick</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortTypeClick("radix")}>Radix</Dropdown.Item>
                    </Dropdown.Menu>
                    
                </Dropdown>
            )
        } else {
            return <div></div>
        }
    }



    return (

        <Router>
            <Nav className="nav-bar">
                <Nav.Item>
                    <Nav.Link>
                        <Link to="/barchart" onClick={() => handleChartTypeClick()}>Bar Chart</Link>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link>
                        <Link to="/colormap" onClick={() => handleChartTypeClick()}>Color Map</Link>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link>
                        <Link to="/pixelmap" onClick={() => handleChartTypeClick()}>Pixel Map</Link>
                    </Nav.Link>
                </Nav.Item>

                <Fade in={showDropdown}>
                    <FadeVariety/>
                </Fade>
            </Nav>

            <Switch>
                <Route path="/barchart">
                    <BarChart sort={sort} showButton={showButton}/>
                </Route>
                <Route path="/colormap">
                    <ColorMap sort={sort} />
                </Route>
                <Route path="/pixelmap">
                    <PixelMap sort={sort} />
                </Route>
            </Switch>
        </Router>

    )
}

export default Sorting;

// // All
// Top bar? What does it say
// // Sorting
// Buttons ugly, use bootstrap
// Reset should be a totally different layout each timers
// // Maze
// Mazes should generate when button press
// Mazes should solve when button press
// Black board should generate on load
// Solving again should reset to uncolored maze
// Can't adjust maze size
// Draw maze more slowly? Maybe a bar
// Bars need to be labelled
// Need a back button
// Buttons ugly, use bootstrap
// Center the thing on the page