
// import React, { useState, useRef, useEffect } from 'react';
// import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
// import { Link, useHistory } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../css/AuthForms.css';          
 
// const DoctorLogin = ({ setIsDoctorLoggedIn }) => {
//   const [countryCode, setCountryCode] = useState('91');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store OTP digits
//   const [message, setMessage] = useState('');
//   const [showVerification, setShowVerification] = useState(false);
//   const [timer, setTimer] = useState(60); // Timer for resend OTP button
//   const [isResendDisabled, setIsResendDisabled] = useState(true); // State to disable/enable resend OTP button
//   const history = useHistory(); // Initialize useHistory for navigation
//   const inputRefs = useRef([]); // Refs to store references to the input elements
 
//   useEffect(() => {
//     if (showVerification) {
//       setIsResendDisabled(true);
//       setTimer(60);
//       const countdown = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(countdown);
//             setIsResendDisabled(false);
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     }
//   }, [showVerification]);
 
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await BaseUrl.get(`/doctor/login/?mobile_number=${mobileNumber}`);
//       if (response.status === 200) {
//         const data = response.data;
       
//         if (data.success) {
//           setShowVerification(true); // Show OTP verification form
//           setMessage(''); // Clear any previous messages
//         } else {
//           setMessage("An error occurred. Please try again."); // Reset error message
//         }
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || "An error occurred. Please try again."); // Set error message
//     }
//   };
 
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     try {
//       const enteredOtp = otp.join(''); // Concatenate OTP digits
//       const response = await BaseUrl.post('/doctor/login/', {
//         mobile_number: mobileNumber,
//         otp: enteredOtp,
//       });
//       const token = response.data.access; // Assuming the token is returned from the server
//       localStorage.setItem('token', token); // Save token to local storage
//       localStorage.setItem('user_type', response.data.user_type); // Save user type to local storage
//       setIsDoctorLoggedIn(true); // Update doctor login state
//       setMessage('Login successful!'); // Display success message
//       switch (response.data.user_type) {
//         case 'doctor':
//           history.push('/doctor/home'); // Navigate to DoctorHome page
//           break;
//         case 'clinic':
//           history.push('/clinic/home'); // Navigate to ClinicHome page
//           break;
//         case 'reception':
//           history.push('/reception/home'); // Navigate to ReceptionHome page
//           break;
//         default:
//           break;
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || "Invalid OTP. Please try again."); // Set error message
//     }
//   };
 
//   const handleResendOTP = async () => {
//     try {
//       const response = await BaseUrl.get(`/doctor/login/?mobile_number=${mobileNumber}`);
//       if (response.status === 200) {
//         const data = response.data;
//         if (data.success) {
//           setMessage("OTP resent successfully"); // Update success message
//           setOtp(['', '', '', '', '', '']); // Clear OTP input
//           setIsResendDisabled(true); // Disable resend OTP button
//           setTimer(60); // Reset timer
//           const countdown = setInterval(() => {
//             setTimer((prevTimer) => {
//               if (prevTimer <= 1) {
//                 clearInterval(countdown);
//                 setIsResendDisabled(false);
//                 return 0;
//               }
//               return prevTimer - 1;
//             });
//           }, 1000);
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
//           <form className="login-form" onSubmit={handleLogin} style={{maxWidth: '1000px', width: '60%', paddingLeft: '180px' }}>
//             <div className="d-flex justify-content-end mb-2">
//               <p style={{ fontSize: 'large' }}>Patient's Login <Link to="/patient/login">Click here</Link></p>
//             </div>
//             <h2>Doctor Login</h2>
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
//             <button type="submit" className="btn mb-3 w-20" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }}>Login</button>
//             <p style={{ fontSize: 'large' }}>Don't have an account? <Link to="/doctor/register">Register</Link></p>
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
//               <button
//                 type="button"
//                 className="btn w-45"
//                 style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }}
//                 onClick={handleResendOTP}
//                 disabled={isResendDisabled}
//               >
//                 Resend OTP
//               </button>
//               <button type="submit" className="btn w-45" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }}>Verify OTP</button>
//             </div>
//             <div className="mt-3 d-flex justify-content-center align-items-center">
//               <p style={{ fontSize: 'large' }}>
//                 <span style={{ color: 'black' }}>OTP has been sent, Reset OTP will be sent after </span>
//                 <span style={{ color: 'red' }}>{timer}sec</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };
 
