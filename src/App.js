import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import Navbar from './MainNavbar';

import MainPage from './MainPage';
import Sorting from './Sorting';
import Pathfinding from './Pathfinding'

const App = () => {

    return (
        <div className="page">
            <Router>
                <Navbar/>

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

