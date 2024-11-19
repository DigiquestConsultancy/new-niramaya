// import React, { useState, useRef, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl"; // Import the BaseUrl instance
// import { Link, useHistory } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Import the eye icons
// import { jwtDecode } from "jwt-decode"; // For decoding JWT token
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// const DoctorLogin = ({ setIsDoctorLoggedIn }) => {
//   const [countryCode, setCountryCode] = useState("91");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to store OTP digits
//   const [message, setMessage] = useState({ type: "", text: "" }); // Message state with type and text
//   const [showVerification, setShowVerification] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false); // State to handle Forgot Password flow
//   const [timer, setTimer] = useState(60); // Timer for resend OTP button
//   const [isResendDisabled, setIsResendDisabled] = useState(true); // State to disable/enable resend OTP button
//   const [loginWithOtp, setLoginWithOtp] = useState(false); // State to toggle OTP login
//   const [newPassword, setNewPassword] = useState(""); // State for new password
//   const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
//   const [showNewPasswordFields, setShowNewPasswordFields] = useState(false); // Show new password fields after OTP verification
//   const [showNewPasswordModal, setShowNewPasswordModal] = useState(false); // Modal for password reset
//   const [createNewPasswordModal, setCreateNewPasswordModal] = useState(false);
//   const history = useHistory(); // Initialize useHistory for navigation
//   const inputRefs = useRef([]); // Refs to store references to the input elements
//   const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
//   const [newPasswordVisible, setNewPasswordVisible] = useState(false); // For new password visibility
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // For confirm password visibility

//   // Token validation function
//   const isValidToken = (token) => token && token.split(".").length === 3;

//   const startTimer = () => {
//     setIsResendDisabled(true); // Disable the button
//     setTimer(60); // Set timer to 60 seconds

//     const countdown = setInterval(() => {
//       setTimer((prevTimer) => {
//         if (prevTimer <= 1) {
//           clearInterval(countdown); // Stop the countdown
//           setIsResendDisabled(false); // Enable the Resend OTP button
//           return 0; // Ensure the timer shows 0
//         }
//         return prevTimer - 1; // Decrease the timer by 1 each second
//       });
//     }, 1000); // Run every second
//   };

//   useEffect(() => {
//     if (showVerification) {
//       startTimer(); // Start the timer when the OTP screen is shown
//     }
//   }, [showVerification]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       if (forgotPassword) {
//         const response = await BaseUrl.get(
//           `/doctor/userverification/?mobile_number=${mobileNumber}`
//         );
//         if (response.status === 200) {
//           setShowVerification(true); // Show OTP verification form
//           setMessage({
//             type: "success",
//             text: "OTP sent to your mobile number.",
//           });
//         }
//       } else if (loginWithOtp) {
//         const response = await BaseUrl.get(
//           `/doctor/login/?mobile_number=${mobileNumber}`
//         );
//         if (response.status === 200) {
//           setShowVerification(true); // Show OTP verification form
//           setMessage({
//             type: "success",
//             text: "OTP sent to your mobile number.",
//           });
//         }
//       } else {
//         // Password login flow
//         const response = await BaseUrl.post("/doctor/doctorlogin/", {
//           mobile_number: mobileNumber,
//           password: password,
//         });

//         if (response.status === 200) {
//           const token = response.data.access;
//           const userType = response.data.user_type; // Capture user_type from response
//           const isReset = response.data.is_reset; // Capture is_reset flag

//           // Validate and decode token
//           if (isValidToken(token)) {
//             localStorage.setItem("token", token); // Save token to local storage
//             localStorage.setItem("user_type", userType); // Save user_type to local storage

//             setIsDoctorLoggedIn(true); // Update doctor login state
//             setMessage({ type: "success", text: "Login successful!" }); // Display success message

//             // Only open the Create New Password form for clinic and reception, and if is_reset is false
//             if (
//               (userType === "clinic" || userType === "reception") &&
//               !isReset
//             ) {
//               setCreateNewPasswordModal(true); // Open the Create New Password form
//               return; // Stop here, don't redirect until a new password is created
//             }

