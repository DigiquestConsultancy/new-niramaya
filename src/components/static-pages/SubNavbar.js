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
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center text-white"
          >
            <FaEnvelope className="icon" />
            <span className="email">hello@medizo.com</span>
          </Col>
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center text-white mt-2"
          >
            <FaClock className="icon" />
            <span className="hours">Mon - Sat: 8:00 am - 7:00 pm</span>
          </Col>
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center mt-2"
          >
            <FaFacebook className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaYoutube className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaGooglePlus className="social-icon" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SubNavbar;
