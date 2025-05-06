// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Company from "../../images/logo.jpeg";
// import ProfileIcon from "../profile/ProfileIcon";
// import { jwtDecode } from "jwt-decode";

// const DoctorNavbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
//   const [appointmentsDropdownOpen, setAppointmentsDropdownOpen] =
//     useState(false);
//   const [userType, setUserType] = useState(null);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isActive, setIsActive] = useState(false);
//   const [doctorId, setDoctorId] = useState(null);
//   const [navbarOpen, setNavbarOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       setDoctorId(decodedToken.doctor_id);
//       setIsVerified(decodedToken.is_verified);
//       setIsActive(decodedToken.is_active);
//     }

//     const userTypeFromStorage = localStorage.getItem("user_type");
//     setUserType(userTypeFromStorage);
//   }, []);

//   const toggleProfileDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const toggleHospitalDropdown = () => {
//     setHospitalDropdownOpen(!hospitalDropdownOpen);
//   };

//   const toggleAppointmentsDropdown = () => {
//     setAppointmentsDropdownOpen(!appointmentsDropdownOpen);
//   };

//   const areAllFieldsEnabled = isVerified && isActive;

//   const closeNavbar = () => {
//     setNavbarOpen(false);
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
//           aria-expanded={navbarOpen ? "true" : "false"}
//           aria-label="Toggle navigation"
//           onClick={() => setNavbarOpen(!navbarOpen)}
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div
//           className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}
//           id="navbarNav"
//         >
//           <ul className="navbar-nav mr-auto d-none d-lg-flex">
//             {userType === "doctor" && (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/home"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Home</strong>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/details"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Doctor Details</strong>
//                   </Link>
//                 </li>

//                 <li
//                   className={`nav-item dropdown ${hospitalDropdownOpen ? "show" : ""}`}
//                   onMouseEnter={() => setHospitalDropdownOpen(true)}
//                   onMouseLeave={() => setHospitalDropdownOpen(false)}
//                 >
//                   <button
//                     className={`btn nav-link dropdown-toggle ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                     id="hospitalDropdown"
//                     onClick={toggleHospitalDropdown}
//                     aria-expanded={hospitalDropdownOpen}
//                     style={{ color: "#f18dc" }}
//                     disabled={!areAllFieldsEnabled}
//                   >
//                     <strong>Hospital</strong>
//                   </button>
//                   <div
//                     className={`dropdown-menu ${hospitalDropdownOpen ? "show" : ""}`}
//                     aria-labelledby="hospitalDropdown"
//                     style={{ backgroundColor: "#fff" }}
//                   >
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/manageclinic"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         setHospitalDropdownOpen(false);
//                       }}
//                     >
//                       Manage Clinic
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/managereception"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         setHospitalDropdownOpen(false);
//                       }}
//                     >
//                       Manage Reception
//                     </Link>
//                   </div>
//                 </li>

//                 <li
//                   className={`nav-item dropdown ${appointmentsDropdownOpen ? "show" : ""}`}
//                   onMouseEnter={() => setAppointmentsDropdownOpen(true)}
//                   onMouseLeave={() => setAppointmentsDropdownOpen(false)}
//                 >
//                   <button
//                     className={`btn nav-link dropdown-toggle ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                     id="appointmentsDropdown"
//                     onClick={toggleAppointmentsDropdown}
//                     aria-expanded={appointmentsDropdownOpen}
//                     disabled={!areAllFieldsEnabled}
//                   >
//                     <strong>Appointments</strong>
//                   </button>
//                   <div
//                     className={`dropdown-menu ${appointmentsDropdownOpen ? "show" : ""}`}
//                     aria-labelledby="appointmentsDropdown"
//                     style={{ backgroundColor: "#fff" }}
//                   >
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/appointments"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         setAppointmentsDropdownOpen(false);
//                       }}
//                     >
//                       Appointment Slot
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/bookappointment"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         setAppointmentsDropdownOpen(false);
//                       }}
//                     >
//                       Book Appointment
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/bookedappointment"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         setAppointmentsDropdownOpen(false);
//                       }}
//                     >
//                       Booked Appointment
//                     </Link>
//                   </div>
//                 </li>
//               </>
//             )}
//           </ul>

