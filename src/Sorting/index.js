import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
import PixelPainting from './PixelPainting';

const Sorting = () => {    
    return (

        <Router>
            <nav>
                <div>
                    <ul>
                        <li><Link to="/barchart">Bar Chart</Link></li>
                        <li><Link to="/colormap">Color Mpa</Link></li>
                        <li><Link to="/pixelmap">Pixel Map</Link></li>
                        <li><Link to="/pixelpainting">Pixel Painting</Link></li>
                    </ul>
                </div>
            </nav>

            <Switch>
                <Route path="/barchart">
                    {/* <BarChart /> */}
                </Route>
                <Route path="/colormap">
                    {/* <ColorMap /> */}
                </Route>
                <Route path="/pixelmap">
                    <PixelMap />
                </Route>
                <Route path="/pixelpainting">
            
                </Route>
            </Switch>
        </Router>

    )
}

export default Sorting;