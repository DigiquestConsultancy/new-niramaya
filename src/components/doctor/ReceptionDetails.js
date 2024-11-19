import React, { useState, useEffect, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { useParams, useHistory } from "react-router-dom";
import Loader from "react-js-loader";
import styled from "styled-components";
import { Modal, Button } from "react-bootstrap";

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

const ReceptionDetails = () => {
  const { reception_id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    address: "",
    date_of_birth: "",
    age: "",
    qualification: "",
    specialization: "",
    mobile_number: "",
    profile_pic: "",
  });
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [detailsExist, setDetailsExist] = useState(false);
  const history = useHistory();

  const fetchReceptionDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.get(
        `/reception/details/?reception_id=${reception_id}`
      );
      if (response.status === 200) {
        if (response.data.success) {
          setSuccessMessage(response.data.success); // Display success message from backend
        }

        if (Array.isArray(response.data) && response.data.length > 0) {
          setFormData(response.data[0]);
          const profilePicUrl = response.data[0].profile_pic
            ? `${BaseUrl.defaults.baseURL}${response.data[0].profile_pic}`
            : "";
          setProfilePicPreview(profilePicUrl);
          setDetailsExist(true);
        } else {
          setFormData({
            ...formData,
            mobile_number: response.data.mobile_number || "", // Set mobile_number from response
          });
          setErrorMessage("");
        }
      }
    } catch (error) {
      setErrorMessage("Error fetching details.");
    } finally {
      setLoading(false);
    }
  }, [reception_id]);

  useEffect(() => {
    fetchReceptionDetail();
  }, [fetchReceptionDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for specific fields
    if (
      name === "name" ||
      name === "qualification" ||
      name === "specialization"
    ) {
      const alphabetAndDotOnly = /^[A-Za-z\s\.]*$/; // Allows letters, spaces, and dots
      if (!alphabetAndDotOnly.test(value)) {
        return;
      }
    }

    if (name === "age") {
      const numericOnly = /^[0-9]*$/; // Allows only numbers
      if (!numericOnly.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_pic: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "profile_pic") {
        dataToSubmit.append(key, formData[key]);
      }
    });

    if (formData.profile_pic instanceof File) {
      dataToSubmit.append("profile_pic", formData.profile_pic);
    }

    try {
      setLoading(true);
      let response;

      if (detailsExist) {
        response = await BaseUrl.put(`/reception/details/`, dataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await BaseUrl.post(`/reception/details/`, dataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.data.success || "");
        setErrorMessage("");
        setShowModal(true);
      } else {
        setErrorMessage(response.data.error || "");
        setSuccessMessage("");
        setShowModal(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Error updating details.");
      }
      setSuccessMessage("");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#D7EAF0",
        minHeight: "150vh",
        padding: "20px",
        fontFamily: "sans-serif",
        fontSize: "16px",
        width: "100%",
      }}
    >
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{successMessage ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <form
        className="p-4 shadow"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Reception Details</h2>
        {/* Display success message from backend */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="d-flex align-items-center mb-4">
          <ProfilePicCircle
            onClick={() => document.getElementById("profilePicInput").click()}
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
            <ProfilePicPreview src={profilePicPreview} alt="Profile Preview" />
          )}
        </div>

        <div className="row mb-4">
          <div className="col-md-4 col-12">
            <label>Name</label>
            <span className="text-danger">*</span>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 col-12">
            <label>Mobile</label>
            <span className="text-danger">*</span>
            <input
              type="number"
              className="form-control"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 col-12">
            <label>Gender</label>
            <span className="text-danger">*</span>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4 col-12">
            <label>Age</label>
            <span className="text-danger">*</span>
            <input
              type="number"
              className="form-control"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 col-12">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 col-12">
            <label>Specialization</label>
            <span className="text-danger">*</span>
            <input
              type="text"
              className="form-control"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4 col-12">
            <label>Qualification</label>
            <span className="text-danger">*</span>
            <input
              type="text"
              className="form-control"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 col-12">
            <label>Address</label>
            <span className="text-danger">*</span>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#199fd9",
              color: "#f1f8dc",
              fontFamily: "sans-serif",
              fontWeight: "500",
              marginRight: "10px",
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history.goBack()}
            style={{ fontFamily: "sans-serif", fontWeight: "500" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceptionDetails;
