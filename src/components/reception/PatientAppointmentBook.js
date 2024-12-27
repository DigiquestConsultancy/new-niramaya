// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import { format, addDays } from "date-fns";
// import { Modal, Button } from "react-bootstrap";
// import "react-datepicker/dist/react-datepicker.css";
// import styled from "styled-components";

// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh; /* Full viewport height */
// `;

// const LoaderImage = styled.img`
//   width: 400px; /* Adjust the size of the loader as needed */
// `;

// const PatientAppointmentBooks = () => {
//   const [doctorName, setDoctorName] = useState("");
//   const [doctorId, setDoctorId] = useState("");
//   const [receptionId, setReceptionId] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);

//   const [slots, setSlots] = useState([]);
//   const [showSlots, setShowSlots] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [patientId, setPatientId] = useState(null);
//   const [appointmentId, setAppointmentId] = useState(null);
//   const [slotCount, setSlotCount] = useState({});
//   const [loading, setLoading] = useState(false);
//   const today = new Date().toISOString().split("T")[0];
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchInput, setSearchInput] = useState("");

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

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const reception_id = decodedToken.reception_id;
//         setReceptionId(reception_id);
//         fetchDoctorName(reception_id);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const fetchDoctorName = async (receptionId) => {
//     setLoading(true);
//     try {
//       const response = await BaseUrl.get(
//         `/reception/doctordetailsbyreceptionid/?reception_id=${receptionId}`
//       );
//       if (response.status === 200) {
//         setDoctorName(response.data.name);
//         setDoctorId(response.data.doctor_id);
//       } else {
//         setErrorMessage("Failed to fetch doctor name");
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error ||
//           "An error occurred while fetching doctor name."
//       );
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
//     const mobileRegex = /^\d{10}$/;
//     const ageRegex = /^\d+$/;

//     if (!nameRegex.test(patientDetails.name)) {
//       errors.name = "Name must contain only alphabets and spaces.";
//     }
//     if (!mobileRegex.test(patientDetails.mobile_number)) {
//       errors.mobile_number = "Mobile number must be a 10-digit number.";
//     }
//     if (!ageRegex.test(patientDetails.age) || Number(patientDetails.age) <= 0) {
//       errors.age = "Age must be a positive number.";
//     }
//     if (!patientDetails.address.trim()) {
//       errors.address = "Address is required.";
//     }
//     if (!patientDetails.gender) {
//       errors.gender = "Gender is required.";
//     }
//     if (!patientDetails.date_of_birth) {
//       errors.date_of_birth = "Date of Birth is required.";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSaveDetails = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       const response = await BaseUrl.post(
//         "/patient/patient/",
//         patientDetails,
//         {}
//       );
//       if (response.status === 201) {
//         setSuccessMessage(response.data.success);
//         setErrorMessage("");
//         setPatientId(response.data.data.id);
//         console.log(response.data.data.id);
//       } else {
//         setErrorMessage(
//           response.data.error || "Failed to save patient details"
//         );
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setErrorMessage(error.response.data.error);
//       } else {
//         setErrorMessage("An error occurred while saving patient details.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleSlotCount = async () => {
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
//           setErrorMessage(response.data.error || "Failed to fetch slot counts");
//         }
//       } catch (error) {
//         setSlotCount({});
//         setErrorMessage(
//           error.response?.data?.error ||
//             "An error occurred while fetching slot counts."
//         );
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
//     handleViewSlots(today);
//   };

//   const handleTomorrow = () => {
//     const tomorrow = addDays(new Date(), 1);
//     setSelectedDate(tomorrow);
//     handleViewSlots(tomorrow);
//   };

//   const handleDayAfterTomorrow = () => {
//     const dayAfterTomorrow = addDays(new Date(), 2);
//     setSelectedDate(dayAfterTomorrow);
//     handleViewSlots(dayAfterTomorrow);
//   };

//   const isSelectedDate = (date) => {
//     return (
//       selectedDate &&
//       format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
//     );
//   };

//   const handleViewSlots = async (date) => {
//     if (!doctorId) {
//       setErrorMessage("Doctor ID is missing");
//       return;
//     }
//     setLoading(true);
//     try {
//       const formattedDate = format(date, "yyyy-MM-dd");
//       const response = await BaseUrl.get(
//         `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${formattedDate}`
//       );
//       if (response.status === 200) {
//         setSlots(response.data);
//         setShowSlots(true);
//         setErrorMessage("");
//       } else {
//         setErrorMessage("Failed to fetch slots");
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
//       const response = await BaseUrl.post("/reception/BookByReception/", {
//         reception_id: receptionId,
//         doctor_id: doctorId,
//         patient_id: patientId,
//         appointment_slot_id: selectedSlot.id,
//         appointment_status: "upcoming",
//       });
//       if (response.status === 200 || response.status === 201) {
//         setSuccessMessage(response.data.success);
//         await patchPatientAppointment();
//         setIsModalOpen(false);
//       } else {
//         setErrorMessage("Failed to confirm appointment. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error confirming booking:", error.response?.data);
//       setErrorMessage("Failed to confirm appointment. Please try again.");
//     }
//   };

