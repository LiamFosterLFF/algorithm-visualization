import React from 'react';
import { CardDeck, Card, Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

import mazeCardImage from "./maze-card-image.png";
import sortingCardImage from "./sorting-card-image.png";

const MainPage = () => {

    let history = useHistory();
    
    const handleClick = (route) => {
        history.push(`/${route}`);
    }
      
    return (
        <CardDeck>
            <Card onClick={() => handleClick("sorting")} style={{cursor: "pointer"}}>
                <Card.Img variant="top" src={sortingCardImage} />
                <Card.Body>
                <Card.Title>Sorting Algorithms</Card.Title>
                <Card.Text>
                    Set of three different visualizations of the most common algorithms used for sorting arrays.
                </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button>Click Here to Open</Button>
                </Card.Footer>
            </Card>
            <Card onClick={() => handleClick("pathfinding")} style={{cursor: "pointer"}}>
                <Card.Img variant="top" src={mazeCardImage}/>
                <Card.Body>
                <Card.Title>Maze Algorithms</Card.Title>
                <Card.Text>
                    Visualization of a set of algorithms commonly used for maze generation and solving.
                </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button>Click Here to Open</Button>
                </Card.Footer>
            </Card>
        </CardDeck>
    )
}

export default MainPage;