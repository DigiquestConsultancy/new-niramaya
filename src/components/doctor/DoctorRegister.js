// import React, { useState, useRef } from 'react';
// import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
// import { Link, useHistory } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../css/AuthForms.css';

// const DoctorRegister = () => {
//   const [countryCode, setCountryCode] = useState('91');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store OTP digits
//   const [message, setMessage] = useState('');
//   const [showVerification, setShowVerification] = useState(false);
//   const history = useHistory(); // Initialize useHistory for navigation
//   const inputRefs = useRef([]); // Refs to store references to the input elements

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await BaseUrl.get(`/doctor/register/?mobile_number=${mobileNumber}`);
//       if (response.status === 200) {
//         setMessage('');
//         setShowVerification(true);
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || "An error occurred. Please try again."); // Set error message
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     try {
//       const enteredOtp = otp.join(''); // Concatenate OTP digits
//       const response = await BaseUrl.post('/doctor/register/', {
//         mobile_number: mobileNumber,
//         otp: enteredOtp,
//       });
//       const token = response.data.access; // Assuming the token is returned from the server
//       localStorage.setItem('token', token); // Save token to local storage
//       setMessage('Registration successful!'); // Display success message
//       history.push('/doctor/login'); // Navigate to DoctorLogin page
//     } catch (error) {
//       setMessage(error.response?.data?.error || "Invalid OTP. Please try again."); // Set error message
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       const response = await BaseUrl.get(`/doctor/register/?mobile_number=${mobileNumber}`);
//       if (response.status === 200) {
//         const data = response.data;
//         if (data.success) {
//           setMessage("OTP resent successfully"); // Update success message
//           setOtp(['', '', '', '', '', '']); // Clear OTP input
//         }
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || "An error occurred. Please try again."); // Set error message
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

//   return (
//     <div className="container mt-5">
//       {!showVerification ? (
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//           <form className="login-form" onSubmit={handleRegister} style={{  maxWidth: '1000px', width: '60%', paddingLeft: '180px' }}>
//             <div className="d-flex justify-content-end mb-2">
//               <p style={{ fontSize: 'large' }}>Patient  Register <Link to="/patient/register">Click here</Link></p>
//             </div>
//             <h2>Doctor Register</h2>
//             <div className="mb-3">
//               <label htmlFor="mobileNumber" className="form-label" style={{ fontSize: 'large' }}>Mobile Number:</label>
//               <div className="input-group">
//                 <select
//                   className="form-select"
//                   style={{ maxWidth: '120px' }}
//                   value={countryCode}
//                   onChange={(e) => setCountryCode(e.target.value)}
//                 >
//                   <option value="91">+91 (India)</option>
//                   <option value="1">+1 (USA)</option>
//                   <option value="44">+44 (UK)</option>
//                   {/* Add more country codes as needed */}
//                 </select>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter mobile number"
//                   style={{ maxWidth: '250px' }}
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//             <button type="submit" className="btn mb-3 w-20" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }}>Register</button>
//             <p style={{ fontSize: 'large' }}>Already have an account? <Link to="/doctor/login">Login</Link></p>
//             {message && <p className="text-danger">{message}</p>}
//           </form>
//         </div>
//       ) : (
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//           <form className="otp-form" onSubmit={handleVerifyOTP} style={{ maxWidth: '500px', width: '100%' }}>
//             <h2>OTP Verification</h2>
//             <p>An OTP has been sent to your mobile number</p>
//             <div className="otp-container mb-3">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength="1"
//                   className="form-control otp-input"
//                   value={digit}
//                   onChange={(e) => handleChangeOtp(index, e.target.value)}
//                   ref={el => (inputRefs.current[index] = el)} // Store the reference to the input element
//                 />
//               ))}
//             </div>
//             <div className="d-flex justify-content-between">
//               <button type="button" className="btn btn-primary w-45" onClick={handleResendOTP}>Resend OTP</button>
//               <button type="submit" className="btn btn-primary w-45">Verify OTP</button>
//             </div>
//             {message && <p className="text-danger">{message}</p>}
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorRegister;



// import React, { useState, useRef, useEffect } from 'react';
// import BaseUrl from '../../api/BaseUrl';
// import { Link, useHistory } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../css/AuthForms.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons
 
// const DoctorRegister = () => {
//   const [countryCode, setCountryCode] = useState('91');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [message, setMessage] = useState({ type: '', text: '' }); // Updated message state
//   // const [message, setMessage] = useState('');
//   const [showVerification, setShowVerification] = useState(false);
//   const history = useHistory(); // For navigation
//   const inputRefs = useRef([]);
//   const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
//   const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially, disable the Resend OTP button  
//   const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
 
