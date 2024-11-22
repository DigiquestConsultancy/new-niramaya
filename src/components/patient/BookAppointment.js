// import React, { useState, useEffect } from "react";
// import { Button, Row, Col, Card, Form, Modal } from "react-bootstrap";
// import BaseUrl from "../../api/BaseUrl";
// import { format, addDays } from "date-fns";
// import { Tabs, Tab } from "react-bootstrap";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import PaymentModal from "../payment/PaymentModal"; // Import the PaymentModal component


// // Helper function to format time
// const formatTime = (time) => {
//   const [hours, minutes] = time.split(":");
//   const date = new Date();
//   date.setHours(hours);
//   date.setMinutes(minutes);
//   const options = { hour: "numeric", minute: "numeric", hour12: true };
//   return new Intl.DateTimeFormat("en-US", options).format(date);
// };

// // Function to categorize slots
// const categorizeSlots = (slots) => {
//   const morningSlots = slots.filter((slot) => {
//     const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
//     return hours < 12;
//   });
//   const afternoonSlots = slots.filter((slot) => {
//     const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
//     return hours >= 12 && hours < 17;
//   });
//   const eveningSlots = slots.filter((slot) => {
//     const hours = parseInt(slot.appointment_slot.split(":")[0], 10);
//     return hours >= 17;
//   });
//   return { morningSlots, afternoonSlots, eveningSlots };
// };

// const BookAppointment = () => {
//   const [slots, setSlots] = useState([]);
//   const [showSlots, setShowSlots] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [appointmentId, setAppointmentId] = useState(null); // State to store the appointment ID
//   const [slotCounts, setSlotCounts] = useState([]);
//   const [appointmentType, setAppointmentType] = useState("clinic");
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   const [morningIndex, setMorningIndex] = useState(0);
//   const [afternoonIndex, setAfternoonIndex] = useState(0);
//   const [eveningIndex, setEveningIndex] = useState(0);
//   const slotsPerPage = 4;

//   const [name, setName] = useState("");
//   const [mobile_number, setMobile] = useState("");
//   const [age, setAge] = useState("");
//   const [blood_group, setBloodGroup] = useState("");
//   const [gender, setGender] = useState("");
//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [patientId, setPatientId] = useState(null);

//   useEffect(() => {
//     handleBookAppointment();
//   }, []);


//   const fetchSlotCounts = async (dates) => {
//     try {
//       const countResponse = await BaseUrl.get(
//         `/clinic/countavailableslots/?doctor_id=1&dates=${dates.join("&dates=")}`
//       );
//       const countData = countResponse.data;

//       const newSlotCounts = dates.map((date) => {
//         const dateCount = countData.find((item) => item.date === date);
//         return dateCount ? dateCount.count : 0;
//       });
//       setSlotCounts(newSlotCounts);
//     } catch (error) {
//       console.error("Error fetching slot counts:", error);
//       setSlotCounts(dates.map(() => 0));
//     }
//   };

//   const fetchSlots = async (selectedDate) => {
//     try {
//       const endpoint = `/doctorappointment/blankslot/?doctor_id=1&slot_date=${selectedDate}`;
//       const slotsResponse = await BaseUrl.get(endpoint);
//       const fetchedSlots = slotsResponse.data;
//       setSlots(fetchedSlots);
//       setShowSlots(true);
//       setIsFormVisible(false);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//     }
//   };

//   const handleSlotClick = (slot) => {
//     setSelectedSlot(slot);
//     setIsFormVisible(true);
//   };

//   const handleBookAppointment = () => {
//     setShowSlots(true);
//     const today = new Date();
//     const dates = [
//       format(today, "yyyy-MM-dd"),
//       format(addDays(today, 1), "yyyy-MM-dd"),
//       format(addDays(today, 2), "yyyy-MM-dd"),
//     ];
//     setAvailableDates(dates);
//     fetchSlotCounts(dates);
//   };

//   const handleSubmitClick = async () => {
//     if (appointmentType === "online" && !email) {
//       setErrorMessage("This field is mandatory");
//       return;
//     }

//     try {
//       const response = await BaseUrl.post("/patient/patient/", {
//         name,
//         mobile_number,
//         blood_group,
//         gender,
//         address,
//         email,
//         age,
//         appointment_id: selectedSlot?.id || null,
//         clinic_visit: appointmentType === "clinic",
//         online_consultation: appointmentType === "online",
//         doctor_id: 1,
//       });

