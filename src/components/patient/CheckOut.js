// import React, { useState, useEffect } from "react";
// import image1 from "../../images/UPI.png";
// import BaseUrl from "../../api/BaseUrl";
// import { load } from "@cashfreepayments/cashfree-js";

// const Checkout = () => {
//   const [selectedOption, setSelectedOption] = useState("Debit / Credit Card");
//   const [consultationFee, setConsultationFee] = useState(null);
//   const [currency, setCurrency] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [appointmentType, setAppointmentType] = useState("clinic");
//   const [loading, setLoading] = useState(true);
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

//   const doctorId = 59;
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFee = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const countryCode = localStorage.getItem("countryCode") || "91";
//         const response = await BaseUrl.get(
//           `/patient/fee/?country_code=${countryCode}`
//         );
//         const { consultation_fee: fee, currency: curr } = response.data;
//         setConsultationFee(fee);
//         setCurrency(curr);
//       } catch (err) {
//         setError("Failed to fetch consultation fee. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFee();
//   }, []);

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//   };
//   const showMessageInModal = (message) => {
//     setModalMessage(message);
//     setShowModal(true);
//   };

//   const handleOthersPayment = async () => {
//     try {
//       const consultationFee =
//         localStorage.getItem("consultationFee") || "11.00";
//       const currency = localStorage.getItem("currency") || "INR";
//       const patientName = localStorage.getItem("patientName") || "Unknown";
//       const patientMobileNumber =
//         localStorage.getItem("patientMobileNumber");
//       const patientId = localStorage.getItem("patientId");

//       const createPaymentResponse = await BaseUrl.post("/payment/create/", {
//         amount: consultationFee,
//         currency: currency,
//         customer_name: patientName,
//         customer_phone: patientMobileNumber,
//         patient_id: patientId,
//       });

//       const paymentSessionId = createPaymentResponse.data?.payment_session_id;
//       const orderId = createPaymentResponse.data?.order_id;

//       if (!paymentSessionId) {
//         throw new Error("Failed to create payment session.");
//       }

//       localStorage.setItem("paymentSessionId", paymentSessionId);
//       localStorage.setItem("orderId", orderId);

//       await triggerPaymentGateway(paymentSessionId);
//     } catch (error) {
//       alert("Failed to create payment session. Please try again.");
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
//       setErrorMessage("Failed to book appointment. Please try again.");
//     }
//   };

//   const triggerPaymentGateway = async (paymentSessionId) => {
//     try {
//       const cashfree = await load({ mode: "sandbox" });
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
//         showMessageInModal("Payment successful! Booking appointment...");
//         setSuccessMessage("Payment successful! Booking appointment...");
//         handlePaymentConfirmation();
//       } else if (response.data?.status === "PENDING") {
//         setTimeout(pollPaymentStatus, 5000);
//       } else {
//         setErrorMessage("Payment failed. Please try again.");
//         localStorage.removeItem("orderId");
//       }
//     } catch (error) {
//       setErrorMessage("Error checking payment status. Please try again.");
//     }
//   };
//   const handlePaymentConfirmation = async () => {
//     const orderId = localStorage.getItem("orderId");
//     try {
//       setLoading(true);
//       const response = await BaseUrl.get(`/payment/get/?order_id=${orderId}`);

//       if (response.data?.status === "SUCCESS") {
//         await bookSlot();
//         await patchPatientData();
//         localStorage.removeItem("orderId");
//         setSuccessMessage("Appointment booked successfully!");
//       } else if (response.data?.status === "FAILED") {
//         setErrorMessage("Payment failed. Please try again.");
//       } else {
//         setErrorMessage("Unexpected payment status. Please contact support.");
//       }
//     } catch (error) {
//       setErrorMessage("Error confirming payment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const confirmPaymentOnLoad = async () => {
//       const orderId = localStorage.getItem("orderId");
//       await handlePaymentConfirmation();
//     };

//     confirmPaymentOnLoad();
//   }, []);

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

//       await fetchSlots(selectedDate, appointmentType);
//     } catch (error) {
//       setErrorMessage("Error updating patient data.");
//     }
//   };

