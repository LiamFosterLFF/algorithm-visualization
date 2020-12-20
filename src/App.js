import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import './app.css';

import Sorting from './Sorting';
import Pathfinding from './Pathfinding'

const App = () => {
    return (
        <div className="page">
             <Router>
             <Nav activeKey="/main" onSelect={(selectedKey) => alert(`selected ${selectedKey}`)} >
                <Nav.Item>
                    <Nav.Link>
                        <Link to="/">Main</Link>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link>
                        <Link to="/sorting">Sorting</Link>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link>
                        <Link to="/pathfinding">Pathfinding</Link>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
                {/* <nav className="nav-bar">
                    <div>
                        <ul className="chart-types">
                            <li><Link className="chart-link" id="sorting"to="/sorting">Sorting</Link></li>
                            <li><Link  className="chart-link" id="pathfinding" to="/pathfinding">Pathfinding</Link></li>
                        </ul>
                    </div>
                </nav> */}

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

// Buttons ugly, use bootstrap
