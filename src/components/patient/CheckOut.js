

// import React, { useState, useEffect } from "react";
// import { Button } from "react-bootstrap";
// import BaseUrl from "../../api/BaseUrl";
// import { load } from "@cashfreepayments/cashfree-js";
// import { jwtDecode } from "jwt-decode";

// import Gpay from "../../images/gpay.jpg";
// import Phonepay from "../../images/phonepay.png";
// import Paytm from "../../images/paytm.png";
// import Upi from "../../images/UPI.png";
// import VisaCard from '../../images/visacard.png';
// import Mastercard from '../../images/mastercard.png';
// import Netbanking from "../../images/rupay.png";
// import Rupay from "../../images/netbanking.png";

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

//   // const handlePayment = async ({ customer_name, customer_phone }) => {
//   //   setLoading(true);
//   //   try {
//   //     const patientToken = localStorage.getItem("patient_token");
//   //     const decodedToken = jwtDecode(patientToken);
//   //     const patient_id = decodedToken?.patient_id;

//   //     const response = await fetch(
//   //       "http://192.168.29.95:8001/payment/create/",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           Accept: "application/json",
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
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
//   //           returnUrl: "http://localhost:3000/patient/home",
//   //         });
//   //         localStorage.setItem("paymentSuccess", "true");
//   //       } else {
//   //         setErrorMessage();
//   //       }
//   //     } else {
//   //       const errorData = await response.json();
//   //       setErrorMessage(errorData);
//   //     }
//   //   } catch (error) {
//   //     setErrorMessage(`Error: ${error.message}`);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handlePayment = async ({ customer_name, customer_phone }) => {
//     setLoading(true);
//     try {
//       const patientToken = localStorage.getItem("patient_token");
//       const decodedToken = jwtDecode(patientToken);
//       const patient_id = decodedToken?.patient_id;
  
//       // const patient_id = localStorage.getItem("savedPatientId")

//       const response = await BaseUrl.post("/payment/create/", {
//         amount: consultationFee,
//         currency: currency,
//         customer_name,
//         customer_phone,
//         patient_id
//       });
  
//       if (response.status === 200) {
//         const { order_id, payment_session_id } = response.data;
//         localStorage.setItem("order_id", order_id);
  
//         if (payment_session_id) {
//           const cashfree = await load({ mode: "sandbox" });
//           await cashfree.checkout({
//             paymentSessionId: payment_session_id,
//             returnUrl: "http://localhost:3000/patient/home",
//           });
//           localStorage.setItem("paymentSuccess", "true");
//         } else {
//           setErrorMessage("Payment session ID is missing.");
//         }
//       } else {
//         setErrorMessage(response.data.error);
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "An error occurred during payment processing."
//       );
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
//            <img
//             src={Netbanking}
//             alt="Visa"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//           <img
//             src={Rupay}
//             alt="Visa"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//          <img
//             src={VisaCard}
//             alt="Visa"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//           <img
//             src={Mastercard}
//             alt="Visa"
//             className="img-fluid p-2"
//             style={{ maxWidth: "100px" }}
//           />
//         </div>

//         <form
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
//                   Terms & Conditions
//                 </a>
//               </label>
//             </div>
//           </div>
//           <Button
//             type="submit"
//             className="btn btn-lg d-flex justify-content-center mx-auto"
//             style={{
//               maxWidth: "300px",
//               width: "100%",
//               backgroundColor: "#0091A5",
//             }}
//           >
//             PAY
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;












import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import BaseUrl from "../../api/BaseUrl";
import { load } from "@cashfreepayments/cashfree-js";

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
        const consultationType = localStorage.getItem("consultationType");
        
        const response = await BaseUrl.get(
          `/patient/fee/?country_code=${countryCode}&consultation_type=${consultationType}`
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


  const handlePayment = async () => {
    setLoading(true);
    try {
      const patientId = localStorage.getItem("savedPatientId");
      const patientName = localStorage.getItem("savedPatientName");
      const patientMobile = localStorage.getItem("savedPatientMobile");
  
      if (!patientId || !patientName || !patientMobile) {
        setErrorMessage("Patient details are missing. Please try again.");
        return;
      }
  
      const lastTenDigits = patientMobile.slice(-10);
      const response = await BaseUrl.post("/payment/create/", {
        amount: consultationFee,
        currency: currency,
        customer_name: patientName,
        customer_phone: lastTenDigits,
        patient_id: patientId,
      });
  
      if (response.status === 200) {
        const { order_id, payment_session_id } = response.data;
        localStorage.setItem("order_id", order_id);
  
        if (payment_session_id) {
          const cashfree = await load({ mode: "sandbox" });
          await cashfree.checkout({
            paymentSessionId: payment_session_id,
            // returnUrl: "https://onlinehospital.in/patient/home",
            returnUrl: "http://localhost:3000/patient/home",
          });
          localStorage.setItem("paymentSuccess", "true");
        } else {
          setErrorMessage("Payment session ID is missing.");
        }
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "An error occurred during payment processing."
      );
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
                  Terms & Conditions
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
