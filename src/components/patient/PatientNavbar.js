

// import React, { useState, useEffect, useRef } from "react";
// import { Link, NavLink } from "react-router-dom";
// import Company from "../../images/logo.jpg";
// import "../../css/Navbar.css";
// import ProfileIcon from "../profile/ProfileIcon";
// import BaseUrl from "../../api/BaseUrl";

// const PatientNavbar = ({ isLoggedIn, onLogout }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setDropdownOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

  // const handleLogout = async () => {
  //   const refreshToken = localStorage.getItem("refresh");
  //   try {
  //     const response = await BaseUrl.post("/doctor/logout/", {
  //       refresh: refreshToken,
  //     });

  //     if (
  //       response.data &&
  //       response.data.success === "Logged out successfully."
  //     ) {
  //       window.location.href = "/";
  //       localStorage.clear();
  //       onLogout();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           <img src={Company} alt="Company Logo" height="40" />
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav mr-auto">
//             <li className="nav-item mr-3">
//               <NavLink
//                 className={({ isActive }) =>
//                   `nav-link ${isActive ? "active-link" : ""}`
//                 }
//                 to="/patient/home"
//               >
//                 <b>Home</b>
//               </NavLink>
//             </li>
//             <li className="nav-item mr-3">
//               <NavLink
//                 className={({ isActive }) =>
//                   `nav-link ${isActive ? "active-link" : ""}`
//                 }
//                 to="/patient/details"
//               >
//                 <b>My Details</b>
//               </NavLink>
//             </li>
//             <li className="nav-item mr-3">
//               <NavLink
//                 className={({ isActive }) =>
//                   `nav-link ${isActive ? "active-link" : ""}`
//                 }
//                 to="/patient/slots"
//               >
//                 <b>My Appointments</b>
//               </NavLink>
//             </li>
//             <li className="nav-item mr-3">
//               <NavLink
//                 className={({ isActive }) =>
//                   `nav-link ${isActive ? "active-link" : ""}`
//                 }
//                 to="/patient/bookappointment"
//               >
//                 <b>Book Appointments</b>
//               </NavLink>
//             </li>
//             <li className="nav-item mr-3">
//               <NavLink
//                 className={({ isActive }) =>
//                   `nav-link ${isActive ? "active-link" : ""}`
//                 }
//                 to="/patient/contactus"
//               >
//                 <b>Contact Us</b>
//               </NavLink>
//             </li>
//           </ul>
//           <ul className="navbar-nav ml-auto">
//             {isLoggedIn && (
//               <li
//                 className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}
//                 ref={dropdownRef}
//               >
//                 <button
//                   className="btn nav-link"
//                   id="navbarDropdown"
//                   onClick={toggleDropdown}
//                   aria-expanded={dropdownOpen}
//                   style={{ border: "none", background: "none", padding: 0 }}
//                 >
//                   <ProfileIcon />
//                 </button>
//                 <div
//                   className={`dropdown-menu dropdown-menu-right ${
//                     dropdownOpen ? "show" : ""
//                   }`}
//                   aria-labelledby="navbarDropdown"
//                 >
//                   <Link
//                     className="dropdown-item"
//                     to="/patient/details"
//                     onClick={toggleDropdown}
//                   >
//                     My Details
//                   </Link>
//                   <Link
//                     className="dropdown-item"
//                     to="/patient/slots"
//                     onClick={toggleDropdown}
//                   >
//                     My Appointments
//                   </Link>
//                   <Link
//                     className="dropdown-item"
//                     to="/patient/bookappointment"
//                     onClick={toggleDropdown}
//                   >
//                     Book Appointments
//                   </Link>
//                   <Link
//                     className="dropdown-item"
//                     to="/patient/transaction"
//                     onClick={toggleDropdown}
//                   >
//                     Patient Transaction
//                   </Link>
//                   <button
//                     className="dropdown-item"
//                     onClick={() => {
//                       toggleDropdown();
//                       handleLogout();
//                     }}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default PatientNavbar;







import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Company from "../../images/logo.jpg";
import "../../css/Navbar.css";
import ProfileIcon from "../profile/ProfileIcon";
import BaseUrl from "../../api/BaseUrl";

const PatientNavbar = ({ isLoggedIn, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh");
    try {
      const response = await BaseUrl.post("/doctor/logout/", {
        refresh: refreshToken,
      });

      if (
        response.data &&
        response.data.success === "Logged out successfully."
      ) {
        window.location.href = "/patient/login";
        localStorage.clear();
        onLogout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={Company} alt="Company Logo" height="40" />
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <div className="navbar-toggler-icon"></div>
        </button>

        {/* Collapsible Menu */}
        <div
          className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          {/* Desktop Navbar Links */}
          <ul className="navbar-nav mr-auto d-none d-lg-flex">
            <li className="nav-item mr-3">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/patient/home"
              >
                <b>Home</b>
              </NavLink>
            </li>
            <li className="nav-item mr-3">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/patient/details"
              >
                <b>My Details</b>
              </NavLink>
            </li>
            <li className="nav-item mr-3">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/patient/slots"
              >
                <b>My Appointments</b>
              </NavLink>
            </li>
            <li className="nav-item mr-3">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/patient/bookappointment"
              >
                <b>Book Appointments</b>
              </NavLink>
            </li>
            <li className="nav-item mr-3">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/patient/contactus"
              >
                <b>Contact Us</b>
              </NavLink>
            </li>
          </ul>

          {/* Mobile Navbar Links */}
          <ul className="navbar-nav d-lg-none text-center">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/patient/home"
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/patient/details"
                onClick={closeMobileMenu}
              >
                My Details
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/patient/slots"
                onClick={closeMobileMenu}
              >
                My Appointments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/patient/bookappointment"
                onClick={closeMobileMenu}
              >
                Book Appointments
              </NavLink>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="nav-link btn btn-link"
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                >
                  Logout
                </Link>
              </li>
            )}
          </ul>

          {/* Profile Icon for Desktop */}
          <ul className="navbar-nav ml-auto d-none d-lg-flex">
            {isLoggedIn && (
              <li
                className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}
                ref={dropdownRef}
              >
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
                  className={`dropdown-menu dropdown-menu-right ${
                    dropdownOpen ? "show" : ""
                  }`}
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
                    to="/patient/transaction"
                    onClick={toggleDropdown}
                  >
                    Patient Transaction
                  </Link>
                  <Link
                    className="dropdown-item"
                    onClick={() => {
                      toggleDropdown();
                      handleLogout();
                    }}
                  >
                    Logout
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
