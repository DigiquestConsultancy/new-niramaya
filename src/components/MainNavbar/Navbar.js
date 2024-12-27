
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Company from '../../images/logo.jpg';
import '../../css/Navbar.css';
 
const CustomNavbar = () => {
    const location = useLocation();
 
    const handleLoginSignUpRedirect = () => {
        if (location.pathname === '/patient/login') {
            return '/patient/register';
        } else if (location.pathname === '/doctor/login') {
            return '/doctor/register';
        }
        return '/patient/login';
    };
 
    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src={Company} alt="Company Logo" height="40" />
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link
                        as={Link}
                        to={handleLoginSignUpRedirect()}
                        className="btn custom-link text-white"
                        style={{ paddingRight: '30px' }}
                    >
                        Login/SignUp
                    </Nav.Link>
                </Nav>
 
            </Container>
        </Navbar>
    );
};
 
export default CustomNavbar;