//             // Redirect based on userType
//             if (userType === "doctor") {
//               history.push("/doctor/home");
//             } else if (userType === "clinic") {
//               history.push("/clinic/home");
//             } else if (userType === "reception") {
//               history.push("/reception/home");
//             } else {
//               setMessage({
//                 type: "error",
//                 text: "Unknown user type. Please contact support.",
//               });
//             }
//           } else {
//             setMessage({
//               type: "error",
//               text: "Invalid token format. Please try again.",
//             });
//           }
//         }
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.error ||
//         "An unexpected error occurred. Please try again.";
//       setMessage({ type: "error", text: errorMessage });
//     }
//   };

//   // Handle Resend OTP
//   const handleResendOTP = async () => {
//     try {
//       const response = await BaseUrl.get(
//         `/doctor/login/?mobile_number=${mobileNumber}`
//       );
//       if (response.status === 200) {
//         setMessage({ type: "success", text: "OTP resent successfully" });
//         setOtp(["", "", "", "", "", ""]); // Clear OTP input fields
//         startTimer(); // Restart the timer and disable the button again
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text:
//           error.response?.data?.error || "An error occurred. Please try again.",
//       });
//     }
//   };

//   // Handle OTP Verification
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     const enteredOtp = otp.join(""); // Concatenate OTP digits

//     if (forgotPassword) {
//       try {
//         const response = await BaseUrl.post("/doctor/userverification/", {
//           mobile_number: mobileNumber,
//           otp: enteredOtp,
//         });
//         if (response.status === 200) {
//           setMessage({
//             type: "success",
//             text: "OTP verified! Please enter a new password.",
//           });
//           setShowVerification(false); // Hide OTP verification
//           setShowNewPasswordFields(true); // Show new password fields
//         }
//       } catch (error) {
//         setMessage({
//           type: "error",
//           text: error.response?.data?.error || "Invalid OTP. Please try again.",
//         });
//       }
//     } else {
//       try {
//         const response = await BaseUrl.post("/doctor/login/", {
//           mobile_number: mobileNumber,
//           otp: enteredOtp,
//         });
//         if (response.status === 201) {
//           const token = response.data.access;
//           const userType = response.data.user_type; // Capture user_type from response

//           if (isValidToken(token)) {
//             localStorage.setItem("token", token); // Save token to local storage
//             localStorage.setItem("user_type", userType); // Save user_type to local storage

//             setIsDoctorLoggedIn(true); // Update doctor login state
//             setMessage({ type: "success", text: "Login successful!" });

//             // Redirect based on user_type
//             if (userType === "doctor") {
//               history.push("/doctor/home");
//             } else if (userType === "clinic") {
//               history.push("/clinic/home");
//             } else if (userType === "reception") {
//               history.push("/reception/home");
//             } else {
//               setMessage({
//                 type: "error",
//                 text: "Unknown user type. Please contact support.",
//               });
//             }
//           } else {
//             setMessage({ type: "error", text: "Invalid token received." });
//           }
//         }
//       } catch (error) {
//         setMessage({
//           type: "error",
//           text: error.response?.data?.error || "Invalid OTP. Please try again.",
//         });
//       }
//     }
//   };

//   // Handle Reset Password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setMessage({ type: "error", text: "Passwords do not match." });
//       return;
//     }

//     try {
//       const response = await BaseUrl.post("/doctor/forgetpassword/", {
//         mobile_number: mobileNumber,
//         new_password: newPassword,
//         confirm_password: confirmPassword,
//       });

//       if (response.status === 201 || response.status === 200) {
//         setMessage({
//           type: "success",
//           text: "Password reset successfully! Please login with your new password.",
//         });
//         setShowNewPasswordModal(false); // Close modal after password reset
//         setTimeout(() => {
//           history.push("/doctor/login");
//         }, 2000);
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text:
//           error.response?.data?.error || "An error occurred. Please try again.",
//       });
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setMessage({ type: "error", text: "Passwords do not match." });
//       return;
//     }

//     try {
//       // Create a FormData object to match the curl command structure
//       const formData = new FormData();
//       formData.append("mobile_number", mobileNumber); // Append mobile number
//       formData.append("new_password", newPassword); // Append new password
//       formData.append("confirm_password", confirmPassword); // Append confirm password