// export default DoctorLogin;

import React, { useState, useRef, useEffect } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/AuthForms.css';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'; // Import the eye icons
import {jwtDecode} from 'jwt-decode'; // For decoding JWT token
 
const DoctorLogin = ({ setIsDoctorLoggedIn }) => {
  const [countryCode, setCountryCode] = useState('91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store OTP digits
  const [message, setMessage] = useState({ type: '', text: '' }); // Message state with type and text
  const [showVerification, setShowVerification] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // State to handle Forgot Password flow
  const [timer, setTimer] = useState(60); // Timer for resend OTP button
  const [isResendDisabled, setIsResendDisabled] = useState(true); // State to disable/enable resend OTP button
  const [loginWithOtp, setLoginWithOtp] = useState(false); // State to toggle OTP login
  const [newPassword, setNewPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false); // Show new password fields after OTP verification
  const history = useHistory(); // Initialize useHistory for navigation
  const inputRefs = useRef([]); // Refs to store references to the input elements
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // For new password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // For confirm password visibility
 
  // Token validation function
  const isValidToken = (token) => token && token.split('.').length === 3;
 
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
        const response = await BaseUrl.get(`/doctor/doctorverification/?mobile_number=${mobileNumber}`);
        if (response.status === 200) {
          setShowVerification(true); // Show OTP verification form
          setMessage({ type: 'success', text: 'OTP sent to your mobile number.' });
        }
      } else if (loginWithOtp) {
        const response = await BaseUrl.get(`/doctor/login/?mobile_number=${mobileNumber}`);
        if (response.status === 200) {
          setShowVerification(true); // Show OTP verification form
          setMessage({ type: 'success', text: 'OTP sent to your mobile number.' });
        }
      } else {
        // Password login flow
        const response = await BaseUrl.post('/doctor/doctorlogin/', {
          mobile_number: mobileNumber,
          password: password,
        });
 
        if (response.status === 201) {
          const token = response.data.access;
          const userType = response.data.user_type; // Capture user_type from response
 
          // Validate and decode token
          if (isValidToken(token)) {
            localStorage.setItem('token', token); // Save token to local storage
            localStorage.setItem('user_type', userType); // Save user_type to local storage
 
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken); // For debugging
 
            setIsDoctorLoggedIn(true); // Update doctor login state
            setMessage({ type: 'success', text: 'Login successful!' }); // Display success message
 
            // Redirect based on user_type
            if (userType === 'doctor') {
              history.push('/doctor/home');
            } else if (userType === 'clinic') {
              history.push('/clinic/home');
            } else if (userType === 'reception') {
              history.push('/reception/home');
            } else {
              setMessage({ type: 'error', text: 'Unknown user type. Please contact support.' });
            }
          } else {
            setMessage({ type: 'error', text: 'Invalid token format. Please try again.' });
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };
 
  // Handle Resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await BaseUrl.get(`/doctor/login/?mobile_number=${mobileNumber}`);
      if (response.status === 200) {
        setMessage({ type: 'success', text: 'OTP resent successfully' });
        setOtp(['', '', '', '', '', '']); // Clear OTP input fields
        startTimer(); // Restart the timer and disable the button again
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'An error occurred. Please try again.' });
    }
  };
 
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join(''); // Concatenate OTP digits
 
    if (forgotPassword) {
      try {
        const response = await BaseUrl.post('/doctor/doctorverification/', {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });
        if (response.status === 200) {
          setMessage({ type: 'success', text: 'OTP verified! Please enter a new password.' });
          setShowVerification(false); // Hide OTP verification
          setShowNewPasswordFields(true); // Show new password fields
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.error || 'Invalid OTP. Please try again.' });
      }
    } else {
      try {
        const response = await BaseUrl.post('/doctor/login/', {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });
        if (response.status === 201) {
          const token = response.data.access;
          const userType = response.data.user_type; // Capture user_type from response
 
          if (isValidToken(token)) {
            localStorage.setItem('doctor_token', token); // Save token to local storage
            localStorage.setItem('user_type', userType); // Save user_type to local storage
 
            setIsDoctorLoggedIn(true); // Update doctor login state
            setMessage({ type: 'success', text: 'Login successful!' });
 
            // Redirect based on user_type
            if (userType === 'doctor') {
              history.push('/doctor/home');
            } else if (userType === 'clinic') {
              history.push('/clinic/home');
            } else if (userType === 'reception') {
              history.push('/reception/home');
            } else {
              setMessage({ type: 'error', text: 'Unknown user type. Please contact support.' });
            }
          } else {
            setMessage({ type: 'error', text: 'Invalid token received.' });
          }
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.error || 'Invalid OTP. Please try again.' });
      }
    }
  };
 
  const handleResetPassword = async (e) => {
    e.preventDefault();
 
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
 
    try {
      const response = await BaseUrl.post('/doctor/forgetpassword/', {
        mobile_number: mobileNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
 
      if (response.status === 201 || response.status === 200) {
        setMessage({ type: 'success', text: response.data.success || 'Password reset successfully! Please login with your new password.' });
        setTimeout(() => {
          history.push('/doctor/login');
        }, 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'An error occurred. Please try again.' });
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
      history.push('/doctor/register');
    } else {
      history.push('/doctor/login');
    }
  };
 
  return (
    <div className="container-fluid bg-container d-flex justify-content-center align-items-center">
      <div className="row w-100 d-flex justify-content-lg-end">
        <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container">
          <div className="auth-toggle mb-4">
            <span onClick={() => toggleAuthMode(false)} className="auth-link active">
              Login
            </span>
            <span className="divider">|</span>
            <span onClick={() => toggleAuthMode(true)} className="auth-link">
              Register
            </span>
          </div>
 
          {!showVerification && !forgotPassword && !showNewPasswordFields ? (
            <form className="login-form mb-4" onSubmit={handleLogin}>
              <div className="doctor-login-link">
                <p style={{ fontSize: 'large' }}>
                  Are you a Patient? <Link to="/patient/login">Login here</Link>
                </p>
              </div>
              <h2 className="text-dark mb-4">Doctor Login</h2>
              <div className="mb-3">
                <label htmlFor="mobileNumber" className="form-label" style={{ fontSize: 'large' }}>
                  Mobile Number
                </label>
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
 
              {!loginWithOtp && (
                <div className="mb-3">
                  <label htmlFor="password" className="form-label" style={{ fontSize: 'large' }}>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!loginWithOtp}
                    />
                    <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
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
 
                <button type="buttons" className="btn btn-link p-0" onClick={() => setForgotPassword(true)}>
                  <b>Forgot Password?</b>
                </button>
              </div>
 
              <button type="submit" className="btn btn-primary w-25 mb-3">
                {loginWithOtp ? 'SEND OTP' : 'LOGIN'}
              </button>
 
              {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>
              )}
            </form>
          ) : forgotPassword && !showVerification && !showNewPasswordFields ? (
            <form className="forgot-password-form mb-4" onSubmit={handleLogin}>
              <h2 className="text-dark mb-4">Forgot Password</h2>
              <p>Enter your mobile number and we'll send you a 6-digit OTP to reset your password</p>
              <div className="mb-3">
                <b>
                  <label htmlFor="mobileNumber" className="form-label" style={{ fontSize: 'large' }}>
                    Enter your mobile number
                  </label>
                </b>
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
              <button type="submit" className="btn btn-primary w-25 mb-3">
                SEND OTP
              </button>
              <button
                type="buttons"
                className="btn d-flex align-items-center justify-content-start"
                onClick={() => setForgotPassword(false)}
              >
                <FaArrowLeft className="me-2" />
                Back to Login
              </button>
              {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>
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
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="buttons"
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
                <p style={{ fontSize: 'large' }}>
                  <span style={{ color: 'black' }}>OTP has been sent, Reset OTP will be sent after </span>
                  <span style={{ color: 'red' }}>{timer}sec</span>
                </p>
              </div>
              {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>
              )}
            </form>
          ) : showNewPasswordFields ? (
            <form className="reset-password-form" onSubmit={handleResetPassword}>
              <h2 className="text-dark mb-4">Reset Password</h2>
 
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={newPasswordVisible ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span className="input-group-text" onClick={toggleNewPasswordVisibility} style={{ cursor: 'pointer' }}>
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
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span className="input-group-text" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
 
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>
              )}
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};
 
export default DoctorLogin;