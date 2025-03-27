import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaBars, FaBriefcaseMedical } from "react-icons/fa";
import "../static-pages/Navbar.css"; // Make sure to style it properly
import { Link } from "react-router-dom";
import logo from "../static-pages/images/logon.webp";

const CustomNavbar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="lg" className="custom-navbar" expanded={expanded}>
      <Container>
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
        </Link>

        {/* Toggle Button for Small Screens */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        >
          <FaBars />
        </Navbar.Toggle>

        {/* Navigation Links */}
        {/* <Navbar.Collapse id="basic-navbar-nav" className="nav-collapse">
          <Nav className="mx-auto nav-links">
            <Nav.Link href="/" className="nav-item active">Home</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>
            <Nav.Link href="/treatment">Treatment</Nav.Link>
            <Nav.Link href="/doctors">Our Doctors</Nav.Link>
            <Nav.Link href="/gallery">Gallery</Nav.Link>
            <Nav.Link href="/contact">Contact Us</Nav.Link>
          </Nav> */}
           <Navbar.Collapse id="basic-navbar-nav" className="nav-collapse">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={Link} to="/" className="nav-item active">Home</Nav.Link>
            <Nav.Link className="nav-item disabled-link">About Us</Nav.Link>
            <Nav.Link className="nav-item disabled-link">Treatment</Nav.Link>
            <Nav.Link className="nav-item disabled-link">Our Doctors</Nav.Link>
            <Nav.Link className="nav-item disabled-link">Gallery</Nav.Link>
            <Nav.Link className="nav-item disabled-link">Contact Us</Nav.Link>
          </Nav>

          {/* Book Appointment Button */}
         <Link to="/patientbookappointment">
         <Button variant="outline-danger" className="appointment-button">
            Book Appointment <FaBriefcaseMedical />
          </Button></Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
