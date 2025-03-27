import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../static-pages/images/logon.webp"; 
import "./Footer.css"; // CSS for styling

const Footer = () => {
  return (
    <footer className="custom-footer text-white py-5"> {/* Updated Class */}
      <Container>
        <Row>
          <Col md={6} className="d-flex flex-column justify-content-between">
            <div>
              <img
                src={logo} // replace with your logo image path
                alt="Logo"
                style={{ width: '100px' }}
              />
            </div>
            <div>
              <p>
                Dr. Dinesh Chandra is a dedicated pediatrician committed to supporting
                your child's health through every stage of their early life.
              </p>
            </div>
            <div>
              <a href="https://facebook.com" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://instagram.com" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://linkedin.com" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </Col>

          <Col md={3}>
            <h5>Useful Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about-us" className="text-white">About us</a></li>
              <li><a href="/treatment" className="text-white">Treatment</a></li>
              <li><a href="/our-doctors" className="text-white">Our Doctors</a></li>
              <li><a href="/faq" className="text-white">FAQ</a></li>
              <li><a href="/gallery" className="text-white">Gallery</a></li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Contact Us</h5>
            <p>
              <strong>Phone:</strong> +91 96963 89966
            </p>
            <p>
              <strong>Email:</strong> drchandrahospitalgkp@gmail.com
            </p>
            <p>
              <strong>Address:</strong> Near SBI Regional Office, Buddhi Vihar Commercial, Taramandal, Gorakhpur
            </p>
          </Col>
        </Row>

        <Row className="text-center mt-4">
          <Col>
            <p>&copy; Digiquist Consultancy Services Pvt. Ltd. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
