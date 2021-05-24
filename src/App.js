import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Button } from 'react-bootstrap';
import './app.css';

import MainPage from './MainPage';
import Sorting from './Sorting';
import Pathfinding from './Pathfinding'

const App = () => {
    return (
        <div className="page">
            <Router>
                <Navbar>
                    <Nav activeKey="/main" >
                        <Nav.Item>
                            <Nav.Link>
                                <Link to="/sorting">Sorting</Link>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link >
                                <Link to="/pathfinding">Pathfinding</Link>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Link to="/main">Back to Main</Link>
                    </Navbar.Collapse>
                </Navbar>

                <Switch>
                    <Route path="/main">
                        <MainPage />
                    </Route>
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

