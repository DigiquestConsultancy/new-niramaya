import React, { useState, useEffect, useCallback } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import {jwtDecode} from 'jwt-decode'; // Corrected import for jwt-decode
import { useHistory } from 'react-router-dom';
 
const ManageClinic = () => {
  const [clinicDetails, setClinicDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();
 
  const fetchClinicDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
 
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;
 
      const response = await BaseUrl.get(`/clinic/detailsbyid/?doctor_id=${doctor_id}`);
     
      if (response.status === 200) {
        setErrorMessage('');
        setClinicDetails(response.data);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error fetching clinic details.');
    }
  }, []);
 
  useEffect(() => {
    fetchClinicDetails();
  }, [fetchClinicDetails]);
 
  const handleViewDetails = (clinic_id) => {
    history.push(`/doctor/manageclinic/details/${clinic_id}`);
  };
 
  const handleRemove = async (clinic_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this clinic?");
    if (!confirmDelete) {
      return;
    }
 
    try {
      const response = await BaseUrl.delete(`/clinic/details/`, {
        data: { clinic_ids: [clinic_id] }
      });
      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setClinicDetails(clinicDetails.filter(detail => detail.clinic_id !== clinic_id));
      } else {
        throw new Error('Failed to delete clinic details');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error deleting clinic details.');
    }
  };
 
  return (
    <div className="container mt-5">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className="d-flex justify-content-between align-items-center">
        <h2>Clinic Details</h2>
        <button type="button" className="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={() => history.push('/doctor/manageclinic/addclinic')}>
          Add Clinic
        </button>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Mobile Number</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Specialization</th>
            <th style={{ paddingLeft: '5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clinicDetails.length > 0 ? (
            clinicDetails.map((detail) => (
              <tr key={detail.clinic_id}>
                <td>{detail.mobile_number}</td>
                <td>{detail.name}</td>
                <td>{detail.gender}</td>
                <td>{detail.specialization}</td>
                <td>
                  <button className="btn me-2" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={() => handleViewDetails(detail.clinic_id)}>View Details</button>
                  <button className="btn btn-danger" onClick={() => handleRemove(detail.clinic_id)}>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No clinic details found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
 
export default ManageClinic;