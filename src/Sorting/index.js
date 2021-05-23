import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Nav, ButtonGroup, Button } from 'react-bootstrap';

import ButtonWrapper from './ButtonWrapper';
import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
import { defaultAnimations } from './utilities';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [ showButton, setShowButton ] = useState(false);

    // const handleChartTypeClick = () => {
    //     setSort("bubble");
    //     setDropdownText("Choose Sorting Algorithm");
    //     setShowDropdown(true);
    // }

    // const handleSortTypeClick = (type) => {
    //     setSort(type);
    //     setShowDropdown(true);
    //     setDropdownText(`${type.charAt(0).toUpperCase() + type.slice(1)} Sort Algorithm`);
    // }

    return (

        <Router>
            <Nav className="nav-bar">
                <Nav.Item>
                    <Nav.Link>
                        <Link to="/barchart">Bar Chart</Link>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link>
                        <Link to="/colormap">Color Map</Link>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link>
                        <Link to="/pixelmap">Pixel Map</Link>
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Switch>
                <Route path="/barchart">
                    <BarChart showButton={showButton}/>
                </Route>
                <Route path="/colormap">
                    <ColorMap />
                </Route>
                <Route path="/pixelmap">
                    <PixelMap />
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