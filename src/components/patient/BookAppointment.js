import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Form, Modal } from "react-bootstrap";
import BaseUrl from "../../api/BaseUrl";
import { format, addDays } from "date-fns";
import { Tabs, Tab } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import PaymentModal from "../payment/PaymentModal"; // Import the PaymentModal component
 
 
// Helper function to format time
const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
 
// Function to categorize slots
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
 
const BookAppointment = () => {
  const [slots, setSlots] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null); // State to store the appointment ID
  const [slotCounts, setSlotCounts] = useState([]);
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
 
  const [morningIndex, setMorningIndex] = useState(0);
  const [afternoonIndex, setAfternoonIndex] = useState(0);
  const [eveningIndex, setEveningIndex] = useState(0);
  const slotsPerPage = 4;
 
  const [name, setName] = useState("");
  const [mobile_number, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [blood_group, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [patientId, setPatientId] = useState(null);
 
  useEffect(() => {
    handleBookAppointment();
  }, []);
 
 
  const fetchSlotCounts = async (dates) => {
    try {
      const countResponse = await BaseUrl.get(
        `/clinic/countavailableslots/?doctor_id=1&dates=${dates.join("&dates=")}`
      );
      const countData = countResponse.data;
 
      const newSlotCounts = dates.map((date) => {
        const dateCount = countData.find((item) => item.date === date);
        return dateCount ? dateCount.count : 0;
      });
      setSlotCounts(newSlotCounts);
    } catch (error) {
      console.error("Error fetching slot counts:", error);
      setSlotCounts(dates.map(() => 0));
    }
  };
 
  const fetchSlots = async (selectedDate) => {
    try {
      const endpoint = `/doctorappointment/blankslot/?doctor_id=1&slot_date=${selectedDate}`;
      const slotsResponse = await BaseUrl.get(endpoint);
      const fetchedSlots = slotsResponse.data;
      setSlots(fetchedSlots);
      setShowSlots(true);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };
 
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setIsFormVisible(true);
  };
 
  const handleBookAppointment = () => {
    setShowSlots(true);
    const today = new Date();
    const dates = [
      format(today, "yyyy-MM-dd"),
      format(addDays(today, 1), "yyyy-MM-dd"),
      format(addDays(today, 2), "yyyy-MM-dd"),
    ];
    setAvailableDates(dates);
    fetchSlotCounts(dates);
  };
 
  const handleSubmitClick = async () => {
    if (appointmentType === "online" && !email) {
      setErrorMessage("This field is mandatory");
      return;
    }
 
    try {
      const response = await BaseUrl.post("/patient/patient/", {
        name,
        mobile_number,
        blood_group,
        gender,
        address,
        email,
        age,
        appointment_id: selectedSlot?.id || null,
        clinic_visit: appointmentType === "clinic",
        online_consultation: appointmentType === "online",
        doctor_id: 1,
      });
 
      setSuccessMessage(response.data.success);
      const patient = response.data.data.id;
      setPatientId(patient);
      setShowConfirmation(false);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error saving patient details:", error);
      setErrorMessage("Failed to save patient details. Please try again.");
    }
  };
 
 
  const handleConfirmAppointment = async (id) => {
    try {
      const postResponse = await BaseUrl.post("/patientappointment/bookslot/", {
        patient: id,
        doctor: 3,
        appointment_status: "upcoming",
        appointment_slot: selectedSlot.id,
        consultation_type: appointmentType === "clinic" ? "walk-in" : "online",
      });
 
      if (postResponse && postResponse.data && postResponse.data.data) {
        setSuccessMessage(postResponse.data.success);
        setShowConfirmation(false);
        setShowSuccessModal(true);
        setErrorMessage("");
 
        const newAppointmentId = postResponse.data.data.id;
        setAppointmentId(newAppointmentId);
 
        const patchResponse = await BaseUrl.patch("/patient/patient/", {
          appointment: newAppointmentId,
          patient_id: id
        });
 
        if (patchResponse && patchResponse.data) {
          console.log("Patch operation successful", patchResponse.data);
        } else {
          throw new Error("Invalid response from PATCH operation");
        }
 
        setTimeout(() => {
          // Navigate to a new page, if necessary
        }, 4000);
 
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.message);
      setErrorMessage("Failed to confirm appointment. Please try again.");
    }
  };
 
 
 
 
  const handleAppointmentTypeChange = (type) => {
    setAppointmentType(type);
    setShowSlots(false);
    setIsFormVisible(false);
    setSlots([]);
    handleBookAppointment();
  };
 
  const { morningSlots, afternoonSlots, eveningSlots } = categorizeSlots(slots);
 
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
 
  const validateName = (value) => {
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setName(value);
    }
  };
 
  const validateMobile = (value) => {
    const regex = /^[0-9]{0,10}$/;
    if (regex.test(value)) {
      setMobile(value);
    }
  };
 
 
 
 
 
 
  const handlePaymentSuccess = (patientId) => {
    console.log("Payment successful for patient ID:", patientId);
    setShowPaymentModal(false);
    setShowConfirmation(true); // Show the confirmation modal
    handleConfirmAppointment(patientId); // Automatically confirm the appointment
  };
  const validateAge = (value) => {
    const regex = /^[0-9]*$/;
    if (regex.test(value) && (value === "" || parseInt(value) <= 150)) {
      setAge(value);
    }
  };
 
  const validateEmail = (value) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setEmail(value);
    setErrorMessage(""); // Clear error message on valid input
  };
 
  return (
    <div className="book-appointment-container mt-0">
      {showSlots && (
        <div className="slots-section">
          <h2 style={{ textAlign: "center", fontFamily: "sans-serif" }}>
            Select Slot
          </h2>
 
          <Tabs
            activeKey={appointmentType}
            onSelect={(key) => handleAppointmentTypeChange(key)}
            className="justify-content-center my-3"
          >
            {/* Clinic Visit Tab */}
            <Tab eventKey="clinic" title="Clinic Visit" />
 
            {/* Online Consultation Tab */}
            <Tab eventKey="online" title="Online Consultation" />
          </Tabs>
 
          <div className="date-button mb-3 d-flex flex-wrap justify-content-center">
            {availableDates.map((date, index) => (
              <div key={index} className="date-button-container">
                <Button
                  variant="outline-primary"
                  onClick={() => fetchSlots(date)}
                >
                  {index === 0
                    ? "Today"
                    : index === 1
                      ? "Tomorrow"
                      : format(date, "MMM dd")}
                </Button>
                <div>
                  <span
                    className={`slot-count ${slotCounts[index] > 0 ? "text-success" : "text-danger"}`}
                  >
                    {slotCounts[index] > 0
                      ? `${slotCounts[index]} slots available`
                      : "0 slots available"}
                  </span>
                </div>
              </div>
            ))}
          </div>
 
          <Row className="text-center mb-3">
            <Col>
              <h4>Morning Slots</h4>
            </Col>
            <Col>
              <h4>Afternoon Slots</h4>
            </Col>
            <Col>
              <h4>Evening Slots</h4>
            </Col>
          </Row>
 
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <FaArrowLeft
                  onClick={() => handlePrev(setMorningIndex, morningIndex)}
                  style={{
                    cursor: "pointer",
                    visibility: morningIndex > 0 ? "visible" : "hidden",
                  }}
                />
                {morningSlots
                  .slice(morningIndex, morningIndex + slotsPerPage)
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant="outline-primary"
                      className="slot-button mb-2 mx-1"
                      onClick={() => handleSlotClick(slot)}
                    >
                      {formatTime(slot.appointment_slot)}
                    </Button>
                  ))}
                <FaArrowRight
                  onClick={() =>
                    handleNext(setMorningIndex, morningIndex, morningSlots)
                  }
                  style={{
                    cursor: "pointer",
                    visibility:
                      morningIndex + slotsPerPage < morningSlots.length
                        ? "visible"
                        : "hidden",
                  }}
                />
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
                {afternoonSlots
                  .slice(afternoonIndex, afternoonIndex + slotsPerPage)
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant="outline-primary"
                      className="slot-button mb-2 mx-1"
                      onClick={() => handleSlotClick(slot)}
                    >
                      {formatTime(slot.appointment_slot)}
                    </Button>
                  ))}
                <FaArrowRight
                  onClick={() =>
                    handleNext(
                      setAfternoonIndex,
                      afternoonIndex,
                      afternoonSlots
                    )
                  }
                  style={{
                    cursor: "pointer",
                    visibility:
                      afternoonIndex + slotsPerPage < afternoonSlots.length
                        ? "visible"
                        : "hidden",
                  }}
                />
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
                {eveningSlots
                  .slice(eveningIndex, eveningIndex + slotsPerPage)
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant="outline-primary"
                      className="slot-button mb-2 mx-1"
                      onClick={() => handleSlotClick(slot)}
                    >
                      {formatTime(slot.appointment_slot)}
                    </Button>
                  ))}
                <FaArrowRight
                  onClick={() =>
                    handleNext(setEveningIndex, eveningIndex, eveningSlots)
                  }
                  style={{
                    cursor: "pointer",
                    visibility:
                      eveningIndex + slotsPerPage < eveningSlots.length
                        ? "visible"
                        : "hidden",
                  }}
                />
              </div>
            </Col>
          </Row>
 
          {isFormVisible && (
            <Card
              className="patient-details-form mt-4 p-4 shadow-lg"
              style={{
                maxWidth: "100%",
                margin: "0 auto",
                width: "100%",
                position: "relative",
              }}
            >
              <Button
                variant="link"
                onClick={() => setIsFormVisible(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  fontSize: "1.5rem",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                &times;
              </Button>
              <Card.Header as="h5" className="text-center">
                Fill Your Details
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => validateName(e.target.value)}
                          placeholder="Name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                          type="text"
                          value={mobile_number}
                          onChange={(e) => validateMobile(e.target.value)}
                          placeholder="Mobile"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="text"
                          value={age}
                          onChange={(e) => validateAge(e.target.value)}
                          placeholder="Age"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
 
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Control
                          type="text"
                          value={blood_group}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          placeholder="Blood Group"
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
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
 
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Email </Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => validateEmail(e.target.value)}
                          placeholder="Email"
                          required={appointmentType === "online"}
                          style={{
                            borderColor:
                              errorMessage &&
                              appointmentType === "online" &&
                              !email
                                ? "red"
                                : undefined,
                          }}
                        />
                        {errorMessage &&
                          appointmentType === "online" &&
                          !email && (
                            <small className="text-danger">
                              {errorMessage}
                            </small>
                          )}
                      </Form.Group>
                    </Col>
                  </Row>
 
                  <Button
                    variant="primary"
                    onClick={handleSubmitClick}
                    className="w-70 mt-3"
                  >
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
           <PaymentModal
                show={showPaymentModal}
                onHide={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                patientId="12345" // Replace with actual patient ID
                selectedSlot="exampleSlot" // Replace with actual slot info
                appointmentType="clinic" // Replace with actual appointment type
            />
 
          {/* Error message display */}
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      )}
 
      {/* Confirmation Modal */}
      <Modal
        show={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to confirm this booking?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleConfirmAppointment(patientId)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
 
      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
 
export default BookAppointment;