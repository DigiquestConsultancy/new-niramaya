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















import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Company from "../../images/logo.jpg";
import ProfileIcon from "../profile/ProfileIcon";
import { jwtDecode } from "jwt-decode";
import BaseUrl from "../../api/BaseUrl";

const DoctorNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
  const [appointmentsDropdownOpen, setAppointmentsDropdownOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  // const handleLogout = async () => {
  //   const refreshToken = localStorage.getItem("refresh");
  //   try {
  //     const response = await BaseUrl.post("/doctor/logout/", {
  //       refresh: refreshToken,
  //     });
  
  //     if (response.data && response.data.success === "Logged out successfully.") {
  //       window.location.href = "/";
  //       localStorage.clear(); 
  //       onLogout(); 
  //     }
  //   } catch (error) {
  //   }
  // };

  // const handleLogout = async () => {
  //   const refreshToken = localStorage.getItem("refresh");
  //   try {
  //     const response = await BaseUrl.post("/doctor/logout/", {
  //       refresh: refreshToken,
  //     });
  //     if (response.status === 200 || response.status === 201 && response.data.success === "Logged out successfully.") {
  //       window.location.href = "/";
  //       localStorage.clear(); 
  //       onLogout(); 
  //     }
  //   } catch (error) {
  //   }
  // };

  const handleLogout = async() => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      const response = await BaseUrl.post("/doctor/logout/", { refresh: refreshToken });
  
      if (response.status === 200 || response.status === 201) {
          try {
            localStorage.clear();
          } catch (storageError) {
            console.error("Error clearing localStorage:", storageError);
          }
          window.location.href = "/";
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
    }

    const userTypeFromStorage = localStorage.getItem("user_type");
    setUserType(userTypeFromStorage);
  }, []);

  const toggleProfileDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleHospitalDropdown = () => {
    setHospitalDropdownOpen(!hospitalDropdownOpen);
  };

  const toggleAppointmentsDropdown = () => {
    setAppointmentsDropdownOpen(!appointmentsDropdownOpen);
  };

  const areAllFieldsEnabled = isVerified && isActive;

  const closeNavbar = () => {
    setNavbarOpen(false);
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
          aria-expanded={navbarOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mr-auto d-none d-lg-flex">
            {userType === "doctor" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/home"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Home</strong>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/details"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Doctor Details</strong>
                  </Link>
                </li>

                <li
                  className={`nav-item dropdown ${hospitalDropdownOpen ? "show" : ""}`}
                  onMouseEnter={() => setHospitalDropdownOpen(true)}
                  onMouseLeave={() => setHospitalDropdownOpen(false)}
                >
                  <button
                    className={`btn nav-link dropdown-toggle ${!areAllFieldsEnabled ? "disabled" : ""}`}
                    id="hospitalDropdown"
                    onClick={toggleHospitalDropdown}
                    aria-expanded={hospitalDropdownOpen}
                    style={{ color: "#f18dc" }}
                    disabled={!areAllFieldsEnabled}
                  >
                    <strong>Hospital</strong>
                  </button>
                  <div
                    className={`dropdown-menu ${hospitalDropdownOpen ? "show" : ""}`}
                    aria-labelledby="hospitalDropdown"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/manageclinic"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        setHospitalDropdownOpen(false);
                      }}
                    >
                      Manage Clinic
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/managereception"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        setHospitalDropdownOpen(false);
                      }}
                    >
                      Manage Reception
                    </Link>
                  </div>
                </li>

                <li
                  className={`nav-item dropdown ${appointmentsDropdownOpen ? "show" : ""}`}
                  onMouseEnter={() => setAppointmentsDropdownOpen(true)}
                  onMouseLeave={() => setAppointmentsDropdownOpen(false)}
                >
                  <button
                    className={`btn nav-link dropdown-toggle ${!areAllFieldsEnabled ? "disabled" : ""}`}
                    id="appointmentsDropdown"
                    onClick={toggleAppointmentsDropdown}
                    aria-expanded={appointmentsDropdownOpen}
                    disabled={!areAllFieldsEnabled}
                  >
                    <strong>Appointments</strong>
                  </button>
                  <div
                    className={`dropdown-menu ${appointmentsDropdownOpen ? "show" : ""}`}
                    aria-labelledby="appointmentsDropdown"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/appointments"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        setAppointmentsDropdownOpen(false);
                      }}
                    >
                      Appointment Slot
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/bookappointment"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        setAppointmentsDropdownOpen(false);
                      }}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/bookedappointment"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        setAppointmentsDropdownOpen(false);
                      }}
                    >
                      Booked Appointment
                    </Link>
                  </div>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav mr-auto d-none d-lg-flex">
            {userType === "clinic" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/home"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Home</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/createslot"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Appointment Slots</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/details"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Clinic Details</strong>
                  </Link>
                </li>
                <li
                  className={`nav-item dropdown ${appointmentsDropdownOpen ? "show" : ""}`}
                  onMouseEnter={() => setAppointmentsDropdownOpen(true)}
                  onMouseLeave={() => setAppointmentsDropdownOpen(false)}
                >
                  <button
                    className="btn nav-link dropdown-toggle"
                    id="appointmentsDropdown"
                    onClick={toggleAppointmentsDropdown}
                    aria-expanded={appointmentsDropdownOpen}
                  >
                    <strong>Appointments</strong>
                  </button>
                  <div
                    className={`dropdown-menu ${appointmentsDropdownOpen ? "show" : ""}`}
                    aria-labelledby="appointmentsDropdown"
                  >
                    <Link
                      className="dropdown-item"
                      to="/clinic/appointmentbook"
                      onClick={() => setAppointmentsDropdownOpen(false)}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="/clinic/bookedappointment"
                      onClick={() => setAppointmentsDropdownOpen(false)}
                    >
                      Booked Appointment
                    </Link>
                  </div>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav mr-auto d-none d-lg-flex">
            {userType === "reception" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/home"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Home</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/createslot"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Appointment Slots</strong>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/details"
                    style={{ color: "#f18dc" }}
                  >
                    <strong>Reception Details</strong>
                  </Link>
                </li>
                <li
                  className={`nav-item dropdown ${appointmentsDropdownOpen ? "show" : ""}`}
                  onMouseEnter={() => setAppointmentsDropdownOpen(true)}
                  onMouseLeave={() => setAppointmentsDropdownOpen(false)}
                >
                  <button
                    className="btn nav-link dropdown-toggle"
                    id="appointmentsDropdown"
                    onClick={toggleAppointmentsDropdown}
                    aria-expanded={appointmentsDropdownOpen}
                  >
                    <strong>Appointments</strong>
                  </button>
                  <div
                    className={`dropdown-menu ${appointmentsDropdownOpen ? "show" : ""}`}
                    aria-labelledby="appointmentsDropdown"
                  >
                    <Link
                      className="dropdown-item"
                      to="/reception/appointmentbook"
                      onClick={() => setAppointmentsDropdownOpen(false)}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="/reception/bookedappointment"
                      onClick={() => setAppointmentsDropdownOpen(false)}
                    >
                      Booked Appointment
                    </Link>
                  </div>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ml-auto d-none d-lg-flex">
            <li className="nav-item">
              <button className="btn nav-link" onClick={toggleProfileDropdown}>
                <ProfileIcon />
              </button>
              <div
                className={`dropdown-menu dropdown-menu-right ${dropdownOpen ? "show" : ""}`}
                aria-labelledby="profileDropdown"
                style={{ backgroundColor: "#fff" }}
              >
                {userType === "doctor" && (
                  <>
                    <Link
                      className="dropdown-item"
                      to="/doctor/details"
                      onClick={toggleProfileDropdown}
                    >
                      Doctor Details
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/appointments"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        toggleProfileDropdown();
                      }}
                    >
                      Appointment Slot
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/manageclinic"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        toggleProfileDropdown();
                      }}
                    >
                      Manage Clinic
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/managereception"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        toggleProfileDropdown();
                      }}
                    >
                      Manage Reception
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/bookedappointment"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        toggleProfileDropdown();
                      }}
                    >
                      Booked Appointment
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/bookappointment"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        toggleProfileDropdown();
                      }}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      to="/doctor/paymenthistory"
                      onClick={(e) => {
                        if (!areAllFieldsEnabled) e.preventDefault();
                        toggleProfileDropdown();
                      }}
                    >
                      Payment History
                    </Link>
                    <Link
                      className={`dropdown-item ${!areAllFieldsEnabled ? "disabled" : ""}`}
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </>
                )}

                {userType === "clinic" && (
                  <>
                    <Link
                      className="dropdown-item"
                      to="/clinic/details"
                      onClick={toggleProfileDropdown}
                    >
                      Clinic Details
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      to="/clinic/createslot"
                      onClick={toggleProfileDropdown}
                    >
                      Create Slot
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      to="/clinic/appointmentbook"
                      onClick={toggleProfileDropdown}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      to="/clinic/bookedappointment"
                      onClick={toggleProfileDropdown}
                    >
                      Booked Appointment
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </>
                )}

                {userType === "reception" && (
                  <>
                    <Link
                      className="dropdown-item"
                      to="/reception/details"
                      onClick={toggleProfileDropdown}
                    >
                      Reception Details
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      to="/reception/createslot"
                      onClick={toggleProfileDropdown}
                    >
                      Create Slot
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      to="/reception/appointmentbook"
                      onClick={toggleProfileDropdown}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      to="/reception/bookedappointment"
                      onClick={toggleProfileDropdown}
                    >
                      Booked Appointment
                    </Link>
                    <Link
                      className={`dropdown-item`}
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </>
                )}
              </div>
            </li>
          </ul>

          <ul className="navbar-nav d-lg-none">
            {userType === "doctor" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/home"
                    onClick={closeNavbar}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/details"
                    onClick={closeNavbar}
                  >
                    Doctor Details
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/appointments"
                    onClick={closeNavbar}
                  >
                    Appointment Slot
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/manageclinic"
                    onClick={closeNavbar}
                  >
                    Manage Clinic
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/managereception"
                    onClick={closeNavbar}
                  >
                    Manage Reception
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/bookedappointment"
                    onClick={closeNavbar}
                  >
                    Booked Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor/bookappointment"
                    onClick={closeNavbar}
                  >
                    Book Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}

            {userType === "clinic" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/details"
                    onClick={closeNavbar}
                  >
                    Clinic Details
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/createslot"
                    onClick={closeNavbar}
                  >
                    Create Slot
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/appointmentbook"
                    onClick={closeNavbar}
                  >
                    Book Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/clinic/bookedappointment"
                    onClick={closeNavbar}
                  >
                    Booked Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}

            {userType === "reception" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/details"
                    onClick={closeNavbar}
                  >
                    Reception Details
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/createslot"
                    onClick={closeNavbar}
                  >
                    Create Slot
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/appointmentbook"
                    onClick={closeNavbar}
                  >
                    Book Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/reception/bookedappointment"
                    onClick={closeNavbar}
                  >
                    Booked Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