//       setSuccessMessage(response.data.success);
//       const patient = response.data.data.id;
//       setPatientId(patient);
//       setShowConfirmation(false);
//       setShowPaymentModal(true);
//     } catch (error) {
//       console.error("Error saving patient details:", error);
//       setErrorMessage("Failed to save patient details. Please try again.");
//     }
//   };


//   const handleConfirmAppointment = async (id) => {
//     try {
//       const postResponse = await BaseUrl.post("/patientappointment/bookslot/", {
//         patient: id,
//         doctor: 3,
//         appointment_status: "upcoming",
//         appointment_slot: selectedSlot.id,
//         consultation_type: appointmentType === "clinic" ? "walk-in" : "online",
//       });

//       if (postResponse && postResponse.data && postResponse.data.data) {
//         setSuccessMessage(postResponse.data.success);
//         setShowConfirmation(false);
//         setShowSuccessModal(true);
//         setErrorMessage("");

//         const newAppointmentId = postResponse.data.data.id;
//         setAppointmentId(newAppointmentId);

//         const patchResponse = await BaseUrl.patch("/patient/patient/", {
//           appointment: newAppointmentId,
//           patient_id: id
//         });

//         if (patchResponse && patchResponse.data) {
//           console.log("Patch operation successful", patchResponse.data);
//         } else {
//           throw new Error("Invalid response from PATCH operation");
//         }

//         setTimeout(() => {
//           // Navigate to a new page, if necessary
//         }, 4000);

//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error) {
//       console.error("Error confirming booking:", error.message);
//       setErrorMessage("Failed to confirm appointment. Please try again.");
//     }
//   };




//   const handleAppointmentTypeChange = (type) => {
//     setAppointmentType(type);
//     setShowSlots(false);
//     setIsFormVisible(false);
//     setSlots([]);
//     handleBookAppointment();
//   };

//   const { morningSlots, afternoonSlots, eveningSlots } = categorizeSlots(slots);

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

//   const validateName = (value) => {
//     const regex = /^[A-Za-z\s]*$/;
//     if (regex.test(value)) {
//       setName(value);
//     }
//   };

//   const validateMobile = (value) => {
//     const regex = /^[0-9]{0,10}$/;
//     if (regex.test(value)) {
//       setMobile(value);
//     }
//   };






//   const handlePaymentSuccess = (patientId) => {
//     console.log("Payment successful for patient ID:", patientId);
//     setShowPaymentModal(false);
//     setShowConfirmation(true); // Show the confirmation modal
//     handleConfirmAppointment(patientId); // Automatically confirm the appointment
//   };
//   const validateAge = (value) => {
//     const regex = /^[0-9]*$/;
//     if (regex.test(value) && (value === "" || parseInt(value) <= 150)) {
//       setAge(value);
//     }
//   };

//   const validateEmail = (value) => {
//     const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//     setEmail(value);
//     setErrorMessage(""); // Clear error message on valid input
//   };

//   return (
//     <div className="book-appointment-container mt-0">
//       {showSlots && (
//         <div className="slots-section">
//           <h2 style={{ textAlign: "center", fontFamily: "sans-serif" }}>
//             Select Slot
//           </h2>

//           <Tabs
//             activeKey={appointmentType}
//             onSelect={(key) => handleAppointmentTypeChange(key)}
//             className="justify-content-center my-3"
//           >
//             {/* Clinic Visit Tab */}
//             <Tab eventKey="clinic" title="Clinic Visit" />

//             {/* Online Consultation Tab */}
//             <Tab eventKey="online" title="Online Consultation" />
//           </Tabs>

//           <div className="date-button mb-3 d-flex flex-wrap justify-content-center">
//             {availableDates.map((date, index) => (
//               <div key={index} className="date-button-container">
//                 <Button
//                   variant="outline-primary"
//                   onClick={() => fetchSlots(date)}
//                 >
//                   {index === 0
//                     ? "Today"
//                     : index === 1
//                       ? "Tomorrow"
//                       : format(date, "MMM dd")}
//                 </Button>
//                 <div>
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