//   // Timer function to handle OTP resend
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
 
 
//     const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await BaseUrl.get(`/doctor/register/?mobile_number=${mobileNumber}&password=${password}`);
//       if (response.status === 200) {
//         setMessage({ type: '', text: '' });
//         setShowVerification(true);
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: error.response?.data?.error || "An error occurred. Please try again." });
//     }
//   };
 
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     try {
//       const enteredOtp = otp.join('');
//       const response = await BaseUrl.post('/doctor/register/', {
//         mobile_number: mobileNumber,
//         otp: enteredOtp,
//         password
//       });
 
//       if (response.status === 200 || response.status === 201) {
//         const successMessage = response.data.message || 'Registration successful!';
//         setMessage({ type: 'success', text: successMessage });
 
//         const token = response.data.access;
//         localStorage.setItem('token', token);
 
//         // Redirect to login after a short delay (2 seconds)
//         setTimeout(() => {
//           history.push('/doctor/login');
//         }, 2000);
//       } else {
//         // If the status is not 200 or 201, handle the case as an error
//         setMessage({ type: 'error', text: "Unexpected response from the server." });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: error.response?.data?.error || "Invalid OTP. Please try again." });
//     }
//   };
 
 
//   const handleResendOTP = async () => {
//     try {
//       const response = await BaseUrl.get(`/doctor/register/?mobile_number=${mobileNumber}&password=${password}`);
//       if (response.status === 200) {
//         setMessage("OTP resent successfully");
//         setOtp(['', '', '', '', '', '']); // Clear OTP input fields
//         startTimer(); // Restart the timer and disable the button again
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || "An error occurred. Please try again.");
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
 
//   // This function will handle redirection to the respective route
//   const toggleAuthMode = (isRegister) => {
//     if (isRegister) {
//       history.push('/doctor/register');
//     } else {
//       history.push('/doctor/login');
//     }
//   };
 
//   // Function to toggle password visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   }
 
 
//   return (
//     <div className="container-fluid bg-container d-flex justify-content-center align-items-center">
//       <div className="row w-100 d-flex justify-content-lg-end">
//         <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container">
//           {/* Toggle Login/Register Tabs */}
//           <div className="auth-toggle">
//             <span
//               onClick={() => toggleAuthMode(false)} // Redirect to login
//               className='auth-link'
//             >
//               Login
//             </span>
//             <span className="divider">|</span>
//             <span
//               onClick={() => toggleAuthMode(true)} // Redirect to register
//               className='auth-link active'
//             >
//               Register
//             </span>
//           </div>
//           {!showVerification ? (
//             <form className="login-form mb-4" onSubmit={handleRegister}>
//               {/* <p style={{ fontSize: 'large' }}>Are you a Doctor? <Link to="/doctor/register">Register here</Link></p> */}
//               <div className="doctor-login-link">
//                 <p style={{ fontSize: 'large' }}>
//                   Are you a Patient? <Link to="/patient/register">Register here</Link>
//                 </p>
//               </div>
//               <h2 className="text-dark mb-4">Doctor Register</h2>
//               <div className="mb-3">
//                 <label htmlFor="mobileNumber" className="form-label" style={{ fontSize: 'large' }}>Mobile Number</label>
//                 <div className="input-group">
//                   <select
//                     className="form-select"
//                     style={{ maxWidth: '120px' }}
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
//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label" style={{ fontSize: 'large' }}>Create Password</label>
//                 <div className="input-group">
//                   <input
//                     type={passwordVisible ? 'text' : 'password'} // Change the input type based on visibility state
//                     className="form-control"
//                     placeholder="Create Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
//                     {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle between eye and eye slash icons */}
//                   </span>
//                 </div>
//               </div>
 
//               <div className="d-flex justify-content-between align-items-center mb-4">
//               <div className="form-check">
//                 <input className="form-check-input" type="checkbox" value="" id="termsCheck" />
//                 <label className="form-check-label" htmlFor="termsCheck">
//                   By signing up, I agree to <a href="#">terms & conditions</a>
//                 </label>
//               </div></div>
//               <button type="submit" className="btn btn-primary w-45 mb-3">SEND OTP</button>
 
//               {message.text && (
//                 <p style={{ color: message.type === 'error' ? 'red' : 'green'}}>
//                   {message.text}
//                 </p>
//               )}
           
//             </form>
//           ) : (
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
//                     ref={el => (inputRefs.current[index] = el)}
//                   />
//                 ))}
//               </div>
//               <div className="d-flex justify-content-between">
//                 <button type="buttons" className="btn btn-secondary" onClick={handleResendOTP} disabled={isResendDisabled}>
//                   Resend OTP
//                 </button>
//                 <button type="submit" className="btn btn-primary">Verify OTP</button>
//               </div>
//               <div className="mt-3 d-flex justify-content-center align-items-center">
//                 <p style={{ fontSize: 'large' }}>
//                   <span style={{ color: 'black' }}>OTP has been sent, Reset OTP will be sent after </span>
//                   <span style={{ color: 'red' }}>{timer} sec</span> {/* Show the countdown */}
//                 </p>
//               </div>
//               {message.text && (
//                 <p style={{ color: message.type === 'error' ? 'red' : 'green'}}>
//                   {message.text}
//                 </p>
//               )}
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default DoctorRegister;
 





