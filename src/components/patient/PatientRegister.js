import React, { useState, useRef, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/AuthForms.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PatientRegister = () => {
  const [countryCode, setCountryCode] = useState("91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showVerification, setShowVerification] = useState(false);
  const history = useHistory();
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await BaseUrl.get(
        `/patient/patientregister/?mobile_number=${mobileNumber}&password=${password}`
      );
      if (response.status === 200) {
        setMessage({ type: "", text: "" });
        setShowVerification(true);
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
    try {
      const enteredOtp = otp.join("");
      const response = await BaseUrl.post("/patient/patientregister/", {
        mobile_number: mobileNumber,
        otp: enteredOtp,
      });

      const successMessage =
        response.data.message || "Registration successful!";
      setMessage({ type: "success", text: successMessage });

      const token = response.data.access;
      localStorage.setItem("token", token);

      setTimeout(() => {
        history.push("/patient/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Invalid OTP. Please try again.",
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await BaseUrl.get(
        `/patient/patientregister/?mobile_number=${mobileNumber}&password=${password}`
      );
      if (response.status === 200) {
        setMessage("OTP resent successfully");
        setOtp(["", "", "", "", "", ""]);
        startTimer();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
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

  const toggleAuthMode = (isRegister) => {
    if (isRegister) {
      history.push("/patient/register");
    } else {
      history.push("/patient/login");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container-fluid preg-box d-flex justify-content-center align-items-center">
      <div className="row w-100 d-flex justify-content-lg-end">
        <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container">
          <div className="auth-toggle">
            <span onClick={() => toggleAuthMode(false)} className="auth-link">
              Login
            </span>
            <span className="divider">|</span>
            <span
              onClick={() => toggleAuthMode(true)}
              className="auth-link active"
            >
              Register
            </span>
          </div>
          {!showVerification ? (
            <form className="login-form mb-4" onSubmit={handleRegister}>
              <div className="doctor-login-link">
                <p className="text-link">
                  Are you a Doctor?{" "}
                  <Link to="/doctor/register">Register here</Link>
                </p>
              </div>
              <h2 className="text-dark mb-4">Patient Register</h2>
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
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ fontSize: "large" }}
                >
                  Create Password
                </label>
                <div className="input-group">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="termsCheck"
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    By signing up, I agree to <a href="#">terms & conditions</a>
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-45 mb-3">
                SEND OTP
              </button>

              {message.text && (
                <p
                  style={{ color: message.type === "error" ? "red" : "green" }}
                >
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
