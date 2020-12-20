import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { Nav, Button, ButtonGroup } from 'react-bootstrap';

import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
import { defaultAnimations } from './utilities';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [ sort, setSort ] = useState("default");
    const [ fadeOpen, setFadeOpen ] = useState(false);

    const handleChartTypeClick = () => {
        setSort("default");
        setFadeOpen(true);
    }

    const handleSortTypeClick = (type) => {
        setSort(type);
    }

    const FadeVariety = () => {
        if (fadeOpen) {
            return (
                <ButtonGroup data-toggle="button">
                    <Button variant="secondary" onClick={() => handleSortTypeClick("bubble")}>Bubble</Button>
                    <Button variant="secondary" onClick={() => handleSortTypeClick("selection")} >Selection</Button>
                    <Button variant="secondary" onClick={() => handleSortTypeClick("insertion")} >Insertion</Button>
                    <Button variant="secondary" onClick={() => handleSortTypeClick("merge")} >Merge</Button>
                    <Button variant="secondary" onClick={() => handleSortTypeClick("quick")} >Quick</Button>
                    <Button variant="secondary" onClick={() => handleSortTypeClick("radix")} >Radix</Button>
                </ButtonGroup>
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

                <div in={fadeOpen}>
                    <FadeVariety/>
                </div>
            </Nav>

            <Switch>
                <Route path="/barchart">
                    <BarChart sort={sort} />
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