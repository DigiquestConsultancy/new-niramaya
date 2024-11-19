import React, { useState, useEffect, useRef } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import Loader from "react-js-loader";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const LoaderImage = styled.div`
  width: 400px;
`;

const ProfilePicCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px dashed #199fd9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #199fd9;
  cursor: pointer;
  margin-bottom: 10px;
  position: relative;
`;

const ProfilePicPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 20px;
`;

const AddReception = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Success or error
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const inputRefs = useRef([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    address: "",
    date_of_birth: "",
    profile_pic: "",
    qualification: "",
    specialization: "",
    mobile_number: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDoctorId(decodedToken.doctor_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.get(
        `/reception/register/?mobile_number=${mobileNumber}`
      );
      if (response.status === 200) {
        setVerificationStatus(response.data.success);
        setShowOtpModal(true);
      } else {
        setMessage("Verification failed");
        setMessageType("error");
        setShowMessageModal(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Verification failed");
      setMessageType("error");
      setShowMessageModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const enteredOtp = otp.join("");
      const response = await BaseUrl.post("/reception/register/", {
        mobile_number: mobileNumber,
        otp: enteredOtp,
        doctor_id: doctorId,
      });
      if (response.status === 201) {
        setShowOtpModal(false);
        setShowDetailsForm(true);
        localStorage.setItem("mobile_number", mobileNumber);
        setFormData({ ...formData, mobile_number: mobileNumber });
        setMessage(response.data.success);
        setMessageType("success");
        setShowMessageModal(true);
      } else {
        setMessage("OTP verification failed");
        setMessageType("error");
        setShowMessageModal(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "OTP verification failed");
      setMessageType("error");
      setShowMessageModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_pic: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await BaseUrl.get(
        `/reception/register/?mobile_number=${mobileNumber}`
      );
      if (response.status === 200) {
        setMessage(response.data.success);
        setMessageType("success");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
        setShowMessageModal(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "OTP resend failed");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (
      name === "name" ||
      name === "qualification" ||
      name === "specialization"
    ) {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "age") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    setFormData({ ...formData, [name]: newValue });

    let newErrors = { ...errors };
    switch (name) {
      case "name":
      case "qualification":
      case "specialization":
        if (!/^[a-zA-Z\s]*$/.test(newValue)) {
          newErrors[name] =
            `${name.charAt(0).toUpperCase() + name.slice(1)} should contain only alphabets`;
        } else {
          delete newErrors[name];
        }
        break;
      case "mobile_number":
        if (!/^\d+$/.test(newValue)) {
          newErrors[name] = "Mobile number should contain only digits";
        } else {
          delete newErrors[name];
        }
        break;
      case "gender":
        if (newValue === "") {
          newErrors[name] = "Gender is required";
        } else {
          delete newErrors[name];
        }
        break;
      case "address":
        if (newValue === "") {
          newErrors[name] = "Address is required";
        } else {
          delete newErrors[name];
        }
        break;
      case "age":
        if (newValue === "") {
          newErrors[name] = "Age is required";
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.gender) formErrors.gender = "Gender is required";

    if (!formData.qualification)
      formErrors.qualification = "Qualification is required";
    if (!formData.address) formErrors.address = "Address is required";
    if (!formData.age) formErrors.age = "Age is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    try {
      const response = await BaseUrl.post("/reception/details/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setMessage(response.data.success);
        setMessageType("success");
      } else {
        setMessage("Form submission failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Form submission failed");
      setMessageType("error");
    } finally {
      setLoading(false);
      setShowMessageModal(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#D7EAF0",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <div
        className="container mt-5"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#0174BE" }} className="mb-5 text-center">
          Add Reception
        </h2>
        {loading && (
          <LoaderWrapper>
            <LoaderImage>
              <Loader
                type="spinner-circle"
                bgColor="#0091A5"
                color="#0091A5"
                title="Loading..."
                size={100}
              />
            </LoaderImage>
          </LoaderWrapper>
        )}

        {!showDetailsForm && (
          <div className="form-group row">
            <label htmlFor="mobileNumber" className="col-sm-2 col-form-label">
              Mobile Number:
            </label>
            <div className="col-sm-8">
              <input
                type="number"
                placeholder="Please Enter Mobile Number"
                className="form-control"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn"
                style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
                onClick={handleVerify}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {showDetailsForm && (
          <Form
            onSubmit={handleSubmit}
            className="mt-4"
            encType="multipart/form-data"
          >
            <div className="d-flex align-items-center mb-4">
              <ProfilePicCircle
                onClick={() =>
                  document.getElementById("profilePicInput").click()
                }
              >
                <span>+</span>
              </ProfilePicCircle>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
              {profilePicPreview && (
                <ProfilePicPreview
                  src={profilePicPreview}
                  alt="Profile Preview"
                />
              )}
            </div>
            <div className="row">
              <Form.Group controlId="formMobileNumber" className="col-md-4">
                <Form.Label>Mobile Number</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  type="text"
                  name="mobile_number"
                  value={formData.mobile_number}
                  required
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="formName" className="col-md-4">
                <Form.Label>Name</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  required
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <span className="text-danger">{errors.name}</span>
                )}
              </Form.Group>
              <Form.Group controlId="formGender" className="col-md-4">
                <Form.Label>Gender</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  required
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
                {errors.gender && (
                  <span className="text-danger">{errors.gender}</span>
                )}
              </Form.Group>
            </div>
            <div className="row mt-3">
              <Form.Group controlId="formDateOfBirth" className="col-md-4">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  max={today}
                  onChange={handleInputChange}
                />
                {errors.date_of_birth && (
                  <span className="text-danger">{errors.date_of_birth}</span>
                )}
              </Form.Group>
              <Form.Group controlId="formAge" className="col-md-4">
                <Form.Label>Age</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
                {errors.age && (
                  <span className="text-danger">{errors.age}</span>
                )}
              </Form.Group>
              <Form.Group controlId="formQualification" className="col-md-4">
                <Form.Label>Qualification</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  required
                  onChange={handleInputChange}
                />
                {errors.qualification && (
                  <span className="text-danger">{errors.qualification}</span>
                )}
              </Form.Group>
            </div>
            <div className="row mt-3">
              <Form.Group controlId="formSpecialization" className="col-md-4">
                <Form.Label>Specialization</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  required
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formAddress" className="col-md-8">
                <Form.Label>Address</Form.Label>
                <span className="text-danger">*</span>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  reuired
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <span className="text-danger">{errors.address}</span>
                )}
              </Form.Group>
            </div>
            <Button
              variant="btn"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
              type="submit"
              className="mt-3"
            >
              Submit
            </Button>
          </Form>
        )}

        <Modal
          show={showOtpModal}
          onHide={() => setShowOtpModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>OTP Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="otp-container d-flex justify-content-between mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="form-control otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      inputRefs.current[index - 1].focus();
                    }
                  }}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
            <div className="d-flex justify-content-between">
              <Button
                variant="btn"
                style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
                onClick={handleResendOtp}
              >
                Resend OTP
              </Button>
              <Button
                variant="btn"
                style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showMessageModal}
          onHide={() => setShowMessageModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {messageType === "success" ? "Success" : "Error"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p
              className={
                messageType === "success" ? "text-success" : "text-danger"
              }
            >
              {message}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowMessageModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AddReception;