//       // Send the POST request with the FormData object
//       const response = await BaseUrl.post("/doctor/changepassword/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", // Ensure correct content type
//         },
//       });

//       if (response.status === 201 || response.status === 200) {
//         setMessage({
//           type: "success",
//           text: "Password reset successfully! Please login with your new password.",
//         });
//         setCreateNewPasswordModal(false); // Close modal after password reset
//         setTimeout(() => {
//           history.push("/doctor/login");
//         }, 2000);
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text:
//           error.response?.data?.error || "An error occurred. Please try again.",
//       });
//     }
//   };

//   const handleChangeOtp = (index, value) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value.length === 1 && index < otp.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const toggleNewPasswordVisibility = () => {
//     setNewPasswordVisible(!newPasswordVisible);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setConfirmPasswordVisible(!confirmPasswordVisible);
//   };

//   const toggleAuthMode = (isRegister) => {
//     if (isRegister) {
//       history.push("/doctor/register");
//     } else {
//       history.push("/doctor/login");
//     }
//   };

//   return (
//     <div className="container-fluid login-box d-flex justify-content-center align-items-center">
//       <div className="row w-100 d-flex justify-content-lg-end">
//         <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container mt-4">
//           <div className="auth-toggle">
//             <span
//               onClick={() => toggleAuthMode(false)}
//               className="auth-link active"
//             >
//               Login
//             </span>
//             <span className="divider">|</span>
//             <span onClick={() => toggleAuthMode(true)} className="auth-link">
//               Register
//             </span>
//           </div>

//           {createNewPasswordModal ? (
//             <form onSubmit={handleChangePassword}>
//               <h2 className="text-dark mb-4">Create New Password</h2>
//               <div className="mb-3">
//                 <label htmlFor="newPassword" className="form-label">
//                   New Password
//                 </label>
//                 <div className="input-group">
//                   <input
//                     type={newPasswordVisible ? "text" : "password"}
//                     className="form-control"
//                     placeholder="Enter new password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                   />
//                   <span
//                     className="input-group-text"
//                     onClick={toggleNewPasswordVisibility}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="confirmPassword" className="form-label">
//                   Confirm Password
//                 </label>
//                 <div className="input-group">
//                   <input
//                     type={confirmPasswordVisible ? "text" : "password"}
//                     className="form-control"
//                     placeholder="Confirm new password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                   <span
//                     className="input-group-text"
//                     onClick={toggleConfirmPasswordVisibility}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </div>

//               <button type="submit" className="btn btn-primary">
//                 Create
//               </button>
//             </form>
//           ) : !showVerification && !forgotPassword && !showNewPasswordFields ? (
//             <form className="login-form log mb-4" onSubmit={handleLogin}>
//               <div className="doctor-login-link">
//                 <p className="text-link">
//                   Are you a Patient? <Link to="/patient/login">Login here</Link>
//                 </p>
//               </div>
//               <h2 className="text-dark mb-4">Doctor Login</h2>
//               <div className="text-dark mb-3">
//                 <label
//                   htmlFor="mobileNumber"
//                   className="form-label"
//                   style={{ fontSize: "large" }}
//                 >
//                   Mobile Number
//                 </label>
//                 <div className="input-group">
//                   <select
//                     className="form-select"
//                     style={{ maxWidth: "120px" }}
//                     value={countryCode}
//                     onChange={(e) => setCountryCode(e.target.value)}
//                   >
//                     <option value="91">+91 (India)</option>
//                     <option value="1">+1 (USA)</option>
//                     <option value="44">+44 (UK)</option>
//                   </select>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter mobile number"
//                     value={mobileNumber}
//                     onChange={(e) => setMobileNumber(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               {!loginWithOtp && (
//                 <div className="mb-3">
//                   <label
//                     htmlFor="password"
//                     className="form-label"
//                     style={{ fontSize: "large" }}
//                   >
//                     Password
//                   </label>
//                   <div className="input-group">
//                     <input
//                       type={passwordVisible ? "text" : "password"}
//                       className="form-control"
//                       placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required={!loginWithOtp}
//                     />
//                     <span
//                       className="input-group-text"
//                       onClick={togglePasswordVisibility}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {passwordVisible ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     value={loginWithOtp}
//                     id="Check"
//                     onChange={(e) => setLoginWithOtp(e.target.checked)}
//                   />
//                   <label className="form-check-label" htmlFor="Check">
//                     Login with OTP instead of Password
//                   </label>
//                 </div>

