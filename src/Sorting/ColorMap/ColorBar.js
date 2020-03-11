import React from 'react';

const ColorBar = ({ color }) => {

    const colorBarStyle = {
        backgroundColor: `hsl(${color}, 100%, 50%)`
    }
    
    return (
        <div className="color-bar" style={colorBarStyle}></div>
    )
}

export default ColorBar;