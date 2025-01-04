////Final code with 3 date buttons
////Final code with 3 date buttons
////Final code with 3 date buttons

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Modal,
//   Form,
//   Alert,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import onlineconsultation from "../../images/OnlineConsult.png";
// import finddoctor from "../../images/FindDoctorNearYou.jpg";
// import bookappointment from "../../images/BookAppointmentsdoc.jpg";
// import prescription from "../../images/PrescriptionVitals.jpg";
// import myappointment from "../../images/MyApointments.jpg";
// import mydocument from "../../images/MyDocuments.jpg";
// import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import { FaExclamationCircle } from "react-icons/fa";
// import { FaCheckCircle } from "react-icons/fa";
// import BaseUrl from "../../api/BaseUrl";
// import { CheckCircle } from "react-bootstrap-icons";
// import { load } from "@cashfreepayments/cashfree-js";
// import styled from "styled-components";
// import Loader from "react-js-loader";
// import { jwtDecode } from "jwt-decode";

// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: rgba(255, 255, 255, 0.7);
//   position: fixed;
//   width: 100%;
//   top: 0;
//   left: 0;
//   z-index: 9999;
// `;

// const LoaderImage = styled.div`
//   width: 400px;
// `;

// const PatientHome = () => {
//   const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [showSlotSelection, setShowSlotSelection] = useState(false);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [slotCounts, setSlotCounts] = useState(Array(3).fill(null));
//   const [selectedDateIndex, setSelectedDateIndex] = useState(0);
//   const [slots, setSlots] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [sameAsAppointment, setSameAsAppointment] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [selectedDoctor] = useState({ doctor: 2 });
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [savedPatientId, setPatientId] = useState(null);
//   const [consultationType, setConsultationType] = useState("walk-in");

//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [dob, setDob] = useState("");
//   const [age, setAge] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [gender, setGender] = useState("");
//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");

//   const [altName, setAltName] = useState("");
//   const [altMobile, setAltMobile] = useState("");
//   const [altDob, setAltDob] = useState("");
//   const [altAge, setAltAge] = useState("");
//   const [altBloodGroup, setAltBloodGroup] = useState("");
//   const [altGender, setAltGender] = useState("");
//   const [altAddress, setAltAddress] = useState("");
//   const [altEmail, setAltEmail] = useState("");

//   const slotSelectionRef = useRef(null);
//   const [hoverMessage, setHoverMessage] = useState("");

