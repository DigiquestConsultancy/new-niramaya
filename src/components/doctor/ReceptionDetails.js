import React, { useState, useEffect, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { useParams, useHistory } from "react-router-dom";
import Loader from "react-js-loader";
import styled from "styled-components";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";

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

  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

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
      let value = formData[key];

      if (key === "date_of_birth") {
        if (value) {
          // Ensure proper YYYY-MM-DD format
          const formattedDOB = new Date(value).toISOString().split("T")[0];
          dataToSubmit.append("date_of_birth", formattedDOB);
        }
        // If empty, skip appending it entirely
      } else if (key !== "profile_pic") {
        dataToSubmit.append(key, value);
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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup in case component unmounts early
    }
  }, [successMessage]);

  return (
    <div className="d-flex" style={{ height: "calc(100vh - 80px)" }}>
      <Sidebar
        selectedMenu={selectedMenu}
        handleMenuClick={handleMenuClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main className="p-4">
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
            <span
              className="alert alert-success"
              style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99999,
              }}
            >
              {successMessage}
            </span>
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
              <ProfilePicPreview
                src={profilePicPreview}
                alt="Profile Preview"
              />
            )}
          </div>

          <div className="row mb-4">
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
          {/* </div>

          <div className="row mb-4"> */}
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
          {/* </div>

          <div className="row mb-4"> */}
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
            <div className="col-lg-4 col-md-6 col-12 mb-3">
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
      </main>
    </div>
  );
};

export default ReceptionDetails;