//   const patchPatientAppointment = async () => {
//     try {
//       const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
//         patient_id: patientId,
//         appointment: appointmentId,
//       });

//       if (patchResponse.status === 200) {
//         setSuccessMessage(
//           "Appointment confirmed and patient details updated successfully."
//         );
//       }
//     } catch (error) {
//       console.error(error.response?.data);
//       setErrorMessage();
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
//         `/clinic/patientsearch/?query=${query}`,
//         {
//           params: { doctor_id: doctorId },
//         }
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
//     try {
//       const response = await BaseUrl.get(
//         `/patient/patient/?appointment_id=${patient.appointment}&patient_id=${patient.patient}`
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

//         setPatientId(patientData.id);

//         setErrorMessage("");
//       } else {
//         setErrorMessage("Failed to fetch patient details");
//       }
//     } catch (error) {
//       console.error("Error fetching patient details:", error);
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

//   if (loading) {
//     return (
//       <LoaderWrapper>
//         <LoaderImage
//           src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
//           alt="Loading..."
//         />
//       </LoaderWrapper>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       <div
//         style={{
//           backgroundColor: "#f5f5f5",
//           padding: "20px",
//           borderRadius: "8px",
//         }}
//       >
//         {errorMessage && (
//           <div className="alert alert-danger">{errorMessage}</div>
//         )}
//         {successMessage && (
//           <div className="alert alert-success">{successMessage}</div>
//         )}
//         <div className="row justify-content-center">
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
//         </div>
//         <div className="row justify-content-center mb-5">
//           <div className="col-12 col-md-6">
//             <div className="d-flex position-relative">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search by Patient Name / Mobile"
//                 value={searchInput}
//                 onChange={handleSearchInputChange}
//                 style={{
//                   width: "100%",
//                   position: "relative",
//                   overflow: "hidden",
//                   border: "2px solid blue",
//                 }}
//               />
//               {searchResults.length > 0 && renderSearchResults()}
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSaveDetails}>
//           <div className="row mb-4">
//             <div className="col-md-3">
//               <label
//                 htmlFor="name"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Name<span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="name"
//                 name="name"
//                 value={patientDetails.name}
//                 onChange={handleInputChange}
//                 required
//               />
//               {formErrors.name && (
//                 <div className="text-danger">{formErrors.name}</div>
//               )}
//             </div>
//             <div className="col-md-3">
//               <label
//                 htmlFor="mobile_number"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Mobile Number<span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="mobile_number"
//                 name="mobile_number"
//                 value={patientDetails.mobile_number}
//                 onChange={handleInputChange}
//                 required
//               />
//               {formErrors.mobile_number && (
//                 <div className="text-danger">{formErrors.mobile_number}</div>
//               )}
//             </div>
//             <div className="col-md-3">
//               <label
//                 htmlFor="date_of_birth"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Date of Birth<span className="text-danger">*</span>
//               </label>
//               <input
//                 type="date"
//                 className="form-control"
//                 id="date_of_birth"
//                 name="date_of_birth"
//                 value={patientDetails.date_of_birth}
//                 onChange={handleInputChange}
//                 max={today}
//                 required
//               />
//               {formErrors.date_of_birth && (
//                 <div className="text-danger">{formErrors.date_of_birth}</div>
//               )}
//             </div>
//             <div className="col-md-3">
//               <label
//                 htmlFor="age"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Age<span className="text-danger">*</span>
//               </label>
//               <input
//                 type="number"
//                 className="form-control"
//                 id="age"
//                 name="age"
//                 value={patientDetails.age}
//                 onChange={handleInputChange}
//                 required
//               />
//               {formErrors.age && (
//                 <div className="text-danger">{formErrors.age}</div>
//               )}
//             </div>
//           </div>

