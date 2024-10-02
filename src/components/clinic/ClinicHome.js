import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { format, addDays, subDays } from 'date-fns';
import { Link, useHistory } from 'react-router-dom';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import BaseUrl from '../../api/BaseUrl';
import '../../css/ReceptionHome.css';
import RightLogo from '../../images/pic.jpeg';
import LeftLogo from '../../images/logon.jpeg';
 
const ClinicHome = () => {
  const history = useHistory();
 
  // State hooks
  const [currentDate, setCurrentDate] = useState(new Date());
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const [bookedAppointmentCount, setBookedAppointmentCount] = useState();
  const [totalAppointmentCount, setTotalAppointmentCount] = useState();
  const [completedAppointmentsCount, setCompletedAppointmentsCount] = useState();
  const [canceledAppointmentsCount, setCanceledAppointmentsCount] = useState();
  const [walkInCount, setWalkInCount] = useState();
  const [onlineCount, setOnlineCount] = useState();
  const [followUpCount, setFollowUpCount] = useState();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndex, setCompletedIndex] = useState(0);
  const [canceledIndex, setCanceledIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showCanceledModal, setShowCanceledModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBlockSlotModal, setShowBlockSlotModal] = useState(false);
  const [showUnblockSlotModal, setShowUnblockSlotModal] = useState(false);
  const [blockFormData, setBlockFormData] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [unblockFormData, setUnblockFormData] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [showSlotButtons, setShowSlotButtons] = useState(false);
  const [isVisitEnded, setIsVisitEnded] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [vitalsData, setVitalsData] = useState(null);
  const [displayedData, setDisplayedData] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [uploadedPrescription, setUploadedPrescription] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [symptomsData, setSymptomsData] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const token = localStorage.getItem('token');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const doctorId = payload.doctor_id;
  const clinicId = payload.clinic_id;
 
  const fetchSlots = useCallback(async (doctorId, date) => {
    try {
      const response = await BaseUrl.get(`/doctorappointment/slot/?doctor_id=${doctorId}&slot_date=${date}`);
      if (response.status === 200) {
        const slots = response.data;
        if (slots.error) {
          setMorningSlots([]);
          setAfternoonSlots([]);
          setEveningSlots([]);
          setErrorMessage(slots.error);
        } else {
          const morning = [];
          const afternoon = [];
          const evening = [];
          slots.forEach(slot => {
            const slotTime = new Date(`1970-01-01T${slot.appointment_slot}`);
            const hours = slotTime.getHours();
            if (hours < 12) {
              morning.push(slot);
            } else if (hours >= 12 && hours < 17) {
              afternoon.push(slot);
            } else {
              evening.push(slot);
            }
          });
          setMorningSlots(morning);
          setAfternoonSlots(afternoon);
          setEveningSlots(evening);
          setErrorMessage('');
        }
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setMorningSlots([]);
      setAfternoonSlots([]);
      setEveningSlots([]);
      setErrorMessage('Error fetching slots. Please try again later.');
    }
  }, []);
 
  const confirmActionHandler = async () => {
    if (confirmAction === 'endVisit' && selectedAppointment) {
      await handleEndVisit(selectedAppointment.appointment_id);
    } else if (confirmAction === 'cancelAppointment' && selectedAppointment) {
      await handleCancelAppointment(selectedAppointment.appointment_id);
    }
    setShowConfirmModal(false);
  };
 
  const fetchAppointmentsData = useCallback(async (doctorId, clinicId, date) => {
    if (clinicId) {
      try {
        const response = await BaseUrl.get(`/reception/allappointments/?clinic_id=${clinicId}&appointment_date=${date}`);
        const appointments = response.data;
        const todayAppointments = appointments.filter(app => !app.is_complete && !app.is_canceled);
        const completedAppointments = appointments.filter(app => app.is_complete);
        const canceledAppointments = appointments.filter(app => app.is_canceled);
        setTodayAppointments(todayAppointments);
        setCompletedAppointments(completedAppointments);
        setCanceledAppointments(canceledAppointments);
 
        if (todayAppointments.length > 0) {
          const firstAppointment = todayAppointments[0];
          fetchAppointmentCounts(doctorId, date, firstAppointment.booked_by, firstAppointment.mobile_number);
        } else {
          fetchAppointmentCounts(doctorId, date);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
  }, []);
 
  const fetchAppointmentCounts = async (doctorId, date) => {
    try {
      const responseCounts = await BaseUrl.get(
        `/reception/walkincount/?doctor_id=${doctorId}&appointment_date=${date}`
      );
 
      if (responseCounts.status === 200) {
        const data = responseCounts.data.reduce((acc, curr) => ({ ...acc, ...curr }), {});
 
        setTotalAppointmentCount(data['Total Appointments']);
        setBookedAppointmentCount(data['Booked Appointments']);
        setCanceledAppointmentsCount(data['Canceled Appointments']);
        setCompletedAppointmentsCount(data['Completed Appointments']);
        setWalkInCount(data['Walk-In']);
        setOnlineCount(data['Online']);
        setFollowUpCount(data['Follow-Up']);
      }
    } catch (error) {
      console.error('Error fetching appointment counts:', error);
    }
  };
 
  useEffect(() => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    fetchSlots(doctorId, formattedDate);
    fetchAppointmentsData(doctorId, clinicId, formattedDate);
  }, [doctorId, clinicId, currentDate, fetchSlots, fetchAppointmentsData]);
 
  const handlePreviousDate = () => {
    const newDate = subDays(currentDate, 1);
    setCurrentDate(newDate);
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    fetchSlots(doctorId, formattedDate);
    fetchAppointmentsData(doctorId, clinicId, formattedDate);
  };
 
  const handleNextDate = () => {
    const newDate = addDays(currentDate, 1);
    setCurrentDate(newDate);
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    fetchSlots(doctorId, formattedDate);
    fetchAppointmentsData(doctorId, clinicId, formattedDate);
  };
 
  const handlePrevious = () => setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
  const handleNext = () => setCurrentIndex(prevIndex => Math.min(prevIndex + 1, todayAppointments.length - 4));
  const handleCompletedPrevious = () => setCompletedIndex(prevIndex => Math.max(prevIndex - 1, 0));
  const handleCompletedNext = () => setCompletedIndex(prevIndex => Math.min(prevIndex + 1, completedAppointments.length - 4));
  const handleCanceledPrevious = () => setCanceledIndex(prevIndex => Math.max(prevIndex - 1, 0));
  const handleCanceledNext = () => setCanceledIndex(prevIndex => Math.min(prevIndex + 1, canceledAppointments.length - 4));
 
  const handleAddSlot = () => history.push('/clinic/createslot');
  const handleBlockSlot = () => setShowBlockSlotModal(true);
  const handleUnblockSlot = () => setShowUnblockSlotModal(true);
 
  const handleBlockFormChange = e => setBlockFormData({ ...blockFormData, [e.target.name]: e.target.value });
  const handleUnblockFormChange = e => setUnblockFormData({ ...unblockFormData, [e.target.name]: e.target.value });
 
  const openConfirmationModal = action => {
    setConfirmationAction(action);
    setShowConfirmationModal(true);
  };
 
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
  };
 
 
  const handleConfirmAction = () => {
    if (confirmAction === 'endVisit') {
      handleEndVisit(selectedAppointment.appointment_id);
    } else if (confirmAction === 'cancelAppointment') {
      handleCancelAppointment(selectedAppointment.appointment_id);
    }
    setShowConfirmModal(false);
  };
 
  const handleEndVisit = async appointmentId => {
    try {
      await BaseUrl.patch('/doctorappointment/completedappointment/', { appointment_id: appointmentId });
      setIsVisitEnded(true);
      setSuccessMessage('Visit ended successfully.');
    } catch (error) {
      setErrorMessage('Error ending visit: ' + error.message);
    }
  };
 
  const handleCancelAppointment = async appointmentId => {
    try {
      await BaseUrl.patch('/doctorappointment/canceledappointment/', { appointment_id: appointmentId });
      setIsCanceled(true);
      setSuccessMessage('Appointment canceled successfully.');
    } catch (error) {
      setErrorMessage('Error canceling appointment: ' + error.message);
    }
  };
 
  const resetModalState = () => {
    setSelectedAppointment(null);
    setVitalsData([]);
    setDisplayedData(null);
    setSelectedAppointmentId(null);
    setSelectedAppointmentDate(null);
    setSelectedDateIndex(null);
  };
 
  const handleAppointmentClick = async (slotOrAppointment) => {
    if (selectedAppointment && selectedAppointment.appointment_id === slotOrAppointment.appointment_id) {
      resetModalState();
    } else {
      resetModalState();
      setSelectedAppointment(slotOrAppointment);
 
      try {
        // Ensure patient_id is available before making the API calls
        if (!slotOrAppointment.patient_id) {
          console.error('Patient ID is missing.');
          setErrorMessage('Patient ID is missing. Cannot retrieve patient details.');
          return;
        }
 
        // Fetch patient details using the API call
        const patientDetailsResponse = await BaseUrl.get(`/patient/patient/`, {
          params: {
            patient_id: slotOrAppointment.patient_id, // Ensure patient_id is passed here
            appointment_id: slotOrAppointment.appointment_id,
          },
        });
 
        if (patientDetailsResponse.status === 200) {
          setPatientDetails(patientDetailsResponse.data);
          setDisplayedData('patientDetails');
        } else {
          console.error('Failed to fetch patient details:', patientDetailsResponse.status);
        }
 
        // Fetch appointment dates and store them
        const response = await BaseUrl.get(`/patientappointment/viewslot/`, {
          params: {
            patient_id: slotOrAppointment.patient_id,
            doctor_id: doctorId,
          },
        });
 
        if (response.status === 200) {
          setAppointmentDetails(response.data.data);
 
          if (response.data.data.length > 0) {
            const firstAppointment = response.data.data[0];
            setSelectedAppointmentDate(firstAppointment.appointment_date);
            setSelectedDateIndex(0);
            setSelectedAppointmentId(firstAppointment.id);
          }
        } else {
          console.error('Failed to fetch appointment dates:', response.status);
        }
      } catch (error) {
        console.error('Error fetching appointment or patient details:', error);
      }
    }
  };
 
  const handleCompletedAppointmentClick = appointment => {
    setSelectedAppointment(appointment);
    setIsVisitEnded(true);
    setIsCanceled(false);
    setShowCompletedModal(true);
  };
 
  const handleCanceledAppointmentClick = appointment => {
    setSelectedAppointment(appointment);
    setIsVisitEnded(false);
    setIsCanceled(true);
    setShowCanceledModal(true);
  };
 
  const submitBlockSlot = async event => {
    event.preventDefault();
    try {
      const response = await BaseUrl.patch('/doctorappointment/slot/', {
        start_date: blockFormData.startDate,
        start_time: blockFormData.startTime,
        end_date: blockFormData.endDate,
        end_time: blockFormData.endTime,
        doctor_id: doctorId,
      });
      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setErrorMessage('');
        setShowBlockSlotModal(false);
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        fetchSlots(doctorId, formattedDate);
      }
    } catch (error) {
      setErrorMessage('Error blocking slot: ' + error.message);
      setSuccessMessage('');
    }
  };
 
  const submitUnblockSlot = async event => {
    event.preventDefault();
    try {
      const response = await BaseUrl.patch('/doctorappointment/unblockslot/', {
        start_date: unblockFormData.startDate,
        start_time: unblockFormData.startTime,
        end_date: unblockFormData.endDate,
        end_time: unblockFormData.endTime,
        doctor_id: doctorId,
      });
      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setErrorMessage('');
        setShowUnblockSlotModal(false);
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        fetchSlots(doctorId, formattedDate);
      }
    } catch (error) {
      setErrorMessage('Error unblocking slot: ' + error.message);
      setSuccessMessage('');
    }
  };
 
  const handleToggleSlotButtons = () => setShowSlotButtons(!showSlotButtons);
  const handleClickOutside = () => setShowSlotButtons(false);
 
  const renderSlotCards = slots => {
    const rows = [];
    for (let i = 0; i < slots.length; i += 4) {
      const slotChunk = slots.slice(i, i + 4);
      rows.push(
        <Row key={i} className="mb-2">
          {slotChunk.map((slot, index) => {
            let cardStyle = {};
            if (slot.is_canceled) {
              cardStyle = { backgroundColor: '#914F1E', color: '#fff' };
            } else if (slot.is_booked) {
              cardStyle = { backgroundColor: '#D1E9F6', color: '#000' };
            } else if (slot.is_blocked) {
              cardStyle = { backgroundColor: '#FFA38F', color: '#000' };
            } else {
              cardStyle = { backgroundColor: '#A2CA71', color: '#000' };
            }
 
            return (
              <Col key={index} md={3} style={{ padding: '4px' }}>
                <Card style={{ margin: '0', padding: '8px', ...cardStyle }}>
                  <Card.Body>
                    <Card.Text>{slot.appointment_slot}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      );
    }
    return rows;
  };
 
  const renderAppointments = () => {
    const endIndex = Math.min(currentIndex + 4, todayAppointments.length);
    const displayedAppointments = todayAppointments.slice(currentIndex, endIndex);
 
    return displayedAppointments.map((appointment, index) => {
      const isSelected =
        selectedAppointment && selectedAppointment.appointment_id === appointment.appointment_id;
 
      const isClickable = !appointment.is_complete && !appointment.is_canceled;
 
      return (
        <Col key={index}>
          <Card
            className="mb-4 shadow-sm reception-card"
            onClick={isClickable ? () => handleAppointmentClick(appointment) : undefined}
            style={{
              border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
              backgroundColor: isSelected ? '#eaf5ff' : '#fff',
              // cursor: isClickable ? 'pointer' : 'not-allowed',
              cursor: 'pointer',
              transition: 'background-color 0.3s, border 0.3s',
            }}
          >
            <Card.Body>
              <Card.Title>{appointment.appointment_slot}</Card.Title>
              <Card.Text>Patient: {appointment.booked_by}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  }; 
 
 
  const renderCompletedAppointments = () => {
    const endIndex = Math.min(completedIndex + 4, completedAppointments.length);
    const displayedAppointments = completedAppointments.slice(completedIndex, endIndex);
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card className="mb-4 shadow-sm reception-card" onClick={() => handleCompletedAppointmentClick(appointment)}>
          <Card.Body>
            <Card.Title>{appointment.appointment_slot}</Card.Title>
            <Card.Text>Completed by: {appointment.doctor_name}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));
  };
 
  const renderCanceledAppointments = () => {
    const endIndex = Math.min(canceledIndex + 4, canceledAppointments.length);
    const displayedAppointments = canceledAppointments.slice(canceledIndex, endIndex);
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card className="mb-4 shadow-sm reception-card" onClick={() => handleCanceledAppointmentClick(appointment)}>
          <Card.Body>
            <Card.Title>{appointment.appointment_slot}</Card.Title>
            <Card.Text>Canceled by: {appointment.doctor_name}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));
  };
 
 
 const renderSelectedAppointmentDetails = () => {
    if (!selectedAppointment) return null;
 
    return (
      <div className="mt-4" style={{ position: 'relative', backgroundColor: '#F4F6F9', padding: '20px 20px 40px 20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
 
        <button
          onClick={() => setSelectedAppointment(null)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#333',
            transition: 'color 0.3s'
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <Row>
          <Col xs={6}>
            <Form.Check
              type="switch"
              id="end-visit-switch"
              label="End Visit"
              checked={isVisitEnded}
              onChange={() => {
                setConfirmAction('endVisit');
                setShowConfirmModal(true);
              }}
              className="me-2"
              style={{
                fontSize: '1.25rem', // Increase font size
                fontWeight: '600', // Increase font weight
              }}
            />
          </Col>
          <Col xs={6}>
            <Form.Check
              type="switch"
              id="cancel-appointment-switch"
              label="Cancel Appointment"
              checked={isCanceled}
              onChange={() => {
                setConfirmAction('cancelAppointment');
                setShowConfirmModal(true);
              }}
              style={{
                fontSize: '1.25rem', // Increase font size
                fontWeight: '600', // Increase font weight
              }}
            />
          </Col>
        </Row>
 
        <Row style={{ paddingTop: '40px' }}>
          <Col md={3} className="appointments-col" style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
            <h5 className="text-center" style={{ cursor: 'pointer', color: '#007bff', fontWeight: '600' }}>Appointments</h5>
            <hr />
            {renderAppointmentDate()}
          </Col>
 
          <Col md={9} className="content-col">
            <Row className="mb-3">
              <Col xs={2}>
                <h5
                  className={`text-center clickable`}
                  onClick={handlePatientDetailsClick}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '5px',
                    border: selectedHeading === 'patientDetails' ? '2px solid #3795BD' : '2px solid transparent',
                    backgroundColor: selectedHeading === 'patientDetails' ? '#d1e9f6' : 'transparent',
                    color: '#007bff',
                    boxShadow: selectedHeading === 'patientDetails' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  Details
                </h5>
              </Col>
              <Col xs={2}>
                <h5
                  className={`text-center clickable`}
                  onClick={handleVitalsClick}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '5px',
                    border: selectedHeading === 'vitals' ? '2px solid #3795BD' : '2px solid transparent',
                    backgroundColor: selectedHeading === 'vitals' ? '#d1e9f6' : 'transparent',
                    color: '#007bff',
                    boxShadow: selectedHeading === 'vitals' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  Vitals
                </h5>
              </Col>
              <Col xs={2}>
                <h5
                  className={`text-center clickable`}
                  onClick={handleSymptomsClick}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '5px',
                    border: selectedHeading === 'symptoms' ? '2px solid #3795BD' : '2px solid transparent',
                    backgroundColor: selectedHeading === 'symptoms' ? '#d1e9f6' : 'transparent',
                    color: '#007bff',
                    boxShadow: selectedHeading === 'symptoms' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  Symptoms
                </h5>
              </Col>
              <Col xs={2}>
                <h5
                  className={`text-center clickable`}
                  onClick={handlePrescriptionClick}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '5px',
                    border: selectedHeading === 'prescription' ? '2px solid #3795BD' : '2px solid transparent',
                    backgroundColor: selectedHeading === 'prescription' ? '#d1e9f6' : 'transparent',
                    color: '#007bff',
                    boxShadow: selectedHeading === 'prescription' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  Prescription
                </h5>
              </Col>
              <Col xs={2}>
                <h5
                  className={`text-center clickable`}
                  onClick={handleDocumentsClick}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '5px',
                    border: selectedHeading === 'documents' ? '2px solid #3795BD' : '2px solid transparent',
                    backgroundColor: selectedHeading === 'documents' ? '#d1e9f6' : 'transparent',
                    color: '#007bff',
                    boxShadow: selectedHeading === 'documents' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  Documents {renderDocumentPreviewModal()}
                </h5>
              </Col>
            </Row>
            <hr />
            <div>
              {displayedData === 'vitals' && renderVitalsData()}
              {displayedData === 'prescription' && renderPrescriptionData()}
              {displayedData === 'patientDetails' && renderPatientDetails()}
              {displayedData === 'documents' && renderDocumentsData()}
              {displayedData === 'symptoms' && renderSymptomsData()}
            </div>
          </Col>
        </Row>
      </div>
    );
  };
 
  const renderAppointmentDate = () => {
    if (appointmentDetails.length === 0) return <p>No appointment dates available.</p>;
 
    return appointmentDetails.map((appointment, index) => (
      <Col key={appointment.id} xs={12} className="mb-2">
        <button
          onClick={() => handleAppointmentDateClick(appointment.appointment_date, appointment.id, index)}
          style={{
            cursor: 'pointer',
            backgroundColor:
              selectedAppointmentDate === appointment.appointment_date && selectedAppointmentId === appointment.id
                ? '#3795BD'
                : 'transparent',
            color:
              selectedAppointmentDate === appointment.appointment_date && selectedAppointmentId === appointment.id
                ? 'white'
                : 'black',
            borderRadius: '5px',
            padding: '10px',
            width: '100%',
            textAlign: 'center',
            transition: 'background-color 0.8s, color 0.8s',
          }}
        >
          {appointment.appointment_date}
        </button>
      </Col>
    ));
  };
 
  const fetchUploadedPrescriptionDocument = async appointmentId => {
    try {
      const formattedDate = new Date(selectedAppointmentDate).toISOString().split('T')[0];
      const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
        params: {
          appointment_id: appointmentId,
          prescription_date: formattedDate,
        },
      });
 
      if (response.status === 200) {
        setUploadedPrescription(response.data);
      } else {
        setUploadedPrescription(null);
      }
    } catch (error) {
      console.error('Error fetching uploaded prescription document:', error);
      setUploadedPrescription(null);
    }
  };
 
  const handlePrescriptionClick = () => {
    setSelectedHeading('prescription');
    if (selectedAppointmentId) {
      Promise.all([
        fetchPrescriptionData(selectedAppointment.patient_id, selectedAppointmentId),
        fetchUploadedPrescriptionDocument(selectedAppointmentId),
      ])
        .then(() => setDisplayedData('prescription'))
        .catch((error) => console.error('Error handling prescription click:', error));
    }
  };
 
  const fetchPrescriptionData = async (patientId, appointmentId) => {
    try {
      const response = await BaseUrl.get(
        `/patient/patientpriscription/?patient_id=${patientId}&appointment_id=${appointmentId}`
      );
      if (response.status === 200) {
        setPrescriptionData(response.data);
      } else {
        setPrescriptionData([]);
      }
    } catch (error) {
      console.error('Error fetching prescription data:', error);
      setPrescriptionData([]);
    }
  };
 
  const handleViewPrescription = async documentId => {
    try {
      if (!documentId) throw new Error('Document ID is required');
 
      const response = await BaseUrl.get(`/patient/patientprescriptonfileView/`, {
        params: { document_id: documentId },
        responseType: 'blob',
      });
 
      if (response.status === 200) {
        const fileType = response.headers['content-type'];
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: fileType }));
 
        setPreviewFileUrl(fileURL);
        setPreviewFileType(fileType);
        setShowPreviewModal(true);
      } else {
        console.error('Failed to fetch prescription file:', response.status);
      }
    } catch (error) {
      console.error('Error fetching prescription file:', error);
    }
  };
 
 
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false); // Simply close the modal without triggering any data change
  };
 
 
  const renderPrescriptionData = () => {
    if (!prescriptionData || prescriptionData.length === 0) return <p>No prescription data available.</p>;
 
    return (
      <div>
        {prescriptionData.map((prescription, index) => (
          <div key={prescription.id} className="mb-3">
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Medicine Name:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={prescription.medicine_name}
                    onChange={e => {
                      const updatedPrescription = [...prescriptionData];
                      updatedPrescription[index].medicine_name = e.target.value;
                      setPrescriptionData(updatedPrescription);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Comment:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={prescription.comment}
                    onChange={e => {
                      const updatedPrescription = [...prescriptionData];
                      updatedPrescription[index].comment = e.target.value;
                      setPrescriptionData(updatedPrescription);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Time:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={prescription.time}
                    onChange={e => {
                      const updatedPrescription = [...prescriptionData];
                      updatedPrescription[index].time = e.target.value;
                      setPrescriptionData(updatedPrescription);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Description:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={prescription.description}
                    onChange={e => {
                      const updatedPrescription = [...prescriptionData];
                      updatedPrescription[index].description = e.target.value;
                      setPrescriptionData(updatedPrescription);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Upload Document:</strong>
                  </Form.Label>
                  <Form.Control type="file" onChange={e => handleFileUpload(e, prescription.id)} />
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <Button variant="primary" onClick={() => handleUpdatePrescription(prescription.id, index)} style={{ marginTop: '20px' }}>
              Update
            </Button>
          </div>
        ))}
 
        {uploadedPrescription && uploadedPrescription.length > 0 && (
          <div className="mt-4">
            <h5>Uploaded Prescription Documents:</h5>
            <Row>
              {uploadedPrescription.map((doc, index) => (
                <Col key={doc.id} md={3} className="mb-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleViewPrescription(doc.id)}
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    View Document {index + 1}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    );
  };
 
  const handleFileUpload = async (event, prescriptionId) => {
    const file = event.target.files[0];
 
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }
 
    const formattedDate = new Date(selectedAppointmentDate).toISOString().split('T')[0];
 
    const matchingAppointment = appointmentDetails.find(
      appointment => appointment.appointment_date === selectedAppointmentDate
    );
 
    if (!matchingAppointment) {
      setErrorMessage('No matching appointment found for the selected date.');
      return;
    }
 
    const appointmentId = matchingAppointment.id;
 
    const formData = new FormData();
    formData.append('document_file', file);
    formData.append('appointment', appointmentId);
    formData.append('document_date', formattedDate);
 
    try {
      const response = await BaseUrl.post('/patient/patientprescriptonfile/', formData);
      if (response.status === 200) {
        setSuccessMessage('File uploaded successfully.');
      } else {
        setErrorMessage('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file. Please try again later.');
    }
  };
 
  const handleUpdatePrescription = async (prescriptionId, index) => {
    try {
      const prescriptionDataItem = prescriptionData[index];
 
      const updateData = {
        prescription_id: prescriptionId,
        patient_id: prescriptionDataItem.patient,
        medicine_name: prescriptionDataItem.medicine_name,
        time: prescriptionDataItem.time,
        comment: prescriptionDataItem.comment,
        description: prescriptionDataItem.description,
        appointment_id: selectedAppointmentId,
      };
 
      const response = await BaseUrl.put(`/patient/patientpriscription/`, updateData);
 
      if (response.status === 200) {
        setSuccessMessage('Prescription updated successfully.');
      } else {
        setErrorMessage('Failed to update prescription.');
        console.error('Response Error:', response.data);
      }
    } catch (error) {
      console.error('Error updating prescription:', error);
      setErrorMessage('Error updating prescription. Please try again later.');
    }
  };
 
  const fetchPatientDetails = async (patientId, appointmentId) => {
    try {
      const response = await BaseUrl.get(`/patient/patient/?patient_id=${patientId}&appointment_id=${appointmentId}`);
      if (response.status === 200) {
        setPatientDetails(response.data);
      } else {
        setPatientDetails(null);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setPatientDetails(null);
    }
  };
 
  const handlePatientDetailsClick = () => {
    setSelectedHeading('patientDetails');
    if (selectedAppointment) {
      fetchPatientDetails(selectedAppointment.patient_id, selectedAppointment.appointment_id)
        .then(() => setDisplayedData('patientDetails'));
    }
  };
 
  const renderPatientDetails = () => {
    if (!patientDetails) return <p>No patient details available.</p>;
 
    return (
      <div>
        <Row className="mt-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Name:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.name}
                onChange={e => setPatientDetails({ ...patientDetails, name: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Age:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.age}
                onChange={e => setPatientDetails({ ...patientDetails, age: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Gender:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.gender}
                onChange={e => setPatientDetails({ ...patientDetails, gender: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Contact:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.mobile_number}
                onChange={e => setPatientDetails({ ...patientDetails, mobile_number: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Address:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.address}
                onChange={e => setPatientDetails({ ...patientDetails, address: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Date Of Birth:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.date_of_birth}
                onChange={e => setPatientDetails({ ...patientDetails, date_of_birth: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <strong>Blood Group:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.blood_group}
                onChange={e => setPatientDetails({ ...patientDetails, blood_group: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
 
        <Button variant="primary" onClick={handleUpdatePatientDetails} style={{ marginTop: '20px', display: 'block' }}>
          Update
        </Button>
      </div>
    );
  };
 
  const handleUpdatePatientDetails = async () => {
    try {
      const updateData = {
        ...patientDetails,
        patient_id: selectedAppointment.patient_id,
        appointment_id: selectedAppointment.appointment_id,
      };
 
      const response = await BaseUrl.put(`/patient/patient/`, updateData);
 
      if (response.status === 200) {
        setSuccessMessage('Patient details updated successfully.');
      } else {
        setErrorMessage('Failed to update patient details.');
      }
    } catch (error) {
      console.error('Error updating patient details:', error);
      setErrorMessage('Error updating patient details. Please try again later.');
    }
  };
 
  const fetchVitalsData = async appointmentId => {
    try {
      const response = await BaseUrl.get('/patient/patientcheckup/', {
        params: {
          appointment_id: appointmentId,
        },
      });
      if (response.status === 200 && response.data.length > 0) {
        setVitalsData(response.data);
      } else {
        setVitalsData([]);
      }
    } catch (error) {
      console.error('Error fetching vitals data:', error);
      setVitalsData([]);
    }
  };
 
  const handleVitalsClick = () => {
    setSelectedHeading('vitals');
    if (selectedAppointmentId) {
      fetchVitalsData(selectedAppointmentId)
        .then(() => setDisplayedData('vitals'));
    }
  };
 
  const renderVitalsData = () => {
    if (!vitalsData || vitalsData.length === 0) return <p>No vitals data available for the selected appointment.</p>;
 
    return (
      <div>
        {vitalsData.map((vital, index) => (
          <div key={index} className="mb-3">
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Blood Pressure:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={vital.blood_pressure}
                    onChange={e => {
                      const updatedVitals = [...vitalsData];
                      updatedVitals[index].blood_pressure = e.target.value;
                      setVitalsData(updatedVitals);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Heart Rate:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={vital.heart_rate}
                    onChange={e => {
                      const updatedVitals = [...vitalsData];
                      updatedVitals[index].heart_rate = e.target.value;
                      setVitalsData(updatedVitals);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Temperature:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={vital.body_temperature}
                    onChange={e => {
                      const updatedVitals = [...vitalsData];
                      updatedVitals[index].body_temperature = e.target.value;
                      setVitalsData(updatedVitals);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Pulse Rate:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={vital.pulse_rate}
                    onChange={e => {
                      const updatedVitals = [...vitalsData];
                      updatedVitals[index].pulse_rate = e.target.value;
                      setVitalsData(updatedVitals);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Hemoglobin:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={vital.hemoglobin}
                    onChange={e => {
                      const updatedVitals = [...vitalsData];
                      updatedVitals[index].hemoglobin = e.target.value;
                      setVitalsData(updatedVitals);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Oxygen Level:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={vital.oxygen_level}
                    onChange={e => {
                      const updatedVitals = [...vitalsData];
                      updatedVitals[index].oxygen_level = e.target.value;
                      setVitalsData(updatedVitals);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant="primary"
              onClick={() => handleUpdateVitals(index)}
              style={{ marginTop: '20px' }}
            >
              Update
            </Button>
          </div>
        ))}
      </div>
    );
  };
 
  const handleUpdateVitals = async index => {
    try {
      const vitalData = vitalsData[index];
 
      const updateData = {
        appointment_id: selectedAppointmentId,
        patient_id: Number(selectedAppointment.patient_id),
        blood_pressure: vitalData.blood_pressure,
        heart_rate: vitalData.heart_rate,
        body_temperature: vitalData.body_temperature,
        pulse_rate: vitalData.pulse_rate,
        hemoglobin: vitalData.hemoglobin,
        oxygen_level: vitalData.oxygen_level,
      };
 
      const response = await BaseUrl.put(`/patient/patientcheckup/`, updateData);
 
      if (response.status === 200) {
        setSuccessMessage('Vitals updated successfully.');
      } else {
        setErrorMessage('Failed to update vitals.');
        console.error('Response Error:', response.data);
      }
    } catch (error) {
      console.error('Error updating vitals:', error);
      setErrorMessage('Error updating vitals. Please try again later.');
    }
  };
 
  const fetchSymptomsData = async appointmentId => {
    try {
      const response = await BaseUrl.get(`/doctor/symptomsdetail/`, {
        params: {
          appointment_id: appointmentId,
        },
      });
      if (response.status === 200 && response.data.length > 0) {
        setSymptomsData(response.data);
      } else {
        setSymptomsData([]);
      }
    } catch (error) {
      console.error('Error fetching symptoms data:', error);
      setSymptomsData([]);
    }
  };
 
 
 
  const handleSymptomsClick = () => {
    setSelectedHeading('symptoms');
    if (selectedAppointmentId) {
      fetchSymptomsData(selectedAppointmentId)
        .then(() => setDisplayedData('symptoms'));
    }
  };
 
  const renderSymptomsData = () => {
    if (!symptomsData || symptomsData.length === 0) return <p>No symptoms data available.</p>;
 
    return (
      <div>
        {symptomsData.map((symptom, index) => (
          <div key={symptom.id} className="mb-3">
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Symptom Name:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.symptoms_name}
                    onChange={e => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].symptoms_name = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Since:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.since || ''}
                    onChange={e => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].since = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Severity:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.severity}
                    onChange={e => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].severity = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>More Options:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.more_options || ''}
                    onChange={e => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].more_options = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Symptom Date:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.symptom_date}
                    onChange={e => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].symptom_date = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={() => handleUpdateSymptoms(symptom.id, index)} style={{ marginTop: '20px' }}>
              Update
            </Button>
          </div>
        ))}
      </div>
    );
  };
 
  const handleUpdateSymptoms = async (symptomId, index) => {
    try {
      const symptomData = symptomsData[index];
 
      const updateData = {
        symptoms_id: symptomId,
        symptoms_name: symptomData.symptoms_name,
        since: symptomData.since,
        severity: symptomData.severity,
        more_options: symptomData.more_options,
        appointment_id: selectedAppointmentId,
      };
 
      const response = await BaseUrl.put(`/doctor/symptomsdetail/`, updateData);
 
      if (response.status === 200) {
        setSuccessMessage('Symptoms updated successfully.');
      } else {
        setErrorMessage('Failed to update symptoms.');
        console.log('Response status:', response.status);
      }
    } catch (error) {
      console.error('Error updating symptoms:', error);
      setErrorMessage('Error updating symptoms. Please try again later.');
    }
  };
 
  const handleAppointmentDateClick = (appointment_date, appointment_id, index) => {
    setSelectedAppointmentDate(appointment_date);
    setSelectedDateIndex(index);
    setSelectedAppointmentId(appointment_id);
 
    if (displayedData === 'vitals') {
      fetchVitalsData(appointment_id);
    }
  };
 
  const handleDocumentsClick = async () => {
    setSelectedHeading('documents'); // Set the heading as selected
 
    if (selectedAppointmentId && selectedAppointmentDate) {
      try {
        const response = await BaseUrl.get(`/patient/patientdocumentusingappointmentid/`, {
          params: {
            appointment: selectedAppointmentId,
            document_date: selectedAppointmentDate,
          }
        });
 
        if (response.status === 200 && response.data.length > 0) {
          setDocumentsData(response.data);
          setDisplayedData('documents');
        } else {
          setDocumentsData([]);
          setDisplayedData('documents'); // Ensure 'documents' is displayed even if there's no data
        }
      } catch (error) {
        console.error('Error fetching documents data:', error);
        setDocumentsData([]);
        setDisplayedData('documents'); // Ensure 'documents' is displayed even on error
      }
    } else {
      setDocumentsData([]);
      setDisplayedData('documents'); // Ensure 'documents' is displayed if the conditions aren't met
    }
  };
 
 
  const renderDocumentsData = () => {
    if (!documentsData || documentsData.length === 0) return <p>No documents available.</p>;
 
    return (
      <div>
        {documentsData.map(document => (
          <div key={document.id} className="mb-3" style={{ cursor: 'pointer' }}>
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document Name:</strong>
                  </Form.Label>
                  <Form.Control type="text" value={document.document_name} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document Date:</strong>
                  </Form.Label>
                  <Form.Control type="text" value={document.document_date} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document Type:</strong>
                  </Form.Label>
                  <Form.Control type="text" value={document.document_type} readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document File:</strong>
                  </Form.Label>
                  <Button
                    variant="primary"
                    onClick={() => viewDocument(document.id)}
                    style={{
                      backgroundColor: '#5c85d6',
                      borderColor: '#5c85d6',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      transition: 'background-color 0.3s, transform 0.3s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4c75c6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5c85d6')}
                    aria-label={`View document ${document.document_name}`}
                  >
                    View Document
                  </Button>
                </Form.Group>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </div>
    );
  };
 
  const viewDocument = async documentId => {
    try {
      if (!documentId) throw new Error('Document ID is required');
 
      const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
        params: {
          document_id: documentId,
        },
        responseType: 'blob',
      });
 
      const fileType = response.headers['content-type'];
      const url = URL.createObjectURL(response.data);
 
      setPreviewFileType(fileType);
      setPreviewFileUrl(url);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error fetching document:', error);
      setErrorMessage('Error fetching document. Please try again later.');
    }
  };
 
  const renderDocumentPreviewModal = () => (
    <Modal
      show={showPreviewModal}
      onHide={handleClosePreviewModal}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Document Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center' }}>
        {previewFileType && previewFileUrl ? (
          previewFileType.includes('image') ? (
            <img src={previewFileUrl} alt="Document Preview" style={{ maxWidth: '100%', height: '400px' }} />
          ) : previewFileType.includes('pdf') ? (
            <iframe src={previewFileUrl} style={{ width: '100%', height: '500px' }} title="Document Preview"></iframe>
          ) : (
            <p>Cannot preview this document type.</p>
          )
        ) : (
          <p>Loading document...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosePreviewModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
 
 
  return (
    <Container fluid className="p-5 bg-light reception-container">
      <header className="mb-5 reception-header d-flex justify-content-between align-items-center">
        <img src={LeftLogo} className="left-logo" alt="Left Logo" />
        <div>
          <h1 className="text-center text-primary">Welcome to Niramaya Homeopathy Clinic</h1>
          <p className="text-center text-muted">Providing the best care for you and your family</p>
        </div>
        <img src={RightLogo} className="right-logo" alt="Right Logo" />
      </header>
 
      <div className="d-flex justify-content-center align-items-center mb-4">
        <button className="btn btn-outline-primary me-3" onClick={handlePreviousDate}>
          &larr;
        </button>
        <h4 className="text-center m-0">{formattedDate}</h4>
        <button className="btn btn-outline-primary ms-3" onClick={handleNextDate}>
          &rarr;
        </button>
      </div>
 
      <Row className="mb-4 text-center">
        <Col>
          <Card.Body>
            <Card.Title>Appointments</Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{totalAppointmentCount}</Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Booked</Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{bookedAppointmentCount}</Card.Text>
          </Card.Body>
        </Col>

        <Col>
          <Card.Body>
            <Card.Title>Completed</Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{completedAppointmentsCount}</Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Canceled </Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{canceledAppointmentsCount}</Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Walk-Ins</Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{walkInCount}</Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Online</Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{onlineCount}</Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Follow-Ups</Card.Title>
            <Card.Text style={{ paddingTop: '10px', fontSize: '22px' }}>{followUpCount}</Card.Text>
          </Card.Body>
        </Col>
      </Row>
      <hr />
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
          <span className="legend-dot" style={{ backgroundColor: '#A2CA71' }}></span>
          <span className="legend-text">Available</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: '#D1E9F6' }}></span>
          <span className="legend-text">Booked</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: '#FFA38F' }}></span>
          <span className="legend-text">Blocked</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: '#914F1E' }}></span>
          <span className="legend-text">Canceled</span>
        </div>
      </div>
 
      <Row>
        <Col>
          <h5 className="text-center">Morning</h5>
          {morningSlots.length > 0 ? (
            renderSlotCards(morningSlots)
          ) : (
            <p className="text-center text-danger">Slots are not available in the morning.</p>
          )}
        </Col>
        <Col>
          <h5 className="text-center">Afternoon</h5>
          {afternoonSlots.length > 0 ? (
            renderSlotCards(afternoonSlots)
          ) : (
            <p className="text-center text-danger">Slots are not available in the afternoon.</p>
          )}
        </Col>
        <Col>
          <h5 className="text-center">Evening</h5>
          {eveningSlots.length > 0 ? (
            renderSlotCards(eveningSlots)
          ) : (
            <p className="text-center text-danger">Slots are not available in the evening.</p>
          )}
        </Col>
      </Row>
 
      <hr />
 
      <h3 className="text-center">Today's Appointments</h3>
      <Row className="mb-4 text-center align-items-center justify-content-center appointment-list">
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handlePrevious} disabled={currentIndex === 0}>
            <BsChevronLeft />
          </Button>
        </Col>
        {todayAppointments.length > 0 ? (
          renderAppointments()
        ) : (
          <Col xs="auto" className="d-flex justify-content-center">
            <div className="alert alert-danger p-2" style={{ maxWidth: '350px', display: 'inline-block' }} role="alert">
              {'No appointments available for today.'}
            </div>
          </Col>
        )}
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleNext}
            disabled={currentIndex >= todayAppointments.length - 4}
          >
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
 
      {renderSelectedAppointmentDetails()}
 
      <hr />
 
      <h3 className="text-center">Completed Appointments</h3>
      <Row className="mb-4 text-center align-items-center justify-content-center">
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleCompletedPrevious} disabled={completedIndex === 0}>
            <BsChevronLeft />
          </Button>
        </Col>
        {completedAppointments.length > 0 ? (
          renderCompletedAppointments()
        ) : (
          <Col xs="auto" className="d-flex justify-content-center">
            <div className="alert alert-danger p-2" style={{ maxWidth: '350px', display: 'inline-block' }} role="alert">
              {'No completed appointments available.'}
            </div>
          </Col>
        )}
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleCompletedNext}
            disabled={completedIndex >= completedAppointments.length - 4}
          >
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
      <hr />
 
      <h3 className="text-center">Canceled Appointments</h3>
      <Row className="mb-4 text-center align-items-center justify-content-center">
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleCanceledPrevious} disabled={canceledIndex === 0}>
            <BsChevronLeft />
          </Button>
        </Col>
        {canceledAppointments.length > 0 ? (
          renderCanceledAppointments()
        ) : (
          <Col xs="auto" className="d-flex justify-content-center">
            <div className="alert alert-danger p-2" style={{ maxWidth: '350px', display: 'inline-block' }} role="alert">
              {'No canceled appointments available.'}
            </div>
          </Col>
        )}
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleCanceledNext}
            disabled={canceledIndex >= canceledAppointments.length - 4}
          >
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
 
      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm reception-card">
            <Card.Body>
              <Card.Title>Book Appointment</Card.Title>
              <Card.Text>Book Appointment with our Experienced Doctors.</Card.Text>
              <Button as={Link} to="/clinic/appointmentbook" variant="primary">
                Book Appointment
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm reception-card">
            <Card.Body>
              <Card.Title>See Your Appointment</Card.Title>
              <Card.Text>See your Appointment details</Card.Text>
              <Button as={Link} to="/clinic/bookedappointment" variant="primary">
                Booked Appointments
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
 
      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm reception-card">
            <Card.Body>
              <Card.Title>Manage Slots</Card.Title>
              <Card.Text>Get your Appointment Slots Today</Card.Text>
              <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                <Button variant="primary" className="dropdown-toggle" onMouseEnter={handleToggleSlotButtons}>
                  Manage Slots
                </Button>
                {showSlotButtons && (
                  <div
                    className="dropdown-menu show"
                    onMouseLeave={handleClickOutside}
                    style={{
                      display: 'block',
                      position: 'absolute',
                      left: '100%',
                      top: '-90px',
                      marginLeft: '10px',
                      zIndex: 1000,
                      minWidth: '160px',
                      backgroundColor: '#fff',
                      boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                      padding: '12px 16px',
                    }}
                  >
                    <Button
                      className="dropdown-item"
                      onClick={handleAddSlot}
                      style={{ width: '100%', marginBottom: '10px' }}
                    >
                      Add Slot
                    </Button>
                    <Button
                      className="dropdown-item"
                      onClick={handleBlockSlot}
                      style={{ width: '100%', marginBottom: '10px' }}
                    >
                      Block Slot
                    </Button>
                    <Button className="dropdown-item" onClick={handleUnblockSlot} style={{ width: '100%' }}>
                      Unblock Slot
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
 
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm reception-card">
            <Card.Body>
              <Card.Title>Patient Vitals</Card.Title>
              <Card.Text>View the patient's Vitals and Prescriptions.</Card.Text>
              <Button as={Link} to="/clinic/" variant="primary">
                Patient Vitals
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm reception-card">
            <Card.Body>
              <Card.Title>Manage Patient</Card.Title>
              <Card.Text>Upload Records and manage Details of patients.</Card.Text>
              <Button as={Link} to="/clinic/" variant="primary">
                Manage Patient
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
 
      <Row className="mb-4">
        <Col md={4}>
          <Card.Body>
            <Card.Title>Clinic</Card.Title>
            <Card.Text>Explore our Clinic services and treatment offered.</Card.Text>
            <Button as={Link} to="/clinic/" variant="primary">
              Explore Clinic
            </Button>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Body>
            <Card.Title>Billing</Card.Title>
            <Card.Text>Manage the Billing the Payment of the customers.</Card.Text>
            <Button as={Link} to="/clinic/" variant="primary">
              Payment
            </Button>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Body>
            <Card.Title>Patient</Card.Title>
            <Card.Text>Register new patients and manage existing patient records.</Card.Text>
            <Button as={Link} to="/clinic/" variant="primary">
              Register
            </Button>
          </Card.Body>
        </Col>
      </Row>
 
      <Modal show={showConfirmationModal} onHide={closeConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {confirmationAction === 'endVisit' ? 'end the visit' : 'cancel the appointment'}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmationModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmActionHandler}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
 
      <Modal show={showBlockSlotModal} onHide={() => setShowBlockSlotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Block Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitBlockSlot}>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={blockFormData.startDate}
                onChange={handleBlockFormChange}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="endDate" value={blockFormData.endDate} onChange={handleBlockFormChange} />
            </Form.Group>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={blockFormData.startTime}
                onChange={handleBlockFormChange}
              />
            </Form.Group>
            <Form.Group controlId="endTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control type="time" name="endTime" value={blockFormData.endTime} onChange={handleBlockFormChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Block Slot
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockSlotModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
 
      <Modal show={showUnblockSlotModal} onHide={() => setShowUnblockSlotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unblock Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitUnblockSlot}>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={unblockFormData.startDate}
                onChange={handleUnblockFormChange}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={unblockFormData.endDate}
                onChange={handleUnblockFormChange}
              />
            </Form.Group>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={unblockFormData.startTime}
                onChange={handleUnblockFormChange}
              />
            </Form.Group>
            <Form.Group controlId="endTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={unblockFormData.endTime}
                onChange={handleUnblockFormChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Unblock Slot
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnblockSlotModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
 
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {confirmAction === 'endVisit' ? 'end this visit' : 'cancel this appointment'}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
 
    </Container>
  );
};
 
export default ClinicHome;
 
 
 