//                 <button
//                   type="button"
//                   className="btn btn-link p-0"
//                   onClick={() => setForgotPassword(true)}
//                 >
//                   <b>Forgot Password?</b>
//                 </button>
//               </div>

//               <button type="submit" className="btn btn-primary w-45 mb-3">
//                 {loginWithOtp ? "SEND OTP" : "LOGIN"}
//               </button>

//               {message.text && (
//                 <p
//                   style={{ color: message.type === "error" ? "red" : "green" }}
//                 >
//                   {message.text}
//                 </p>
//               )}
//             </form>
//           ) : forgotPassword && !showVerification && !showNewPasswordFields ? (
//             <form className="forgot-password-form mb-4" onSubmit={handleLogin}>
//               <h2 className="text-dark mb-4">Forgot Password</h2>
//               <p>
//                 Enter your mobile number and we'll send you a 6-digit OTP to
//                 reset your password
//               </p>
//               <div className="mb-3">
//                 <b>
//                   <label
//                     htmlFor="mobileNumber"
//                     className="form-label"
//                     style={{ fontSize: "large" }}
//                   >
//                     Enter your mobile number
//                   </label>
//                 </b>
//                 <div className="input-group">
//                   <select
//                     className="form-select"
//                     style={{ maxWidth: "120px" }}
//                     value={countryCode}
//                     onChange={(e) => setCountryCode(e.target.value)}
//                   >
//                     <option value="91">+91 (India)</option>
//                     <option value="1">+1 (USA)</option>
//                     <option value="44">+44 (UK)</option>
//                   </select>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter mobile number"
//                     value={mobileNumber}
//                     onChange={(e) => setMobileNumber(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//               <button type="submit" className="btn btn-primary w-25 mb-3">
//                 SEND OTP
//               </button>
//               <button
//                 type="button"
//                 className="btn d-flex align-items-center justify-content-start"
//                 onClick={() => setForgotPassword(false)}
//               >
//                 <FaArrowLeft className="me-2" />
//                 Back to Login
//               </button>
//               {message.text && (
//                 <p
//                   style={{ color: message.type === "error" ? "red" : "green" }}
//                 >
//                   {message.text}
//                 </p>
//               )}
//             </form>
//           ) : showVerification ? (
//             <form className="otp-form" onSubmit={handleVerifyOTP}>
//               <h2 className="text-dark mb-4">OTP Verification</h2>
//               <p>An OTP has been sent to your mobile number</p>
//               <div className="otp-container mb-3">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     maxLength="1"
//                     className="form-control otp-input"
//                     value={digit}
//                     onChange={(e) => handleChangeOtp(index, e.target.value)}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                   />
//                 ))}
//               </div>
//               <div className="d-flex justify-content-between">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={handleResendOTP}
//                   disabled={isResendDisabled}
//                 >
//                   Resend OTP
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   Verify OTP
//                 </button>
//               </div>
//               <div className="mt-3 d-flex justify-content-center align-items-center">
//                 <p style={{ fontSize: "large" }}>
//                   <span style={{ color: "black" }}>
//                     OTP has been sent, Reset OTP will be sent after{" "}
//                   </span>
//                   <span style={{ color: "red" }}>{timer} sec</span>
//                 </p>
//               </div>
//               {message.text && (
//                 <p
//                   style={{ color: message.type === "error" ? "red" : "green" }}
//                 >
//                   {message.text}
//                 </p>
//               )}
//             </form>
//           ) : showNewPasswordFields ? (
//             <form
//               className="reset-password-form"
//               onSubmit={handleResetPassword}
//             >
//               <h2 className="text-dark mb-4">Reset Password</h2>

