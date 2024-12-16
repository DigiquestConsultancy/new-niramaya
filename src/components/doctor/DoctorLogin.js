import React, { useState, useRef, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import doct from "../../images/logindoc.png";
 
const DoctorLogin = ({ setIsDoctorLoggedIn }) => {
  const [countryCode, setCountryCode] = useState("91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showVerification, setShowVerification] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [createNewPasswordModal, setCreateNewPasswordModal] = useState(false);
  const history = useHistory();
  const inputRefs = useRef([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
 
  const isValidToken = (token) => token && token.split(".").length === 3;
 
  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(60);
 
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
 
  useEffect(() => {
    if (showVerification) {
      startTimer();
    }
  }, [showVerification]);
 
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let response;
 
  //     if (forgotPassword) {
  //       response = await BaseUrl.get(
  //         `/doctor/userverification/?mobile_number=${mobileNumber}`
  //       );
  //       if (response.status === 200 && response.data.success) {
  //         setShowVerification(true);
  //         setMessage({ type: "success", text: response.data.success });
  //       } else if (response.data.error) {
  //         setMessage({ type: "error", text: response.data.error });
  //       }
  //     } else if (loginWithOtp) {
  //       response = await BaseUrl.get(
  //         `/doctor/login/?mobile_number=${mobileNumber}`
  //       );
  //       if (response.status === 200 && response.data.success) {
  //         setShowVerification(true);
  //         setMessage({ type: "success", text: response.data.success });
  //       } else if (response.data.error) {
  //         setMessage({ type: "error", text: response.data.error });
  //       }
  //     } else {
  //       response = await BaseUrl.post("/doctor/doctorlogin/", {
  //         mobile_number: mobileNumber,
  //         password: password,
  //       });
 
  //       if (response.status === 200 && response.data.success) {
  //         const token = response.data.access;
  //         const userType = response.data.user_type;
  //         const isReset = response.data.is_reset;
 
  //         if (isValidToken(token)) {
  //           localStorage.setItem("token", token);
  //           localStorage.setItem("user_type", userType);
  //           setIsDoctorLoggedIn(true);
  //           setMessage({ type: "success", text: response.data.success });
 
  //           if (
  //             (userType === "clinic" || userType === "reception") &&
  //             !isReset
  //           ) {
  //             setCreateNewPasswordModal(true);
  //             return;
  //           }
 
  //           if (userType === "doctor") {
  //             history.push("/doctor/home");
  //           } else if (userType === "clinic") {
  //             history.push("/clinic/home");
  //           } else if (userType === "reception") {
  //             history.push("/reception/home");
  //           }
  //         }
  //       } else if (response.data.error) {
  //         setMessage({ type: "error", text: response.data.error });
  //       }
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.error || "";
  //     setMessage({ type: "error", text: errorMessage });
  //   }
  // };



  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await BaseUrl.post("/doctor/doctorlogin/", {
  //       mobile_number: mobileNumber,
  //       password: password,
  //     });
  
  //     if (response.status === 200 && response.data.success) {
  //       const { access, user_type, is_reset } = response.data;
  
  //       if (isValidToken(access)) {
  //         localStorage.setItem("token", access);
  //         localStorage.setItem("user_type", user_type);
  
  //         // Check if user needs to reset password and is of type clinic or reception
  //         if ((user_type === "clinic" || user_type === "reception") && !is_reset) {
  //           setCreateNewPasswordModal(true);  // Show modal or redirect to password creation page
  //           return;  // Stop further processing
  //         }
  
  //         setIsDoctorLoggedIn(true);
  //         setMessage({ type: "success", text: response.data.success });
  
  //         routeUser(user_type);  // Function to handle user routing
  //       }
  //     } else if (response.data.error) {
  //       setMessage({ type: "error", text: response.data.error });
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.error || "";
  //     setMessage({ type: "error", text: errorMessage });
  //   }
  // };
  

  // const routeUser = (userType) => {
  //   switch(userType) {
  //     case 'doctor':
  //       history.push("/doctor/home");
  //       break;
  //     case 'clinic':
  //       history.push("/clinic/home");
  //       break;
  //     case 'reception':
  //       history.push("/reception/home");
  //       break;
  //     default:
  //       // Handle unknown user type or show an error message
  //       setMessage({ type: "error", text: "Invalid user type" });
  //   }
  // }



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response;
  
      if (forgotPassword) {
        response = await BaseUrl.get(
          `/doctor/userverification/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200 && response.data.success) {
          setShowVerification(true); 
          setMessage({ type: "success", text: response.data.success });
        } else if (response.data.error) {
          setMessage({ type: "error", text: response.data.error });
        }
        return;
      }
  
      if (loginWithOtp) {
        response = await BaseUrl.get(
          `/doctor/login/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200 && response.data.success) {
          setShowVerification(true);
          setMessage({ type: "success", text: response.data.success });
        } else if (response.data.error) {
          setMessage({ type: "error", text: response.data.error });
        }
        return;
      }
  
      response = await BaseUrl.post("/doctor/doctorlogin/", {
        mobile_number: mobileNumber,
        password: password,
      });
  
      if (response.status === 200 && response.data.success) {
        const { access, user_type, is_reset } = response.data;
  
        if (isValidToken(access)) {
          localStorage.setItem("token", access);
          localStorage.setItem("user_type", user_type);
         
  
          if ((user_type === "clinic" || user_type === "reception") && !is_reset) {
            setCreateNewPasswordModal(true);
            return;
          }

          setIsDoctorLoggedIn(true); 
          setMessage({ type: "success", text: response.data.success });
          routeUser(user_type);
          
        }
      } else if (response.data.error) {
        setMessage({ type: "error", text: response.data.error });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred.";
      setMessage({ type: "error", text: errorMessage });
    }
  };
  
  const routeUser = (userType) => {
    switch (userType) {
      case "doctor":
        history.push("/doctor/home");
        break;
      case "clinic":
        history.push("/clinic/home");
        break;
      case "reception":
        history.push("/reception/home");
        break;
      default:
        setMessage({ type: "error", text: "Invalid user type." });
    }
  };
  
 
  const handleResendOTP = async () => {
    try {
      const response = await BaseUrl.get(
        `/doctor/login/?mobile_number=${mobileNumber}`
      );
      if (response.status === 200 && response.data.success) {
        setMessage({ type: "success", text: response.data.success });
        setOtp(["", "", "", "", "", ""]);
        startTimer();
      } else if (response.data.error) {
        setMessage({ type: "error", text: response.data.error });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage) {
        setMessage({ type: "error", text: errorMessage });
      }
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
            text: response.data.success,
          });
          setShowVerification(false);
          setShowNewPasswordFields(true);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.error,
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
            setMessage({
              type: "success",
              text: response.data.success,
            });
 
            if (userType === "doctor") {
              history.push("/doctor/home");
            } else if (userType === "clinic") {
              history.push("/clinic/home");
            } else if (userType === "reception") {
              history.push("/reception/home");
            } else {
              setMessage({
                type: "error",
                text: response.data.error,
              });
            }
          } else {
            setMessage({ type: "error", text: response.data.error });
          }
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.error,
        });
      }
    }
  };
 
  const handleResetPassword = async (e) => {
    e.preventDefault();
 
    try {
      const response = await BaseUrl.post("/doctor/forgetpassword/", {
        mobile_number: mobileNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
 
      if (response.status === 201 || response.status === 200) {
        setMessage({
          type: "success",
          text: response.data.success,
        });
 
        setTimeout(() => {
          setShowNewPasswordFields(false);
          setForgotPassword(false);
          setShowVerification(false);
          setCreateNewPasswordModal(false);
          setMobileNumber("");
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }, 1000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error,
      });
    }
  };
 
  const handleChangePassword = async (e) => {
    e.preventDefault();
 
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
          text: response.data.success,
        });
        setCreateNewPasswordModal(false);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error,
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
    <div className="container-fluid p-0">
      {/* Tabs */}
      <div
        style={{
          backgroundColor: "white",
          padding: "15px 0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
 
<span
        onClick={() => toggleAuthMode(false)}
        style={{
          color:
            (!loginWithOtp && !showVerification) || forgotPassword
              ? "orange" // Active tab color
              : "#007bff", // Inactive tab color
          cursor: "pointer",
          marginRight: "10px",
        }}
        className={`auth-link ${
          (!loginWithOtp && !showVerification) || forgotPassword
            ? "active"
            : ""
        }`}
      >
        Login
      </span>
 
      {/* Separator */}
      <span
        style={{
          color: "#000",
          margin: "0 10px",
        }}
      >
        |
      </span>
 
      {/* Register Tab */}
      <span
        onClick={() => toggleAuthMode(true)}
        style={{
          color:
            !forgotPassword && showVerification
              ? "orange" // Active tab color
              : "#007bff", // Inactive tab color
          cursor: "pointer",
          marginLeft: "10px",
        }}
        className={`auth-link ${
          !forgotPassword && showVerification ? "active" : ""
        }`}
      >
        Register
      </span>
          {/* <span
            onClick={() => toggleAuthMode(false)}
            style={{
              color: "#007bff",
              cursor: "pointer",
              marginRight: "10px",
            }}
            className={`auth-link ${
              (!loginWithOtp && !showVerification) || forgotPassword
                ? "active"
                : ""
            }`}
          >
            Login
          </span>
 
     
          <span
            style={{
              color: "#000",
              margin: "0 10px",
            }}
          >
            |
          </span>
 
 
          <span
            onClick={() => toggleAuthMode(true)}
            style={{
              color: "orange",
              cursor: "pointer",
              marginLeft: "10px",
            }}
            className={`auth-link ${
              !forgotPassword && showVerification ? "active" : ""
            }`}
          >
            Register
          </span> */}
        </div>
      </div>
 
      <div className="container-fluid login-box d-flex justify-content-center align-items-center">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${doct})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -1,
          }}
        ></div>
        <div className="row w-100 d-flex justify-content-lg-end">
          <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container mt-4">
         
 
            {createNewPasswordModal ? (
              <form onSubmit={handleChangePassword}>
                <h2 className="text-dark mb-4 mt-2">Create New Password</h2>
 
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
 
                <button type="submit" className="btn mb-3 btn-primary">
                  Create
                </button>
                {message.text && (
                  <p
                    style={{
                      color: message.type === "error" ? "red" : "green",
                    }}
                  >
                    {message.text}
                  </p>
                )}
              </form>
            ) : !showVerification &&
              !forgotPassword &&
              !showNewPasswordFields ? (
              <form className="login-form log mb-4 mt-2" onSubmit={handleLogin}>
                <div className="doctor-login-link">
                  <p className="text-link">
                    Are you a Patient?{" "}
                    <Link to="/patient/login">Login here</Link>
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
 
                <div className="d-flex justify-content-between align-items-center mb-4 ">
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
                    style={{
                      color: message.type === "error" ? "red" : "green",
                    }}
                  >
                    {message.text}
                  </p>
                )}
              </form>
            ) : forgotPassword &&
              !showVerification &&
              !showNewPasswordFields ? (
              <form
                className="mb-4 mt-2"
                onSubmit={handleLogin}
              >
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
                    style={{
                      color: message.type === "error" ? "red" : "green",
                    }}
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
                    style={{
                      color: message.type === "error" ? "red" : "green",
                    }}
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
                    style={{
                      color: message.type === "error" ? "red" : "green",
                    }}
                  >
                    {message.text}
                  </p>
                )}
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DoctorLogin;