//           <ul className="navbar-nav mr-auto d-none d-lg-flex">
//             {userType === "clinic" && (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/home"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Home</strong>
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/createslot"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Appointment Slots</strong>
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/details"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Clinic Details</strong>
//                   </Link>
//                 </li>
//                 <li
//                   className={`nav-item dropdown ${appointmentsDropdownOpen ? "show" : ""}`}
//                   onMouseEnter={() => setAppointmentsDropdownOpen(true)}
//                   onMouseLeave={() => setAppointmentsDropdownOpen(false)}
//                 >
//                   <button
//                     className="btn nav-link dropdown-toggle"
//                     id="appointmentsDropdown"
//                     onClick={toggleAppointmentsDropdown}
//                     aria-expanded={appointmentsDropdownOpen}
//                   >
//                     <strong>Appointments</strong>
//                   </button>
//                   <div
//                     className={`dropdown-menu ${appointmentsDropdownOpen ? "show" : ""}`}
//                     aria-labelledby="appointmentsDropdown"
//                   >
//                     <Link
//                       className="dropdown-item"
//                       to="/clinic/appointmentbook"
//                       onClick={() => setAppointmentsDropdownOpen(false)}
//                     >
//                       Book Appointment
//                     </Link>
//                     <Link
//                       className="dropdown-item"
//                       to="/clinic/bookedappointment"
//                       onClick={() => setAppointmentsDropdownOpen(false)}
//                     >
//                       Booked Appointment
//                     </Link>
//                   </div>
//                 </li>
//               </>
//             )}
//           </ul>
//           <ul className="navbar-nav mr-auto d-none d-lg-flex">
//             {userType === "reception" && (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/home"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Home</strong>
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/createslot"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Appointment Slots</strong>
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/details"
//                     style={{ color: "#f18dc" }}
//                   >
//                     <strong>Reception Details</strong>
//                   </Link>
//                 </li>
//                 <li
//                   className={`nav-item dropdown ${appointmentsDropdownOpen ? "show" : ""}`}
//                   onMouseEnter={() => setAppointmentsDropdownOpen(true)}
//                   onMouseLeave={() => setAppointmentsDropdownOpen(false)}
//                 >
//                   <button
//                     className="btn nav-link dropdown-toggle"
//                     id="appointmentsDropdown"
//                     onClick={toggleAppointmentsDropdown}
//                     aria-expanded={appointmentsDropdownOpen}
//                   >
//                     <strong>Appointments</strong>
//                   </button>
//                   <div
//                     className={`dropdown-menu ${appointmentsDropdownOpen ? "show" : ""}`}
//                     aria-labelledby="appointmentsDropdown"
//                   >
//                     <Link
//                       className="dropdown-item"
//                       to="/reception/appointmentbook"
//                       onClick={() => setAppointmentsDropdownOpen(false)}
//                     >
//                       Book Appointment
//                     </Link>
//                     <Link
//                       className="dropdown-item"
//                       to="/reception/bookedappointment"
//                       onClick={() => setAppointmentsDropdownOpen(false)}
//                     >
//                       Booked Appointment
//                     </Link>
//                   </div>
//                 </li>
//               </>
//             )}
//           </ul>

