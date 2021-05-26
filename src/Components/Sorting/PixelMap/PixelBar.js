import React from 'react';

const PixelBar = ({ heights }) => {
    const firstSegmentStyle = {
        height: `${heights[0]}%`,
        backgroundColor: '#000'
    }
    const secondSegmentStyle = {
        height: `${heights[1]}%`,
        backgroundColor: '#fff)'
    }
    const thirdSegmentStyle = {
        height: `${heights[2]}%`,
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