import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import './app.css';

import Sorting from './Sorting';
import Pathfinding from './Pathfinding'

const App = () => {
    return (
        <div className="page">
             <Router>
                <nav className="nav-bar">
                    <div>
                        <ul className="chart-types">
                            <li><Link className="chart-link" id="sorting"to="/sorting">Sorting</Link></li>
                            <li><Link  className="chart-link" id="pathfinding" to="/pathfinding">Pathfinding</Link></li>
                        </ul>
                    </div>
                </nav>

                <Switch>
                    <Route path="/sorting">
                        <Sorting />
                    </Route>
                    <Route path="/pathfinding">
                        <Pathfinding />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
};

export default App;