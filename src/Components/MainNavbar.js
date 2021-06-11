import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const MainNavbar = () => {

    const location = useLocation();

    const isCurrentURL = (url) => {
        return location.pathname.toLowerCase() === url.toLowerCase();
    }


    return (
        <Navbar>
            <Nav variant="pills" activeKey={location.pathname} >
                <Nav.Item>
                    <Link style={{"margin": "10px"}} to="/sorting">Sorting</Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/pathfinding">Pathfinding</Link>
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