//           <ul className="navbar-nav ml-auto d-none d-lg-flex">
//             <li className="nav-item">
//               <button className="btn nav-link" onClick={toggleProfileDropdown}>
//                 <ProfileIcon />
//               </button>
//               <div
//                 className={`dropdown-menu dropdown-menu-right ${dropdownOpen ? "show" : ""}`}
//                 aria-labelledby="profileDropdown"
//                 style={{ backgroundColor: "#fff" }}
//               >
//                 {userType === "doctor" && (
//                   <>
//                     <Link
//                       className="dropdown-item"
//                       to="/doctor/details"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Doctor Details
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/appointments"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         toggleProfileDropdown();
//                       }}
//                     >
//                       Appointment Slot
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/manageclinic"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         toggleProfileDropdown();
//                       }}
//                     >
//                       Manage Clinic
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/managereception"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         toggleProfileDropdown();
//                       }}
//                     >
//                       Manage Reception
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/bookedappointment"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         toggleProfileDropdown();
//                       }}
//                     >
//                       Booked Appointment
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/bookappointment"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         toggleProfileDropdown();
//                       }}
//                     >
//                       Book Appointment
//                     </Link>
//                     <Link
//                       className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
//                       to="/doctor/paymenthistory"
//                       onClick={(e) => {
//                         if (!areAllFieldsEnabled) e.preventDefault();
//                         toggleProfileDropdown();
//                       }}
//                     >
//                       Payment History
//                     </Link>
//                   </>
//                 )}

//                 {userType === "clinic" && (
//                   <>
//                     <Link
//                       className="dropdown-item"
//                       to="/clinic/details"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Clinic Details
//                     </Link>
//                     <Link
//                       className={`dropdown-item`}
//                       to="/clinic/createslot"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Create Slot
//                     </Link>
//                     <Link
//                       className={`dropdown-item`}
//                       to="/clinic/appointmentbook"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Book Appointment
//                     </Link>
//                     <Link
//                       className={`dropdown-item`}
//                       to="/clinic/bookedappointment"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Booked Appointment
//                     </Link>
//                   </>
//                 )}

//                 {userType === "reception" && (
//                   <>
//                     <Link
//                       className="dropdown-item"
//                       to="/reception/details"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Reception Details
//                     </Link>
//                     <Link
//                       className={`dropdown-item`}
//                       to="/reception/createslot"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Create Slot
//                     </Link>
//                     <Link
//                       className={`dropdown-item`}
//                       to="/reception/appointmentbook"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Book Appointment
//                     </Link>
//                     <Link
//                       className={`dropdown-item`}
//                       to="/reception/bookedappointment"
//                       onClick={toggleProfileDropdown}
//                     >
//                       Booked Appointment
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </li>
//           </ul>

//           <ul className="navbar-nav d-lg-none">
//             {userType === "doctor" && (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/home"
//                     onClick={closeNavbar}
//                   >
//                     Home
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/details"
//                     onClick={closeNavbar}
//                   >
//                     Doctor Details
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/appointments"
//                     onClick={closeNavbar}
//                   >
//                     Appointment Slot
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/manageclinic"
//                     onClick={closeNavbar}
//                   >
//                     Manage Clinic
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/managereception"
//                     onClick={closeNavbar}
//                   >
//                     Manage Reception
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/bookedappointment"
//                     onClick={closeNavbar}
//                   >
//                     Booked Appointment
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/doctor/bookappointment"
//                     onClick={closeNavbar}
//                   >
//                     Book Appointment
//                   </Link>
//                 </li>
//               </>
//             )}

//             {userType === "clinic" && (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/details"
//                     onClick={closeNavbar}
//                   >
//                     Clinic Details
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/createslot"
//                     onClick={closeNavbar}
//                   >
//                     Create Slot
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/appointmentbook"
//                     onClick={closeNavbar}
//                   >
//                     Book Appointment
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/clinic/bookedappointment"
//                     onClick={closeNavbar}
//                   >
//                     Booked Appointment
//                   </Link>
//                 </li>
//               </>
//             )}

//             {userType === "reception" && (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/details"
//                     onClick={closeNavbar}
//                   >
//                     Reception Details
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/createslot"
//                     onClick={closeNavbar}
//                   >
//                     Create Slot
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/appointmentbook"
//                     onClick={closeNavbar}
//                   >
//                     Book Appointment
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link
//                     className="nav-link"
//                     to="/reception/bookedappointment"
//                     onClick={closeNavbar}
//                   >
//                     Booked Appointment
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default DoctorNavbar;

