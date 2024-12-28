import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Footer.css"; // Import Navbar.css for custom styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer text-white pt-4">
      <Container>
        <Row className="footer-row">
          <Col md={3}>
            <h4>Contact Us</h4>
            <ul className="list-unstyled">
              <li>Niramaya Homeopathy Clinic</li>
              <li>Address: 0230B, Bilandpur, Civil Lines 2, Gorakhpur, UP, India</li>
              <li>Email: niramayaforyou@gmail.com</li>
              <li>Phone: +919236185711</li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Quick Links</h4>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/conditions/tearmandconditions"
                  className="text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/conditions/refundpolicy" className="text-white">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/conditions/privacypolicy" className="text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Other Services</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/patient/bookappointment" className="text-white">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/patient/slots" className="text-white">
                  See Your Booked Appointment
                </Link>
              </li>
              <li>
                <Link to="/patient/transaction" className="text-white">
                  Track Your Transaction History
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/profile.php?id=61555739800256"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00aced", margin: "0 10px" }}
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00aced", margin: "0 10px" }}
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a
                href="https://www.instagram.com/digiquest_consultancy_services/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#bc2a8d", margin: "0 10px" }}
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a
                href="https://www.linkedin.com/company/digiquestconsultancy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bb6", margin: "0 10px" }}
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col md={14} className="text-center">
            <p>&copy; 2024 Niramaya Homeopathy Clinic. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
