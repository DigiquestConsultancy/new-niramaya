import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, FormGroup } from 'react-bootstrap';
import { faFileAlt, faReceipt, faTimes as faTimesSolid, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { format, addDays, subDays } from 'date-fns';
import { FaTimes } from "react-icons/fa";
import { Link, useHistory } from 'react-router-dom';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import BaseUrl from '../../api/BaseUrl';
import '../../css/ReceptionHome.css';
import RightLogo from '../../images/pic.jpeg';
import LeftLogo from '../../images/logon.jpeg';
import { jwtDecode } from 'jwt-decode';
 
const ReceptionHome = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
 
  const [decodedDoctorId, setDecodedDoctorId] = useState(null);
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.doctor_id) {
          setDecodedDoctorId(decoded.doctor_id);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
 
  const token = localStorage.getItem('token');
  const payload = token ? jwtDecode(token) : {};
  const doctorId = payload.doctor_id;
  const receptionId = payload.reception_id;
 
 
  const [bookedAppointmentCount, setBookedAppointmentCount] = useState();
  const [totalAppointmentCount, setTotalAppointmentCount] = useState();
  const [canceledAppointmentsCount, setCanceledAppointmentsCount] = useState();
  const [completedAppointmentsCount, setCompletedAppointmentsCount] = useState();
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
 
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [blockFormData, setBlockFormData] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [unblockFormData, setUnblockFormData] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [showSlotButtons, setShowSlotButtons] = useState(false);
  const [isVisitEnded, setIsVisitEnded] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [vitalsData, setVitalsData] = useState(null);
  const [displayedData, setDisplayedData] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedHeading, setSelectedHeading] = useState(null);
 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
 
  const [selectedTodayAppointment, setSelectedTodayAppointment] = useState(null);
  const [selectedCompletedAppointment, setSelectedCompletedAppointment] = useState(null);
  const [selectedCanceledAppointment, setSelectedCanceledAppointment] = useState(null);
 
  const [isPrescriptionDocs, setIsPrescriptionDocs] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const history = useHistory();
 
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
      setMorningSlots([]);
      setAfternoonSlots([]);
      setEveningSlots([]);
      setErrorMessage('Error fetching slots. Please try again later.');
    }
  }, []);
 
  const fetchAppointmentsData = useCallback(async (doctorId, receptionId, date) => {
    if (receptionId) {
      try {
        const response = await BaseUrl.get(`/reception/allappointments/?reception_id=${receptionId}&appointment_date=${date}`);
        const appointments = response.data;
        const todayAppointments = appointments.filter((app) => !app.is_complete && !app.is_canceled);
        const completedAppointments = appointments.filter((app) => app.is_complete);
        const canceledAppointments = appointments.filter((app) => app.is_canceled);
 
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
        console.error(error);
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
      console.error(error);
    }
  };
 
 
  const [uploadedPrescription, setUploadedPrescription] = useState(null);
 
  const fetchUploadedPrescriptionDocument = async (appointmentId) => {
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
      setUploadedPrescription(null);
      setError(error.response?.data?.error || error.message || 'An unexpected error occurred.');
    }
  };
 
 
  const handlePrescriptionClick = () => {
    setSelectedHeading('prescription');
    if (selectedAppointmentId && selectedAppointment.patient_id) {
      setPrescriptionData([]);
      setFormPrescription({
        medicine_name: '',
        comment: '',
        time: '',
        description: ''
      });
 
      Promise.all([
        fetchPrescriptionData(selectedAppointment.patient_id, selectedAppointmentId),
        fetchUploadedPrescriptionDocument(selectedAppointmentId)
      ])
        .then(() => {
          setDisplayedData('prescription');
        })
        .catch((error) => {
          setError(error.response?.data?.error || error.message || 'An unexpected error occurred.');
        });
    }
  };
 
  const fetchPrescriptionData = async (patientId, appointmentId) => {
    try {
      const response = await BaseUrl.get(`/patient/patientpriscription/?patient_id=${patientId}&appointment_id=${appointmentId}`);
      if (response.data.length > 0) {
        const prescriptions = response.data.map(prescription => ({
          ...prescription,
          patient_id: patientId
        }));
 
        setPrescriptionData(prescriptions);
 
        const updatedFormPrescription = prescriptions.map(prescription => ({
          medicine_name: prescription.medicine_name || "",
          comment: prescription.comment || "",
          time: prescription.time || "",
          description: prescription.description || "",
          prescription_id: prescription.id
        }));
 
        setFormPrescription(updatedFormPrescription);
      } else {
        setPrescriptionData([]);
        setFormPrescription([{
          medicine_name: "",
          comment: "",
          time: "",
          description: ""
        }]);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch prescription data.');
    }
  };
 
  const [formPrescription, setFormPrescription] = useState({
    medicine_name: '',
    comment: '',
    time: '',
    description: ''
  });
 
  const handleViewPrescription = async (documentId) => {
    try {
      if (!documentId) {
        throw new Error('Document ID is required');
      }
 
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
        setError(null);
      } else {
        setError(error.response?.data?.error || error.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'An unexpected error occurred.');
    }
  };
 
  const renderPrescriptionData = () => {
    const hasPrescriptions = prescriptionData && prescriptionData.length > 0;
 
    return (
      <div style={{ padding: '20px' }}>
        {hasPrescriptions ? (
          prescriptionData.map((result, index) => (
            <div key={result.id} className="mb-3 position-relative">
              <Row className="mt-3">
                <Col md={3}>
                  <FormGroup>
                    <Form.Label><strong>Medicine Name:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={result.medicine_name}
                      onChange={(e) => handlePrescriptionFieldChange(e, index, 'medicine_name')}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Form.Label><strong>Precautions:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={result.comment}
                      onChange={(e) => handlePrescriptionFieldChange(e, index, 'comment')}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Form.Label><strong>Time:</strong></Form.Label>
                    <Form.Control
                      as="select"
                      value={result.time}
                      onChange={(e) => handlePrescriptionFieldChange(e, index, 'time')}
                    >
                      <option value="morning">Morning</option>
                      <option value="morning-afternoon">Morning-Afternoon</option>
                      <option value="morning-afternoon-evening">Morning-Afternoon-Evening</option>
                      <option value="morning-afternoon-evening-night">Morning-Afternoon-Evening-Night</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </Form.Control>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Form.Label><strong>Description:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={result.description}
                      onChange={(e) => handlePrescriptionFieldChange(e, index, 'description')}
                    />
                  </FormGroup>
                </Col>
 
                <Col md={3} className='mt-2'>
                  <Form.Label><strong>Action</strong></Form.Label>
                  <DropdownButton
                    align="end"
                    drop="end"
                    title={<i className="bi bi-three-dots" />}
                    variant="secondary"
                    id={`dropdown-${document.id}`}
                  >
                    <Dropdown.Item onClick={() => handleUpdatePrescription(result.id, index)}>Update</Dropdown.Item>
                    <Dropdown.Item onClick={() => deletePrescription(result.id)}>Remove</Dropdown.Item>
                  </DropdownButton>
                </Col>
 
              </Row>
              <hr />
            </div>
          ))
        ) : (
          <Row>
            <Col md={3}>
              <FormGroup>
                <Form.Label><strong>Medicine Name</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="medicine_name"
                  placeholder="Enter medicine name"
                  value={formPrescription.medicine_name}
                  onChange={handlePrescriptionChange}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Form.Label><strong>Precautions</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="Enter comment"
                  value={formPrescription.comment}
                  onChange={handlePrescriptionChange}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Form.Label><strong>Time</strong></Form.Label>
                <Form.Control
                  as="select"
                  name="time"
                  value={formPrescription.time}
                  onChange={handlePrescriptionChange}
                >
                  <option value="">Select Time</option>
                  <option value="morning">Morning</option>
                  <option value="morning-afternoon">Morning-Afternoon</option>
                  <option value="morning-afternoon-evening">Morning-Afternoon-Evening</option>
                  <option value="morning-afternoon-evening-night">Morning-Afternoon-Evening-Night</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </Form.Control>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Form.Label><strong>Description</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Enter description"
                  value={formPrescription.description}
                  onChange={handlePrescriptionChange}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
 
        <Col md={6} className='mb-5 mt-4'>
          <Form.Group>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant='primary' onClick={handlePrescriptionSubmit}>
                Save Prescription
              </Button>
              <Button variant='primary' onClick={handleAddPrescription}>
                Add Prescription
              </Button>
              <Button variant='outline-primary' onClick={() => document.getElementById('fileUpload').click()}>
                Upload Document
              </Button>
            </div>
          </Form.Group>
        </Col>
 
        <input
          type="file"
          id="fileUpload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
 
        {uploadedPrescription && uploadedPrescription.length > 0 && (
          <div className="mt-4">
            <h5>Uploaded Prescription Documents:</h5>
            <Row>
              {uploadedPrescription.map((result, index) => (
                <Col key={index} md={3} className="mb-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleViewPrescription(result.id)}
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
 
  const handleAddPrescription = () => {
    setPrescriptionData([
      ...prescriptionData,
      { medicine_name: '', comment: '', time: '', description: '' }
    ]);
  };
 
  const handlePrescriptionFieldChange = (e, index, field) => {
    const { value } = e.target;
    const updatedPrescriptions = [...prescriptionData];
    updatedPrescriptions[index][field] = value;
    setPrescriptionData(updatedPrescriptions);
  };
 
  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setFormPrescription((prev) => ({ ...prev, [name]: value }));
  };
 
  const handlePrescriptionSubmit = async () => {
    try {
      const hasExistingPrescriptions = prescriptionData.length > 0;
      const latestPrescription = hasExistingPrescriptions ? prescriptionData[prescriptionData.length - 1] : formPrescription;
 
      const isNewPrescription = !hasExistingPrescriptions || !latestPrescription.id;
 
      const formData = new FormData();
      formData.append('appointment_id', selectedAppointmentId);
      formData.append('patient_id', selectedAppointment.patient_id);
      formData.append('medicine_name', latestPrescription.medicine_name || '');
      formData.append('comment', latestPrescription.comment || '');
      formData.append('time', latestPrescription.time || '');
      formData.append('description', latestPrescription.description || '');
 
      const endpoint = '/patient/patientpriscription/';
      const response = isNewPrescription
        ? await BaseUrl.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        : await BaseUrl.put(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
 
      if (response.status === 200 && response.data.success) {
        setSuccessMessage(response.data.success);
        setErrorMessage(null);
        await fetchPrescriptionData(selectedAppointment.patient_id, selectedAppointmentId);
      } else {
        setErrorMessage('Failed to save prescription data.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while saving prescription.');
    }
  };
 
  const deletePrescription = async (prescriptionId) => {
    try {
      if (!prescriptionId) {
        setErrorMessage("Prescription ID is missing.");
        return;
      }
      const response = await BaseUrl.delete(`/patient/patientpriscription/`, {
        params: { prescription_id: prescriptionId }
      });
 
      if (response.status === 200) {
        setSuccessMessage('Prescription deleted successfully.');
        setErrorMessage(null);
 
        await fetchPrescriptionData(selectedAppointment.patient_id, selectedAppointmentId);
      } else {
        setErrorMessage('Failed to delete prescription.');
      }
    } catch (error) {
      setErrorMessage('Error deleting prescription. Please try again later.');
    }
  };
 
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }
    const formattedDate = new Date(selectedAppointmentDate).toISOString().split('T')[0];
    const matchingAppointment = appointmentDetails.find(
      (appointment) => appointment.appointment_date === selectedAppointmentDate
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
      setErrorMessage('Error uploading file. Please try again later.');
    }
  };
 
 
  const handleUpdatePrescription = async (prescriptionId, index) => {
    try {
      const prescriptionDataItem = prescriptionData[index];
      if (!prescriptionId) {
        setErrorMessage("Prescription ID is missing.");
        return;
      }
      const updateData = new FormData();
      updateData.append('prescription_id', prescriptionId);
      updateData.append('patient_id', prescriptionDataItem.patient);
      updateData.append('medicine_name', prescriptionDataItem.medicine_name);
      updateData.append('time', prescriptionDataItem.time);
      updateData.append('comment', prescriptionDataItem.comment);
      updateData.append('description', prescriptionDataItem.description);
 
      const response = await BaseUrl.put(`/patient/patientpriscription/`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
 
      if (response.status === 200) {
        setSuccessMessage('Prescription updated successfully.');
        setErrorMessage(null);
 
        await fetchPrescriptionData(selectedAppointment.patient_id, selectedAppointmentId);
      } else {
        setErrorMessage('Failed to update prescription.');
      }
    } catch (error) {
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
      setPatientDetails(null);
    }
  };
 
  const handlePatientDetailsClick = () => {
    setSelectedHeading('patientDetails');
    if (selectedAppointment) {
      fetchPatientDetails(selectedAppointment.patient_id, selectedAppointment.appointment_id)
        .then(() => setDisplayedData('patientDetails'))
        .catch((error) => {
          setError(error.response?.data?.error || error.message || 'An unexpected error occurred.');
        });
    }
  };
 
  const renderPatientDetails = () => {
    if (!patientDetails) {
      return <p>No patient details available.</p>;
    }
    return (
      <div>
 
        <Row className="mt-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Name:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.name}
                onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Age:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.age}
                onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Gender:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.gender}
                onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Contact:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.mobile_number}
                onChange={(e) => setPatientDetails({ ...patientDetails, mobile_number: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Address:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.address}
                onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Date Of Birth:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.date_of_birth}
                onChange={(e) => setPatientDetails({ ...patientDetails, date_of_birth: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>Blood Group:</strong></Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.blood_group}
                onChange={(e) => setPatientDetails({ ...patientDetails, blood_group: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label><strong>E-mail:</strong></Form.Label>
              <Form.Control
                type="emal"
                value={patientDetails.email}
                onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
 
        <Button
          variant="primary"
          onClick={handleUpdatePatientDetails}
          style={{ marginTop: '20px', display: 'block' }}
        >
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
        setSuccessMessage(response.data.message);
      } else {
        setErrorMessage('Failed to update patient details.');
      }
    } catch (error) {
      setErrorMessage('Error updating patient details. Please try again later.');
    }
  };
 
  const [isNewVitals, setIsNewVitals] = useState(true);
 
  const fetchVitalsData = async (appointmentId) => {
    try {
      const response = await BaseUrl.get(`/patient/vital/`, {
        params: { appointment_id: appointmentId },
      });
 
      if (response.status === 200 && response.data.length > 0) {
        setVitalsData(response.data);
        setIsNewVitals(false);
        setFormVitals({
          height: response.data[0]?.height || "",
          weight: response.data[0]?.weight || "",
          body_temperature: response.data[0]?.body_temperature || "",
          blood_pressure: response.data[0]?.blood_pressure || "",
          pulse_rate: response.data[0]?.pulse_rate || "",
          heart_rate: response.data[0]?.heart_rate || "",
          oxygen_level: response.data[0]?.oxygen_level || "",
          sugar_level: response.data[0]?.sugar_level || "",
          bmi: response.data[0]?.bmi || "",
        });
      } else {
        setVitalsData([]);
        setIsNewVitals(true);
        setFormVitals({
          height: "",
          weight: "",
          body_temperature: "",
          blood_pressure: "",
          pulse_rate: "",
          heart_rate: "",
          oxygen_level: "",
          sugar_level: "",
          bmi: "",
        });
      }
    } catch (error) {
      setErrorMessage('Failed to fetch vitals data.');
      setFormVitals({
        height: "",
        weight: "",
        body_temperature: "",
        blood_pressure: "",
        pulse_rate: "",
        heart_rate: "",
        oxygen_level: "",
        sugar_level: "",
        bmi: "",
      });
      setIsNewVitals(true);
    }
  };
 
  const handleVitalsClick = () => {
    setSelectedHeading('vitals');
    if (selectedAppointmentId) {
      fetchVitalsData(selectedAppointmentId)
        .then(() => setDisplayedData('vitals'));
    }
  };
 
  const [formVitals, setFormVitals] = useState({
    height: vitalsData?.[0]?.height || "",
    weight: vitalsData?.[0]?.weight || "",
    body_temperature: vitalsData?.[0]?.body_temperature || "",
    blood_pressure: vitalsData?.[0]?.blood_pressure || "",
    pulse_rate: vitalsData?.[0]?.pulse_rate || "",
    heart_rate: vitalsData?.[0]?.heart_rate || "",
    oxygen_level: vitalsData?.[0]?.oxygen_level || "",
    sugar_level: vitalsData?.[0]?.sugar_level || "",
    bmi: vitalsData?.[0]?.bmi || "",
  });
 
  const renderVitalsData = () => {
    return (
      <div style={{ padding: "20px" }}>
        <Row>
          <Col md={3}>
            <Form.Group controlId="formBasicTemperature">
              <Form.Label><strong>Temperature</strong></Form.Label>
              <Form.Control
                type="number"
                name="body_temperature"
                placeholder="Enter temperature"
                value={formVitals.body_temperature}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicBP">
              <Form.Label><strong>Blood Pressure</strong></Form.Label>
              <Form.Control
                type="number"
                name="blood_pressure"
                placeholder="Enter blood pressure"
                value={formVitals.blood_pressure}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicPulse">
              <Form.Label><strong>Pulse Rate</strong></Form.Label>
              <Form.Control
                type="number"
                name="pulse_rate"
                placeholder="Enter pulse rate"
                value={formVitals.pulse_rate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicRespiration">
              <Form.Label><strong>Heart Rate</strong></Form.Label>
              <Form.Control
                type="number"
                name="heart_rate"
                placeholder="Enter heart rate"
                value={formVitals.heart_rate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicOxygen">
              <Form.Label><strong>Oxygen Level</strong></Form.Label>
              <Form.Control
                type="number"
                name="oxygen_level"
                placeholder="Enter oxygen level"
                value={formVitals.oxygen_level}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicGlucose">
              <Form.Label><strong>Sugar Level</strong></Form.Label>
              <Form.Control
                type="number"
                name="sugar_level"
                placeholder="Enter sugar level"
                value={formVitals.sugar_level}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicHeight">
              <Form.Label><strong>Height</strong></Form.Label>
              <Form.Control
                type="number"
                name="height"
                placeholder="Enter height (in cm)"
                value={formVitals.height}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicWeight">
              <Form.Label><strong>Weight</strong></Form.Label>
              <Form.Control
                type="number"
                name="weight"
                placeholder="Enter weight (in kg)"
                value={formVitals.weight}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicBMI">
              <Form.Label><strong>BMI</strong></Form.Label>
              <Form.Control
                type="number"
                name="bmi"
                placeholder="Enter BMI"
                value={formVitals.bmi}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
        <Button className='mt-4' onClick={handleVitalsSubmit}>Save Vitals</Button>
      </div>
    );
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
 
    setFormVitals((prev) => {
      const updatedVitals = { ...prev, [name]: value };
      const { weight, height } = updatedVitals;
      if (name === 'weight' || name === 'height') {
        const heightInMeters = height / 100;
        if (heightInMeters > 0 && weight > 0) {
          const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
          updatedVitals.bmi = calculatedBMI;
        }
      }
 
      return updatedVitals;
    });
  };
 
  const handleVitalsSubmit = async () => {
    const isEmpty = Object.values(formVitals).every((value) => value === "");
 
    if (isEmpty) {
      setErrorMessage("Please fill in at least one field to save the vitals data.");
      return;
    }
 
    try {
      const vitalRequestData = {
        appointment_id: selectedAppointmentId,
        patient_id: Number(selectedAppointment.patient_id),
        blood_pressure: Number(formVitals.blood_pressure),
        body_temperature: Number(formVitals.body_temperature),
        pulse_rate: Number(formVitals.pulse_rate),
        heart_rate: Number(formVitals.heart_rate),
        sugar_level: Number(formVitals.sugar_level),
        oxygen_level: Number(formVitals.oxygen_level),
        weight: Number(formVitals.weight),
        height: Number(formVitals.height),
        bmi: Number(formVitals.bmi),
      };
 
      const response = isNewVitals
        ? await BaseUrl.post(`/patient/vital/`, vitalRequestData)
        : await BaseUrl.put(`/patient/vital/`, vitalRequestData);
 
      if (response.status === 200) {
        setSuccessMessage(isNewVitals ? 'Vitals created successfully.' : 'Vitals updated successfully.');
        setErrorMessage(null);
        await fetchVitalsData(selectedAppointmentId);
      } else {
        setErrorMessage('Failed to save vitals data.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while saving vitals.');
    }
  };
 
  const [symptomsData, setSymptomsData] = useState([]);
  const [fetchError, setFetchError] = useState("");
 
  const clearMessagesAfterTimeout = () => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
      setFetchError("");
    }, 5000);
  };
 
  const fetchSymptomsData = async (appointmentId) => {
    setFetchError("");
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
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
      setSymptomsData([]);
      setFetchError(
        error.response?.data?.error || error.message || "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };
 
  const handleSymptomsClick = () => {
    setSelectedHeading("symptoms");
    if (selectedAppointmentId) {
      fetchSymptomsData(selectedAppointmentId).then(() =>
        setDisplayedData("symptoms")
      );
    }
  };
 
const renderSymptomsData = () => {
    return (
      <div>
        {loading && <div className="loader">Loading...</div>}
 
        {successMessage && (
          <div className="alert alert-success text-center" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}
        {fetchError && (
          <div className="alert alert-danger text-center" role="alert">
            {fetchError}
          </div>
        )}
 
        <Form inline className="mb-3">
          <Form.Group
            className="mb-0"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Form.Control
              type="text"
              placeholder="Search Symptoms"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginRight: "10px", flex: 1 }}
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </Form.Group>
        </Form>
 
        {searchResults.length > 0 && (
          <div
            className="search-results"
            style={{
              marginTop: "-15px",
              border: "1px solid #ddd",
              padding: "10px",
              // backgroundColor: "#f9f9f9",
              fontWeight: "bold",
              backgroundColor: "#D7EAF0",
            }}
          >
            {searchResults.map((result) => (
              <p
                key={result.id}
                onClick={() => handleSelectSearchResult(result)}
                style={{ cursor: "pointer", padding: "5px 0" }}
              >
                {result.symptoms_name}
              </p>
            ))}
          </div>
        )}
 
        <hr />
 
        <h4>Add New Symptom</h4>
        <Row className="mt-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Symptom Name:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={newSymptom.symptoms_name}
                onChange={(e) =>
                  setNewSymptom({
                    ...newSymptom,
                    symptoms_name: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Since:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={newSymptom.since}
                onChange={(e) =>
                  setNewSymptom({ ...newSymptom, since: e.target.value })
                }
              />
            </Form.Group>
          </Col>
 
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Severity:</strong>
              </Form.Label>
              <Form.Select
                name="severity"
                value={newSymptom.severity}
                onChange={(e) =>
                  setNewSymptom({ ...newSymptom, severity: e.target.value })
                }
              >
                <option value="">Select Severity</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </Form.Select>
            </Form.Group>
          </Col>
 
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>More Options:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={newSymptom.more_options}
                onChange={(e) =>
                  setNewSymptom({ ...newSymptom, more_options: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Button
          variant="success"
          onClick={handleAddSymptom}
          style={{ marginTop: "20px" }}
        >
          Save Symptom
        </Button>
        <hr />
 
        {symptomsData.map((symptom, index) => (
          <div key={symptom.id} className="mb-3">
            <Row className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Symptom Name:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.symptoms_name}
                    onChange={(e) => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].symptoms_name = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Since:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.since || ""}
                    onChange={(e) => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].since = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Severity:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.severity}
                    onChange={(e) => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].severity = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>More Options:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={symptom.more_options || ""}
                    onChange={(e) => {
                      const updatedSymptoms = [...symptomsData];
                      updatedSymptoms[index].more_options = e.target.value;
                      setSymptomsData(updatedSymptoms);
                    }}
                  />
                </Form.Group>
              </Col>
 
              <Col md={3} className="mt-2">
                <Form.Label>
                  <strong>Action</strong>
                </Form.Label>
                <DropdownButton
                  align="end"
                  drop="end"
                  title={<i className="bi bi-three-dots" />}
                  variant="secondary"
                  id={`dropdown-${document.id}`}
                >
                  <Dropdown.Item
                    onClick={() => handleUpdateSymptoms(symptom.id, index)}
                  >
                    Update
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      handleRemoveSymptom(
                        symptom.symptoms,
                        symptom.appointment,
                        index
                      )
                    }
                  >
                    Remove
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </div>
    );
  };
 
  useEffect(() => {
    if (successMessage || errorMessage || fetchError) {
      clearMessagesAfterTimeout();
    }
  }, [successMessage, errorMessage, fetchError]);
 
  const handleUpdateSymptoms = async (symptomId, index) => {
    setLoading(true);
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
        setSuccessMessage(response.data.success || "");
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.error || "");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };
 
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
 
  const [newSymptom, setNewSymptom] = useState({
    symptoms_name: "",
    since: "",
    severity: "",
    more_options: "",
  });
 
  const handleSearch = async () => {
    try {
      const response = await BaseUrl.get("/doctor/symptomssearch/", {
        params: { name: searchTerm },
      });
      if (response.status === 200 && response.data.length > 0) {
        setSearchResults(response.data);
        setSuccessMessage(response.data.success || "Symptoms found");
        setErrorMessage("");
      } else {
        setSearchResults([]);
        setErrorMessage(response.data.error || "No symptoms found");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
      setSuccessMessage("");
    }
  };
 
  const handleSelectSearchResult = (selectedSymptom) => {
    setNewSymptom({
      symptoms_name: selectedSymptom.symptoms_name,
      since: "",
      severity: "",
      more_options: "",
      id: selectedSymptom.id,
    });
    setSearchResults([]);
    setErrorMessage("");
    setSuccessMessage("");
  };
 
 
  const handleAddSymptom = async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.post("/doctor/symptomsdetail/", {
        symptoms: newSymptom.id,
        since: newSymptom.since,
        severity: newSymptom.severity,
        more_options: newSymptom.more_options,
        appointment: selectedAppointmentId,
      });
 
      if (response.status === 201) {
        setSuccessMessage(
          response.data.success || "Symptom added successfully"
        );
        setErrorMessage("");
 
        const newSymptomData = {
          id: newSymptom.id,
          symptoms_name: newSymptom.symptoms_name,
          since: newSymptom.since,
          severity: newSymptom.severity,
          more_options: newSymptom.more_options,
        };
 
        setSymptomsData((prevSymptoms) => [...prevSymptoms, newSymptomData]);
        setNewSymptom({
          symptoms_name: "",
          since: "",
          severity: "",
          more_options: "",
        });
 
        await fetchSymptomsData(selectedAppointmentId);
      } else {
        setErrorMessage(response.data.error || "");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };
 
  const handleRemoveSymptom = async (symptomsId, appointmentId, index) => {
    try {
      const updatedSymptoms = symptomsData.filter((_, i) => i !== index);
      setSymptomsData(updatedSymptoms);
 
      const response = await BaseUrl.delete(`/doctor/symptomsdetail/`, {
        data: {
          symptoms_id: symptomsId,
          appointment_id: appointmentId,
        },
      });
 
      if (response.status === 200) {
        setSuccessMessage("");
        setErrorMessage(null);
        await fetchSymptomsData(appointmentId);
      } else {
        setErrorMessage("");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
      setSuccessMessage("");
    }
  };
 
  const handleAppointmentDateClick = async (appointment_date, appointment_id, index) => {
    setSelectedAppointmentDate(appointment_date);
    setSelectedDateIndex(index);
    setSelectedAppointmentId(appointment_id);
 
    if (displayedData === 'vitals') {
      await fetchVitalsData(appointment_id);
    } else if (displayedData === 'symptoms') {
      await fetchSymptomsData(appointment_id);
    } else if (displayedData === 'prescription') {
      await fetchPrescriptionData(selectedAppointment.patient_id, appointment_id);
      await fetchUploadedPrescriptionDocument(appointment_id, appointment_date);
    } else if (displayedData === 'documents') {
      await handleDocumentsClick(appointment_id);
    } else {
      await fetchPatientDetails(selectedAppointment.patient_id, appointment_id);
    }
  };
 
  const handleDocumentsClick = async () => {
    setSelectedHeading('documents');
 
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
          setDisplayedData('documents');
        }
      } catch (error) {
        setDocumentsData([]);
        setDisplayedData('documents');
        setError(error.response?.data?.error || error.message || 'An unexpected error occurred.');
      }
    } else {
      setDocumentsData([]);
      setDisplayedData('documents');
    }
  };
 
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    document_name: '',
    patient_name: '',
    document_date: '',
    document_type: '',
    document_file: '',
  });
 
 
  const [selectedFiles, setSelectedFiles] = useState([]);
 
  const toggleFormModal = async (document = null) => {
    try {
      const appointmentId = selectedAppointmentId;
      const patientNameResponse = await BaseUrl.get(`/patient/patientname/`, {
        params: {
          appointment_id: appointmentId,
        },
      });
 
      if (patientNameResponse.status === 200) {
        const patientName = patientNameResponse.data.name;
        if (document) {
          setEditingDocumentId(document.id);
          setFormData({
            document_name: document.document_name,
            patient_name: patientName,
            document_date: document.document_date,
            document_type: document.document_type,
            document_file: null,
          });
        } else {
          setEditingDocumentId(null);
          setFormData({
            document_name: '',
            patient_name: patientName,
            document_date: '',
            document_type: '',
            document_file: null,
          });
        }
      } else {
        setErrorMessage();
      }
    } catch (error) {
      setErrorMessage();
    } finally {
      setShowFormModal(!showFormModal);
    }
  };
 
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };
 
  const handleAddFileClick = () => {
    document.getElementById("fileInput").click();
  };
 
  const handleDeleteFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };
 
  const [editingDocumentId, setEditingDocumentId] = useState(null);
 
  const handleSave = async () => {
    try {
 
      const decodedToken = jwtDecode(token);
      const appointmentId = selectedAppointmentId;
      const patientId = selectedAppointment.patient_id;
      const userType = decodedToken.user_type;
      const userId = decodedToken.reception_id;
 
      const formDataToSend = new FormData();
      formDataToSend.append("appointment", appointmentId);
      formDataToSend.append("document_name", formData.document_name);
      formDataToSend.append("patient_name", formData.patient_name);
      formDataToSend.append("document_date", formData.document_date);
      formDataToSend.append("document_type", formData.document_type);
      formDataToSend.append("patient_id", patientId);
      formDataToSend.append("user_type", userType);
      formDataToSend.append("user_id", userId);
 
      if (selectedFiles.length > 0) {
        formDataToSend.append("document_file", selectedFiles[0]);
      }
 
      let response;
 
      if (editingDocumentId) {
        formDataToSend.append("document_id", editingDocumentId);
        response = await BaseUrl.patch(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await BaseUrl.post(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
 
      if (response.status === 200) {
        setSuccessMessage(
          editingDocumentId
            ? "Document updated successfully"
            : "Document uploaded successfully"
        );
        setShowFormModal(false);
        await handleDocumentsClick();
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error saving document: " + error.message);
    }
  };
 
 
  const handleDeleteDocument = async (documentId) => {
    try {
      if (!documentId) {
        setErrorMessage("Document ID is missing.");
        return;
      }
      const response = await BaseUrl.delete(`/patient/patientdocumentusingappointmentid/`, {
        data: { document_id: documentId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (response.status === 200) {
        setSuccessMessage('Document deleted successfully.');
        setErrorMessage(null);
        setDocumentsData(documentsData.filter(doc => doc.id !== documentId));
      } else {
        setErrorMessage('Failed to delete document.');
      }
    } catch (error) {
      setErrorMessage('Error deleting document');
    }
  };
 
  const renderDocumentsData = () => {
    return (
      <div>
        <div className="d-flex justify-content-end">
          <Button className="btn btn-primary" onClick={toggleFormModal}>
            Upload Documents
          </Button>
        </div>
        {documentsData.map((document) => (
          <div key={document.id} className="mb-3" style={{ cursor: 'pointer' }}>
            <Row className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label><strong>Document Name:</strong></Form.Label>
                  <Form.Control type="text" value={document.document_name} readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><strong>Document Date:</strong></Form.Label>
                  <Form.Control type="text" value={document.document_date} readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><strong>Document Type:</strong></Form.Label>
                  <Form.Control type="text" value={document.document_type} readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><strong>Patient Name:</strong></Form.Label>
                  <Form.Control type="text" value={document.patient_name} readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label><strong>Uploaded By:</strong></Form.Label>
                  <Form.Control type="text" value={document.uploaded_by} readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><strong>Document File:</strong></Form.Label>
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
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4c75c6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5c85d6')}
                    aria-label={`View document ${document.document_name}`}
                  >
                    View Document
                  </Button>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Label><strong>Action:</strong></Form.Label>
                <DropdownButton
                  align="end"
                  drop="end"
                  title={<i className="bi bi-three-dots" />}
                  variant="secondary"
                  id={`dropdown-${document.id}`}
                >
                  <Dropdown.Item onClick={() => toggleFormModal(document)}>Modify</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeleteDocument(document.id)}>Delete</Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </div>
    );
  };
 
 


 
  const [previewFileType, setPreviewFileType] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
 
  const viewDocument = async (documentId) => {
    try {
      if (!documentId) {
        throw new Error("Document ID is required");
      }
      const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
        params: { document_id: documentId },
        responseType: "blob",
      });
      const fileType = response.headers['content-type'];
      const url = URL.createObjectURL(response.data);
      setPreviewFileType(fileType);
      setPreviewFileUrl(url);
      setShowPreviewModal(true);
    } catch (error) {
      setErrorMessage("Error fetching document. Please try again later.");
    }
  };
 
  const renderDocumentPreviewModal = () => (
    <Modal
      show={showPreviewModal}
      onHide={() => setShowPreviewModal(false)}
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
        <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
 
  const handleEndVisit = async (appointmentId) => {
    try {
      await BaseUrl.patch('/doctorappointment/completedappointment/', {
        appointment_id: appointmentId,
      });
      setIsVisitEnded(true);
      setSuccessMessage('Visit ended successfully.');
    } catch (error) {
      setErrorMessage('Error ending visit: ' + error.message);
    }
  };
 
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await BaseUrl.patch('/doctorappointment/canceledappointment/', {
        appointment_id: appointmentId,
      });
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
    setSelectedTodayAppointment(null);
    setSelectedCompletedAppointment(null);
    setSelectedCanceledAppointment(null);
  };
 
  const handleAppointmentClick = async (slotOrAppointment, section) => {
    if (selectedAppointment && selectedAppointment.appointment_id === slotOrAppointment.appointment_id) {
      resetModalState();
      return;
    }
 
    resetModalState();
    setSelectedAppointment(slotOrAppointment);
    setSelectedAppointmentId(slotOrAppointment.appointment_id);  // Set the clicked appointment ID
    setSelectedHeading("patientDetails");
 
    try {
      const patientDetailsResponse = await BaseUrl.get(`/patient/patient/`, {
        params: {
          patient_id: slotOrAppointment.patient_id,
          appointment_id: slotOrAppointment.appointment_id,
        },
      });
 
      if (patientDetailsResponse.status === 200) {
        setPatientDetails(patientDetailsResponse.data);
        setDisplayedData('patientDetails');
      }
 
      const appointmentResponse = await BaseUrl.get(`/patientappointment/viewslot/`, {
        params: {
          patient_id: slotOrAppointment.patient_id,
          doctor_id: slotOrAppointment.doctor,
        },
      });
 
      if (appointmentResponse.status === 200) {
        setAppointmentDetails(appointmentResponse.data.data);
      }
 
      if (section === 'today') {
        setSelectedTodayAppointment(slotOrAppointment);
      } else if (section === 'completed') {
        setSelectedCompletedAppointment(slotOrAppointment);
      } else if (section === 'canceled') {
        setSelectedCanceledAppointment(slotOrAppointment);
      } else {
        console.warn(section);
      }
    } catch (error) {
      setErrorMessage();
    }
  };
 
  useEffect(() => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    fetchSlots(doctorId, formattedDate);
    fetchAppointmentsData(doctorId, receptionId, formattedDate);
    fetchAppointmentCounts(doctorId, formattedDate)
  }, [doctorId, receptionId, currentDate, fetchSlots, fetchAppointmentsData]);
 
  const handlePreviousDate = () => {
    const newDate = subDays(currentDate, 1);
    setCurrentDate(newDate);
 
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    fetchSlots(doctorId, formattedDate);
    fetchAppointmentsData(doctorId, receptionId, formattedDate);
  };
 
  const handleNextDate = () => {
    const newDate = addDays(currentDate, 1);
    setCurrentDate(newDate);
 
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    fetchSlots(doctorId, formattedDate);
    fetchAppointmentsData(doctorId, receptionId, formattedDate);
  };
 
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, todayAppointments.length - 4));
  };
 
  const handleCompletedPrevious = () => {
    setCompletedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCompletedNext = () => {
    setCompletedIndex((prevIndex) => Math.min(prevIndex + 1, completedAppointments.length - 4));
  };
 
  const handleCanceledPrevious = () => {
    setCanceledIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCanceledNext = () => {
    setCanceledIndex((prevIndex) => Math.min(prevIndex + 1, canceledAppointments.length - 4));
  };
 
  const handleAddSlot = () => history.push('/reception/createslot');
 
  const handleBlockSlot = async () => {
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
 
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        fetchSlots(doctorId, formattedDate);
      }
    } catch (error) {
      setErrorMessage('Error blocking slot: ' + error.message);
      setSuccessMessage('');
    }
  };
 
  const handleUnblockSlot = async () => {
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
 
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        fetchSlots(doctorId, formattedDate);
      }
    } catch (error) {
      setErrorMessage('Error unblocking slot: ' + error.message);
      setSuccessMessage('');
    }
  };
 
  const handleToggleSlotButtons = () => {
    setShowSlotButtons(prevState => !prevState);
  };
 
  const handleClickOutside = () => {
    setShowSlotButtons(false);
  };
 
  const renderSlotCards = (slots) => {
    const rows = [];
    for (let i = 0; i < slots.length; i += 4) {
      const slotChunk = slots.slice(i, i + 4);
      rows.push(
        <Row key={i} className="mb-2">
          {slotChunk.map((slot, index) => {
            let cardStyle = {};
            if (slot.is_canceled) {
              cardStyle = {
                backgroundColor: '#BC1B2E',
                color: '#fff',
              };
            } else if (slot.is_booked) {
              cardStyle = {
                backgroundColor: '#A48B08',
                color: '#fff',
              };
            } else if (slot.is_blocked) {
              cardStyle = {
                backgroundColor: '#2EF6E2',
                color: '#fff',
              };
            } else {
              cardStyle = {
                backgroundColor: '#16B12F',
                color: '#fff',
              };
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
 
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card
          className={`mb-4 shadow-sm reception-card ${selectedAppointment && selectedAppointment.appointment_id === appointment.appointment_id ? 'selected-slot' : ''}`}
          onClick={() => handleAppointmentClick(appointment, 'today')}
          style={{
            border: selectedAppointment && selectedAppointment.appointment_id === appointment.appointment_id ? '2px solid #3795BD' : 'none',
            cursor: 'pointer',
            backgroundColor: appointment.appointment_type === 'follow-up' ? '#FB8369' : '#2D9CED'
          }}
        >
          <Card.Body>
            <Card.Title>{appointment.appointment_slot}</Card.Title>
            <Card.Text>Patient: {appointment.booked_by}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));
  };
 
  const renderCompletedAppointments = () => {
    const endIndex = Math.min(completedIndex + 4, completedAppointments.length);
    const displayedAppointments = completedAppointments.slice(completedIndex, endIndex);
 
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card className="mb-4 shadow-sm reception-card"
          style={{ backgroundColor: '#2CABC7', color: '#fff' }}
          onClick={() => handleAppointmentClick(appointment, 'completed')}>
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
        <Card className="mb-4 shadow-sm reception-card"
          style={{ backgroundColor: '#BC1B2E', color: '#fff' }}
          onClick={() => handleAppointmentClick(appointment, 'canceled')}>
          <Card.Body>
            <Card.Title>{appointment.appointment_slot}</Card.Title>
            <Card.Text>Canceled by: {appointment.doctor_name}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));
  };
 
 
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
 
  const renderAppointmentDate = () => {
    return appointmentDetails.map((appointment, index) => (
      <Col key={appointment.id} xs={12} className="mb-2">
        <button
          onClick={() => handleAppointmentDateClick(appointment.appointment_date, appointment.id, index)}
          style={{
            cursor: 'pointer',
            backgroundColor: selectedAppointmentId === appointment.id ? '#3795BD' : 'transparent',  // Highlight if appointment.id matches selectedAppointmentId
            color: selectedAppointmentId === appointment.id ? 'white' : 'black',
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
 
  const renderSelectedAppointmentDetails = () => {
    if (!selectedAppointment) return null;
 
    const isCompleted = selectedAppointment.is_complete;
    const isCanceled = selectedAppointment.is_canceled;
 
    return (
      <div
        className="mt-4 click-box"
        style={{
          position: "relative",
          backgroundColor: "#F4F6F9",
          padding: "20px 20px 40px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={() => setSelectedAppointment(null)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          <FaTimes size={24} color="#333" />
        </button>
 
        {!isCompleted && !isCanceled && (
          <Row>
            <Col xs={6}>
              <Form.Check
                type="switch"
                id="end-visit-switch"
                label="End Visit"
                checked={isVisitEnded}
                onChange={() => {
                  setConfirmAction("endVisit");
                  setShowConfirmModal(true);
                }}
                className="me-2"
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
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
                  setConfirmAction("cancelAppointment");
                  setShowConfirmModal(true);
                }}
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              />
            </Col>
          </Row>
        )}
 
        <Row style={{ paddingTop: "40px" }}>
          <Col
            md={3}
            className="appointments-col"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "30px",
              borderRadius: "10px",
            }}
          >
            <h6
              className="text-center"
              style={{ cursor: "pointer", color: "#007bff", fontWeight: "600" }}
            >
              Appointments
            </h6>
            <hr />
            {renderAppointmentDate()}
          </Col>
 
          <Col md={9} className="content-col">
            <Row className="mb-3 mt-4">
              <Col xs={2}>
                <h6
                  className="text-center clickable"
                  onClick={handlePatientDetailsClick}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border:
                      selectedHeading === "patientDetails"
                        ? "2px solid #3795BD"
                        : "2px solid transparent",
                    backgroundColor:
                      selectedHeading === "patientDetails"
                        ? "#d1e9f6"
                        : "transparent",
                    color: "#007bff",
                    boxShadow:
                      selectedHeading === "patientDetails"
                        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                        : "none",
                    display: "inline",
                  }}
                >
                  Details
                </h6>
              </Col>
 
              <Col xs={2}>
                <h6
                  className="text-center clickable"
                  onClick={handleVitalsClick}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border:
                      selectedHeading === "vitals"
                        ? "2px solid #3795BD"
                        : "2px solid transparent",
                    backgroundColor:
                      selectedHeading === "vitals" ? "#d1e9f6" : "transparent",
                    color: "#007bff",
                    boxShadow:
                      selectedHeading === "vitals"
                        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                        : "none",
                    display: "inline",
                  }}
                >
                  Vitals
                </h6>
              </Col>
              <Col xs={3}>
                <h6
                  className="text-center clickable"
                  onClick={handleSymptomsClick}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border:
                      selectedHeading === "symptoms"
                        ? "2px solid #3795BD"
                        : "2px solid transparent",
                    backgroundColor:
                      selectedHeading === "symptoms"
                        ? "#d1e9f6"
                        : "transparent",
                    color: "#007bff",
                    boxShadow:
                      selectedHeading === "symptoms"
                        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                        : "none",
                    display: "inline",
                  }}
                >
                  Symptoms
                </h6>
              </Col>
              <Col xs={3}>
                <h6
                  className="text-center clickable"
                  onClick={handlePrescriptionClick}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    paddingRight: "32px",
                    borderRadius: "5px",
                    border:
                      selectedHeading === "prescription"
                        ? "2px solid #3795BD"
                        : "2px solid transparent",
                    backgroundColor:
                      selectedHeading === "prescription"
                        ? "#d1e9f6"
                        : "transparent",
                    color: "#007bff",
                    boxShadow:
                      selectedHeading === "prescription"
                        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                        : "none",
                    display: "inline",
                  }}
                >
                  Prescription
                </h6>
              </Col>
              <Col xs={2}>
                <h6
                  className="text-center clickable"
                  onClick={handleDocumentsClick}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border:
                      selectedHeading === "documents"
                        ? "2px solid #3795BD"
                        : "2px solid transparent",
                    backgroundColor:
                      selectedHeading === "documents"
                        ? "#d1e9f6"
                        : "transparent",
                    color: "#007bff",
                    boxShadow:
                      selectedHeading === "documents"
                        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                        : "none",
                    display: "inline",
                  }}
                >
                  Documents {renderDocumentPreviewModal()}
                </h6>
              </Col>
            </Row>
            <hr />
            <div>
              {displayedData === "vitals" && renderVitalsData()}
              {displayedData === "prescription" && renderPrescriptionData()}
              {displayedData === "patientDetails" && renderPatientDetails()}
              {displayedData === "documents" && renderDocumentsData()}
              {displayedData === "symptoms" && renderSymptomsData()}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  
  const handleConfirmAction = () => {
    if (confirmAction === 'endVisit') {
      handleEndVisit(selectedAppointment.appointment_id);
    } else if (confirmAction === 'cancelAppointment') {
      handleCancelAppointment(selectedAppointment.appointment_id);
    }
    setShowConfirmModal(false);
  };
 
  return (
    <Container fluid className="p-5 bg-light reception-container">
      <header className="mb-5 reception-header d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
        <Col xs={12} md="auto" className="mb-3 mb-md-0">
          <img src={LeftLogo} className="left-logo img-fluid" alt="Left Logo" />
        </Col>
        <Col xs={12} md="auto" className="flex-grow-1">
          <h1 className="text-primary text-center">Welcome to Niramaya Homeopathy Reception</h1>
          <p className="text-muted text-center">Providing the best care for you and your family</p>
        </Col>
        <Col xs={12} md="auto" className="mt-3 mt-md-0">
          <img src={RightLogo} className="right-logo img-fluid" alt="Right Logo" />
        </Col>
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
            <Card.Title>Canceled</Card.Title>
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
          font-size: 18px;
        }
 
        .selected-slot {
          border: 2px solid #3795BD;
          background-color: #D1E9F6;
        }
 
        .appointment-list {
          max-height: 400px;
          overflow-y: auto;
        }
      `}</style>
 
      <div className="legend">
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#16B12F" }}></span>
          <span className="legend-text">Available</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#A48B08" }}></span>
          <span className="legend-text">Booked</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#2E56E2" }}></span>
          <span className="legend-text">Blocked</span>
        </div>
        <div>
          <span className="legend-dot" style={{ backgroundColor: "#BCAB2E" }}></span>
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
      <div className="legend">
        <div>
          <span
            className="legend-dot"
            style={{ backgroundColor: "#2D9CED" }}
          ></span>
          <span className="legend-text">New Appointment</span>
        </div>
        <div>
          <span
            className="legend-dot"
            style={{ backgroundColor: "#FB8369" }}
          ></span>
          <span className="legend-text">Follow-Up</span>
        </div>
      </div>
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
              {"No appointments available for today."}
            </div>
          </Col>
        )}
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleNext} disabled={currentIndex >= todayAppointments.length - 4}>
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
      {selectedTodayAppointment && renderSelectedAppointmentDetails(selectedTodayAppointment)}
 
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
              {"No completed appointments available."}
            </div>
          </Col>
        )}
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleCompletedNext} disabled={completedIndex >= completedAppointments.length - 4}>
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
      {selectedCompletedAppointment && renderSelectedAppointmentDetails(selectedCompletedAppointment)}
 
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
              {"No canceled appointments available."}
            </div>
          </Col>
        )}
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleCanceledNext} disabled={canceledIndex >= canceledAppointments.length - 4}>
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
      {selectedCanceledAppointment && renderSelectedAppointmentDetails(selectedCanceledAppointment)}
 
 
      <Row className="mb-4 mt-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm reception-card">
            <Card.Body>
              <Card.Title>Book Appointment</Card.Title>
              <Card.Text>Book Appointment with our Experienced Doctors.</Card.Text>
              <Button as={Link} to="/reception/appointmentbook" variant="primary">
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
              <Button as={Link} to="/reception/bookedappointment" variant="primary">
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
                <Button variant="primary" className="dropdown-toggle" onClick={handleToggleSlotButtons}>
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
              <Button as={Link} to="/reception/" variant="primary">
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
              <Button as={Link} to="/reception/" variant="primary">
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
            <Button as={Link} to="/reception/" variant="primary">
              Explore Clinic
            </Button>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Body>
            <Card.Title>Billing</Card.Title>
            <Card.Text>Manage the Billing and Payment of the customers.</Card.Text>
            <Button as={Link} to="/reception/" variant="primary">
              Payment
            </Button>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Body>
            <Card.Title>Patient</Card.Title>
            <Card.Text>Register new patients and manage existing patient records.</Card.Text>
            <Button as={Link} to="/reception/" variant="primary">
              Register
            </Button>
          </Card.Body>
        </Col>
      </Row>
 
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
 
      <Modal show={showFormModal} onHide={toggleFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isPrescriptionDocs
              ? "Upload Document Files"
              : editingRecordId
                ? "Edit Medical Record"
                : "Upload Medical Record"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="documentName">
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter document name"
                value={formData.document_name}
                onChange={(e) =>
                  setFormData({ ...formData, document_name: e.target.value })
                }
              />
            </Form.Group>
 
            <Form.Group controlId="patientName">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient name"
                value={formData.patient_name}
                onChange={(e) =>
                  setFormData({ ...formData, patient_name: e.target.value })
                }
              />
            </Form.Group>
 
            <Form.Group controlId="documentDate">
              <Form.Label>Document Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.document_date}
                onChange={(e) =>
                  setFormData({ ...formData, document_date: e.target.value })
                }
              />
            </Form.Group>
 
            <Form.Group controlId="documentType">
              <Form.Label>Document Type</Form.Label>
              <div className="d-flex">
                <Button
                  variant={
                    formData.document_type === "report" ? "primary" : "outline-primary"
                  }
                  className="me-2"
                  onClick={() => setFormData({ ...formData, document_type: "report" })}
                >
                  <FontAwesomeIcon icon={faFileAlt} /> Report
                </Button>
                <Button
                  variant={
                    formData.document_type === "invoice"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setFormData({ ...formData, document_type: "invoice" })}
                >
                  <FontAwesomeIcon icon={faReceipt} /> Invoice
                </Button>
              </div>
            </Form.Group>
 
            <Form.Group controlId="documentFile">
              <Form.Label>Document File</Form.Label>
              <div className="file-input">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <Button onClick={handleAddFileClick}>Add a File</Button>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="selected-file">
                    <span>{file.name}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteFile(index)}
                    >
                      <FontAwesomeIcon icon={faTimesSolid} />
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleFormModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingRecordId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
 
export default ReceptionHome;
