// import React, { useState } from 'react';
// import image1 from '../../images/UPI.png';
 
// const Checkout = () => {
//   const [selectedOption, setSelectedOption] = useState('Debit / Credit Card');
 
//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//   };
 
//   return (
//     <div style={{ backgroundColor: '#D7EAF0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', width: '80%', maxWidth: '1200px' }}>
//         {/* Payment Options */}
//         <div style={{ width: '30%', marginRight: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
//           <h2 style={{ padding: '8px', borderBottom: '1px solid #ccc',
//              color: '#032257' }}>Payment Options</h2>
//           <ul style={{ listStyleType: 'none', padding: '0', fontWeight: 'bold', color: "#032257" }}>
//             {['Debit / Credit Card', 'UPI', 'Net Banking', 'Others'].map((option) => (
//               <li
//                 key={option}
//                 style={{
//                   padding: '12px 16px',
//                   cursor: 'pointer',
//                   backgroundColor: selectedOption === option ? '#D7EAF0' : 'white',
//                   borderBottom: '1px solid #ccc',
//                   borderLeft: selectedOption === option ? '6px solid #0091A5' : '4px solid transparent', // Only active option has color
//                   paddingLeft: '36px',
//                 }}
//                 onClick={() => handleOptionChange(option)}
//               >
//                 {option}
//               </li>
//             ))}
 
//           </ul>
//         </div>
 
//         {/* Payment Form */}
//         <div style={{ width: '70%', padding: '20px', backgroundColor: '#D7EAF0', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
//           <div style={{
//             backgroundColor: "#0091A5",
//             color: "white",
//             textAlign: "center",
//             padding: "20px",
//             borderRadius: "5px",
//             marginBottom: "10px"
//           }}>
//             <h3 style={{ marginBottom: '20px', color: 'white' }}>Amount to Pay: ₹800.00</h3>
//           </div>
//           {selectedOption === 'Debit / Credit Card' && (
//             <form style={{ display: 'flex', flexDirection: 'column' }}>
//               <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: "#032257" }}>Card Holder Name</label>
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
//               />
 
//               <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: "#032257" }}>Card Number</label>
//               <input
//                 type="text"
//                 placeholder="XXXX XXXX XXXX XXXX"
//                 style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
//               />
 
//               <div style={{ display: 'flex', gap: '10px' }}>
//                 <div style={{ flex: 1 }}>
//                   <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: "#032257" }}>Expiry (MM/YY)</label>
//                   <input
//                     type="text"
//                     placeholder="MM / YY"
//                     style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
//                   />
//                 </div>
 
//                 <div style={{ flex: 1 }}>
//                   <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: "#032257" }}>CVC</label>
//                   <input
//                     type="text"
//                     placeholder="XXX"
//                     style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
//                   />
//                 </div>
//               </div>
 
//               <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
//                 <input type="checkbox" id="terms" style={{ marginRight: '10px' }} />
//                 <label htmlFor="terms" style={{ fontSize: '14px' }}>
//                   I agree to the <a href="#" style={{ color: '#1E3EBD', textDecoration: 'none' }}>Terms and Conditions</a>
//                 </label>
//               </div>
 
//               <button
//                 type="submit"
//                 style={{
//                   marginTop: '20px',
//                   padding: '12px',
//                   borderRadius: '4px',
//                   backgroundColor: '#0091A5',
//                   color: 'white',
//                   border: 'none',
//                   fontSize: '16px',
//                   cursor: 'pointer',
//                   width: "25%",
 
//                 }}
//               >
//                 PAY
//               </button>
//             </form>
//           )}
 
//           {selectedOption === 'UPI' && (
//             <div style={{ textAlign: 'center' }}>
//               <img src={image1} alt="UPI Logo" style={{ width: '120px', marginBottom: '20px' }} />
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '20px',
//                 backgroundColor: '#f5f5f5',
//                 borderRadius: '8px',
//                 marginBottom: '20px',
//               }}>
//                 <img src="/qr-code-placeholder.png" alt="QR Code" style={{ width: '80px', marginBottom: '10px' }} />
//                 <p style={{ fontSize: '14px', color: '#666' }}>Show QR Code</p>
//                 <p style={{ fontSize: '12px', color: '#999' }}>Scan the QR code using your UPI app</p>
//               </div>
 
//               <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>OR</p>
 
//               <input
//                 type="text"
//                 placeholder="Enter Your UPI ID"
//                 style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
//               />
 
//               <button
//                 type="submit"
//                 style={{
//                   padding: '12px',
//                   borderRadius: '4px',
//                   backgroundColor: '#0091A5',
//                   color: 'white',
//                   border: 'none',
//                   fontSize: '16px',
//                   cursor: 'pointer',
//                   width: "25%"
//                 }}
//               >
//                 Pay
//               </button>
//             </div>
//           )}
 