//               <div className="mb-3">
//                 <label htmlFor="newPassword" className="form-label">
//                   New Password
//                 </label>
//                 <div className="input-group">
//                   <input
//                     type={newPasswordVisible ? "text" : "password"}
//                     className="form-control"
//                     placeholder="Enter new password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                   />
//                   <span
//                     className="input-group-text"
//                     onClick={toggleNewPasswordVisibility}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="confirmPassword" className="form-label">
//                   Confirm Password
//                 </label>
//                 <div className="input-group">
//                   <input
//                     type={confirmPasswordVisible ? "text" : "password"}
//                     className="form-control"
//                     placeholder="Confirm new password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                   <span
//                     className="input-group-text"
//                     onClick={toggleConfirmPasswordVisibility}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               </div>

//               <button type="submit" className="btn btn-primary">
//                 Submit
//               </button>
//               {message.text && (
//                 <p
//                   style={{ color: message.type === "error" ? "red" : "green" }}
//                 >
//                   {message.text}
//                 </p>
//               )}
//             </form>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorLogin;





 
import React, { useState, useRef, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl"; // Import the BaseUrl instance
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Import the eye icons
import { jwtDecode } from "jwt-decode"; // For decoding JWT token
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
 
const DoctorLogin = ({ setIsDoctorLoggedIn }) => {
 
  const [countryCode, setCountryCode] = useState("91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to store OTP digits
  const [message, setMessage] = useState({ type: "", text: "" }); // Message state with type and text
  const [showVerification, setShowVerification] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // State to handle Forgot Password flow
  const [timer, setTimer] = useState(60); // Timer for resend OTP button
  const [isResendDisabled, setIsResendDisabled] = useState(true); // State to disable/enable resend OTP button
  const [loginWithOtp, setLoginWithOtp] = useState(false); // State to toggle OTP login
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false); // Show new password fields after OTP verification
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false); // Modal for password reset
  const [createNewPasswordModal, setCreateNewPasswordModal] = useState(false);
  const history = useHistory(); // Initialize useHistory for navigation
  const inputRefs = useRef([]); // Refs to store references to the input elements
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // For new password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // For confirm password visibility
 
  const isValidToken = (token) => token && token.split(".").length === 3;
 
  const startTimer = () => {
    setIsResendDisabled(true); // Disable the button
    setTimer(60); // Set timer to 60 seconds
 
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown); // Stop the countdown
          setIsResendDisabled(false); // Enable the Resend OTP button
          return 0; // Ensure the timer shows 0
        }
        return prevTimer - 1; // Decrease the timer by 1 each second
      });
    }, 1000); // Run every second
  };
 
  useEffect(() => {
    if (showVerification) {
      startTimer(); // Start the timer when the OTP screen is shown
    }
  }, [showVerification]);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (forgotPassword) {
        const response = await BaseUrl.get(
          `/doctor/userverification/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200) {
          setShowVerification(true); // Show OTP verification form
          setMessage({
            type: "success",
            text: "OTP sent to your mobile number.",
          });
        }
      } else if (loginWithOtp) {
        const response = await BaseUrl.get(
          `/doctor/login/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200) {
          setShowVerification(true); // Show OTP verification form
          setMessage({
            type: "success",
            text: "OTP sent to your mobile number.",
          });
        }
      } else {
        // Password login flow
        const response = await BaseUrl.post("/doctor/doctorlogin/", {
          mobile_number: mobileNumber,
          password: password,
        });
 
        if (response.status === 200) {
          const token = response.data.access;
          const userType = response.data.user_type;
          const isReset = response.data.is_reset;
 
          if (isValidToken(token)) {
            localStorage.setItem("token", token);
            localStorage.setItem("user_type", userType);
 
            setIsDoctorLoggedIn(true);
            setMessage({ type: "success", text: "Login successful!" });
 
            if (
              (userType === "clinic" || userType === "reception") &&
              !isReset
            ) {
              setCreateNewPasswordModal(true);
              return;
            }
 
            if (userType === "doctor") {
              history.push("/doctor/home");
            } else if (userType === "clinic") {
              history.push("/clinic/home");
            } else if (userType === "reception") {
              history.push("/reception/home");
            } else {
              setMessage({
                type: "error",
                text: "Unknown user type. Please contact support.",
              });
            }
          } else {
            setMessage({
              type: "error",
              text: "Invalid token format. Please try again.",
            });
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    }
  };
 
  const handleResendOTP = async () => {
    try {
      const response = await BaseUrl.get(
        `/doctor/login/?mobile_number=${mobileNumber}`
      );
      if (response.status === 200) {
        setMessage({ type: "success", text: "OTP resent successfully" });
        setOtp(["", "", "", "", "", ""]);
        startTimer();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };
 
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
 
    if (forgotPassword) {
      try {
        const response = await BaseUrl.post("/doctor/userverification/", {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });
        if (response.status === 200) {
          setMessage({
            type: "success",
            text: "OTP verified! Please enter a new password.",
          });
          setShowVerification(false);
          setShowNewPasswordFields(true);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.error || "Invalid OTP. Please try again.",
        });
      }
    } else {
      try {
        const response = await BaseUrl.post("/doctor/login/", {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });
        if (response.status === 201) {
          const token = response.data.access;
          const userType = response.data.user_type;
 
          if (isValidToken(token)) {
            localStorage.setItem("token", token);
            localStorage.setItem("user_type", userType);
 
            setIsDoctorLoggedIn(true);
            setMessage({ type: "success", text: "Login successful!" });
 
            if (userType === "doctor") {
              history.push("/doctor/home");
            } else if (userType === "clinic") {
              history.push("/clinic/home");
            } else if (userType === "reception") {
              history.push("/reception/home");
            } else {
              setMessage({
                type: "error",
                text: "Unknown user type. Please contact support.",
              });
            }
          } else {
            setMessage({ type: "error", text: "Invalid token received." });
          }
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.error || "Invalid OTP. Please try again.",
        });
      }
    }
  };
 
  const handleResetPassword = async (e) => {
    e.preventDefault();
 
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
 
    try {
      const response = await BaseUrl.post("/doctor/forgetpassword/", {
        mobile_number: mobileNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
 
      if (response.status === 201 || response.status === 200) {
        setMessage({
          type: "success",
          text: "Password reset successfully! Please login with your new password.",
        });
        setShowNewPasswordModal(false);
        setTimeout(() => {
          history.push("/doctor/login");
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };
 
  const handleChangePassword = async (e) => {
    e.preventDefault();
 
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
 
    try {
      const formData = new FormData();
      formData.append("mobile_number", mobileNumber);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);
 
      const response = await BaseUrl.post("/doctor/changepassword/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
 
      if (response.status === 201 || response.status === 200) {
        setMessage({
          type: "success",
          text: "Password reset successfully! Please login with your new password.",
        });
        setCreateNewPasswordModal(false);
        setTimeout(() => {
          history.push("/doctor/login");
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };
 
  const handleChangeOtp = (index, value) => {
    const newOtp = [...otp];
 
    if (!isNaN(value) && value !== " ") {
      newOtp[index] = value;
      setOtp(newOtp);
 
      if (value.length === 1 && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
 
  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
 
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
 
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
 
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };
 
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
 
  const toggleAuthMode = (isRegister) => {
    if (isRegister) {
      history.push("/doctor/register");
    } else {
      history.push("/doctor/login");
    }
  };
 
  return (
    <div className="container-fluid login-box d-flex justify-content-center align-items-center">
      <div className="row w-100 d-flex justify-content-lg-end">
        <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container mt-4">
          <div className="auth-toggle">
            <span
              onClick={() => toggleAuthMode(false)}
              className="auth-link active"
            >
              Login
            </span>
            <span className="divider">|</span>
            <span onClick={() => toggleAuthMode(true)} className="auth-link">
              Register
            </span>
          </div>
 
          {createNewPasswordModal ? (
            <form onSubmit={handleChangePassword}>
              <h2 className="text-dark mb-4">Create New Password</h2>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={toggleNewPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
 
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
 
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </form>
          ) : !showVerification && !forgotPassword && !showNewPasswordFields ? (
            <form className="login-form log mb-4" onSubmit={handleLogin}>
              <div className="doctor-login-link">
                <p className="text-link">
                  Are you a Patient? <Link to="/patient/login">Login here</Link>
                </p>
              </div>
              <h2 className="text-dark mb-4">Doctor Login</h2>
              <div className="text-dark mb-3">
                <label
                  htmlFor="mobileNumber"
                  className="form-label"
                  style={{ fontSize: "large" }}
                >
                  Mobile Number
                </label>
                <div className="input-group">
                  <select
                    className="form-select"
                    style={{ maxWidth: "120px" }}
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="91">+91 (India)</option>
                    <option value="1">+1 (USA)</option>
                    <option value="44">+44 (UK)</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>
              </div>
 
              {!loginWithOtp && (
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label"
                    style={{ fontSize: "large" }}
                  >
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!loginWithOtp}
                    />
                    <span
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              )}
 
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={loginWithOtp}
                    id="Check"
                    onChange={(e) => setLoginWithOtp(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="Check">
                    Login with OTP instead of Password
                  </label>
                </div>
 
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setForgotPassword(true)}
                >
                  <b>Forgot Password?</b>
                </button>
              </div>
 
              <button type="submit" className="btn btn-primary w-45 mb-3">
                {loginWithOtp ? "SEND OTP" : "LOGIN"}
              </button>
 
              {message.text && (
                <p
                  style={{ color: message.type === "error" ? "red" : "green" }}
                >
                  {message.text}
                </p>
              )}
            </form>
          ) : forgotPassword && !showVerification && !showNewPasswordFields ? (
            <form className="forgot-password-form mb-4" onSubmit={handleLogin}>
              <h2 className="text-dark mb-4">Forgot Password</h2>
              <p>
                Enter your mobile number and we'll send you a 6-digit OTP to
                reset your password
              </p>
              <div className="mb-3">
                <b>
                  <label
                    htmlFor="mobileNumber"
                    className="form-label"
                    style={{ fontSize: "large" }}
                  >
                    Enter your mobile number
                  </label>
                </b>
                <div className="input-group">
                  <select
                    className="form-select"
                    style={{ maxWidth: "120px" }}
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="91">+91 (India)</option>
                    <option value="1">+1 (USA)</option>
                    <option value="44">+44 (UK)</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-25 mb-3">
                SEND OTP
              </button>
              <button
                type="button"
                className="btn d-flex align-items-center justify-content-start"
                onClick={() => setForgotPassword(false)}
              >
                <FaArrowLeft className="me-2" />
                Back to Login
              </button>
              {message.text && (
                <p
                  style={{ color: message.type === "error" ? "red" : "green" }}
                >
                  {message.text}
                </p>
              )}
            </form>
          ) : showVerification ? (
            <form className="otp-form" onSubmit={handleVerifyOTP}>
              <h2 className="text-dark mb-4">OTP Verification</h2>
              <p>An OTP has been sent to your mobile number</p>
 
              <div className="otp-container mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="form-control otp-input"
                    value={digit}
                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
 
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResendOTP}
                  disabled={isResendDisabled}
                >
                  Resend OTP
                </button>
                <button type="submit" className="btn btn-primary">
                  Verify OTP
                </button>
              </div>
              <div className="mt-3 d-flex justify-content-center align-items-center">
                <p style={{ fontSize: "large" }}>
                  <span style={{ color: "black" }}>
                    OTP has been sent, Reset OTP will be sent after{" "}
                  </span>
                  <span style={{ color: "red" }}>{timer} sec</span>
                </p>
              </div>
              {message.text && (
                <p
                  style={{ color: message.type === "error" ? "red" : "green" }}
                >
                  {message.text}
                </p>
              )}
            </form>
          ) : showNewPasswordFields ? (
            <form
              className="reset-password-form"
              onSubmit={handleResetPassword}
            >
              <h2 className="text-dark mb-4">Reset Password</h2>
 
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={toggleNewPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
 
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
 
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              {message.text && (
                <p
                  style={{ color: message.type === "error" ? "red" : "green" }}
                >
                  {message.text}
                </p>
              )}
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};
 
export default DoctorLogin;
 