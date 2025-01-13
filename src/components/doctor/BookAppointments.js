


// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import { format, addDays } from "date-fns";
// import { Modal, Button } from "react-bootstrap";
// import Loader from "react-js-loader";
// import styled from "styled-components";
// import { isValidPhoneNumber } from "react-phone-number-input";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";

// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: rgba(255, 255, 255, 0.7); /* Slightly opaque background */
//   position: fixed;
//   width: 100%;
//   top: 0;
//   left: 0;
//   z-index: 9999;
// `;

// const LoaderImage = styled.div`
//   width: 100px;
// `;

// const BookAppointment = () => {
//   const [doctorName, setDoctorName] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [selectedDoctorId, setSelectedDoctorId] = useState("");
//   const [selectedDate, setSelectedDate] = useState(
//     format(new Date(), "yyyy-MM-dd")
//   );
//   const [slots, setSlots] = useState([]);
//   const [showSlots, setShowSlots] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [patientId, setPatientId] = useState(null);
//   const [slotCount, setSlotCount] = useState({});
//   const today = new Date().toISOString().split("T")[0];
//   const [searchResults, setSearchResults] = useState([]);
//   const [appointmentId, setAppointmentId] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [datesToFetch, setDatesToFetch] = useState([]);
//   const [doctorId, setDoctorId] = useState("");
//   const [loading, setLoading] = useState(false); // Loader state
//   const [patientDetails, setPatientDetails] = useState({
//     name: "",
//     mobile_number: "",
//     date_of_birth: "",
//     age: "",
//     blood_group: "",
//     gender: "",
//     address: "",
//   });
//   const [formErrors, setFormErrors] = useState({
//     name: "",
//     mobile_number: "",
//     age: "",
//     address: "",
//     gender: "",
//     date_of_birth: "",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const slotsPerPage = 30;

//   const startIdx = (currentPage - 1) * slotsPerPage;
//   const endIdx = startIdx + slotsPerPage;

//   const currentSlots = slots.slice(startIdx, endIdx);

//   const handleNextPage = () => {
//     if (endIdx < slots.length) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const doctor_id = decodedToken.doctor_id;
//         setSelectedDoctorId(doctor_id);
//         setDoctorId(doctor_id);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedDoctorId) {
//       fetchDoctorName(selectedDoctorId);
//     }
//   }, [selectedDoctorId]);

//   const fetchDoctorName = async (doctorId) => {
//     setLoading(true);
//     try {
//       const response = await BaseUrl.get(
//         `/doctor/doctorname/?doctor_id=${doctorId}`
//       );

//       if (response.status === 200 && response.data.length > 0) {
//         setDoctorName(response.data[0].name);
//         setErrorMessage("");
//       } else if (response.status === 404) {
//         setErrorMessage(response.data.error);
//       } else {
//         setErrorMessage("");
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setErrorMessage(error.response.data.error);
//       } else {
//         setErrorMessage("");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPatientDetails({
//       ...patientDetails,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const errors = {};
//     const nameRegex = /^[A-Za-z\s]+$/;

//     if (!nameRegex.test(patientDetails.name)) {
//       errors.name = "Name must contain only alphabets and spaces.";
//     }
//     if (!isValidPhoneNumber(patientDetails.mobile_number)) {
//       errors.mobile_number = "Please enter a valid mobile number.";
//     }
//     if (!patientDetails.age || Number(patientDetails.age) <= 0) {
//       errors.age = "Age must be a positive number.";
//     }
//     if (!patientDetails.address.trim()) {
//       errors.address = "Address is required.";
//     }
//     if (!patientDetails.gender) {
//       errors.gender = "Gender is required.";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSaveDetails = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await BaseUrl.post("/patient/patient/", {
//         ...patientDetails,
//         mobile_number: patientDetails.mobile_number, // Includes country code
//       });