//           <Row className="text-center mb-3">
//             <Col>
//               <h4>Morning Slots</h4>
//             </Col>
//             <Col>
//               <h4>Afternoon Slots</h4>
//             </Col>
//             <Col>
//               <h4>Evening Slots</h4>
//             </Col>
//           </Row>

//           <Row>
//             <Col>
//               <div className="d-flex justify-content-between align-items-center">
//                 <FaArrowLeft
//                   onClick={() => handlePrev(setMorningIndex, morningIndex)}
//                   style={{
//                     cursor: "pointer",
//                     visibility: morningIndex > 0 ? "visible" : "hidden",
//                   }}
//                 />
//                 {morningSlots
//                   .slice(morningIndex, morningIndex + slotsPerPage)
//                   .map((slot) => (
//                     <Button
//                       key={slot.id}
//                       variant="outline-primary"
//                       className="slot-button mb-2 mx-1"
//                       onClick={() => handleSlotClick(slot)}
//                     >
//                       {formatTime(slot.appointment_slot)}
//                     </Button>
//                   ))}
//                 <FaArrowRight
//                   onClick={() =>
//                     handleNext(setMorningIndex, morningIndex, morningSlots)
//                   }
//                   style={{
//                     cursor: "pointer",
//                     visibility:
//                       morningIndex + slotsPerPage < morningSlots.length
//                         ? "visible"
//                         : "hidden",
//                   }}
//                 />
//               </div>
//             </Col>

//             <Col>
//               <div className="d-flex justify-content-between align-items-center">
//                 <FaArrowLeft
//                   onClick={() => handlePrev(setAfternoonIndex, afternoonIndex)}
//                   style={{
//                     cursor: "pointer",
//                     visibility: afternoonIndex > 0 ? "visible" : "hidden",
//                   }}
//                 />
//                 {afternoonSlots
//                   .slice(afternoonIndex, afternoonIndex + slotsPerPage)
//                   .map((slot) => (
//                     <Button
//                       key={slot.id}
//                       variant="outline-primary"
//                       className="slot-button mb-2 mx-1"
//                       onClick={() => handleSlotClick(slot)}
//                     >
//                       {formatTime(slot.appointment_slot)}
//                     </Button>
//                   ))}
//                 <FaArrowRight
//                   onClick={() =>
//                     handleNext(
//                       setAfternoonIndex,
//                       afternoonIndex,
//                       afternoonSlots
//                     )
//                   }
//                   style={{
//                     cursor: "pointer",
//                     visibility:
//                       afternoonIndex + slotsPerPage < afternoonSlots.length
//                         ? "visible"
//                         : "hidden",
//                   }}
//                 />
//               </div>
//             </Col>

//             <Col>
//               <div className="d-flex justify-content-between align-items-center">
//                 <FaArrowLeft
//                   onClick={() => handlePrev(setEveningIndex, eveningIndex)}
//                   style={{
//                     cursor: "pointer",
//                     visibility: eveningIndex > 0 ? "visible" : "hidden",
//                   }}
//                 />
//                 {eveningSlots
//                   .slice(eveningIndex, eveningIndex + slotsPerPage)
//                   .map((slot) => (
//                     <Button
//                       key={slot.id}
//                       variant="outline-primary"
//                       className="slot-button mb-2 mx-1"
//                       onClick={() => handleSlotClick(slot)}
//                     >
//                       {formatTime(slot.appointment_slot)}
//                     </Button>
//                   ))}
//                 <FaArrowRight
//                   onClick={() =>
//                     handleNext(setEveningIndex, eveningIndex, eveningSlots)
//                   }
//                   style={{
//                     cursor: "pointer",
//                     visibility:
//                       eveningIndex + slotsPerPage < eveningSlots.length
//                         ? "visible"
//                         : "hidden",
//                   }}
//                 />
//               </div>
//             </Col>
//           </Row>