//   const fetchSlots = async (selectedDate, appointmentType) => {
//     try {
//       const endpoint = `/doctorappointment/blankslot/?doctor_id=2&slot_date=${selectedDate}&consultation_type=${appointmentType}`;
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

//   const handleUPIPayment = async (upiId) => {
//     try {
//       const consultationFee =
//         localStorage.getItem("consultationFee") || "11.00";
//       const currency = localStorage.getItem("currency") || "INR";
//       const patientName = localStorage.getItem("patientName") || "Unknown";
//       const patientMobileNumber =
//         localStorage.getItem("patientMobileNumber") || "0000000000";
//       const patientId = localStorage.getItem("patientId");

//       const createPaymentResponse = await BaseUrl.post("/payment/create/", {
//         amount: consultationFee,
//         currency: currency,
//         customer_name: patientName,
//         customer_phone: patientMobileNumber,
//         patient_id: patientId,
//       });

//       const paymentSessionId = createPaymentResponse.data?.payment_session_id;
//       const orderId = createPaymentResponse.data?.order_id;

//       localStorage.setItem("paymentSessionId", paymentSessionId);
//       localStorage.setItem("orderId", orderId);
//       const response = await BaseUrl.post("/payment/upi/", {
//         payment_session_id: paymentSessionId,
//         upi_id: upiId,
//         patient_id: patientId,
//       });

//       const { action, cf_payment_id, payment_amount, payment_method } =
//         response.data;

//       if (action === "custom") {
//         alert(`Payment Successful! Payment ID: ${cf_payment_id}`);
//         await triggerPaymentGateway(paymentSessionId);
//       } else {
//         alert("Payment failed or incomplete. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during UPI payment:", error);
//       alert("Error processing payment. Please try again.");
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#D7EAF0",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           backgroundColor: "white",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//           width: "80%",
//           maxWidth: "1200px",
//         }}
//       >
//         <div
//           style={{
//             width: "30%",
//             marginRight: "20px",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <h2
//             style={{
//               padding: "8px",
//               borderBottom: "1px solid #ccc",
//               color: "#032257",
//             }}
//           >
//             Payment Options
//           </h2>
//           <ul
//             style={{
//               listStyleType: "none",
//               padding: "0",
//               fontWeight: "bold",
//               color: "#032257",
//             }}
//           >
//             {["Debit / Credit Card", "UPI", "Net Banking", "Others"].map(
//               (option) => (
//                 <li
//                   key={option}
//                   style={{
//                     padding: "12px 16px",
//                     cursor: "pointer",
//                     backgroundColor:
//                       selectedOption === option ? "#D7EAF0" : "white",
//                     borderBottom: "1px solid #ccc",
//                     borderLeft:
//                       selectedOption === option
//                         ? "6px solid #0091A5"
//                         : "4px solid transparent",
//                     paddingLeft: "36px",
//                   }}
//                   onClick={() => {
//                     handleOptionChange(option);
//                     if (option === "Others") {
//                       handleOthersPayment();
//                     }
//                   }}
//                 >
//                   {option}
//                 </li>
//               )
//             )}
//           </ul>
//         </div>

