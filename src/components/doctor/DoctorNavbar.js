// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Company from '../../images/logo.jpeg';
// import '../../css/Navbar.css';
// import ProfileIcon from '../profile/ProfileIcon';
 
// const DoctorNavbar = () => {
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
//     const [appointmentsDropdownOpen, setAppointmentsDropdownOpen] = useState(false);
//     const [userType, setUserType] = useState(null);
 
//     useEffect(() => {
//         const userTypeFromStorage = localStorage.getItem('user_type');
//         setUserType(userTypeFromStorage);
//     }, []);
 
//     const toggleProfileDropdown = () => {
//         setDropdownOpen(!dropdownOpen);
//     };
 
//     const toggleHospitalDropdown = () => {
//         setHospitalDropdownOpen(!hospitalDropdownOpen);
//     };
 
//     const toggleAppointmentsDropdown = () => {
//         setAppointmentsDropdownOpen(!appointmentsDropdownOpen);
//     };
 
//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//             <div className="container-fluid">
//                 <Link className="navbar-brand" to="/">
//                     <img src={Company} alt="Company Logo" height="40" />
//                 </Link>
 
//                 <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                     <span className="navbar-toggler-icon"></span>
//                 </button>
//                 <div className="collapse navbar-collapse" id="navbarNav">
//                     <ul className="navbar-nav mr-auto">
//                         {userType === 'doctor' && (
//                             <>

//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/doctor/home" style={{ color: '#f18dc' }}>
//                                         <strong>Home</strong>
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/doctor/details" style={{ color: '#f18dc' }}>
//                                         <strong>Doctor Details</strong>
//                                     </Link>
//                                 </li>
//                                 <li className={`nav-item dropdown ${hospitalDropdownOpen ? 'show' : ''}`}
//                                     onMouseEnter={() => setHospitalDropdownOpen(true)}
//                                     onMouseLeave={() => setHospitalDropdownOpen(false)}>
//                                     <button
//                                         className="btn nav-link dropdown-toggle"
//                                         id="hospitalDropdown"
//                                         onClick={toggleHospitalDropdown}
//                                         aria-expanded={hospitalDropdownOpen}
//                                         style={{ color: '#f18dc' }}
//                                     >
//                                         <strong>Hospital</strong>
//                                     </button>
//                                     <div className={`dropdown-menu ${hospitalDropdownOpen ? 'show' : ''}`} aria-labelledby="hospitalDropdown">
//                                         <Link className="dropdown-item" to="/doctor/manageclinic" onClick={() => setHospitalDropdownOpen(false)}>Manage Clinic</Link>
//                                         <Link className="dropdown-item" to="/doctor/managereception" onClick={() => setHospitalDropdownOpen(false)}>Manage Reception</Link>
//                                     </div>
//                                 </li>
//                                 <li className={`nav-item dropdown ${appointmentsDropdownOpen ? 'show' : ''}`}
//                                     onMouseEnter={() => setAppointmentsDropdownOpen(true)}
//                                     onMouseLeave={() => setAppointmentsDropdownOpen(false)}>
//                                     <button
//                                         className="btn nav-link dropdown-toggle"
//                                         id="appointmentsDropdown"
//                                         onClick={toggleAppointmentsDropdown}
//                                         aria-expanded={appointmentsDropdownOpen}
//                                     >
//                                         <strong>Appointments</strong>
//                                     </button>
//                                     <div className={`dropdown-menu ${appointmentsDropdownOpen ? 'show' : ''}`} aria-labelledby="appointmentsDropdown">
//                                         <Link className="dropdown-item" to="/doctor/appointments" onClick={() => setAppointmentsDropdownOpen(false)}>Appointment Slot</Link>
//                                         <Link className="dropdown-item" to="/doctor/bookappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Book Appointment</Link>
//                                         <Link className="dropdown-item" to="/doctor/bookedappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Booked Appointment</Link>
//                                     </div>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                     <ul className="navbar-nav mr-auto">
//                         {userType === 'clinic' && (
//                             <>

