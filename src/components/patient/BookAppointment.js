


// import React, { useState, useEffect, useRef } from "react";
// import { Button, Row, Col, Card, Form, Modal, Alert } from "react-bootstrap";
// import { load } from "@cashfreepayments/cashfree-js";
// import clinicVisitImage from "../../images/a-53-512.webp";
// import onlineConsultationImage from "../../images/2562653-200.png";
// import BaseUrl from "../../api/BaseUrl";
// import { useHistory } from "react-router-dom";
// import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
// import { format, addDays } from "date-fns";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import "../../css/Patient.css";
// import Checkout from "./CheckOutBook";

// const BookAppointment = () => {
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const formRef = useRef(null);

//   const history = useHistory();
//   const [appointmentType, setAppointmentType] = useState("clinic");
//   const [availableDates, setAvailableDates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [currentDateIndex, setCurrentDateIndex] = useState(0);
//   const [slotCounts, setSlotCounts] = useState({});
//   const [name, setName] = useState("");
//   const [mobile_number, setMobile] = useState("");
//   const [age, setAge] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [gender, setGender] = useState("");
//   const [morningIndex, setMorningIndex] = useState(0);
//   const [afternoonIndex, setAfternoonIndex] = useState(0);
//   const [eveningIndex, setEveningIndex] = useState(0);
//   const slotsPerPage = 4;
//   const [selectedCountry, setSelectedCountry] = useState("India");
//   const [consultancyFee, setConsultancyFee] = useState("₹800");

//   const [hoverMessage, setHoverMessage] = useState("");

//   const countries = [
//     { name: "India", fee: "₹800" },
//     { name: "Bangladesh", fee: "₹800" },
//     { name: "Pakistan", fee: "₹800" },
//     { name: "Nepal", fee: "₹800" },
//     { name: "Sri Lanka", fee: "₹800" },
//     { name: "Other Countries", fee: "$50" },
//   ];

//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [appointmentSlotId, setAppointmentSlotId] = useState(null);

//   const categorizeSlots = (slots) => {
//     const morningSlots = slots.filter((slot) => {
//       const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
//       return hours < 12;
//     });
//     const afternoonSlots = slots.filter((slot) => {
//       const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
//       return hours >= 12 && hours < 17;
//     });
//     const eveningSlots = slots.filter((slot) => {
//       const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
//       return hours >= 17;
//     });
//     return { morningSlots, afternoonSlots, eveningSlots };
//   };

//   const [slots, setSlots] = useState({
//     morning: [],
//     afternoon: [],
//     evening: [],
//   });

//   const doctorId = 13;

//   useEffect(() => {
//     loadAvailableDates();
//     initializeCashfree();
//   }, []);

//   const initializeCashfree = async () => {
//     await load({ mode: "production" });
//   };

//   useEffect(() => {
//     if (isFormVisible && formRef.current) {
//       formRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [isFormVisible]);

//   const handleCountryChange = (countryName) => {
//     const country = countries.find((c) => c.name === countryName);
//     if (country) {
//       setSelectedCountry(country.name);
//       setConsultancyFee(country.fee);

//       // Update mobile number's country code using the selected country
//       const countryCodes = {
//         India: "+91",
//         Bangladesh: "+880",
//         Pakistan: "+92",
//         Nepal: "+977",
//         "Sri Lanka": "+94",
//         "Other Countries": "+1", // Default code
//       };

//       const currentNumber = mobile_number?.slice(-10) || ""; // Retain last 10 digits
//       setMobile(`${countryCodes[country.name]}${currentNumber}`);
//     }
//   };

//   const loadAvailableDates = () => {
//     const today = new Date();
//     const dates = [
//       format(today, "yyyy-MM-dd"),
//       format(addDays(today, 1), "yyyy-MM-dd"),
//       format(addDays(today, 2), "yyyy-MM-dd"),
//     ];
//     setAvailableDates(dates);
//   };
//   const handleNext = (setIndex, index, slotArray) => {
//     if (index + slotsPerPage < slotArray.length) {
//       setIndex(index + slotsPerPage);
//     }
//   };

//   const handlePrev = (setIndex, index) => {
//     if (index - slotsPerPage >= 0) {
//       setIndex(index - slotsPerPage);
//     }
//   };

//   const handleCloseForm = async () => {
//     try {
//       const response = await BaseUrl.put("/payment/updateappointment", {
//         appointment_id: appointmentSlotId,
//       });

//       if (response.status === 200) {
//         setIsFormVisible(false);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const today = new Date();
//     const dates = Array.from({ length: 30 }, (_, i) =>
//       format(addDays(today, i), "yyyy-MM-dd")
//     );
//     setAvailableDates(dates);
//     fetchAvailableSlotsCount(dates.slice(0, 3));
//     fetchSlots(dates[0]);
//   }, []);

//   const fetchAvailableSlotsCount = async (selectedDates) => {
//     try {
//       const datesQuery = selectedDates.map((date) => `dates=${date}`).join("&");
//       const endpoint = `/clinic/countavailableslots/?doctor_id=13&${datesQuery}`;
//       const countResponse = await BaseUrl.get(endpoint);
//       const availableCounts = countResponse.data;
//       const newSlotCounts = {};
//       availableCounts.forEach((count) => {
//         newSlotCounts[count.date] = count.count;
//       });

//       setSlotCounts((prevCounts) => ({
//         ...prevCounts,
//         ...newSlotCounts,
//       }));
//       for (let date of selectedDates) {
//         await BaseUrl.get(`/clinic/availableslots/?doctor_id=13&date=${date}`);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchSlots = async (selectedDate, appointmentType) => {
//     try {
//       const endpoint = `/doctorappointment/blankslot/?doctor_id=13&slot_date=${selectedDate}&consultation_type=${appointmentType}`;
//       const slotsResponse = await BaseUrl.get(endpoint);
//       const fetchedSlots = slotsResponse.data;
//       const { morningSlots, afternoonSlots, eveningSlots } =
//         categorizeSlots(fetchedSlots);
//       setSlots({
//         morning: morningSlots,
//         afternoon: afternoonSlots,
//         evening: eveningSlots,
//       });
//       setIsFormVisible(false);
//     } catch (error) {
//       console.error(error);
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

//   const handleDateNavigation = (direction) => {
//     if (direction === "prev" && currentDateIndex > 0) {
//       setCurrentDateIndex(currentDateIndex - 1);
//       fetchSlots(availableDates[currentDateIndex - 1]);
//     } else if (
//       direction === "next" &&
//       currentDateIndex + 1 < availableDates.length
//     ) {
//       setCurrentDateIndex(currentDateIndex + 1);
//       fetchSlots(availableDates[currentDateIndex + 1]);
//     }
//   };

//   const handleSlotClick = async (slot, selectedDate, type) => {
//     try {
//       setSelectedSlot(slot);
//       setAppointmentSlotId(slot.id);
//       localStorage.setItem("appointmentSlotId", slot.id);
//       setIsFormVisible(true);

//       // Scroll to the form
//       formRef.current?.scrollIntoView({ behavior: "smooth" });

//       const updateResponse = await BaseUrl.put("/payment/updateappointment", {
//         appointment_id: slot.id,
//       });

//       if (updateResponse.status === 200) {
//         const fetchResponse = await BaseUrl.get(
//           `/doctorappointment/blankslot/?doctor_id=13&slot_date=${selectedDate}&consultation_type=${type}`
//         );

