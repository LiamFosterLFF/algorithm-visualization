import React from 'react';

import './app.css';

import Sorting from './Sorting';
import Pathfinding from './Pathfinding'

const App = () => {
    return (
        <div className="page">
            {/* <Sorting/> */}
            <Pathfinding />
        </div>
    )
};

export default App;