//           {isFormVisible && (
//             <Card
//               className="patient-details-form mt-4 p-4 shadow-lg"
//               style={{
//                 maxWidth: "100%",
//                 margin: "0 auto",
//                 width: "100%",
//                 position: "relative",
//               }}
//             >
//               <Button
//                 variant="link"
//                 onClick={() => setIsFormVisible(false)}
//                 style={{
//                   position: "absolute",
//                   top: "10px",
//                   right: "10px",
//                   fontSize: "1.5rem",
//                   color: "#000",
//                   textDecoration: "none",
//                 }}
//               >
//                 &times;
//               </Button>
//               <Card.Header as="h5" className="text-center">
//                 Fill Your Details
//               </Card.Header>
//               <Card.Body>
//                 <Form>
//                   <Row>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Name</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={name}
//                           onChange={(e) => validateName(e.target.value)}
//                           placeholder="Name"
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Mobile</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={mobile_number}
//                           onChange={(e) => validateMobile(e.target.value)}
//                           placeholder="Mobile"
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Age</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={age}
//                           onChange={(e) => validateAge(e.target.value)}
//                           placeholder="Age"
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Row>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Blood Group</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={blood_group}
//                           onChange={(e) => setBloodGroup(e.target.value)}
//                           placeholder="Blood Group"
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Gender</Form.Label>
//                         <Form.Control
//                           as="select"
//                           value={gender}
//                           onChange={(e) => setGender(e.target.value)}
//                         >
//                           <option value="">Select Gender</option>
//                           <option value="male">Male</option>
//                           <option value="female">Female</option>
//                         </Form.Control>
//                       </Form.Group>
//                     </Col>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Address</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={address}
//                           onChange={(e) => setAddress(e.target.value)}
//                           placeholder="Address"
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Row>
//                     <Col md={4}>
//                       <Form.Group>
//                         <Form.Label>Email </Form.Label>
//                         <Form.Control
//                           type="email"
//                           value={email}
//                           onChange={(e) => validateEmail(e.target.value)}
//                           placeholder="Email"
//                           required={appointmentType === "online"}
//                           style={{
//                             borderColor:
//                               errorMessage &&
//                               appointmentType === "online" &&
//                               !email
//                                 ? "red"
//                                 : undefined,
//                           }}
//                         />
//                         {errorMessage &&
//                           appointmentType === "online" &&
//                           !email && (
//                             <small className="text-danger">
//                               {errorMessage}
//                             </small>
//                           )}
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Button
//                     variant="primary"
//                     onClick={handleSubmitClick}
//                     className="w-70 mt-3"
//                   >
//                     Submit
//                   </Button>
//                 </Form>
//               </Card.Body>
//             </Card>
//           )}
//            <PaymentModal
//                 show={showPaymentModal}
//                 onHide={() => setShowPaymentModal(false)}
//                 onSuccess={handlePaymentSuccess}
//                 patientId="12345" // Replace with actual patient ID
//                 selectedSlot="exampleSlot" // Replace with actual slot info
//                 appointmentType="clinic" // Replace with actual appointment type
//             />

//           {/* Error message display */}
//           {errorMessage && (
//             <div className="alert alert-danger mt-3" role="alert">
//               {errorMessage}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       <Modal
//         show={showConfirmation}
//         onHide={() => setShowConfirmation(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Booking</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to confirm this booking?</Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowConfirmation(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={() => handleConfirmAppointment(patientId)}
//           >
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Success Modal */}
//       <Modal
//         show={showSuccessModal}
//         onHide={() => setShowSuccessModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Booking Successful</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{successMessage}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default BookAppointment;