//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/clinic/home" style={{ color: '#f18dc' }}>
//                                         <strong>Home</strong>
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/clinic/createslot" style={{ color: '#f18dc' }}>
//                                         <strong>Appointment Slots</strong>
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/clinic/details" style={{ color: '#f18dc' }}>
//                                         <strong>Clinic Details</strong>
//                                     </Link>
//                                 </li>
//                                 <li className={`nav-item dropdown ${appointmentsDropdownOpen ? 'show' : ''}`}
//                                     onMouseEnter={() => setAppointmentsDropdownOpen(true)}
//                                     onMouseLeave={() => setAppointmentsDropdownOpen(false)}>
//                                     <button
//                                         className="btn nav-link dropdown-toggle"
//                                         id="appointmentsDropdown"
//                                         onClick={toggleAppointmentsDropdown}
//                                         aria-expanded={appointmentsDropdownOpen}
//                                     >
//                                         <strong>Appointments</strong>
//                                     </button>
//                                     <div className={`dropdown-menu ${appointmentsDropdownOpen ? 'show' : ''}`} aria-labelledby="appointmentsDropdown">
//                                         <Link className="dropdown-item" to="/clinic/appointmentbook" onClick={() => setAppointmentsDropdownOpen(false)}>Book Appointment</Link>
//                                         <Link className="dropdown-item" to="/clinic/bookedappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Booked Appointment</Link>
//                                     </div>
//                                 </li>
 
//                             </>
//                         )}
//                     </ul>
//                     <ul className="navbar-nav mr-auto">
//                         {userType === 'reception' && (
//                             <>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/reception/home" style={{ color: '#f18dc' }}>
//                                         <strong>Home</strong>
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/reception/createslot" style={{ color: '#f18dc' }}>
//                                         <strong>Appointment Slots</strong>
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/reception/details" style={{ color: '#f18dc' }}>
//                                         <strong>Reception Details</strong>
//                                     </Link>
//                                 </li>
//                                 <li className={`nav-item dropdown ${appointmentsDropdownOpen ? 'show' : ''}`}
//                                     onMouseEnter={() => setAppointmentsDropdownOpen(true)}
//                                     onMouseLeave={() => setAppointmentsDropdownOpen(false)}>
//                                     <button
//                                         className="btn nav-link dropdown-toggle"
//                                         id="appointmentsDropdown"
//                                         onClick={toggleAppointmentsDropdown}
//                                         aria-expanded={appointmentsDropdownOpen}
//                                     >
//                                         <strong>Appointments</strong>
//                                     </button>
//                                     <div className={`dropdown-menu ${appointmentsDropdownOpen ? 'show' : ''}`} aria-labelledby="appointmentsDropdown">
//                                         <Link className="dropdown-item" to="/reception/appointmentbook" onClick={() => setAppointmentsDropdownOpen(false)}>Book Appointment</Link>
//                                         <Link className="dropdown-item" to="/reception/bookedappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Booked Appointment</Link>
//                                     </div>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                     <ul className="navbar-nav ml-auto">
//                         <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}>
//                             <button
//                                 className="btn nav-link"
//                                 id="navbarDropdown"
//                                 onClick={toggleProfileDropdown}
//                                 aria-expanded={dropdownOpen}
//                             >
//                                 <ProfileIcon />
//                             </button>
//                             <div className={`dropdown-menu dropdown-menu-left ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
//                                 {userType === 'doctor' && (
//                                     <>
//                                         <Link className="dropdown-item" to="/doctor/details" onClick={toggleProfileDropdown}>Doctor Details</Link>
//                                         <Link className="dropdown-item" to="/doctor/appointments" onClick={toggleProfileDropdown}>Appointment Slot</Link>
//                                         <Link className="dropdown-item" to="/doctor/manageclinic" onClick={toggleProfileDropdown}>Manage Clinic</Link>
//                                         <Link className="dropdown-item" to="/doctor/managereception" onClick={toggleProfileDropdown}>Manage Reception</Link>
//                                         <Link className="dropdown-item" to="/doctor/bookedappointment" onClick={toggleProfileDropdown}>Booked Appointment</Link>
//                                         <Link className="dropdown-item" to="/doctor/bookappointment" onClick={toggleProfileDropdown}>Book Appointment</Link>
//                                     </>
//                                 )}
//                                 {userType === 'clinic' && (
//                                     <>
 
//                                         <Link className="dropdown-item" to="/clinic/details" onClick={toggleProfileDropdown}>Clinic Details</Link>
//                                         <Link className="dropdown-item" to="/clinic/createslot" onClick={toggleProfileDropdown}>Appointment Slot</Link>
//                                         <Link className="dropdown-item" to="/clinic/appointmentbook" onClick={toggleProfileDropdown}>Book Appointment</Link>
//                                         <Link className="dropdown-item" to="/clinic/bookedappointment" onClick={toggleProfileDropdown}>Booked Appointment</Link>
//                                     </>
//                                 )}
//                                 {userType === 'reception' && (
//                                     <>
 
