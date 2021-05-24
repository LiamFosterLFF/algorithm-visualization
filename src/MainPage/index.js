import React from 'react';
import { CardDeck, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import mazeCardImage from "./maze-card-image.png";
import sortingCardImage from "./sorting-card-image.png";

const MainPage = () => {

    const handleOnClick = () => {

    }

    return (
        <CardDeck>
            <Card>
                <Link to="/main">
                    <Card.Img variant="top" src={sortingCardImage} />
                </Link>
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
            <Card>
                <Card.Img variant="top" src={mazeCardImage} />
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