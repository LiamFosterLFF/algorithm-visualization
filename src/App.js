import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import Navbar from './Components/MainNavbar';

import MainPage from './Components/MainPage';
import Sorting from './Components/Sorting';
import Pathfinding from './Components/Pathfinding'

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

// Still left to do:
// Bugs: 
//      Play button needs to do something
//      Sorting bug: why animations tarts early
//      Get maze building working with no maze
//      What happens if no solution to maze?
//      Changing solving algorithm should reset to just maze w/ no solutions
//      Reset/replay only works on the first go round, then seems to be resetting  to the solved maze
//      Buttons overlap maze currently
//      On first load, main page is currently blank
//      Fix all bugs on all pages

// explanations, for
//      Games Readme
//      Games How to play
//      Sorting Algorithms
//      Sorting Complexity
//      Pathfinding algorithms
//      

// Nice but not necessary:
//      Sorting slider for bars
//      Build a dynamic slider for maze cell size
//      Refactor sorting algorithm state to be a single state value
//      Sorting animations play automatically?
//      Go through and comment/possibly refactor algorithms
