
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Company from '../../images/logo.jpeg';
// import '../../css/Navbar.css'; // Import Navbar.css for custom styles

// const Navbar = () => {
//     const location = useLocation();

//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//             <div className="container-fluid">
//                 <Link className="navbar-brand" to="/">
//                     <img src={Company} alt="Company Logo" height="40" />
//                 </Link>
//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarNav"
//                     aria-controls="navbarNav"
//                     aria-expanded="false"
//                     aria-label="Toggle navigation"
//                 >
//                     <span className="navbar-toggler-icon"></span>
//                 </button>
//                 <div className="collapse navbar-collapse" id="navbarNav">
//                     <ul className="navbar-nav ms-auto">
//                         {location.pathname === '/doctor/login' && (
//                             <li className="nav-item">
//                                 <Link to="/patient/register" className="btn btn-outline-light">Patient Register</Link>
//                             </li>
//                         )}
//                         {location.pathname === '/patient/login' && (
//                             <li className="nav-item">
//                                 <Link to="/doctor/login" className="btn btn-outline-light">Doctor Login</Link>
//                             </li>
//                         )}
//                         {(location.pathname === '/patient/register' || location.pathname === '/doctor/register') && (
//                             <li className="nav-item">
//                                 <Link to="/doctor/login" className="btn btn-outline-light">Doctor Login</Link>
//                             </li>
//                         )}
//                         {location.pathname !== '/doctor/login' && location.pathname !== '/patient/register' && location.pathname !== '/doctor/register' && location.pathname !== '/patient/login' && (
//                             <>
//                                 <li className="nav-item">
//                                     <Link to="/patient/login" className="btn btn-outline-light">Login</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link to="/patient/register" className="btn btn-outline-light ms-2">Register</Link>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;




import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Company from '../../images/logo.jpeg';
import '../../css/Navbar.css'; // Import custom styles
 
const CustomNavbar = () => {
    const location = useLocation();
 
    const handleLoginSignUpRedirect = () => {
        if (location.pathname === '/patient/login') {
            return '/patient/register';
        } else if (location.pathname === '/doctor/login') {
            return '/doctor/register';
        }
        return '/patient/login'; // Default redirect if none of the above conditions are met
    };
 
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src={Company} alt="Company Logo" height="40" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link
                            as={Link}
                            to={handleLoginSignUpRedirect()}
                            className="btn btn-outline-dark custom-link"
                        >
                            Login/SignUp
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
 
export default CustomNavbar;