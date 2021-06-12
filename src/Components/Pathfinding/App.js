import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
                    <Redirect exact from= "/algorithm-visualization" to="/main" />
                    <Route path="/main" component={MainPage} />
                    <Route path="/sorting" component={Sorting} />
                    <Route path="/pathfinding" component={Pathfinding} />
                </Switch>
            </Router>
        </div>
    )
};

export default App;

// Still left to do:
// Bugs: 
//      Below are basicall all just one bug, issues surrounding the way maze algorithms interact with state
//      Get maze building working with no maze
//      What happens if no solution to maze?
//      Reset/replay only works on the first go round, then seems to be resetting  to the solved maze
//      Changing solving algorithm should reset to just maze w/ no solutions
//      Fix all console warnings on all pages
//      Sorting bug: why animations starts early

// explanations, for
//      Games Readme
//      Games How to play
//      Sorting Algorithms
//      Sorting Complexity
//      Pathfinding algorithms
//      Games Title

// Nice but not necessary:
//      Sorting slider for bars
//      Build a dynamic slider for maze cell size
//      Refactor sorting algorithm state to be a single state value
//      Sorting animations play automatically?
//      Go through and comment/possibly refactor algorithms
//      Refactor sorting animations using usewebanimations custom hook, allowing for better/safer dependencies
