import React, { useState, useRef, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/AuthForms.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import doct from "../../images/logindoc.png";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
          if (response.data.success) {
            setShowVerification(true);
            setMessage({ type: "success", text: response.data.success });
          } else if (response.data.error) {
            setMessage({ type: "error", text: response.data.error });
          }
        }
      } else if (loginWithOtp) {
        const response = await BaseUrl.get(
          `/patient/login/?mobile_number=${mobileNumber}`
        );
        if (response.status === 200) {
          if (response.data.success) {
            const refreshToken = response.data.refresh;
            localStorage.setItem("refresh", refreshToken);
            setShowVerification(true);
            setMessage({ type: "success", text: response.data.success });
          } else if (response.data.error) {
            setMessage({ type: "error", text: response.data.error });
          }
        }
      } else {
        const response = await BaseUrl.post("/patient/patientlogin/", {
          mobile_number: mobileNumber,
          password: password,
        });
        if (response.status === 200) {
          const data = response.data;
          const refreshToken = data.refresh;
          localStorage.setItem("refresh", refreshToken);
          const token = data.access;
          localStorage.setItem("patient_token", token);
          localStorage.setItem("mobile_number", mobileNumber);
          setIsPatientLoggedIn(true);
          setMessage({ type: "success", text: "Login successful!" });
          history.push("/patient/home");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error;

      setMessage({ type: "error", text: errorMessage });
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await BaseUrl.get(
        `/patient/login/?mobile_number=${mobileNumber}`
      );

      if (response.status === 200 && response.data.success) {
        const refreshToken = response.data.refresh;
        localStorage.setItem("refresh", refreshToken);
        setMessage({ type: "success", text: response.data.success });
        setOtp(["", "", "", "", "", ""]);
        startTimer();
      } else if (response.data.error) {
        setMessage({ type: "error", text: response.data.error });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error,
      });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (forgotPassword) {
      // Forgot password flow
      try {
        const response = await BaseUrl.post("/patient/register/", {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });

        if (response.status === 201) {
          if (response.data.success) {
            setMessage({ type: "success", text: response.data.success });
            setShowVerification(false);
            setShowNewPasswordFields(true);
          } else if (response.data.error) {
            setMessage({ type: "error", text: response.data.error });
          }
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.error || "Invalid OTP. Please try again.",
        });
      }
    } else {
      // Regular login with OTP flow
      try {
        const response = await BaseUrl.post("/patient/login/", {
          mobile_number: mobileNumber,
          otp: enteredOtp,
        });

        if (response.status === 201) {
          if (response.data.success) {
            const refreshToken = response.data.refresh;
            localStorage.setItem("refresh", refreshToken);
            const token = response.data.access;
            localStorage.setItem("patient_token", token);
            localStorage.setItem("mobile_number", mobileNumber);
            setIsPatientLoggedIn(true);
            setMessage({ type: "success", text: response.data.success });
            history.push("/patient/home");
          } else if (response.data.error) {
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
      const response = await BaseUrl.post("/patient/forget/", {
        mobile_number: mobileNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.status === 200 || response.status === 201) {
        if (response.data.success) {
          setMessage({ type: "success", text: response.data.success });

          setTimeout(() => {
            setShowNewPasswordFields(false);
            setForgotPassword(false);
            setShowVerification(false);
            setMobileNumber("");
            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
            history.push("/patient/login");
          }, 2000);
        } else if (response.data.error) {
          setMessage({ type: "error", text: response.data.error });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error,
      });
    }
  };

  const handleChangeOtp = (index, value) => {
    if (!isNaN(value) && value !== " ") {
      const newOtp = [...otp];
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

  // const toggleNewPasswordVisibility = () => {
  //   setNewPasswordVisible(!newPasswordVisible);
  // };

  // const toggleConfirmPasswordVisibility = () => {
  //   setConfirmPasswordVisible(!confirmPasswordVisible);
  // };

  const toggleAuthMode = (isRegister) => {
    if (isRegister) {
      history.push("/patient/register");
    } else {
      history.push("/patient/login");
    }
  };

  // const handleTabSwitch = (tab) => {
  //   setActiveTab(tab);
  //   setShowVerification(false);
  // };

  return (
    <div className="container-fluid p-0">
      {/* Tabs for Login and Register */}
      <div
        style={{
          backgroundColor: "white",
          padding: "15px 0",
          borderBottom: "1px solid #ddd",
          zIndex: 2,
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
            onClick={() => {
              setForgotPassword(false);
              setShowVerification(false);
              setShowNewPasswordFields(false);
              toggleAuthMode(false);
              setActiveTab("login");
            }}
            style={{
              color: activeTab === "login" ? "orange" : "#007bff",
              cursor: "pointer",
              marginRight: "10px",
              textDecoration: activeTab === "login" ? "underline" : "none",
            }}
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
            onClick={() => {
              setForgotPassword(false);
              setShowVerification(false);
              setShowNewPasswordFields(false);
              toggleAuthMode(true);
              setActiveTab("register");
            }}
            style={{
              color: activeTab === "register" ? "orange" : "#007bff",
              cursor: "pointer",
              marginLeft: "10px",
              textDecoration: activeTab === "register" ? "underline" : "none",
            }}
          >
            Register
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div
        className="container-fluid preg-box d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Background Image */}
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
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        ></div>

        <div className="row w-100 d-flex justify-content-lg-end">
          <div className="col-md-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center form-container">
            {/* Login Form */}
            {!showVerification &&
              !forgotPassword &&
              !showNewPasswordFields &&
              activeTab === "login" && (
                <form className="login-form mb-4 mt-2" onSubmit={handleLogin}>
                  <div className="doctor-login-link">
                    <p style={{fontSize: '15px'}} className="text-link">
                      Are you a Doctor?{" "}
                      <Link to="/doctor/login">Login here</Link>
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
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                    </div>
                  </div>

                  {/* <div className="mb-3">
                    <label
                      htmlFor="mobileNumber"
                      className="form-label"
                      style={{ fontSize: "large" }}
                    >
                      Mobile Number
                    </label>
                    <PhoneInput
                      id="mobile_number"
                      name="mobile_number"
                      placeholder="Enter mobile number"
                      defaultCountry="IN" // Set default country
                      value={mobileNumber} // Bind to mobileNumber state
                      onChange={setMobileNumber} // Update state on change
                      required
                    />
                  </div> */}

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

                  <button type="submit" className="btn btn-primary w-55 mb-3">
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
              )}

            {/* Forgot Password Form */}
            {forgotPassword && !showVerification && !showNewPasswordFields && (
              <form className=" mb-4 mt-2" onSubmit={handleLogin}>
                <h2 className="text-dark mb-4">Forgot Password</h2>
                <p>
                  Enter your mobile number and we'll send you a 6-digit OTP to
                  reset your password.
                </p>
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
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </div>
                </div>

                {/* <div className="mb-3">
                  <label
                    htmlFor="mobileNumber"
                    className="form-label"
                    style={{ fontSize: "large" }}
                  >
                    Mobile Number
                  </label>
                  <PhoneInput
                    id="mobile_number"
                    name="mobile_number"
                    placeholder="Enter mobile number"
                    defaultCountry="IN" // Set default country
                    value={mobileNumber} // Bind to mobileNumber state
                    onChange={setMobileNumber} // Update state on change
                    required
                  />
                </div> */}

                <button type="submit" className="btn btn-primary w-45 mb-3">
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
            )}

            {/* OTP Verification Form */}
            {showVerification && (
              <form className="otp-form" onSubmit={handleVerifyOTP}>
                <h2 className="text-dark mb-4">OTP Verification</h2>
                <p>An OTP has been sent to your mobile number</p>
                <div className="otp-container mb-3">
                  {otp.map((digit, index) => (
                    // <input
                    //   key={index}
                    //   type="text"
                    //   maxLength="1"
                    //   className="form-control otp-input"
                    //   value={digit}
                    //   onChange={(e) =>
                    //     setOtp((prevOtp) =>
                    //       prevOtp.map((val, i) => (i === index ? e.target.value : val))
                    //     )
                    //   }
                    //   onInput={(e) =>
                    //     (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    //   }
                    // />

                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="form-control otp-input"
                      value={digit}
                      onChange={(e) => handleChangeOtp(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                      } // Only numbers allowed
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
                    <span style={{ color: "red" }}>{timer}sec</span>
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
            )}

            {/* Reset Password Form */}
            {showNewPasswordFields && (
              <form
                className="reset-password-form"
                onSubmit={handleResetPassword}
              >
                <h2 className="text-dark mb-4">Reset Password</h2>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