//         if (fetchResponse.status === 200) {
//           const fetchedSlots = fetchResponse.data;
//           const { morningSlots, afternoonSlots, eveningSlots } =
//             categorizeSlots(fetchedSlots);
//           setSlots({
//             morning: morningSlots,
//             afternoon: afternoonSlots,
//             evening: eveningSlots,
//           });
//           fetchedSlots.map((slot) => {
//             if (slot.id === appointmentSlotId) {
//               return { ...slot, is_selected: true };
//             } else {
//               return { ...slot, is_selected: false };
//             }
//           });
//           setIsFormVisible(false);
//         } else {
//           // Retry update in case fetch fails
//           await BaseUrl.put("/payment/updateappointment", {
//             appointment_id: slot.id,
//           });
//           throw new Error("Failed to fetch updated slots");
//         }
//       } else {
//         // Retry update in case the initial update fails
//         await BaseUrl.put("/payment/updateappointment", {
//           appointment_id: slot.id,
//         });
//         throw new Error("Failed to update the appointment");
//       }
//     } catch (error) {
//       // Handle errors and ensure update is retried
//       console.error(error);
//       try {
//         await BaseUrl.put("/payment/updateappointment", {
//           appointment_id: slot.id,
//         });
//       } catch (retryError) {
//         console.error("Retry update failed:", retryError);
//       }
//     }
//   };

//   const patchPatientData = async (
//     appointmentId,
//     selectedDate,
//     appointmentType
//   ) => {
//     try {
//       const slotId = localStorage.getItem("selectedSlotId");
//       const storedPatientId = localStorage.getItem("patientId");
//       await BaseUrl.patch("/patient/patient/", {
//         appointment: slotId,
//         patient_id: storedPatientId,
//       });

//       // Call fetchSlots after the patch API is successful
//       await fetchSlots(selectedDate, appointmentType);
//     } catch (error) {
//       setErrorMessage("Error updating patient data.");
//     }
//   };

//   const bookSlot = async () => {
//     const storedPatientId = localStorage.getItem("patientId");
//     const storedAppointmentSlotId = localStorage.getItem("appointmentSlotId");

//     try {
//       const bookingResponse = await BaseUrl.post(
//         "/patientappointment/bookslot/",
//         {
//           patient: storedPatientId,
//           doctor: doctorId,
//           appointment_slot: storedAppointmentSlotId,
//           consultation_type:
//             appointmentType === "clinic" ? "walk-in" : "online",
//         }
//       );

//       if (bookingResponse.status === 200 || bookingResponse.status === 201) {
//         const successMsg = bookingResponse.data.success;
//         showMessageInModal(successMsg);
//         setSuccessMessage(successMsg);
//         localStorage.removeItem("orderId");
//       }
//     } catch (error) {
//       setErrorMessage();
//     }
//   };

//   const showMessageInModal = (message) => {
//     setModalMessage(message);
//     setShowModal(true);
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setErrorMessage("");

//       // Extract country code and local number from mobile_number
//       const mobileString = mobile_number.toString();
//       const extractedMobileNumber = mobileString.slice(-10); // Last 10 digits
//       const countryCode = mobileString.slice(0, -10); // Country code

//       // Store the country code and mobile number in localStorage
//       localStorage.setItem("countryCode", countryCode);
//       localStorage.setItem("mobileNumber", extractedMobileNumber);

//       // Ensure selected country matches the country code
//       const matchedCountry = countries.find((c) =>
//         mobileString.startsWith(c.code)
//       );
//       if (matchedCountry) {
//         setSelectedCountry(matchedCountry.name);
//         setConsultancyFee(matchedCountry.fee);

//         // Store matched country details in localStorage
//         localStorage.setItem("selectedCountry", matchedCountry.name);
//         localStorage.setItem("consultancyFee", matchedCountry.fee);
//       }

//       // Create the patient
//       const patientResponse = await BaseUrl.post("/patient/patient/", {
//         name,
//         mobile_number,
//         age,
//         blood_group: bloodGroup,
//         gender,
//         address,
//         email,
//         doctor_id: doctorId,
//       });

//       // Extract patient details from the response
//       const patientDetails = patientResponse.data?.data;
//       const fetchedPatientId = patientDetails?.id;
//       const fetchedName = patientDetails?.name; // Correctly extract name
//       const fetchedMobileNumber = patientDetails?.mobile_number; // Correctly extract mobile number

//       // Store patient details in localStorage
//       localStorage.setItem("patientId", fetchedPatientId);
//       localStorage.setItem("patientName", fetchedName); // Save name correctly
//       localStorage.setItem("patientMobileNumber", fetchedMobileNumber); // Save mobile_number correctly
//       localStorage.setItem("patientAge", age);
//       localStorage.setItem("patientBloodGroup", bloodGroup);
//       localStorage.setItem("patientGender", gender);
//       localStorage.setItem("patientAddress", address);
//       localStorage.setItem("patientEmail", email);

//       // Store selected slot ID
//       localStorage.setItem("selectedSlotId", selectedSlot.id);

//       // Fetch the consultation fee with consultation_type
//       const consultationType =
//         appointmentType === "clinic" ? "walk-in" : "online";

//       const feeResponse = await BaseUrl.get(
//         `/patient/fee/?country_code=${countryCode}&consultation_type=${consultationType}`
//       );
//       const { consultation_fee: amount, currency } = feeResponse.data;

//       // Store the fee and currency in localStorage
//       localStorage.setItem("consultationFee", amount);
//       localStorage.setItem("currency", currency);

//       // Navigate to the Checkout route
//       history.push("/components/checkout");
//     } catch (error) {
//       console.error("Error during form submission:", error); // Log the error for debugging
//       setErrorMessage("Error processing request. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const triggerPaymentGateway = async (paymentSessionId) => {
//     try {
//       const cashfree = await load({ mode: "production" });
//       await cashfree.checkout({
//         paymentSessionId,
//         returnUrl: "http://localhost:3000/patientbookappointment",
//       });

//       await pollPaymentStatus();
//     } catch (error) {
//       setErrorMessage("Failed to initiate payment gateway.");
//     }
//   };

//   const pollPaymentStatus = async () => {
//     try {
//       const storedOrderId = localStorage.getItem("orderId");
//       const response = await BaseUrl.get(
//         `/payment/get/?order_id=${storedOrderId}`
//       );
//       if (response.data?.status === "SUCCESS") {
//         await bookSlot();
//         localStorage.removeItem("orderId");
//         showMessageInModal("Appointment booked successfully!");
//         setSuccessMessage("Appointment booked successfully!");
//       } else if (response.data?.status === "PENDING") {
//         setTimeout(pollPaymentStatus, 5000);
//       } else {
//         setErrorMessage("Payment failed. Please try again.");
//         localStorage.removeItem("orderId");
//       }
//     } catch (error) {
//       setErrorMessage();
//     }
//   };

//   useEffect(() => {
//     const handlePaymentConfirmation = async () => {
//       const orderId = localStorage.getItem("orderId");
//       try {
//         setLoading(true);
//         const response = await BaseUrl.get(`/payment/get/?order_id=${orderId}`);
//         if (response.data?.status === "SUCCESS") {
//           await bookSlot();
//           await patchPatientData();
//           setSuccessMessage("");
//         } else {
//           setErrorMessage("");
//         }
//       } catch (error) {
//         setErrorMessage();
//       } finally {
//         setLoading(false);
//       }
//     };

//     handlePaymentConfirmation();
//   }, []);

