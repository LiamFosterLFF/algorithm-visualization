import React from 'react'

const Slider = (props) => {
    return (
        <div className="sliders-bar">
            <label htmlFor={props.name}>{props.label}</label>
            <input 
                onChange={(e) => props.setValue(e.target.value)} 
                type="range" 
                min={props.range.min}
                max={props.range.max}
                step={props.range.step}
                value={props.value} 
                className="slider" 
                id={props.name}
            ></input>
        </div>
    )
}

export default Slider;