//           <div className="row mb-4">
//             <div className="col-md-3">
//               <label
//                 htmlFor="blood_group"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Blood Group
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="blood_group"
//                 name="blood_group"
//                 value={patientDetails.blood_group}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="col-md-3">
//               <label
//                 htmlFor="gender"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
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
//               {formErrors.gender && (
//                 <div className="text-danger">{formErrors.gender}</div>
//               )}
//             </div>
//             <div className="col-md-3">
//               <label
//                 htmlFor="address"
//                 className="form-label"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Address<span className="text-danger">*</span>
//               </label>
//               <textarea
//                 className="form-control"
//                 id="address"
//                 name="address"
//                 value={patientDetails.address}
//                 onChange={handleInputChange}
//                 rows="1"
//                 required
//               ></textarea>
//               {formErrors.address && (
//                 <div className="text-danger">{formErrors.address}</div>
//               )}
//             </div>
//             <div className="col-md-3">
//               <label
//                 className="mr-2"
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   display: "block",
//                 }}
//               >
//                 Doctor Name
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={doctorName}
//                 disabled
//               />
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div>
//               <button type="submit" className="btn btn-primary">
//                 Save Details
//               </button>
//               {patientId && (
//                 <p className="mt-2 text-success">Details saved successfully.</p>
//               )}
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
//                   isSelectedDate(new Date()) ? "primary" : "outline-primary"
//                 }
//                 onClick={handleToday}
//                 style={{
//                   backgroundColor: isSelectedDate(new Date())
//                     ? "#007bff"
//                     : "transparent",
//                   color: isSelectedDate(new Date()) ? "#fff" : "",
//                   fontWeight: isSelectedDate(new Date()) ? "bold" : "normal",
//                 }}
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
//                   isSelectedDate(addDays(new Date(), 1))
//                     ? "primary"
//                     : "outline-primary"
//                 }
//                 onClick={handleTomorrow}
//                 style={{
//                   backgroundColor: isSelectedDate(addDays(new Date(), 1))
//                     ? "#007bff"
//                     : "transparent",
//                   color: isSelectedDate(addDays(new Date(), 1)) ? "#fff" : "",
//                   fontWeight: isSelectedDate(addDays(new Date(), 1))
//                     ? "bold"
//                     : "normal",
//                 }}
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
//                   isSelectedDate(addDays(new Date(), 2))
//                     ? "primary"
//                     : "outline-primary"
//                 }
//                 onClick={handleDayAfterTomorrow}
//                 style={{
//                   backgroundColor: isSelectedDate(addDays(new Date(), 2))
//                     ? "#007bff"
//                     : "transparent",
//                   color: isSelectedDate(addDays(new Date(), 2)) ? "#fff" : "",
//                   fontWeight: isSelectedDate(addDays(new Date(), 2))
//                     ? "bold"
//                     : "normal",
//                 }}
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

//         <Modal show={isModalOpen} onHide={handleCancelAppointment}>
//           <Modal.Header closeButton>
//             <Modal.Title>Confirm Appointment</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <p>You are about to book an appointment with {doctorName}.</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCancelAppointment}>
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleConfirmAppointment}>
//               Confirm
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default PatientAppointmentBooks;

