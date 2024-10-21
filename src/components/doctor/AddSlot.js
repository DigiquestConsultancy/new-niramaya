
import React, { useState, useEffect } from 'react';
import BaseUrl from '../../api/BaseUrl';
import { jwtDecode } from 'jwt-decode';

const AddSlot = () => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    interval_minutes: '',
    leave_dates: '',
    doctor_id: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const doctor_id = decodedToken.doctor_id;
        setFormData(prevFormData => ({
          ...prevFormData,
          doctor_id: doctor_id
        }));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await BaseUrl.post('/doctorappointment/slot/', formData);
        
        if (response.status === 201 ) {
            setSuccessMessage(response.data.success); // Display success message from the backend
            setErrorMessage(''); // Clear any previous error message
        }
    } catch (error) {
        // Check if it's a 400 Bad Request error
        if (error.response && error.response.status === 400) {
            setErrorMessage(error.response.data.error); // Show backend error message for 400
        } else {
            setErrorMessage('An unexpected error occurred.');
        }
        setSuccessMessage(''); // Clear success message if any
    }
};


  const generateIntervalMinutesOptions = () => {
    const options = [];
    for (let i = 5; i <= 60; i += 5) {
      options.push(<option key={i} value={i}>{i} minutes</option>);
    }
    return options;
  };

  return (
    <div className="container mt-5">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form className="p-4 shadow" onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Add Slot</h2>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Start Date</label>
            <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label>End Date</label>
            <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label>Leave Date</label>
            <input type="date" className="form-control" name="leave_dates" value={formData.leave_dates} onChange={handleChange} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Start Time</label>
            <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label>End Time</label>
            <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label>Interval Minutes</label>
            <select className="form-select" name="interval_minutes" value={formData.interval_minutes} onChange={handleChange} required>
              <option value="">Select interval</option>
              {generateIntervalMinutesOptions()}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Add Slot</button>
      </form>
    </div>
  );
};

export default AddSlot;
