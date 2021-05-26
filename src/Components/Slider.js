import React from 'react'

const Slider = (props) => {
    return (
        <div className="sliders-bar">
            <label for="myRange">Animation Speed</label>
            <input onChange={(e) => props.setValue(e.target.value)} type="range" min="1" max="100" value={props.value} class="slider" id="myRange"></input>
        </div>
    )
}

export default Slider;