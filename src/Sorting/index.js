import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import BarChart from './BarChart';
import ColorMap from './ColorMap';
import PixelMap from './PixelMap';
// import PixelPainting from './PixelPainting';

const Sorting = () => {  
    
    const [sort, setSort] = useState("bubble")


    return (

        <Router>
            <nav className="nav-bar">
                <div>
                    <ul className="chart-types">
                        <li><Link className="chart-link" id="bar-chart"to="/barchart">Bar Chart</Link></li>
                        <li><Link  className="chart-link" id="color-map" to="/colormap">Color Map</Link></li>
                        <li><Link  className="chart-link" id="pixel-map" to="/pixelmap">Pixel Map</Link></li>
                        {/* <li><Link to="/pixelpainting">Pixel Painting</Link></li> */}
                    </ul>
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
            </nav>

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