import React, { useState, useRef, useEffect } from 'react';
import BaseUrl from '../../api/BaseUrl';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../css/AuthForms.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons
 
const DoctorRegister = () => {
  const [countryCode, setCountryCode] = useState('91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState({ type: '', text: '' }); // Updated message state
  // const [message, setMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const history = useHistory(); // For navigation
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially, disable the Resend OTP button  
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
 
  // Timer function to handle OTP resend
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
 
 
    const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await BaseUrl.get(`/doctor/register/?mobile_number=${mobileNumber}&password=${password}`);
      if (response.status === 200) {
        setMessage({ type: '', text: '' });
        setShowVerification(true);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || "An error occurred. Please try again." });
    }
  };
 
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const enteredOtp = otp.join('');
      const response = await BaseUrl.post('/doctor/register/', {
        mobile_number: mobileNumber,
        otp: enteredOtp,
        password
      });
 
      if (response.status === 200 || response.status === 201) {
        const successMessage = response.data.message || 'Registration successful!';
        setMessage({ type: 'success', text: successMessage });
 
        const token = response.data.access;
        localStorage.setItem('token', token);
 
        // Redirect to login after a short delay (2 seconds)
        setTimeout(() => {
          history.push('/doctor/login');
        }, 2000);
      } else {
        // If the status is not 200 or 201, handle the case as an error
        setMessage({ type: 'error', text: "Unexpected response from the server." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || "Invalid OTP. Please try again." });
    }
  };
 
 
  const handleResendOTP = async () => {
    try {
      const response = await BaseUrl.get(`/doctor/register/?mobile_number=${mobileNumber}&password=${password}`);
      if (response.status === 200) {
        setMessage("OTP resent successfully");
        setOtp(['', '', '', '', '', '']); // Clear OTP input fields
        startTimer(); // Restart the timer and disable the button again
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };
 
 
  const handleChangeOtp = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
 
  // This function will handle redirection to the respective route
  const toggleAuthMode = (isRegister) => {
    if (isRegister) {
      history.push('/doctor/register');
    } else {
      history.push('/doctor/login');
    }
  };
 
  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }
 
 
  return (
    <div className="container-fluid reg-box d-flex justify-content-center align-items-center">
      <div className="row w-100 d-flex justify-content-lg-end">
        <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container">
          {/* Toggle Login/Register Tabs */}
          <div className="auth-toggle">
            <span
              onClick={() => toggleAuthMode(false)} // Redirect to login
              className='auth-link'
            >
              Login
            </span>
            <span className="divider">|</span>
            <span
              onClick={() => toggleAuthMode(true)} // Redirect to register
              className='auth-link active'
            >
              Register
            </span>
          </div>
          {!showVerification ? (
            <form className="login-form mb-4" onSubmit={handleRegister}>
              <div className="doctor-login-link">
                <p className='text-link'>
                  Are you a Patient? <Link to="/patient/register">Register here</Link>
                </p>
              </div>
              <h2 className="text-dark mb-4">Doctor Register</h2>
              <div className="mb-3">
                <label htmlFor="mobileNumber" className="form-label" style={{ fontSize: 'large' }}>Mobile Number</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    style={{ maxWidth: '120px' }}
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
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label" style={{ fontSize: 'large' }}>Create Password</label>
                <div className="input-group">
                  <input
                    type={passwordVisible ? 'text' : 'password'} // Change the input type based on visibility state
                    className="form-control"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle between eye and eye slash icons */}
                  </span>
                </div>
              </div>
 
              <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="termsCheck" />
                <label className="form-check-label" htmlFor="termsCheck">
                  By signing up, I agree to <a href="#">terms & conditions</a>
                </label>
              </div></div>
              <button type="submit" className="btn btn-primary w-45 mb-3">SEND OTP</button>
 
              {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green'}}>
                  {message.text}
                </p>
              )}
           
            </form>
          ) : (
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
                    ref={el => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <div className="d-flex justify-content-between">
                <button type="buttons" className="btn btn-secondary" onClick={handleResendOTP} disabled={isResendDisabled}>
                  Resend OTP
                </button>
                <button type="submit" className="btn btn-primary">Verify OTP</button>
              </div>
              <div className="mt-3 d-flex justify-content-center align-items-center">
                <p style={{ fontSize: 'large' }}>
                  <span style={{ color: 'black' }}>OTP has been sent, Reset OTP will be sent after </span>
                  <span style={{ color: 'red' }}>{timer} sec</span> {/* Show the countdown */}
                </p>
              </div>
              {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green'}}>
                  {message.text}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default DoctorRegister;