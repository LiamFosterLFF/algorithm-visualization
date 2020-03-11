import React from 'react';

const PixelBar = ({ heights }) => {

    const firstSegmentStyle = {
        height: `${3*heights[0]}px`,
        backgroundColor: '#000'
    }
    const secondSegmentStyle = {
        height: `${3*heights[1]}px`,
        backgroundColor: '#fff)'
    }
    const thirdSegmentStyle = {
        height: `${3*heights[2]}px`,
        backgroundColor: '#000'
    }

    
    return (
        <div className="pixel-bar">
            <div style={firstSegmentStyle}></div>
            <div style={secondSegmentStyle}></div>
            <div style={thirdSegmentStyle}></div>
        </div>
    )
}

export default PixelBar;