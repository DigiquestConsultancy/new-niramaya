import React, { useState } from "react";
import { Link } from "react-router-dom";
import Company from "../../images/logo.jpeg";
import "../../css/Navbar.css"; // Import Navbar.css for custom styles
import ProfileIcon from "../profile/ProfileIcon"; // Import ProfileIcon

const PatientNavbar = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={Company} alt="Company Logo" height="40" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item mr-3">
              <Link
                className="nav-link"
                to="/patient/home"
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  color: "#f18dc",
                }}
              >
                <b>Home</b>
              </Link>
            </li>
            <li className="nav-item mr-3">
              <Link
                className="nav-link"
                to="/patient/details"
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  color: "#f18dc",
                }}
              >
                <b>My Details</b>
              </Link>
            </li>
            <li className="nav-item mr-3">
              <Link
                className="nav-link"
                to="/patient/slots"
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  color: "#f18dc",
                }}
              >
                <b>My Appointments</b>
              </Link>
            </li>
            <li className="nav-item mr-3">
              <Link
                className="nav-link"
                to="/patient/bookappointment"
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  color: "#f18dc",
                }}
              >
                <b>Book Appointments</b>
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {isLoggedIn && (
              <li className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}>
                <button
                  className="btn nav-link"
                  id="navbarDropdown"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  style={{ border: "none", background: "none", padding: 0 }}
                >
                  <ProfileIcon />
                </button>
                <div
                  className={`dropdown-menu dropdown-menu-right ${dropdownOpen ? "show" : ""}`}
                  aria-labelledby="navbarDropdown"
                >
                  <Link
                    className="dropdown-item"
                    to="/patient/details"
                    onClick={toggleDropdown}
                  >
                    My Details
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/patient/slots"
                    onClick={toggleDropdown}
                  >
                    My Appointments
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/patient/bookappointment"
                    onClick={toggleDropdown}
                  >
                    Book Appointments
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/patient/medicalrecords"
                    onClick={toggleDropdown}
                  >
                    Medical Record
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/patient/transaction"
                    onClick={toggleDropdown}
                  >
                    Tansaction History
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PatientNavbar;