//   useEffect(() => {
//     const today = new Date();
//     const dates = Array.from({ length: 30 }, (_, i) =>
//       format(addDays(today, i), "yyyy-MM-dd")
//     );
//     setAvailableDates(dates);
//   }, []);

//   return (
//     <div
//       className="book-appointment-container mb-5"
//       style={{
//         background: "linear-gradient(to bottom, #cdefe1, #ffffff)",
//         padding: "20px",
//         borderRadius: "10px",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           color: "#3D9F41",
//           fontSize: "48px",
//           fontWeight: "bold",
//           marginBottom: "50px",
//         }}
//       >
//         Niramaya Homoeopathy
//       </h2>

//       {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//       {successMessage && <Alert variant="success">{successMessage}</Alert>}

//       <div className="d-flex justify-content-center mb-5 card-new">
//         <Card
//           className="clinic-visit-card mx-3 shadow text-center"
//           style={{
//             width: "300px",
//             height: "139.56px",
//             cursor: "pointer",
//             marginBottom: "50px",
//             backgroundColor:
//               appointmentType === "clinic" ? "#FFFFFF" : "#3D9F41",
//             color: appointmentType === "clinic" ? "#003F7D" : "#FFFFFF",
//             border: appointmentType === "clinic" ? "2px solid #3D9F41" : "none",
//           }}
//           onClick={() => {
//             setAppointmentType("clinic");
//             localStorage.setItem("appointmentType", "clinic");
//             const selectedDate = availableDates[currentDateIndex];
//             fetchSlots(selectedDate, "clinic");
//           }}
//         >
//           <Card.Body className="d-flex flex-column align-items-center">
//             {/* Image and Title on the same row */}
//             <div
//               className="d-flex align-items-center"
//               style={{ marginBottom: "10px", gap: "10px" }}
//             >
//               <Card.Img
//                 src={clinicVisitImage}
//                 alt="Clinic Visit"
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                 }}
//               />
//               <Card.Title
//                 style={{
//                   fontSize: "14px",
//                   margin: "0",
//                   fontWeight: "bold",
//                 }}
//               >
//                 CLINIC VISIT
//               </Card.Title>
//             </div>

//             {/* Description */}
//             <Card.Text
//               style={{
//                 fontSize: "12px",
//                 marginBottom: "10px",
//                 color: "#003F7D",
//               }}
//             >
//               Book Physical Appointment
//             </Card.Text>

//             {/* Consultancy Fee */}
//             <Card.Text
//               style={{
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 margin: "0",
//               }}
//             >
//               Consultancy Fee: ₹500
//             </Card.Text>
//           </Card.Body>
//         </Card>

//         <Card
//           className="online-consultation-card mx-3 shadow text-center"
//           style={{
//             width: "300px",
//             height: "139.56px",
//             cursor: "pointer",
//             marginBottom: "50px",
//             backgroundColor:
//               appointmentType === "online" ? "#FFFFFF" : "#3D9F41",
//             color: appointmentType === "online" ? "#003F7D" : "#FFFFFF",
//             border: appointmentType === "online" ? "2px solid #3D9F41" : "none",
//           }}
//           onClick={() => {
//             setAppointmentType("online");
//             localStorage.setItem("appointmentType", "online");
//             const selectedDate = availableDates[currentDateIndex];
//             fetchSlots(selectedDate, "online");
//           }}
//         >
//           <Card.Body className="d-flex flex-column align-items-center">
//             {/* Image and Title on the same row */}
//             <div
//               className="d-flex align-items-center"
//               style={{ marginBottom: "10px", gap: "10px" }}
//             >
//               <Card.Img
//                 src={onlineConsultationImage}
//                 alt="Consult Online"
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                 }}
//               />
//               <Card.Title
//                 style={{
//                   fontSize: "14px",
//                   margin: "0",
//                   fontWeight: "bold",
//                 }}
//               >
//                 CONSULT ONLINE
//               </Card.Title>
//             </div>

//             {/* Description */}
//             <Card.Text
//               style={{
//                 fontSize: "12px",
//                 marginBottom: "10px",
//                 color: "#003F7D",
//               }}
//             >
//               Talk to Doctor Online
//             </Card.Text>

//             {/* Fee and Dropdown on the same line */}
//             <div
//               className="d-flex justify-content-between align-items-center"
//               style={{
//                 width: "100%",
//                 marginBottom: "10px",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 color: "#000",
//               }}
//             >
//               {/* Consultancy Fee (Left) */}
//               <span>Consultancy Fee: {consultancyFee}</span>

//               {/* Dropdown (Right) */}
//               <Form.Select
//                 style={{
//                   fontSize: "10px",
//                   width: "120px",
//                   textAlign: "center",
//                 }}
//                 value={selectedCountry}
//                 onChange={(e) => handleCountryChange(e.target.value)}
//               >
//                 {countries.map((country) => (
//                   <option key={country.name} value={country.name}>
//                     {country.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </div>
//           </Card.Body>
//         </Card>
//       </div>

//       <div
//         className="date-navigation-container d-flex align-items-center justify-content-center mb-3"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Button
//           variant="outline-secondary mb-4"
//           onClick={() => handleDateNavigation("prev")}
//           style={{ marginRight: "10px", cursor: "pointer" }}
//           disabled={currentDateIndex === 0}
//         >
//           &#8592;
//         </Button>

//         <div
//           className="date-button-row d-flex overflow-auto"
//           style={{
//             display: "flex",
//             overflowX: "auto",
//             scrollBehavior: "smooth",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {availableDates
//             .slice(currentDateIndex, currentDateIndex + 5)
//             .map((date, index) => (
//               <div
//                 key={index}
//                 className="date-button-container"
//                 style={{ textAlign: "center", margin: "0 10px" }}
//               >
//                 <Button
//                   variant="outline-primary"
//                   onClick={() => {
//                     const newCurrentDateIndex = index + currentDateIndex;
//                     setCurrentDateIndex(newCurrentDateIndex);

//                     // Fetch slots for the selected date
//                     const selectedDate = availableDates[newCurrentDateIndex];
//                     fetchSlots(selectedDate, appointmentType);

//                     // Reset pagination indices
//                     setMorningIndex(0);
//                     setAfternoonIndex(0);
//                     setEveningIndex(0);
//                   }}
//                   style={{
//                     backgroundColor:
//                       index + currentDateIndex === currentDateIndex
//                         ? "#3D9F41"
//                         : "#fff",
//                     color:
//                       index + currentDateIndex === currentDateIndex
//                         ? "#fff"
//                         : "#000",
//                     borderColor: "#3D9F41",
//                     minWidth: "100px",
//                     textAlign: "center",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     height: "50px",
//                   }}
//                 >
//                   {index + currentDateIndex === 0
//                     ? "Today"
//                     : index + currentDateIndex === 1
//                     ? "Tomorrow"
//                     : format(new Date(date), "MMMM dd")}
//                 </Button>
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     marginTop: "8px",
//                     color: slotCounts[date] > 0 ? "#28a745" : "#dc3545",
//                   }}
//                 >
//                   {slotCounts[date] > 0
//                     ? `${slotCounts[date]} slots available`
//                     : "No slots available"}
//                 </div>
//               </div>
//             ))}
//         </div>

//         <Button
//           variant="outline-secondary mb-4"
//           onClick={() => handleDateNavigation("next")}
//           style={{ marginLeft: "10px", cursor: "pointer" }}
//           disabled={currentDateIndex + 5 >= availableDates.length}
//         >
//           &#8594;
//         </Button>
//       </div>

