


// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import { Modal, Button } from "react-bootstrap";
// import { format, addDays } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";
// import styled from "styled-components";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import "react-phone-number-input/style.css";

// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh; /* Full viewport height */
// `;

// const LoaderImage = styled.img`
//   width: 400px; /* Adjust the size of the loader as needed */
// `;

// const PatientAppointmentBook = () => {
//   const [doctorName, setDoctorName] = useState("");
//   const [doctorId, setDoctorId] = useState("");
//   const [clinicId, setClinicId] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [slots, setSlots] = useState([]);
//   const [showSlots, setShowSlots] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [patientId, setPatientId] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [appointmentId, setAppointmentId] = useState(null);
//   const [slotCount, setSlotCount] = useState({});
//   const [slotErrorMessage, setSlotErrorMessage] = useState("");
//   const [loading, setLoading] = useState(true); // Loading state
//   const today = new Date().toISOString().split("T")[0];
//   const [patientDetails, setPatientDetails] = useState({
//     name: "",
//     mobile_number: "",
//     date_of_birth: "",
//     age: "",
//     blood_group: "",
//     gender: "",
//     address: "",
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const clinic_id = decodedToken.clinic_id;
//         setClinicId(clinic_id);
//         fetchDoctorName(clinic_id);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const fetchDoctorName = async (clinicId) => {
//     try {
//       setLoading(true); // Start loading
//       const response = await BaseUrl.get(
//         `/clinic/doctordetailbyclinicid/?clinic_id=${clinicId}`
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
//       setLoading(false); // Stop loading
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPatientDetails({
//       ...patientDetails,
//       [name]: value,
//     });
//   };

//   const renderInputField = (name, label, value, options) => {
//     const {
//       type = "text",
//       placeholder = "",
//       required = false,
//       max = null,
//       pattern = null,
//       error = null,
//     } = options;

//     return (
//       <div className="col-md-3">
//         <label htmlFor={name} className="form-label fw-bold">
//           {label}
//           {required && <span className="text-danger">*</span>}
//         </label>
//         <input
//           type={type}
//           className="form-control"
//           id={name}
//           name={name}
//           value={value}
//           onChange={handleInputChange}
//           placeholder={placeholder}
//           max={max}
//           pattern={pattern}
//           required={required}
//         />
//       </div>
//     );
//   };

//   const handleSaveDetails = async (e) => {
//     e.preventDefault();
//     const formData = {
//       ...patientDetails,
//       mobile_number: patientDetails.mobile_number, // Ensure this includes the country code
//     };

//     try {
//       setLoading(true);

//       const response = await BaseUrl.post("/patient/patient/", formData);

//       if (response.status === 201) {
//         setSuccessMessage(response.data.success);
//         setErrorMessage(""); // Clear previous error message, if any
//         setPatientId(response.data.data.id);
//       } else if (response.status === 400) {
//         setErrorMessage(response.data.error || "Validation failed.");
//       } else {
//         setErrorMessage("Failed to save patient details.");
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error ||
//           "An error occurred while saving patient details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleSlotCount = async () => {
//       if (!doctorId) return;
//       try {
//         const dates = [
//           format(new Date(), "yyyy-MM-dd"),
//           format(addDays(new Date(), 1), "yyyy-MM-dd"),
//           format(addDays(new Date(), 2), "yyyy-MM-dd"),
//         ];

//         setLoading(true); // Start loading
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
//         setLoading(false); // Stop loading
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
//     setSelectedSlot("today");
//   };

//   const handleTomorrow = () => {
//     const tomorrow = addDays(new Date(), 1);
//     setSelectedDate(tomorrow);
//     handleViewSlots(tomorrow);
//     setSelectedSlot("tomorrow");
//   };

//   const handleDayAfterTomorrow = () => {
//     const dayAfterTomorrow = addDays(new Date(), 2);
//     setSelectedDate(dayAfterTomorrow);
//     handleViewSlots(dayAfterTomorrow);
//     setSelectedSlot("dayAfterTomorrow");
//   };

//   const handleViewSlots = async (date) => {
//     if (!doctorId) {
//       setErrorMessage("Doctor ID is missing");
//       return;
//     }
//     try {
//       const formattedDate = format(date, "yyyy-MM-dd");
//       setLoading(true); // Start loading
//       const response = await BaseUrl.get(
//         `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${formattedDate}`
//       );
//       if (response.status === 200) {
//         setSlots(response.data);
//         setShowSlots(true);
//         setSlotErrorMessage(
//           response.data.length === 0
//             ? "No slots available for the selected date."
//             : ""
//         );
//         setErrorMessage("");
//       } else {
//         setErrorMessage("Failed to fetch slots");
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "An error occurred while fetching slots."
//       );
//     } finally {
//       setLoading(false); // Stop loading
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
//       setLoading(true);
//       const response = await BaseUrl.post("/clinic/bookappointmentbyclinic/", {
//         clinic_id: clinicId,
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
//       setErrorMessage("Failed to confirm appointment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const patchPatientAppointment = async () => {
//     try {
//       const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
//         patient_id: patientId,
//         appointment: appointmentId, // Send appointment ID
//       });

//       if (patchResponse.status === 200) {
//         setSuccessMessage(
//           "Appointment confirmed and patient details updated successfully."
//         );
//       } else {
//         setErrorMessage("");
//       }
//     } catch (error) {
//       setErrorMessage("");
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
//       setLoading(true); // Start loading
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
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   const handleSelectPatient = async (patient) => {
//     try {
//       setLoading(true);
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
//       setErrorMessage("An error occurred while fetching patient details.");
//     } finally {
//       setLoading(false);
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

//   return (
//     <div className="container-fluid">
//       {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//       {successMessage && (
//         <div className="alert alert-success">{successMessage}</div>
//       )}
//       {loading ? (
//         <LoaderWrapper>
//           <LoaderImage
//             src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
//             alt="Loading..."
//           />
//         </LoaderWrapper>
//       ) : (
//         <div
//           style={{
//             backgroundColor: "#f5f5f5",
//             padding: "20px",
//             borderRadius: "8px",
//           }}
//         >
//           <div className="row justify-content-center mt-5">
//             <div className="col-12 text-center">
//               <h2
//                 style={{
//                   paddingBottom: "32px",
//                   fontWeight: "600",
//                   color: "#0C1187",
//                 }}
//               >
//                 Book Appointment
//               </h2>
//             </div>
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
//           <form onSubmit={handleSaveDetails}>
//             <div className="row mb-4">
//               <div className="col-md-3">
//                 <label
//                   htmlFor="name"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Name<span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="name"
//                   name="name"
//                   value={patientDetails.name}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (/^[a-zA-Z\s]*$/.test(value)) {
//                       handleInputChange(e);
//                     }
//                   }}
//                   required
//                 />
//               </div>

//               <div className="col-md-3">
//                 <label
//                   htmlFor="mobile_number"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Mobile Number<span className="text-danger">*</span>
//                 </label>
//                 <PhoneInput
//                   id="mobile_number"
//                   name="mobile_number"
//                   placeholder="Enter mobile number"
//                   defaultCountry="IN"
//                   value={patientDetails.mobile_number}
//                   onChange={(value) =>
//                     setPatientDetails((prevDetails) => ({
//                       ...prevDetails,
//                       mobile_number: value,
//                     }))
//                   }
//                   required
//                 />
//               </div>

//               <div className="col-md-3">
//                 <label
//                   htmlFor="date_of_birth"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Date of Birth<span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   id="date_of_birth"
//                   name="date_of_birth"
//                   value={patientDetails.date_of_birth}
//                   onChange={handleInputChange}
//                   max={today}
//                   required
//                 />
//               </div>

//               <div className="col-md-3">
//                 <label
//                   htmlFor="age"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Age<span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   id="age"
//                   name="age"
//                   value={patientDetails.age}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (
//                       value === "" ||
//                       (Number(value) > 0 && /^[0-9]+$/.test(value))
//                     ) {
//                       handleInputChange(e);
//                     }
//                   }}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="row mb-4">
//               <div className="col-md-3">
//                 <label
//                   htmlFor="blood_group"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Blood Group
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="blood_group"
//                   name="blood_group"
//                   value={patientDetails.blood_group}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div className="col-md-3">
//                 <label
//                   htmlFor="gender"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Gender<span className="text-danger">*</span>
//                 </label>
//                 <select
//                   className="form-select"
//                   id="gender"
//                   name="gender"
//                   value={patientDetails.gender}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="others">Others</option>
//                 </select>
//               </div>

//               <div className="col-md-3">
//                 <label
//                   htmlFor="address"
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Address<span className="text-danger">*</span>
//                 </label>
//                 <textarea
//                   className="form-control"
//                   id="address"
//                   name="address"
//                   value={patientDetails.address}
//                   onChange={handleInputChange}
//                   rows="1"
//                   required
//                 ></textarea>
//               </div>

//               <div className="col-md-3">
//                 <label
//                   className="form-label"
//                   style={{
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     display: "block",
//                   }}
//                 >
//                   Doctor Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={doctorName}
//                   disabled
//                 />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div>
//                 <button type="submit" className="btn btn-primary">
//                   Save Details
//                 </button>
//               </div>
//             </div>
//           </form>

//           <div className="mt-4">
//             <h3
//               style={{ textAlign: "center", margin: "32px", fontWeight: "600" }}
//             >
//               Select Slot
//             </h3>
//             <div className="row justify-content-center mb-3">
//               <div className="col-4 text-center mb-3">
//                 <Button
//                   variant={
//                     selectedSlot === "today" ? "primary" : "outline-primary"
//                   }
//                   onClick={handleToday}
//                 >
//                   Today ({format(new Date(), "dd MMM")})
//                 </Button>
//                 <div
//                   style={getSlotCountStyle(
//                     slotCount[format(new Date(), "yyyy-MM-dd")] || 0
//                   )}
//                 >
//                   {slotCount[format(new Date(), "yyyy-MM-dd")] || 0} slots
//                   available
//                 </div>
//               </div>

//               <div className="col-4 text-center mb-3">
//                 <Button
//                   variant={
//                     selectedSlot === "tomorrow" ? "primary" : "outline-primary"
//                   }
//                   onClick={handleTomorrow}
//                 >
//                   Tomorrow ({format(addDays(new Date(), 1), "dd MMM")})
//                 </Button>
//                 <div
//                   style={getSlotCountStyle(
//                     slotCount[format(addDays(new Date(), 1), "yyyy-MM-dd")] || 0
//                   )}
//                 >
//                   {slotCount[format(addDays(new Date(), 1), "yyyy-MM-dd")] || 0}{" "}
//                   slots available
//                 </div>
//               </div>

//               <div className="col-4 text-center mb-3">
//                 <Button
//                   variant={
//                     selectedSlot === "dayAfterTomorrow"
//                       ? "primary"
//                       : "outline-primary"
//                   }
//                   onClick={handleDayAfterTomorrow}
//                 >
//                   {format(addDays(new Date(), 2), "EEEE")} (
//                   {format(addDays(new Date(), 2), "dd MMM")})
//                 </Button>
//                 <div
//                   style={getSlotCountStyle(
//                     slotCount[format(addDays(new Date(), 2), "yyyy-MM-dd")] || 0
//                   )}
//                 >
//                   {slotCount[format(addDays(new Date(), 2), "yyyy-MM-dd")] || 0}{" "}
//                   slots available
//                 </div>
//               </div>
//             </div>

//             {showSlots && <div className="row">{renderSlots(slots)}</div>}
//           </div>
//           <Modal show={isModalOpen} onHide={handleCancelAppointment}>
//             <Modal.Header closeButton>
//               <Modal.Title>Confirm Appointment</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <p>You are about to book an appointment with {doctorName}.</p>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleCancelAppointment}>
//                 Cancel
//               </Button>
//               <Button variant="primary" onClick={handleConfirmAppointment}>
//                 Confirm
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientAppointmentBook;


















import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from "react-bootstrap";
import { format, addDays } from "date-fns";
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

const PatientAppointmentBook = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);
  const [slotCount, setSlotCount] = useState({});
  const [slotErrorMessage, setSlotErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const today = new Date().toISOString().split("T")[0];
  const [hoverMessage, setHoverMessage] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    mobile_number: "",
    date_of_birth: "",
    age: "",
    blood_group: "",
    gender: "",
    address: "",
  });

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const clinic_id = decodedToken.clinic_id;
        setClinicId(clinic_id);
        fetchDoctorName(clinic_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchDoctorName = async (clinicId) => {
    try {
      setLoading(true); // Start loading
      const response = await BaseUrl.get(
        `/clinic/doctordetailbyclinicid/?clinic_id=${clinicId}`
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
      setLoading(false); // Stop loading
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({
      ...patientDetails,
      [name]: value,
    });
  };

  const renderInputField = (name, label, value, options) => {
    const {
      type = "text",
      placeholder = "",
      required = false,
      max = null,
      pattern = null,
      error = null,
    } = options;

    return (
      <div className="col-md-3">
        <label htmlFor={name} className="form-label fw-bold">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
        <input
          type={type}
          className="form-control"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          max={max}
          pattern={pattern}
          required={required}
        />
      </div>
    );
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    const formData = {
      ...patientDetails,
      mobile_number: patientDetails.mobile_number, // Ensure this includes the country code
    };

    try {
      setLoading(true);

      const response = await BaseUrl.post("/patient/patient/", formData);

      if (response.status === 201) {
        setSuccessMessage(response.data.success);
        setErrorMessage(""); // Clear previous error message, if any
        setPatientId(response.data.data.id);
      } else if (response.status === 400) {
        setErrorMessage(response.data.error || "Validation failed.");
      } else {
        setErrorMessage("Failed to save patient details.");
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
      if (!doctorId) return;
      try {
        const dates = [
          format(new Date(), "yyyy-MM-dd"),
          format(addDays(new Date(), 1), "yyyy-MM-dd"),
          format(addDays(new Date(), 2), "yyyy-MM-dd"),
        ];

        setLoading(true); // Start loading
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
        setLoading(false); // Stop loading
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
    setSelectedSlot("today");
  };

  const handleTomorrow = () => {
    const tomorrow = addDays(new Date(), 1);
    setSelectedDate(tomorrow);
    handleViewSlots(tomorrow);
    setSelectedSlot("tomorrow");
  };

  const handleDayAfterTomorrow = () => {
    const dayAfterTomorrow = addDays(new Date(), 2);
    setSelectedDate(dayAfterTomorrow);
    handleViewSlots(dayAfterTomorrow);
    setSelectedSlot("dayAfterTomorrow");
  };

  const handleViewSlots = async (date) => {
    if (!doctorId) {
      setErrorMessage("Doctor ID is missing");
      return;
    }
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      setLoading(true); // Start loading
      const response = await BaseUrl.get(
        `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${formattedDate}`
      );
      if (response.status === 200) {
        setSlots(response.data);
        setShowSlots(true);
        setSlotErrorMessage(
          response.data.length === 0
            ? "No slots available for the selected date."
            : ""
        );
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch slots");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "An error occurred while fetching slots."
      );
    } finally {
      setLoading(false); // Stop loading
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
      setLoading(true);
      const response = await BaseUrl.post("/clinic/bookappointmentbyclinic/", {
        clinic_id: clinicId,
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
      setErrorMessage("Failed to confirm appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const patchPatientAppointment = async () => {
    try {
      const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
        patient_id: patientId,
        appointment: appointmentId, // Send appointment ID
      });

      if (patchResponse.status === 200) {
        setSuccessMessage(
          "Appointment confirmed and patient details updated successfully."
        );
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("");
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
      setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSelectPatient = async (patient) => {
    try {
      setLoading(true);
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
      setErrorMessage("An error occurred while fetching patient details.");
    } finally {
      setLoading(false);
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

  return (
    <div className="container-fluid">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {loading ? (
        <LoaderWrapper>
          <LoaderImage
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="Loading..."
          />
        </LoaderWrapper>
      ) : (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div className="row justify-content-center mt-5">
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
      )}
    </div>
  );
};

export default PatientAppointmentBook;