// import React, { useState, useEffect, useRef } from "react";
// import { useHistory } from "react-router-dom";
// import { Modal, Button, Card, Row, Col, Form, Alert } from "react-bootstrap";
// import BaseUrl from "../../api/BaseUrl";
// import "../../css/SearchResult.css";
// import { format, addDays } from "date-fns";
// import {
//   FaCalendarAlt,
//   FaSearch,
//   FaMapMarkerAlt,
//   FaCheckCircle,
// } from "react-icons/fa";
// // import DoctorDetails from '../doctor/DoctorDetails';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
// import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";

// const formatTime = (time) => {
//   const [hours, minutes] = time.split(":");
//   const date = new Date();
//   date.setHours(hours);
//   date.setMinutes(minutes);
//   const options = { hour: "numeric", minute: "numeric", hour12: true };
//   return new Intl.DateTimeFormat("en-US", options).format(date);
// };

// const formatDate = (dateString) => {
//   const options = { month: "short", day: "numeric" };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const formatDay = (dateString) => {
//   const options = { weekday: "short" };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const isMorning = (time) => {
//   const hour = parseInt(time.split(":")[0], 10);
//   return hour >= 6 && hour < 12;
// };

// const isAfternoon = (time) => {
//   const hour = parseInt(time.split(":")[0], 10);
//   return hour >= 12 && hour < 18;
// };

// const isEvening = (time) => {
//   const hour = parseInt(time.split(":")[0], 10);
//   return hour >= 18 && hour < 24;
// };

// const PatientDetailsModal = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   onCancel,
//   handleSaveDetails,
//   name,
//   mobile,
//   dob,
//   age,
//   bloodGroup,
//   gender,
//   address,
//   email,
//   sameAsAppointment,
//   setName,
//   setMobile,
//   setDob,
//   setAge,
//   setBloodGroup,
//   setGender,
//   setAddress,
//   setEmail,
//   setSameAsAppointment,
//   detailsFetched,
// }) => {
//   const [altName, setAltName] = useState("");
//   const [altMobile, setAltMobile] = useState("");
//   const [altDob, setAltDob] = useState("");
//   const [altAge, setAltAge] = useState("");
//   const [altBloodGroup, setAltBloodGroup] = useState("");
//   const [altGender, setAltGender] = useState("");
//   const [altAddress, setAltAddress] = useState("");
//   const [altEmail, setAltEmail] = useState("");

//   const [manualName, setManualName] = useState(false);
//   const [manualMobile, setManualMobile] = useState(false);
//   const [manualDob, setManualDob] = useState(false);
//   const [manualBloodGroup, setManualBloodGroup] = useState(false);
//   const [manualGender, setManualGender] = useState(false);
//   const [manualAge, setManualAge] = useState(false);
//   const [manualAddress, setManualAddress] = useState(false);
//   const [manualEmail, setManualEmail] = useState(false);

//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const detailsAvailable =
//     name && mobile && dob && bloodGroup && gender && address && email && age;

//   useEffect(() => {
//     const storedMobileNumber = localStorage.getItem("mobile_number");
//     if (storedMobileNumber) {
//       setMobile(storedMobileNumber);
//     }
//   }, [setMobile]);

//   useEffect(() => {
//     if (sameAsAppointment) {
//       if (!manualName) setAltName(name);
//       if (!manualMobile) setAltMobile(mobile);
//       if (!manualDob) setAltDob(dob);
//       if (!manualBloodGroup) setAltBloodGroup(bloodGroup);
//       if (!manualGender) setAltGender(gender);
//       if (!manualAge) setAltAge(age);
//       if (!manualAddress) setAltAddress(address);
//       if (!manualEmail) setAltEmail(email);
//     } else if (!detailsAvailable) {
//       if (!manualName) setAltName("");
//       if (!manualMobile) setAltMobile("");
//       if (!manualDob) setAltDob("");
//       if (!manualBloodGroup) setAltBloodGroup("");
//       if (!manualGender) setAltGender("");
//       if (!manualAge) setAltAge("");
//       if (!manualAddress) setAltAddress("");
//       if (!manualEmail) setAltEmail(email);
//     }
//   }, [
//     sameAsAppointment,
//     detailsAvailable,
//     name,
//     mobile,
//     dob,
//     bloodGroup,
//     gender,
//     address,
//     email,
//     age,
//     manualName,
//     manualMobile,
//     manualDob,
//     manualBloodGroup,
//     manualGender,
//     manualAddress,
//     manualAge,
//     manualEmail,
//   ]);

//   const handleAltNameChange = (e) => {
//     setManualName(true);
//     setAltName(e.target.value);
//   };

//   const handleAltMobileChange = (e) => {
//     setManualMobile(true);
//     setAltMobile(e.target.value);
//   };

//   const handleAltDobChange = (e) => {
//     setManualDob(true);
//     setAltDob(e.target.value);
//   };

//   const handleAltBloodGroupChange = (e) => {
//     setManualBloodGroup(true);
//     setAltBloodGroup(e.target.value);
//   };

//   const handleAltGenderChange = (e) => {
//     setManualGender(true);
//     setAltGender(e.target.value);
//   };

//   const handleAltAddressChange = (e) => {
//     setManualAddress(true);
//     setAltAddress(e.target.value);
//   };

//   const handleAltAgeChange = (e) => {
//     setManualAge(true);
//     setAltAge(e.target.value);
//   };

//   const handleAltEmailChange = (e) => {
//     setManualEmail(true);
//     setAltEmail(e.target.value);
//   };

//   const handleSubmit = async () => {
//     const patientDetails = sameAsAppointment
//       ? {
//         name: altName,
//         mobile_number: altMobile,
//         date_of_birth: altDob,
//         blood_group: altBloodGroup,
//         gender: altGender.toLowerCase(),
//         address: altAddress,
//         email: altEmail,
//         age: altAge,
//       }
//       : {
//         name,
//         mobile_number: mobile,
//         date_of_birth: dob,
//         blood_group: bloodGroup,
//         gender: gender.toLowerCase(),
//         address,
//         email,
//         age,
//       };

//     const patientId = await handleSaveDetails(patientDetails);

//     if (patientId) {
//       setShowConfirmModal(true);
//     } else {
//       setErrorMessage("Failed to save details. Please try again.");
//     }
//   };

//   const handleConfirmBooking = () => {
//     setShowConfirmModal(false);
//     onConfirm();
//   };

//   return (
//     <>
//       <Modal show={isOpen} onHide={onClose} centered size="xl">
//         <Modal.Header
//           closeButton
//           style={{
//             backgroundColor: "#D1E9F6",
//             color: "#000",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               width: "100%",
//             }}
//           >
//             <Modal.Title style={{ margin: 0 }}>
//               Kindly Fill Your Details !!
//             </Modal.Title>
//           </div>
//         </Modal.Header>

//         <Modal.Body style={{ padding: "20px 30px" }}>
//           {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Name</label> <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   onChange={(e) => setName(e.target.value.replace(/[^A-Za-z\s]/g, ""))}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Mobile No</label> <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                   disabled
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Date of Birth</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={dob}
//                   onChange={(e) => setDob(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Blood Group</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={bloodGroup}
//                   onChange={(e) => setBloodGroup(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Gender</label> <span className="text-danger">*</span>
//                 <select
//                   className="form-control"
//                   value={gender}
//                   onChange={(e) => setGender(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 >
//                   <option value="select">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Age</label> <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={age}
//                   onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>

//             </div>

//             <div className="row">
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Address</label> <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Email Id</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//             </div>

//             <div className="d-flex justify-content-center my-4">
//               <Form.Check
//                 type="switch"
//                 id="for-others-toggle"
//                 label="For others"
//                 checked={sameAsAppointment}
//                 onChange={() => setSameAsAppointment(!sameAsAppointment)}
//                 style={{ fontSize: "1.2rem", fontWeight: "bold" }}
//               />
//             </div>

//             {sameAsAppointment && (
//               <>
//                 <div className="row">
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Name</label> <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altName}
//                       onChange={handleAltNameChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Mobile No</label> <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altMobile}
//                       onChange={handleAltMobileChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Date of Birth</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       value={altDob}
//                       onChange={handleAltDobChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Blood Group</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altBloodGroup}
//                       onChange={handleAltBloodGroupChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Gender</label> <span className="text-danger">*</span>
//                     <select
//                       className="form-control"
//                       value={altGender}
//                       onChange={handleAltGenderChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Age</label> <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altAge}
//                       onChange={handleAltAgeChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Address</label> <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altAddress}
//                       onChange={handleAltAddressChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Email Id</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altEmail}
//                       onChange={handleAltEmailChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Relation</label>
//                     <select
//                       className="form-control"
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     >
//                       <option value="">Select Relation</option>
//                       <option value="female">Mother</option>
//                       <option value="male">Father</option>
//                       <option value="female">Sister</option>
//                       <option value="male">Brother</option>
//                       <option value="female">Daughter</option>
//                       <option value="male">Son</option>
//                       <option value="other">Friends</option>
//                       <option value="other">Others</option>
//                     </select>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//           <div className="modal-actions d-flex justify-content-between mt-3">
//             <Button
//               variant="secondary"
//               onClick={onClose}
//               style={{
//                 padding: "5px 10px",
//                 fontSize: "1.1rem",
//                 width: "fit-content",
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleSubmit}
//               style={{
//                 padding: "5px 10px",
//                 fontSize: "1.1rem",
//                 width: "fit-content",
//               }}
//             >
//               Save Details
//             </Button>
//           </div>
//         </Modal.Body>
//       </Modal>

//       <Modal
//         show={showConfirmModal}
//         onHide={() => setShowConfirmModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Booking</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to confirm this appointment?</p>
//           <div className="d-flex justify-content-between mt-4">
//             <Button
//               variant="secondary"
//               onClick={() => setShowConfirmModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleConfirmBooking}>
//               Confirm
//             </Button>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// const BookAppointment = () => {
//   const [location, setLocation] = useState("");
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [showSlots, setShowSlots] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [selectedDateIndex, setSelectedDateIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [slotCounts, setSlotCounts] = useState([]);
//   const [patientId, setPatientId] = useState(null);
//   const resultsRef = useRef(null);

//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [dob, setDob] = useState("");
//   const [age, setAge] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [gender, setGender] = useState("");
//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");

//   const [sameAsAppointment, setSameAsAppointment] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//   const [altName, setAltName] = useState("");
//   const [altMobile, setAltMobile] = useState("");
//   const [altDob, setAltDob] = useState("");
//   const [altAge, setAltAge] = useState("");
//   const [altBloodGroup, setAltBloodGroup] = useState("");
//   const [altGender, setAltGender] = useState("");
//   const [altAddress, setAltAddress] = useState("");
//   const [altEmail, setAltEmail] = useState("");

//   const [opdDays, setOpdDays] = useState(""); // To store OPD days
//   const [opdTimings, setOpdTimings] = useState(""); // To store OPD timings

//   const history = useHistory();
//   const [appointmentId, setAppointmentId] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   const [showOptions, setShowOptions] = useState(false);
//   const [appointmentType, setAppointmentType] = useState(null);

//   const [expanded, setExpanded] = useState(null);

//   const [doctors, setDoctors] = useState([]);
//   const [selectedSpecialty, setSelectedSpecialty] = useState("All");

//   const morningSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isMorning(slot.appointment_slot))
//     : [];
//   const afternoonSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isAfternoon(slot.appointment_slot))
//     : [];
//   const eveningSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isEvening(slot.appointment_slot))
//     : [];

//   const [morningSlotIndex, setMorningSlotIndex] = useState(0);
//   const [afternoonSlotIndex, setAfternoonSlotIndex] = useState(0);
//   const [eveningSlotIndex, setEveningSlotIndex] = useState(0);

//   // const SLOTS_PER_PAGE = 3;
//   // Define the number of slots to display per page

//   const SLOTS_PER_BATCH = 12; // 3 rows of 4 slots each

//   // Adjust the navigation functions to manage batches of three rows
//   const handleMorningPrevious = () => {
//     setMorningSlotIndex((prev) => Math.max(prev - SLOTS_PER_BATCH, 0));
//   };

//   const handleMorningNext = () => {
//     setMorningSlotIndex((prev) =>
//       Math.min(prev + SLOTS_PER_BATCH, morningSlots.length - SLOTS_PER_BATCH)
//     );
//   };

//   const handleAfternoonPrevious = () => {
//     setAfternoonSlotIndex((prev) => Math.max(prev - SLOTS_PER_BATCH, 0));
//   };

//   const handleAfternoonNext = () => {
//     setAfternoonSlotIndex((prev) =>
//       Math.min(prev + SLOTS_PER_BATCH, afternoonSlots.length - SLOTS_PER_BATCH)
//     );
//   };

//   const handleEveningPrevious = () => {
//     setEveningSlotIndex((prev) => Math.max(prev - SLOTS_PER_BATCH, 0));
//   };

//   const handleEveningNext = () => {
//     setEveningSlotIndex((prev) =>
//       Math.min(prev + SLOTS_PER_BATCH, eveningSlots.length - SLOTS_PER_BATCH)
//     );
//   };

//   const [currentPage, setCurrentPage] = useState(1);
//   const doctorsPerPage = 3; // Set the maximum number of doctors per page
//   const totalPages = Math.ceil(doctors.length / doctorsPerPage);

//   // Pagination Functions
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const currentDoctors = doctors.slice(
//     (currentPage - 1) * doctorsPerPage,
//     currentPage * doctorsPerPage
//   );

//   const toggleDropdown = () => {
//     setShowOptions(!showOptions);
//   };

//   const handleOptionSelect = (type) => {
//     setAppointmentType(type);
//     setShowOptions(false);

//     handleDateChange(0);
//   };

//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//   };

//   const handleInputChange = async (e) => {
//     const { value } = e.target;
//     setQuery(value);
//     if (value.trim().length < 3) {
//       setResults([]);
//       return;
//     }
//     try {
//       const response = await BaseUrl.get("/doctor/searchdoctor/", {
//         params: { query: value },
//       });
//       setResults(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, [selectedSpecialty]);

//   const fetchDoctors = async () => {
//     try {
//       const endpoint = "/doctor/specialization/";
//       const params =
//         selectedSpecialty === "All"
//           ? {}
//           : { specialization: selectedSpecialty };
//       const response = await BaseUrl.get(endpoint, { params });
//       setDoctors(response.data);
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (resultsRef.current && !resultsRef.current.contains(event.target)) {
//         setResults([]);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     fetchLocationDoctors();
//   }, []);

//   useEffect(() => {
//     fetchLocationDoctors();
//   }, []);

//   const fetchLocationDoctors = async () => {
//     try {
//       const response = await BaseUrl.get("/patient/location/");
//       console.log(response.data); // Check if `city` and `state` are present
//       const { city, state } = response.data; // Assuming city and state are in response.data
//       setLocation({ city, state });
//     } catch (error) {
//       console.error("Error fetching doctors by location:", error);
//     }
//   };

//   useEffect(() => {
//     const today = new Date();
//     const dates = [
//       format(today, "yyyy-MM-dd"),
//       format(addDays(today, 1), "yyyy-MM-dd"),
//       format(addDays(today, 2), "yyyy-MM-dd"),
//     ];
//     setAvailableDates(dates);
//     fetchSlotCounts(dates);
//   }, [selectedDoctor]);

//   const fetchSlotCounts = async (dates) => {
//     // Ensure dates is an array and has items to process
//     if (!Array.isArray(dates) || dates.length === 0 || !selectedDoctor || !selectedDoctor.doctor) {
//       setSlotCounts([]);
//       return;
//     }

//     try {
//       // Fetch available slots using the doctor ID and dates array
//       const countResponse = await BaseUrl.get(
//         `/clinic/countavailableslots/?doctor_id=${selectedDoctor.doctor}&dates=${dates.join("&dates=")}`
//       );

//       // Check if countData is valid and is an array
//       const countData = countResponse.data;
//       if (!Array.isArray(countData)) {
//         console.error("Unexpected response format:", countData);
//         setSlotCounts(dates.map(() => 0)); // Default to 0 slots
//         return;
//       }

//       // Map over dates to get the slot count for each date
//       const newSlotCounts = dates.map((date) => {
//         const dateCount = countData.find((item) => item.date === date);
//         return dateCount ? dateCount.count : 0; // Default to 0 if dateCount not found
//       });

//       setSlotCounts(newSlotCounts);
//     } catch (error) {
//       console.error("Error fetching slot counts:", error);
//       setSlotCounts(dates.map(() => 0)); // Default to 0 slots if an error occurs
//       setErrorMessage("Failed to fetch slot counts. Please try again.");
//     }
//   };

//   const fetchSlots = async (selectedDate) => {
//     if (!selectedDoctor || !selectedDate) return;

//     try {
//       setLoading(true);
//       const slotsResponse = await BaseUrl.get(
//         `/doctorappointment/blankslot/?doctor_id=${selectedDoctor.doctor}&slot_date=${selectedDate}`
//       );
//       const slotsData = slotsResponse.data;
//       setSlots(slotsData);
//       setShowSlots(true);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       setSlots([]);
//       setErrorMessage("Failed to fetch slots. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSlotClick = async (slot) => {
//     setSelectedSlot(slot);

//     try {
//       const mobile_number = localStorage.getItem("mobile_number");

//       const response = await BaseUrl.get("/patient/details/", {
//         params: { mobile_number: mobile_number },
//       });

//       if (response && response.data && response.data.length > 0) {
//         const patient = response.data[0];

//         setName(patient.name || "");
//         setMobile(patient.mobile_number || "");
//         setDob(patient.date_of_birth || "");
//         setAge(patient.age ? patient.age.toString() : "");
//         setBloodGroup(patient.blood_group || "");
//         setGender(patient.gender || "");
//         setAddress(patient.address || "");
//         setEmail(patient.email || "");

//         if (sameAsAppointment) {
//           setAltName(patient.name || "");
//           setAltMobile(patient.mobile_number || "");
//           setAltDob(patient.date_of_birth || "");
//           setAltAge(patient.age ? patient.age.toString() : "");
//           setAltBloodGroup(patient.blood_group || "");
//           setAltGender(patient.gender || "");
//           setAltAddress(patient.address || "");
//           setAltEmail(patient.email || "");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching patient details:", error);
//       setErrorMessage("Failed to fetch patient details. Please try again.");
//     }

//     setIsModalOpen(true);
//   };

//   const handleSaveDetails = async (details) => {
//     try {
//       const response = await BaseUrl.post("/patient/patient/", details);
//       if (response.status === 201) {
//         const savedPatientId = response.data.data.id;
//         setPatientId(savedPatientId);
//         setErrorMessage("");
//         return savedPatientId;
//       } else {
//         setErrorMessage(
//           response.data.error || "Failed to save patient details"
//         );
//         return null;
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setErrorMessage(error.response.data.error);
//       } else {
//         setErrorMessage("An error occurred while saving patient details.");
//       }
//       return null;
//     }
//   };

//   const handleConfirmAppointment = async () => {
//     try {
//       setLoading(true);

//       // Call the POST API to book the appointment
//       const postResponse = await BaseUrl.post("/patientappointment/bookslot/", {
//         patient: patientId,
//         doctor: selectedDoctor.doctor,
//         appointment_status: "upcoming",
//         appointment_slot: selectedSlot.id,
//         // consultation_type: consultationType,
//       });

//       if (postResponse && postResponse.data) {
//         const backendMessage = postResponse.data.success;
//         setSuccessMessage(backendMessage);
//         setShowConfirmModal(false);
//         setIsModalOpen(false);
//         setShowSuccessPopup(true);

//         // Extract the appointment ID from the response and store it in state
//         const newAppointmentId = postResponse.data.data.id; // Access the appointment ID from response
//         setAppointmentId(newAppointmentId);

//         // Call the PATCH API with both patient_id and appointment ID
//         await BaseUrl.patch("/patient/patient/", {
//           patient_id: patientId,
//           appointment: newAppointmentId,
//         });

//         // Fetch slots and update UI after both API calls succeed
//         fetchSlotCounts();
//         fetchSlots(availableDates[selectedDateIndex]);

//         // Hide success popup after 5 seconds
//         // setTimeout(() => {
//         //   setShowSuccessPopup(false);
//         // }, 5000);
//         setTimeout(() => {
//           history.push("/patient/home");
//         }, 4000);
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error) {
//       setErrorMessage("An error occurred while confirming the appointment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAnswer = (index) => {
//     setExpanded(expanded === index ? null : index);
//   };

//   const handleCancelAppointment = () => {
//     setIsModalOpen(false);
//   };

//   const handleDateChange = (index) => {
//     const selectedDate = availableDates[index];
//     setSelectedDateIndex(index);
//     fetchSlots(selectedDate);
//   };

//   const handleClick = async (doctor) => {
//     setSelectedDoctor(doctor);
//     setShowSlots(false);

//     try {
//       const response = await BaseUrl.get(
//         `/doctor/opddays/?doctor_id=${doctor.doctor}`
//       );

//       if (response.data && response.data.length > 0) {
//         const opdData = response.data[0];
//         setOpdDays(
//           opdData.start_day && opdData.end_day
//             ? `${opdData.start_day} - ${opdData.end_day}`
//             : "No OPD Days"
//         );

//         const timeOpdResponse = await BaseUrl.get(
//           `/doctor/timeopd/?opd_id=${opdData.id}`
//         );
//         if (timeOpdResponse.data && timeOpdResponse.data.length > 0) {
//           setOpdTimings(timeOpdResponse.data);
//         } else {
//           setOpdTimings([]);
//         }
//       } else {
//         setOpdDays("No OPD Days");
//         setOpdTimings([]);
//       }
//     } catch (error) {
//       console.error("Error fetching OPD days or timings:", error);
//       setOpdDays("Error fetching OPD Days");
//       setOpdTimings([]);
//     }
//   };

//   const handleClose = () => {
//     setIsModalOpen(false);
//     setSelectedDoctor(null);
//   };

//   return (
//     <div className="book-appointment-container mt-0">
//       <div className="book-appointment-inner-container">
//         <header className="book-appointment-header-section">
//           <h1 className="book-appointment-header-title">
//             Your home for health
//           </h1>
//           <p className="book-appointment-header-subtitle">Find and Book</p>

//           <div className="book-appointment-input-container">
//             <div className="book-appointment-input-box">
//               <FaMapMarkerAlt className="book-appointment-icon-location" />
//               <input
//                 type="text"
//                 className="book-appointment-input-field"
//                 value={location ? `${location.city}, ${location.state}` : ""}
//                 onChange={handleLocationChange}
//                 placeholder="Your location"
//               />
//             </div>
//             <div className="book-appointment-input-box">
//               <FaSearch className="book-appointment-icon-search" />
//               <input
//                 type="text"
//                 className="book-appointment-input-field"
//                 value={query}
//                 onChange={handleInputChange}
//                 placeholder="Search Doctors / Specialization..."
//               />
//             </div>
//             {!selectedDoctor && query.trim().length >= 3 && (
//               <div
//                 ref={resultsRef}
//               // className="results-container"
//               >
//                 <div ref={resultsRef} className="results-container">
//                   <div className="book-appointment-search-results">
//                     {results.slice(0, 5).map((result) => (
//                       <Card
//                         key={result.id}
//                         onClick={() => handleClick(result)}
//                         className="book-appointment-search-result"
//                         aria-label={`View details for ${result.name}`}
//                       >
//                         <Card.Body className="card-result">
//                           <Col md={3} className="d-flex justify-content-center">
//                             {result.profile_pic ? (
//                               <img
//                                 src={`${BaseUrl.defaults.baseURL}${result.profile_pic}`}
//                                 alt={result.name}
//                                 className="profile-pic"
//                                 style={{
//                                   borderRadius: "50%",
//                                   width: "60px",
//                                   height: "60px",
//                                   objectFit: "cover",
//                                 }}
//                               />
//                             ) : (
//                               <div
//                                 className="no-profile-pic"
//                                 style={{
//                                   borderRadius: "50%",
//                                   width: "60px",
//                                   height: "60px",
//                                   backgroundColor: "#f0f0f0",
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   fontSize: "24px",
//                                   overflow: "hidden",
//                                   position: "relative",
//                                 }}
//                               >
//                                 <img
//                                   src={require("../../images/profileIcon.png")}
//                                   alt="No Picture"
//                                   style={{
//                                     borderRadius: "50%",
//                                     width: "100%",
//                                     height: "100%",
//                                     objectFit: "cover",
//                                   }}
//                                 />
//                               </div>
//                             )}
//                           </Col>

//                           <div className="book-appointment-doctor-details ">
//                             <Card.Title className="book-appointment-doctor-names">
//                               {result.name}
//                             </Card.Title>
//                             <Card.Text className="book-appointment-specializations">
//                               {result.specialization}
//                             </Card.Text>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>
//         {selectedDoctor && (
//           <Card>
//             <Modal.Body>
//               <div style={{ backgroundColor: "#D7EAF0", position: "relative" }}>
//                 <Button
//                   variant="light"
//                   onClick={handleClose}
//                   className="custom-modal-close-btn"
//                   style={{
//                     fontSize: "32px",
//                   }}
//                 >
//                   <BsX />
//                 </Button>
//                 <Row>
//                   <Col md={4} className="d-flex flex-column align-items-center">
//                     {selectedDoctor.profile_pic ? (
//                       <Card.Img
//                         variant="top"
//                         src={`${BaseUrl.defaults.baseURL}${selectedDoctor.profile_pic}`}
//                         alt={selectedDoctor.name}
//                         style={{
//                           borderRadius: "50%",
//                           width: "250px",
//                           height: "250px",
//                           objectFit: "cover",
//                         }}
//                       />
//                     ) : (
//                       <div
//                         className="no-profile-pic"
//                         style={{
//                           borderRadius: "50%",
//                           width: "250px",
//                           height: "250px",
//                           backgroundColor: "#f0f0f0",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           fontSize: "24px",
//                           overflow: "hidden",
//                           position: "relative",
//                         }}
//                       >
//                         <img
//                           src={require("../../images/profileIcon.png")}
//                           alt="No Picture"
//                           style={{
//                             borderRadius: "50%",
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </div>
//                     )}
//                     <div
//                       style={{
//                         fontSize: "22px",
//                         fontWeight: "600",
//                         marginTop: "1rem",
//                         backgroundColor: "#0091A5",
//                         padding: "10px",
//                         borderRadius: "5px",
//                         color: "white",
//                         textAlign: "center",
//                         // width: "100%",
//                         // make it responsive
//                         width: "fit-content"
//                       }}
//                     >
//                       OPD Days: {opdDays}
//                     </div>
//                   </Col>

//                   <Col
//                     md={5}
//                     className="text-start"
//                     style={{ paddingLeft: "60px" }}
//                   >
//                     <Card.Title
//                       style={{
//                         fontSize: "38px",
//                         marginBottom: "0.5rem",
//                         fontWeight: "700",
//                         color: "#0091A5",
//                       }}
//                     >
//                       {selectedDoctor.name}
//                     </Card.Title>
//                     <Card.Text
//                       style={{
//                         fontSize: "28px",
//                         marginBottom: "0.5rem",
//                         fontWeight: "600",
//                       }}
//                     >
//                       {selectedDoctor.specialization}
//                     </Card.Text>
//                     <Card.Text
//                       style={{
//                         fontSize: "28px",
//                         marginBottom: "0.5rem",
//                         fontWeight: "600",
//                       }}
//                     >
//                       {selectedDoctor.qualifications &&
//                         Array.isArray(selectedDoctor.qualifications)
//                         ? selectedDoctor.qualifications
//                           .filter(
//                             (qualification) => qualification.is_selected
//                           )
//                           .map((qualification) => qualification.qualification)
//                           .join(", ")
//                         : "None"}
//                     </Card.Text>

//                     <Card.Text
//                       style={{
//                         fontSize: "28px",
//                         marginBottom: "0.5rem",
//                         fontWeight: "600",
//                       }}
//                     >
//                       {selectedDoctor.experience}+ years Experience
//                     </Card.Text>
//                     <Card.Text
//                       style={{ fontSize: "22px", marginBottom: "0.5rem" }}
//                     >
//                       Consultation Fees: ₹ {selectedDoctor.consultation_fee}{" "}
//                     </Card.Text>

//                     <Card.Text
//                       style={{ fontSize: "22px", marginBottom: "0.5rem" }}
//                     >
//                       Gender : {selectedDoctor.gender}
//                     </Card.Text>
//                     <Row>
//                       <Col md={12}>
//                         <Card.Text
//                           style={{ fontSize: "22px", marginBottom: "0.5rem" }}
//                         >
//                           Address:{" "}
//                           {selectedDoctor.address &&
//                             Array.isArray(selectedDoctor.address) &&
//                             selectedDoctor.address.length > 0 ? (
//                             selectedDoctor.address.map((addr, idx) => (
//                               <div
//                                 key={idx}
//                                 style={{
//                                   fontSize: "22px",
//                                   marginBottom: "0.5rem",
//                                   display: "inline",
//                                 }}
//                               >
//                                 {`${addr.street_address}, ${addr.city}, ${addr.state}, ${addr.country}, ${addr.pin_code} `}
//                                 <br />
//                                 {/* Landmark: {addr.landmark} */}
//                               </div>
//                             ))
//                           ) : (
//                             <p
//                               style={{
//                                 fontSize: "22px",
//                                 marginBottom: "0.5rem",
//                                 display: "inline",
//                               }}
//                             >
//                               No Address Available
//                             </p>
//                           )}
//                         </Card.Text>
//                       </Col>
//                     </Row>
//                   </Col>

//                   <Col
//                     md={3}
//                     className="d-flex align-items-center justify-content-center"
//                   >
//                     <div
//                       style={{
//                         width: "100%",
//                         textAlign: "center",
//                         position: "relative",
//                       }}
//                     >
//                       {/* OPD Timing Section */}
//                       <div
//                         style={{
//                           marginTop: "1rem",
//                           backgroundColor: "#0091A5",
//                           padding: "10px",
//                           borderRadius: "5px",
//                           fontSize: "22px",
//                           fontWeight: "600",
//                           color: "white",
//                           width: "75%",
//                           // make it responsive
//                           marginBottom: "20px",
//                           // width: "fit-content"
//                         }}
//                       >
//                         <div style={{ textAlign: "center", marginBottom: "10px" }}>
//                           OPD Timing:
//                         </div>
//                         <div>
//                           {Array.isArray(opdTimings) && opdTimings.length > 0 ? (
//                             opdTimings.map((timing, idx) => (
//                               <div
//                                 key={idx}
//                                 style={{
//                                   fontSize: "18px",
//                                   marginTop: "0.5rem",
//                                 }}
//                               >
//                                 {formatTime(timing.start_time)} -{" "}
//                                 {formatTime(timing.end_time)}
//                               </div>
//                             ))
//                           ) : (
//                             <div>No OPD Timings Available</div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Book Appointment Button */}
//                       <Button
//                         onClick={toggleDropdown}
//                         className="w-75"
//                         style={{
//                           backgroundColor: "#0091A5",
//                           color: "white",
//                           border: "none",
//                           fontSize: "20px",
//                           padding: "15px 20px",
//                           borderRadius: "30px",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                       >
//                         <FaCalendarAlt
//                           style={{ marginRight: "8px", fontSize: "28px" }}
//                         />
//                         Book Appointment
//                         <FontAwesomeIcon
//                           icon={showOptions ? faAngleUp : faAngleDown}
//                           style={{ marginLeft: "8px", fontSize: "20px" }}
//                         />
//                       </Button>

//                       {showOptions && (
//                         <div>
//                           {/* Dropdown options go here */}
//                         </div>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>

//                 <div className="text-center mt-3">
//                   <h2>Select Slot</h2>
//                   <div className="date-button mb-3 d-flex flex-wrap justify-content-center">
//                     {availableDates.map((date, index) => (
//                       <div key={index} className="date-button-container">
//                         <Button
//                           variant={selectedDateIndex === index ? "primary" : "outline-primary"}
//                           className="date-button mr-3"
//                           onClick={() => handleDateChange(index)}
//                           style={{ width: "fit-content" }}
//                         >
//                           {index === 0
//                             ? "Today"
//                             : index === 1
//                               ? "Tomorrow"
//                               : `${formatDay(date)} (${formatDate(date)})`}
//                         </Button>
//                         <div>
//                           <span className={`slot-count ${slotCounts[index] > 0 ? "text-success" : "text-danger"}`}>
//                             {slotCounts[index] > 0
//                               ? `${slotCounts[index]} slots available`
//                               : "0 slots available"}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {loading ? (
//                     <p>Loading slots...</p>
//                   ) : (
//                     <div className="slots-section">
//                       <Row className="text-center align-items-start">
//                         {/* Morning Slots */}
//                         <Col md={4} className="slot-column">
//                           <h4 className="slot-title text-center mb-4">Morning</h4>
//                           <div className="d-flex align-items-center justify-content-between">
//                             {/* Left Navigation Button for Morning */}
//                             {morningSlots.length > 12 && (
//                               <div
//                                 className={`custom-nav-button ${morningSlotIndex === 0 ? "disabled" : ""}`}
//                                 onClick={morningSlotIndex === 0 ? null : handleMorningPrevious}
//                               >
//                                 <BsChevronLeft />
//                               </div>
//                             )}

//                             {/* Morning Slot Buttons */}
//                             <div className="d-flex flex-wrap justify-content-center slot-buttons-container" style={{ width: "100%" }}>
//                               {morningSlots.length > 0 ? (
//                                 morningSlots
//                                   .slice(morningSlotIndex, morningSlotIndex + 12) // Show max 12 slots
//                                   .map((slot) => (
//                                     <Button
//                                       key={slot.id}
//                                       variant="outline-primary"
//                                       className="slot-button mb-2"
//                                       onClick={() => handleSlotClick(slot)}
//                                       style={{ margin: "5px", padding: "10px", textAlign: "center", fontSize: "0.8rem", width: "80px", height: "50px" }}
//                                     >
//                                       {formatTime(slot.appointment_slot)}
//                                     </Button>
//                                   ))
//                               ) : (
//                                 <p className="slot-section-message">No slots available for morning</p>
//                               )}
//                             </div>

//                             {/* Right Navigation Button for Morning */}
//                             {morningSlots.length > 12 && (
//                               <div
//                                 className={`custom-nav-button ${morningSlotIndex + 12 >= morningSlots.length ? "disabled" : ""}`}
//                                 onClick={morningSlotIndex + 12 >= morningSlots.length ? null : handleMorningNext}
//                               >
//                                 <BsChevronRight />
//                               </div>
//                             )}
//                           </div>
//                         </Col>

//                         {/* Afternoon Slots */}
//                         <Col md={4} className="slot-column">
//                           <h4 className="slot-title text-center mb-4">Afternoon</h4>
//                           <div className="d-flex align-items-center justify-content-between">
//                             {/* Left Navigation Button for Afternoon */}
//                             {afternoonSlots.length > 12 && (
//                               <div
//                                 className={`custom-nav-button ${afternoonSlotIndex === 0 ? "disabled" : ""}`}
//                                 onClick={afternoonSlotIndex === 0 ? null : handleAfternoonPrevious}
//                               >
//                                 <BsChevronLeft />
//                               </div>
//                             )}

//                             {/* Afternoon Slot Buttons */}
//                             <div className="d-flex flex-wrap justify-content-center slot-buttons-container" style={{ width: "100%" }}>
//                               {afternoonSlots.length > 0 ? (
//                                 afternoonSlots
//                                   .slice(afternoonSlotIndex, afternoonSlotIndex + 12)
//                                   .map((slot) => (
//                                     <Button
//                                       key={slot.id}
//                                       variant="outline-primary"
//                                       className="slot-button mb-2"
//                                       onClick={() => handleSlotClick(slot)}
//                                       style={{ margin: "5px", padding: "10px", textAlign: "center", fontSize: "0.8rem", width: "80px", height: "50px" }}
//                                     >
//                                       {formatTime(slot.appointment_slot)}
//                                     </Button>
//                                   ))
//                               ) : (
//                                 <p className="slot-section-message">No slots available for afternoon</p>
//                               )}
//                             </div>

//                             {/* Right Navigation Button for Afternoon */}
//                             {afternoonSlots.length > 12 && (
//                               <div
//                                 className={`custom-nav-button ${afternoonSlotIndex + 12 >= afternoonSlots.length ? "disabled" : ""}`}
//                                 onClick={afternoonSlotIndex + 12 >= afternoonSlots.length ? null : handleAfternoonNext}
//                               >
//                                 <BsChevronRight />
//                               </div>
//                             )}
//                           </div>
//                         </Col>

//                         {/* Evening Slots */}
//                         <Col md={4} className="slot-column">
//                           <h4 className="slot-title text-center mb-4">Evening</h4>
//                           <div className="d-flex align-items-center justify-content-between">
//                             {/* Left Navigation Button for Evening */}
//                             {eveningSlots.length > 12 && (
//                               <div
//                                 className={`custom-nav-button ${eveningSlotIndex === 0 ? "disabled" : ""}`}
//                                 onClick={eveningSlotIndex === 0 ? null : handleEveningPrevious}
//                               >
//                                 <BsChevronLeft />
//                               </div>
//                             )}

//                             {/* Evening Slot Buttons */}
//                             <div className="d-flex flex-wrap justify-content-center slot-buttons-container" style={{ width: "100%" }}>
//                               {eveningSlots.length > 0 ? (
//                                 eveningSlots
//                                   .slice(eveningSlotIndex, eveningSlotIndex + 12)
//                                   .map((slot) => (
//                                     <Button
//                                       key={slot.id}
//                                       variant="outline-primary"
//                                       className="slot-button mb-2"
//                                       onClick={() => handleSlotClick(slot)}
//                                       style={{ margin: "5px", padding: "10px", textAlign: "center", fontSize: "0.8rem", width: "80px", height: "50px" }}
//                                     >
//                                       {formatTime(slot.appointment_slot)}
//                                     </Button>
//                                   ))
//                               ) : (
//                                 <p className="slot-section-message">No slots available for evening</p>
//                               )}
//                             </div>

//                             {/* Right Navigation Button for Evening */}
//                             {eveningSlots.length > 12 && (
//                               <div
//                                 className={`custom-nav-button ${eveningSlotIndex + 12 >= eveningSlots.length ? "disabled" : ""}`}
//                                 onClick={eveningSlotIndex + 12 >= eveningSlots.length ? null : handleEveningNext}
//                               >
//                                 <BsChevronRight />
//                               </div>
//                             )}
//                           </div>
//                         </Col>
//                       </Row>
//                     </div>
//                   )}
//                 </div>

//               </div>
//             </Modal.Body>
//           </Card>
//         )}
//         <PatientDetailsModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onConfirm={handleConfirmAppointment}
//           onCancel={handleCancelAppointment}
//           handleSaveDetails={handleSaveDetails}
//           name={name}
//           mobile={mobile}
//           dob={dob}
//           age={age}
//           bloodGroup={bloodGroup}
//           gender={gender}
//           address={address}
//           email={email}
//           sameAsAppointment={sameAsAppointment}
//           setName={setName}
//           setMobile={setMobile}
//           setDob={setDob}
//           setAge={setAge}
//           setBloodGroup={setBloodGroup}
//           setGender={setGender}
//           setAddress={setAddress}
//           setEmail={setEmail}
//           setSameAsAppointment={setSameAsAppointment}
//         />
//         {/* {successMessage && <Alert variant="success">{successMessage}</Alert>}
//                 {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} */}

//         <Modal show={showSuccessPopup} centered>
//           <Modal.Body className="text-center">
//             <h4>Appointment Successfully Booked!</h4>
//             <p>Thank you for booking your appointment.</p>
//           </Modal.Body>
//         </Modal>

//         <div className="book-appointment-options-strip">
//           <div
//             className="book-appointment-option"
//             onClick={() => history.push("/patient/home")}
//           >
//             <img
//               src={require("../../images/chat.png")}
//               alt="Consult with a doctor"
//             />
//             <p>Consult with a doctor</p>
//           </div>
//           <div className="book-appointment-divider"></div>
//           <div
//             className="book-appointment-option"
//             onClick={() => history.push("/patient/details")}
//           >
//             <img
//               src={require("../../images/patientrecord.png")}
//               alt="My Details"
//             />
//             <p>My Details</p>
//           </div>
//           <div className="book-appointment-divider"></div>
//           <div
//             className="book-appointment-option"
//             onClick={() => history.push("/patient/slots")}
//           >
//             <img
//               src={require("../../images/calendar.png")}
//               alt="Book Appointments"
//             />
//             <p>Book Appointments</p>
//           </div>
//         </div>

//         <section className="book-appointment-specialization">
//           <h2 className="center-text mt-3" style={{ textAlign: "center" }}>
//             Better Health Starts Here – Consult the Best Doctors Across All
//             Specialties!
//           </h2>
//           <div className="book-appointment-specialty-buttons">
//             {[
//               "All",
//               "Homeopathy",
//               "General Physician",
//               "Orthopedist",
//               "Dermatologist",
//               "Pediatrician",
//               "Dentist",
//               "Neurologist",
//               "Cardiologist",
//             ].map((specialty, index) => (
//               <button
//                 key={index}
//                 className={`book-appointment-specialization-btn ${selectedSpecialty === specialty ? "active" : ""}`}
//                 onClick={() => setSelectedSpecialty(specialty)}
//               >
//                 {specialty}
//               </button>
//             ))}
//           </div>
//           <b>
//             <p
//               style={{
//                 textAlign: "center",
//                 fontSize: "1.2rem",
//                 margin: "20px 0",
//               }}
//             >
//               {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} available
//               in
//               {location?.city && location?.state
//                 ? ` ${location.city}, ${location.state}`
//                 : " your area"}
//             </p>
//           </b>

//           <div className="book-appointment-container mt-0">
//             <div className="book-appointment-inner-container">
//               {/* Doctor List */}
//               <section className="book-appointment-doctor-list">
//                 {currentDoctors.map((doctor) => (
//                   <div className="book-appointment-doctor-card" key={doctor.id}>
//                     <div className="book-appointment-doctor-card-inner">
//                       <div className="book-appointment-doctor-image-container">
//                         <img
//                           src={
//                             doctor.profile_pic
//                               ? `${BaseUrl.defaults.baseURL}${doctor.profile_pic}`
//                               : require("../../images/profileIcon.png")
//                           }
//                           alt={doctor.name}
//                           className="book-appointment-doctor-image"
//                         />
//                       </div>
//                       <div className="book-appointment-doctor-info">
//                         <h3 className="book-appointment-doctor-name">
//                           {" "}
//                           {doctor.name}
//                         </h3>
//                         <p className="book-appointment-doctor-specialization">
//                           {doctor.specialization}
//                         </p>
//                         <p className="book-appointment-doctor-experience">
//                           {doctor.experience}+ years experience
//                         </p>
//                         <p className="book-appointment-doctor-location">
//                           {location.city}, {location.state}
//                         </p>
//                         <p className="book-appointment-doctor-consultation_fee">
//                           ₹{doctor.consultation_fee} Consultation fee at clinic
//                         </p>
//                         <button className="book-appointment-appointment-btn">
//                           Book Appointment
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </section>

//               {/* Pagination Controls - Only show if there are more than 3 doctors */}
//               {doctors.length > 3 && (
//                 <div className="pagination-controls">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="pagination-button"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handlePageChange(index + 1)}
//                       className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="pagination-button"
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div
//             className="book-appointment-booking-note"
//             style={{
//               fontSize: "1.2rem",
//               margin: "20px 0",
//             }}
//           >
//             <FaCheckCircle style={{ marginRight: "10px" }} />
//             Easy booking with a list of accredited doctors.
//           </div>
//         </section>

//         <section className="book-appointment-assistance">
//           <h3>Need Assistance? We're Here to Help!</h3>
//           <div className="book-appointment-contact-box">
//             <button className="book-appointment-phone-button">
//               Call Us at: +911111111111
//             </button>
//             <p>Email Us at: niramayahomeopathy@gmail.com</p>
//           </div>
//         </section>

//         <section className="info-cards">
//           <div
//             className="card banner-card"
//             style={{
//               backgroundImage: `url(${require("../../images/banner.png")})`,
//             }}
//           >
//             <h4>
//               Your Health, Our Mission – <br></br>
//               Experts in Every Field of Medicine!
//             </h4>
//             <button className="appointment-button">
//               <i>Get a confirmed appointment now!</i>
//             </button>
//             <div className="experience">
//               <img
//                 src={require("../../images/quality.png")}
//                 alt="Quality Icon"
//                 className="experience-icon"
//               />
//               <p>Doctors with 10+ Years Experience</p>
//             </div>
//           </div>

//           <div className="card details-card">
//             <h4>Book appointments instantly with trusted doctors.</h4>
//             <ul className="details-list">
//               <li>30,000+ Verified Doctors</li>
//               <li>2M+ Patient Recommendations</li>
//               <li>12M Satisfied Patient Annually</li>
//             </ul>
//             <button className="appointment-book-button">
//               [BOOK YOUR APPOINTMENT NOW]
//             </button>
//           </div>
//         </section>

//         <div className="faq-container">
//           <div
//             className="faq-newww"
//             style={{
//               display: "flex",
//               backgroundColor: "white",
//               padding: "10px",
//               borderRadius: "10px",
//             }}
//           >
//             <div className="faq-icon">
//               <img src={require("../../images/FAQs.png")} alt="FAQ" />
//             </div>
//             <div className="faq-content">
//               <h2>Frequently Asked Questions</h2>
//               <p>
//                 Looking for help? Here are our most frequently asked questions
//               </p>
//               <div className="faq-item" onClick={() => toggleAnswer(1)}>
//                 <div className="faq-question">
//                   How can I book an appointment?
//                   <span className="icon">
//                     <FontAwesomeIcon
//                       icon={expanded === 1 ? faAngleUp : faAngleDown}
//                     />
//                   </span>
//                 </div>
//                 {expanded === 1 && (
//                   <div className="faq-answer">
//                     You can book an appointment through our website or by
//                     calling our customer service.
//                   </div>
//                 )}
//               </div>
//               <div className="faq-item" onClick={() => toggleAnswer(2)}>
//                 <div className="faq-question">
//                   What should I bring for my appointment?
//                   <span className="icon">
//                     <FontAwesomeIcon
//                       icon={expanded === 2 ? faAngleUp : faAngleDown}
//                     />
//                   </span>
//                 </div>
//                 {expanded === 2 && (
//                   <div className="faq-answer">
//                     Please bring your ID, insurance information, and any
//                     relevant medical records.
//                   </div>
//                 )}
//               </div>
//               <div className="faq-item" onClick={() => toggleAnswer(3)}>
//                 <div className="faq-question">
//                   Can I get test results online?
//                   <span className="icon">
//                     <FontAwesomeIcon
//                       icon={expanded === 3 ? faAngleUp : faAngleDown}
//                     />
//                   </span>
//                 </div>
//                 {expanded === 3 && (
//                   <div className="faq-answer">
//                     Yes, test results are available online through our secure
//                     portal.
//                   </div>
//                 )}
//               </div>
//               <div className="faq-item" onClick={() => toggleAnswer(4)}>
//                 <div className="faq-question">
//                   Who can I contact for support or questions?
//                   <span className="icon">
//                     <FontAwesomeIcon
//                       icon={expanded === 4 ? faAngleUp : faAngleDown}
//                     />
//                   </span>
//                 </div>
//                 {expanded === 4 && (
//                   <div className="faq-answer">
//                     For questions, please reach out to our customer service team
//                     via phone or email.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Form, Modal, Alert } from "react-bootstrap";
import { load } from "@cashfreepayments/cashfree-js";
import clinicVisitImage from "../../images/a-53-512.webp";
import onlineConsultationImage from "../../images/2562653-200.png";
import BaseUrl from "../../api/BaseUrl";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { format, addDays } from "date-fns";

const BookAppointment = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [showSlots, setShowSlots] = useState(false);
  const [name, setName] = useState("");
  const [mobile_number, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [morningIndex, setMorningIndex] = useState(0);
  const [afternoonIndex, setAfternoonIndex] = useState(0);
  const [eveningIndex, setEveningIndex] = useState(0);
  const slotsPerPage = 4;

  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const categorizeSlots = (slots) => {
    const morningSlots = slots.filter((slot) => {
      const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
      return hours < 12;
    });
    const afternoonSlots = slots.filter((slot) => {
      const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
      return hours >= 12 && hours < 17;
    });
    const eveningSlots = slots.filter((slot) => {
      const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
      return hours >= 17;
    });
    return { morningSlots, afternoonSlots, eveningSlots };
  };

  const [slots, setSlots] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });

  const doctorId = 2;

  useEffect(() => {
    loadAvailableDates();
    initializeCashfree();
  }, []);

  const initializeCashfree = async () => {
    await load({ mode: "sandbox" });
  };

  const loadAvailableDates = () => {
    const today = new Date();
    const dates = [
      format(today, "yyyy-MM-dd"),
      format(addDays(today, 1), "yyyy-MM-dd"),
      format(addDays(today, 2), "yyyy-MM-dd"),
    ];
    setAvailableDates(dates);
  };
  const handleNext = (setIndex, index, slotArray) => {
    if (index + slotsPerPage < slotArray.length) {
      setIndex(index + slotsPerPage);
    }
  };

  const handlePrev = (setIndex, index) => {
    if (index - slotsPerPage >= 0) {
      setIndex(index - slotsPerPage);
    }
  };

  useEffect(() => {
    // Set available dates
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) =>
      format(addDays(today, i), "yyyy-MM-dd")
    );
    setAvailableDates(dates);

    // Fetch today's slots and counts
    fetchAvailableSlotsCount(dates.slice(0, 3)); // Fetch counts for Today, Tomorrow, Next Day
    fetchSlots(dates[0]); // Fetch slots for today
  }, []);

  const fetchAvailableSlotsCount = async (selectedDates) => {
    try {
      const datesQuery = selectedDates.map((date) => `dates=${date}`).join("&");
      const endpoint = `/clinic/countavailableslots/?doctor_id=2&${datesQuery}`;
      const countResponse = await BaseUrl.get(endpoint);
      const availableCounts = countResponse.data; // Assuming this returns an array of counts for the dates
      console.log("Available counts for selected dates:", availableCounts);
      // You can set this data to the state or handle it as needed
    } catch (error) {
      console.error("Error fetching available slots count:", error);
    }
  };

  const fetchSlots = async (selectedDate, appointmentType) => {
    try {
      const endpoint = `/doctorappointment/blankslot/?doctor_id=2&slot_date=${selectedDate}&consultation_type=${appointmentType}`;
      const slotsResponse = await BaseUrl.get(endpoint);
      const fetchedSlots = slotsResponse.data;
      const { morningSlots, afternoonSlots, eveningSlots } =
        categorizeSlots(fetchedSlots);
      setSlots({
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
      });
      setShowSlots(true);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const handleDateNavigation = (direction) => {
    if (direction === "prev" && currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
      fetchSlots(availableDates[currentDateIndex - 1]);
    } else if (
      direction === "next" &&
      currentDateIndex + 1 < availableDates.length
    ) {
      setCurrentDateIndex(currentDateIndex + 1);
      fetchSlots(availableDates[currentDateIndex + 1]);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    localStorage.setItem("appointmentSlotId", slot.id);
    setIsFormVisible(true);
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const ageRegex = /^[0-9]{1,3}$/;

    if (!name || !nameRegex.test(name)) {
      setErrorMessage("Name should only contain alphabets and spaces.");
      return false;
    }
    if (!mobile_number || !mobileRegex.test(mobile_number)) {
      setErrorMessage("Mobile number must be exactly 10 digits.");
      return false;
    }
    if (!age || !ageRegex.test(age) || parseInt(age, 10) > 150) {
      setErrorMessage("Age must be a number between 0 and 150.");
      return false;
    }
    if (
      appointmentType === "online" &&
      (!email || !/\S+@\S+\.\S+/.test(email))
    ) {
      setErrorMessage("Valid email is mandatory for online consultations.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const patchPatientData = async (appointmentId) => {
    try {
      const storedPatientId = localStorage.getItem("patientId");
      const patchResponse = await BaseUrl.patch("/patient/patient/", {
        appointment: appointmentId,
        patient_id: storedPatientId,
      });
    } catch (error) {
      setErrorMessage("Error updating patient data.");
    }
  };

  const bookSlot = async () => {
    const storedPatientId = localStorage.getItem("patientId");
    const storedAppointmentSlotId = localStorage.getItem("appointmentSlotId");

    try {
      const bookingResponse = await BaseUrl.post(
        "/patientappointment/bookslot/",
        {
          patient: storedPatientId,
          doctor: doctorId,
          appointment_slot: storedAppointmentSlotId,
          consultation_type:
            appointmentType === "clinic" ? "walk-in" : "online",
        }
      );

      if (bookingResponse.status === 200 || bookingResponse.status === 201) {
        const successMsg = bookingResponse.data.success;
        showMessageInModal(successMsg);
        setSuccessMessage(successMsg);
        localStorage.removeItem("orderId");
      }
    } catch (error) {
      setErrorMessage("Failed to book appointment. Please try again.");
    }
  };

  const showMessageInModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // Save patient details
      const patientResponse = await BaseUrl.post("/patient/patient/", {
        name,
        mobile_number,
        age,
        blood_group: bloodGroup,
        gender,
        address,
        email,
        doctor_id: doctorId,
      });

      const fetchedPatientId = patientResponse.data?.data?.id;
      localStorage.setItem("patientId", fetchedPatientId);

      // Create payment session
      const paymentResponse = await BaseUrl.post("/payment/create/", {
        amount: "1000",
        currency: "INR",
        customer_name: name,
        customer_phone: mobile_number,
        patient_id: fetchedPatientId, // Include patient ID in payment API
      });

      const paymentSessionId = paymentResponse.data?.payment_session_id;
      const newOrderId = paymentResponse.data?.order_id;
      localStorage.setItem("orderId", newOrderId);

      // Trigger payment gateway
      await triggerPaymentGateway(paymentSessionId);
    } catch (error) {
      setErrorMessage("Error during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPaymentGateway = async (paymentSessionId) => {
    try {
      const cashfree = await load({ mode: "sandbox" });
      await cashfree.checkout({
        paymentSessionId,
        returnUrl: "http://localhost:3000/patientbook",
      });

      await pollPaymentStatus();
    } catch (error) {
      setErrorMessage("Failed to initiate payment gateway.");
    }
  };

  const pollPaymentStatus = async () => {
    try {
      const storedOrderId = localStorage.getItem("orderId");
      const response = await BaseUrl.get(
        `/payment/get/?order_id=${storedOrderId}`
      );
      if (response.data?.status === "SUCCESS") {
        await bookSlot();
        localStorage.removeItem("orderId");
        showMessageInModal("Appointment booked successfully!");
        setSuccessMessage("Appointment booked successfully!");
      } else if (response.data?.status === "PENDING") {
        setTimeout(pollPaymentStatus, 5000);
      } else {
        setErrorMessage("Payment failed. Please try again.");
        localStorage.removeItem("orderId");
      }
    } catch (error) {
      setErrorMessage();
    }
  };

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      const orderId = localStorage.getItem("orderId");
      try {
        setLoading(true);
        const response = await BaseUrl.get(`/payment/get/?order_id=${orderId}`);
        if (response.data?.status === "SUCCESS") {
          await bookSlot();
          setSuccessMessage("");
        } else {
          setErrorMessage("");
        }
      } catch (error) {
        setErrorMessage();
      } finally {
        setLoading(false);
      }
    };

    handlePaymentConfirmation();
  }, []);

  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) =>
      format(addDays(today, i), "yyyy-MM-dd")
    );
    setAvailableDates(dates);
  }, []);

  return (
    <div
      className="book-appointment-container min-vh-100"
      style={{
        backgroundColor: "#D7EAF0",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#3D9F41",
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "50px",
        }}
      >
        Niramaya Homeopathy
      </h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="d-flex justify-content-center mb-5">
        {/* Clinic Visit Card */}
        <Card
          className="clinic-visit-card mx-3 shadow text-center"
          style={{
            width: "288px",
            height: "92px",
            cursor: "pointer",
            marginBottom: "50px",
            backgroundColor:
              appointmentType === "clinic" ? "#FFFFFF" : "#3D9F41",
            color: appointmentType === "clinic" ? "#003F7D" : "#FFFFFF",
            border: appointmentType === "clinic" ? "2px solid #3D9F41" : "none",
          }}
          onClick={() => {
            setAppointmentType("clinic");
            localStorage.setItem("appointmentType", "clinic"); // Store in localStorage
            const selectedDate = availableDates[currentDateIndex]; // Get current selected date
            fetchSlots(selectedDate, "clinic"); // Fetch slots for the selected date and type
            console.log("Appointment Type Set to: Clinic Visit");
          }}
        >
          <Card.Body className="d-flex align-items-center justify-content-center">
            <Card.Img
              src={clinicVisitImage}
              alt="Clinic Visit"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
              }}
            />
            <div>
              <Card.Title style={{ fontSize: "14px", marginBottom: "5px" }}>
                CLINIC VISIT
              </Card.Title>
              <Card.Text style={{ fontSize: "12px" }}>
                Book Physical Appointment
              </Card.Text>
            </div>
          </Card.Body>
        </Card>

        {/* Online Consultation Card */}
        <Card
          className="online-consultation-card mx-3 shadow text-center"
          style={{
            width: "288px",
            height: "92px",
            cursor: "pointer",
            marginBottom: "50px",
            backgroundColor:
              appointmentType === "online" ? "#FFFFFF" : "#3D9F41",
            color: appointmentType === "online" ? "#003F7D" : "#FFFFFF",
            border: appointmentType === "online" ? "2px solid #3D9F41" : "none",
          }}
          onClick={() => {
            setAppointmentType("online");
            localStorage.setItem("appointmentType", "online"); // Store in localStorage
            const selectedDate = availableDates[currentDateIndex]; // Get current selected date
            fetchSlots(selectedDate, "online"); // Fetch slots for the selected date and type
            console.log("Appointment Type Set to: Online Consultation");
          }}
        >
          <Card.Body className="d-flex align-items-center justify-content-center">
            <Card.Img
              src={onlineConsultationImage}
              alt="Consult Online"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
              }}
            />
            <div>
              <Card.Title style={{ fontSize: "14px", marginBottom: "5px" }}>
                CONSULT ONLINE
              </Card.Title>
              <Card.Text style={{ fontSize: "12px" }}>
                Talk to Doctor Online
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div
        className="date-navigation-container d-flex align-items-center justify-content-center mb-5"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={() => handleDateNavigation("prev")}
          style={{ marginRight: "10px", cursor: "pointer" }}
          disabled={currentDateIndex === 0}
        >
          &#8592;
        </Button>

        <div
          className="date-button-row d-flex overflow-auto"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
          }}
        >
          {availableDates
            .slice(currentDateIndex, currentDateIndex + 5)
            .map((date, index) => (
              <Button
                key={index}
                variant="outline-primary"
                onClick={() => {
                  setCurrentDateIndex(index + currentDateIndex);
                  fetchSlots(date);
                }}
                style={{
                  margin: "0 10px",
                  backgroundColor:
                    index + currentDateIndex === currentDateIndex
                      ? "#3D9F41"
                      : "#fff",
                  color:
                    index + currentDateIndex === currentDateIndex
                      ? "#fff"
                      : "#000",
                  borderColor: "#3D9F41",
                }}
              >
                {index + currentDateIndex === 0
                  ? "Today"
                  : index + currentDateIndex === 1
                    ? "Tomorrow"
                    : format(new Date(date), "MMM dd")}
              </Button>
            ))}
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => handleDateNavigation("next")}
          style={{ marginLeft: "10px", cursor: "pointer" }}
          disabled={currentDateIndex + 5 >= availableDates.length}
        >
          &#8594;
        </Button>
      </div>

      <div className="slot-section">
        {slots && slots.length > 0 ? (
          <>
            <h4 className="slot-section-header">Available Slots</h4>
            <div className="slot-row d-flex overflow-auto mb-3">
              {slots.map((slot) => (
                <Button
                  key={slot.id}
                  variant="outline-primary"
                  className="slot-button mx-2"
                  onClick={() => handleSlotClick(slot)}
                >
                  {slot.appointment_slot}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center mt-4"></p>
        )}
      </div>

      <div className="slot-section">
        {slots && slots.length > 0 ? (
          <>
            <h4 className="slot-section-header">Available Slots</h4>
            <div className="slot-row d-flex overflow-auto mb-3">
              {slots.map((slot) => (
                <Button
                  key={slot.id}
                  variant="outline-primary"
                  className="slot-button mx-2"
                  onClick={() => handleSlotClick(slot)}
                >
                  {slot.appointment_slot}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center mt-4"></p>
        )}
      </div>

      <h2 className="text-center" style={{ fontWeight: "700" }}>
        Available Slots
      </h2>

      <Row className="text-center mb-3 mt-5">
        {/* Morning Slots */}
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <FaArrowLeft
              onClick={() => handlePrev(setMorningIndex, morningIndex)}
              style={{
                cursor: "pointer",
                visibility: morningIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>
              Morning Slots
            </h4>
            <FaArrowRight
              onClick={() =>
                handleNext(setMorningIndex, morningIndex, slots.morning)
              }
              style={{
                cursor: "pointer",
                visibility:
                  morningIndex + slotsPerPage < slots.morning.length
                    ? "visible"
                    : "hidden",
              }}
            />
          </div>
          <div>
            {slots.morning.length > 0 ? (
              <>
                {Array.from(
                  {
                    length: Math.ceil(
                      slots.morning.slice(morningIndex, morningIndex + 16)
                        .length / 4
                    ),
                  } // 4 slots per row, max 8 slots
                ).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="d-flex justify-content-center flex-wrap"
                  >
                    {slots.morning
                      .slice(
                        morningIndex + rowIndex * 4,
                        morningIndex + (rowIndex + 1) * 4
                      )
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline-primary"
                          className="slot-button mx-2 my-2"
                          onClick={() => handleSlotClick(slot)}
                          style={{
                            backgroundColor:
                              selectedSlot?.id === slot.id
                                ? "#B8E8B1"
                                : "#FFFFFF",
                            color: "#000000",
                            borderColor: "#3D9F41",
                          }}
                        >
                          {formatTime(slot.appointment_slot)}
                        </Button>
                      ))}
                  </div>
                ))}
              </>
            ) : (
              <p style={{ color: "red" }}>No slots available</p>
            )}
          </div>
        </Col>

        {/* Afternoon Slots */}
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <FaArrowLeft
              onClick={() => handlePrev(setAfternoonIndex, afternoonIndex)}
              style={{
                cursor: "pointer",
                visibility: afternoonIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>
              Afternoon Slots
            </h4>
            <FaArrowRight
              onClick={() =>
                handleNext(setAfternoonIndex, afternoonIndex, slots.afternoon)
              }
              style={{
                cursor: "pointer",
                visibility:
                  afternoonIndex + slotsPerPage < slots.afternoon.length
                    ? "visible"
                    : "hidden",
              }}
            />
          </div>
          <div>
            {slots.afternoon.length > 0 ? (
              <>
                {Array.from(
                  {
                    length: Math.ceil(
                      slots.afternoon.slice(afternoonIndex, afternoonIndex + 16)
                        .length / 4
                    ),
                  } // 4 slots per row, max 8 slots
                ).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="d-flex justify-content-center flex-wrap"
                  >
                    {slots.afternoon
                      .slice(
                        afternoonIndex + rowIndex * 4,
                        afternoonIndex + (rowIndex + 1) * 4
                      )
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline-primary"
                          className="slot-button mx-2 my-2"
                          onClick={() => handleSlotClick(slot)}
                          style={{
                            backgroundColor:
                              selectedSlot?.id === slot.id
                                ? "#B8E8B1"
                                : "#FFFFFF",
                            color: "#000000",
                            borderColor: "#3D9F41",
                          }}
                        >
                          {formatTime(slot.appointment_slot)}
                        </Button>
                      ))}
                  </div>
                ))}
              </>
            ) : (
              <p style={{ color: "red" }}>No slots available</p>
            )}
          </div>
        </Col>

        {/* Evening Slots */}
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <FaArrowLeft
              onClick={() => handlePrev(setEveningIndex, eveningIndex)}
              style={{
                cursor: "pointer",
                visibility: eveningIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>
              Evening Slots
            </h4>
            <FaArrowRight
              onClick={() =>
                handleNext(setEveningIndex, eveningIndex, slots.evening)
              }
              style={{
                cursor: "pointer",
                visibility:
                  eveningIndex + slotsPerPage < slots.evening.length
                    ? "visible"
                    : "hidden",
              }}
            />
          </div>
          <div>
            {slots.evening.length > 0 ? (
              <>
                {Array.from(
                  {
                    length: Math.ceil(
                      slots.evening.slice(eveningIndex, eveningIndex + 16)
                        .length / 4
                    ),
                  } // 4 slots per row, max 8 slots
                ).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="d-flex justify-content-center flex-wrap"
                  >
                    {slots.evening
                      .slice(
                        eveningIndex + rowIndex * 4,
                        eveningIndex + (rowIndex + 1) * 4
                      )
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline-primary"
                          className="slot-button mx-2 my-2"
                          onClick={() => handleSlotClick(slot)}
                          style={{
                            backgroundColor:
                              selectedSlot?.id === slot.id
                                ? "#B8E8B1"
                                : "#FFFFFF",
                            color: "#000000",
                            borderColor: "#3D9F41",
                          }}
                        >
                          {formatTime(slot.appointment_slot)}
                        </Button>
                      ))}
                  </div>
                ))}
              </>
            ) : (
              <p style={{ color: "red" }}>No slots available</p>
            )}
          </div>
        </Col>
      </Row>

      {isFormVisible && (
        <Card
          className="form-card p-4 shadow mt-4"
          style={{
            backgroundColor: "#E8F4F8",
            borderRadius: "10px",
            width: "70%",
            margin: "0 auto",
          }}
        >
          <h5
            className="text-center"
            style={{
              color: "#003F7D",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Fill Your Details
          </h5>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => {
                      const regex = /^[A-Za-z\s]*$/;
                      if (regex.test(e.target.value)) setName(e.target.value);
                    }}
                    placeholder="Name"
                    style={{
                      borderColor: name ? "#3D9F41" : "green",
                      borderRadius: "5px",
                    }}
                  />
                  {!name && (
                    <small className="text-success">
                      Name is required and should only contain alphabets.
                    </small>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    value={mobile_number}
                    onChange={(e) => {
                      const regex = /^[0-9]*$/;
                      if (
                        regex.test(e.target.value) &&
                        e.target.value.length <= 10
                      ) {
                        setMobile(e.target.value);
                      }
                    }}
                    placeholder="Mobile"
                    style={{
                      borderColor:
                        mobile_number.length === 10 ? "#3D9F41" : "green",
                      borderRadius: "5px",
                    }}
                  />
                  {(!mobile_number || mobile_number.length !== 10) && (
                    <small className="text-success">
                      Mobile number must be exactly 10 digits.
                    </small>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    value={age}
                    onChange={(e) => {
                      const regex = /^[0-9]*$/;
                      const value = parseInt(e.target.value, 10);
                      if (
                        regex.test(e.target.value) &&
                        (isNaN(value) || value <= 150)
                      ) {
                        setAge(e.target.value);
                      }
                    }}
                    placeholder="Age"
                    style={{
                      borderColor:
                        age && parseInt(age, 10) <= 150 ? "#3D9F41" : "green",
                      borderRadius: "5px",
                    }}
                  />
                  {(!age || parseInt(age, 10) > 150) && (
                    <small className="text-success">
                      Age must be a number between 0 and 150.
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Control
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="Blood Group"
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {appointmentType === "online" && (
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      style={{
                        borderColor:
                          email && /\S+@\S+\.\S+/.test(email)
                            ? "#3D9F41"
                            : "red",
                        borderRadius: "5px",
                      }}
                    />
                    {(!email || !/\S+@\S+\.\S+/.test(email)) && (
                      <small className="text-danger">
                        Valid email is required for online consultations.
                      </small>
                    )}
                  </Form.Group>
                </Col>
              )}
            </Row>
            <div className="text-center mt-4">
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !name ||
                  !mobile_number ||
                  !age ||
                  (appointmentType === "online" && !email)
                }
                style={{
                  width: "150px",
                  backgroundColor: "#3D9F41",
                  borderRadius: "20px",
                  borderColor: "#3D9F41",
                }}
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Card>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment;
