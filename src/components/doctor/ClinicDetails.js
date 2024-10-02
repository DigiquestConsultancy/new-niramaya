import React, { useState, useEffect, useCallback } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import { useParams, useHistory } from 'react-router-dom';
 
const ClinicDetails = () => {
  const { clinic_id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    address: '',
    date_of_birth: '',
    qualification: '',
    specialization: '',
    mobile_number: '',
  });
  const [errors, setErrors] = useState({});
 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [detailsExist, setDetailsExist] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const history = useHistory();
 
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
    fetchClinicDetail();
  }, [fetchClinicDetail]);
 
  const validateForm = () => {
    const newErrors = {};
 
    // Validate mobile number
    if (!formData.mobile_number) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (!/^\d+$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Mobile number must contain only numeric values';
    }
 
    // Validate name
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only alphabets';
    }
 
    // Validate gender
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
 
    // Validate date of birth
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
 
    // Validate address
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
 
    // Validate specialization
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.specialization)) {
      newErrors.specialization = 'Specialization must contain only alphabets';
    }
 
    // Validate qualification
    if (!formData.qualification) {
      newErrors.qualification = 'Qualification is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.qualification)) {
      newErrors.qualification = 'Qualification must contain only alphabets';
    }
 
    return newErrors;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
 
    const dataToSubmit = { ...formData, clinic_id }; // Include clinic_id in the form data
    try {
      let response;
      if (detailsExist) {
        response = await BaseUrl.put(`/clinic/details/`, dataToSubmit);
      } else {
        response = await BaseUrl.post(`/clinic/details/`, dataToSubmit);
      }
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Details updated successfully');
        setErrorMessage('');
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
            <label>Mobile</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="number" className="form-control" name="mobile_number" value={formData.mobile_number} onChange={handleChange} />
            {errors.mobile_number && <span className="text-danger">{errors.mobile_number}</span>}
          </div>
          <div className="col-md-4">
            <label>Name</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="col-md-4">
            <label>Gender</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="text-danger">{errors.gender}</span>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Date of Birth</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="date" className="form-control" name="date_of_birth" value={formData.date_of_birth} max={today} onChange={handleChange} />
            {errors.date_of_birth && <span className="text-danger">{errors.date_of_birth}</span>}
          </div>
          <div className="col-md-4">
            <label>Specialization</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} />
            {errors.specialization && <span className="text-danger">{errors.specialization}</span>}
          </div>
          <div className="col-md-4">
            <label>Qualification</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="qualification" value={formData.qualification} onChange={handleChange} />
            {errors.qualification && <span className="text-danger">{errors.qualification}</span>}
          </div>
          <div className="col-md-4">
            <label>Address</label><span className="text-danger">*</span> {/* Mandatory indicator */}
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <span className="text-danger">{errors.address}</span>}
          </div>
        </div>
        <button type="submit" className="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }}>Update</button>
        <button type="button" className="btn btn-secondary ml-2" onClick={() => history.goBack()}>Cancel</button>
      </form>
    </div>
  );
};
 
export default ClinicDetails;