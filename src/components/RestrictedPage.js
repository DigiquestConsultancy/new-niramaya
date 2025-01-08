import React from "react";
import { Link } from "react-router-dom";
import "../css/RestrictedPage.css"; // Import the CSS file
import doct from "../images/doctorbg.jpg";
const RestrictedPage = () => {
  return (
    <div
      className="restricted-page"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${doct})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // zIndex: -1,
      }}
    >
      <div className="restricted-content">
        <h2 className="heading">Please log in first</h2>
        <p className="message">You need to be logged in to access this page.</p>
        <div className="login-links">
          <p>Choose your login type:</p>
          <Link className="login-button doctor-login" to="/doctor/login">
            Doctor Login
          </Link>
          <Link className="login-button patient-login" to="/patient/login">
            Patient Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestrictedPage;