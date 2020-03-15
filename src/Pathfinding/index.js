import React, { useState, useEffect } from 'react';
import Node from './Node';

const Pathfinding = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const nodeList = [];
        for (let row = 0; row < 20; row++) {
            let currentRow = [];
            for (let col = 0; col < 50; col++) {
                let currentNode = {
                    row,
                    col,
                    isStart: (row === 10 && col === 5),
                    isFinish: (row === 10 && col === 45)
                }
                currentRow.push(currentNode);
            }
            nodeList.push(currentRow);
        }
        setNodes(nodeList);
    }, [])

    console.log(nodes)

    return (
        <div className="grid">
            {nodes.map((row, rowIndex) => {
                return (
                    <div className="row" key={rowIndex}>
                        {row.map((node, nodeIndex) => {
                            return (
                                <Node node={node} key={nodeIndex} />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Pathfinding;