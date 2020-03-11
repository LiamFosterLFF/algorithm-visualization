import React from 'react';

const Bar = ({ height }) => {

    const barHeightinPercent = height/10;
    const barStyle = {
        height: `${barHeightinPercent}%`
    }
    
    return (
        <div className="bar" style={barStyle}></div>
    )
}

export default Bar;