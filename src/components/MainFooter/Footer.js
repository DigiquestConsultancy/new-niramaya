import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../css/Footer.css'; // Import Navbar.css for custom styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
 
const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-1">
      <Container>
        <Row className="footer-row">
          <Col md={3}>
            <h4>Contact Us</h4>
            <p>Niramaya Homeopathy Clinic</p>
            <p>Address: 0230B, Bilandpur, Civil Lines 2, Gorakhpur, UP, India</p>
            <p>Email: info@niramayahomeopathy.com</p>
            <p>Phone: +91-XXXXXXXXXX</p>
          </Col>
          <Col md={3}>
            <h4>Quick Links</h4>
            <ul className="list-unstyled">
              <li><a href="/about-us" className="text-white">About Us</a></li>
              <li><a href="/services" className="text-white">Services</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Other Services</h4>
            <ul className="list-unstyled">
              <li><a href="/book-appointment" className="text-white">Book Appointment</a></li>
              <li><a href="/reception" className="text-white">Reception Home Page</a></li>
              <li><a href="/upcoming-slots" className="text-white">Upcoming Slots</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61555739800256" target="_blank" rel="noopener noreferrer" style={{ color: '#3b5998', margin: '0 10px' }}>
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"  style={{ color: '#00aced', margin: '0 10px' }}>
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a href="https://www.instagram.com/digiquest_consultancy_services/" target="_blank" rel="noopener noreferrer" style={{ color: '#bc2a8d', margin: '0 10px' }}>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a href="https://www.linkedin.com/company/digiquestconsultancy/" target="_blank" rel="noopener noreferrer" style={{ color: '#007bb6', margin: '0 10px' }}>
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