//   const onClose = async () => {
//     setIsModalOpen(false);
//     if (selectedSlot) {
//       try {
//         await BaseUrl.put("/payment/updateappointment", {
//           appointment_id: selectedSlot.id,
//           is_selected: false,
//         });
//         console.log("Slot is_selected reset to false");
//       } catch (error) {
//         console.error("Error resetting slot:", error);
//       }
//     }
//   };

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     const options = { hour: "numeric", minute: "numeric", hour12: true };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   const formatDate = (dateString) => {
//     const options = { month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatDay = (dateString) => {
//     const options = { weekday: "short" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const handleDateChange = (index) => {
//     const selectedDate = availableDates[index];
//     setSelectedDateIndex(index);
//     fetchSlots(selectedDate);
//   };

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

//   const [morningSlotIndex, setMorningSlotIndex] = useState(0);
//   const [afternoonSlotIndex, setAfternoonSlotIndex] = useState(0);
//   const [eveningSlotIndex, setEveningSlotIndex] = useState(0);

//   const SLOTS_PER_BATCH = 12;

//   const isMorning = (time) => {
//     const hour = parseInt(time.split(":")[0], 10);
//     return hour >= 6 && hour < 12;
//   };

//   const isAfternoon = (time) => {
//     const hour = parseInt(time.split(":")[0], 10);
//     return hour >= 12 && hour < 18;
//   };

//   const isEvening = (time) => {
//     const hour = parseInt(time.split(":")[0], 10);
//     return hour >= 18 && hour < 24;
//   };

//   const morningSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isMorning(slot.appointment_slot))
//     : [];
//   const afternoonSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isAfternoon(slot.appointment_slot))
//     : [];
//   const eveningSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isEvening(slot.appointment_slot))
//     : [];

//   const fetchSlots = async (selectedDate) => {
//     setLoading(true);
//     try {
//       setLoading(true);
//       const slotsResponse = await BaseUrl.get(
//         `/doctorappointment/blankslot/?doctor_id=${selectedDoctor.doctor}&slot_date=${selectedDate}`
//       );
//       const slotsData = Array.isArray(slotsResponse.data)
//         ? slotsResponse.data
//         : [];
//       setSlots(slotsData);
//     } catch (error) {
//       setSlots([]);
// } finally {
//   setLoading(false);
// }
//   };

//   const fetchSlotCounts = async () => {
//     try {
//       const countResponse = await BaseUrl.get(
//         `/clinic/countavailableslots/?doctor_id=${selectedDoctor.doctor}&dates=${availableDates.join("&dates=")}`
//       );
//       const countData = countResponse.data;
//       const newSlotCounts = availableDates.map((date) => {
//         const dateCount = countData.find((item) => item.date === date);
//         return dateCount ? dateCount.count : 0;
//       });
//       setSlotCounts(newSlotCounts);
//     } catch (error) {
//       setSlotCounts(availableDates.map(() => 0));
//     }
//   };

//   const handleSlotClick = async (slot) => {
//     setLoading(true);
//     setSelectedSlot(slot);
//     setSameAsAppointment(false);

//     try {
//       const putResponse = await BaseUrl.put("/payment/updateappointment", {
//         appointment_id: slot.id,
//       });
//       if (putResponse.status === 200) {
//         const mobile_number = localStorage.getItem("mobile_number");
//         const response = await BaseUrl.get("/patient/details/", {
//           params: { mobile_number: mobile_number },
//         });
//         if (response && response.data && response.data.length > 0) {
//           const patient = response.data[0];
//           setName(patient.name || "");
//           setMobile(patient.mobile_number || "");
//           setDob(patient.date_of_birth || "");
//           setAge(patient.age ? patient.age.toString() : "");
//           setBloodGroup(patient.blood_group || "");
//           setGender(patient.gender || "");
//           setAddress(patient.address || "");
//           setEmail(patient.email || "");

//           setAltName("");
//           setAltMobile("");
//           setAltDob("");
//           setAltAge("");
//           setAltBloodGroup("");
//           setAltGender("");
//           setAltAddress("");
//           setAltEmail("");
//         }
//       } else {
//         throw new Error("Failed to update appointment");
//       }
//     } catch (error) {
//       setErrorMessage();
//     } finally {
//       setLoading(false);
//     }
//     setIsModalOpen(true);
//   };

//   const handleAltNameChange = (e) => {
//     setAltName(e.target.value.replace(/[^A-Za-z\s]/g, ""));
//   };

//   const handleAltMobileChange = (e) => {
//     setAltMobile(e.target.value.replace(/[^0-9]/g, ""));
//   };

//   const handleAltDobChange = (e) => {
//     setAltDob(e.target.value);
//   };

//   const handleAltBloodGroupChange = (e) => {
//     setAltBloodGroup(e.target.value);
//   };

//   const handleAltGenderChange = (e) => {
//     setAltGender(e.target.value);
//   };

//   const handleAltAddressChange = (e) => {
//     setAltAddress(e.target.value);
//   };

//   const handleAltAgeChange = (e) => {
//     setAltAge(e.target.value.replace(/[^0-9]/g, ""));
//   };

//   const handleAltEmailChange = (e) => {
//     setAltEmail(e.target.value);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     const mandatoryFieldsFilled =
//       name && mobile && dob && age && gender && address;
//     const isEmailMandatory = consultationType === "online";

//     if (!mandatoryFieldsFilled || (isEmailMandatory && !email)) {
//       setErrorMessage(
//         isEmailMandatory
//           ? "Please fill in all required fields, including Email for online consultation."
//           : "Please fill in all required fields."
//       );
//       setTimeout(() => setErrorMessage(""), 5000);
//       setLoading(false);
//       return;
//     }

//     const patientDetails = sameAsAppointment
//       ? {
//           name: altName,
//           mobile_number: altMobile,
//           date_of_birth: altDob,
//           blood_group: altBloodGroup,
//           gender: altGender.toLowerCase(),
//           address: altAddress,
//           email: altEmail,
//           age: altAge,
//         }
//       : {
//           name,
//           mobile_number: mobile,
//           date_of_birth: dob,
//           blood_group: bloodGroup,
//           gender: gender.toLowerCase(),
//           address,
//           email,
//           age,
//         };

// try {
//   const response = await BaseUrl.post("/patient/patient/", patientDetails);
//   if (response.status === 201) {
//     const savedPatientId = response.data.data.id;
//     setPatientId(savedPatientId);
//     localStorage.setItem("savedPatientId", savedPatientId);
//     setErrorMessage("");
//     await handlePayment({
//       customer_name: patientDetails.name,
//       customer_phone: patientDetails.mobile_number,
//     });
//   } else {
//     setErrorMessage(response.data.error);
//   }
// } catch (error) {
//   setErrorMessage(
//     error.response?.data?.error ||
//       "An error occurred while saving patient details."
//   );
// } finally {
//   setLoading(false);
// }
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
//         setErrorMessage(response.data.error);
//         return null;
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error ||
//           "An error occurred while saving patient details."
//       );
//       return null;
//     }
//   };

//   const handlePayment = async ({ customer_name, customer_phone }) => {
//     setLoading(true);
//     try {
//       const patientToken = localStorage.getItem("patient_token");
//       if (!patientToken) {
//         throw new Error("Patient token not found");
//       }

//       const decodedToken = jwtDecode(patientToken);
//       const patient_id = decodedToken?.patient_id;

//       localStorage.setItem("selectedSlotId", selectedSlot.id);

//       const response = await fetch(
//         "http://192.168.29.95:8001/payment/create/",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             amount: "1000",
//             currency: "INR",
//             customer_name,
//             customer_phone,
//             patient_id,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         const { order_id, payment_session_id } = data;
//         localStorage.setItem("order_id", order_id);

//         if (payment_session_id) {
//           const cashfree = await load({ mode: "sandbox" });
//           await cashfree.checkout({
//             paymentSessionId: payment_session_id,
//             returnUrl: "http://localhost:3000/patient/home",
//           });
//           localStorage.setItem("paymentSuccess", "true");
//         } else {
//           setErrorMessage("Payment session ID missing");
//         }
//       } else {
//         const errorData = await response.json();
//         setErrorMessage(
//           `Payment initiation failed: ${errorData.message || "Unknown error"}`
//         );
//       }
//     } catch (error) {
//       setErrorMessage(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

//   useEffect(() => {
//     const paymentStatus = localStorage.getItem("paymentSuccess");

//     if (paymentStatus === "true") {
//       setIsPaymentConfirmed(true);
//       localStorage.removeItem("paymentSuccess");
//     }
//     if (isPaymentConfirmed) {
//       handleConfirmAppointment();
//     }
//   }, [isPaymentConfirmed]);

//   const handleConfirmAppointment = async () => {
//     try {
//       setLoading(true);
//       const slotId = localStorage.getItem("selectedSlotId");
//       const orderId = localStorage.getItem("order_id");
//       const selectedConsultationType = localStorage.getItem("consultationType");
//       const savedPatientId = localStorage.getItem("savedPatientId");

//       const paymentStatusResponse = await fetch(
//         `http://192.168.29.95:8001/payment/get/?order_id=${orderId}`
//       );
//       const paymentStatusData = await paymentStatusResponse.json();

//       if (paymentStatusData.status === "SUCCESS") {
//         try {
//           const postResponse = await BaseUrl.post(
//             "/patientappointment/bookslot/",
//             {
//               patient: savedPatientId,
//               doctor: selectedDoctor.doctor,
//               appointment_status: "upcoming",
//               appointment_slot: slotId,
//               consultation_type: selectedConsultationType,
//             }
//           );

//           if (postResponse && postResponse.data) {
//             setSuccessMessage(postResponse.data.success);
//             setShowSuccessPopup(true);
//             setTimeout(() => setShowSuccessPopup(false), 5000);
//           } else {
//             throw new Error("Failed to book the slot.");
//           }
//         } catch (postError) {
//           await BaseUrl.put("/payment/updateappointment", {
//             appointment_id: slotId,
//             is_selected: false,
//           });
//           setErrorMessage("Failed to confirm the appointment.");
//           setShowSuccessPopup(true);
//           setTimeout(() => setShowSuccessPopup(false), 5000);
//         }
//       } else {
//         await BaseUrl.put("/payment/updateappointment", {
//           appointment_id: slotId,
//           is_selected: false,
//         });
//         setErrorMessage("Payment was not successful. Please try again.");
//         setShowSuccessPopup(true);
//         setTimeout(() => setShowSuccessPopup(false), 5000);
//       }
//     } catch (error) {
//       const slotId = localStorage.getItem("selectedSlotId");
//       await BaseUrl.put("/payment/updateappointment", {
//         appointment_id: slotId,
//         is_selected: false,
//       });
//       setErrorMessage("An error occurred. Please try again.");
//       setShowSuccessPopup(true);
//       setTimeout(() => setShowSuccessPopup(false), 5000);
//     } finally {
//       setLoading(false);
//       localStorage.removeItem("selectedSlotId");
//       localStorage.removeItem("order_id");
//       localStorage.removeItem("consultationType");
//     }
//   };

//   useEffect(() => {
//     const paymentStatus = localStorage.getItem("paymentSuccess");
//     if (paymentStatus === "true") {
//       setShowConfirmModal(true);
//       localStorage.removeItem("paymentSuccess");
//     }
//     const fetchAppointments = async () => {
//       try {
//         const patient_token = localStorage.getItem("patient_token");
//         const decodedToken = JSON.parse(atob(patient_token.split(".")[1]));
//         const patient_id = decodedToken.patient_id;
//         const response = await BaseUrl.get(
//           `/patient/patient/?patient_id=${patient_id}`
//         );
//         const appointments = response.data;
//         const upcoming = appointments.filter(
//           (appointment) =>
//             !appointment.is_blocked &&
//             !appointment.is_canceled &&
//             !appointment.is_complete &&
//             appointment.is_booked
//         );
//         setUpcomingAppointments(upcoming);
//       } catch (error) {}
//     };
//     fetchAppointments();
//   }, []);

//   const renderAppointments = (
//     appointments,
//     handlePrevious,
//     handleNext,
//     currentIndex
//   ) => {
//     const isPreviousDisabled = currentIndex === 0;
//     const isNextDisabled = currentIndex + 3 >= appointments.length;
//     return (
//       <Row className="text-center align-items-center justify-content-center">
//         {appointments.length > 3 && (
//           <Col xs="auto">
//             <Button
//               variant="outline-primary"
//               onClick={handlePrevious}
//               disabled={isPreviousDisabled}
//               style={{
//                 color: isPreviousDisabled ? "#A9A9A9" : "",
//                 borderColor: isPreviousDisabled ? "#A9A9A9" : "",
//               }}
//             >
//               <BsChevronLeft />
//             </Button>
//           </Col>
//         )}
//         {appointments.length > 0 ? (
//           appointments
//             .slice(currentIndex, currentIndex + 3)
//             .map((appointment, index) => (
//               <Col key={index} md={3} className="mb-4">
//                 <Card className="h-100 shadow-sm appointment-card">
//                   <Card.Body>
//                     <Card.Title className="appointment-time">
//                       <div>
//                         Date: {formatDate(appointment.appointment_date)}
//                       </div>
//                       <div>
//                         Time: {formatTime(appointment.appointment_slot)}
//                       </div>
//                     </Card.Title>
//                     <Card.Text className="appointment-details">
//                       {appointment.details}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))
//         ) : (
//           <Col md={8} className="mb-4">
//             <div
//               style={{
//                 backgroundColor: "#f8d7da",
//                 color: "#721c24",
//                 padding: "10px",
//                 borderRadius: "5px",
//                 border: "1px solid #f5c6cb",
//                 textAlign: "center",
//               }}
//             >
//               No upcoming appointments available.
//             </div>
//           </Col>
//         )}
//         {appointments.length > 4 && (
//           <Col xs="auto">
//             <Button
//               variant="outline-primary"
//               onClick={handleNext}
//               disabled={isNextDisabled}
//               style={{
//                 color: isNextDisabled ? "#A9A9A9" : "",
//                 borderColor: isNextDisabled ? "#A9A9A9" : "",
//               }}
//             >
//               <BsChevronRight />
//             </Button>
//           </Col>
//         )}
//       </Row>
//     );
//   };

//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) => Math.max(prevIndex - 3, 0));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) =>
//       Math.min(prevIndex + 3, upcomingAppointments.length - 1)
//     );
//   };

//   const handleCardClick = (cardTitle) => {
//     const selectedConsultationType =
//       cardTitle === "Online Consultation" ? "online" : "walk-in";
//     setConsultationType(selectedConsultationType); // Update state for other parts of the app
//     localStorage.setItem("consultationType", selectedConsultationType); // Store it for immediate access

//     console.log(
//       `Card clicked: ${cardTitle}, Consultation Type set to: ${selectedConsultationType}`
//     );

//     setShowSlotSelection(true);
//     fetchSlots(availableDates[0]);
//     fetchSlotCounts();

//     setTimeout(() => {
//       slotSelectionRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   useEffect(() => {
//     const initializeAvailableDates = () => {
//       const today = new Date();
//       const dates = [];
//       for (let i = 0; i < 3; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() + i);
//         dates.push(date.toISOString().split("T")[0]);
//       }
//       setAvailableDates(dates);
//     };
//     initializeAvailableDates();
//   }, []);

//   const cardData = [
//     {
//       image: onlineconsultation,
//       title: "Online Consultation",
//       text: "Get online consultation easily in minimal steps.",
//       button: "Online Consultation",
//       link: "#",
//     },
//     {
//       image: finddoctor,
//       title: "Find Doctor near you",
//       text: "Find doctors available near your location.",
//       button: "Find Doctors",
//       link: "/patient/bookappointment",
//     },
//     {
//       image: bookappointment,
//       title: "Book Appointment",
//       text: "Easily book appointments.",
//       button: "Clinic Visit",
//       link: "#",
//     },
//     {
//       image: prescription,
//       title: "Prescription & Vitals",
//       text: "Manage your prescriptions and vitals.",
//       button: "Prescription & Vitals",
//       link: "/patient/home",
//     },
//     {
//       image: myappointment,
//       title: "My Appointments",
//       text: "View and manage your appointments.",
//       button: "My Appointments",
//       link: "/patient/slots",
//     },
//     {
//       image: mydocument,
//       title: "My Documents",
//       text: "Upload and manage your document.",
//       button: "My Documents",
//       link: "/patient/medicalrecords",
//     },
//   ];

//   const renderCards = () => {
//     const rows = [];
//     for (let i = 0; i < cardData.length; i += 3) {
//       const rowCards = cardData.slice(i, i + 3);
//       rows.push(
//         <Row key={`row-${i / 3}`} className="mb-2">
//           {rowCards.map((card, idx) => (
//             <Col key={idx} xs={12} md={4} className="mb-3">
//               <Link
//                 to={card.link}
//                 className="text-decoration-none w-100"
//                 onClick={() => handleCardClick(card.title)}
//               >
//                 <Card
//                   className="patient-card"
//                   style={{
//                     boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.15)",
//                     borderRadius: "8px",
//                     textAlign: "center",
//                     transition:
//                       "transform 0.3s, background-color 0.3s, color 0.3s",
//                     backgroundColor:
//                       hoveredCard === i + idx ? "#0091A5" : "#ffffff",
//                     color: hoveredCard === i + idx ? "#ffffff" : "#000000",
//                     transform:
//                       hoveredCard === i + idx ? "scale(1.02)" : "scale(1)",
//                     width: "100%",
//                   }}
//                   onMouseEnter={() => setHoveredCard(i + idx)}
//                   onMouseLeave={() => setHoveredCard(null)}
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={card.image}
//                     alt={card.title}
//                     style={{
//                       maxWidth: "100%",
//                       borderRadius: "8px",
//                       maxHeight: "165px",
//                     }}
//                   />
//                   <Card.Body>
//                     <Card.Title
//                       style={{
//                         fontSize: "18px",
//                         fontWeight: "600",
//                         color: hoveredCard === i + idx ? "#ffffff" : "#000000",
//                       }}
//                     >
//                       {card.title}
//                     </Card.Title>
//                     <Card.Text
//                       style={{
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         color: hoveredCard === i + idx ? "#ffffff" : "#000000",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       {card.text}
//                     </Card.Text>
//                     <Button
//                       variant="btn"
//                       style={{
//                         width: "fit-content",
//                         fontSize: "14px",
//                         padding: "5px 10px",
//                         backgroundColor:
//                           hoveredCard === i + idx ? "#ffffff" : "#0091A5",
//                         color: hoveredCard === i + idx ? "#0091A5" : "#ffffff",
//                       }}
//                     >
//                       {card.button}
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Link>
//             </Col>
//           ))}
//         </Row>
//       );
//     }
//     return rows;
//   };

//   return (
//     <Container
//       fluid
//       className="p-2"
//       style={{ backgroundColor: "#D7EAF0", overflowX: "hidden" }}
//     >
//       {loading && (
//         <LoaderWrapper>
//           <LoaderImage>
//             <Loader
//               type="spinner-circle"
//               bgColor="#0091A5"
//               color="#0091A5"
//               title="Loading..."
//               size={100}
//             />
//           </LoaderImage>
//         </LoaderWrapper>
//       )}

//       <header className="mb-4 mt-2 patient-header text-center">
//         <h1 style={{ color: "#185C65", fontWeight: "bold", fontSize: "24px" }}>
//           Welcome to Niramaya Homeopathy
//         </h1>
//       </header>

//       {upcomingAppointments.length > 0 && (
//         <div
//           className="text-center mb-3"
//           style={{ color: "#185C65", padding: "15px" }}
//         >
//           <h4>Upcoming Appointments</h4>
//           {renderAppointments(
//             upcomingAppointments,
//             handlePrevious,
//             handleNext,
//             currentIndex
//           )}
//         </div>
//       )}

//       <Col md={12}>
//         <Row className="row-cards">{renderCards()}</Row>
//       </Col>

//       {showSlotSelection && (
//         <div
//           ref={slotSelectionRef}
//           className="text-center mt-4 mb-4 position-relative"
//           style={{ backgroundColor: "#FBFBFB" }}
//         >
//           <Button
//             variant="link"
//             className="position-absolute"
//             style={{ top: 0, right: 0, fontSize: "1.5rem", color: "#000" }}
//             onClick={() => setShowSlotSelection(false)}
//           >
//             &times;
//           </Button>
//           <h3 style={{ paddingTop: "28px", paddingBottom: "28px" }}>
//             Select Slot for{" "}
//             {consultationType === "online"
//               ? "Online Consultation"
//               : "Clinic Visit"}
//           </h3>
//           <div className="appointment-date-button mb-3 d-flex flex-wrap justify-content-center">
//             {availableDates.map((date, index) => (
//               <div key={index} className="appointment-date-button-container">
//                 <Button
//                   variant={
//                     selectedDateIndex === index ? "primary" : "outline-primary"
//                   }
//                   className="appointment-date-button mr-3"
//                   onClick={() => handleDateChange(index)}
//                   style={{ width: "fit-content" }}
//                 >
//                   {index === 0
//                     ? "Today"
//                     : index === 1
//                       ? "Tomorrow"
//                       : `${formatDay(date)} (${formatDate(date)})`}
//                 </Button>
//                 <div style={{ fontSize: "12px", marginRight: "14px" }}>
//                   <span
//                     className={`slot-count ${slotCounts[index] > 0 ? "text-success" : "text-danger"}`}
//                   >
//                     {slotCounts[index] > 0
//                       ? `${slotCounts[index]} slots available`
//                       : "0 slots available"}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <p>Loading slots...</p>
//           ) : (
//             <div className="appointment-slots-section">
//               <Row className="text-center p-4">
//                 <Col md={4} className="appointment-slot-column">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div
//                       className={`appointment-custom-nav-button ${morningSlotIndex === 0 ? "disabled" : ""}`}
//                       onClick={
//                         morningSlotIndex === 0 ? null : handleMorningPrevious
//                       }
//                     >
//                       <BsChevronLeft />
//                     </div>
//                     <h4 className="slot-title text-center">Morning</h4>
//                     <div
//                       className={`appointment-custom-nav-button ${morningSlotIndex + SLOTS_PER_BATCH >= morningSlots.length ? "disabled" : ""}`}
//                       onClick={
//                         morningSlotIndex + SLOTS_PER_BATCH >=
//                         morningSlots.length
//                           ? null
//                           : handleMorningNext
//                       }
//                     >
//                       <BsChevronRight />
//                     </div>
//                   </div>

//                   <div
//                     className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
//                     style={{ width: "100%" }}
//                   >
//                     {morningSlots.length > 0 ? (
//                       morningSlots
//                         .slice(
//                           morningSlotIndex,
//                           morningSlotIndex + SLOTS_PER_BATCH
//                         )
//                         .map((slot) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "inline-block",
//                               margin: "5px",
//                             }}
//                             onMouseEnter={(e) =>
//                               slot.is_selected &&
//                               setHoverMessage("This slot is currently in use")
//                             }
//                             onMouseLeave={(e) => setHoverMessage("")}
//                           >
//                             <Button
//                               key={slot.id}
//                               variant="outline-primary"
//                               className="appointment-slots-button mb-2"
//                               onClick={() => handleSlotClick(slot)}
//                               disabled={slot.is_selected}
//                               style={{
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 fontSize: "0.8rem",
//                                 width: "80px",
//                                 height: "50px",
//                                 backgroundColor: slot.is_selected
//                                   ? "#cccccc"
//                                   : "#ffffff",
//                                 color: slot.is_selected ? "#666666" : "#000000",
//                                 border: slot.is_selected
//                                   ? "1px solid #999999"
//                                   : "1px solid #0091A5",
//                                 cursor: slot.is_selected
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                             >
//                               {formatTime(slot.appointment_slot)}
//                             </Button>
//                             {slot.is_selected && hoverMessage && (
//                               <div
//                                 style={{
//                                   position: "absolute",
//                                   top: "-35px",
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                   color: "#fff",
//                                   padding: "5px 10px",
//                                   borderRadius: "4px",
//                                   fontSize: "0.75rem",
//                                   whiteSpace: "nowrap",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {hoverMessage}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                     ) : (
//                       <p className="appointment-slot-section-message text-danger">
//                         No slots available for morning
//                       </p>
//                     )}
//                   </div>
//                 </Col>
//                 <Col md={4} className="appointment-slot-column">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div
//                       className={`appointment-custom-nav-button ${afternoonSlotIndex === 0 ? "disabled" : ""}`}
//                       onClick={
//                         afternoonSlotIndex === 0
//                           ? null
//                           : handleAfternoonPrevious
//                       }
//                     >
//                       <BsChevronLeft />
//                     </div>
//                     <h4 className="slot-title text-center">Afternoon</h4>
//                     <div
//                       className={`appointment-custom-nav-button ${afternoonSlotIndex + SLOTS_PER_BATCH >= afternoonSlots.length ? "disabled" : ""}`}
//                       onClick={
//                         afternoonSlotIndex + SLOTS_PER_BATCH >=
//                         afternoonSlots.length
//                           ? null
//                           : handleAfternoonNext
//                       }
//                     >
//                       <BsChevronRight />
//                     </div>
//                   </div>
//                   <div
//                     className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
//                     style={{ width: "100%" }}
//                   >
//                     {afternoonSlots.length > 0 ? (
//                       afternoonSlots
//                         .slice(
//                           afternoonSlotIndex,
//                           afternoonSlotIndex + SLOTS_PER_BATCH
//                         )
//                         .map((slot) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "inline-block",
//                               margin: "5px",
//                             }}
//                             onMouseEnter={(e) =>
//                               slot.is_selected &&
//                               setHoverMessage("This slot is currently in use")
//                             }
//                             onMouseLeave={(e) => setHoverMessage("")}
//                           >
//                             <Button
//                               key={slot.id}
//                               variant="outline-primary"
//                               className="appointment-slots-button mb-2"
//                               onClick={() => handleSlotClick(slot)}
//                               disabled={slot.is_selected}
//                               style={{
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 fontSize: "0.8rem",
//                                 width: "80px",
//                                 height: "50px",
//                                 backgroundColor: slot.is_selected
//                                   ? "#cccccc"
//                                   : "#ffffff",
//                                 color: slot.is_selected ? "#666666" : "#000000",
//                                 border: slot.is_selected
//                                   ? "1px solid #999999"
//                                   : "1px solid #0091A5",
//                                 cursor: slot.is_selected
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                             >
//                               {formatTime(slot.appointment_slot)}
//                             </Button>
//                             {slot.is_selected && hoverMessage && (
//                               <div
//                                 style={{
//                                   position: "absolute",
//                                   top: "-35px",
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                   color: "#fff",
//                                   padding: "5px 10px",
//                                   borderRadius: "4px",
//                                   fontSize: "0.75rem",
//                                   whiteSpace: "nowrap",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {hoverMessage}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                     ) : (
//                       <p className="appointment-slot-section-message text-danger">
//                         No slots available for afternoon
//                       </p>
//                     )}
//                   </div>
//                 </Col>
//                 <Col md={4} className="appointment-slot-column">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <div
//                       className={`appointment-custom-nav-button ${eveningSlotIndex === 0 ? "disabled" : ""}`}
//                       onClick={
//                         eveningSlotIndex === 0 ? null : handleEveningPrevious
//                       }
//                     >
//                       <BsChevronLeft />
//                     </div>
//                     <h4 className="slot-title text-center">Evening</h4>
//                     <div
//                       className={`appointment-custom-nav-button ${eveningSlotIndex + SLOTS_PER_BATCH >= eveningSlots.length ? "disabled" : ""}`}
//                       onClick={
//                         eveningSlotIndex + SLOTS_PER_BATCH >=
//                         eveningSlots.length
//                           ? null
//                           : handleEveningNext
//                       }
//                     >
//                       <BsChevronRight />
//                     </div>
//                   </div>
//                   <div
//                     className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
//                     style={{ width: "100%" }}
//                   >
//                     {eveningSlots.length > 0 ? (
//                       eveningSlots
//                         .slice(
//                           eveningSlotIndex,
//                           eveningSlotIndex + SLOTS_PER_BATCH
//                         )
//                         .map((slot) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "inline-block",
//                               margin: "5px",
//                             }}
//                             onMouseEnter={(e) =>
//                               slot.is_selected &&
//                               setHoverMessage("This slot is currently in use")
//                             }
//                             onMouseLeave={(e) => setHoverMessage("")}
//                           >
//                             <Button
//                               key={slot.id}
//                               variant="outline-primary"
//                               className="appointment-slots-button mb-2"
//                               onClick={() => handleSlotClick(slot)}
//                               disabled={slot.is_selected}
//                               style={{
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 fontSize: "0.8rem",
//                                 width: "80px",
//                                 height: "50px",
//                                 backgroundColor: slot.is_selected
//                                   ? "#cccccc"
//                                   : "#ffffff",
//                                 color: slot.is_selected ? "#666666" : "#000000",
//                                 border: slot.is_selected
//                                   ? "1px solid #999999"
//                                   : "1px solid #0091A5",
//                                 cursor: slot.is_selected
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                             >
//                               {formatTime(slot.appointment_slot)}
//                             </Button>
//                             {slot.is_selected && hoverMessage && (
//                               <div
//                                 style={{
//                                   position: "absolute",
//                                   top: "-35px",
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                   color: "#fff",
//                                   padding: "5px 10px",
//                                   borderRadius: "4px",
//                                   fontSize: "0.75rem",
//                                   whiteSpace: "nowrap",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {hoverMessage}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                     ) : (
//                       <p className="appointment-slot-section-message text-danger">
//                         No slots available for evening
//                       </p>
//                     )}
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           )}
//         </div>
//       )}