//                                         <Link className="dropdown-item" to="/reception/details" onClick={toggleProfileDropdown}>Reception Details</Link>
//                                         <Link className="dropdown-item" to="/reception/createslot" onClick={toggleProfileDropdown}>Appointment Slot</Link>
//                                         <Link className="dropdown-item" to="/reception/appointmentbook" onClick={toggleProfileDropdown}>Book Appointment</Link>
//                                         <Link className="dropdown-item" to="/reception/bookedappointment" onClick={toggleProfileDropdown}>Booked Appointment</Link>
//                                     </>
//                                 )}
//                             </div>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// };
 
// export default DoctorNavbar;




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Company from '../../images/logo.jpeg';
import '../../css/Navbar.css';
import ProfileIcon from '../profile/ProfileIcon';
 
const DoctorNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
    const [appointmentsDropdownOpen, setAppointmentsDropdownOpen] = useState(false);
    const [userType, setUserType] = useState(null);
 
    useEffect(() => {
        const userTypeFromStorage = localStorage.getItem('user_type');
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
 
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={Company} alt="Company Logo" height="40" />
                </Link>
 
                <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        {userType === 'doctor' && (
                            <>
 
                                <li className="nav-item">
                                    <Link className="nav-link" to="/doctor/home" style={{ color: '#f18dc' }}>
                                        <strong>Home</strong>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/doctor/details" style={{ color: '#f18dc' }}>
                                        <strong>Doctor Details</strong>
                                    </Link>
                                </li>
                                <li className={`nav-item dropdown ${hospitalDropdownOpen ? 'show' : ''}`}
                                    onMouseEnter={() => setHospitalDropdownOpen(true)}
                                    onMouseLeave={() => setHospitalDropdownOpen(false)}>
                                    <button
                                        className="btn nav-link dropdown-toggle"
                                        id="hospitalDropdown"
                                        onClick={toggleHospitalDropdown}
                                        aria-expanded={hospitalDropdownOpen}
                                        style={{ color: '#f18dc' }}
                                    >
                                        <strong>Hospital</strong>
                                    </button>
                                    <div className={`dropdown-menu ${hospitalDropdownOpen ? 'show' : ''}`} aria-labelledby="hospitalDropdown">
                                        <Link className="dropdown-item" to="/doctor/manageclinic" onClick={() => setHospitalDropdownOpen(false)}>Manage Clinic</Link>
                                        <Link className="dropdown-item" to="/doctor/managereception" onClick={() => setHospitalDropdownOpen(false)}>Manage Reception</Link>
                                    </div>
                                </li>
                                <li className={`nav-item dropdown ${appointmentsDropdownOpen ? 'show' : ''}`}
                                    onMouseEnter={() => setAppointmentsDropdownOpen(true)}
                                    onMouseLeave={() => setAppointmentsDropdownOpen(false)}>
                                    <button
                                        className="btn nav-link dropdown-toggle"
                                        id="appointmentsDropdown"
                                        onClick={toggleAppointmentsDropdown}
                                        aria-expanded={appointmentsDropdownOpen}
                                    >
                                        <strong>Appointments</strong>
                                    </button>
                                    <div className={`dropdown-menu ${appointmentsDropdownOpen ? 'show' : ''}`} aria-labelledby="appointmentsDropdown">
                                        <Link className="dropdown-item" to="/doctor/appointments" onClick={() => setAppointmentsDropdownOpen(false)}>Appointment Slot</Link>
                                        <Link className="dropdown-item" to="/doctor/bookappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Book Appointment</Link>
                                        <Link className="dropdown-item" to="/doctor/bookedappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Booked Appointment</Link>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav mr-auto">
                        {userType === 'clinic' && (
                            <>
 
                                <li className="nav-item">
                                    <Link className="nav-link" to="/clinic/home" style={{ color: '#f18dc' }}>
                                        <strong>Home</strong>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/clinic/createslot" style={{ color: '#f18dc' }}>
                                        <strong>Appointment Slots</strong>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/clinic/details" style={{ color: '#f18dc' }}>
                                        <strong>Clinic Details</strong>
                                    </Link>
                                </li>
                                <li className={`nav-item dropdown ${appointmentsDropdownOpen ? 'show' : ''}`}
                                    onMouseEnter={() => setAppointmentsDropdownOpen(true)}
                                    onMouseLeave={() => setAppointmentsDropdownOpen(false)}>
                                    <button
                                        className="btn nav-link dropdown-toggle"
                                        id="appointmentsDropdown"
                                        onClick={toggleAppointmentsDropdown}
                                        aria-expanded={appointmentsDropdownOpen}
                                    >
                                        <strong>Appointments</strong>
                                    </button>
                                    <div className={`dropdown-menu ${appointmentsDropdownOpen ? 'show' : ''}`} aria-labelledby="appointmentsDropdown">
                                        <Link className="dropdown-item" to="/clinic/appointmentbook" onClick={() => setAppointmentsDropdownOpen(false)}>Book Appointment</Link>
                                        <Link className="dropdown-item" to="/clinic/bookedappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Booked Appointment</Link>
                                    </div>
                                </li>
 
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav mr-auto">
                        {userType === 'reception' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/reception/home" style={{ color: '#f18dc' }}>
                                        <strong>Home</strong>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/reception/createslot" style={{ color: '#f18dc' }}>
                                        <strong>Appointment Slots</strong>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/reception/details" style={{ color: '#f18dc' }}>
                                        <strong>Reception Details</strong>
                                    </Link>
                                </li>
                                <li className={`nav-item dropdown ${appointmentsDropdownOpen ? 'show' : ''}`}
                                    onMouseEnter={() => setAppointmentsDropdownOpen(true)}
                                    onMouseLeave={() => setAppointmentsDropdownOpen(false)}>
                                    <button
                                        className="btn nav-link dropdown-toggle"
                                        id="appointmentsDropdown"
                                        onClick={toggleAppointmentsDropdown}
                                        aria-expanded={appointmentsDropdownOpen}
                                    >
                                        <strong>Appointments</strong>
                                    </button>
                                    <div className={`dropdown-menu ${appointmentsDropdownOpen ? 'show' : ''}`} aria-labelledby="appointmentsDropdown">
                                        <Link className="dropdown-item" to="/reception/appointmentbook" onClick={() => setAppointmentsDropdownOpen(false)}>Book Appointment</Link>
                                        <Link className="dropdown-item" to="/reception/bookedappointment" onClick={() => setAppointmentsDropdownOpen(false)}>Booked Appointment</Link>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}>
                            <button
                                className="btn nav-link"
                                id="navbarDropdown"
                                onClick={toggleProfileDropdown}
                                aria-expanded={dropdownOpen}
                            >
                                <ProfileIcon />
                            </button>
                            <div className={`dropdown-menu dropdown-menu-left ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                                {userType === 'doctor' && (
                                    <>
                                        <Link className="dropdown-item" to="/doctor/details" onClick={toggleProfileDropdown}>Doctor Details</Link>
                                        <Link className="dropdown-item" to="/doctor/appointments" onClick={toggleProfileDropdown}>Appointment Slot</Link>
                                        <Link className="dropdown-item" to="/doctor/manageclinic" onClick={toggleProfileDropdown}>Manage Clinic</Link>
                                        <Link className="dropdown-item" to="/doctor/managereception" onClick={toggleProfileDropdown}>Manage Reception</Link>
                                        <Link className="dropdown-item" to="/doctor/bookedappointment" onClick={toggleProfileDropdown}>Booked Appointment</Link>
                                        <Link className="dropdown-item" to="/doctor/bookappointment" onClick={toggleProfileDropdown}>Book Appointment</Link>
                                    </>
                                )}
                                {userType === 'clinic' && (
                                    <>
 
                                        <Link className="dropdown-item" to="/clinic/details" onClick={toggleProfileDropdown}>Clinic Details</Link>
                                        <Link className="dropdown-item" to="/clinic/createslot" onClick={toggleProfileDropdown}>Appointment Slot</Link>
                                        <Link className="dropdown-item" to="/clinic/appointmentbook" onClick={toggleProfileDropdown}>Book Appointment</Link>
                                        <Link className="dropdown-item" to="/clinic/bookedappointment" onClick={toggleProfileDropdown}>Booked Appointment</Link>
                                    </>
                                )}
                                {userType === 'reception' && (
                                    <>
 
                                        <Link className="dropdown-item" to="/reception/details" onClick={toggleProfileDropdown}>Reception Details</Link>
                                        <Link className="dropdown-item" to="/reception/createslot" onClick={toggleProfileDropdown}>Appointment Slot</Link>
                                        <Link className="dropdown-item" to="/reception/appointmentbook" onClick={toggleProfileDropdown}>Book Appointment</Link>
                                        <Link className="dropdown-item" to="/reception/bookedappointment" onClick={toggleProfileDropdown}>Booked Appointment</Link>
                                    </>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
 
export default DoctorNavbar;