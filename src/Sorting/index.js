import React, { useState, useEffect } from 'react';
import { Tab, Tabs, ButtonGroup, Button } from 'react-bootstrap';

import SortingDropdown  from './SortingDropdown';
import sortFunctions from "./utilities";

import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [ showButton, setShowButton ] = useState(false);
    const [ chartType, setChartType ] = useState("barChart"); // Add in functionality from parent
    const [ bars, setBars] = useState(sortFunctions[chartType].shuffle()); // Combine all three to use the same shuffl function from the functions import
    const [ animations, setAnimations ] = useState([])
    const [ sort, setSort ] = useState("bubble")
    const [ sortType, setSortType ] = useState({function: sortFunctions[chartType].defaultSort });
    const [ animationType, setAnimationType ] = useState({ function: sortFunctions[chartType].defaultAnimations });
    
    useEffect(() => {
        setBars(sortFunctions[chartType].shuffle(100))
    }, [chartType])
    
    useEffect(() => {
        setSortType({ function: sortFunctions[chartType][`${sort}Sort`]})
        setAnimationType({ function: sortFunctions[chartType][`${sort}SortAnimation`]})
    }, [sort])

    useEffect(() => {
        cancelAnimations(animations);
        buildAnimations(bars);
    }, [sortType])

    const buildAnimations = (bars) => {
        const barAnimations = animationType.function(sortType.function(bars));
        pauseAnimations(barAnimations)
        setAnimations(barAnimations);
    }

    const playAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.play();
            }
        })
    }

    const pauseAnimations = (animations) => {
        animations.map((animation) => {
            if (animation.playState !== "finished") {
                animation.pause();
            }
        })
    }

    const cancelAnimations = animations => {
        animations.map((animation) => {
            animation.cancel();
        })
    }   
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
        <div>
            <Tabs
                id="controlled-tab-example"
                activeKey={chartType}
                onSelect={(chart) => setChartType(chart)}
            >
                <Tab eventKey="barChart" title="Bar Chart">
                    <BarChart bars={bars}/>
                </Tab>
                <Tab eventKey="colorMap" title="Color Map">
                    <ColorMap bars={bars}/>
                </Tab>
                <Tab eventKey="pixelMap" title="Pixel Map">
                    <PixelMap bars={bars}/>
                </Tab>
            </Tabs>
            <SortingDropdown sortType={sort} sortFn={setSort}/>
            <ButtonGroup>
                <Button size="lg" onClick={() => playAnimations(animations)}>Play</Button>
                <Button size="lg" onClick={() => pauseAnimations(animations)}>Pause</Button>
            </ButtonGroup>
        </div>


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


        // <Router>
        //     <Nav className="nav-bar">
        //         <Nav.Item>
        //             <Nav.Link>
        //                 <Link to="/barchart">Bar Chart</Link>
        //             </Nav.Link>
        //         </Nav.Item>

        //         <Nav.Item>
        //             <Nav.Link>
        //                 <Link to="/colormap">Color Map</Link>
        //             </Nav.Link>
        //         </Nav.Item>

        //         <Nav.Item>
        //             <Nav.Link>
        //                 <Link to="/pixelmap">Pixel Map</Link>
        //             </Nav.Link>
        //         </Nav.Item>
        //     </Nav>

        //     <Switch>
        //         <Route path="/barchart">
        //             <BarChart showButton={showButton}/>
        //         </Route>
        //         <Route path="/colormap">
        //             <ColorMap />
        //         </Route>
        //         <Route path="/pixelmap">
        //             <PixelMap />
        //         </Route>
        //     </Switch>
        // </Router>