//       <Modal show={isModalOpen} onHide={onClose} centered size="xl">
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
//                 <label style={{ fontWeight: "bold" }}>Name</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   onChange={(e) =>
//                     setName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
//                   }
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Mobile No</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={mobile}
//                   onChange={(e) =>
//                     setMobile(e.target.value.replace(/[^0-9]/g, ""))
//                   }
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                   disabled
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Date of Birth</label>{" "}
//                 <span className="text-danger">*</span>
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
//                 <label style={{ fontWeight: "bold" }}>Gender</label>{" "}
//                 <span className="text-danger">*</span>
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
//                 <label style={{ fontWeight: "bold" }}>Age</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={age}
//                   onChange={(e) =>
//                     setAge(e.target.value.replace(/[^0-9]/g, ""))
//                   }
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Address</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Email Id</label>{" "}
//                 <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Name</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altName}
//                       onChange={handleAltNameChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Mobile No</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altMobile}
//                       onChange={handleAltMobileChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Date of Birth</label>{" "}
//                     <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Blood Group</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altBloodGroup}
//                       onChange={handleAltBloodGroupChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Gender</label>{" "}
//                     <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Age</label>{" "}
//                     <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Address</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altAddress}
//                       onChange={handleAltAddressChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Email Id</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altEmail}
//                       onChange={handleAltEmailChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Relation</label>{" "}
//                     <span className="text-danger">*</span>
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
//           <Modal.Title>Confirm Appointment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Would you like to confirm this appointment?</Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowConfirmModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleConfirmAppointment}>
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showSuccessPopup}
//         onHide={() => setShowSuccessPopup(false)}
//         centered
//       >
//         <Modal.Header
//           style={{ backgroundColor: "#d4edda", borderBottom: "none" }}
//         >
//           <Modal.Title
//             className="d-flex align-items-center mt-5"
//             style={{ color: "#155724" }}
//           >
//             <CheckCircle style={{ marginRight: "10px" }} />
//             Appointment Confirmed!
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           style={{
//             backgroundColor: "#d4edda",
//             color: "#155724",
//             textAlign: "center",
//           }}
//         >
//           {successMessage}
//         </Modal.Body>
//       </Modal>

//       <Modal
//         show={showSuccessPopup}
//         onHide={() => {
//           setShowSuccessPopup(false);
//           setErrorMessage("");
//           setSuccessMessage("");
//         }}
//         centered
//       >
//         <Modal.Header
//           style={{
//             backgroundColor: errorMessage ? "#f8d7da" : "#d4edda",
//             borderBottom: "none",
//           }}
//         >
//           <Modal.Title
//             className="d-flex align-items-center mt-5"
//             style={{
//               color: errorMessage ? "#721c24" : "#155724",
//             }}
//           >
//             {errorMessage ? (
//               <FaExclamationCircle style={{ marginRight: "10px" }} />
//             ) : (
//               <FaCheckCircle style={{ marginRight: "10px" }} />
//             )}
//             {errorMessage || successMessage}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Footer
//           style={{
//             backgroundColor: errorMessage ? "#f8d7da" : "#d4edda",
//             borderTop: "none",
//           }}
//         />
//       </Modal>

//       <Modal
//         show={isPaymentSuccessful}
//         centered
//         onHide={() => setIsPaymentSuccessful(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Payment Confirmation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="success">
//             <CheckCircle /> {successMessage}
//           </Alert>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default PatientHome;














// import React, { useState, useEffect, useRef } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Modal,
//   Form,
//   Alert,
// } from "react-bootstrap";
// import { Link, useHistory } from "react-router-dom";
// import onlineconsultation from "../../images/OnlineConsult.png";
// import finddoctor from "../../images/FindDoctorNearYou.jpg";
// import bookappointment from "../../images/BookAppointmentsdoc.jpg";
// import prescription from "../../images/PrescriptionVitals.jpg";
// import myappointment from "../../images/MyApointments.jpg";
// import mydocument from "../../images/MyDocuments.jpg";
// import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import { FaExclamationCircle, FaCalendarAlt } from "react-icons/fa";
// import { FaCheckCircle } from "react-icons/fa";
// import BaseUrl from "../../api/BaseUrl";
// import { CheckCircle } from "react-bootstrap-icons";
// import styled from "styled-components";
// import Loader from "react-js-loader";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { format, addDays } from "date-fns";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: rgba(255, 255, 255, 0.7);
//   position: fixed;
//   width: 100%;
//   top: 0;
//   left: 0;
//   z-index: 9999;
// `;

// const LoaderImage = styled.div`
//   width: 400px;
// `;

// const PatientHome = () => {
//   const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [showSlotSelection, setShowSlotSelection] = useState(false);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [slotCounts, setSlotCounts] = useState(Array(3).fill(null));
//   const [selectedDateIndex, setSelectedDateIndex] = useState(0);
//   const [slots, setSlots] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [sameAsAppointment, setSameAsAppointment] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [selectedDoctor] = useState({ doctor: 2 });
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [savedPatientId, setPatientId] = useState(null);
//   const [consultationType, setConsultationType] = useState("walk-in");

//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [dob, setDob] = useState("");
//   const [age, setAge] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [gender, setGender] = useState("");
//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");

//   const [altName, setAltName] = useState("");
//   const [altMobile, setAltMobile] = useState("");
//   const [altDob, setAltDob] = useState("");
//   const [altAge, setAltAge] = useState("");
//   const [altBloodGroup, setAltBloodGroup] = useState("");
//   const [altGender, setAltGender] = useState("");
//   const [altAddress, setAltAddress] = useState("");
//   const [altEmail, setAltEmail] = useState("");

//   const slotSelectionRef = useRef(null);
//   const [hoverMessage, setHoverMessage] = useState("");
//   const [startIndex, setStartIndex] = useState(0);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const calendarRef = useRef(null);

//   const history = useHistory();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (calendarRef.current && !calendarRef.current.contains(event.target)) {
//         setShowCalendar(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const onClose = async () => {
//     setIsModalOpen(false);
//     if (selectedSlot) {
//       try {
//         await BaseUrl.put("/payment/updateappointment", {
//           appointment_id: selectedSlot.id,
//           is_selected: false,
//         });
//       } catch (error) {
//       }
//     }
//   };

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     const options = { hour: "numeric", minute: "numeric", hour12: true };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   const formatDate = (dateString) => {
//     const options = { month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const handleDateChange = (index) => {
//     const selectedDate = availableDates[startIndex + index];
//     setSelectedDateIndex(startIndex + index);
//     fetchSlots(selectedDate);
//   };

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

//   const handleDateNavigation = (direction) => {
//     setStartIndex((prevIndex) => {
//       let newIndex = prevIndex;
//       if (direction === "prev" && newIndex > 0) {
//         newIndex = newIndex - 1;
//       } else if (direction === "next" && newIndex < availableDates.length - 3) {
//         newIndex = newIndex + 1;
//       }
//       // Update the selected date index based on the new start index
//       setSelectedDateIndex(newIndex);
//       return newIndex;
//     });
//   };

//   const visibleDates = availableDates.slice(startIndex, startIndex + 3);

//   const getDateLabel = (date, index) => {
//     const currentDate = new Date();
//     const dateObj = new Date(date);

//     if (index === 0 && dateObj.toDateString() === currentDate.toDateString()) {
//       return "Today";
//     } else if (
//       index === 1 &&
//       dateObj.toDateString() === addDays(currentDate, 1).toDateString()
//     ) {
//       return "Tomorrow";
//     } else {
//       // Format the date as "Mon, Oct 16"
//       return format(dateObj, "EEE, MMM d");
//     }
//   };

//   const [morningSlotIndex, setMorningSlotIndex] = useState(0);
//   const [afternoonSlotIndex, setAfternoonSlotIndex] = useState(0);
//   const [eveningSlotIndex, setEveningSlotIndex] = useState(0);

//   const SLOTS_PER_BATCH = 12;

//   const isMorning = (time) => {
//     const hour = parseInt(time.split(":")[0], 10);
//     return hour >= 6 && hour < 12;
//   };

//   const isAfternoon = (time) => {
//     const hour = parseInt(time.split(":")[0], 10);
//     return hour >= 12 && hour < 18;
//   };

//   const isEvening = (time) => {
//     const hour = parseInt(time.split(":")[0], 10);
//     return hour >= 18 && hour < 24;
//   };

//   const morningSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isMorning(slot.appointment_slot))
//     : [];
//   const afternoonSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isAfternoon(slot.appointment_slot))
//     : [];
//   const eveningSlots = Array.isArray(slots)
//     ? slots.filter((slot) => isEvening(slot.appointment_slot))
//     : [];

//   const fetchSlots = async (selectedDate) => {
//     setLoading(true);
//     try {
//       setLoading(true);
//       const slotsResponse = await BaseUrl.get(
//         `/doctorappointment/blankslot/?doctor_id=${selectedDoctor.doctor}&slot_date=${selectedDate}`
//       );
//       const slotsData = Array.isArray(slotsResponse.data)
//         ? slotsResponse.data
//         : [];
//       setSlots(slotsData);
//     } catch (error) {
//       setSlots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (availableDates.length > 0 && fetchSlots) {
//       const selectedDate = availableDates[selectedDateIndex];
//       fetchSlots(selectedDate); // Fetch slots for the selected date
//     }
//   }, [selectedDateIndex, availableDates]);

//   const fetchSlotCounts = async () => {
//     try {
//       const countResponse = await BaseUrl.get(
//         `/clinic/countavailableslots/?doctor_id=${selectedDoctor.doctor}&dates=${availableDates.join("&dates=")}`
//       );
//       const countData = countResponse.data;
//       const newSlotCounts = availableDates.map((date) => {
//         const dateCount = countData.find((item) => item.date === date);
//         return dateCount ? dateCount.count : 0;
//       });
//       setSlotCounts(newSlotCounts);
//     } catch (error) {
//       setSlotCounts(availableDates.map(() => 0));
//     }
//   };

//   const handleSlotClick = async (slot) => {
//     setLoading(true);
//     setSelectedSlot(slot);
//     setSameAsAppointment(false);

//     try {
//       const putResponse = await BaseUrl.put("/payment/updateappointment", {
//         appointment_id: slot.id,
//       });

//       if (putResponse.status === 200) {
//         localStorage.setItem("selectedSlotId", slot.id);
//         localStorage.setItem("consultationType", consultationType);
//       }
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
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//     setIsModalOpen(true);
//   };

//   const handleAltNameChange = (e) => {
//     setAltName(e.target.value.replace(/[^A-Za-z\s]/g, ""));
//   };

//   const handleAltMobileChange = (e) => {
//     setAltMobile(e.target.value.replace(/[^0-9]/g, ""));
//   };

//   const handleAltDobChange = (e) => {
//     setAltDob(e.target.value);
//   };

//   const handleAltBloodGroupChange = (e) => {
//     setAltBloodGroup(e.target.value);
//   };

//   const handleAltGenderChange = (e) => {
//     setAltGender(e.target.value);
//   };

//   const handleAltAddressChange = (e) => {
//     setAltAddress(e.target.value);
//   };

//   const handleAltAgeChange = (e) => {
//     setAltAge(e.target.value.replace(/[^0-9]/g, ""));
//   };

//   const handleAltEmailChange = (e) => {
//     setAltEmail(e.target.value);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     const mandatoryFieldsFilled =
//       name && mobile && dob && age && gender && address;
//     const isEmailMandatory = consultationType === "online";

//     if (!mandatoryFieldsFilled || (isEmailMandatory && !email)) {
//       setErrorMessage(
//         isEmailMandatory
//           ? "Please fill in all required fields, including Email for online consultation."
//           : "Please fill in all required fields."
//       );
//       setTimeout(() => setErrorMessage(""), 5000);
//       setLoading(false);
//       return;
//     }

//     const patientDetails = sameAsAppointment
//       ? {
//           name: altName,
//           mobile_number: altMobile,
//           date_of_birth: altDob,
//           blood_group: altBloodGroup,
//           gender: altGender.toLowerCase(),
//           address: altAddress,
//           email: altEmail,
//           age: altAge,
//         }
//       : {
//           name,
//           mobile_number: mobile,
//           date_of_birth: dob,
//           blood_group: bloodGroup,
//           gender: gender.toLowerCase(),
//           address,
//           email,
//           age,
//         };

//     try {
//       const response = await BaseUrl.post("/patient/patient/", patientDetails);
//       if (response.status === 201) {
//         const savedPatientId = response.data.data.id;
//         console.log(savedPatientId);
//         setPatientId(savedPatientId);
//         localStorage.setItem("savedPatientId", savedPatientId);

//         // Redirect to Checkout page after saving patient details
//         history.push("/patient/home/checkout");
//       } else {
//         setErrorMessage(response.data.error);
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

//   // const handlePayment = async ({ customer_name, customer_phone }) => {
//   //   setLoading(true);
//   //   try {
//   //     const patientToken = localStorage.getItem("patient_token");
//   //     const decodedToken = jwtDecode(patientToken);
//   //     const patient_id = decodedToken?.patient_id;

//   //     localStorage.setItem("selectedSlotId", selectedSlot.id);

//   //     const response = await fetch(
//   //       "http://192.168.29.95:8001/payment/create/",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           Accept: "application/json",
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           // amount: "1000",
//   //           // currency: "INR",
//   //           amount: consultationFee,
//   //           currency: currency,
//   //           customer_name,
//   //           customer_phone,
//   //           patient_id,
//   //         }),
//   //       }
//   //     );

//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       const { order_id, payment_session_id } = data;
//   //       localStorage.setItem("order_id", order_id);

//   //       if (payment_session_id) {
//   //         const cashfree = await load({ mode: "production" });
//   //         await cashfree.checkout({
//   //           paymentSessionId: payment_session_id,
//   //           returnUrl: "http://localhost:3001/patient/home",
//   //         });
//   //         localStorage.setItem("paymentSuccess", "true");
//   //       } else {
//   //         setErrorMessage("Payment session ID missing");
//   //       }
//   //     } else {
//   //       const errorData = await response.json();
//   //       setErrorMessage(
//   //         `Payment initiation failed: ${errorData.message || "Unknown error"}`
//   //       );
//   //     }
//   //   } catch (error) {
//   //     setErrorMessage(`Error: ${error.message}`);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

//   useEffect(() => {
//     const paymentStatus = localStorage.getItem("paymentSuccess");

//     if (paymentStatus === "true") {
//       setIsPaymentConfirmed(true);
//       localStorage.removeItem("paymentSuccess");
//     }
//     if (isPaymentConfirmed) {
//       handleConfirmAppointment();
//     }
//   }, [isPaymentConfirmed]);

//   const handleConfirmAppointment = async () => {
//     setLoading(true);
//     try {
//       // Retrieve values from local storage
//       const slotId = localStorage.getItem("selectedSlotId");
//       const consultationType = localStorage.getItem("consultationType");
//       const orderId = localStorage.getItem("order_id");
//       const savedPatientId = localStorage.getItem("savedPatientId");

//       // Check payment status
//       const paymentStatusResponse = await BaseUrl.get(`/payment/get/`, {
//         params: { order_id: orderId },
//       });
//       const paymentStatusData = paymentStatusResponse.data;

//       if (paymentStatusData.status === "SUCCESS") {
//         try {
//           // Book appointment API call
//           const postResponse = await BaseUrl.post("/patientappointment/bookslot/", {
//             patient: savedPatientId,
//             doctor: selectedDoctor.doctor,
//             appointment_status: "upcoming",
//             appointment_slot: slotId,
//             consultation_type: consultationType,
//           });

//           if (postResponse && postResponse.data) {
//             setSuccessMessage(postResponse.data.success);
//             setShowSuccessPopup(true);
//             setTimeout(() => setShowSuccessPopup(false), 5000);
//           } else {
//             throw new Error("Failed to book the slot.");
//           }
//         } catch (error) {
//           // Revert appointment status if booking fails
//           await BaseUrl.put("/payment/updateappointment", {
//             appointment_id: slotId,
//             is_selected: false,
//           });
//           setErrorMessage("Failed to confirm the appointment.");
//         }
//       } else {
//         // Payment failed
//         await BaseUrl.put("/payment/updateappointment", {
//           appointment_id: slotId,
//           is_selected: false,
//         });
//         setErrorMessage("Payment was not successful. Please try again.");
//       }
//     } catch (error) {
//       setErrorMessage("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//       // Clear relevant local storage items
//       localStorage.removeItem("selectedSlotId");
//       localStorage.removeItem("consultationType");
//       localStorage.removeItem("order_id");
//     }
//   };

//   useEffect(() => {
//     const paymentStatus = localStorage.getItem("paymentSuccess");
//     if (paymentStatus === "true") {
//       setShowConfirmModal(true);
//       localStorage.removeItem("paymentSuccess");
//     }
//     const fetchAppointments = async () => {
//       try {
//         const patient_token = localStorage.getItem("patient_token");
//         const decodedToken = JSON.parse(atob(patient_token.split(".")[1]));
//         const patient_id = decodedToken.patient_id;
//         const response = await BaseUrl.get(
//           `/patient/patient/?patient_id=${patient_id}`
//         );
//         const appointments = response.data;
//         const upcoming = appointments.filter(
//           (appointment) =>
//             !appointment.is_blocked &&
//             !appointment.is_canceled &&
//             !appointment.is_complete &&
//             appointment.is_booked
//         );
//         setUpcomingAppointments(upcoming);
//       } catch (error) {}
//     };
//     fetchAppointments();
//   }, []);

//   const renderAppointments = (
//     appointments,
//     handlePrevious,
//     handleNext,
//     currentIndex
//   ) => {
//     const isPreviousDisabled = currentIndex === 0;
//     const isNextDisabled = currentIndex + 3 >= appointments.length;
//     return (
//       <Row className="text-center align-items-center justify-content-center">
//         {appointments.length > 3 && (
//           <Col xs="auto">
//             <Button
//               variant="outline-primary"
//               onClick={handlePrevious}
//               disabled={isPreviousDisabled}
//               style={{
//                 color: isPreviousDisabled ? "#A9A9A9" : "",
//                 borderColor: isPreviousDisabled ? "#A9A9A9" : "",
//               }}
//             >
//               <BsChevronLeft />
//             </Button>
//           </Col>
//         )}
//         {appointments.length > 0 ? (
//           appointments
//             .slice(currentIndex, currentIndex + 3)
//             .map((appointment, index) => (
//               <Col key={index} md={3} className="mb-4">
//                 <Card className="h-100 shadow-sm appointment-card">
//                   <Card.Body>
//                     <Card.Title className="appointment-time">
//                       <div>
//                         Date: {formatDate(appointment.appointment_date)}
//                       </div>
//                       <div>
//                         Time: {formatTime(appointment.appointment_slot)}
//                       </div>
//                     </Card.Title>
//                     <Card.Text className="appointment-details">
//                       {appointment.details}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))
//         ) : (
//           <Col md={8} className="mb-4">
//             <div
//               style={{
//                 backgroundColor: "#f8d7da",
//                 color: "#721c24",
//                 padding: "10px",
//                 borderRadius: "5px",
//                 border: "1px solid #f5c6cb",
//                 textAlign: "center",
//               }}
//             >
//               No upcoming appointments available.
//             </div>
//           </Col>
//         )}
//         {appointments.length > 4 && (
//           <Col xs="auto">
//             <Button
//               variant="outline-primary"
//               onClick={handleNext}
//               disabled={isNextDisabled}
//               style={{
//                 color: isNextDisabled ? "#A9A9A9" : "",
//                 borderColor: isNextDisabled ? "#A9A9A9" : "",
//               }}
//             >
//               <BsChevronRight />
//             </Button>
//           </Col>
//         )}
//       </Row>
//     );
//   };

//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) => Math.max(prevIndex - 3, 0));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) =>
//       Math.min(prevIndex + 3, upcomingAppointments.length - 1)
//     );
//   };

//   const [consultationFee, setConsultationFee] = useState(null);
//   const [currency, setCurrency] = useState(null);

//   const handleCardClick = async (cardTitle) => {
//     const selectedConsultationType =
//       cardTitle === "Online Consultation" ? "online" : "walk-in";
//     setConsultationType(selectedConsultationType);
//     try {
//       const mobileNumber = localStorage.getItem("mobile_number");
//       const response = await BaseUrl.get(`/patient/details/`, {
//         params: { mobile_number: mobileNumber },
//       });

//       if (response.data.length > 0) {
//         const patientDetails = response.data[0];
//         const mobileString = patientDetails.mobile_number.toString();

//         const extractedMobileNumber = mobileString.slice(-10);
//         const countryCode = mobileString.slice(0, -10);
//         const feeResponse = await BaseUrl.get(
//           // `/patient/fee/?country_code=${countryCode}`
//           `/patient/fee/?country_code=91`
//         );

//         const feeData = feeResponse.data;
//         setConsultationFee(feeData.consultation_fee);
//         setCurrency(feeData.currency);
//       }
//     } catch (error) {
//     }
//     setShowSlotSelection(true);
//     fetchSlots(availableDates[0]);
//     fetchSlotCounts();
//     setTimeout(() => {
//       slotSelectionRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   useEffect(() => {
//     const initializeAvailableDates = () => {
//       const today = new Date();
//       const dates = Array.from({ length: 30 }, (_, i) =>
//         format(addDays(today, i), "yyyy-MM-dd")
//       );
//       setAvailableDates(dates);
//     };
//     initializeAvailableDates();
//   }, []);

//   const cardData = [
//     {
//       image: onlineconsultation,
//       title: "Online Consultation",
//       text: "Get online consultation easily in minimal steps.",
//       button: "Online Consultation",
//       link: "#",
//     },
//     {
//       image: finddoctor,
//       title: "Find Doctor near you",
//       text: "Find doctors available near your location.",
//       button: "Find Doctors",
//       link: "/patient/bookappointment",
//     },
//     {
//       image: bookappointment,
//       title: "Clinic Visit",
//       text: "Easily book appointments.",
//       button: "Clinic Visit",
//       link: "#",
//     },
//     {
//       image: prescription,
//       title: "Prescription & Vitals",
//       text: "Manage your prescriptions and vitals.",
//       button: "Prescription & Vitals",
//       link: "/patient/home",
//     },
//     {
//       image: myappointment,
//       title: "My Appointments",
//       text: "View and manage your appointments.",
//       button: "My Appointments",
//       link: "/patient/slots",
//     },
//     {
//       image: mydocument,
//       title: "My Documents",
//       text: "Upload and manage your document.",
//       button: "My Documents",
//       link: "/patient/medicalrecords",
//     },
//   ];

//   const renderCards = () => {
//     const rows = [];
//     for (let i = 0; i < cardData.length; i += 3) {
//       const rowCards = cardData.slice(i, i + 3);
//       rows.push(
//         <Row key={`row-${i / 3}`} className="mb-2">
//           {rowCards.map((card, idx) => (
//             <Col key={idx} xs={12} md={4} className="mb-3">
//               <Link
//                 to={card.link}
//                 className="text-decoration-none w-100"
//                 onClick={() => handleCardClick(card.title)}
//               >
//                 <Card
//                   className="patient-card"
//                   style={{
//                     boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.15)",
//                     borderRadius: "8px",
//                     textAlign: "center",
//                     transition:
//                       "transform 0.3s, background-color 0.3s, color 0.3s",
//                     backgroundColor:
//                       hoveredCard === i + idx ? "#0091A5" : "#ffffff",
//                     color: hoveredCard === i + idx ? "#ffffff" : "#000000",
//                     transform:
//                       hoveredCard === i + idx ? "scale(1.02)" : "scale(1)",
//                     width: "100%",
//                   }}
//                   onMouseEnter={() => setHoveredCard(i + idx)}
//                   onMouseLeave={() => setHoveredCard(null)}
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={card.image}
//                     alt={card.title}
//                     style={{
//                       maxWidth: "100%",
//                       borderRadius: "8px",
//                       maxHeight: "165px",
//                     }}
//                   />
//                   <Card.Body>
//                     <Card.Title
//                       style={{
//                         fontSize: "18px",
//                         fontWeight: "600",
//                         color: hoveredCard === i + idx ? "#ffffff" : "#000000",
//                       }}
//                     >
//                       {card.title}
//                     </Card.Title>
//                     <Card.Text
//                       style={{
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         color: hoveredCard === i + idx ? "#ffffff" : "#000000",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       {card.text}
//                     </Card.Text>
//                     <Button
//                       variant="btn"
//                       style={{
//                         width: "fit-content",
//                         fontSize: "14px",
//                         padding: "5px 10px",
//                         backgroundColor:
//                           hoveredCard === i + idx ? "#ffffff" : "#0091A5",
//                         color: hoveredCard === i + idx ? "#0091A5" : "#ffffff",
//                       }}
//                     >
//                       {card.button}
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Link>
//             </Col>
//           ))}
//         </Row>
//       );
//     }
//     return rows;
//   };

//   return (
//     <Container
//       fluid
//       className="p-2"
//       style={{ backgroundColor: "#D7EAF0", overflowX: "hidden" }}
//     >
//       {loading && (
//         <LoaderWrapper>
//           <LoaderImage>
//             <Loader
//               type="spinner-circle"
//               bgColor="#0091A5"
//               color="#0091A5"
//               title="Loading..."
//               size={100}
//             />
//           </LoaderImage>
//         </LoaderWrapper>
//       )}

//       <header className=" mt-4 patient-header text-center">
//         <h1 style={{ color: "#185C65", fontWeight: "bold", fontSize: "32px" }}>
//           Welcome to Niramaya Homeopathy
//         </h1>
//       </header>

//       {upcomingAppointments.length > 0 && (
//         <div
//           className="text-center mb-2"
//           style={{ color: "#185C65", padding: "15px" }}
//         >
//           <h4 className="mb-4">Upcoming Appointments</h4>
//           {renderAppointments(
//             upcomingAppointments,
//             handlePrevious,
//             handleNext,
//             currentIndex
//           )}
//         </div>
//       )}

//       <Col md={12}>
//         <Row className="row-cards">{renderCards()}</Row>
//       </Col>

//       {showSlotSelection && (
//         <div
//           ref={slotSelectionRef}
//           className="text-center mt-4 mb-4 position-relative"
//           style={{ backgroundColor: "#FBFBFB" }}
//         >
//           <Button
//             variant="link"
//             className="position-absolute"
//             style={{ top: 0, right: 0, fontSize: "1.5rem", color: "#000" }}
//             onClick={() => setShowSlotSelection(false)}
//           >
//             &times;
//           </Button>
//           <h3 style={{ paddingTop: "28px", paddingBottom: "28px" }}>
//             Select Slot for{" "}
//             {consultationType === "online"
//               ? "Online Consultation"
//               : "Clinic Visit"}
//           </h3>

//           <div
//             className="appointment-date-button mb-3 mt-4 d-flex justify-content-center align-items-center"
//             style={{
//               flexWrap: "nowrap",
//               overflowX: "auto",
//               whiteSpace: "nowrap",
//               gap: "10px",
//             }}
//           >
//             {/* Left Arrow Button */}
//             <Button
//               variant="outline-success"
//               className="flex-shrink-0 mb-4"
//               onClick={() => handleDateNavigation("prev")}
//               disabled={startIndex === 0}
//             >
//               <FaChevronLeft />
//             </Button>

//             {/* Date Buttons */}
//             {visibleDates.map((date, index) => (
//               <div
//                 key={index}
//                 className="appointment-date-button-container d-flex flex-column align-items-center flex-shrink-0"
//                 style={{ margin: "0 5px" }}
//               >
//                 <Button
//                   variant={
//                     selectedDateIndex === startIndex + index
//                       ? "success"
//                       : "outline-success"
//                   }
//                   onClick={() => handleDateChange(index)}
//                   style={{
//                     width: "100px", // Set a fixed width
//                     height: "40px", // Set a fixed height
//                     display: "flex", // Use flexbox for alignment
//                     alignItems: "center", // Center content vertically
//                     justifyContent: "center", // Center content horizontally
//                     textAlign: "center", // Additional text alignment
//                   }}
//                 >
//                   {getDateLabel(date, index)}
//                 </Button>
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     textAlign: "center",
//                     marginTop: "5px",
//                   }}
//                 >
//                   <span
//                     className={`slot-count ${
//                       slotCounts[startIndex + index] > 0
//                         ? "text-success"
//                         : "text-danger"
//                     }`}
//                   >
//                     {slotCounts[startIndex + index] > 0
//                       ? `${slotCounts[startIndex + index]} slots available`
//                       : "0 slots available"}
//                   </span>
//                 </div>
//               </div>
//             ))}

//             {/* Right Arrow Button */}
//             <Button
//               variant="outline-success"
//               className="flex-shrink-0 mb-4"
//               onClick={() => handleDateNavigation("next")}
//               disabled={startIndex === availableDates.length - 3}
//             >
//               <FaChevronRight />
//             </Button>
//           </div>

//           {/* {consultationFee && currency && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "22%",
//                 right: "20%",
//                 transform: "translateY(-50%)",
//                 fontSize: "1.3rem",
//                 fontWeight: "600",
//                 color: "#0A3981",
//               }}
//             >
//               Consultation Fees: {`${currency} ${consultationFee}`}
//             </div>
//           )} */}
//           <Button
//             variant="success"
//             className="calendar-icon"
//             onClick={() => setShowCalendar((prev) => !prev)}
//             style={{
//               fontSize: "2rem",
//               position: "absolute",
//               top: 60,
//               right: 20,
//             }}
//           >
//             <FaCalendarAlt />
//           </Button>

//           {showCalendar && (
//             <div
//               ref={calendarRef} // Attach the ref to the calendar container
//               className="appointment-calendar"
//               style={{
//                 position: "absolute",
//                 right: "20px",
//                 top: "40px",
//                 zIndex: 1000,
//               }}
//             >
//               <DatePicker
//                 selected={new Date(selectedDate || availableDates[0])}
//                 onChange={(date) => {
//                   const formattedDate = format(date, "yyyy-MM-dd");
//                   setSelectedDate(formattedDate);
//                   fetchSlots(formattedDate);
//                   setShowCalendar(false);
//                 }}
//                 inline
//                 minDate={new Date()}
//               />
//             </div>
//           )}

//           {loading ? (
//             <p>Loading slots...</p>
//           ) : (
//             <div className="appointment-slots-section">
//               <Row className="text-center p-4">
//                 <Col md={4} className="appointment-slot-column">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     {morningSlots.length > 0 && morningSlotIndex > 0 && (
//                       <Button
//                         variant="outline-success"
//                         className="appointment-custom-nav-button"
//                         onClick={
//                           morningSlotIndex === 0 ? null : handleMorningPrevious
//                         }
//                       >
//                         <BsChevronLeft />
//                       </Button>
//                     )}

//                     <h4 className="slot-title text-center flex-grow-1">
//                       Morning
//                     </h4>

//                     {morningSlots.length > 0 &&
//                       morningSlotIndex + SLOTS_PER_BATCH <
//                         morningSlots.length && (
//                         <Button
//                           variant="outline-success"
//                           className="appointment-custom-nav-button"
//                           onClick={
//                             morningSlotIndex + SLOTS_PER_BATCH >=
//                             morningSlots.length
//                               ? null
//                               : handleMorningNext
//                           }
//                         >
//                           <BsChevronRight />
//                         </Button>
//                       )}
//                   </div>

//                   <div
//                     className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
//                     style={{ width: "100%" }}
//                   >
//                     {morningSlots.length > 0 ? (
//                       morningSlots
//                         .slice(
//                           morningSlotIndex,
//                           morningSlotIndex + SLOTS_PER_BATCH
//                         )
//                         .map((slot) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "inline-block",
//                               margin: "5px",
//                             }}
//                             onMouseEnter={(e) =>
//                               slot.is_selected &&
//                               setHoverMessage("This slot is currently in use")
//                             }
//                             onMouseLeave={(e) => setHoverMessage("")}
//                           >
//                             <Button
//                               key={slot.id}
//                               variant="outline-primary"
//                               className="appointment-slots-button mb-2"
//                               onClick={() => handleSlotClick(slot)}
//                               disabled={slot.is_selected}
//                               style={{
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 fontSize: "0.8rem",
//                                 width: "80px",
//                                 height: "50px",
//                                 backgroundColor: slot.is_selected
//                                   ? "#cccccc"
//                                   : "#ffffff",
//                                 color: slot.is_selected ? "#666666" : "#000000",
//                                 border: slot.is_selected
//                                   ? "1px solid #999999"
//                                   : "1px solid #0091A5",
//                                 cursor: slot.is_selected
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                             >
//                               {formatTime(slot.appointment_slot)}
//                             </Button>
//                             {slot.is_selected && hoverMessage && (
//                               <div
//                                 style={{
//                                   position: "absolute",
//                                   top: "-35px",
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                   color: "#fff",
//                                   padding: "5px 10px",
//                                   borderRadius: "4px",
//                                   fontSize: "0.75rem",
//                                   whiteSpace: "nowrap",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {hoverMessage}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                     ) : (
//                       <p className="appointment-slot-section-message text-danger">
//                         No slots available for morning
//                       </p>
//                     )}
//                   </div>
//                 </Col>

//                 <Col md={4} className="appointment-slot-column">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     {afternoonSlots.length > 0 && afternoonSlotIndex > 0 && (
//                       <Button
//                         variant="outline-success"
//                         className="appointment-custom-nav-button"
//                         onClick={
//                           afternoonSlotIndex === 0
//                             ? null
//                             : handleAfternoonPrevious
//                         }
//                       >
//                         <BsChevronLeft />
//                       </Button>
//                     )}

//                     <h4 className="slot-title text-center flex-grow-1">
//                       Afternoon
//                     </h4>

//                     {afternoonSlots.length > 0 &&
//                       afternoonSlotIndex + SLOTS_PER_BATCH <
//                         afternoonSlots.length && (
//                         <Button
//                           variant="outline-success"
//                           className="appointment-custom-nav-button"
//                           onClick={
//                             afternoonSlotIndex + SLOTS_PER_BATCH >=
//                             afternoonSlots.length
//                               ? null
//                               : handleAfternoonNext
//                           }
//                         >
//                           <BsChevronRight />
//                         </Button>
//                       )}
//                   </div>

//                   <div
//                     className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
//                     style={{ width: "100%" }}
//                   >
//                     {afternoonSlots.length > 0 ? (
//                       afternoonSlots
//                         .slice(
//                           afternoonSlotIndex,
//                           afternoonSlotIndex + SLOTS_PER_BATCH
//                         )
//                         .map((slot) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "inline-block",
//                               margin: "5px",
//                             }}
//                             onMouseEnter={(e) =>
//                               slot.is_selected &&
//                               setHoverMessage("This slot is currently in use")
//                             }
//                             onMouseLeave={(e) => setHoverMessage("")}
//                           >
//                             <Button
//                               key={slot.id}
//                               variant="outline-primary"
//                               className="appointment-slots-button mb-2"
//                               onClick={() => handleSlotClick(slot)}
//                               disabled={slot.is_selected}
//                               style={{
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 fontSize: "0.8rem",
//                                 width: "80px",
//                                 height: "50px",
//                                 backgroundColor: slot.is_selected
//                                   ? "#cccccc"
//                                   : "#ffffff",
//                                 color: slot.is_selected ? "#666666" : "#000000",
//                                 border: slot.is_selected
//                                   ? "1px solid #999999"
//                                   : "1px solid #0091A5",
//                                 cursor: slot.is_selected
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                             >
//                               {formatTime(slot.appointment_slot)}
//                             </Button>
//                             {slot.is_selected && hoverMessage && (
//                               <div
//                                 style={{
//                                   position: "absolute",
//                                   top: "-35px",
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                   color: "#fff",
//                                   padding: "5px 10px",
//                                   borderRadius: "4px",
//                                   fontSize: "0.75rem",
//                                   whiteSpace: "nowrap",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {hoverMessage}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                     ) : (
//                       <p className="appointment-slot-section-message text-danger">
//                         No slots available for afternoon
//                       </p>
//                     )}
//                   </div>
//                 </Col>

//                 <Col md={4} className="appointment-slot-column">
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     {eveningSlots.length > 0 && eveningSlotIndex > 0 && (
//                       <Button
//                         variant="outline-success"
//                         className="appointment-custom-nav-button"
//                         onClick={
//                           eveningSlotIndex === 0 ? null : handleEveningPrevious
//                         }
//                       >
//                         <BsChevronLeft />
//                       </Button>
//                     )}

//                     <h4 className="slot-title text-center flex-grow-1">
//                       Evening
//                     </h4>

//                     {eveningSlots.length > 0 &&
//                       eveningSlotIndex + SLOTS_PER_BATCH <
//                         eveningSlots.length && (
//                         <Button
//                           variant="outline-success"
//                           className="appointment-custom-nav-button"
//                           onClick={
//                             eveningSlotIndex + SLOTS_PER_BATCH >=
//                             eveningSlots.length
//                               ? null
//                               : handleEveningNext
//                           }
//                         >
//                           <BsChevronRight />
//                         </Button>
//                       )}
//                   </div>

//                   <div
//                     className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
//                     style={{ width: "100%" }}
//                   >
//                     {eveningSlots.length > 0 ? (
//                       eveningSlots
//                         .slice(
//                           eveningSlotIndex,
//                           eveningSlotIndex + SLOTS_PER_BATCH
//                         )
//                         .map((slot) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "inline-block",
//                               margin: "5px",
//                             }}
//                             onMouseEnter={(e) =>
//                               slot.is_selected &&
//                               setHoverMessage("This slot is currently in use")
//                             }
//                             onMouseLeave={(e) => setHoverMessage("")}
//                           >
//                             <Button
//                               key={slot.id}
//                               variant="outline-primary"
//                               className="appointment-slots-button mb-2"
//                               onClick={() => handleSlotClick(slot)}
//                               disabled={slot.is_selected}
//                               style={{
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 fontSize: "0.8rem",
//                                 width: "80px",
//                                 height: "50px",
//                                 backgroundColor: slot.is_selected
//                                   ? "#cccccc"
//                                   : "#ffffff",
//                                 color: slot.is_selected ? "#666666" : "#000000",
//                                 border: slot.is_selected
//                                   ? "1px solid #999999"
//                                   : "1px solid #0091A5",
//                                 cursor: slot.is_selected
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                             >
//                               {formatTime(slot.appointment_slot)}
//                             </Button>
//                             {slot.is_selected && hoverMessage && (
//                               <div
//                                 style={{
//                                   position: "absolute",
//                                   top: "-35px",
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                   color: "#fff",
//                                   padding: "5px 10px",
//                                   borderRadius: "4px",
//                                   fontSize: "0.75rem",
//                                   whiteSpace: "nowrap",
//                                   zIndex: 10,
//                                 }}
//                               >
//                                 {hoverMessage}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                     ) : (
//                       <p className="appointment-slot-section-message text-danger">
//                         No slots available for evening
//                       </p>
//                     )}
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           )}
//         </div>
//       )}

//       <Modal show={isModalOpen} onHide={onClose} centered size="xl">
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
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Name</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   onChange={(e) =>
//                     setName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
//                   }
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Mobile No</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={mobile}
//                   onChange={(e) =>
//                     setMobile(e.target.value.replace(/[^0-9]/g, ""))
//                   }
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                   disabled
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Date of Birth</label>{" "}
//                 <span className="text-danger">*</span>
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
//                 <label style={{ fontWeight: "bold" }}>Gender</label>{" "}
//                 <span className="text-danger">*</span>
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
//                 <label style={{ fontWeight: "bold" }}>Age</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={age}
//                   onChange={(e) =>
//                     setAge(e.target.value.replace(/[^0-9]/g, ""))
//                   }
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Address</label>{" "}
//                 <span className="text-danger">*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   style={{ borderRadius: "5px", padding: "10px" }}
//                 />
//               </div>
//               <div className="col-md-4 form-group">
//                 <label style={{ fontWeight: "bold" }}>Email Id</label>{" "}
//                 <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Name</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altName}
//                       onChange={handleAltNameChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Mobile No</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altMobile}
//                       onChange={handleAltMobileChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Date of Birth</label>{" "}
//                     <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Blood Group</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altBloodGroup}
//                       onChange={handleAltBloodGroupChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Gender</label>{" "}
//                     <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Age</label>{" "}
//                     <span className="text-danger">*</span>
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
//                     <label style={{ fontWeight: "bold" }}>Address</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altAddress}
//                       onChange={handleAltAddressChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Email Id</label>{" "}
//                     <span className="text-danger">*</span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={altEmail}
//                       onChange={handleAltEmailChange}
//                       style={{ borderRadius: "5px", padding: "10px" }}
//                     />
//                   </div>
//                   <div className="col-md-4 form-group">
//                     <label style={{ fontWeight: "bold" }}>Relation</label>{" "}
//                     <span className="text-danger">*</span>
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
//               Save and proceed to Pay
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
//           <Modal.Title>Confirm Appointment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Would you like to confirm this appointment?</Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowConfirmModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleConfirmAppointment}>
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showSuccessPopup}
//         onHide={() => setShowSuccessPopup(false)}
//         centered
//       >
//         <Modal.Header
//           style={{ backgroundColor: "#d4edda", borderBottom: "none" }}
//         >
//           <Modal.Title
//             className="d-flex align-items-center mt-5"
//             style={{ color: "#155724" }}
//           >
//             <CheckCircle style={{ marginRight: "10px" }} />
//             Appointment Confirmed!
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           style={{
//             backgroundColor: "#d4edda",
//             color: "#155724",
//             textAlign: "center",
//           }}
//         >
//           {successMessage}
//         </Modal.Body>
//       </Modal>

//       <Modal
//         show={showSuccessPopup}
//         onHide={() => {
//           setShowSuccessPopup(false);
//           setErrorMessage("");
//           setSuccessMessage("");
//         }}
//         centered
//       >
//         <Modal.Header
//           style={{
//             backgroundColor: errorMessage ? "#f8d7da" : "#d4edda",
//             borderBottom: "none",
//           }}
//         >
//           <Modal.Title
//             className="d-flex align-items-center mt-5"
//             style={{
//               color: errorMessage ? "#721c24" : "#155724",
//             }}
//           >
//             {errorMessage ? (
//               <FaExclamationCircle style={{ marginRight: "10px" }} />
//             ) : (
//               <FaCheckCircle style={{ marginRight: "10px" }} />
//             )}
//             {errorMessage || successMessage}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Footer
//           style={{
//             backgroundColor: errorMessage ? "#f8d7da" : "#d4edda",
//             borderTop: "none",
//           }}
//         />
//       </Modal>

//       <Modal
//         show={isPaymentSuccessful}
//         centered
//         onHide={() => setIsPaymentSuccessful(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Payment Confirmation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="success">
//             <CheckCircle /> {successMessage}
//           </Alert>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default PatientHome;












import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import onlineconsultation from "../../images/OnlineConsult.png";
import finddoctor from "../../images/FindDoctorNearYou.jpg";
import bookappointment from "../../images/BookAppointmentsdoc.jpg";
import prescription from "../../images/PrescriptionVitals.jpg";
import myappointment from "../../images/MyApointments.jpg";
import mydocument from "../../images/MyDocuments.jpg";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaExclamationCircle, FaCalendarAlt } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import BaseUrl from "../../api/BaseUrl";
import { CheckCircle } from "react-bootstrap-icons";
import styled from "styled-components";
import Loader from "react-js-loader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { format, addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const LoaderImage = styled.div`
  width: 400px;
`;

const PatientHome = () => {
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showSlotSelection, setShowSlotSelection] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [slotCounts, setSlotCounts] = useState(Array(3).fill(null));
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [slots, setSlots] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sameAsAppointment, setSameAsAppointment] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDoctor] = useState({ doctor: 8 });
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedPatientId, setPatientId] = useState(null);
  const [consultationType, setConsultationType] = useState("walk-in");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [altName, setAltName] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [altDob, setAltDob] = useState("");
  const [altAge, setAltAge] = useState("");
  const [altBloodGroup, setAltBloodGroup] = useState("");
  const [altGender, setAltGender] = useState("");
  const [altAddress, setAltAddress] = useState("");
  const [altEmail, setAltEmail] = useState("");

  const slotSelectionRef = useRef(null);
  const [hoverMessage, setHoverMessage] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const history = useHistory();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onClose = async () => {
    setIsModalOpen(false);
    if (selectedSlot) {
      try {
        await BaseUrl.put("/payment/updateappointment", {
          appointment_id: selectedSlot.id,
          is_selected: false,
        });
      } catch (error) {}
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

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDateChange = (index) => {
    const selectedDate = availableDates[startIndex + index];
    setSelectedDateIndex(startIndex + index);
    fetchSlots(selectedDate);
  };

  const handleMorningPrevious = () => {
    setMorningSlotIndex((prev) => Math.max(prev - SLOTS_PER_BATCH, 0));
  };

  const handleMorningNext = () => {
    setMorningSlotIndex((prev) =>
      Math.min(prev + SLOTS_PER_BATCH, morningSlots.length - SLOTS_PER_BATCH)
    );
  };

  const handleAfternoonPrevious = () => {
    setAfternoonSlotIndex((prev) => Math.max(prev - SLOTS_PER_BATCH, 0));
  };

  const handleAfternoonNext = () => {
    setAfternoonSlotIndex((prev) =>
      Math.min(prev + SLOTS_PER_BATCH, afternoonSlots.length - SLOTS_PER_BATCH)
    );
  };

  const handleEveningPrevious = () => {
    setEveningSlotIndex((prev) => Math.max(prev - SLOTS_PER_BATCH, 0));
  };

  const handleEveningNext = () => {
    setEveningSlotIndex((prev) =>
      Math.min(prev + SLOTS_PER_BATCH, eveningSlots.length - SLOTS_PER_BATCH)
    );
  };

  const handleDateNavigation = (direction) => {
    setStartIndex((prevIndex) => {
      let newIndex = prevIndex;
      if (direction === "prev" && newIndex > 0) {
        newIndex = newIndex - 1;
      } else if (direction === "next" && newIndex < availableDates.length - 3) {
        newIndex = newIndex + 1;
      }
      // Update the selected date index based on the new start index
      setSelectedDateIndex(newIndex);
      return newIndex;
    });
  };

  const visibleDates = availableDates.slice(startIndex, startIndex + 3);

  const getDateLabel = (date, index) => {
    const currentDate = new Date();
    const dateObj = new Date(date);

    if (index === 0 && dateObj.toDateString() === currentDate.toDateString()) {
      return "Today";
    } else if (
      index === 1 &&
      dateObj.toDateString() === addDays(currentDate, 1).toDateString()
    ) {
      return "Tomorrow";
    } else {
      // Format the date as "Mon, Oct 16"
      return format(dateObj, "EEE, MMM d");
    }
  };

  const [morningSlotIndex, setMorningSlotIndex] = useState(0);
  const [afternoonSlotIndex, setAfternoonSlotIndex] = useState(0);
  const [eveningSlotIndex, setEveningSlotIndex] = useState(0);

  const SLOTS_PER_BATCH = 12;

  const isMorning = (time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 6 && hour < 12;
  };

  const isAfternoon = (time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 12 && hour < 18;
  };

  const isEvening = (time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 18 && hour < 24;
  };

  const morningSlots = Array.isArray(slots)
    ? slots.filter((slot) => isMorning(slot.appointment_slot))
    : [];
  const afternoonSlots = Array.isArray(slots)
    ? slots.filter((slot) => isAfternoon(slot.appointment_slot))
    : [];
  const eveningSlots = Array.isArray(slots)
    ? slots.filter((slot) => isEvening(slot.appointment_slot))
    : [];

  const fetchSlots = async (selectedDate) => {
    setLoading(true);
    try {
      setLoading(true);
      const slotsResponse = await BaseUrl.get(
        `/doctorappointment/blankslot/?doctor_id=${selectedDoctor.doctor}&slot_date=${selectedDate}`
      );
      const slotsData = Array.isArray(slotsResponse.data)
        ? slotsResponse.data
        : [];
      setSlots(slotsData);
    } catch (error) {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (availableDates.length > 0 && fetchSlots) {
      const selectedDate = availableDates[selectedDateIndex];
      fetchSlots(selectedDate);
    }
  }, [selectedDateIndex, availableDates]);

  const fetchSlotCounts = async () => {
    try {
      const countResponse = await BaseUrl.get(
        `/clinic/countavailableslots/?doctor_id=${selectedDoctor.doctor}&dates=${availableDates.join("&dates=")}`
      );
      const countData = countResponse.data;
      const newSlotCounts = availableDates.map((date) => {
        const dateCount = countData.find((item) => item.date === date);
        return dateCount ? dateCount.count : 0;
      });
      setSlotCounts(newSlotCounts);
    } catch (error) {
      setSlotCounts(availableDates.map(() => 0));
    }
  };

  const handleSlotClick = async (slot) => {
    setLoading(true);
    setSelectedSlot(slot);
    setSameAsAppointment(false);

    try {
      const putResponse = await BaseUrl.put("/payment/updateappointment", {
        appointment_id: slot.id,
      });

      if (putResponse.status === 200) {
        localStorage.setItem("selectedSlotId", slot.id);
        localStorage.setItem("consultationType", consultationType);
      }
      const mobile_number = localStorage.getItem("mobile_number");
      const response = await BaseUrl.get("/patient/details/", {
        params: { mobile_number: mobile_number },
      });

      if (
        (response && response.data && response.data.length > 0) ||
        response.status === 200
      ) {
        const patient = response.data[0];
        setName(patient.name || "");
        setMobile(patient.mobile_number || "");
        setDob(patient.date_of_birth || "");
        setAge(patient.age ? patient.age.toString() : "");
        setBloodGroup(patient.blood_group || "");
        setGender(patient.gender || "");
        setAddress(patient.address || "");
        setEmail(patient.email || "");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    setIsModalOpen(true);
  };

  const handleAltNameChange = (e) => {
    setAltName(e.target.value.replace(/[^A-Za-z\s]/g, ""));
  };

  const handleAltMobileChange = (e) => {
    setAltMobile(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleAltDobChange = (e) => {
    setAltDob(e.target.value);
  };

  const handleAltBloodGroupChange = (e) => {
    setAltBloodGroup(e.target.value);
  };

  const handleAltGenderChange = (e) => {
    setAltGender(e.target.value);
  };

  const handleAltAddressChange = (e) => {
    setAltAddress(e.target.value);
  };

  const handleAltAgeChange = (e) => {
    setAltAge(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleAltEmailChange = (e) => {
    setAltEmail(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const mandatoryFieldsFilled =
      name && mobile && dob && age && gender && address;
    const isEmailMandatory = consultationType === "online";

    if (!mandatoryFieldsFilled || (isEmailMandatory && !email)) {
      setErrorMessage(
        isEmailMandatory
          ? "Please fill in all required fields, including Email for online consultation."
          : "Please fill in all required fields."
      );
      setTimeout(() => setErrorMessage(""), 5000);
      setLoading(false);
      return;
    }

    const patientDetails = sameAsAppointment
      ? {
          name: altName,
          mobile_number: altMobile,
          date_of_birth: altDob,
          blood_group: altBloodGroup,
          gender: altGender.toLowerCase(),
          address: altAddress,
          email: altEmail,
          age: altAge,
        }
      : {
          name,
          mobile_number: mobile,
          date_of_birth: dob,
          blood_group: bloodGroup,
          gender: gender.toLowerCase(),
          address,
          email,
          age,
        };

    try {
      const response = await BaseUrl.post("/patient/patient/", patientDetails);
      if (response.status === 201) {
        const { id, name, mobile_number } = response.data.data;
        localStorage.setItem("savedPatientId", id);
        localStorage.setItem("savedPatientName", name);
        localStorage.setItem("savedPatientMobile", mobile_number);

        history.push("/patient/home/checkout");
      } else {
        setErrorMessage(response.data.error);
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

  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  useEffect(() => {
    const paymentStatus = localStorage.getItem("paymentSuccess");

    if (paymentStatus === "true") {
      setIsPaymentConfirmed(true);
      localStorage.removeItem("paymentSuccess");
    }
    if (isPaymentConfirmed) {
      handleConfirmAppointment();
    }
  }, [isPaymentConfirmed]);

  const handleConfirmAppointment = async () => {
    
    try {
      setLoading(true);
      // Retrieve values from local storage
      const slotId = localStorage.getItem("selectedSlotId");
      const consultationType = localStorage.getItem("consultationType");
      const orderId = localStorage.getItem("order_id");
      const savedPatientId = localStorage.getItem("savedPatientId");

      // Check payment status
      const paymentStatusResponse = await BaseUrl.get(`/payment/get/`, {
        params: { order_id: orderId },
      });
      const paymentStatusData = paymentStatusResponse.data;

      if (paymentStatusData.status === "SUCCESS") {
        try {
          setLoading(true);
          // Book appointment API call
          const postResponse = await BaseUrl.post(
            "/patientappointment/bookslot/",
            {
              patient: savedPatientId,
              doctor: selectedDoctor.doctor,
              appointment_status: "upcoming",
              appointment_slot: slotId,
              consultation_type: consultationType,
            }
          );

          if (postResponse && postResponse.data) {
            setSuccessMessage(postResponse.data.success);
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 5000);
          } else {
            throw new Error("Failed to book the slot.");
          }
        } catch (error) {
          // Revert appointment status if booking fails
          await BaseUrl.put("/payment/updateappointment", {
            appointment_id: slotId,
            is_selected: false,
          });
          setErrorMessage("Failed to confirm the appointment.");
        }
      } else {
        // Payment failed
        await BaseUrl.put("/payment/updateappointment", {
          appointment_id: slotId,
          is_selected: false,
        });
        setErrorMessage("Payment was not successful. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      // Clear relevant local storage items
      localStorage.removeItem("selectedSlotId");
      localStorage.removeItem("consultationType");
      localStorage.removeItem("order_id");
    }
  };

  useEffect(() => {
    const paymentStatus = localStorage.getItem("paymentSuccess");
    if (paymentStatus === "true") {
      setShowConfirmModal(true);
      localStorage.removeItem("paymentSuccess");
    }
    const fetchAppointments = async () => {
      try {
        const patient_token = localStorage.getItem("patient_token");
        const decodedToken = JSON.parse(atob(patient_token.split(".")[1]));
        const patient_id = decodedToken.patient_id;
        const response = await BaseUrl.get(
          `/patient/patient/?patient_id=${patient_id}`
        );
        const appointments = response.data;
        const upcoming = appointments.filter(
          (appointment) =>
            !appointment.is_blocked &&
            !appointment.is_canceled &&
            !appointment.is_complete &&
            appointment.is_booked
        );
        setUpcomingAppointments(upcoming);
      } catch (error) {}
    };
    fetchAppointments();
  }, []);

  const renderAppointments = (
    appointments,
    handlePrevious,
    handleNext,
    currentIndex
  ) => {
    const isPreviousDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex + 3 >= appointments.length;
    return (
      <Row className="text-center align-items-center justify-content-center">
        {appointments.length > 3 && (
          <Col xs="auto">
            <Button
              variant="outline-primary"
              onClick={handlePrevious}
              disabled={isPreviousDisabled}
              style={{
                color: isPreviousDisabled ? "#A9A9A9" : "",
                borderColor: isPreviousDisabled ? "#A9A9A9" : "",
              }}
            >
              <BsChevronLeft />
            </Button>
          </Col>
        )}
        {appointments.length > 0 ? (
          appointments
            .slice(currentIndex, currentIndex + 3)
            .map((appointment, index) => (
              <Col key={index} md={3} className="mb-4">
                <Card className="h-100 shadow-sm appointment-card">
                  <Card.Body>
                    <Card.Title className="appointment-time">
                      <div>
                        Date: {formatDate(appointment.appointment_date)}
                      </div>
                      <div>
                        Time: {formatTime(appointment.appointment_slot)}
                      </div>
                    </Card.Title>
                    <Card.Text className="appointment-details">
                      {appointment.details}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
        ) : (
          <Col md={8} className="mb-4">
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #f5c6cb",
                textAlign: "center",
              }}
            >
              No upcoming appointments available.
            </div>
          </Col>
        )}
        {appointments.length > 4 && (
          <Col xs="auto">
            <Button
              variant="outline-primary"
              onClick={handleNext}
              disabled={isNextDisabled}
              style={{
                color: isNextDisabled ? "#A9A9A9" : "",
                borderColor: isNextDisabled ? "#A9A9A9" : "",
              }}
            >
              <BsChevronRight />
            </Button>
          </Col>
        )}
      </Row>
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 3, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 3, upcomingAppointments.length - 1)
    );
  };

  const [consultationFee, setConsultationFee] = useState(null);
  const [currency, setCurrency] = useState(null);

  const handleCardClick = async (cardTitle) => {
    const selectedConsultationType =
      cardTitle === "Online Consultation" ? "online" : "walk-in";
    setConsultationType(selectedConsultationType);
    try {
      const mobileNumber = localStorage.getItem("mobile_number");
      const response = await BaseUrl.get(`/patient/details/`, {
        params: { mobile_number: mobileNumber },
      });

      if (response.data.length > 0) {
        const patientDetails = response.data[0];
        const mobileString = patientDetails.mobile_number.toString();

        const extractedMobileNumber = mobileString.slice(-10);
        const countryCode = mobileString.slice(0, -10);
        const feeResponse = await BaseUrl.get(
          // `/patient/fee/?country_code=${countryCode}&consultation_type=${consultationType}`
          `/patient/fee/?country_code=91&consultation_type=${consultationType}`
        );

        const feeData = feeResponse.data;
        setConsultationFee(feeData.consultation_fee);
        setCurrency(feeData.currency);
      }
    } catch (error) {}
    setShowSlotSelection(true);
    fetchSlots(availableDates[0]);
    fetchSlotCounts();
    setTimeout(() => {
      slotSelectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const initializeAvailableDates = () => {
      const today = new Date();
      const dates = Array.from({ length: 30 }, (_, i) =>
        format(addDays(today, i), "yyyy-MM-dd")
      );
      setAvailableDates(dates);
    };
    initializeAvailableDates();
  }, []);

  const cardData = [
    {
      image: onlineconsultation,
      title: "Online Consultation",
      text: "Get online consultation easily in minimal steps.",
      button: "Online Consultation",
      link: "#",
    },
    {
      image: finddoctor,
      title: "Find Doctor near you",
      text: "Find doctors available near your location.",
      button: "Find Doctors",
      link: "/patient/bookappointment",
    },
    {
      image: bookappointment,
      title: "Clinic Visit",
      text: "Easily book appointments.",
      button: "Clinic Visit",
      link: "#",
    },
    {
      image: prescription,
      title: "Prescription & Vitals",
      text: "Manage your prescriptions and vitals.",
      button: "Prescription & Vitals",
      link: "/patient/home",
    },
    {
      image: myappointment,
      title: "My Appointments",
      text: "View and manage your appointments.",
      button: "My Appointments",
      link: "/patient/slots",
    },
    {
      image: mydocument,
      title: "My Documents",
      text: "Upload and manage your document.",
      button: "My Documents",
      link: "/patient/medicalrecords",
    },
  ];

  const renderCards = () => {
    const rows = [];
    for (let i = 0; i < cardData.length; i += 3) {
      const rowCards = cardData.slice(i, i + 3);
      rows.push(
        <Row key={`row-${i / 3}`} className="mb-2">
          {rowCards.map((card, idx) => (
            <Col key={idx} xs={12} md={4} className="mb-3">
              <Link
                to={card.link}
                className="text-decoration-none w-100"
                onClick={() => handleCardClick(card.title)}
              >
                <Card
                  className="patient-card"
                  style={{
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                    textAlign: "center",
                    transition:
                      "transform 0.3s, background-color 0.3s, color 0.3s",
                    backgroundColor:
                      hoveredCard === i + idx ? "#0091A5" : "#ffffff",
                    color: hoveredCard === i + idx ? "#ffffff" : "#000000",
                    transform:
                      hoveredCard === i + idx ? "scale(1.02)" : "scale(1)",
                    width: "100%",
                  }}
                  onMouseEnter={() => setHoveredCard(i + idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card.Img
                    variant="top"
                    src={card.image}
                    alt={card.title}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      maxHeight: "165px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: hoveredCard === i + idx ? "#ffffff" : "#000000",
                      }}
                    >
                      {card.title}
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: hoveredCard === i + idx ? "#ffffff" : "#000000",
                        marginBottom: "8px",
                      }}
                    >
                      {card.text}
                    </Card.Text>
                    <Button
                      variant="btn"
                      style={{
                        width: "fit-content",
                        fontSize: "14px",
                        padding: "5px 10px",
                        backgroundColor:
                          hoveredCard === i + idx ? "#ffffff" : "#0091A5",
                        color: hoveredCard === i + idx ? "#0091A5" : "#ffffff",
                      }}
                    >
                      {card.button}
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      );
    }
    return rows;
  };

  return (
    <Container
      fluid
      className="p-2"
      style={{ backgroundColor: "#D7EAF0", overflowX: "hidden" }}
    >
      {loading && (
        <LoaderWrapper>
          <LoaderImage>
            <Loader
              type="spinner-circle"
              bgColor="#0091A5"
              color="#0091A5"
              title="Loading..."
              size={100}
            />
          </LoaderImage>
        </LoaderWrapper>
      )}

      <header className=" mt-2 mb-4 patient-header text-center">
        <h1 style={{ color: "#185C65", fontWeight: "bold", fontSize: "32px" }}>
          Welcome to Niramaya Homeopathy
        </h1>
      </header>

      {upcomingAppointments.length > 0 && (
        <div
          className="text-center mb-2"
          style={{ color: "#185C65", padding: "15px" }}
        >
          <h4 className="mb-4">Upcoming Appointments</h4>
          {renderAppointments(
            upcomingAppointments,
            handlePrevious,
            handleNext,
            currentIndex
          )}
        </div>
      )}

      <Col md={12}>
        <Row className="row-cards">{renderCards()}</Row>
      </Col>

      {showSlotSelection && (
        <div
          ref={slotSelectionRef}
          className="text-center mt-4 mb-4 position-relative"
          style={{ backgroundColor: "#FBFBFB" }}
        >
          <Button
            variant="link"
            className="position-absolute"
            style={{ top: 0, right: 0, fontSize: "1.5rem", color: "#000" }}
            onClick={() => setShowSlotSelection(false)}
          >
            &times;
          </Button>
          <h3 style={{ paddingTop: "28px", paddingBottom: "28px" }}>
            Select Slot for{" "}
            {consultationType === "online"
              ? "Online Consultation"
              : "Clinic Visit"}
          </h3>

          <div
            className="appointment-date-button mb-3 mt-4 d-flex justify-content-center align-items-center"
            style={{
              flexWrap: "nowrap",
              overflowX: "auto",
              whiteSpace: "nowrap",
              gap: "10px",
            }}
          >
            {/* Left Arrow Button */}
            <Button
              variant="outline-success"
              className="flex-shrink-0 mb-4"
              onClick={() => handleDateNavigation("prev")}
              disabled={startIndex === 0}
            >
              <FaChevronLeft />
            </Button>

            {/* Date Buttons */}
            {visibleDates.map((date, index) => (
              <div
                key={index}
                className="appointment-date-button-container d-flex flex-column align-items-center flex-shrink-0"
                style={{ margin: "0 5px" }}
              >
                <Button
                  variant={
                    selectedDateIndex === startIndex + index
                      ? "success"
                      : "outline-success"
                  }
                  onClick={() => handleDateChange(index)}
                  style={{
                    width: "100px", // Set a fixed width
                    height: "40px", // Set a fixed height
                    display: "flex", // Use flexbox for alignment
                    alignItems: "center", // Center content vertically
                    justifyContent: "center", // Center content horizontally
                    textAlign: "center", // Additional text alignment
                  }}
                >
                  {getDateLabel(date, index)}
                </Button>
                <div
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  <span
                    className={`slot-count ${
                      slotCounts[startIndex + index] > 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {slotCounts[startIndex + index] > 0
                      ? `${slotCounts[startIndex + index]} slots available`
                      : "0 slots available"}
                  </span>
                </div>
              </div>
            ))}

            {/* Right Arrow Button */}
            <Button
              variant="outline-success"
              className="flex-shrink-0 mb-4"
              onClick={() => handleDateNavigation("next")}
              disabled={startIndex === availableDates.length - 3}
            >
              <FaChevronRight />
            </Button>
          </div>
          <Button
            variant="success"
            className="calendar-icon"
            onClick={() => setShowCalendar((prev) => !prev)}
            style={{
              fontSize: "2rem",
              position: "absolute",
              top: 60,
              right: 20,
            }}
          >
            <FaCalendarAlt />
          </Button>

          {showCalendar && (
            <div
              ref={calendarRef} // Attach the ref to the calendar container
              className="appointment-calendar"
              style={{
                position: "absolute",
                right: "20px",
                top: "40px",
                zIndex: 1000,
              }}
            >
              <DatePicker
                selected={new Date(selectedDate || availableDates[0])}
                onChange={(date) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  setSelectedDate(formattedDate);
                  fetchSlots(formattedDate);
                  setShowCalendar(false);
                }}
                inline
                minDate={new Date()}
              />
            </div>
          )}

          {loading ? (
            <p>Loading slots...</p>
          ) : (
            <div className="appointment-slots-section">
              <Row className="text-center p-4">
                <Col md={4} className="appointment-slot-column">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    {morningSlots.length > 0 && morningSlotIndex > 0 && (
                      <Button
                        variant="outline-success"
                        className="appointment-custom-nav-button"
                        onClick={
                          morningSlotIndex === 0 ? null : handleMorningPrevious
                        }
                      >
                        <BsChevronLeft />
                      </Button>
                    )}

                    <h4 className="slot-title text-center flex-grow-1">
                      Morning
                    </h4>

                    {morningSlots.length > 0 &&
                      morningSlotIndex + SLOTS_PER_BATCH <
                        morningSlots.length && (
                        <Button
                          variant="outline-success"
                          className="appointment-custom-nav-button"
                          onClick={
                            morningSlotIndex + SLOTS_PER_BATCH >=
                            morningSlots.length
                              ? null
                              : handleMorningNext
                          }
                        >
                          <BsChevronRight />
                        </Button>
                      )}
                  </div>

                  <div
                    className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
                    style={{ width: "100%" }}
                  >
                    {morningSlots.length > 0 ? (
                      morningSlots
                        .slice(
                          morningSlotIndex,
                          morningSlotIndex + SLOTS_PER_BATCH
                        )
                        .map((slot) => {
                          const currentTime = new Date();
                          const slotTime = new Date();
                          const [hours, minutes] =
                            slot.appointment_slot.split(":");
                          slotTime.setHours(hours);
                          slotTime.setMinutes(minutes);

                          const isPastSlot = currentTime >= slotTime;

                          return (
                            <div
                              key={slot.id}
                              style={{
                                position: "relative",
                                display: "inline-block",
                                margin: "5px",
                              }}
                              onMouseEnter={(e) =>
                                slot.is_selected &&
                                setHoverMessage("This slot is in use/Booked")
                              }
                              onMouseLeave={(e) => setHoverMessage("")}
                            >
                              <Button
                                variant="outline-primary"
                                className="appointment-slots-button mb-2"
                                onClick={() => handleSlotClick(slot)}
                                disabled={slot.is_selected || isPastSlot}
                                style={{
                                  padding: "10px",
                                  textAlign: "center",
                                  fontSize: "0.8rem",
                                  width: "80px",
                                  height: "50px",
                                  backgroundColor: slot.is_selected
                                    ? "#cccccc"
                                    : isPastSlot
                                      ? "#d2a679" // Brown color for past slots
                                      : "#ffffff",
                                  color:
                                    slot.is_selected || isPastSlot
                                      ? "#666666"
                                      : "#000000",
                                  border:
                                    slot.is_selected || isPastSlot
                                      ? "1px solid #999999"
                                      : "1px solid #0091A5",
                                  cursor:
                                    slot.is_selected || isPastSlot
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                {formatTime(slot.appointment_slot)}
                              </Button>
                              {slot.is_selected && hoverMessage && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-35px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.75rem",
                                    whiteSpace: "nowrap",
                                    zIndex: 10,
                                  }}
                                >
                                  {hoverMessage}
                                </div>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <p className="appointment-slot-section-message text-danger">
                        No slots available for morning
                      </p>
                    )}
                  </div>
                </Col>

                <Col md={4} className="appointment-slot-column">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    {afternoonSlots.length > 0 && afternoonSlotIndex > 0 && (
                      <Button
                        variant="outline-success"
                        className="appointment-custom-nav-button"
                        onClick={
                          afternoonSlotIndex === 0
                            ? null
                            : handleAfternoonPrevious
                        }
                      >
                        <BsChevronLeft />
                      </Button>
                    )}

                    <h4 className="slot-title text-center flex-grow-1">
                      Afternoon
                    </h4>

                    {afternoonSlots.length > 0 &&
                      afternoonSlotIndex + SLOTS_PER_BATCH <
                        afternoonSlots.length && (
                        <Button
                          variant="outline-success"
                          className="appointment-custom-nav-button"
                          onClick={
                            afternoonSlotIndex + SLOTS_PER_BATCH >=
                            afternoonSlots.length
                              ? null
                              : handleAfternoonNext
                          }
                        >
                          <BsChevronRight />
                        </Button>
                      )}
                  </div>

                  <div
                    className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
                    style={{ width: "100%" }}
                  >
                    {afternoonSlots.length > 0 ? (
                      afternoonSlots
                        .slice(
                          afternoonSlotIndex,
                          afternoonSlotIndex + SLOTS_PER_BATCH
                        )
                        .map((slot) => {
                          const currentTime = new Date();
                          const slotTime = new Date();
                          const [hours, minutes] =
                            slot.appointment_slot.split(":");
                          slotTime.setHours(hours);
                          slotTime.setMinutes(minutes);

                          const isPastSlot = currentTime >= slotTime;

                          return (
                            <div
                              key={slot.id}
                              style={{
                                position: "relative",
                                display: "inline-block",
                                margin: "5px",
                              }}
                              onMouseEnter={(e) =>
                                slot.is_selected &&
                                setHoverMessage("This slot is in use/Booked")
                              }
                              onMouseLeave={(e) => setHoverMessage("")}
                            >
                              <Button
                                variant="outline-primary"
                                className="appointment-slots-button mb-2"
                                onClick={() =>
                                  !isPastSlot &&
                                  !slot.is_selected &&
                                  handleSlotClick(slot)
                                }
                                disabled={slot.is_selected || isPastSlot}
                                style={{
                                  padding: "10px",
                                  textAlign: "center",
                                  fontSize: "0.8rem",
                                  width: "80px",
                                  height: "50px",
                                  backgroundColor: slot.is_selected
                                    ? "#cccccc"
                                    : isPastSlot
                                      ? "#d2a679" // Brown for past slots
                                      : "#ffffff",
                                  color:
                                    slot.is_selected || isPastSlot
                                      ? "#666666"
                                      : "#000000",
                                  border:
                                    slot.is_selected || isPastSlot
                                      ? "1px solid #999999"
                                      : "1px solid #0091A5",
                                  cursor:
                                    slot.is_selected || isPastSlot
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                {formatTime(slot.appointment_slot)}
                              </Button>
                              {slot.is_selected && hoverMessage && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-35px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.75rem",
                                    whiteSpace: "nowrap",
                                    zIndex: 10,
                                  }}
                                >
                                  {hoverMessage}
                                </div>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <p className="appointment-slot-section-message text-danger">
                        No slots available for afternoon
                      </p>
                    )}
                  </div>
                </Col>

                <Col md={4} className="appointment-slot-column">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    {eveningSlots.length > 0 && eveningSlotIndex > 0 && (
                      <Button
                        variant="outline-success"
                        className="appointment-custom-nav-button"
                        onClick={
                          eveningSlotIndex === 0 ? null : handleEveningPrevious
                        }
                      >
                        <BsChevronLeft />
                      </Button>
                    )}

                    <h4 className="slot-title text-center flex-grow-1">
                      Evening
                    </h4>

                    {eveningSlots.length > 0 &&
                      eveningSlotIndex + SLOTS_PER_BATCH <
                        eveningSlots.length && (
                        <Button
                          variant="outline-success"
                          className="appointment-custom-nav-button"
                          onClick={
                            eveningSlotIndex + SLOTS_PER_BATCH >=
                            eveningSlots.length
                              ? null
                              : handleEveningNext
                          }
                        >
                          <BsChevronRight />
                        </Button>
                      )}
                  </div>

                  <div
                    className="d-flex flex-wrap justify-content-center appointment-slot-buttons-container"
                    style={{ width: "100%" }}
                  >
                    {eveningSlots.length > 0 ? (
                      eveningSlots
                        .slice(
                          eveningSlotIndex,
                          eveningSlotIndex + SLOTS_PER_BATCH
                        )
                        .map((slot) => {
                          const currentTime = new Date();
                          const slotTime = new Date();
                          const [hours, minutes] =
                            slot.appointment_slot.split(":");
                          slotTime.setHours(hours);
                          slotTime.setMinutes(minutes);

                          const isPastSlot = currentTime >= slotTime;

                          return (
                            <div
                              key={slot.id}
                              style={{
                                position: "relative",
                                display: "inline-block",
                                margin: "5px",
                              }}
                              onMouseEnter={(e) =>
                                slot.is_selected &&
                                setHoverMessage("This slot is in use/Booked")
                              }
                              onMouseLeave={(e) => setHoverMessage("")}
                            >
                              <Button
                                variant="outline-primary"
                                className="appointment-slots-button mb-2"
                                onClick={() =>
                                  !isPastSlot &&
                                  !slot.is_selected &&
                                  handleSlotClick(slot)
                                }
                                disabled={slot.is_selected || isPastSlot}
                                style={{
                                  padding: "10px",
                                  textAlign: "center",
                                  fontSize: "0.8rem",
                                  width: "80px",
                                  height: "50px",
                                  backgroundColor: slot.is_selected
                                    ? "#cccccc" // Gray for selected slots
                                    : isPastSlot
                                      ? "#d2a679" // Brown for past slots
                                      : "#ffffff",
                                  color:
                                    slot.is_selected || isPastSlot
                                      ? "#666666"
                                      : "#000000",
                                  border:
                                    slot.is_selected || isPastSlot
                                      ? "1px solid #999999"
                                      : "1px solid #0091A5",
                                  cursor:
                                    slot.is_selected || isPastSlot
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                {formatTime(slot.appointment_slot)}
                              </Button>
                              {slot.is_selected && hoverMessage && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-35px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.75rem",
                                    whiteSpace: "nowrap",
                                    zIndex: 10,
                                  }}
                                >
                                  {hoverMessage}
                                </div>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <p className="appointment-slot-section-message text-danger">
                        No slots available for evening
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      )}

      <Modal show={isModalOpen} onHide={onClose} centered size="xl">
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#D1E9F6",
            color: "#000",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Modal.Title style={{ margin: 0 }}>
              Kindly Fill Your Details !!
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 30px" }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Name</label>{" "}
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
                  }
                  style={{ borderRadius: "5px", padding: "10px" }}
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Mobile No</label>{" "}
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  style={{ borderRadius: "5px", padding: "10px" }}
                  disabled
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Date of Birth</label>{" "}
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ borderRadius: "5px", padding: "10px" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Blood Group</label>
                <input
                  type="text"
                  className="form-control"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{ borderRadius: "5px", padding: "10px" }}
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Gender</label>{" "}
                <span className="text-danger">*</span>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ borderRadius: "5px", padding: "10px" }}
                >
                  <option value="select">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Age</label>{" "}
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  style={{ borderRadius: "5px", padding: "10px" }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Address</label>{" "}
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ borderRadius: "5px", padding: "10px" }}
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: "bold" }}>Email Id</label>{" "}
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: "5px", padding: "10px" }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-center my-4">
              <Form.Check
                type="switch"
                id="for-others-toggle"
                label="For others"
                checked={sameAsAppointment}
                onChange={() => setSameAsAppointment(!sameAsAppointment)}
                style={{ fontSize: "1.2rem", fontWeight: "bold" }}
              />
            </div>

            {sameAsAppointment && (
              <>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Name</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={altName}
                      onChange={handleAltNameChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Mobile No</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={altMobile}
                      onChange={handleAltMobileChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Date of Birth</label>{" "}
                    <input
                      type="date"
                      className="form-control"
                      value={altDob}
                      onChange={handleAltDobChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Blood Group</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={altBloodGroup}
                      onChange={handleAltBloodGroupChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Gender</label>{" "}
                    <span className="text-danger">*</span>
                    <select
                      className="form-control"
                      value={altGender}
                      onChange={handleAltGenderChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Age</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={altAge}
                      onChange={handleAltAgeChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Address</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={altAddress}
                      onChange={handleAltAddressChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Email Id</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={altEmail}
                      onChange={handleAltEmailChange}
                      style={{ borderRadius: "5px", padding: "10px" }}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: "bold" }}>Relation</label>{" "}
                    <span className="text-danger">*</span>
                    <select
                      className="form-control"
                      style={{ borderRadius: "5px", padding: "10px" }}
                    >
                      <option value="">Select Relation</option>
                      <option value="female">Mother</option>
                      <option value="male">Father</option>
                      <option value="female">Sister</option>
                      <option value="male">Brother</option>
                      <option value="female">Daughter</option>
                      <option value="male">Son</option>
                      <option value="other">Friends</option>
                      <option value="other">Others</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="modal-actions d-flex justify-content-between mt-3">
            <Button
              variant="secondary"
              onClick={onClose}
              style={{
                padding: "5px 10px",
                fontSize: "1.1rem",
                width: "fit-content",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              style={{
                padding: "5px 10px",
                fontSize: "1.1rem",
                width: "fit-content",
              }}
            >
              Save and proceed to Pay
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to confirm this appointment?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAppointment}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSuccessPopup}
        onHide={() => setShowSuccessPopup(false)}
        centered
      >
        <Modal.Header
          style={{ backgroundColor: "#d4edda", borderBottom: "none" }}
        >
          <Modal.Title
            className="d-flex align-items-center mt-5"
            style={{ color: "#155724" }}
          >
            <CheckCircle style={{ marginRight: "10px" }} />
            Appointment Confirmed!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            textAlign: "center",
          }}
        >
          {successMessage}
        </Modal.Body>
      </Modal>

      <Modal
        show={showSuccessPopup}
        onHide={() => {
          setShowSuccessPopup(false);
          setErrorMessage("");
          setSuccessMessage("");
        }}
        centered
      >
        <Modal.Header
          style={{
            backgroundColor: errorMessage ? "#f8d7da" : "#d4edda",
            borderBottom: "none",
          }}
        >
          <Modal.Title
            className="d-flex align-items-center mt-5"
            style={{
              color: errorMessage ? "#721c24" : "#155724",
            }}
          >
            {errorMessage ? (
              <FaExclamationCircle style={{ marginRight: "10px" }} />
            ) : (
              <FaCheckCircle style={{ marginRight: "10px" }} />
            )}
            {errorMessage || successMessage}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{
            backgroundColor: errorMessage ? "#f8d7da" : "#d4edda",
            borderTop: "none",
          }}
        />
      </Modal>

      <Modal
        show={isPaymentSuccessful}
        centered
        onHide={() => setIsPaymentSuccessful(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <CheckCircle /> {successMessage}
          </Alert>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PatientHome;
