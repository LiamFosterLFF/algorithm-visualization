import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';

const MainNavbar = () => {

    const location = useLocation();

    const isCurrentURL = (url) => {
        console.log(location.pathname);
        return location.pathname.toLowerCase() === url.toLowerCase();
    }

    let history = useHistory();
    
    const handleClick = (route) => {
        history.push(`/${route}`);
    }

    return (
        <Navbar>
            <Nav variant="pills" activeKey={location.pathname} >
                <Nav.Item>
                    <Nav.Link href="/sorting" onClick={() => handleClick("sorting")}>Sorting</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/pathfinding" onClick={() => handleClick("pathfinding")}>Pathfinding</Nav.Link>
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