import React from "react";
import {
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaGooglePlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaUserDoctor } from "react-icons/fa6";
import "../static-pages/SubNavbar.css"; // Import the correct CSS file

const SubNavbar = () => {
  return (
    <div className="subnavbar">
      <Container>
        <Row className="d-none d-md-flex">
          {/* Desktop Layout - 3 Columns */}
          <Col md={3} className="d-flex align-items-center text-white">
            <FaEnvelope className="icon" />
            <span className="email">niramayaforyou@gmail.com</span>
          </Col>
          <Col
            md={3}
            className="d-flex justify-content-center align-items-center text-white"
          >
            <FaClock className="icon" />
            <span className="hours">Mon - Sat: 09:00 am - 7:00 pm</span>
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <FaFacebook className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaYoutube className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaGooglePlus className="social-icon" />
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Link to="/admin">
              <Button variant="outline-danger" style={{backgroundColor: "#dc3545", color: "#fff"}}>
                Doctor Login <FaUserDoctor />
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Mobile Layout - 3 Rows (Visible only on small screens) */}
        <Row className="d-flex d-md-none text-center">
  {/* First Column: Email, Hours, Social Icons */}
  <Col xs={12} sm={8} className="d-flex flex-column justify-content-center align-items-center text-white">
    <div className="d-flex justify-content-center align-items-center mb-2">
      <FaEnvelope className="icon" />
      <span className="email ms-2">hello@medizo.com</span>
    </div>
    <div className="d-flex justify-content-center align-items-center mb-2">
      <FaClock className="icon" />
      <span className="hours ms-2">Mon - Sat: 8:00 am - 7:00 pm</span>
    </div>
    <div className="d-flex justify-content-center align-items-center">
      <FaFacebook className="social-icon mx-1" />
      <FaTwitter className="social-icon mx-1" />
      <FaYoutube className="social-icon mx-1" />
      <FaInstagram className="social-icon mx-1" />
      <FaGooglePlus className="social-icon mx-1" />
    </div>
  </Col>

  {/* Second Column: Doctor Login Button */}
  <Col xs={12} sm={4} className="d-flex justify-content-center align-items-center mt-3 mt-sm-0">
    <Link to="/admin">
      <Button variant="outline-danger" style={{ backgroundColor: "#dc3545", color: "#fff" }}>
        Doctor Login <FaUserDoctor />
      </Button>
    </Link>
  </Col>
</Row>

      </Container>
    </div>
  );
};

export default SubNavbar;
