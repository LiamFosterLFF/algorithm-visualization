import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [sort, setSort] = useState("bubble")


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
                        <Link to="/colorchart">Color Map</Link>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link>
                        <Link to="/pixelchart">Bar Pixel</Link>
                    </Nav.Link>
                </Nav.Item>
                <div>

                    <ul className="sort-types">
                        <li onClick={() => setSort("bubble")}>
                            bubble
                        </li>
                        <li onClick={() => setSort("selection")}>
                            selection
                        </li>
                        <li onClick={() => setSort("insertion")}>
                            insertion
                        </li>
                        <li onClick={() => setSort("merge")}>
                            merge
                        </li>
                        <li onClick={() => setSort("quick")}>
                            quick
                        </li>
                        <li onClick={() => setSort("radix")}>
                            radix
                        </li>
                    </ul>
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
                {/* <Route path="/pixelpainting">
                    <PixelPainting/>
                </Route> */}
            </Switch>
        </Router>

    )
}

export default Sorting;

// // All
// Top bar? What does it say
// // Sorting
// Buttons ugly, use bootstrap
// Shouldn't auto-play on switching sort types
// Reset should be a totally different layout each timers
// Needs back button
// Picture sorting not working (low priority)
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