import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { format, addDays } from "date-fns";
import { Modal, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
`;

const LoaderImage = styled.img`
  width: 400px; /* Adjust the size of the loader as needed */
`;

const PatientAppointmentBooks = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [receptionId, setReceptionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [slots, setSlots] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [slotCount, setSlotCount] = useState({});
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [patientDetails, setPatientDetails] = useState({
    name: "",
    mobile_number: "",
    date_of_birth: "",
    age: "",
    blood_group: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const reception_id = decodedToken.reception_id;
        setReceptionId(reception_id);
        fetchDoctorName(reception_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchDoctorName = async (receptionId) => {
    setLoading(true);
    try {
      const response = await BaseUrl.get(
        `/reception/doctordetailsbyreceptionid/?reception_id=${receptionId}`
      );
      if (response.status === 200) {
        setDoctorName(response.data.name);
        setDoctorId(response.data.doctor_id);
      } else {
        setErrorMessage("Failed to fetch doctor name");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while fetching doctor name."
      );
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

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await BaseUrl.post("/patient/patient/", {
        ...patientDetails,
        mobile_number: patientDetails.mobile_number,
      });

      if (response.status === 201) {
        setSuccessMessage(response.data.success);
        setErrorMessage("");
        setPatientId(response.data.data.id);
      } else {
        setErrorMessage(
          response.data.error || "Failed to save patient details"
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while saving patient details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSlotCount = async () => {
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
          setErrorMessage(response.data.error || "Failed to fetch slot counts");
        }
      } catch (error) {
        setSlotCount({});
        setErrorMessage(
          error.response?.data?.error ||
            "An error occurred while fetching slot counts."
        );
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
    handleViewSlots(today);
  };

  const handleTomorrow = () => {
    const tomorrow = addDays(new Date(), 1);
    setSelectedDate(tomorrow);
    handleViewSlots(tomorrow);
  };

  const handleDayAfterTomorrow = () => {
    const dayAfterTomorrow = addDays(new Date(), 2);
    setSelectedDate(dayAfterTomorrow);
    handleViewSlots(dayAfterTomorrow);
  };

  const isSelectedDate = (date) => {
    return (
      selectedDate &&
      format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
  };

  const handleViewSlots = async (date) => {
    if (!doctorId) {
      setErrorMessage("Doctor ID is missing");
      return;
    }
    setLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await BaseUrl.get(
        `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${formattedDate}`
      );
      if (response.status === 200) {
        setSlots(response.data);
        setShowSlots(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch slots");
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
      const response = await BaseUrl.post("/reception/BookByReception/", {
        reception_id: receptionId,
        doctor_id: doctorId,
        patient_id: patientId,
        appointment_slot_id: selectedSlot.id,
        appointment_status: "upcoming",
      });
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.data.success);
        await patchPatientAppointment();
        setIsModalOpen(false);
      } else {
        setErrorMessage("Failed to confirm appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.response?.data);
      setErrorMessage("Failed to confirm appointment. Please try again.");
    }
  };

  const patchPatientAppointment = async () => {
    try {
      const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
        patient_id: patientId,
        appointment: appointmentId,
      });

      if (patchResponse.status === 200) {
        setSuccessMessage(
          "Appointment confirmed and patient details updated successfully."
        );
      }
    } catch (error) {
      console.error(error.response?.data);
      setErrorMessage();
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
        `/clinic/patientsearch/?query=${query}`,
        {
          params: { doctor_id: doctorId },
        }
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
    try {
      const response = await BaseUrl.get(
        `/patient/patient/?appointment_id=${patient.appointment}&patient_id=${patient.patient}`
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

        setPatientId(patientData.id);

        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResults]);

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

  if (loading) {
    return (
      <LoaderWrapper>
        <LoaderImage
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          alt="Loading..."
        />
      </LoaderWrapper>
    );
  }

  return (
    <div className="container-fluid">
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        <div className="row justify-content-center">
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

        <form onSubmit={handleSaveDetails}>
          <div className="row mb-4">
            <div className="col-md-3">
              <label
                htmlFor="name"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
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
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                required
              />
            </div>

            <div className="col-md-3">
              <label
                htmlFor="mobile_number"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
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
              <label
                htmlFor="date_of_birth"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Date of Birth<span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="date_of_birth"
                name="date_of_birth"
                value={patientDetails.date_of_birth}
                onChange={handleInputChange}
                max={today}
                required
              />
            </div>

            <div className="col-md-3">
              <label
                htmlFor="age"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Age<span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={patientDetails.age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (Number(value) > 0 && /^[0-9]+$/.test(value))
                  ) {
                    handleInputChange(e);
                  }
                }}
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3">
              <label
                htmlFor="blood_group"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Blood Group
              </label>
              <input
                type="text"
                className="form-control"
                id="blood_group"
                name="blood_group"
                value={patientDetails.blood_group}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-3">
              <label
                htmlFor="gender"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
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
              <label
                htmlFor="address"
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Address<span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                value={patientDetails.address}
                onChange={handleInputChange}
                rows="1"
                required
              ></textarea>
            </div>

            <div className="col-md-3">
              <label
                className="form-label"
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Doctor Name
              </label>
              <input
                type="text"
                className="form-control"
                value={doctorName}
                disabled
              />
            </div>
          </div>

          <div className="row mb-3">
            <div>
              <button type="submit" className="btn btn-primary">
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
            <div className="col-4 text-center mb-3">
              <Button
                variant={
                  isSelectedDate(new Date()) ? "primary" : "outline-primary"
                }
                onClick={handleToday}
                style={{
                  backgroundColor: isSelectedDate(new Date())
                    ? "#007bff"
                    : "transparent",
                  color: isSelectedDate(new Date()) ? "#fff" : "",
                  fontWeight: isSelectedDate(new Date()) ? "bold" : "normal",
                }}
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

            <div className="col-4 text-center mb-3">
              <Button
                variant={
                  isSelectedDate(addDays(new Date(), 1))
                    ? "primary"
                    : "outline-primary"
                }
                onClick={handleTomorrow}
                style={{
                  backgroundColor: isSelectedDate(addDays(new Date(), 1))
                    ? "#007bff"
                    : "transparent",
                  color: isSelectedDate(addDays(new Date(), 1)) ? "#fff" : "",
                  fontWeight: isSelectedDate(addDays(new Date(), 1))
                    ? "bold"
                    : "normal",
                }}
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

            <div className="col-4 text-center mb-3">
              <Button
                variant={
                  isSelectedDate(addDays(new Date(), 2))
                    ? "primary"
                    : "outline-primary"
                }
                onClick={handleDayAfterTomorrow}
                style={{
                  backgroundColor: isSelectedDate(addDays(new Date(), 2))
                    ? "#007bff"
                    : "transparent",
                  color: isSelectedDate(addDays(new Date(), 2)) ? "#fff" : "",
                  fontWeight: isSelectedDate(addDays(new Date(), 2))
                    ? "bold"
                    : "normal",
                }}
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

          {showSlots && <div className="row">{renderSlots(slots)}</div>}
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
    </div>
  );
};

export default PatientAppointmentBooks;