//           {selectedOption !== 'Debit / Credit Card' && selectedOption !== 'UPI' && (
//             <p style={{ color: '#0091A5' }}>Selected payment option: {selectedOption}. Form for this option is not implemented yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default Checkout;












import React, { useState, useEffect } from "react";
import image1 from "../images/UPI.png";
import BaseUrl from "../api/BaseUrl";
import { load } from "@cashfreepayments/cashfree-js";
 
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
 
  const doctorId = 2;
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchFee = async () => {
      try {
        setLoading(true);
        setError(null);
 
        // Assume country code is stored in localStorage
        const countryCode = localStorage.getItem("countryCode") || "91"; // Default to '91' (India)
 
        // Fetch fee from API
        const response = await BaseUrl.get(
          `/patient/fee/?country_code=${countryCode}`
        );
        const { consultation_fee: fee, currency: curr } = response.data;
 
        setConsultationFee(fee);
        setCurrency(curr);
      } catch (err) {
        setError("Failed to fetch consultation fee. Please try again.");
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
        localStorage.getItem("patientMobileNumber") || "0000000000"; // Default number
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
      const cashfree = await load({ mode: "sandbox" });
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
        localStorage.getItem("patientMobileNumber") || "0000000000"; // Default to placeholder number
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
        await triggerPaymentGateway(paymentSessionId);
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
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          width: "80%",
          maxWidth: "1200px",
        }}
      >
        {/* Payment Options */}
        <div
          style={{
            width: "30%",
            marginRight: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              padding: "8px",
              borderBottom: "1px solid #ccc",
              color: "#032257",
            }}
          >
            Payment Options
          </h2>
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
              fontWeight: "bold",
              color: "#032257",
            }}
          >
            {["Debit / Credit Card", "UPI", "Net Banking", "Others"].map(
              (option) => (
                <li
                  key={option}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedOption === option ? "#D7EAF0" : "white",
                    borderBottom: "1px solid #ccc",
                    borderLeft:
                      selectedOption === option
                        ? "6px solid #0091A5"
                        : "4px solid transparent",
                    paddingLeft: "36px",
                  }}
                  onClick={() => {
                    handleOptionChange(option);
                    if (option === "Others") {
                      handleOthersPayment(); // Call the "Others" specific handler
                    }
                  }}
                >
                  {option}
                </li>
              )
            )}
          </ul>
        </div>
 
        {/* Payment Form */}
        <div
          style={{
            width: "70%",
            padding: "20px",
            backgroundColor: "#D7EAF0",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
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
                marginBottom: "10px",
              }}
            >
              <h3 style={{ marginBottom: "20px", color: "white" }}>
                Amount to Pay: {currency}
                {consultationFee}
              </h3>
            </div>
          )}
          {selectedOption === "Debit / Credit Card" && (
            <form style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#032257",
                }}
              >
                Card Holder Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                style={{
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#032257",
                }}
              >
                Card Number
              </label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                style={{
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      marginBottom: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#032257",
                    }}
                  >
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      width: "100%",
                    }}
                  />
                </div>
 
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      marginBottom: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#032257",
                    }}
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="XXX"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  id="terms"
                  style={{ marginRight: "10px" }}
                />
                <label htmlFor="terms" style={{ fontSize: "14px" }}>
                  I agree to the{" "}
                  <a
                    href="#"
                    style={{ color: "#1E3EBD", textDecoration: "none" }}
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  borderRadius: "4px",
                  backgroundColor: "#0091A5",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "25%",
                }}
              >
                PAY
              </button>
            </form>
          )}
          {selectedOption === "UPI" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const upiId = e.target.upiId.value; // Get the UPI ID from the input field
                const patientId = localStorage.getItem("patientId"); // Fetch patient ID from localStorage
                if (upiId && patientId) {
                  handleUPIPayment(upiId, patientId); // Call the UPI payment function
                } else {
                  alert(
                    "Please enter a valid UPI ID and ensure patient ID is available."
                  );
                }
              }}
              style={{ textAlign: "center" }}
            >
              <img
                src={image1}
                alt="UPI Logo"
                style={{ width: "120px", marginBottom: "20px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src="/qr-code-placeholder.png"
                  alt="QR Code"
                  style={{ width: "80px", marginBottom: "10px" }}
                />
                <p style={{ fontSize: "14px", color: "#666" }}>Show QR Code</p>
                <p style={{ fontSize: "12px", color: "#999" }}>
                  Scan the QR code using your UPI app
                </p>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                OR
              </p>
              <input
                name="upiId"
                type="text"
                placeholder="Enter Your UPI ID"
                style={{
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  backgroundColor: "#0091A5",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "25%",
                }}
              >
                Pay
              </button>
            </form>
          )}
 
          {selectedOption !== "Debit / Credit Card" &&
            selectedOption !== "UPI" && (
              <p style={{ color: "#0091A5" }}>
                Selected payment option: {selectedOption}. Form for this option
                is not implemented yet.
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
 
export default Checkout;