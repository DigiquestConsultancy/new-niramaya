import React, { useState, useEffect, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { useHistory } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Loader from "react-js-loader";
import styled from "styled-components";

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
  font-family: sans-serif;
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
  font-family: sans-serif;
`;

const ProfilePicPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const MyReceptionDetails = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  let reception_id = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    reception_id = decodedToken.reception_id;
  }

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    address: "",
    date_of_birth: "",
    qualification: "",
    specialization: "",
    mobile_number: "",
    profile_pic: "",
  });
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [detailsExist, setDetailsExist] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReceptionDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.get(
        `/reception/details/?reception_id=${reception_id}`
      );
      if (response.status === 200) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFormData(response.data[0]);
          setProfilePicPreview(
            `${BaseUrl.defaults.baseURL}${response.data[0].profile_pic}`
          );
          setDetailsExist(true);
        }
      }
    } catch (error) {
      setErrorMessage("Error fetching reception detail.");
    } finally {
      setLoading(false);
    }
  }, [reception_id]);

  useEffect(() => {
    if (reception_id) {
      fetchReceptionDetail();
    } else {
      setErrorMessage("No reception ID found in token.");
    }
  }, [reception_id, fetchReceptionDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

    setLoading(true);
    try {
      let response;
      if (detailsExist) {
        response = await BaseUrl.put(`/reception/details/`, dataToSubmit, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await BaseUrl.post(`/reception/details/`, dataToSubmit, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          response.data.success || "Details updated successfully"
        );
        setErrorMessage("");
        fetchReceptionDetail();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error updating details.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-5" style={{ fontFamily: "sans-serif" }}>
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

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <form
        className="p-4 shadow"
        onSubmit={handleSubmit}
        style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      >
        <h2>Reception Details</h2>
        <div className="d-flex align-items-center justify-content-center mb-4">
          <ProfilePicCircle
            className="me-5"
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
        <div className="row mb-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
          <div className="col-md-4">
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
        <div className="row mb-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
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
        <div className="row mb-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
        <button type="submit" className="btn btn-primary">
          Update
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={() => history.goBack()}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default MyReceptionDetails;
