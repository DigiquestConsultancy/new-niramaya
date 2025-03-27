import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BaseUrl from "../../api/BaseUrl";
import { Card, Button, Spinner, Container } from "react-bootstrap";

const PaymentConfirmation = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false); 
  const history = useHistory();

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      const orderId = localStorage.getItem("orderId");
      if (!orderId) {
        setErrorMessage("No order ID found. Unable to confirm payment.");
        setLoading(false);
        return;
      }

      try {
        const response = await BaseUrl.get(`/payment/get/?order_id=${orderId}`);
        if (response.data?.status === "SUCCESS") {
          const amount = response.data?.amount;
          setBookingLoading(true); 
          const bookingMessage = await bookSlot(amount);
          await patchPatientData();
          setBookingLoading(false); 
          setSuccessMessage(bookingMessage || "Appointment booked successfully!");
          localStorage.removeItem("orderId");
        } else {
          setErrorMessage("Payment failed or pending. Please try again.");
        }
      } catch (error) {
        setErrorMessage("Error confirming payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handlePaymentConfirmation();
  }, []);

  const bookSlot = async (amount) => {
    try {
      const storedPatientId = localStorage.getItem("patientId");
      const storedAppointmentSlotId = localStorage.getItem("appointmentSlotId");
      const consultationType = amount === 500 ? "walk-in" : "online";
      
      const bookingResponse = await BaseUrl.post("/patientappointment/bookslot/", {
        patient: storedPatientId,
        doctor: 3,
        appointment_slot: storedAppointmentSlotId,
        consultation_type: consultationType,
      });

      if (bookingResponse.status === 200 || bookingResponse.status === 201) {
        return bookingResponse.data?.success;
      }
    } catch (error) {
      setErrorMessage("Error booking the appointment. Please try again.");
      setBookingLoading(false);
    }
  };

  const patchPatientData = async () => {
    try {
      const slotId = localStorage.getItem("selectedSlotId");
      const storedPatientId = localStorage.getItem("patientId");
      
      await BaseUrl.patch("/patient/patient/", {
        appointment: slotId,
        patient_id: storedPatientId,
      });
    } catch (error) {
      setErrorMessage("Error updating patient data.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: "400px", padding: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
        <Card.Body className="text-center">
          {loading ? (
            <>
              <Spinner animation="border" variant="primary" />
              <h4 className="text-secondary mt-3">Processing Payment...</h4>
            </>
          ) : bookingLoading ? (
            <>
              <Spinner animation="border" variant="primary" />
              <h4 className="text-secondary mt-3">Booking Appointment...</h4>
            </>
          ) : successMessage ? (
            <>
              <h2 className="text-success">Payment Successful</h2>
              <p className="text-muted">{successMessage}</p>
              <Button variant="success" className="mt-3" onClick={() => history.push("/")}>
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-danger">Payment Failed</h2>
              <p className="text-muted">{errorMessage}</p>
              <Button variant="danger" className="mt-3" onClick={() => history.push("/retry-payment")}>
                Retry Payment
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentConfirmation;