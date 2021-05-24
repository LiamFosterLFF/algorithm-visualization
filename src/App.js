import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import './app.css';

import MainPage from './MainPage';
import Sorting from './Sorting';
import Pathfinding from './Pathfinding'

const App = () => {
    return (
        <div className="page">
             <Router>
                <Nav activeKey="/main" >
                    <Nav.Item>
                        <Nav.Link>
                            <Link to="/main">Main</Link>
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

