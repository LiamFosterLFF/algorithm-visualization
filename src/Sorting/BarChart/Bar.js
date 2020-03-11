import React from 'react';

const Bar = ({ height, key }) => {

    const barHeightinPercent = height/10;
    const barStyle = {
        height: `${barHeightinPercent}%`
    }
    
    return (
        <div key={key} className="bar" style={barStyle}></div>
    )
}

export default Bar;