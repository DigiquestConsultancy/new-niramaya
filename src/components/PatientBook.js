import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Form, Modal, Alert } from "react-bootstrap";
import { load } from "@cashfreepayments/cashfree-js";
import clinicVisitImage from "../images/a-53-512.webp";
import onlineConsultationImage from "../images/2562653-200.png";
import BaseUrl from "../api/BaseUrl";
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