import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Form, Tabs, Tab, Alert, Modal } from "react-bootstrap";
import { load } from "@cashfreepayments/cashfree-js";
import clinicVisitImage from "../../images/a-53-512.webp";
import onlineConsultationImage from "../../images/2562653-200.png";
import BaseUrl from "../../api/BaseUrl";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { format, addDays } from "date-fns";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const BookAppointment = () => {

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [patientId, setPatientId] = useState(null);
  const [appointmentSlotId, setAppointmentSlotId] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const [name, setName] = useState("");
  const [mobile_number, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [showSlots, setShowSlots] = useState(false);

  const [gender, setGender] = useState("");
  const [morningIndex, setMorningIndex] = useState(0);
  const [afternoonIndex, setAfternoonIndex] = useState(0);
  const [eveningIndex, setEveningIndex] = useState(0);
  const slotsPerPage = 4;

  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

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

  const doctorId = 4;

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
    if (availableDates.length > 0) {
      fetchSlots(availableDates[0], appointmentType);
    }
  }, [availableDates, appointmentType]);

  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) =>
      format(addDays(today, i), "yyyy-MM-dd")
    );
    setAvailableDates(dates);
  }, []);

  const fetchSlots = async (selectedDate, appointmentType) => {
    try {
      const endpoint = `/doctorappointment/blankslot/?doctor_id=${doctorId}&slot_date=${selectedDate}&appointment_type=${appointmentType}`;
      const slotsResponse = await BaseUrl.get(endpoint);
      const fetchedSlots = slotsResponse.data;
      const { morningSlots, afternoonSlots, eveningSlots } = categorizeSlots(fetchedSlots);

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
    } else if (
      direction === "next" &&
      currentDateIndex + 1 < availableDates.length
    ) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setAppointmentSlotId(slot.id);
    localStorage.setItem("appointmentSlotId", slot.id);
    setIsFormVisible(true);
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

  useEffect(() => {
    console.log("Patient ID:", patientId);
    console.log("Appointment Slot ID:", appointmentSlotId);
  }, [patientId, appointmentSlotId]);

  const bookSlot = async () => {
    try {
      const storedPatientId = localStorage.getItem("patientId");
      const storedAppointmentSlotId = localStorage.getItem("appointmentSlotId");
      const storedAppointmentType = localStorage.getItem("appointmentType");
      const bookingResponse = await BaseUrl.post("/patientappointment/bookslot/", {
        patient: storedPatientId,
        doctor: doctorId,
        appointment_slot: storedAppointmentSlotId,
        consultation_type: storedAppointmentType === "clinic" ? "walk-in" : "online",
      });
      const newAppointmentId = bookingResponse.data?.data?.id;
      await patchPatientData(newAppointmentId);
      setPopupMessage(bookingResponse.data.success);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      if (appointmentType === "online" && !email) {
        setErrorMessage("Email is mandatory for online consultations.");
        setLoading(false);
        return;
      }
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
      setPatientId(fetchedPatientId);
      localStorage.setItem("patientId", fetchedPatientId);

      const paymentResponse = await BaseUrl.post("/payment/create/", {
        amount: "1000",
        currency: "INR",
        customer_name: name,
        customer_phone: mobile_number,
      });

      const paymentSessionId = paymentResponse.data?.payment_session_id;
      const orderId = paymentResponse.data?.order_id;
      localStorage.setItem("orderId", orderId);

      await triggerPaymentGateway(paymentSessionId);
    } catch (error) {
      setErrorMessage("Error during submission. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerPaymentGateway = async (paymentSessionId, appointmentType) => {
    try {
      const cashfree = await load({ mode: "sandbox" });
      await cashfree.checkout({
        paymentSessionId,
        returnUrl: "http://localhost:3000/patient/bookappointment",
      });
      await pollPaymentStatus(appointmentType);
    } catch (error) {
      console.error("Failed to initiate payment gateway:", error);
      setErrorMessage("Failed to initiate payment gateway.");
    }
  };

  const pollPaymentStatus = async (appointmentType) => {
    const orderId = localStorage.getItem("orderId");
    try {
      setLoading(true);
      const response = await BaseUrl.get(`/payment/get/?order_id=${orderId}`);
      console.log("Payment Response:", response.data);

      if (response.data?.status === "SUCCESS") {
        await bookSlot(appointmentType);
      } else if (response.data?.status === "PENDING") {
        setTimeout(() => pollPaymentStatus(appointmentType), 5000);
      } else {
        const errorMsg = "Payment failed. Please try again.";
        console.log("Setting Error Message:", errorMsg);
        localStorage.setItem("errorMessage", errorMsg);
        setPopupMessage(errorMsg);
        setShowSuccessModal(true); // Show modal with error message
      }
    } catch (error) {
      const genericErrorMsg = "An unexpected error occurred. Please try again.";
      console.log("Caught Error:", error);
      localStorage.setItem("errorMessage", genericErrorMsg);
      setPopupMessage(genericErrorMsg);
      setShowSuccessModal(true); // Show modal with generic error
    } finally {
      setLoading(false);
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
          setSuccessMessage();
        } else {
          setErrorMessage();
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
    console.log("Slots Updated:", slots);
  }, [slots]);

  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) =>
      format(addDays(today, i), "yyyy-MM-dd")
    );
    setAvailableDates(dates);
  }, []);

  return (
    <div className="book-appointment-container mt-4">
      <h2 style={{ textAlign: "center", color: "#3D9F41", fontWeight: "bold", marginBottom: "50px" }}>
        Niramaya Homeopathy
      </h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="d-flex justify-content-center mb-4">
        <Card
          className="clinic-visit-card mx-3 shadow text-center"
          style={{
            width: "288px",
            height: "92px",
            cursor: "pointer",
            marginBottom: "50px",
            backgroundColor: appointmentType === "clinic" ? "#FFFFFF" : "#3D9F41",
            color: appointmentType === "clinic" ? "#003F7D" : "#FFFFFF",
            border: appointmentType === "clinic" ? "2px solid #3D9F41" : "none",
          }}
          onClick={() => {
            setAppointmentType("clinic");
            localStorage.setItem("appointmentType", "clinic");
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

        <Card
          className="online-consultation-card mx-3 shadow text-center"
          style={{
            width: "288px",
            height: "92px",
            cursor: "pointer",
            marginBottom: "50px",
            backgroundColor: appointmentType === "online" ? "#FFFFFF" : "#3D9F41",
            color: appointmentType === "online" ? "#003F7D" : "#FFFFFF",
            border: appointmentType === "online" ? "2px solid #3D9F41" : "none",
          }}
          onClick={() => {
            setAppointmentType("online");
            localStorage.setItem("appointmentType", "online");
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
        className="date-navigation-container d-flex align-items-center justify-content-center mb-3"
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
                  backgroundColor: index + currentDateIndex === currentDateIndex ? "#3D9F41" : "#fff",
                  color: index + currentDateIndex === currentDateIndex ? "#fff" : "#000",
                  borderColor: "#3D9F41",
                }}
              >
                {index + currentDateIndex === 0 ? "Today" : index + currentDateIndex === 1 ? "Tomorrow" : format(new Date(date), "MMM dd")}
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

      <div className="slot-section mt-5">
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

      <Row className="text-center mb-3">
        {/* Morning Slots */}
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <FaArrowLeft
              onClick={() => handlePrev(setMorningIndex, morningIndex)}
              style={{
                cursor: "pointer",
                visibility: morningIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "0" }}>Morning Slots</h4>
            <FaArrowRight
              onClick={() => handleNext(setMorningIndex, morningIndex, chunkArray(slots.morning, 4))}
              style={{
                cursor: "pointer",
                visibility: morningIndex + 3 < chunkArray(slots.morning, 4).length ? "visible" : "hidden",
              }}
            />
          </div>
          <div className="slot-grid">
            {slots.morning.length > 0 ? (
              chunkArray(slots.morning, 4)
                .slice(morningIndex, morningIndex + 3)
                .map((row, rowIndex) => (
                  <div className="slot-row d-flex justify-content-center mb-3" key={rowIndex}>
                    {row.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline-primary"
                        className="slot-button mx-2"
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          backgroundColor: selectedSlot?.id === slot.id ? "#B8E8B1" : "#FFFFFF",
                          color: "#000000",
                          borderColor: "#3D9F41",
                        }}
                      >
                        {formatTime(slot.appointment_slot)}
                      </Button>
                    ))}
                  </div>
                ))
            ) : (
              <p style={{ color: "red", marginTop: "10px" }}>No slots are available for the morning.</p>
            )}
          </div>
        </Col>

        {/* Afternoon Slots */}
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <FaArrowLeft
              onClick={() => handlePrev(setAfternoonIndex, afternoonIndex)}
              style={{
                cursor: "pointer",
                visibility: afternoonIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "0" }}>Afternoon Slots</h4>
            <FaArrowRight
              onClick={() => handleNext(setAfternoonIndex, afternoonIndex, chunkArray(slots.afternoon, 4))}
              style={{
                cursor: "pointer",
                visibility: afternoonIndex + 3 < chunkArray(slots.afternoon, 4).length ? "visible" : "hidden",
              }}
            />
          </div>
          <div className="slot-grid">
            {slots.afternoon.length > 0 ? (
              chunkArray(slots.afternoon, 4)
                .slice(afternoonIndex, afternoonIndex + 3)
                .map((row, rowIndex) => (
                  <div className="slot-row d-flex justify-content-center mb-3" key={rowIndex}>
                    {row.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline-primary"
                        className="slot-button mx-2"
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          backgroundColor: selectedSlot?.id === slot.id ? "#B8E8B1" : "#FFFFFF",
                          color: "#000000",
                          borderColor: "#3D9F41",
                        }}
                      >
                        {formatTime(slot.appointment_slot)}
                      </Button>
                    ))}
                  </div>
                ))
            ) : (
              <p style={{ color: "red", marginTop: "10px" }}>No slots are available for the afternoon.</p>
            )}
          </div>
        </Col>

        {/* Evening Slots */}
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <FaArrowLeft
              onClick={() => handlePrev(setEveningIndex, eveningIndex)}
              style={{
                cursor: "pointer",
                visibility: eveningIndex > 0 ? "visible" : "hidden",
              }}
            />
            <h4 style={{ color: "#003F7D", marginBottom: "0" }}>Evening Slots</h4>
            <FaArrowRight
              onClick={() => handleNext(setEveningIndex, eveningIndex, chunkArray(slots.evening, 4))}
              style={{
                cursor: "pointer",
                visibility: eveningIndex + 3 < chunkArray(slots.evening, 4).length ? "visible" : "hidden",
              }}
            />
          </div>
          <div className="slot-grid">
            {slots.evening.length > 0 ? (
              chunkArray(slots.evening, 4)
                .slice(eveningIndex, eveningIndex + 3)
                .map((row, rowIndex) => (
                  <div className="slot-row d-flex justify-content-center mb-3" key={rowIndex}>
                    {row.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline-primary"
                        className="slot-button mx-2"
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          backgroundColor: selectedSlot?.id === slot.id ? "#B8E8B1" : "#FFFFFF",
                          color: "#000000",
                          borderColor: "#3D9F41",
                        }}
                      >
                        {formatTime(slot.appointment_slot)}
                      </Button>
                    ))}
                  </div>
                ))
            ) : (
              <p style={{ color: "red", marginTop: "10px" }}>No slots are available for the evening.</p>
            )}
          </div>
        </Col>
      </Row>

      {isFormVisible && (
        <Card
          className="form-card p-4 shadow mt-5 mb-5"
          style={{
            backgroundColor: "#E8F4F8",
            borderRadius: "10px",
            width: "70%",
            margin: "0 auto",
          }}
        >
          <Button
            variant="link"
            onClick={() => setIsFormVisible(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              textDecoration: "none",
              color: "#003F7D",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            &times;
          </Button>
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
                    onChange={(e) => /^[A-Za-z\s]*$/.test(e.target.value) && setName(e.target.value)}
                    placeholder="Name"
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    value={mobile_number}
                    onChange={(e) => /^\d*$/.test(e.target.value) && setMobile(e.target.value)}
                    placeholder="Mobile"
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    value={age}
                    onChange={(e) => /^\d*$/.test(e.target.value) && setAge(e.target.value)}
                    placeholder="Age"
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Control
                    value={bloodGroup}
                    onChange={(e) => /^[A-Z+-]*$/.test(e.target.value.toUpperCase()) && setBloodGroup(e.target.value.toUpperCase())}
                    placeholder="Blood Group (e.g., A+)"
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                      borderColor: "#3D9F41",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center mt-4">
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={loading}
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
      <Modal
        show={showSuccessModal}
        onHide={handleCloseSuccessModal}
        centered
      >
        <Modal.Header
          style={{
            backgroundColor: popupMessage === "Payment failed. Please try again." ? '#f8d7da' : '#d4edda',
            borderBottom: 'none',
          }}
        >
          <Modal.Title
            className="d-flex align-items-center mt-5"
            style={{
              color: popupMessage === "Payment failed. Please try again." ? '#721c24' : '#155724',
            }}
          >
            {popupMessage === "Payment failed. Please try again." ? (
              <FaExclamationCircle style={{ marginRight: '10px' }} />
            ) : (
              <FaCheckCircle style={{ marginRight: '10px' }} />
            )}
            {popupMessage || "No message to display"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{
            backgroundColor: popupMessage === "Payment failed. Please try again." ? '#f8d7da' : '#d4edda',
            borderTop: 'none',
          }}
        >
          <Button
            variant="success"
            onClick={handleCloseSuccessModal}
            style={{
              backgroundColor: popupMessage === "Payment failed. Please try again." ? '#f5c6cb' : '#c3e6cb',
              color: popupMessage === "Payment failed. Please try again." ? '#721c24' : '#155724',
              borderColor: 'transparent',
              borderRadius: '10px',
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment;