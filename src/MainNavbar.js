import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const MainNavbar = () => {

    const location = useLocation();

    const isCurrentURL = (url) => {
        return location.pathname.toLowerCase() === url.toLowerCase();
    }

    return (
        <Navbar>
            <Nav activeKey="/main" >
                <Nav.Item>
                    <Nav.Link>
                        <Link to="/sorting">Sorting</Link>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link >
                        <Link to="/pathfinding">Pathfinding</Link>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            { isCurrentURL("/main") ? 
            null : 
            <Navbar.Collapse className="justify-content-end">
                <Link to="/main">Back to Main</Link>
            </Navbar.Collapse>
            }
        </Navbar>
    )
}

export default MainNavbar;