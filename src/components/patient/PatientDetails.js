import React, { useState, useEffect } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import {jwtDecode} from 'jwt-decode'; // Update this import
 
const PatientDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    date_of_birth: '',
    address: '',
    mobile_number: '',
    blood_group: '',
    age:'',
  });
 
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false); // State to check if patient details exist
  const today = new Date().toISOString().split('T')[0];
 
  useEffect(() => {
    const storeMobileNumberInLocalStorage = () => {
      const token = localStorage.getItem('patient_token');
      if (!token) return;
 
      try {
        const decodedToken = jwtDecode(token);
        const mobile_number = decodedToken.mobile_number;
        localStorage.setItem('mobile_number', mobile_number);
 
        setFormData(prevFormData => ({
          ...prevFormData,
          mobile_number: mobile_number
        }));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };
 
    storeMobileNumberInLocalStorage();
    fetchPatientDetails();
  }, []);
 
  const fetchPatientDetails = async () => {
    try {
      const mobile_number = localStorage.getItem('mobile_number');
 
      if (!mobile_number) {
        throw new Error('Phone number not found in local storage');
      }
 
      const response = await BaseUrl.get(`/patient/details/?mobile_number=${mobile_number}`);
      const patientDetails = response.data[0];
 
      if (patientDetails) {
        setIsExistingUser(true); // Set to true if details exist
        localStorage.setItem('patient_id', patientDetails.id); // Store patient ID in local storage
 
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
      setErrorMessage(error.response?.data?.error || 'Error fetching patient details.');
    }
  };
 
  const validateForm = () => {
    const newErrors = {};
    const namePattern = /^[a-zA-Z\s]*$/;
 
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!namePattern.test(formData.name)) {
      newErrors.name = 'Name cannot contain special characters or numbers';
    }
 
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
 
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of Birth is required';
    }
 
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
 
    if (!validateForm()) {
      return;
    }
 
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
 
    try {
      const mobile_number = localStorage.getItem('mobile_number');
      formDataToSubmit.append('mobile_number', mobile_number);
 
      let response;
      if (isExistingUser) {
        // Update details if they exist
        response = await BaseUrl.put(`/patient/details/?mobile_number=${mobile_number}`, formDataToSubmit);
      } else {
        // Create new details if they don't exist
        response = await BaseUrl.post(`/patient/details/?mobile_number=${mobile_number}`, formDataToSubmit);
      }
 
      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setErrorMessage('');
        // Fetch updated details after successful submission
        fetchPatientDetails();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'These fields are mandatory.');
      setSuccessMessage('');
    }
  };
 
  return (
    <div className="container mt-5">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form
        className="user-profile-form p-4 rounded shadow"
        onSubmit={handleSubmit}
        style={{ backgroundColor: '#f8f9fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <h2>Patient Details</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Mobile No</label> <span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="number" className="form-control" name="mobile_number" value={formData.mobile_number} disabled onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Name</label> <span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Gender</label> <span className="text-danger">*</span> {/* Mandatory indicator */}
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Others</option>
            </select>
            {errors.gender && <span className="text-danger">{errors.gender}</span>}
          </div>
          <div className="col-md-6">
            <label>Date of Birth</label> <span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="date" className="form-control" name="date_of_birth" max={today} value={formData.date_of_birth} onChange={handleChange} />
            {errors.date_of_birth && <span className="text-danger">{errors.date_of_birth}</span>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Blood Group</label>
            <input type="text" className="form-control" name="blood_group" value={formData.blood_group} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Age</label> <span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="age" value={formData.age} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Address</label> <span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <span className="text-danger">{errors.address}</span>}
          </div>
        </div>
        <button type="submit" className="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }}>Update</button>
      </form>
    </div>
  );
};
 
export default PatientDetails;
 