//       if (response.data.success) {
//         setSuccessMessage(response.data.success);
//         setErrorMessage("");
//         setPatientId(response.data.data.id);
//       } else {
//         setErrorMessage(response.data.error);
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setErrorMessage(error.response.data.error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleSlotCount = async () => {
//       if (!doctorId) return;

//       setLoading(true);

//       try {
//         const dates = [
//           format(new Date(), "yyyy-MM-dd"),
//           format(addDays(new Date(), 1), "yyyy-MM-dd"),
//           format(addDays(new Date(), 2), "yyyy-MM-dd"),
//         ];

//         const response = await BaseUrl.get(
//           `/clinic/countavailableslots/?doctor_id=${doctorId}&dates=${dates.join("&dates=")}`
//         );

//         if (response.status === 200) {
//           const counts = {};
//           response.data.forEach((item) => {
//             counts[item.date] = item.count;
//           });
//           setSlotCount(counts);
//           setErrorMessage("");
//         } else {
//           setSlotCount({});
//           setErrorMessage(response.data.error);
//         }
//       } catch (error) {
//         setSlotCount({});
//         setErrorMessage(error.response?.data?.error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleSlotCount();
//   }, [doctorId]);

//   const getSlotCountStyle = (count) => {
//     return { color: count === 0 ? "red" : "green" };
//   };

//   const handleToday = () => {
//     const today = new Date();
//     setSelectedDate(today);
//     setDatesToFetch([format(today, "yyyy-MM-dd")]);
//     handleViewSlots(today);
//   };

//   const handleTomorrow = () => {
//     const tomorrow = addDays(new Date(), 1);
//     setSelectedDate(tomorrow);
//     setDatesToFetch([format(tomorrow, "yyyy-MM-dd")]);
//     handleViewSlots(tomorrow);
//   };

//   const handleDayAfterTomorrow = () => {
//     const dayAfterTomorrow = addDays(new Date(), 2);
//     setSelectedDate(dayAfterTomorrow);
//     setDatesToFetch([format(dayAfterTomorrow, "yyyy-MM-dd")]);
//     handleViewSlots(dayAfterTomorrow);
//   };

//   const handleViewSlots = async (date) => {
//     if (!doctorId) {
//       setErrorMessage("Doctor ID is missing");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formattedDate = format(date, "yyyy-MM-dd");
//       const response = await BaseUrl.get(
//         `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${formattedDate}`
//       );

//       if (response.status === 200) {
//         setSlots(response.data);
//         setShowSlots(true);
//         setErrorMessage("");
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "An error occurred while fetching slots."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderSlots = (slots) => {
//     return slots.map((slot, index) => (
//       <div className="col-md-2 mb-2" key={index}>
//         <div
//           className={`btn ${selectedSlot === slot ? "btn-success" : "btn-outline-primary"} w-100`}
//           onClick={() => handleSlotClick(slot)}
//         >
//           {format(new Date(`1970-01-01T${slot.appointment_slot}`), "hh:mm a")}
//         </div>
//       </div>
//     ));
//   };

//   const handleSlotClick = (slot) => {
//     setSelectedSlot(slot);
//     setAppointmentId(slot.id);
//     setIsModalOpen(true);
//   };

//   const handleConfirmAppointment = async () => {
//     try {
//       const response = await BaseUrl.post("/doctor/doctorbook/", {
//         doctor: selectedDoctorId,
//         patient: patientId,
//         appointment_status: "upcoming",
//         appointment_slot: selectedSlot.id,
//       });

//       if (response.status === 200 || response.status === 201) {
//         setSuccessMessage(response.data.success);
//         await patchPatientAppointment(); // Call the PATCH API after successful booking
//         setIsModalOpen(false);
//       } else {
//         setErrorMessage(response.data.error);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error);
//     }
//   };

//   const patchPatientAppointment = async () => {
//     setLoading(true);
//     try {
//       const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
//         patient_id: patientId,
//         appointment: appointmentId,
//       });

//       if (patchResponse.data.success) {
//         setSuccessMessage(patchResponse.data.success);
//       } else {
//         setErrorMessage(patchResponse.data.error);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelAppointment = () => {
//     setIsModalOpen(false);
//   };

//   const handleSearchInputChange = (e) => {
//     const { value } = e.target;
//     setSearchInput(value);
//     if (value.trim() !== "") {
//       handleSearch(value);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleSearch = async (query) => {
//     try {
//       const response = await BaseUrl.get(
//         `/clinic/patientsearch/?query=${query}`
//       );
//       if (response.status === 200) {
//         setSearchResults(response.data);
//         setErrorMessage("");
//       } else {
//         setSearchResults([]);
//         setErrorMessage("Failed to fetch search results");
//       }
//     } catch (error) {
//       setSearchResults([]);
//       setErrorMessage(
//         error.response?.data?.error ||
//           "An error occurred while fetching search results."
//       );
//     }
//   };

//   const handleSelectPatient = async (patient) => {
//     const appointmentId = patient.appointment;
//     const patientId = patient.patient;

//     try {
//       const response = await BaseUrl.get(
//         `/patient/patient/?appointment_id=${appointmentId}&patient_id=${patientId}`
//       );
//       if (response.status === 200) {
//         const patientData = response.data;
//         setPatientDetails({
//           name: patientData.name,
//           mobile_number: patientData.mobile_number.toString(),
//           date_of_birth: patientData.date_of_birth,
//           age: String(patientData.age),
//           blood_group: patientData.blood_group,
//           gender: patientData.gender,
//           address: patientData.address,
//         });

//         // Set the patient ID here
//         setPatientId(patientData.id);

//         setErrorMessage("");
//       } else {
//         setErrorMessage("Failed to fetch patient details");
//       }
//     } catch (error) {
//       setErrorMessage("An error occurred while fetching patient details.");
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (searchResults.length > 0) {
//       const searchResultsElement = document.getElementById("searchResults");
//       if (
//         searchResultsElement &&
//         !searchResultsElement.contains(event.target)
//       ) {
//         setSearchResults([]);
//       }
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [searchResults]);
//   const totalPages = Math.ceil(slots.length / slotsPerPage);

//   const renderSearchResults = () => {
//     return (
//       <div
//         id="searchResults"
//         className="search-results mt-3"
//         style={{
//           position: "absolute",
//           top: "40px",
//           left: "0",
//           zIndex: "100",
//           width: "300px",
//           maxHeight: "300px",
//           overflowY: "auto",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//           backgroundColor: "#fff",
//           boxShadow: "0 0 5px rgba(0,0,0,0.1)",
//         }}
//       >
//         {searchResults.map((result, index) => (
//           <div
//             key={index}
//             className="search-result-item"
//             style={{
//               cursor: "pointer",
//               padding: "5px",
//               backgroundColor: "#f0f0f0",
//               borderBottom:
//                 index !== searchResults.length - 1 ? "1px solid #ddd" : "none",
//             }}
//             onClick={() => handleSelectPatient(result)}
//           >
//             <p>
//               <strong>Name:</strong> {result.name}
//             </p>
//             <p>
//               <strong>Mobile Number:</strong> {result.mobile_number}
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container-fluid">
//       {/* Loader Component */}
//       {loading && (
//         <LoaderWrapper>
//           <LoaderImage>
//             <Loader
//               type="spinner-circle"
//               bgColor={"#0091A5"}
//               color={"#0091A5"}
//               title={"Loading..."}
//               size={100}
//             />
//           </LoaderImage>
//         </LoaderWrapper>
//       )}

//       <div
//         style={{
//           padding: "20px",
//           borderRadius: "8px",
//         }}
//       >
//         {" "}
//         {errorMessage && (
//           <div className="alert alert-danger">{errorMessage}</div>
//         )}
//         {successMessage && (
//           <div className="alert alert-success">{successMessage}</div>
//         )}
//         <div className="container">
//           <div className="col-12 text-center">
//             <h2
//               style={{
//                 paddingBottom: "32px",
//                 fontWeight: "600",
//                 color: "#0C1187",
//               }}
//             >
//               Book Appointment
//             </h2>
//           </div>

//           <div className="row justify-content-center mb-5">
//             <div className="col-12 col-md-6">
//               <div className="d-flex position-relative">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search by Patient Name / Mobile"
//                   value={searchInput}
//                   onChange={handleSearchInputChange}
//                   style={{
//                     width: "100%",
//                     position: "relative",
//                     overflow: "hidden",
//                     border: "2px solid blue",
//                   }}
//                 />
//                 {searchResults.length > 0 && renderSearchResults()}
//               </div>
//             </div>
//           </div>
//         </div>
//         <form onSubmit={handleSaveDetails}>
//           <div className="row g-4">
//             <div className="col-md-3">
//               <label htmlFor="name" className="form-label fw-bold">
//                 Name<span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="name"
//                 name="name"
//                 value={patientDetails.name}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (/^[a-zA-Z\s.]*$/.test(value)) {
//                     handleInputChange(e);
//                   }
//                 }}
//                 placeholder="Enter full name"
//                 required
//               />
//             </div>

//             <div className="col-md-3">
//               <label htmlFor="mobile_number" className="form-label fw-bold">
//                 Mobile Number<span className="text-danger">*</span>
//               </label>
//               <PhoneInput
//                 id="mobile_number"
//                 name="mobile_number"
//                 placeholder="Enter mobile number"
//                 defaultCountry="IN" 
//                 value={patientDetails.mobile_number}
//                 onChange={(value) =>
//                   setPatientDetails((prevDetails) => ({
//                     ...prevDetails,
//                     mobile_number: value,
//                   }))
//                 }
//                 required
//               />
//             </div>

//             <div className="col-md-3">
//               <label htmlFor="date_of_birth" className="form-label fw-bold">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 className="form-control"
//                 id="date_of_birth"
//                 name="date_of_birth"
//                 value={patientDetails.date_of_birth}
//                 onChange={handleInputChange}
//                 max={today}
//               />
//             </div>

//             <div className="col-md-3">
//               <label htmlFor="age" className="form-label fw-bold">
//                 Age<span className="text-danger">*</span>
//               </label>
//               <input
//                 type="number"
//                 className="form-control"
//                 id="age"
//                 name="age"
//                 value={patientDetails.age}
//                 placeholder="Enter age"
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="row g-4 mt-3">
//             <div className="col-md-3">
//               <label htmlFor="blood_group" className="form-label fw-bold">
//                 Blood Group
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="blood_group"
//                 name="blood_group"
//                 value={patientDetails.blood_group}
//                 placeholder="Enter blood group"
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label htmlFor="gender" className="form-label fw-bold">
//                 Gender<span className="text-danger">*</span>
//               </label>
//               <select
//                 className="form-select"
//                 id="gender"
//                 name="gender"
//                 value={patientDetails.gender}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="others">Others</option>
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label htmlFor="address" className="form-label fw-bold">
//                 Address<span className="text-danger">*</span>
//               </label>
//               <textarea
//                 className="form-control"
//                 id="address"
//                 name="address"
//                 value={patientDetails.address}
//                 placeholder="Enter address"
//                 onChange={handleInputChange}
//                 rows="1"
//                 required
//               ></textarea>
//             </div>

//             <div className="col-md-3">
//               <label className="form-label fw-bold">Doctor Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={doctorName}
//                 placeholder="Doctor's Name"
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="row mt-4">
//             <div className="col-md-12 text-start">
//               <button type="submit" className="btn btn-primary me-2">
//                 Save Details
//               </button>
//             </div>
//           </div>
//         </form>
//         <div className="mt-4">
//           <h3
//             style={{ textAlign: "center", margin: "32px", fontWeight: "600" }}
//           >
//             Select Slot
//           </h3>
//           <div className="row justify-content-center mb-3">
//             <div className="col-4 text-center mb-3">
//               <Button
//                 variant={
//                   selectedSlot === "today" ? "primary" : "outline-primary"
//                 }
//                 onClick={handleToday}
//               >
//                 Today ({format(new Date(), "dd MMM")})
//               </Button>
//               <div
//                 style={getSlotCountStyle(
//                   slotCount[format(new Date(), "yyyy-MM-dd")] || 0
//                 )}
//               >
//                 {slotCount[format(new Date(), "yyyy-MM-dd")] || 0} slots
//                 available
//               </div>
//             </div>

//             <div className="col-4 text-center mb-3">
//               <Button
//                 variant={
//                   selectedSlot === "tomorrow" ? "primary" : "outline-primary"
//                 }
//                 onClick={handleTomorrow}
//               >
//                 Tomorrow ({format(addDays(new Date(), 1), "dd MMM")})
//               </Button>
//               <div
//                 style={getSlotCountStyle(
//                   slotCount[format(addDays(new Date(), 1), "yyyy-MM-dd")] || 0
//                 )}
//               >
//                 {slotCount[format(addDays(new Date(), 1), "yyyy-MM-dd")] || 0}{" "}
//                 slots available
//               </div>
//             </div>

//             <div className="col-4 text-center mb-3">
//               <Button
//                 variant={
//                   selectedSlot === "dayAfterTomorrow"
//                     ? "primary"
//                     : "outline-primary"
//                 }
//                 onClick={handleDayAfterTomorrow}
//               >
//                 {format(addDays(new Date(), 2), "EEEE")} (
//                 {format(addDays(new Date(), 2), "dd MMM")})
//               </Button>
//               <div
//                 style={getSlotCountStyle(
//                   slotCount[format(addDays(new Date(), 2), "yyyy-MM-dd")] || 0
//                 )}
//               >
//                 {slotCount[format(addDays(new Date(), 2), "yyyy-MM-dd")] || 0}{" "}
//                 slots available
//               </div>
//             </div>
//           </div>

//           {showSlots && <div className="row">{renderSlots(slots)}</div>}
//         </div>
//       </div>
//       <Modal show={isModalOpen} onHide={handleCancelAppointment}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Appointment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>You are about to book an appointment with {doctorName}.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCancelAppointment}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleConfirmAppointment}>
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default BookAppointment;
















import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { format, addDays } from "date-fns";
import { Modal, Button } from "react-bootstrap";
import Loader from "react-js-loader";
import styled from "styled-components";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7); /* Slightly opaque background */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const LoaderImage = styled.div`
  width: 100px;
`;

const BookAppointment = () => {
  const [doctorName, setDoctorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [slots, setSlots] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hoverMessage, setHoverMessage] = useState(""); // Define hoverMessage state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [slotCount, setSlotCount] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [searchResults, setSearchResults] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [datesToFetch, setDatesToFetch] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    mobile_number: "",
    date_of_birth: "",
    age: "",
    blood_group: "",
    gender: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    mobile_number: "",
    age: "",
    address: "",
    gender: "",
    date_of_birth: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 30;

  const startIdx = (currentPage - 1) * slotsPerPage;
  const endIdx = startIdx + slotsPerPage;

  const currentSlots = slots.slice(startIdx, endIdx);

  const handleNextPage = () => {
    if (endIdx < slots.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const doctor_id = decodedToken.doctor_id;
        setSelectedDoctorId(doctor_id);
        setDoctorId(doctor_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchDoctorName(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  const fetchDoctorName = async (doctorId) => {
    setLoading(true);
    try {
      const response = await BaseUrl.get(
        `/doctor/doctorname/?doctor_id=${doctorId}`
      );

      if (response.status === 200 && response.data.length > 0) {
        setDoctorName(response.data[0].name);
        setErrorMessage("");
      } else if (response.status === 404) {
        setErrorMessage(response.data.error);
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({
      ...patientDetails,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(patientDetails.name)) {
      errors.name = "Name must contain only alphabets and spaces.";
    }
    if (!isValidPhoneNumber(patientDetails.mobile_number)) {
      errors.mobile_number = "Please enter a valid mobile number.";
    }
    if (!patientDetails.age || Number(patientDetails.age) <= 0) {
      errors.age = "Age must be a positive number.";
    }
    if (!patientDetails.address.trim()) {
      errors.address = "Address is required.";
    }
    if (!patientDetails.gender) {
      errors.gender = "Gender is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await BaseUrl.post("/patient/patient/", {
        ...patientDetails,
        mobile_number: patientDetails.mobile_number, // Includes country code
      });

      if (response.data.success) {
        setSuccessMessage(response.data.success);
        setErrorMessage("");
        setPatientId(response.data.data.id);
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSlotCount = async () => {
      if (!doctorId) return;

      setLoading(true);

      try {
        const dates = [
          format(new Date(), "yyyy-MM-dd"),
          format(addDays(new Date(), 1), "yyyy-MM-dd"),
          format(addDays(new Date(), 2), "yyyy-MM-dd"),
        ];

        const response = await BaseUrl.get(
          `/clinic/countavailableslots/?doctor_id=${doctorId}&dates=${dates.join("&dates=")}`
        );

        if (response.status === 200) {
          const counts = {};
          response.data.forEach((item) => {
            counts[item.date] = item.count;
          });
          setSlotCount(counts);
          setErrorMessage("");
        } else {
          setSlotCount({});
          setErrorMessage(response.data.error);
        }
      } catch (error) {
        setSlotCount({});
        setErrorMessage(error.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    handleSlotCount();
  }, [doctorId]);

  const getSlotCountStyle = (count) => {
    return { color: count === 0 ? "red" : "green" };
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setDatesToFetch([format(today, "yyyy-MM-dd")]);
    handleViewSlots(today);
  };

  const handleTomorrow = () => {
    const tomorrow = addDays(new Date(), 1);
    setSelectedDate(tomorrow);
    setDatesToFetch([format(tomorrow, "yyyy-MM-dd")]);
    handleViewSlots(tomorrow);
  };

  const handleDayAfterTomorrow = () => {
    const dayAfterTomorrow = addDays(new Date(), 2);
    setSelectedDate(dayAfterTomorrow);
    setDatesToFetch([format(dayAfterTomorrow, "yyyy-MM-dd")]);
    handleViewSlots(dayAfterTomorrow);
  };

  const handleViewSlots = async (date) => {
    if (!doctorId) {
      setErrorMessage("Doctor ID is missing");
      return;
    }

    try {
      setLoading(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await BaseUrl.get(
        `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${formattedDate}`
      );

      if (response.status === 200) {
        setSlots(response.data);
        setShowSlots(true);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "An error occurred while fetching slots."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSlots = (slots) => {
    return slots.map((slot, index) => (
      <div className="col-md-2 mb-2" key={index}>
        <div
          className={`btn ${selectedSlot === slot ? "btn-success" : "btn-outline-primary"} w-100`}
          onClick={() => handleSlotClick(slot)}
        >
          {format(new Date(`1970-01-01T${slot.appointment_slot}`), "hh:mm a")}
        </div>
      </div>
    ));
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setAppointmentId(slot.id);
    setIsModalOpen(true);
  };

  const handleConfirmAppointment = async () => {
    try {
      const response = await BaseUrl.post("/doctor/doctorbook/", {
        doctor: selectedDoctorId,
        patient: patientId,
        appointment_status: "upcoming",
        appointment_slot: selectedSlot.id,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.data.success);
        await patchPatientAppointment(); // Call the PATCH API after successful booking
        setIsModalOpen(false);
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    }
  };

  const patchPatientAppointment = async () => {
    setLoading(true);
    try {
      const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
        patient_id: patientId,
        appointment: appointmentId,
      });

      if (patchResponse.data.success) {
        setSuccessMessage(patchResponse.data.success);
      } else {
        setErrorMessage(patchResponse.data.error);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = () => {
    setIsModalOpen(false);
  };

  const handleSearchInputChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    if (value.trim() !== "") {
      handleSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await BaseUrl.get(
        `/clinic/patientsearch/?query=${query}`
      );
      if (response.status === 200) {
        setSearchResults(response.data);
        setErrorMessage("");
      } else {
        setSearchResults([]);
        setErrorMessage("Failed to fetch search results");
      }
    } catch (error) {
      setSearchResults([]);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while fetching search results."
      );
    }
  };

  const handleSelectPatient = async (patient) => {
    const appointmentId = patient.appointment;
    const patientId = patient.patient;

    try {
      const response = await BaseUrl.get(
        `/patient/patient/?appointment_id=${appointmentId}&patient_id=${patientId}`
      );
      if (response.status === 200) {
        const patientData = response.data;
        setPatientDetails({
          name: patientData.name,
          mobile_number: patientData.mobile_number.toString(),
          date_of_birth: patientData.date_of_birth,
          age: String(patientData.age),
          blood_group: patientData.blood_group,
          gender: patientData.gender,
          address: patientData.address,
        });

        // Set the patient ID here
        setPatientId(patientData.id);

        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch patient details");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching patient details.");
    }
  };

  const handleClickOutside = (event) => {
    if (searchResults.length > 0) {
      const searchResultsElement = document.getElementById("searchResults");
      if (
        searchResultsElement &&
        !searchResultsElement.contains(event.target)
      ) {
        setSearchResults([]);
      }
    }
  };
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResults]);
  const totalPages = Math.ceil(slots.length / slotsPerPage);

  const renderSearchResults = () => {
    return (
      <div
        id="searchResults"
        className="search-results mt-3"
        style={{
          position: "absolute",
          top: "40px",
          left: "0",
          zIndex: "100",
          width: "300px",
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        {searchResults.map((result, index) => (
          <div
            key={index}
            className="search-result-item"
            style={{
              cursor: "pointer",
              padding: "5px",
              backgroundColor: "#f0f0f0",
              borderBottom:
                index !== searchResults.length - 1 ? "1px solid #ddd" : "none",
            }}
            onClick={() => handleSelectPatient(result)}
          >
            <p>
              <strong>Name:</strong> {result.name}
            </p>
            <p>
              <strong>Mobile Number:</strong> {result.mobile_number}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Loader Component */}
      {loading && (
        <LoaderWrapper>
          <LoaderImage>
            <Loader
              type="spinner-circle"
              bgColor={"#0091A5"}
              color={"#0091A5"}
              title={"Loading..."}
              size={100}
            />
          </LoaderImage>
        </LoaderWrapper>
      )}

      <div
        style={{
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {" "}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        <div className="container">
          <div className="col-12 text-center">
            <h2
              style={{
                paddingBottom: "32px",
                fontWeight: "600",
                color: "#0C1187",
              }}
            >
              Book Appointment
            </h2>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-12 col-md-6">
              <div className="d-flex position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Patient Name / Mobile"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  style={{
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    border: "2px solid blue",
                  }}
                />
                {searchResults.length > 0 && renderSearchResults()}
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSaveDetails}>
          <div className="row g-4">
            <div className="col-md-3">
              <label htmlFor="name" className="form-label fw-bold">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={patientDetails.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s.]*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="mobile_number" className="form-label fw-bold">
                Mobile Number<span className="text-danger">*</span>
              </label>
              <PhoneInput
                id="mobile_number"
                name="mobile_number"
                placeholder="Enter mobile number"
                defaultCountry="IN"
                value={patientDetails.mobile_number}
                onChange={(value) =>
                  setPatientDetails((prevDetails) => ({
                    ...prevDetails,
                    mobile_number: value,
                  }))
                }
                required
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="date_of_birth" className="form-label fw-bold">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="date_of_birth"
                name="date_of_birth"
                value={patientDetails.date_of_birth}
                onChange={handleInputChange}
                max={today}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="age" className="form-label fw-bold">
                Age<span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={patientDetails.age}
                placeholder="Enter age"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-md-3">
              <label htmlFor="blood_group" className="form-label fw-bold">
                Blood Group
              </label>
              <input
                type="text"
                className="form-control"
                id="blood_group"
                name="blood_group"
                value={patientDetails.blood_group}
                placeholder="Enter blood group"
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="gender" className="form-label fw-bold">
                Gender<span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={patientDetails.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="address" className="form-label fw-bold">
                Address<span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                value={patientDetails.address}
                placeholder="Enter address"
                onChange={handleInputChange}
                rows="1"
                required
              ></textarea>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Doctor Name</label>
              <input
                type="text"
                className="form-control"
                value={doctorName}
                placeholder="Doctor's Name"
                disabled
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12 text-start">
              <button type="submit" className="btn btn-primary me-2">
                Save Details
              </button>
            </div>
          </div>
        </form>
        <div className="mt-4">
          <h3
            style={{ textAlign: "center", margin: "32px", fontWeight: "600" }}
          >
            Select Slot
          </h3>
          <div className="row justify-content-center mb-3">
            {/* Today Slots */}
            <div className="col-4 text-center mb-3">
              <Button
                variant={
                  selectedSlot === "today" ? "primary" : "outline-primary"
                }
                onClick={handleToday}
              >
                Today ({format(new Date(), "dd MMM")})
              </Button>
              <div
                style={getSlotCountStyle(
                  slotCount[format(new Date(), "yyyy-MM-dd")] || 0
                )}
              >
                {slotCount[format(new Date(), "yyyy-MM-dd")] || 0} slots
                available
              </div>
            </div>

            {/* Tomorrow Slots */}
            <div className="col-4 text-center mb-3">
              <Button
                variant={
                  selectedSlot === "tomorrow" ? "primary" : "outline-primary"
                }
                onClick={handleTomorrow}
              >
                Tomorrow ({format(addDays(new Date(), 1), "dd MMM")})
              </Button>
              <div
                style={getSlotCountStyle(
                  slotCount[format(addDays(new Date(), 1), "yyyy-MM-dd")] || 0
                )}
              >
                {slotCount[format(addDays(new Date(), 1), "yyyy-MM-dd")] || 0}{" "}
                slots available
              </div>
            </div>

            {/* Day After Tomorrow Slots */}
            <div className="col-4 text-center mb-3">
              <Button
                variant={
                  selectedSlot === "dayAfterTomorrow"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={handleDayAfterTomorrow}
              >
                {format(addDays(new Date(), 2), "EEEE")} (
                {format(addDays(new Date(), 2), "dd MMM")})
              </Button>
              <div
                style={getSlotCountStyle(
                  slotCount[format(addDays(new Date(), 2), "yyyy-MM-dd")] || 0
                )}
              >
                {slotCount[format(addDays(new Date(), 2), "yyyy-MM-dd")] || 0}{" "}
                slots available
              </div>
            </div>
          </div>

          {/* Render Slots Horizontally with 6 slots per row */}
          {showSlots && (
            <div className="d-flex flex-column align-items-center">
              {Array.from({ length: Math.ceil(slots.length / 6) }).map(
                (_, rowIndex) => (
                  <div
                    className="d-flex flex-wrap justify-content-center mb-2"
                    key={rowIndex}
                  >
                    {slots
                      .slice(rowIndex * 6, (rowIndex + 1) * 6)
                      .map((slot) => {
                        const currentTime = new Date();
                        const slotTime = new Date(
                          `${slot.appointment_date}T${slot.appointment_slot}`
                        );

                        const isPast =
                          currentTime >= slotTime &&
                          format(currentTime, "yyyy-MM-dd") ===
                            slot.appointment_date;
                        const isBooked = slot.is_booked;

                        const isDisabled = isPast || isBooked;

                        const buttonStyle = {
                          width: "196px", // Fixed width
                          height: "38px", // Fixed height
                          backgroundColor: isBooked
                            ? "gray"
                            : isDisabled
                              ? "gray"
                              : "#FFFFFF",
                          color: isDisabled ? "#FFFFFF" : "#000000",
                          borderColor: "#3D9F41",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          opacity: isDisabled ? 0.7 : 1,
                          margin: "5px", // Add margin between buttons
                          textAlign: "center", // Center text alignment
                          position: "relative", // Required for hover message
                          display: "flex", // Ensures alignment works
                          alignItems: "center", // Centers vertically
                          justifyContent: "center", // Centers horizontally
                        };

                        const timeStyle = {
                          marginTop: "2px", // Moves the time slightly downward
                        };

                        return (
                          <div
                            key={slot.id}
                            style={{ position: "relative" }}
                            onMouseEnter={() =>
                              isDisabled && setHoverMessage("Booked")
                            }
                            onMouseLeave={() => setHoverMessage("")}
                          >
                            <Button
                              style={buttonStyle}
                              className="slot-button"
                              onClick={() =>
                                !isDisabled && handleSlotClick(slot)
                              }
                              disabled={isDisabled}
                            >
                              <span style={timeStyle}>
                                {formatTime(slot.appointment_slot)}
                              </span>
                            </Button>

                            {isDisabled && hoverMessage && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-30px",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                  color: "#fff",
                                  padding: "5px 10px",
                                  borderRadius: "4px",
                                  fontSize: "0.8rem",
                                  zIndex: 10,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {hoverMessage}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <Modal show={isModalOpen} onHide={handleCancelAppointment}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to book an appointment with {doctorName}.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelAppointment}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAppointment}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment;