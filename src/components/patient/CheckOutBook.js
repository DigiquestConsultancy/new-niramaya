import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { load } from "@cashfreepayments/cashfree-js";
import gpay from "../../images/gpay.jpeg";
import amazonpay from "../../images/amazonpay.png";
import phonepay from "../../images/phonepay.png";
import paytm from "../../images/paytm.png";
import visa from "../../images/visa.jpeg";
import upi from "../../images/UPI.png";

const Checkout = () => {
  const [selectedOption, setSelectedOption] = useState("Debit / Credit Card");
  const [consultationFee, setConsultationFee] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [loading, setLoading] = useState(true);
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        setLoading(true);
        setError(null);
        const countryCode = localStorage.getItem("countryCode") || "91"; 
        const response = await BaseUrl.get(
          `/patient/fee/?country_code=${countryCode}`
        );
        const { consultation_fee: fee, currency: curr } = response.data;

        setConsultationFee(fee);
        setCurrency(curr);
      } catch (err) {
        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchFee();
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  const showMessageInModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleOthersPayment = async () => {
    try {
      // Fetch required details from localStorage
      const consultationFee =
        localStorage.getItem("consultationFee") || "11.00"; // Default amount if not found
      const currency = localStorage.getItem("currency") || "INR"; // Default to INR if not found
      const patientName = localStorage.getItem("patientName") || "Unknown"; // Default name if not found
      const patientMobileNumber =
        localStorage.getItem("mobileNumber") ; // Default number
      const patientId = localStorage.getItem("patientId");

      if (!patientId) {
        alert("Patient ID is missing. Please log in again.");
        return;
      }

      console.log('Creating a new payment session for "Others" option...');

      // Call the API to create a new payment session
      const createPaymentResponse = await BaseUrl.post("/payment/create/", {
        amount: consultationFee,
        currency: currency,
        customer_name: patientName,
        customer_phone: patientMobileNumber,
        patient_id: patientId,
      });

      // Extract the payment session ID from the response
      const paymentSessionId = createPaymentResponse.data?.payment_session_id;
      const orderId = createPaymentResponse.data?.order_id;

      if (!paymentSessionId) {
        throw new Error("Failed to create payment session.");
      }

      // Save the session ID to localStorage for reference
      localStorage.setItem("paymentSessionId", paymentSessionId);
      localStorage.setItem("orderId", orderId);
      console.log(
        'Payment session ID for "Others" stored in localStorage:',
        paymentSessionId
      );

      // Trigger the payment gateway
      console.log("Triggering payment gateway...");
      await triggerPaymentGateway(paymentSessionId);
    } catch (error) {
      console.error('Error creating payment session for "Others":', error);
      alert("Failed to create payment session. Please try again.");
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
  const triggerPaymentGateway = async (paymentSessionId) => {
    try {
      const cashfree = await load({ mode: "production" });
      await cashfree.checkout({
        paymentSessionId,
        returnUrl: "https://www.niramayahomoeopathy.com/patientbookappointment",
      });

      await pollPaymentStatus();
    } catch (error) {
      setErrorMessage("Failed to initiate payment gateway.");
    }
  };

  const pollPaymentStatus = async () => {
    try {
      const storedOrderId = localStorage.getItem("orderId");
      if (!storedOrderId) {
        setErrorMessage("Order ID is missing.");
        return;
      }

      const response = await BaseUrl.get(
        `/payment/get/?order_id=${storedOrderId}`
      );

      if (response.data?.status === "SUCCESS") {
        showMessageInModal("Payment successful! Booking appointment...");
        setSuccessMessage("Payment successful! Booking appointment...");
        handlePaymentConfirmation(); // Call handlePaymentConfirmation directly
      } else if (response.data?.status === "PENDING") {
        setTimeout(pollPaymentStatus, 5000); // Retry after 5 seconds
      } else {
        setErrorMessage("Payment failed. Please try again.");
        localStorage.removeItem("orderId"); // Remove orderId only on failure
      }
    } catch (error) {
      console.error("Error polling payment status:", error);
      setErrorMessage("Error checking payment status. Please try again.");
    }
  };
  const handlePaymentConfirmation = async () => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      setErrorMessage("Order ID is missing. Cannot confirm payment.");
      return;
    }

    try {
      setLoading(true);
      console.log(`Confirming payment for order ID: ${orderId}`);

      // Call the backend to confirm payment status
      const response = await BaseUrl.get(`/payment/get/?order_id=${orderId}`);

      if (response.data?.status === "SUCCESS") {
        console.log("Payment successful. Proceeding to book the slot...");
        await bookSlot(); // Book the appointment
        await patchPatientData(); // Update patient data if required
        localStorage.removeItem("orderId"); // Clear order ID after successful booking
        setSuccessMessage("Appointment booked successfully!");
      } else if (response.data?.status === "FAILED") {
        console.error("Payment failed.");
        setErrorMessage("Payment failed. Please try again.");
      } else {
        console.warn(
          "Unexpected payment status received:",
          response.data?.status
        );
        setErrorMessage("Unexpected payment status. Please contact support.");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setErrorMessage("Error confirming payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const confirmPaymentOnLoad = async () => {
      const orderId = localStorage.getItem("orderId");
      if (!orderId) {
        console.log(
          "No order ID found in localStorage. Skipping confirmation."
        );
        return;
      }

      console.log(`Found order ID: ${orderId}. Confirming payment...`);
      await handlePaymentConfirmation(); // Confirm the payment for the stored order ID
    };

    confirmPaymentOnLoad();
  }, []); // Run only on component mount

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

  const handleUPIPayment = async (upiId) => {
    try {
      // Fetch required details from localStorage
      const consultationFee =
        localStorage.getItem("consultationFee") || "11.00"; // Default to 11.00 if not found
      const currency = localStorage.getItem("currency") || "INR"; // Default to INR if not found
      const patientName = localStorage.getItem("patientName") || "Unknown"; // Default to Unknown if not found
      const patientMobileNumber =
        localStorage.getItem("patientMobileNumber") ; // Default to placeholder number
      const patientId = localStorage.getItem("patientId");

      if (!upiId) {
        alert("UPI ID is required for payment.");
        return;
      }

      if (!patientId) {
        alert("Patient ID is missing. Please log in again.");
        return;
      }

      // Step 1: Create a new payment session

      const createPaymentResponse = await BaseUrl.post("/payment/create/", {
        amount: consultationFee,
        currency: currency,
        customer_name: patientName,
        customer_phone: patientMobileNumber,
        patient_id: patientId,
      });

      // Extract payment session ID and order ID from the response
      const paymentSessionId = createPaymentResponse.data?.payment_session_id;
      const orderId = createPaymentResponse.data?.order_id;

      // Save the session ID and order ID to localStorage (update them every time)
      localStorage.setItem("paymentSessionId", paymentSessionId);
      localStorage.setItem("orderId", orderId);
      console.log(
        "New payment session ID stored in localStorage:",
        paymentSessionId
      );
      console.log("New order ID stored in localStorage:", orderId);

      // Step 2: Perform UPI payment
      console.log("Performing UPI payment with session ID:", paymentSessionId);

      const response = await BaseUrl.post("/payment/upi/", {
        payment_session_id: paymentSessionId,
        upi_id: upiId,
        patient_id: patientId,
      });

      const { action, cf_payment_id, payment_amount, payment_method } =
        response.data;

      if (action === "custom") {
        alert(`Payment Successful! Payment ID: ${cf_payment_id}`);
        await pollPaymentStatus();
      } else {
        alert("Payment failed or incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Error during UPI payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
  
    <div
      style={{
        backgroundColor: "#D7EAF0",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: "600px",
        }}
      >
        {/* Amount Section */}
        {loading ? (
          <p style={{ color: "#0091A5", textAlign: "center" }}>
            Loading fee...
          </p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : (
          <div
            style={{
              backgroundColor: "#0091A5",
              color: "white",
              textAlign: "center",
              padding: "20px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              Amount to Pay: {currency} {consultationFee}
            </h3>
          </div>
        )}

        {/* Stylish Payment Logos */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <img
            src={gpay}
            alt="GPay"
            style={{
              width: "60px",
              margin: "0 10px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
          <img
            src={paytm}
            alt="Paytm"
            style={{
              width: "60px",
              margin: "0 10px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
          <img
            src={phonepay}
            alt="PhonePe"
            style={{
              width: "60px",
              margin: "0 10px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
          <img
            src={amazonpay}
            alt="Amazon Pay"
            style={{
              width: "60px",
              margin: "0 10px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
          <img
            src={upi}
            alt="UPI"
            style={{
              width: "60px",
              margin: "0 10px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
          <img
            src={visa}
            alt="Visa"
            style={{
              width: "60px",
              margin: "0 10px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="d-flex flex-column align-items-center my-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="terms"
              required
            />
            <label
              htmlFor="terms"
              className="form-check-label"
              style={{
                float: "left", // Float label to the left
                marginRight: ".9em", // Add margin to the right
              }}
            >
              I agree to the{" "}
              <a href="/Conditions/tearmandcondition" className="text-primary">
                Terms and Conditions
              </a>
            </label>
          </div>
        </div>

        {/* Pay Button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => handleOthersPayment()}
            style={{
              padding: "12px 24px",
              borderRadius: "5px",
              backgroundColor: "#0091A5",
              color: "white",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              maxWidth: "300px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#007A8C")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0091A5")}
          >
            PAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;