//       <div className="slot-section">
//         {slots && slots.length > 0 ? (
//           <>
//             <h4 className="slot-section-header">Available Slots</h4>
//             <div className="slot-row d-flex overflow-auto mb-3">
//               {slots.map((slot) => (
//                 <Button
//                   key={slot.id}
//                   variant="outline-primary"
//                   className="slot-button mx-2"
//                   onClick={() => handleSlotClick(slot)}
//                 >
//                   {slot.appointment_slot}
//                 </Button>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p className="text-center mt-4"></p>
//         )}
//       </div>

//       <div className="slot-section">
//         {slots && slots.length > 0 ? (
//           <>
//             <h4 className="slot-section-header">Available Slots</h4>
//             <div className="slot-row d-flex overflow-auto mb-3">
//               {slots.map((slot) => (
//                 <Button
//                   key={slot.id}
//                   variant="outline-primary"
//                   className="slot-button mx-2"
//                   onClick={() => handleSlotClick(slot)}
//                 >
//                   {slot.appointment_slot}
//                 </Button>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p className="text-center mt-4"></p>
//         )}
//       </div>

//       <h2 className="text-center" style={{ fontWeight: "700" }}>
//         Available Slots
//       </h2>

//       <Row className="text-center mb-3 mt-5">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <FaArrowLeft
//               onClick={() => handlePrev(setMorningIndex, morningIndex)}
//               style={{
//                 cursor: "pointer",
//                 visibility: morningIndex > 0 ? "visible" : "hidden",
//               }}
//             />
//             <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>Morning</h4>
//             <FaArrowRight
//               onClick={() =>
//                 handleNext(setMorningIndex, morningIndex, slots.morning)
//               }
//               style={{
//                 cursor: "pointer",
//                 visibility:
//                   morningIndex + slotsPerPage < slots.morning.length
//                     ? "visible"
//                     : "hidden",
//               }}
//             />
//           </div>
//           <div>
//   {slots.morning.length > 0 ? (
//     <>
//       {Array.from({
//         length: Math.ceil(
//           slots.morning.slice(morningIndex, morningIndex + 16).length / 4
//         ),
//       }).map((_, rowIndex) => (
//         <div
//           key={rowIndex}
//           className="d-flex justify-content-center flex-wrap"
//         >
//           {slots.morning
//             .slice(
//               morningIndex + rowIndex * 4,
//               morningIndex + (rowIndex + 1) * 4
//             )
//             .map((slot) => {
//               const currentTime = new Date(); // Current date and time
//               const slotDate = new Date(slot.appointment_date); // Slot date
//               const slotTime = new Date(
//                 `${slot.appointment_date}T${slot.appointment_slot}`
//               ); // Combine date and time

//               // Check if the slot is for today
//               const isSameDate =
//                 currentTime.toDateString() === slotDate.toDateString();

//               // Determine if the slot should be disabled
//               const isDisabled =
//                 slot.is_booked || (isSameDate && currentTime >= slotTime);

//               // Styling for the button
//               const buttonStyle = {
//                 backgroundColor: slot.is_booked
//                   ? "gray"
//                   : isDisabled
//                   ? "#d2a679"
//                   : selectedSlot?.id === slot.id
//                   ? "#B8E8B1"
//                   : "#FFFFFF",
//                 color: isDisabled ? "#FFFFFF" : "#000000",
//                 borderColor: "#3D9F41",
//                 cursor: isDisabled ? "not-allowed" : "pointer",
//                 opacity: isDisabled ? 0.7 : 1,
//               };

//               return (
//                 <div
//                   key={slot.id}
//                   onMouseEnter={() =>
//                     slot.is_booked &&
//                     setHoverMessage(" booked")
//                   }
//                   onMouseLeave={() => setHoverMessage("")}
//                   style={{ position: "relative" }}
//                 >
//                   <Button
//                     className="slot-button mx-2 my-2"
//                     style={buttonStyle}
//                     onClick={() =>
//                       !isDisabled && handleSlotClick(slot)
//                     }
//                     disabled={isDisabled}
//                   >
//                     {formatTime(slot.appointment_slot)}
//                   </Button>
//                   {slot.is_booked && hoverMessage && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "-35px",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         backgroundColor: "rgba(0, 0, 0, 0.8)",
//                         color: "#fff",
//                         padding: "5px 10px",
//                         borderRadius: "4px",
//                         fontSize: "0.75rem",
//                         whiteSpace: "nowrap",
//                         zIndex: 10,
//                       }}
//                     >
//                       {hoverMessage}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       ))}
//     </>
//   ) : (
//     <p style={{ color: "red" }}>No slots available</p>
//   )}
// </div>

//         </Col>

//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <FaArrowLeft
//               onClick={() => handlePrev(setAfternoonIndex, afternoonIndex)}
//               style={{
//                 cursor: "pointer",
//                 visibility: afternoonIndex > 0 ? "visible" : "hidden",
//               }}
//             />
//             <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>
//               Afternoon
//             </h4>
//             <FaArrowRight
//               onClick={() =>
//                 handleNext(setAfternoonIndex, afternoonIndex, slots.afternoon)
//               }
//               style={{
//                 cursor: "pointer",
//                 visibility:
//                   afternoonIndex + slotsPerPage < slots.afternoon.length
//                     ? "visible"
//                     : "hidden",
//               }}
//             />
//           </div>
//           <div>
//   {slots.afternoon.length > 0 ? (
//     <>
//       {Array.from({
//         length: Math.ceil(
//           slots.afternoon.slice(afternoonIndex, afternoonIndex + 16).length / 4
//         ),
//       }).map((_, rowIndex) => (
//         <div
//           key={rowIndex}
//           className="d-flex justify-content-center flex-wrap"
//         >
//           {slots.afternoon
//             .slice(
//               afternoonIndex + rowIndex * 4,
//               afternoonIndex + (rowIndex + 1) * 4
//             )
//             .map((slot) => {
//               const currentTime = new Date(); // Current date and time
//               const slotTime = new Date(`${slot.appointment_date}T${slot.appointment_slot}`); // Combine date and time

//               // Check if the slot is for today
//               const isSameDate =
//                 currentTime.toDateString() === slotTime.toDateString();

//               // Determine if the slot should be disabled
//               const isDisabled =
//                 slot.is_booked || (isSameDate && currentTime >= slotTime);

//               // Styling for the button
//               const buttonStyle = {
//                 backgroundColor: slot.is_booked
//                   ? "gray"
//                   : isDisabled
//                   ? "#d2a679"
//                   : selectedSlot?.id === slot.id
//                   ? "#B8E8B1"
//                   : "#FFFFFF",
//                 color: isDisabled ? "#FFFFFF" : "#000000",
//                 borderColor: "#3D9F41",
//                 cursor: isDisabled ? "not-allowed" : "pointer",
//                 opacity: isDisabled ? 0.7 : 1,
//               };

//               return (
//                 <div
//                   key={slot.id}
//                   onMouseEnter={() =>
//                     slot.is_booked &&
//                     setHoverMessage("This slot is already booked")
//                   }
//                   onMouseLeave={() => setHoverMessage("")}
//                   style={{ position: "relative" }}
//                 >
//                   <Button
//                     className="slot-button mx-2 my-2"
//                     style={buttonStyle}
//                     onClick={() =>
//                       !isDisabled && handleSlotClick(slot)
//                     }
//                     disabled={isDisabled}
//                   >
//                     {formatTime(slot.appointment_slot)}
//                   </Button>
//                   {slot.is_booked && hoverMessage && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "-35px",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         backgroundColor: "rgba(0, 0, 0, 0.8)",
//                         color: "#fff",
//                         padding: "5px 10px",
//                         borderRadius: "4px",
//                         fontSize: "0.75rem",
//                         whiteSpace: "nowrap",
//                         zIndex: 10,
//                       }}
//                     >
//                       {hoverMessage}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       ))}
//     </>
//   ) : (
//     <p style={{ color: "red" }}>No slots available</p>
//   )}
// </div>

//         </Col>

//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <FaArrowLeft
//               onClick={() => handlePrev(setEveningIndex, eveningIndex)}
//               style={{
//                 cursor: "pointer",
//                 visibility: eveningIndex > 0 ? "visible" : "hidden",
//               }}
//             />
//             <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>Evening</h4>
//             <FaArrowRight
//               onClick={() =>
//                 handleNext(setEveningIndex, eveningIndex, slots.evening)
//               }
//               style={{
//                 cursor: "pointer",
//                 visibility:
//                   eveningIndex + slotsPerPage < slots.evening.length
//                     ? "visible"
//                     : "hidden",
//               }}
//             />
//           </div>
//           <div>
//   {slots.evening.length > 0 ? (
//     <>
//       {Array.from({
//         length: Math.ceil(
//           slots.evening.slice(eveningIndex, eveningIndex + 16).length / 4
//         ),
//       }).map((_, rowIndex) => (
//         <div
//           key={rowIndex}
//           className="d-flex justify-content-center flex-wrap"
//         >
//           {slots.evening
//             .slice(
//               eveningIndex + rowIndex * 4,
//               eveningIndex + (rowIndex + 1) * 4
//             )
//             .map((slot) => {
//               const currentTime = new Date(); // Current date and time
//               const slotTime = new Date(`${slot.appointment_date}T${slot.appointment_slot}`); // Combine date and time

//               // Check if the slot is for today
//               const isSameDate =
//                 currentTime.toDateString() === slotTime.toDateString();

//               // Determine if the slot should be disabled
//               const isDisabled =
//                 slot.is_booked || (isSameDate && currentTime >= slotTime);

//               // Styling for the button
//               const buttonStyle = {
//                 backgroundColor: slot.is_booked
//                   ? "gray"
//                   : isDisabled
//                   ? "#d2a679"
//                   : selectedSlot?.id === slot.id
//                   ? "#B8E8B1"
//                   : "#FFFFFF",
//                 color: isDisabled ? "#FFFFFF" : "#000000",
//                 borderColor: "#3D9F41",
//                 cursor: isDisabled ? "not-allowed" : "pointer",
//                 opacity: isDisabled ? 0.7 : 1,
//               };

//               return (
//                 <div
//                   key={slot.id}
//                   onMouseEnter={() =>
//                     slot.is_booked &&
//                     setHoverMessage(" booked")
//                   }
//                   onMouseLeave={() => setHoverMessage("")}
//                   style={{ position: "relative" }}
//                 >
//                   <Button
//                     className="slot-button mx-2 my-2"
//                     style={buttonStyle}
//                     onClick={() =>
//                       !isDisabled && handleSlotClick(slot)
//                     }
//                     disabled={isDisabled}
//                   >
//                     {formatTime(slot.appointment_slot)}
//                   </Button>
//                   {slot.is_booked && hoverMessage && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "-35px",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         backgroundColor: "rgba(0, 0, 0, 0.8)",
//                         color: "#fff",
//                         padding: "5px 10px",
//                         borderRadius: "4px",
//                         fontSize: "0.75rem",
//                         whiteSpace: "nowrap",
//                         zIndex: 10,
//                       }}
//                     >
//                       {hoverMessage}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       ))}
//     </>
//   ) : (
//     <p style={{ color: "red" }}>No slots available</p>
//   )}
// </div>

//         </Col>
//       </Row>

//       {isFormVisible && (
//         <Card
//           ref={formRef} // Attach the ref here
//           className="form-card p-4 mb-5 shadow mt-5"
//           style={{
//             backgroundColor: "#E8F4F8",
//             borderRadius: "10px",
//             width: "70%",
//             margin: "0 auto",
//           }}
//         >
//           <FaTimes
//             onClick={handleCloseForm}
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               fontSize: "20px",
//               color: "#003F7D",
//               cursor: "pointer",
//             }}
//           />

//           <h5
//             className="text-center"
//             style={{
//               color: "#003F7D",
//               fontWeight: "bold",
//               marginBottom: "20px",
//             }}
//           >
//             Fill Your Details
//           </h5>
//           <Form>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     value={name}
//                     onChange={(e) => {
//                       const regex = /^[A-Za-z\s]*$/;
//                       if (regex.test(e.target.value)) setName(e.target.value);
//                     }}
//                     placeholder="Name"
//                     style={{
//                       borderColor: name ? "#3D9F41" : "green",
//                       borderRadius: "5px",
//                     }}
//                   />
//                   {!name && (
//                     <small className="text-success">
//                       Name is required and should only contain alphabets.
//                     </small>
//                   )}
//                 </Form.Group>
//               </Col>

//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Mobile</Form.Label>
//                   <PhoneInput
//                     placeholder="Enter mobile number"
//                     value={mobile_number}
//                     onChange={(value) => {
//                       setMobile(value);

//                       if (value) {
//                         const matchedCountry = countries.find((c) =>
//                           value.startsWith(c.code)
//                         );
//                         if (matchedCountry) {
//                           setSelectedCountry(matchedCountry.name);
//                           setConsultancyFee(matchedCountry.fee);
//                         }
//                       }
//                     }}
//                     defaultCountry="IN"
//                     className="form-control"
//                     required
//                   />
//                   {(!mobile_number || mobile_number.length < 10) && (
//                     <small className="text-danger">
//                       Mobile number must include a valid country code and be
//                       complete.
//                     </small>
//                   )}
//                 </Form.Group>
//               </Col>

//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Age</Form.Label>
//                   <Form.Control
//                     value={age}
//                     onChange={(e) => {
//                       const regex = /^[0-9]*$/;
//                       const value = parseInt(e.target.value, 10);
//                       if (
//                         regex.test(e.target.value) &&
//                         (isNaN(value) || value <= 150)
//                       ) {
//                         setAge(e.target.value);
//                       }
//                     }}
//                     placeholder="Age"
//                     style={{
//                       borderColor:
//                         age && parseInt(age, 10) <= 150 ? "#3D9F41" : "green",
//                       borderRadius: "5px",
//                     }}
//                   />
//                   {(!age || parseInt(age, 10) > 150) && (
//                     <small className="text-success">
//                       Age must be a number between 0 and 150.
//                     </small>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Blood Group</Form.Label>
//                   <Form.Control
//                     value={bloodGroup}
//                     onChange={(e) => setBloodGroup(e.target.value)}
//                     placeholder="Blood Group"
//                     style={{
//                       borderColor: "#3D9F41",
//                       borderRadius: "5px",
//                     }}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Gender</Form.Label>
//                   <Form.Control
//                     as="select"
//                     value={gender}
//                     onChange={(e) => setGender(e.target.value)}
//                     style={{
//                       borderColor: "#3D9F41",
//                       borderRadius: "5px",
//                     }}
//                   >
//                     <option value="">Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Address</Form.Label>
//                   <Form.Control
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     placeholder="Address"
//                     style={{
//                       borderColor: "#3D9F41",
//                       borderRadius: "5px",
//                     }}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row>
//               {appointmentType === "online" && (
//                 <Col md={4}>
//                   <Form.Group>
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Email"
//                       style={{
//                         borderColor:
//                           email && /\S+@\S+\.\S+/.test(email)
//                             ? "#3D9F41"
//                             : "red",
//                         borderRadius: "5px",
//                       }}
//                     />
//                     {(!email || !/\S+@\S+\.\S+/.test(email)) && (
//                       <small className="text-danger">
//                         Valid email is required for online consultations.
//                       </small>
//                     )}
//                   </Form.Group>
//                 </Col>
//               )}
//             </Row>
//             <div className="text-center mt-4">
//               <Button
//                 variant="success"
//                 onClick={handleSubmit}
//                 disabled={
//                   loading ||
//                   !name ||
//                   !mobile_number ||
//                   !age ||
//                   (appointmentType === "online" && !email)
//                 }
//                 style={{
//                   width: "150px",
//                   backgroundColor: "#3D9F41",
//                   borderRadius: "20px",
//                   borderColor: "#3D9F41",
//                 }}
//               >
//                 {loading ? "Processing..." : "Submit"}
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header>
//           <Modal.Title>Message</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{modalMessage}</Modal.Body>
//         <Modal.Footer>
//           {/* <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button> */}
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default BookAppointment;

















