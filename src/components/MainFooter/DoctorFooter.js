// import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import "../../css/Footer.css"; // Import Navbar.css for custom styles
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFacebook,
//   faTwitter,
//   faInstagram,
//   faLinkedin,
// } from "@fortawesome/free-brands-svg-icons";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="footer text-white pt-4">
//       <Container>
//         <Row className="footer-row">
//           <Col md={3}>
//             <h4>Contact Us</h4>
//             <ul className="list-unstyled">
//               <li>Niramaya Homeopathy Clinic</li>
//               <li>Address: 0230B, Bilandpur, Civil Lines 2, Gorakhpur, UP, India</li>
//               <li>Email: niramayaforyou@gmail.com</li>
//               <li>Phone: +919236185711</li>
//             </ul>
//           </Col>
//           <Col md={3}>
//             <h4>Quick Links</h4>
//             <ul className="list-unstyled">
//               <li>
//                 <Link
//                   to="/conditions/tearmandconditions"
//                   className="text-white"
//                 >
//                   Terms & Conditions
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/conditions/refundpolicy" className="text-white">
//                   Refund Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/conditions/privacypolicy" className="text-white">
//                   Privacy Policy
//                 </Link>
//               </li>
//             </ul>
//           </Col>
//           <Col md={3}>
//             <h4>Other Services</h4>
//             <ul className="list-unstyled">
//               <li>
//                 <Link to="/doctor/manageclinic" className="text-white">
//                   Manage Clinic
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/doctor/managereception" className="text-white">
//                   Manage Reception
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/doctor/bookappointment" className="text-white">
//                   Book Appointment
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/doctor/bookedappointment" className="text-white">
//                  Track your patients
//                 </Link>
//               </li>
//             </ul>
//           </Col>
//           <Col md={3}>
//             <h4>Follow Us</h4>
//             <div className="social-icons">
//               <a
//                 href="https://www.facebook.com/profile.php?id=61555739800256"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#00aced", margin: "0 10px" }}
//               >
//                 <FontAwesomeIcon icon={faFacebook} size="2x" />
//               </a>
//               <a
//                 href="https://www.twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#00aced", margin: "0 10px" }}
//               >
//                 <FontAwesomeIcon icon={faTwitter} size="2x" />
//               </a>
//               <a
//                 href="https://www.instagram.com/digiquest_consultancy_services/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#bc2a8d", margin: "0 10px" }}
//               >
//                 <FontAwesomeIcon icon={faInstagram} size="2x" />
//               </a>
//               <a
//                 href="https://www.linkedin.com/company/digiquestconsultancy/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#007bb6", margin: "0 10px" }}
//               >
//                 <FontAwesomeIcon icon={faLinkedin} size="2x" />
//               </a>
//             </div>
//           </Col>
//         </Row>
//         <Row className="mt-1">
//           <Col md={14} className="text-center">
//             <p>&copy; 2024 Niramaya Homeopathy Clinic. All rights reserved.</p>
//           </Col>
//         </Row>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;









import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const DoctorFooter = () => {
  const userType = localStorage.getItem("user_type");
  const getFooterContent = () => {
    switch (userType) {
      case "doctor":
        return (
          <>
            <li>
              <Link to="/doctor/manageclinic" className="text-white">
                Manage Clinic
              </Link>
            </li>
            <li>
              <Link to="/doctor/managereception" className="text-white">
                Manage Reception
              </Link>
            </li>
            <li>
              <Link to="/doctor/bookappointment" className="text-white">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/doctor/bookedappointment" className="text-white">
                Track your patients
              </Link>
            </li>
          </>
        );
      case "clinic":
        return (
          <>
            <li>
              <Link to="/clinic/createslot" className="text-white">
                Create Slots
              </Link>
            </li>
            <li>
              <Link to="/clinic/appointmentbook" className="text-white">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/clinic/bookedappointment" className="text-white">
                Track your patients
              </Link>
            </li>
          </>
        );
      case "reception":
        return (
          <>
            <li>
              <Link to="/reception/createslot" className="text-white">
                Create Slots
              </Link>
            </li>
            <li>
              <Link to="/reception/appointmentbook" className="text-white">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/reception/bookedappointment" className="text-white">
                Track your patients
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="footer text-white pt-4">
      <Container>
        <Row className="footer-row">
          <Col md={3}>
            <h4>Contact Us</h4>
            <ul className="list-unstyled">
              <li>Niramaya Homeopathy Clinic</li>
              <li>
                Address: 0230B, Bilandpur, Civil Lines 2, Gorakhpur, UP, India
              </li>
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
            <ul className="list-unstyled">{getFooterContent()}</ul>
          </Col>
          <Col md={3}>
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/digiquestconsultancy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00aced", margin: "0 10px" }}
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://www.youtube.com/@DCSHealthcare"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00aced", margin: "0 10px" }}
              >
                <FontAwesomeIcon icon={faYoutube} size="2x" />
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

export default DoctorFooter;
