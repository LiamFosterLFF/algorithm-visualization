import React from 'react';

const Node = ({node, key}) => {
    const extraClassName = node.isStart ? "node-start" : node.isFinish ? "node-finish"
     : "";
    return (
        <div className={`box ${extraClassName}`} key={key}></div>
    )
};

export default Node;