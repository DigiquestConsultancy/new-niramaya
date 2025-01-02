import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl"; // Import the BaseUrl instance
import { jwtDecode } from "jwt-decode"; // Correct the import for jwt-decode
import { Container } from "react-bootstrap";
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

const PatientDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    date_of_birth: "",
    address: "",
    mobile_number: "",
    blood_group: "",
    age: "",
  });

   const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false); // State to check if patient details exist
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storeMobileNumberInLocalStorage = () => {
      const token = localStorage.getItem("patient_token");
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token);
        const mobile_number = decodedToken.mobile_number;
        localStorage.setItem("mobile_number", mobile_number);

        setFormData((prevFormData) => ({
          ...prevFormData,
          mobile_number: mobile_number,
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    storeMobileNumberInLocalStorage();
    fetchPatientDetails();
  }, []);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const mobile_number = localStorage.getItem("mobile_number");
      const response = await BaseUrl.get(
        `/patient/details/?mobile_number=${mobile_number}`
      );
      const patientDetails = response.data[0];

      if (patientDetails.success) {
        setIsExistingUser(false);
      } else {
        setIsExistingUser(true); 
        localStorage.setItem("patient_id", patientDetails.id); 

        setFormData({
          name: patientDetails.name,
          gender: patientDetails.gender,
          date_of_birth: patientDetails.date_of_birth,
          address: patientDetails.address,
          mobile_number: patientDetails.mobile_number,
          blood_group: patientDetails.blood_group,
          age: patientDetails.age,
        });
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error fetching patient details."
      );
    }
    finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      setLoading(true);
      const mobile_number = localStorage.getItem("mobile_number");
      formDataToSubmit.append("mobile_number", mobile_number);

      let response;
      if (isExistingUser) {
        response = await BaseUrl.put(
          `/patient/details/?mobile_number=${mobile_number}`,
          formDataToSubmit
        );
      } else {
        response = await BaseUrl.post(
          `/patient/details/?mobile_number=${mobile_number}`,
          formDataToSubmit
        );
        setIsExistingUser(true); 
      }

      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setErrorMessage("");
        fetchPatientDetails();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "These fields are mandatory."
      );
      setSuccessMessage("");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#D7EAF0", overflowX: "hidden" }}>
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
      <div className="container mt-5 mb-5">
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        <form
          className="user-profile-form p-4 rounded shadow"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#f8f9fa",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Patient Details</h2>
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Mobile No</label> <span className="text-danger">*</span>{" "}
              <input
                type="text"
                className="form-control"
                name="mobile_number"
                value={formData.mobile_number}
                disabled
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label>Name</label> <span className="text-danger">*</span>{" "}
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
              <label>Gender</label> <span className="text-danger">*</span>{" "}
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
                <option value="other">Others</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>Date of Birth</label>{" "}
              <span className="text-danger">*</span>{" "}
              <input
                type="date"
                className="form-control"
                name="date_of_birth"
                max={today}
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label>Blood Group</label>
              <input
                type="text"
                className="form-control"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label>Age</label> <span className="text-danger">*</span>{" "}
              <input
                type="text"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>Address</label> <span className="text-danger">*</span>{" "}
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
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
          >
            {isExistingUser ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default PatientDetails;
