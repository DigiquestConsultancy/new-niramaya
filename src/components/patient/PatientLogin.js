import React, { useState, useRef, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/AuthForms.css";
import { FaEye, FaEyeSlash, FaArrowLeft, FaThumbsUp } from "react-icons/fa";

const PatientLogin = ({ setIsPatientLoggedIn }) => {
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
  const history = useHistory();
  const inputRefs = useRef([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (forgotPassword) {
        const response = await BaseUrl.get(
          `/patient/register/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200) {
          setShowVerification(true);
          setMessage({
            type: "success",
            text: "OTP sent to your mobile number.",
          });
        }
      } else if (loginWithOtp) {
        const response = await BaseUrl.get(
          `/patient/login/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200) {
          setShowVerification(true);
          setMessage({
            type: "success",
            text: "OTP sent to your mobile number.",
          });
        }
      } else {
        const response = await BaseUrl.post("/patient/patientlogin/", {
          mobile_number: mobileNumber,
          password: password,
        });
        if (response.status === 200) {
          const data = response.data;
          const token = data.access;
          localStorage.setItem("patient_token", token);
          localStorage.setItem("mobile_number", mobileNumber);
          setIsPatientLoggedIn(true);
          setMessage({ type: "success", text: "Login successful!" });
          history.push("/patient/home");
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
        `/patient/login/?mobile_number=${mobileNumber}`
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
        const response = await BaseUrl.post("/patient/register/", {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });
        if (response.status === 201) {
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
        const response = await BaseUrl.post("/patient/login/", {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });
        if (response.status === 201) {
          const token = response.data.access;
          localStorage.setItem("patient_token", token);
          localStorage.setItem("mobile_number", mobileNumber);
          setIsPatientLoggedIn(true);
          setMessage({ type: "success", text: "Login successful!" });
          history.push("/patient/home");
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
      const response = await BaseUrl.post("/patient/forget/", {
        mobile_number: mobileNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.status === 201 || response.status === 200) {
        setMessage({
          type: "success",
          text:
            response.data.success ||
            "Password reset successfully! Please login with your new password.",
        });
        setTimeout(() => {
          history.push("/patient/login");
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
      history.push("/patient/register");
    } else {
      history.push("/patient/login");
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setShowVerification(false);
  };

  return (
    <div className="container-fluid plogin-box d-flex justify-content-center align-items-center">
      <div className="row w-100 d-flex justify-content-lg-end">
        <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container">
          <div className="auth-toggle mb-4">
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

          {!showVerification && !forgotPassword && !showNewPasswordFields ? (
            <form className="login-form mb-4" onSubmit={handleLogin}>
              <div className="doctor-login-link">
                <p className="text-link">
                  Are you a Doctor? <Link to="/doctor/login">Login here</Link>
                </p>
              </div>

              <h2 className="text-dark mb-4">Patient Login</h2>
              <div className="mb-3">
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
                  type="buttons"
                  className="btn btn-link p-0"
                  onClick={() => setForgotPassword(true)}
                >
                  <b>Forgot Password?</b>
                </button>
              </div>

              <button type="submit" className="btn btn-primary w-55 mb-3">
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
                Enter your mobile number and we'll send you 6-digit OTP to reset
                your password
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
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-45 mb-3">
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
                <p style={{ fontSize: "large" }}>
                  <span style={{ color: "black" }}>
                    OTP has been sent, Reset OTP will be sent after{" "}
                  </span>
                  <span style={{ color: "red" }}>{timer}sec</span>
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
export default PatientLogin;