//         {/* Payment Form */}
//         <div
//           style={{
//             width: "70%",
//             padding: "20px",
//             backgroundColor: "#D7EAF0",
//             borderRadius: "8px",
//             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           {loading ? (
//             <p style={{ color: "#0091A5", textAlign: "center" }}>
//               Loading fee...
//             </p>
//           ) : error ? (
//             <p style={{ color: "red", textAlign: "center" }}>{error}</p>
//           ) : (
//             <div
//               style={{
//                 backgroundColor: "#0091A5",
//                 color: "white",
//                 textAlign: "center",
//                 padding: "20px",
//                 borderRadius: "5px",
//                 marginBottom: "10px",
//               }}
//             >
//               <h3 style={{ marginBottom: "20px", color: "white" }}>
//                 Amount to Pay: {currency}
//                 {consultationFee}
//               </h3>
//             </div>
//           )}
//           {selectedOption === "Debit / Credit Card" && (
//             <form style={{ display: "flex", flexDirection: "column" }}>
//               <label
//                 style={{
//                   marginBottom: "10px",
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   color: "#032257",
//                 }}
//               >
//                 Card Holder Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 style={{
//                   padding: "10px",
//                   marginBottom: "20px",
//                   borderRadius: "4px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//               <label
//                 style={{
//                   marginBottom: "10px",
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   color: "#032257",
//                 }}
//               >
//                 Card Number
//               </label>
//               <input
//                 type="text"
//                 placeholder="XXXX XXXX XXXX XXXX"
//                 style={{
//                   padding: "10px",
//                   marginBottom: "20px",
//                   borderRadius: "4px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <div style={{ flex: 1 }}>
//                   <label
//                     style={{
//                       marginBottom: "10px",
//                       fontSize: "16px",
//                       fontWeight: "bold",
//                       color: "#032257",
//                     }}
//                   >
//                     Expiry (MM/YY)
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="MM / YY"
//                     style={{
//                       padding: "10px",
//                       borderRadius: "4px",
//                       border: "1px solid #ccc",
//                       width: "100%",
//                     }}
//                   />
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <label
//                     style={{
//                       marginBottom: "10px",
//                       fontSize: "16px",
//                       fontWeight: "bold",
//                       color: "#032257",
//                     }}
//                   >
//                     CVC
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="XXX"
//                     style={{
//                       padding: "10px",
//                       borderRadius: "4px",
//                       border: "1px solid #ccc",
//                       width: "100%",
//                     }}
//                   />
//                 </div>
//               </div>
//               <div
//                 style={{
//                   marginTop: "20px",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   style={{ marginRight: "10px" }}
//                 />
//                 <label htmlFor="terms" style={{ fontSize: "14px" }}>
//                   I agree to the{" "}
//                   <a
//                     href="#"
//                     style={{ color: "#1E3EBD", textDecoration: "none" }}
//                   >
//                     Terms and Conditions
//                   </a>
//                 </label>
//               </div>
//               <button
//                 type="submit"
//                 style={{
//                   marginTop: "20px",
//                   padding: "12px",
//                   borderRadius: "4px",
//                   backgroundColor: "#0091A5",
//                   color: "white",
//                   border: "none",
//                   fontSize: "16px",
//                   cursor: "pointer",
//                   width: "25%",
//                 }}
//               >
//                 PAY
//               </button>
//             </form>
//           )}
//           {selectedOption === "UPI" && (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const upiId = e.target.upiId.value;
//                 const patientId = localStorage.getItem("patientId");
//                 if (upiId && patientId) {
//                   handleUPIPayment(upiId, patientId);
//                 } else {
//                   alert(
//                     "Please enter a valid UPI ID and ensure patient ID is available."
//                   );
//                 }
//               }}
//               style={{ textAlign: "center" }}
//             >
//               <img
//                 src={image1}
//                 alt="UPI Logo"
//                 style={{ width: "120px", marginBottom: "20px" }}
//               />
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   padding: "20px",
//                   backgroundColor: "#f5f5f5",
//                   borderRadius: "8px",
//                   marginBottom: "20px",
//                 }}
//               >
//                 <img
//                   src="/qr-code-placeholder.png"
//                   alt="QR Code"
//                   style={{ width: "80px", marginBottom: "10px" }}
//                 />
//                 <p style={{ fontSize: "14px", color: "#666" }}>Show QR Code</p>
//                 <p style={{ fontSize: "12px", color: "#999" }}>
//                   Scan the QR code using your UPI app
//                 </p>
//               </div>
//               <p
//                 style={{
//                   fontSize: "14px",
//                   color: "#666",
//                   marginBottom: "10px",
//                 }}
//               >
//                 OR
//               </p>
//               <input
//                 name="upiId"
//                 type="text"
//                 placeholder="Enter Your UPI ID"
//                 style={{
//                   padding: "10px",
//                   marginBottom: "20px",
//                   borderRadius: "4px",
//                   border: "1px solid #ccc",
//                   width: "100%",
//                 }}
//                 required
//               />
//               <button
//                 type="submit"
//                 style={{
//                   padding: "12px",
//                   borderRadius: "4px",
//                   backgroundColor: "#0091A5",
//                   color: "white",
//                   border: "none",
//                   fontSize: "16px",
//                   cursor: "pointer",
//                   width: "25%",
//                 }}
//               >
//                 Pay
//               </button>
//             </form>
//           )}