import React, { useState, useEffect, useRef } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { ImProfile } from "react-icons/im";
import { FaCheckToSlot } from "react-icons/fa6";
import { FaClinicMedical, FaHome } from "react-icons/fa";
import { MdFileDownloadDone } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { FcMoneyTransfer } from "react-icons/fc";
import { MdOutlineLogout } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import ProfileIcon from "../profile/ProfileIcon";
import { jwtDecode } from "jwt-decode";
import BaseUrl from "../../api/BaseUrl";

const DoctorNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [clinicPhoto, setClinicPhoto] = useState(null);
  const [clinicName, setClinicName] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [mobileNumber] = useState(null);
  const profileDropdownRef = useRef(null);

  const fetchClinicDetails = async () => {
    try {
      const response = await BaseUrl.get("/doctor/opddays/", {
        params: {
          doctor_id: doctorId,
          mobile_number: mobileNumber,
        },
      });
      if (response.status === 200 && response.data.length > 0) {
        const data = response.data[0];
        setClinicName(data.clinic_name);
        if (data.doc_file) {
          const fullImageUrl = `${BaseUrl.defaults.baseURL}${data.doc_file}`;
          setClinicPhoto(fullImageUrl);
        } else {
          setClinicPhoto("");
        }
      } else {
        setClinicName("");
        setClinicPhoto("");
      }
    } catch (error) {
      setClinicName("");
      setClinicPhoto("");
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      const response = await BaseUrl.post("/doctor/logout/", {
        refresh: refreshToken,
      });
      if (response.status === 200 || response.status === 201) {
        try {
          localStorage.clear();
        } catch (storageError) {
          console.error("Error clearing localStorage:", storageError);
        }
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsVerified(decodedToken.is_verified);
      setIsActive(decodedToken.is_active);
      setDoctorId(decodedToken.doctor_id);
    }
    fetchClinicDetails();
    const userTypeFromStorage = localStorage.getItem("user_type");
    setUserType(userTypeFromStorage);
  }, [doctorId]);

  const toggleProfileDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeProfileDropdown = () => {
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      closeProfileDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const areAllFieldsEnabled = isVerified && isActive;

  return (
    <nav
      className="navbar sticky-top"
      style={{
        backgroundColor: "#FFF",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "0.75rem 1rem",
      }}
    >
      <div
        className="container-fluid"
        style={{
          // maxWidth: "1400px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "1rem",
        }}
      >
        {/* Logo and Clinic Name */}
        <div className="d-flex align-items-center">
          {userType === "doctor" && clinicName && clinicPhoto ? (
            <header className="d-flex align-items-center">
              <Col xs="auto">
                <img
                  src={clinicPhoto}
                  style={{
                    height: "2.5rem",
                    width: "2.5rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                    transition: "transform 0.2s ease",
                  }}
                  alt="Clinic Logo"
                  className="clinic-logo"
                />
              </Col>
              <Col xs="auto">
                <h3
                  style={{
                    color: "#0F518F",
                    fontWeight: "700",
                    margin: 0,
                    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                  }}
                >
                  {clinicName}
                </h3>
              </Col>
            </header>
          ) : (
            <h3
              style={{
                color: "#0F518F",
                fontWeight: "600",
                margin: 0,
                fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
              }}
            >
              Clinic Dashboard
            </h3>
          )}
        </div>

        {/* Profile and Notification Icons */}
        <ul className="navbar-nav d-flex flex-row align-items-center">
          <li className="nav-item position-relative">
            <span
              role="button"
              aria-label="Notifications"
              tabIndex={0}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease, color 0.2s ease",
              }}
              className="icon-hover"
            >
              <IoNotifications
                style={{
                  height: "1.8rem",
                  width: "1.8rem",
                  color: "#333",
                }}
              />
            </span>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.6rem", display: "none" }}
            >
              0
            </span>
          </li>
          <li className="nav-item" ref={profileDropdownRef}>
            <span
              role="button"
              aria-label="Profile"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={toggleProfileDropdown}
              onKeyDown={(e) => e.key === "Enter" && toggleProfileDropdown()}
              tabIndex={0}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              className="icon-hover"
            >
              <ProfileIcon size="1.8rem" />
            </span>
            <div
              className={`dropdown-menu dropdown-menu-right ${
                dropdownOpen ? "show" : ""
              }`}
              aria-labelledby="profileDropdown"
              style={{
                backgroundColor: "#FFF",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                minWidth: "220px",
                marginTop: "0.5rem",
                zIndex: 9999, // Highest z-index to overlap everything
                position: "absolute",
                right: 10,
              }}
            >
              {userType === "doctor" && (
                <>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/doctor/home"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaHome className="me-2" /> Home
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/doctor/details"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <ImProfile className="me-2" /> Doctor Details
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/appointments"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaCheckToSlot className="me-2" /> Appointment Slot
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/manageclinic"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaClinicMedical className="me-2" /> Manage Clinic
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/managereception"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaClinicMedical className="me-2" /> Manage Reception
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/bookedappointment"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <MdFileDownloadDone className="me-2" /> Booked Appointment
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/bookappointment"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <GiNotebook className="me-2" /> Book Appointment
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/paymenthistory"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FcMoneyTransfer className="me-2" /> Payment History
                  </Link>
                  <Link
                    className={`dropdown-item d-flex align-items-center ${
                      !areAllFieldsEnabled ? "disabled" : ""
                    }`}
                    to="/doctor/managetemplates"
                    onClick={(e) => {
                      if (!areAllFieldsEnabled) e.preventDefault();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <IoMdSettings className="me-2" /> Manage Templates
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="#"
                    onClick={() => {
                      handleLogout();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <MdOutlineLogout className="me-2" /> Logout
                  </Link>
                </>
              )}
              {userType === "clinic" && (
                <>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/clinic/home"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaHome className="me-2" /> Home
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/clinic/details"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <ImProfile className="me-2" /> Clinic Details
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/clinic/createslot"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaCheckToSlot className="me-2" /> Create Slot
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/clinic/appointmentbook"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <GiNotebook className="me-2" /> Book Appointment
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/clinic/bookedappointment"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <MdFileDownloadDone className="me-2" /> Booked Appointment
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="#"
                    onClick={() => {
                      handleLogout();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <MdOutlineLogout className="me-2" /> Logout
                  </Link>
                </>
              )}
              {userType === "reception" && (
                <>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/reception/home"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaHome className="me-2" /> Home
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/reception/details"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <ImProfile className="me-2" /> Reception Details
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/reception/createslot"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaCheckToSlot className="me-2" /> Create Slot
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/reception/appointmentbook"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <GiNotebook className="me-2" /> Book Appointment
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/reception/bookedappointment"
                    onClick={toggleProfileDropdown}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <MdFileDownloadDone className="me-2" /> Booked Appointment
                  </Link>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="#"
                    onClick={() => {
                      handleLogout();
                      toggleProfileDropdown();
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <MdOutlineLogout className="me-2" /> Logout
                  </Link>
                </>
              )}
            </div>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .clinic-logo:hover {
          transform: scale(1.1);
        }
        .icon-hover:hover {
          transform: scale(1.1);
          color: #0f518f !important;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #0f518f;
        }
        .dropdown-item.disabled {
          color: #6c757d;
          pointer-events: none;
          background-color: transparent;
        }
        .navbar {
          z-index: 1000; // Ensure navbar is above most content
        }
        .dropdown-menu {
          z-index: 9999 !important; // Highest z-index for dropdown
        }
        @media (max-width: 576px) {
          .dropdown-menu {
            width: calc(100% - 2rem);
            min-width: 100%;
            right: 1rem;
            left: 1rem;
            margin: 0 auto;
            top: calc(100% + 0.5rem);
          }
          .navbar-nav {
            flex-direction: row !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default DoctorNavbar;
