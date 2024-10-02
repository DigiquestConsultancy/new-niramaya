import React, { useState, useEffect, useCallback } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import { useHistory } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token

const MyClinicDetails = () => {
  const history = useHistory();
  const token = localStorage.getItem('token'); // Get the JWT from local storage
  let clinic_id = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    clinic_id = decodedToken.clinic_id; // Extract the clinic_id from the JWT
  }

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    address: '',
    date_of_birth: '',
    qualification: '',
    specialization: '',
    mobile_number: '',
    age: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [detailsExist, setDetailsExist] = useState(false);

  const fetchClinicDetail = useCallback(async () => {
    try {
      const response = await BaseUrl.get(`/clinic/details/?clinic_id=${clinic_id}`);
      if (response.status === 200) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFormData(response.data[0]);
          setDetailsExist(true);  // Indicate that details exist
        } else if (response.data.success) {
          setFormData({
            name: response.data.name || '',
            gender: response.data.gender || '',
            address: response.data.address || '',
            date_of_birth: response.data.date_of_birth || '',
            qualification: response.data.qualification || '',
            specialization: response.data.specialization || '',
            mobile_number: response.data.mobile_number || '',
          });
          setDetailsExist(false);  // Indicate that details do not exist
          setErrorMessage(response.data.success);
        } else {
          setErrorMessage('Clinic data not found.');
        }
      }
    } catch (error) {
      setErrorMessage('Error fetching clinic detail.');
    }
  }, [clinic_id]);

  useEffect(() => {
    if (clinic_id) {
      fetchClinicDetail();
    } else {
      setErrorMessage('No clinic ID found in token.');
    }
  }, [clinic_id, fetchClinicDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, clinic_id }; // Include clinic_id in the form data
    try {
      let response;
      if (detailsExist) {
        response = await BaseUrl.put(`/clinic/details/`, dataToSubmit);
      } else {
        response = await BaseUrl.post(`/clinic/details/`, dataToSubmit);
      }
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.data.success);
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      setErrorMessage('Error updating details.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form className="p-4 shadow" onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Clinic Details</h2>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Mobile</label>
            <input type="number" className="form-control" name="mobile_number" value={formData.mobile_number} disabled onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Gender</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Date of Birth</label>
            <input type="date" className="form-control" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Specialization</label>
            <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Qualification</label>
            <input type="text" className="form-control" name="qualification" value={formData.qualification} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Address</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Age</label>
            <input type="text" className="form-control" name="age" value={formData.age} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-secondary ml-2" onClick={() => history.goBack()}>Back</button>
      </form>
    </div>
  );
};

export default MyClinicDetails;