//           {selectedOption !== "Debit / Credit Card" &&
//             selectedOption !== "UPI" && (
//               <p style={{ color: "#0091A5" }}>
//                 Selected payment option: {selectedOption}. Form for this option
//                 is not implemented yet.
//               </p>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { load } from "@cashfreepayments/cashfree-js";
// import { jwtDecode } from "jwt-decode";

// import Gpay from "../../images/gpay.jpg";
// import Phonepay from "../../images/phonepay.png";
// import Paytm from "../../images/paytm.png";
// import Upi from "../../images/UPI.png";
// import Visa from "../../images/visa.jpeg";

// const Checkout = () => {
//   const [consultationFee, setConsultationFee] = useState(null);
//   const [currency, setCurrency] = useState("INR");
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchFee = async () => {
//       try {
//         setLoading(true);
//         const countryCode = localStorage.getItem("countryCode") || "91";
//         const response = await BaseUrl.get(
//           `/patient/fee/?country_code=${countryCode}`
//         );
//         const { consultation_fee: fee, currency: curr } = response.data;
//         setConsultationFee(fee);
//         setCurrency(curr);
//       } catch (err) {
//         setErrorMessage("Failed to fetch consultation fee. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFee();
//   }, []);

//   const handlePayment = async ({ customer_name, customer_phone }) => {
//     setLoading(true);
//     try {
//       const patientToken = localStorage.getItem("patient_token");
//       const decodedToken = jwtDecode(patientToken);
//       const patient_id = decodedToken?.patient_id;

//       const response = await fetch(
//         "http://192.168.29.95:8001/payment/create/",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             amount: consultationFee,
//             currency: currency,
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

//   return (
//     <div
//       style={{
//         backgroundColor: "#D7EAF0",
//         minHeight: "93vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         className="p-4"
//         style={{
//           width: "500px",
//           height: "80%",
//           backgroundColor: "#D7EAF0",
//           borderRadius: "8px",
//           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         {loading ? (
//           <p style={{ color: "#0091A5", textAlign: "center" }}>
//             Loading fee...
//           </p>
//         ) : errorMessage ? (
//           <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
//         ) : (
//           <div
//             style={{
//               backgroundColor: "#0091A5",
//               color: "white",
//               textAlign: "center",
//               padding: "20px",
//               borderRadius: "5px",
//               marginBottom: "10px",
//             }}
//           >
//             <h3 style={{ marginBottom: "20px" }}>
//               Amount to Pay: {currency} {consultationFee}
//             </h3>
//           </div>
//         )}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             margin: "20px 0",
//             gap: "10px",
//           }}
//         >
//           {/* Google Pay */}
//           <div
//             style={{
//               flexBasis: "calc(50% - 10px)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#D7EAF0", // Matching page background
//               borderRadius: "5px",
//             }}
//           >
//             <img
//               src={Gpay}
//               alt="Gpay"
//               style={{
//                 maxWidth: "100px",
//                 maxHeight: "50px",
//               }}
//             />
//           </div>

//           {/* PhonePe */}
//           <div
//             style={{
//               flexBasis: "calc(50% - 10px)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#D7EAF0",
//               borderRadius: "5px",
//             }}
//           >
//             <img
//               src={Phonepay}
//               alt="PhonePay"
//               style={{
//                 maxWidth: "100px",
//                 maxHeight: "50px",
//               }}
//             />
//           </div>

//           {/* Paytm */}
//           <div
//             style={{
//               flexBasis: "100%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#D7EAF0",
//               borderRadius: "5px",
//             }}
//           >
//             <img
//               src={Paytm}
//               alt="Paytm"
//               style={{
//                 maxWidth: "100px",
//                 maxHeight: "50px",
//               }}
//             />
//           </div>

//           {/* UPI */}
//           <div
//             style={{
//               flexBasis: "calc(50% - 10px)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#D7EAF0",
//               borderRadius: "5px",
//             }}
//           >
//             <img
//               src={Upi}
//               alt="UPI"
//               style={{
//                 maxWidth: "100px",
//                 maxHeight: "50px",
//               }}
//             />
//           </div>

//           {/* Visa */}
//           <div
//             style={{
//               flexBasis: "calc(50% - 10px)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#D7EAF0",
//               borderRadius: "5px",
//             }}
//           >
//             <img
//               src={Visa}
//               alt="Visa"
//               style={{
//                 maxWidth: "100px",
//                 maxHeight: "50px",
//               }}
//             />
//           </div>
//         </div>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handlePayment({
//               customer_name: "John Doe",
//               customer_phone: "9876543210",
//             });
//           }}
//           style={{ display: "flex", flexDirection: "column" }}
//         >
//           <div
//             style={{
//               marginTop: "20px",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <input
//               type="checkbox"
//               id="terms"
//               style={{ marginRight: "10px" }}
//               required
//             />
//             <label htmlFor="terms" style={{ fontSize: "14px" }}>
//               I agree to the{" "}
//               <a href="#" style={{ color: "#1E3EBD", textDecoration: "none" }}>
//                 Terms and Conditions
//               </a>
//             </label>
//           </div>
//           <button
//             type="submit"
//             style={{
//               marginTop: "20px",
//               padding: "12px",
//               borderRadius: "4px",
//               backgroundColor: "#0091A5",
//               color: "white",
//               border: "none",
//               fontSize: "16px",
//               cursor: "pointer",
//               width: "25%",
//             }}
//           >
//             PAY
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from "react";
// import { Button } from "react-bootstrap";
// import BaseUrl from "../../api/BaseUrl";
// import { load } from "@cashfreepayments/cashfree-js";
// import { jwtDecode } from "jwt-decode";

// import Gpay from "../../images/gpay.jpg";
// import Phonepay from "../../images/phonepay.png";
// import Paytm from "../../images/paytm.png";
// import Upi from "../../images/UPI.png";
// import Visa from "../../images/visa.jpeg";

// const Checkout = () => {
//   const [consultationFee, setConsultationFee] = useState(null);
//   const [currency, setCurrency] = useState("INR");
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchFee = async () => {
//       try {
//         setLoading(true);
//         const countryCode = localStorage.getItem("countryCode") || "91";
//         const response = await BaseUrl.get(
//           `/patient/fee/?country_code=${countryCode}`
//         );
//         const { consultation_fee: fee, currency: curr } = response.data;
//         setConsultationFee(fee);
//         setCurrency(curr);
//       } catch (err) {
//         setErrorMessage("Failed to fetch consultation fee. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFee();
//   }, []);

//   const handlePayment = async ({ customer_name, customer_phone }) => {
//     setLoading(true);
//     try {
//       const patientToken = localStorage.getItem("patient_token");
//       const decodedToken = jwtDecode(patientToken);
//       const patient_id = decodedToken?.patient_id;

//       const response = await fetch(
//         "http://192.168.29.95:8001/payment/create/",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             amount: consultationFee,
//             currency: currency,
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

//   return (
//     <div
//       className="d-flex justify-content-center align-items-center vh-100"
//       style={{ backgroundColor: "#D4F6FA" }}
//     >
//       <div
//         className="p-4 rounded shadow bg-white"
//         style={{ maxWidth: "500px", backgroundColor: "#D7EAF0" }}
//       >
//         {loading ? (
//           <p className="text-center text-primary">Loading fee...</p>
//         ) : errorMessage ? (
//           <p className="text-center text-danger">{errorMessage}</p>
//         ) : (
//           <div
//             className="text-center text-white p-3 rounded mb-3"
//             style={{ backgroundColor: "#0091A5" }}
//           >
//             <h4>
//               Amount to Pay: {currency} {consultationFee}
//             </h4>
//           </div>
//         )}

//         <div className="d-flex flex-wrap justify-content-center gap-2 my-3">
//           <img
//             src={Gpay}
//             alt="Gpay"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//           <img
//             src={Phonepay}
//             alt="PhonePay"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//           <img
//             src={Paytm}
//             alt="Paytm"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//           <img
//             src={Upi}
//             alt="UPI"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//           <img
//             src={Visa}
//             alt="Visa"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//         </div>

//         <div
//           onSubmit={(e) => {
//             e.preventDefault();
//             handlePayment({
//               customer_name: "John Doe",
//               customer_phone: "9876543210",
//             });
//           }}
//         >
//           <div className="d-flex flex-column align-items-center my-3">
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 id="terms"
//                 required
//               />
//               <label htmlFor="terms" className="form-check-label">
//                 I agree to the{" "}
//                 <a href="#" className="text-primary">
//                   Terms and Conditions
//                 </a>
//               </label>
//             </div>
//           </div>

// <Button
//   className="btn btn-lg d-flex justify-content-center mx-auto"
//   style={{
//     maxWidth: "300px",
//     width: "100%",
//     backgroundColor: "#0091A5",
//   }}
// >
//   PAY
// </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


















import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import BaseUrl from "../../api/BaseUrl";
import { load } from "@cashfreepayments/cashfree-js";
import { jwtDecode } from "jwt-decode";

import Gpay from "../../images/gpay.jpg";
import Phonepay from "../../images/phonepay.png";
import Paytm from "../../images/paytm.png";
import Upi from "../../images/UPI.png";
import VisaCard from '../../images/visacard.png';
import Mastercard from '../../images/mastercard.png';
import Netbanking from "../../images/rupay.png";
import Rupay from "../../images/netbanking.png";

const Checkout = () => {
  const [consultationFee, setConsultationFee] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFee = async () => {
      try {
        setLoading(true);
        const countryCode = localStorage.getItem("countryCode") || "91";
        const response = await BaseUrl.get(
          `/patient/fee/?country_code=${countryCode}`
        );
        const { consultation_fee: fee, currency: curr } = response.data;
        setConsultationFee(fee);
        setCurrency(curr);
      } catch (err) {
        setErrorMessage("Failed to fetch consultation fee. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFee();
  }, []);

  const handlePayment = async ({ customer_name, customer_phone }) => {
    setLoading(true);
    try {
      const patientToken = localStorage.getItem("patient_token");
      const decodedToken = jwtDecode(patientToken);
      const patient_id = decodedToken?.patient_id;

      const response = await fetch(
        "http://192.168.29.95:8001/payment/create/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: consultationFee,
            currency: currency,
            customer_name,
            customer_phone,
            patient_id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { order_id, payment_session_id } = data;
        localStorage.setItem("order_id", order_id);

        if (payment_session_id) {
          const cashfree = await load({ mode: "production" });
          await cashfree.checkout({
            paymentSessionId: payment_session_id,
            returnUrl: "http://localhost:3000/patient/home",
          });
          localStorage.setItem("paymentSuccess", "true");
        } else {
          setErrorMessage("Payment session ID missing");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData);
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#D4F6FA" }}
    >
      <div
        className="p-4 rounded shadow bg-white"
        style={{ maxWidth: "500px", backgroundColor: "#D7EAF0" }}
      >
        {loading ? (
          <p className="text-center text-primary">Loading fee...</p>
        ) : errorMessage ? (
          <p className="text-center text-danger">{errorMessage}</p>
        ) : (
          <div
            className="text-center text-white p-3 rounded mb-3"
            style={{ backgroundColor: "#0091A5" }}
          >
            <h4>
              Amount to Pay: {currency} {consultationFee}
            </h4>
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-center gap-2 my-3">
          <img
            src={Gpay}
            alt="Gpay"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
          <img
            src={Phonepay}
            alt="PhonePay"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
          <img
            src={Paytm}
            alt="Paytm"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
          <img
            src={Upi}
            alt="UPI"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
           <img
            src={Netbanking}
            alt="Visa"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
          <img
            src={Rupay}
            alt="Visa"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
         <img
            src={VisaCard}
            alt="Visa"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
          <img
            src={Mastercard}
            alt="Visa"
            className="img-fluid p-2"
            style={{ maxWidth: "100px" }}
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePayment({
              customer_name: "John Doe",
              customer_phone: "9876543210",
            });
          }}
        >
          <div className="d-flex flex-column align-items-center my-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="terms"
                required
              />
              <label htmlFor="terms" className="form-check-label">
                I agree to the{" "}
                <a href="#" className="text-primary">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
          <Button
            type="submit"
            className="btn btn-lg d-flex justify-content-center mx-auto"
            style={{
              maxWidth: "300px",
              width: "100%",
              backgroundColor: "#0091A5",
            }}
          >
            PAY
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
