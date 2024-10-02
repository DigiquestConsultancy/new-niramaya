import React, { useState, useEffect, useCallback } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from 'date-fns';
import BaseUrl from '../../api/BaseUrl';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import debounce from 'lodash.debounce';
import { Modal, Button, Form } from "react-bootstrap"; // Import necessary components from react-bootstrap
 
const ClinicAddSlot = () => {
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
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const dateRangeSize = 5;
  const [selectedDate, setSelectedDate] = useState('');
  const [doctorId, setDoctorId] = useState("");
  const [showBlockSlotModal, setShowBlockSlotModal] = useState(false);
  const [showUnblockSlotModal, setShowUnblockSlotModal] = useState(false); // New state for unblock modal
  const [blockSlotData, setBlockSlotData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [unblockSlotData, setUnblockSlotData] = useState({ // New state for unblock form data
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
 
  useEffect(() => {
    const storeUserIdInLocalStorage = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
 
      try {
        const decodedToken = jwtDecode(token);
        const doctor_id = decodedToken.doctor_id;
        setDoctorId(doctor_id);
        localStorage.setItem("doctor_id", doctor_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    storeUserIdInLocalStorage();
    fetchTodayAppointmentSlots();
  }, []);
 
  const fetchTodayAppointmentSlots = async () => {
    try {
      const doctor_id = localStorage.getItem("doctor_id");
      const response = await BaseUrl.get("/doctorappointment/todayslot/", {
        params: { doctor_id: doctor_id },
      });
 
      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage("");
          setAppointmentSlots([]);
        } else {
          setAppointmentSlots(response.data);
          setErrorMessage("");
        }
      } else {
        setErrorMessage("Error fetching appointment slots.");
      }
    } catch (error) {
      console.error("Error fetching appointment slots:", error);
      setErrorMessage(
        error.response.data.error ||
        "An error occurred while fetching appointment slots."
      );
    }
  };
 
  const [blockedSlots, setBlockedSlots] = useState([]);
  const fetchSlots = useCallback(
    debounce(async (doctorId, slotDate = null) => {
      try {
        const params = {
          doctor_id: doctorId,
          slot_date: slotDate || format(new Date(), 'yyyy-MM-dd')
        };
        const response = await BaseUrl.get('/doctorappointment/slot/', { params });
 
        if (response.status === 200) {
          setSlots(response.data);
          if (response.data.length === 0) {
            setErrorMessage(`No slots available for ${params.slot_date}`);
          } else {
            setErrorMessage('');
          }
        } else {
          setSlots([]);
          setErrorMessage('Error fetching appointment slots.');
        }
      } catch (error) {
        console.error('Error fetching appointment slots:', error);
        setSlots([]);
        setErrorMessage(error.response?.data?.error || 'An error occurred while fetching appointment slots.');
      }
    }, 300),
    []
  );
 
  const fetchAllSlots = useCallback(
    debounce(async (doctorId) => {
      try {
        const response = await BaseUrl.get(`/doctorappointment/todayafterslot/?doctor_id=${doctorId}`);
        if (response.status === 200) {
          setAllSlots(response.data);
          setErrorMessage('');
        } else {
          setAllSlots([]);
          setErrorMessage('Error fetching all appointment slots.');
        }
      } catch (error) {
        console.error('Error fetching all appointment slots:', error);
        setAllSlots([]);
        setErrorMessage(error.response?.data?.error || 'An error occurred while fetching all appointment slots.');
      }
    }, 300),
    []
  );
 
  useEffect(() => {
    const fetchDoctor = async (clinicId) => {
      try {
        const response = await BaseUrl.get(`/clinic/doctordetailbyclinicid/?clinic_id=${clinicId}`);
        if (response.data.doctor_id) {
          setDoctor(response.data);
          setSelectedDoctor(response.data.doctor_id);
          fetchSlots(response.data.doctor_id);
        } else {
          setErrorMessage(response.data.error);
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage('Error fetching doctor: ' + error.message);
        setLoading(false);
      }
    };
 
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const clinicId = decodedToken.clinic_id;
        fetchDoctor(clinicId);
        setFormData(prevFormData => ({
          ...prevFormData,
          doctor_id: decodedToken.doctor_id || ''
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
 
  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    fetchSlots(e.target.value);
  };
 
  // const handleDateChange = (date, field) => {
  //   const formattedDate = format(date, 'dd/MM/yyyy');
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     [field]: formattedDate
  //   }));
  // };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedDoctor) {
        setErrorMessage('Please select a doctor');
        return;
      }
 
      const slotData = { ...formData, doctor_id: selectedDoctor };
      const response = await BaseUrl.post('/doctorappointment/slot/', slotData);
 
      if (response.status === 201) {
        setSuccessMessage(response.data.success);
        setErrorMessage('');
        fetchSlots(selectedDoctor);
      }
    } catch (error) {
      setErrorMessage('Error adding slot: ' + error.message);
      setSuccessMessage('');
    }
  };
 
  const generateIntervalMinutesOptions = () => {
    const options = [];
    for (let i = 5; i <= 60; i += 5) {
      options.push(<option key={i} value={i}>{i} minutes</option>);
    }
    return options;
  };
 
  const generateDates = useCallback(() => {
    const today = new Date();
    const datesArray = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      datesArray.push(format(date, 'dd/MM/yyyy'));
    }
    setDates(datesArray);
    setCurrentDateIndex(0);
    setSelectedDate(datesArray[0]);
    fetchSlots(selectedDoctor, format(parse(datesArray[0], 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'));
  }, [selectedDoctor, fetchSlots]);
 
  useEffect(() => {
    if (selectedDoctor) {
      generateDates();
    }
  }, [selectedDoctor, generateDates]);
 
  const handleDateRangeChange = (direction) => {
    if (direction === 'prev' && currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
      setSelectedDate(dates[currentDateIndex - 1]);
      setAllSlots([]); // Clear allSlots when a new date is selected
      fetchSlots(selectedDoctor, format(parse(dates[currentDateIndex - 1], 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'));
    } else if (direction === 'next' && currentDateIndex < dates.length - dateRangeSize) {
      setCurrentDateIndex(currentDateIndex + 1);
      setSelectedDate(dates[currentDateIndex + 1]);
      setAllSlots([]); // Clear allSlots when a new date is selected
      fetchSlots(selectedDoctor, format(parse(dates[currentDateIndex + 1], 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'));
    }
  };
 
  const handleViewAllSlots = () => {
    if (selectedDoctor) {
      fetchAllSlots(selectedDoctor);
      setSlots([]); // Clear the individual date slots when viewing all slots
      setSelectedDate(''); // Clear the selected date
    } else {
      setErrorMessage('Please select a doctor to view all slots.');
    }
  };
 
  const groupSlotsByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const date = slot.appointment_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {});
  };
 
  const groupedSlots = groupSlotsByDate(allSlots);
 
  const handleBlockSlot = () => {
    setShowBlockSlotModal(true);
  };
 
  const handleBlockSlotClose = () => {
    setShowBlockSlotModal(false);
  };
 
  const handleBlockSlotSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await BaseUrl.patch("/doctorappointment/slot/", {
        start_date: blockSlotData.startDate,
        start_time: blockSlotData.startTime,
        end_date: blockSlotData.endDate,
        end_time: blockSlotData.endTime,
        doctor_id: doctorId,
      });
 
      if (response.status === 200) {
        setShowBlockSlotModal(false);
        fetchAllAppointmentSlots();
        fetchSlots(doctorId)
      } else {
        setErrorMessage("Error blocking slot.");
      }
    } catch (error) {
      console.error("Error blocking slot:", error);
      setErrorMessage(
        error.response.data.error || "An error occurred while blocking slot."
      );
    }
  };
 
  // New function for handling unblock slot
  const handleUnblockSlot = () => {
    setShowUnblockSlotModal(true);
  };
 
  const handleUnblockSlotClose = () => {
    setShowUnblockSlotModal(false);
  };
 
  const handleUnblockSlotSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await BaseUrl.patch("/doctorappointment/unblockslot/", {
        start_date: unblockSlotData.startDate,
        start_time: unblockSlotData.startTime,
        end_date: unblockSlotData.endDate,
        end_time: unblockSlotData.endTime,
        doctor_id: doctorId,
      });
 
      if (response.status === 200) {
        setShowUnblockSlotModal(false);
        fetchAllAppointmentSlots();
        fetchSlots(doctorId)
        setSuccessMessage(response.data.success); // Set success message from response
      } else {
        setErrorMessage("Error unblocking slot.");
      }
    } catch (error) {
      console.error("Error unblocking slot:", error);
      setErrorMessage(
        error.response.data.error || "An error occurred while unblocking slot."
      );
    }
  };
 
  const isSlotBlocked = (slot) => {
    return blockedSlots.some(
      (blockedSlot) =>
        slot.appointment_date >= blockedSlot.startDate &&
        slot.appointment_date <= blockedSlot.endDate &&
        slot.appointment_slot >= blockedSlot.startTime &&
        slot.appointment_slot <= blockedSlot.endTime
    );
  };
 
  const fetchAllAppointmentSlots = async () => {
    try {
      const response = await BaseUrl.get(`/doctorappointment/todayafterslot/`, {
        params: { doctor_id: doctorId },
      });
 
      if (response.status === 200) {
        setAppointmentSlots(response.data || []);
        setErrorMessage("");
      } else {
        setErrorMessage("Error fetching all appointment slots.");
      }
    } catch (error) {
      console.error("Error fetching all appointment slots:", error);
      setErrorMessage(
        error.response.data.error ||
        "An error occurred while fetching appointment slots."
      );
    }
  };
 
 
  return (
    <div className="container mt-5" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="p-4 shadow" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }} onSubmit={handleSubmit}>
          <div className="form-row mb-3">
            <div className="form-group col-md-12">
              <h4>Select Doctor</h4>
              <select className="form-control" value={selectedDoctor} onChange={handleDoctorChange} required>
                <option value="">Select a doctor</option>
                {doctor && <option value={doctor.doctor_id}>{doctor.name}</option>}
              </select>
            </div>
           
            <div className="form-group col-md-4">
              <label>Start Date</label>
              <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
            </div>
            <div className="form-group col-md-4">
              <label>End Date</label>
              <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
            </div>
 
            <div className="form-group col-md-4">
              <label>Leave Dates</label>
              <input type="date" className="form-control" name="leave_dates" value={formData.leave_dates} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row mb-3">
            <div className="form-group col-md-4">
              <label>Start Time</label>
              <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange}  />
            </div>
            <div className="form-group col-md-4">
              <label>End Time</label>
              <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleChange}  />
            </div>
            <div className="form-group col-md-4">
              <label>Interval (Minutes)</label>
              <select className="form-control" name="interval_minutes" value={formData.interval_minutes} onChange={handleChange} >
                <option value="">Select interval</option>
                {generateIntervalMinutesOptions()}
              </select>
            </div>
          </div>
 
          <button type="submit"
            className="btn me-2"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
          >
            Add Slot
          </button>
 
          <button
            type="button"
            className="btn me-2"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            onClick={handleBlockSlot}
          >
            Block Slot
          </button>
 
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            onClick={handleUnblockSlot}
          >
            Unblock Slot
          </button>
 
        </form>
      )}
 
      <div className="date-list mt-3 d-flex justify-content-center">
        <button className="btn btn-secondary mr-2" onClick={() => handleDateRangeChange('prev')} disabled={currentDateIndex === 0}>
          Previous
        </button>
 
        {dates.slice(currentDateIndex, currentDateIndex + dateRangeSize).map((date, index) => (
          <button
            key={index}
            className={`btn btn-outline-primary mr-2 ${selectedDate === date ? 'active' : ''}`}
            onClick={() => {
              setSelectedDate(date);
              setAllSlots([]); // Clear allSlots when a new date is selected
              fetchSlots(selectedDoctor, format(parse(date, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'));
            }}
          >
            {date}
          </button>
        ))}
 
        <button className="btn btn-secondary mr-2" onClick={() => handleDateRangeChange('next')} disabled={currentDateIndex >= dates.length - dateRangeSize}>
          Next
        </button>
        <button className='btn btn-info' onClick={handleViewAllSlots}>View All Slots</button>
      </div>
      <style>{`
        .legend {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
 
        .legend > div {
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
 
        .legend-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 5px;
        }
 
        .legend-text {
          font-size: 20px;
        }
      `}</style>
      <div className="legend">
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#f8d7da" }}></span>
          <span className="legend-text">Blocked</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#A0DEFF" }}></span>
          <span className="legend-text">Booked</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#B0D9B1" }}></span>
          <span className="legend-text">Available</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#F45050" }}></span>
          <span className="legend-text">Canceled</span>
        </div>
      </div>
      <div className="row mt-5">
        {selectedDate && slots.map((slot, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div
              className="card"
              style={{
                backgroundColor: slot.is_blocked
                  ? "#f8d7da" // Red color for blocked slots
                  : slot.is_canceled
                  ? "#F45050"
                  : slot.is_booked
                    ? "#A0DEFF" // Blue color for booked slots
                    : "#B0D9B1", // Green color for available slots
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                margin: '10px',
                width: '300px', // Adjust as needed
                height: '100px', // Adjust as needed
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h6 className="card-subtitle mb-3 text-muted" style={{ textAlign: 'center' }}>
                  {/* {format(parse(slot.appointment_date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')} - {slot.appointment_slot} */}
                  {slot.appointment_slot}
 
                </h6>
                <p className="card-text" style={{ textAlign: 'center' }}>
                  {slot.is_blocked ? 'Blocked' :slot.is_canceled ? "Canceled": slot.is_booked ? `Booked by: ${slot.booked_by}` : 'Available'}
                </p>
              </div>
            </div>
          </div>
        ))}
 
        {!selectedDate && Object.keys(groupedSlots).map((date, index) => (
          <div key={index} className="col-md-12 mb-4">
            <div className="text-center mb-2">
              <h5>{format(parse(date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')}</h5>
            </div>
            <div className="row mb-4 p-4 shadow">
              {groupedSlots[date].map((slot, slotIndex) => (
                <div key={slotIndex} className="col-md-3 mb-4">
                  <div className="card"
                    style={{
                      backgroundColor: slot.is_blocked
                        ? "#f8d7da" // Red color for blocked slots
                        : slot.is_booked
                          ? "#A0DEFF" // Blue color for booked slots
                          : "#B0D9B1", // Green color for available slots
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '10px',
                      margin: '10px',
                      width: '300px', // Adjust as needed
                      height: '100px', // Adjust as needed
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <h6 className="card-subtitle mb-3 text-muted" style={{ textAlign: 'center' }}>
                        {slot.appointment_slot}
                      </h6>
                      <p className="card-text" style={{ textAlign: 'center' }}>
                        {slot.is_blocked ? 'Blocked' : slot.is_booked ? `Booked by: ${slot.booked_by}` : 'Available'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
 
 
      <Modal show={showBlockSlotModal} onHide={handleBlockSlotClose}>
        <Modal.Header closeButton>
          <Modal.Title>Block Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBlockSlotSubmit}>
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={blockSlotData.startDate}
                onChange={(e) =>
                  setBlockSlotData({
                    ...blockSlotData,
                    startDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={blockSlotData.endDate}
                onChange={(e) =>
                  setBlockSlotData({ ...blockSlotData, endDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={blockSlotData.startTime}
                onChange={(e) =>
                  setBlockSlotData({
                    ...blockSlotData,
                    startTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={blockSlotData.endTime}
                onChange={(e) =>
                  setBlockSlotData({ ...blockSlotData, endTime: e.target.value })
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            >
              Block Slot
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
 
      {/* Unblock Slot Modal */}
      <Modal show={showUnblockSlotModal} onHide={handleUnblockSlotClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unblock Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUnblockSlotSubmit}>
            <Form.Group controlId="formUnblockStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={unblockSlotData.startDate}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    startDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formUnblockEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={unblockSlotData.endDate}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    endDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formUnblockStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={unblockSlotData.startTime}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    startTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formUnblockEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={unblockSlotData.endTime}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    endTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            >
              Unblock Slot
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
 
export default ClinicAddSlot;