import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Card, Form, Modal, Alert } from "react-bootstrap";
import { load } from "@cashfreepayments/cashfree-js";
import clinicVisitImage from "../../images/a-53-512.webp";
import onlineConsultationImage from "../../images/2562653-200.png";
import BaseUrl from "../../api/BaseUrl";
import { useHistory } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { format, addDays } from "date-fns";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../css/Patient.css";
import Checkout from "./CheckOutBook";

const BookAppointment = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef(null);

  const history = useHistory();
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [slotCounts, setSlotCounts] = useState({});
  const [name, setName] = useState("");
  const [mobile_number, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [morningIndex, setMorningIndex] = useState(0);
  const [afternoonIndex, setAfternoonIndex] = useState(0);
  const [eveningIndex, setEveningIndex] = useState(0);
  const slotsPerPage = 4;
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [consultancyFee, setConsultancyFee] = useState("₹800");

  const [hoverMessage, setHoverMessage] = useState("");

  const countries = [
    { name: "India", fee: "₹800" },
    { name: "Bangladesh", fee: "₹800" },
    { name: "Pakistan", fee: "₹800" },
    { name: "Nepal", fee: "₹800" },
    { name: "Sri Lanka", fee: "₹800" },
    { name: "Other Countries", fee: "$50" },
  ];

  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentSlotId, setAppointmentSlotId] = useState(null);

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

  const doctorId = 13;

  useEffect(() => {
    loadAvailableDates();
    initializeCashfree();
  }, []);

  const initializeCashfree = async () => {
    await load({ mode: "production" });
  };

  useEffect(() => {
    if (isFormVisible && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isFormVisible]);

  const handleCountryChange = (countryName) => {
    const country = countries.find((c) => c.name === countryName);
    if (country) {
      setSelectedCountry(country.name);
      setConsultancyFee(country.fee);

      // Update mobile number's country code using the selected country
      const countryCodes = {
        India: "+91",
        Bangladesh: "+880",
        Pakistan: "+92",
        Nepal: "+977",
        "Sri Lanka": "+94",
        "Other Countries": "+1", // Default code
      };

      const currentNumber = mobile_number?.slice(-10) || ""; // Retain last 10 digits
      setMobile(`${countryCodes[country.name]}${currentNumber}`);
    }
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

  const handleCloseForm = async () => {
    try {
      const response = await BaseUrl.put("/payment/updateappointment", {
        appointment_id: appointmentSlotId,
      });

      if (response.status === 200) {
        setIsFormVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) =>
      format(addDays(today, i), "yyyy-MM-dd")
    );
    setAvailableDates(dates);
    fetchAvailableSlotsCount(dates.slice(0, 3));
    fetchSlots(dates[0]);
  }, []);

  const fetchAvailableSlotsCount = async (selectedDates) => {
    try {
      const datesQuery = selectedDates.map((date) => `dates=${date}`).join("&");
      const endpoint = `/clinic/countavailableslots/?doctor_id=13&${datesQuery}`;
      const countResponse = await BaseUrl.get(endpoint);
      const availableCounts = countResponse.data;
      const newSlotCounts = {};
      availableCounts.forEach((count) => {
        newSlotCounts[count.date] = count.count;
      });

      setSlotCounts((prevCounts) => ({
        ...prevCounts,
        ...newSlotCounts,
      }));
      for (let date of selectedDates) {
        await BaseUrl.get(`/clinic/availableslots/?doctor_id=13&date=${date}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSlots = async (selectedDate, appointmentType) => {
    try {
      const endpoint = `/doctorappointment/blankslot/?doctor_id=13&slot_date=${selectedDate}&consultation_type=${appointmentType}`;
      const slotsResponse = await BaseUrl.get(endpoint);
      const fetchedSlots = slotsResponse.data;
      const { morningSlots, afternoonSlots, eveningSlots } =
        categorizeSlots(fetchedSlots);
      setSlots({
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error(error);
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

  const handleSlotClick = async (slot, selectedDate, type) => {
    try {
      setSelectedSlot(slot);
      setAppointmentSlotId(slot.id);
      localStorage.setItem("appointmentSlotId", slot.id);
      setIsFormVisible(true);

      // Scroll to the form
      formRef.current?.scrollIntoView({ behavior: "smooth" });

      const updateResponse = await BaseUrl.put("/payment/updateappointment", {
        appointment_id: slot.id,
      });

      if (updateResponse.status === 200) {
        const fetchResponse = await BaseUrl.get(
          `/doctorappointment/blankslot/?doctor_id=13&slot_date=${selectedDate}&consultation_type=${type}`
        );

        if (fetchResponse.status === 200) {
          const fetchedSlots = fetchResponse.data;
          const { morningSlots, afternoonSlots, eveningSlots } =
            categorizeSlots(fetchedSlots);
          setSlots({
            morning: morningSlots,
            afternoon: afternoonSlots,
            evening: eveningSlots,
          });
          fetchedSlots.map((slot) => {
            if (slot.id === appointmentSlotId) {
              return { ...slot, is_selected: true };
            } else {
              return { ...slot, is_selected: false };
            }
          });
          setIsFormVisible(false);
        } else {
          // Retry update in case fetch fails
          await BaseUrl.put("/payment/updateappointment", {
            appointment_id: slot.id,
          });
          throw new Error("Failed to fetch updated slots");
        }
      } else {
        // Retry update in case the initial update fails
        await BaseUrl.put("/payment/updateappointment", {
          appointment_id: slot.id,
        });
        throw new Error("Failed to update the appointment");
      }
    } catch (error) {
      // Handle errors and ensure update is retried
      console.error(error);
      try {
        await BaseUrl.put("/payment/updateappointment", {
          appointment_id: slot.id,
        });
      } catch (retryError) {
        console.error("Retry update failed:", retryError);
      }
    }
  };

  const patchPatientData = async (
    appointmentId,
    selectedDate,
    appointmentType
  ) => {
    try {
      const slotId = localStorage.getItem("selectedSlotId");
      const storedPatientId = localStorage.getItem("patientId");
      await BaseUrl.patch("/patient/patient/", {
        appointment: slotId,
        patient_id: storedPatientId,
      });

      // Call fetchSlots after the patch API is successful
      await fetchSlots(selectedDate, appointmentType);
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
      setErrorMessage();
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

      // Extract country code and local number from mobile_number
      const mobileString = mobile_number.toString();
      const extractedMobileNumber = mobileString.slice(-10); // Last 10 digits
      const countryCode = mobileString.slice(0, -10); // Country code

      // Store the country code and mobile number in localStorage
      localStorage.setItem("countryCode", countryCode);
      localStorage.setItem("mobileNumber", extractedMobileNumber);

      // Ensure selected country matches the country code
      const matchedCountry = countries.find((c) =>
        mobileString.startsWith(c.code)
      );
      if (matchedCountry) {
        setSelectedCountry(matchedCountry.name);
        setConsultancyFee(matchedCountry.fee);

        // Store matched country details in localStorage
        localStorage.setItem("selectedCountry", matchedCountry.name);
        localStorage.setItem("consultancyFee", matchedCountry.fee);
      }

      // Create the patient
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

      // Extract patient details from the response
      const patientDetails = patientResponse.data?.data;
      const fetchedPatientId = patientDetails?.id;
      const fetchedName = patientDetails?.name; // Correctly extract name
      const fetchedMobileNumber = patientDetails?.mobile_number; // Correctly extract mobile number

      // Store patient details in localStorage
      localStorage.setItem("patientId", fetchedPatientId);
      localStorage.setItem("patientName", fetchedName); // Save name correctly
      localStorage.setItem("patientMobileNumber", fetchedMobileNumber); // Save mobile_number correctly
      localStorage.setItem("patientAge", age);
      localStorage.setItem("patientBloodGroup", bloodGroup);
      localStorage.setItem("patientGender", gender);
      localStorage.setItem("patientAddress", address);
      localStorage.setItem("patientEmail", email);

      // Store selected slot ID
      localStorage.setItem("selectedSlotId", selectedSlot.id);

      // Fetch the consultation fee with consultation_type
      const consultationType =
        appointmentType === "clinic" ? "walk-in" : "online";

      const feeResponse = await BaseUrl.get(
        `/patient/fee/?country_code=${countryCode}&consultation_type=${consultationType}`
      );
      const { consultation_fee: amount, currency } = feeResponse.data;

      // Store the fee and currency in localStorage
      localStorage.setItem("consultationFee", amount);
      localStorage.setItem("currency", currency);

      // Navigate to the Checkout route
      history.push("/components/checkout");
    } catch (error) {
      console.error("Error during form submission:", error); // Log the error for debugging
      setErrorMessage("Error processing request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPaymentGateway = async (paymentSessionId) => {
    try {
      const cashfree = await load({ mode: "production" });
      await cashfree.checkout({
        paymentSessionId,
        returnUrl: "http://localhost:3000/patientbookappointment",
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
          await patchPatientData();
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
      className="book-appointment-container mb-5"
      style={{
        background: "linear-gradient(to bottom, #cdefe1, #ffffff)",
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
        Niramaya Homoeopathy
      </h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="d-flex justify-content-center mb-5 card-new">
        <Card
          className="clinic-visit-card mx-3 shadow text-center"
          style={{
            width: "300px",
            height: "139.56px",
            cursor: "pointer",
            marginBottom: "50px",
            backgroundColor:
              appointmentType === "clinic" ? "#FFFFFF" : "#3D9F41",
            color: appointmentType === "clinic" ? "#003F7D" : "#FFFFFF",
            border: appointmentType === "clinic" ? "2px solid #3D9F41" : "none",
          }}
          onClick={() => {
            setAppointmentType("clinic");
            localStorage.setItem("appointmentType", "clinic");
            const selectedDate = availableDates[currentDateIndex];
            fetchSlots(selectedDate, "clinic");
          }}
        >
          <Card.Body className="d-flex flex-column align-items-center">
            {/* Image and Title on the same row */}
            <div
              className="d-flex align-items-center"
              style={{ marginBottom: "10px", gap: "10px" }}
            >
              <Card.Img
                src={clinicVisitImage}
                alt="Clinic Visit"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
              <Card.Title
                style={{
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                CLINIC VISIT
              </Card.Title>
            </div>

            {/* Description */}
            <Card.Text
              style={{
                fontSize: "12px",
                marginBottom: "10px",
                color: "#003F7D",
              }}
            >
              Book Physical Appointment
            </Card.Text>

            {/* Consultancy Fee */}
            <Card.Text
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#000",
                margin: "0",
              }}
            >
              Consultancy Fee: ₹500
            </Card.Text>
          </Card.Body>
        </Card>

        <Card
          className="online-consultation-card mx-3 shadow text-center"
          style={{
            width: "300px",
            height: "139.56px",
            cursor: "pointer",
            marginBottom: "50px",
            backgroundColor:
              appointmentType === "online" ? "#FFFFFF" : "#3D9F41",
            color: appointmentType === "online" ? "#003F7D" : "#FFFFFF",
            border: appointmentType === "online" ? "2px solid #3D9F41" : "none",
          }}
          onClick={() => {
            setAppointmentType("online");
            localStorage.setItem("appointmentType", "online");
            const selectedDate = availableDates[currentDateIndex];
            fetchSlots(selectedDate, "online");
          }}
        >
          <Card.Body className="d-flex flex-column align-items-center">
            {/* Image and Title on the same row */}
            <div
              className="d-flex align-items-center"
              style={{ marginBottom: "10px", gap: "10px" }}
            >
              <Card.Img
                src={onlineConsultationImage}
                alt="Consult Online"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
              <Card.Title
                style={{
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                CONSULT ONLINE
              </Card.Title>
            </div>

            {/* Description */}
            <Card.Text
              style={{
                fontSize: "12px",
                marginBottom: "10px",
                color: "#003F7D",
              }}
            >
              Talk to Doctor Online
            </Card.Text>

            {/* Fee and Dropdown on the same line */}
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                width: "100%",
                marginBottom: "10px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              {/* Consultancy Fee (Left) */}
              <span>Consultancy Fee: {consultancyFee}</span>

              {/* Dropdown (Right) */}
              <Form.Select
                style={{
                  fontSize: "10px",
                  width: "120px",
                  textAlign: "center",
                }}
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div
        className="date-navigation-container d-flex align-items-center justify-content-center mb-3"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outline-secondary mb-4"
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
              <div
                key={index}
                className="date-button-container"
                style={{ textAlign: "center", margin: "0 10px" }}
              >
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    const newCurrentDateIndex = index + currentDateIndex;
                    setCurrentDateIndex(newCurrentDateIndex);

                    // Fetch slots for the selected date
                    const selectedDate = availableDates[newCurrentDateIndex];
                    fetchSlots(selectedDate, appointmentType);

                    // Reset pagination indices
                    setMorningIndex(0);
                    setAfternoonIndex(0);
                    setEveningIndex(0);
                  }}
                  style={{
                    backgroundColor:
                      index + currentDateIndex === currentDateIndex
                        ? "#3D9F41"
                        : "#fff",
                    color:
                      index + currentDateIndex === currentDateIndex
                        ? "#fff"
                        : "#000",
                    borderColor: "#3D9F41",
                    minWidth: "100px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "50px",
                  }}
                >
                  {index + currentDateIndex === 0
                    ? "Today"
                    : index + currentDateIndex === 1
                    ? "Tomorrow"
                    : format(new Date(date), "MMMM dd")}
                </Button>
                <div
                  style={{
                    fontSize: "12px",
                    marginTop: "8px",
                    color: slotCounts[date] > 0 ? "#28a745" : "#dc3545",
                  }}
                >
                  {slotCounts[date] > 0
                    ? `${slotCounts[date]} slots available`
                    : "No slots available"}
                </div>
              </div>
            ))}
        </div>

        <Button
          variant="outline-secondary mb-4"
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
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <FaArrowLeft
              onClick={() => handlePrev(setMorningIndex, morningIndex)}
              style={{
                cursor: "pointer",
                visibility: morningIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>Morning</h4>
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
      {Array.from({
        length: Math.ceil(
          slots.morning.slice(morningIndex, morningIndex + 16).length / 4
        ),
      }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="d-flex justify-content-center flex-wrap"
        >
          {slots.morning
            .slice(
              morningIndex + rowIndex * 4,
              morningIndex + (rowIndex + 1) * 4
            )
            .map((slot) => {
              const currentTime = new Date(); // Current date and time
              const slotDate = new Date(slot.appointment_date); // Slot date
              const slotTime = new Date(
                `${slot.appointment_date}T${slot.appointment_slot}`
              ); // Combine date and time

              // Check if the slot is for today
              const isSameDate =
                currentTime.toDateString() === slotDate.toDateString();

              // Determine if the slot should be disabled
              const isDisabled =
                slot.is_booked || (isSameDate && currentTime >= slotTime);

              // Styling for the button
              const buttonStyle = {
                backgroundColor: slot.is_booked
                  ? "gray"
                  : isDisabled
                  ? "#d2a679"
                  : selectedSlot?.id === slot.id
                  ? "#B8E8B1"
                  : "#FFFFFF",
                color: isDisabled ? "#FFFFFF" : "#000000",
                borderColor: "#3D9F41",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.7 : 1,
              };

              return (
                <div
                  key={slot.id}
                  onMouseEnter={() =>
                    slot.is_booked &&
                    setHoverMessage(" booked")
                  }
                  onMouseLeave={() => setHoverMessage("")}
                  style={{ position: "relative" }}
                >
                  <Button
                    className="slot-button mx-2 my-2"
                    style={buttonStyle}
                    onClick={() =>
                      !isDisabled && handleSlotClick(slot)
                    }
                    disabled={isDisabled}
                  >
                    {formatTime(slot.appointment_slot)}
                  </Button>
                  {slot.is_booked && hoverMessage && (
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
            })}
        </div>
      ))}
    </>
  ) : (
    <p style={{ color: "red" }}>No slots available</p>
  )}
</div>

        </Col>

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
              Afternoon
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
      {Array.from({
        length: Math.ceil(
          slots.afternoon.slice(afternoonIndex, afternoonIndex + 16).length / 4
        ),
      }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="d-flex justify-content-center flex-wrap"
        >
          {slots.afternoon
            .slice(
              afternoonIndex + rowIndex * 4,
              afternoonIndex + (rowIndex + 1) * 4
            )
            .map((slot) => {
              const currentTime = new Date(); // Current date and time
              const slotTime = new Date(`${slot.appointment_date}T${slot.appointment_slot}`); // Combine date and time

              // Check if the slot is for today
              const isSameDate =
                currentTime.toDateString() === slotTime.toDateString();

              // Determine if the slot should be disabled
              const isDisabled =
                slot.is_booked || (isSameDate && currentTime >= slotTime);

              // Styling for the button
              const buttonStyle = {
                backgroundColor: slot.is_booked
                  ? "gray"
                  : isDisabled
                  ? "#d2a679"
                  : selectedSlot?.id === slot.id
                  ? "#B8E8B1"
                  : "#FFFFFF",
                color: isDisabled ? "#FFFFFF" : "#000000",
                borderColor: "#3D9F41",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.7 : 1,
              };

              return (
                <div
                  key={slot.id}
                  onMouseEnter={() =>
                    slot.is_booked &&
                    setHoverMessage(" booked")
                  }
                  onMouseLeave={() => setHoverMessage("")}
                  style={{ position: "relative" }}
                >
                  <Button
                    className="slot-button mx-2 my-2"
                    style={buttonStyle}
                    onClick={() =>
                      !isDisabled && handleSlotClick(slot)
                    }
                    disabled={isDisabled}
                  >
                    {formatTime(slot.appointment_slot)}
                  </Button>
                  {slot.is_booked && hoverMessage && (
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
            })}
        </div>
      ))}
    </>
  ) : (
    <p style={{ color: "red" }}>No slots available</p>
  )}
</div>

        </Col>

        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <FaArrowLeft
              onClick={() => handlePrev(setEveningIndex, eveningIndex)}
              style={{
                cursor: "pointer",
                visibility: eveningIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "1rem" }}>Evening</h4>
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
      {Array.from({
        length: Math.ceil(
          slots.evening.slice(eveningIndex, eveningIndex + 16).length / 4
        ),
      }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="d-flex justify-content-center flex-wrap"
        >
          {slots.evening
            .slice(
              eveningIndex + rowIndex * 4,
              eveningIndex + (rowIndex + 1) * 4
            )
            .map((slot) => {
              const currentTime = new Date(); // Current date and time
              const slotTime = new Date(`${slot.appointment_date}T${slot.appointment_slot}`); // Combine date and time

              // Check if the slot is for today
              const isSameDate =
                currentTime.toDateString() === slotTime.toDateString();

              // Determine if the slot should be disabled
              const isDisabled =
                slot.is_booked || (isSameDate && currentTime >= slotTime);

              // Styling for the button
              const buttonStyle = {
                backgroundColor: slot.is_booked
                  ? "gray"
                  : isDisabled
                  ? "#d2a679"
                  : selectedSlot?.id === slot.id
                  ? "#B8E8B1"
                  : "#FFFFFF",
                color: isDisabled ? "#FFFFFF" : "#000000",
                borderColor: "#3D9F41",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.7 : 1,
              };

              return (
                <div
                  key={slot.id}
                  onMouseEnter={() =>
                    slot.is_booked &&
                    setHoverMessage(" booked")
                  }
                  onMouseLeave={() => setHoverMessage("")}
                  style={{ position: "relative" }}
                >
                  <Button
                    className="slot-button mx-2 my-2"
                    style={buttonStyle}
                    onClick={() =>
                      !isDisabled && handleSlotClick(slot)
                    }
                    disabled={isDisabled}
                  >
                    {formatTime(slot.appointment_slot)}
                  </Button>
                  {slot.is_booked && hoverMessage && (
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
            })}
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
          ref={formRef} // Attach the ref here
          className="form-card p-4 mb-5 shadow mt-5"
          style={{
            backgroundColor: "#E8F4F8",
            borderRadius: "10px",
            width: "70%",
            margin: "0 auto",
          }}
        >
          <FaTimes
            onClick={handleCloseForm}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "20px",
              color: "#003F7D",
              cursor: "pointer",
            }}
          />

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
                  <PhoneInput
                    placeholder="Enter mobile number"
                    value={mobile_number}
                    onChange={(value) => {
                      setMobile(value);

                      if (value) {
                        const matchedCountry = countries.find((c) =>
                          value.startsWith(c.code)
                        );
                        if (matchedCountry) {
                          setSelectedCountry(matchedCountry.name);
                          setConsultancyFee(matchedCountry.fee);
                        }
                      }
                    }}
                    defaultCountry="IN"
                    className="form-control"
                    required
                  />
                  {(!mobile_number || mobile_number.length < 10) && (
                    <small className="text-danger">
                      Mobile number must include a valid country code and be
                      complete.
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
        <Modal.Header>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment;