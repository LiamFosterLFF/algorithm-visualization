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
