import React, { useEffect, useState, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { Row, Col,Card,Button,Form,Modal,FormGroup,} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import "../../css/DoctorHome.css";
import { format, subDays, addDays } from "date-fns";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {faFileAlt,faReceipt,faTimes as faTimesSolid,} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

 
const DoctorHome = () => {
  const [totalAppointments, setTotalAppointments] = useState();
  const [bookedAppointmentCount, setBookedAppointmentCount] = useState();
  const [completedAppointmentsCount, setCompletedAppointmentsCount] =useState();
  const [canceledAppointmentsCount, setCanceledAppointmentsCount] = useState();
  const [walkInCount, setWalkInCount] = useState();
  const [onlineCount, setOnlineCount] = useState();
  const [followUpCount, setFollowUpCount] = useState();
 
  const [clinicPhoto, setClinicPhoto] = useState(null);
  const [clinicName, setClinicName] = useState();
  const [mobileNumber, setMobileNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPrescriptionDocs, setIsPrescriptionDocs] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
 
  const fetchClinicDetails = async () => {
    try {
      const response = await BaseUrl.get(`/doctor/opddays/`, {
        params: {
          doctor_id: doctorId,
          mobile_number: mobileNumber,
        },
      });
 
      if (response.status === 200 && response.data.length > 0) {
        const data = response.data[0];
        setClinicName(data.clinic_name);
 
        if (data.doc_file) {
          const fullImageUrl = `${BaseUrl.defaults.baseURL}${data.doc_file}`;
          setClinicPhoto(fullImageUrl);
        } else {
          setClinicPhoto("No photo available");
        }
      }
    } catch (error) {}
  };
 
  const [appointments, setAppointments] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
 
  const [doctorId, setDoctorId] = useState(null);
 
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
 
  const [showModal, setShowModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showCanceledModal, setShowCanceledModal] = useState(false);
 
  const [isCanceled, setIsCanceled] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndex, setCompletedIndex] = useState(0);
  const [canceledIndex, setCanceledIndex] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
 
  const formattedDate = format(currentDate, "dd/MM/yyyy");
  const formattedISODate = format(currentDate, "yyyy-MM-dd");
 
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [vitalsData, setVitalsData] = useState(null);
  const [displayedData, setDisplayedData] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(null);
  const [documentsData, setDocumentsData] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisitEnded, setIsVisitEnded] = useState(false);
  const [error, setError] = useState(null);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
 
  const [selectedTodayAppointment, setSelectedTodayAppointment] =
    useState(null);
  const [selectedCompletedAppointment, setSelectedCompletedAppointment] =
    useState(null);
  const [selectedCanceledAppointment, setSelectedCanceledAppointment] =
    useState(null);
 
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleNext = () => {
    if (todayAppointments && todayAppointments.length > 0) {
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + 1, todayAppointments.length - 4)
      );
    }
  };
 
  const handleCompletedPrevious = () => {
    setCompletedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCompletedNext = () => {
    setCompletedIndex((prevIndex) =>
      Math.min(prevIndex + 1, completedAppointments.length - 4)
    );
  };
  const fetchAppointmentCounts = async () => {
    try {
      if (!doctorId) return;
 
      const response = await BaseUrl.get(`/reception/walkincount/`, {
        params: {
          doctor_id: doctorId,
          appointment_date: formattedISODate,
        },
      });
 
      if (response.status === 200) {
        const data = response.data.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
 
        setTotalAppointments(data["Total Appointments"]);
        setBookedAppointmentCount(data["Booked Appointments"]);
        setCanceledAppointmentsCount(data["Canceled Appointments"]);
        setCompletedAppointmentsCount(data["Completed Appointments"]);
        setWalkInCount(data["Walk-In"]);
        setOnlineCount(data["Online"]);
        setFollowUpCount(data["Follow-Up"]);
      }
    } catch (error) {}
  };
 
  const fetchAppointments = useCallback(async () => {
    try {
      const responseSlots = await BaseUrl.get(
        `/doctorappointment/todayslot/?doctor_id=${doctorId}`,
        {
          params: {
            doctor_id: doctorId,
            appointment_date: formattedISODate,
          },
        }
      );
 
      const categorizedSlots = { morning: [], afternoon: [], evening: [] };
      responseSlots.data.forEach((slot) => {
        const appointmentTime = slot.appointment_slot;
        const hour = new Date(`2000-01-01T${appointmentTime}`).getHours();
        if (hour < 12) {
          categorizedSlots.morning.push(slot);
        } else if (hour < 17) {
          categorizedSlots.afternoon.push(slot);
        } else {
          categorizedSlots.evening.push(slot);
        }
      });
 
      setAppointments(categorizedSlots);
 
      const response = await BaseUrl.get(`/reception/allappointments/`, {
        params: { doctor_id: doctorId },
      });
 
      const appointments = response.data;
      const todayAppointments = appointments.filter(
        (app) => !app.is_complete && !app.is_canceled
      );
      const completedAppointments = appointments.filter(
        (app) => app.is_complete
      );
      const canceledAppointments = appointments.filter(
        (app) => app.is_canceled
      );
 
      setTodayAppointments(todayAppointments);
      setCompletedAppointments(completedAppointments);
      setCanceledAppointments(canceledAppointments);
    } catch (error) {}
  }, [doctorId, formattedISODate]);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setDoctorId(decoded.doctor_id);
    }
  }, []);
 
  useEffect(() => {
    fetchAppointments();
    fetchAppointmentCounts();
    fetchClinicDetails();
  }, [doctorId, currentDate, fetchAppointments]);
 
  const handlePreviousDate = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };
 
  const handleNextDate = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };
 
  const [uploadedPrescription, setUploadedPrescription] = useState(null);
  const fetchUploadedPrescriptionDocument = async (appointmentId) => {
    setFetchError("");
    setSuccessMessage("");
    setErrorMessage("");
 
    try {
      const formattedDate = new Date(selectedAppointmentDate)
        .toISOString()
        .split("T")[0];
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
      setError(error.response?.data?.error || error.message || "");
    }
  };
 
  const handlePrescriptionClick = () => {
    setSelectedHeading("prescription");
    if (selectedAppointmentId && selectedAppointment.patient_id) {
      setPrescriptionData([]);
      setFormPrescription({
        medicine_name: "",
        comment: "",
        time: "",
        description: "",
      });
 
      Promise.all([
        fetchPrescriptionData(
          selectedAppointment.patient_id,
          selectedAppointmentId
        ),
        fetchUploadedPrescriptionDocument(selectedAppointmentId),
      ])
        .then(() => {
          setDisplayedData("prescription");
        })
        .catch((error) => {
          setError(error.response?.data?.error || error.message || "");
        });
    }
  };
 
  const fetchPrescriptionData = async (patientId, appointmentId) => {
    setFetchError(""); // Clear existing errors
    try {
      const response = await BaseUrl.get(
        `/patient/patientpriscription/?patient_id=${patientId}&appointment_id=${appointmentId}`
      );
 
      if (response.data.length > 0) {
        const prescriptions = response.data.map((prescription) => ({
          ...prescription,
          patient_id: patientId,
        }));
        setPrescriptionData(prescriptions);
        setFetchError("");
      } else {
        setPrescriptionData([]);
        setFetchError(response.data.error || "No prescriptions found.");
      }
    } catch (error) {
      setPrescriptionData([]);
      setFetchError(
        error.response?.data?.error || "Failed to fetch prescription data."
      );
    }
  };
 
  const [formPrescription, setFormPrescription] = useState({
    medicine_name: "",
    comment: "",
    time: "",
    description: "",
  });
 
  const handleViewPrescription = async (documentId) => {
    setFetchError("");
    try {
      if (!documentId) {
        throw new Error("Document ID is required");
      }
 
      const response = await BaseUrl.get(
        `/patient/patientprescriptonfileView/`,
        {
          params: { document_id: documentId },
          responseType: "blob",
        }
      );
 
      if (response.status === 200) {
        const fileType = response.headers["content-type"];
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: fileType })
        );
        setPreviewFileUrl(fileURL);
        setPreviewFileType(fileType);
        setShowPreviewModal(true);
        setError(null);
      } else {
        setError(
          error.response?.data?.error ||
            error.message ||
            "An unexpected error occurred."
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.message ||
          "An unexpected error occurred."
      );
    }
  };
 
  const [activeActionIndex, setActiveActionIndex] = useState(null);
 
  const toggleActions = (index) => {
    setActiveActionIndex((prevIndex) => (prevIndex === index ? null : index));
  };
 
  const renderPrescriptionData = () => {
    const hasPrescriptions = prescriptionData && prescriptionData.length > 0;
    return (
      <div style={{ padding: "20px" }}>
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
 
        {hasPrescriptions ? (
          prescriptionData.map((result, index) => (
            <div key={result.id} className="mb-3 position-relative">
              <Row className="mt-3">
                <Col md={3}>
                  <FormGroup>
                    <Form.Label>
                      <strong>Medicine Name:</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={result.medicine_name}
                      onChange={(e) =>
                        handlePrescriptionFieldChange(e, index, "medicine_name")
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Form.Label>
                      <strong>Precautions:</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={result.comment}
                      onChange={(e) =>
                        handlePrescriptionFieldChange(e, index, "comment")
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Form.Label>
                      <strong>Time:</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={result.time}
                      onChange={(e) =>
                        handlePrescriptionFieldChange(e, index, "time")
                      }
                    >
                      <option value="morning">Morning</option>
                      <option value="morning-afternoon">
                        Morning-Afternoon
                      </option>
                      <option value="morning-afternoon-evening">
                        Morning-Afternoon-Evening
                      </option>
                      <option value="morning-afternoon-evening-night">
                        Morning-Afternoon-Evening-Night
                      </option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </Form.Control>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Form.Label>
                      <strong>Description:</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={result.description}
                      onChange={(e) =>
                        handlePrescriptionFieldChange(e, index, "description")
                      }
                    />
                  </FormGroup>
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
                      onClick={() => handleUpdatePrescription(result.id, index)}
                    >
                      Update
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => deletePrescription(result.id)}
                    >
                      Remove
                    </Dropdown.Item>
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
                <Form.Label>
                  <strong>Medicine Name</strong>
                </Form.Label>
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
                <Form.Label>
                  <strong>Precautions</strong>
                </Form.Label>
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
                <Form.Label>
                  <strong>Time</strong>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="time"
                  value={formPrescription.time}
                  onChange={handlePrescriptionChange}
                >
                  <option value="">Select Time</option>
                  <option value="morning">Morning</option>
                  <option value="morning-afternoon">Morning-Afternoon</option>
                  <option value="morning-afternoon-evening">
                    Morning-Afternoon-Evening
                  </option>
                  <option value="morning-afternoon-evening-night">
                    Morning-Afternoon-Evening-Night
                  </option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </Form.Control>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Form.Label>
                  <strong>Description</strong>
                </Form.Label>
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
 
        <Col md={6} className="mb-5 mt-4">
          <Form.Group>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="primary" onClick={handlePrescriptionSubmit}>
                Save Prescription
              </Button>
              <Button variant="primary" onClick={handleAddPrescription}>
                Add Prescription
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => document.getElementById("fileUpload").click()}
              >
                Upload Document
              </Button>
            </div>
          </Form.Group>
        </Col>
 
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
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
                    style={{ width: "100%", textAlign: "center" }}
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
      { medicine_name: "", comment: "", time: "", description: "" },
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
      const latestPrescription = hasExistingPrescriptions
        ? prescriptionData[prescriptionData.length - 1]
        : formPrescription;
 
      const isNewPrescription =
        !hasExistingPrescriptions || !latestPrescription.id;
 
      const formData = new FormData();
      formData.append("appointment_id", selectedAppointmentId);
      formData.append("patient_id", selectedAppointment.patient_id);
      formData.append("medicine_name", latestPrescription.medicine_name || "");
      formData.append("comment", latestPrescription.comment || "");
      formData.append("time", latestPrescription.time || "");
      formData.append("description", latestPrescription.description || "");
 
      const endpoint = "/patient/patientpriscription/";
      const response = isNewPrescription
        ? await BaseUrl.post(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await BaseUrl.put(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
 
      if (response.status === 200) {
        setSuccessMessage(response.data.success || ""); // Use backend success message
        setErrorMessage(null);
 
        await fetchPrescriptionData(
          selectedAppointment.patient_id,
          selectedAppointmentId
        );
      } else {
        setErrorMessage(response.data.error || "");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
    }
  };
 
  const deletePrescription = async (prescriptionId) => {
    try {
      if (!prescriptionId) {
        setErrorMessage("Prescription ID is missing.");
        return;
      }
 
      const response = await BaseUrl.delete(`/patient/patientpriscription/`, {
        params: { prescription_id: prescriptionId },
      });
 
      if (response.status === 200) {
        setSuccessMessage(response.data.success || ""); // Use backend success message if available
        setErrorMessage(null);
 
        await fetchPrescriptionData(
          selectedAppointment.patient_id,
          selectedAppointmentId
        );
      } else {
        setErrorMessage(response.data.error || "");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
    }
  };
 
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage("");
      return;
    }
 
    const formattedDate = new Date(selectedAppointmentDate)
      .toISOString()
      .split("T")[0];
    const matchingAppointment = appointmentDetails.find(
      (appointment) => appointment.appointment_date === selectedAppointmentDate
    );
 
    if (!matchingAppointment) {
      setErrorMessage("");
      return;
    }
 
    const appointmentId = matchingAppointment.id;
    const formData = new FormData();
    formData.append("document_file", file);
    formData.append("appointment", appointmentId);
    formData.append("document_date", formattedDate);
 
    try {
      const response = await BaseUrl.post(
        "/patient/patientprescriptonfile/",
        formData
      );
 
      if (response.status === 200) {
        setSuccessMessage(response.data.success || "");
        setErrorMessage(null);
      } else {
        setErrorMessage(response.data.error || "");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
    }
  };
 
  const handleUpdatePrescription = async (prescriptionId, index) => {
    try {
      const prescriptionDataItem = prescriptionData[index];
      if (!prescriptionId) {
        setErrorMessage("");
        return;
      }
 
      const updateData = new FormData();
      updateData.append("prescription_id", prescriptionId);
      updateData.append("patient_id", prescriptionDataItem.patient);
      updateData.append("medicine_name", prescriptionDataItem.medicine_name);
      updateData.append("time", prescriptionDataItem.time);
      updateData.append("comment", prescriptionDataItem.comment);
      updateData.append("description", prescriptionDataItem.description);
 
      const response = await BaseUrl.put(
        `/patient/patientpriscription/`,
        updateData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
 
      if (response.status === 200) {
        setSuccessMessage(response.data.success || "");
        setErrorMessage(null);
 
        await fetchPrescriptionData(
          selectedAppointment.patient_id,
          selectedAppointmentId
        );
      } else {
        setErrorMessage(response.data.error || "");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
    }
  };
 
  const fetchPatientDetails = async (patientId, appointmentId) => {
    setFetchError("");
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await BaseUrl.get(
        `/patient/patient/?patient_id=${patientId}&appointment_id=${appointmentId}`
      );
      if (response.status === 200) {
        setPatientDetails(response.data);
      } else {
        setPatientDetails(null);
        setErrorMessage("No patient details found.");
      }
    } catch (error) {
      setPatientDetails(null);
      setFetchError(error.response?.data?.error || error.message || "");
    }
  };
 
  const handlePatientDetailsClick = () => {
    setSelectedHeading("patientDetails");
    if (selectedAppointment) {
      fetchPatientDetails(
        selectedAppointment.patient_id,
        selectedAppointment.appointment_id
      )
        .then(() => setDisplayedData("patientDetails"))
        .catch((error) => {
          setFetchError(error.response?.data?.error || "");
        });
    }
  };
 
  const renderPatientDetails = () => {
    return (
      <div>
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
 
        <Row className="mt-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Name:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.name}
                onChange={(e) =>
                  setPatientDetails({ ...patientDetails, name: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Age:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.age}
                onChange={(e) =>
                  setPatientDetails({ ...patientDetails, age: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Gender:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.gender}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    gender: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Contact:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.mobile_number}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    mobile_number: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Address:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.address}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Date Of Birth:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.date_of_birth}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    date_of_birth: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Blood Group:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.blood_group}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    blood_group: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <strong>Email:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={patientDetails.email}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
        </Row>
 
        <Button
          variant="primary"
          onClick={handleUpdatePatientDetails}
          style={{ marginTop: "20px", display: "block" }}
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
        setSuccessMessage(response.data.success || "");
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.error || "");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
      setSuccessMessage("");
    }
  };
 
 
 
  const [isNewVitals, setIsNewVitals] = useState(true);
  const [vitalsSuccessMessage, setVitalsSuccessMessage] = useState("");
  const [vitalsErrorMessage, setVitalsErrorMessage] = useState("");
 
  const fetchVitalsData = async (appointmentId) => {
    setFetchError("");
    setVitalsSuccessMessage("");
    setVitalsErrorMessage("");
    try {
      const response = await BaseUrl.get(`/patient/vital/`, {
        params: { appointment_id: appointmentId },
      });
 
      if (response.status === 200 && response.data.length > 0) {
        setVitalsData(response.data);
        setIsNewVitals(false); // Data exists, so it's an update
 
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
        // No data found, reset the form and mark as new entry
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
      setErrorMessage("");
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
    setSelectedHeading("vitals");
    if (selectedAppointmentId) {
      fetchVitalsData(selectedAppointmentId).then(() =>
        setDisplayedData("vitals")
      );
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
        {vitalsSuccessMessage && (
          <div className="alert alert-success text-center" role="alert">
            {vitalsSuccessMessage}
          </div>
        )}
        {vitalsErrorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {vitalsErrorMessage}
          </div>
        )}
        {/* {setFetchError && (
          <div className="alert alert-danger text-center" role="alert">
            {vitalsErrorMessage}
          </div>
        )} */}
 
        <Row>
          <Col md={3}>
            <Form.Group controlId="formBasicTemperature">
              <Form.Label>
                <strong>Temperature</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Blood Pressure</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Pulse Rate</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Heart Rate</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Oxygen Level</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Sugar Level</strong>
              </Form.Label>
              <Form.Control
                type="number"
                name="sugar_level"
                placeholder="Enter sugar level"
                value={formVitals.sugar_level}
                onChange={handleInputChange} // Update state on change
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicHeight">
              <Form.Label>
                <strong>Height</strong>
              </Form.Label>
              <Form.Control
                type="number"
                name="height"
                placeholder="Enter height (in cm)"
                value={formVitals.height} // Bind to formVitals state
                onChange={handleInputChange} // Automatically calculate BMI
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicWeight">
              <Form.Label>
                <strong>Weight</strong>
              </Form.Label>
              <Form.Control
                type="number"
                name="weight"
                placeholder="Enter weight (in kg)"
                value={formVitals.weight} // Bind to formVitals state
                onChange={handleInputChange} // Automatically calculate BMI
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formBasicBMI">
              <Form.Label>
                <strong>BMI</strong>
              </Form.Label>
              <Form.Control
                type="number"
                name="bmi"
                placeholder="Enter BMI"
                value={formVitals.bmi} // Bind to formVitals state
                readOnly // BMI is automatically calculated
              />
            </Form.Group>
          </Col>
        </Row>
        <Button className="mt-4" onClick={handleVitalsSubmit}>
          Save Vitals
        </Button>
      </div>
    );
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormVitals((prev) => {
      const updatedVitals = { ...prev, [name]: value };
 
      const { weight, height } = updatedVitals;
 
      if (name === "weight" || name === "height") {
        const heightInMeters = height / 100;
 
        if (heightInMeters > 0 && weight > 0) {
          const calculatedBMI = (
            weight /
            (heightInMeters * heightInMeters)
          ).toFixed(2);
 
          updatedVitals.bmi = calculatedBMI; // Set the calculated BMI
        }
      }
 
      return updatedVitals;
    });
  };
 
  const handleVitalsSubmit = async () => {
    const isEmpty = Object.values(formVitals).every((value) => value === "");
 
    if (isEmpty) {
      setVitalsErrorMessage(""); // Do not show any frontend error message
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
        setVitalsSuccessMessage(response.data.success || ""); // Use backend success message if available
        setVitalsErrorMessage(null);
        await fetchVitalsData(selectedAppointmentId); // Refresh vitals data
      } else {
        setVitalsErrorMessage(response.data.error || ""); // Use backend error message if available
      }
    } catch (error) {
      setVitalsErrorMessage(error.response?.data?.error || ""); // Use backend error message if available
    }
  };
 
  const [symptomsData, setSymptomsData] = useState([]);
  const [fetchError, setFetchError] = useState("");
 
  // Function to automatically hide success and error messages after 5 seconds
  const clearMessagesAfterTimeout = () => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
      setFetchError("");
    }, 10000); // 5 seconds
  };
 
  const fetchSymptomsData = async (appointmentId) => {
    setFetchError("");
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true); // Start loader
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
      setLoading(false); // End loader
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
 
        {/* Success and Error Messages */}
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
 
        {/* Search Box */}
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
 
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div
            className="search-results"
            style={{
              marginTop: "-15px",
              border: "1px solid #ddd",
              padding: "10px",
              backgroundColor: "#f9f9f9",
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
 
        {/* Add New Symptom Form - Moved Below Search Box */}
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
 
        {/* Symptoms List */}
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
    setLoading(true); // Start loading
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
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage(response.data.error || "");
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // End loading
    }
  };
 
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Define searchResults and setSearchResults here
 
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
        setSearchResults(response.data); // Populate search results instead of symptomsData
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
    setSearchResults([]); // Clear search results after selection
    setErrorMessage("");
    setSuccessMessage("");
  };
 
  const handleAddSymptom = async () => {
    setLoading(true); // Start loader before adding symptom
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
 
        // Merge the new symptom with the existing symptoms data
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
 
        // Optionally, re-fetch all symptoms to ensure the data is in sync with the backend
        await fetchSymptomsData(selectedAppointmentId);
      } else {
        setErrorMessage(response.data.error || "");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
      setSuccessMessage("");
    } finally {
      setLoading(false); // End loader after API response
    }
  };
 
  const handleRemoveSymptom = async (symptomsId, appointmentId, index) => {
    try {
      // Optimistically update the local state to remove the symptom
      const updatedSymptoms = symptomsData.filter((_, i) => i !== index);
      setSymptomsData(updatedSymptoms); // Update the state immediately
 
      const response = await BaseUrl.delete(`/doctor/symptomsdetail/`, {
        data: {
          symptoms_id: symptomsId, // Ensure this is the symptoms ID from the response
          appointment_id: appointmentId, // Ensure this is the correct appointment ID
        },
      });
 
      if (response.status === 200) {
        setSuccessMessage("");
        setErrorMessage(null);
 
        // Refresh the symptoms data after successful deletion
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
 
 
 const handleAppointmentDateClick = async (
    appointment_date,
    appointment_id,
    index
  ) => {
    setSelectedAppointmentDate(appointment_date);
    setSelectedDateIndex(index);
    setSelectedAppointmentId(appointment_id);
    // if (displayedData === 'patientDetails') {
    //   fetchPatientDetails(appointment_id);
    // }
    if (displayedData === "vitals") {
      await fetchVitalsData(appointment_id);
    }
    if (displayedData === "symptoms") {
      fetchSymptomsData(appointment_id);
    }
    if (displayedData === "prescription") {
      await fetchPrescriptionData(
        selectedAppointment.patient_id,
        appointment_id
      );
      await fetchUploadedPrescriptionDocument(appointment_id, appointment_date);
    }
    if (displayedData === "documents") {
      await handleDocumentsClick(appointment_id);
    } else {
      await fetchPatientDetails(selectedAppointment.patient_id, appointment_id);
    }
  };
 
  const handleDocumentsClick = async () => {
    setFetchError("");
    setSuccessMessage("");
    setErrorMessage("");
    setSelectedHeading("documents");
 
    if (selectedAppointmentId && selectedAppointmentDate) {
      try {
        const response = await BaseUrl.get(
          `/patient/patientdocumentusingappointmentid/`,
          {
            params: {
              appointment: selectedAppointmentId,
              document_date: selectedAppointmentDate,
            },
          }
        );
 
        if (response.status === 200 && response.data.length > 0) {
          setDocumentsData(response.data);
          setDisplayedData("documents");
        } else {
          setDocumentsData([]);
          setDisplayedData("documents");
        }
      } catch (error) {
        setDocumentsData([]);
        setDisplayedData("documents");
        setFetchError(error.response?.data?.error || error.message || "");
      }
    } else {
      setDocumentsData([]);
      setDisplayedData("documents");
    }
  };
 
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    document_name: "",
    patient_name: "",
    document_date: "",
    document_type: "",
    document_file: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
 
  const toggleFormModal = async (document = null) => {
    try {
      const appointmentId = selectedAppointmentId; // Use the stored appointment ID
 
      if (!appointmentId) {
        setErrorMessage("Appointment ID is missing.");
        return;
      }
 
      // Fetch the patient name based on the appointment ID
      const patientNameResponse = await BaseUrl.get(`/patient/patientname/`, {
        params: {
          appointment_id: appointmentId,
        },
      });
 
      if (patientNameResponse.status === 200) {
        const patientData = patientNameResponse.data;
 
        // If editing a document, populate form with document data
        if (document) {
          setFormData({
            document_name: document.document_name || "",
            patient_name: patientData.name || "", // Set patient name from the API response
            document_date: document.document_date || "",
            document_type: document.document_type || "",
            document_file: "",
          });
          setEditingDocumentId(document.id); // Store document ID for PATCH request
        } else {
          // Clear form for creating a new document
          setFormData({
            document_name: "",
            patient_name: patientData.name || "", // Set patient name from the API response
            document_date: "",
            document_type: "",
            document_file: "",
          });
          setEditingDocumentId(null); // Clear editing ID for POST request
        }
 
        setErrorMessage(""); // Clear any previous error messages
      } else {
        setErrorMessage(patientNameResponse.data.error || "");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "");
    } finally {
      setShowFormModal(!showFormModal); // Toggle the modal state
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
 
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };
 
 
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const appointmentId = selectedAppointmentId; // Ensure correct appointment is used
      const patientId = selectedAppointment.patient_id; // Ensure correct patient is used
      const userType = decodedToken.user_type;
      const userId = decodedToken.doctor_id;
     
     
 
      const formDataToSend = new FormData();
      formDataToSend.append("appointment", appointmentId);
      formDataToSend.append("document_name", formData.document_name);
      formDataToSend.append("patient_name", formData.patient_name);
      formDataToSend.append("document_date", formData.document_date);
      formDataToSend.append("document_type", formData.document_type);
      formDataToSend.append("patient_id", patientId); // Use selected patient's ID
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
        await handleDocumentsClick(); // Ensure it refreshes the documents for the correct appointment
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
        setErrorMessage("");
        return;
      }
 
      const response = await BaseUrl.delete(
        `/patient/patientdocumentusingappointmentid/`,
        {
          data: { document_id: documentId },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
 
      if (response.status === 200 && response.data.success) {
        setSuccessMessage(response.data.success);
        setErrorMessage("");
        await handleDocumentsClick();
      } else if (response.data.error) {
        setErrorMessage(response.data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
      setSuccessMessage("");
    }
  };
 
  const renderDocumentsData = () => {
    return (
      <div>
        {/* Success and Error Messages */}
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
        <div className="d-flex justify-content-end">
          <Button className="btn btn-primary" onClick={() => toggleFormModal()}>
            Upload Documents
          </Button>
        </div>
        {documentsData.map((document) => (
          <div key={document.id} className="mb-3" style={{ cursor: "pointer" }}>
            <Row className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document Name:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={document.document_name}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document Date:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={document.document_date}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document Type:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={document.document_type}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Patient Name:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={document.patient_name}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Uploaded By:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={document.uploaded_by}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Document File:</strong>
                  </Form.Label>
                  <Button
                    variant="primary"
                    onClick={() => viewDocument(document.id)}
                    style={{
                      backgroundColor: "#5c85d6",
                      borderColor: "#5c85d6",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      transition: "background-color 0.3s, transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#4c75c6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#5c85d6")
                    }
                    aria-label={`View document ${document.document_name}`}
                  >
                    View Document
                  </Button>
                </Form.Group>
              </Col>
              <Col md={3} className="mt-4">
                {/* Ellipsis menu for Modify, Download, and Delete */}
                <DropdownButton
                  align="end"
                  drop="end"
                  title={<i className="bi bi-three-dots" />} // Bootstrap 3 dots icon
                  variant="secondary"
                  id={`dropdown-${document.id}`}
                >
                  <Dropdown.Item onClick={() => toggleFormModal(document)}>
                    Modify
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    Delete
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
 
 
const [previewFileType, setPreviewFileType] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
 
  const viewDocument = async (documentId) => {
    try {
      if (!documentId) {
        throw new Error("Document ID is required");
      }
 
      const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
        params: {
          document_id: documentId,
        },
        responseType: "blob",
      });
 
      const fileType = response.headers["content-type"];
      const url = URL.createObjectURL(response.data);
      setPreviewFileType(fileType);
      setPreviewFileUrl(url);
      setShowPreviewModal(true);
    } catch (error) {}
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
      <Modal.Body style={{ textAlign: "center" }}>
        {previewFileType && previewFileUrl ? (
          previewFileType.includes("image") ? (
            <img
              src={previewFileUrl}
              alt="Document Preview"
              style={{ maxWidth: "100%", height: "400px" }}
            />
          ) : previewFileType.includes("pdf") ? (
            <iframe
              src={previewFileUrl}
              style={{ width: "100%", height: "500px" }}
              title="Document Preview"
            ></iframe>
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
      await BaseUrl.patch("/doctorappointment/completedappointment/", {
        appointment_id: appointmentId,
      });
      setIsVisitEnded(true);
      setSuccessMessage("Visit ended successfully.");
    } catch (error) {
      setErrorMessage("Error ending visit: " + error.message);
    }
  };
 
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await BaseUrl.patch("/doctorappointment/canceledappointment/", {
        appointment_id: appointmentId,
      });
      setIsCanceled(true);
      setSuccessMessage("Appointment canceled successfully.");
    } catch (error) {
      setErrorMessage("Error canceling appointment: " + error.message);
    }
  };
 
  const handleConfirmAction = () => {
    if (confirmAction === "endVisit") {
      handleEndVisit(selectedAppointment.appointment_id);
    } else if (confirmAction === "cancelAppointment") {
      handleCancelAppointment(selectedAppointment.appointment_id);
    }
    setShowConfirmModal(false);
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
                backgroundColor: "#BC1B2E", // Red for canceled slots
                color: "#fff",
              };
            } else if (slot.is_booked) {
              cardStyle = {
                backgroundColor: "#A48B08", // Yellow for booked slots
                color: "#fff",
              };
            } else if (slot.is_blocked) {
              cardStyle = {
                backgroundColor: "#2E56E2", // Blue for blocked slots
                color: "#fff",
              };
            } else {
              cardStyle = {
                backgroundColor: "#16B12F", // Green for available slots
                color: "#fff",
              };
            }
 
 
 return (
              <Col key={index} md={3} style={{ padding: "4px" }}>
                <Card style={{ margin: "0", padding: "8px", ...cardStyle }}>
                  <Card.Body>
                    <Card.Text>{slot.appointment_slot}</Card.Text>
                    {/* {slot.is_booked && <Card.Text>Booked</Card.Text>} */}
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
 
  const renderCompletedAppointments = () => {
    const endIndex = Math.min(completedIndex + 4, completedAppointments.length);
    const displayedAppointments = completedAppointments.slice(
      completedIndex,
      endIndex
    );
 
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card
          className="mb-4 shadow-sm reception-card"
          style={{ backgroundColor: "#2CABC7", color: "#fff" }}
          onClick={() => handleAppointmentClick(appointment, "completed")}
        >
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
    const displayedAppointments = canceledAppointments.slice(
      canceledIndex,
      endIndex
    );
 
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card
          className="mb-4 shadow-sm reception-card"
          style={{ backgroundColor: "#BC1B2E", color: "#fff" }}
          onClick={() => handleAppointmentClick(appointment, "canceled")}
        >
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
 
        {/* Conditionally render End Visit and Cancel Appointment switches if the appointment is not completed or canceled */}
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
 
  const handleCanceledPrevious = () => {
    setCanceledIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCanceledNext = () => {
    setCanceledIndex((prevIndex) =>
      Math.min(prevIndex + 1, canceledAppointments.length - 4)
    );
  };
 
  const renderAppointments = () => {
    const endIndex = Math.min(currentIndex + 4, todayAppointments.length);
    const displayedAppointments = todayAppointments.slice(
      currentIndex,
      endIndex
    );
 
    return displayedAppointments.map((appointment, index) => (
      <Col key={index}>
        <Card
          className={`mb-4 shadow-sm reception-card ${
            selectedAppointment &&
            selectedAppointment.appointment_id === appointment.appointment_id
              ? "selected-slot"
              : ""
          }`}
          onClick={() => handleAppointmentClick(appointment, "today")}
          style={{
            border:
              selectedAppointment &&
              selectedAppointment.appointment_id === appointment.appointment_id
                ? "2px solid #3795BD"
                : "none",
            cursor: "pointer",
            backgroundColor:
              appointment.appointment_type === "follow-up"
                ? "#FB8369"
                : "#2D9CED",
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
 
  return (
    <div className="doctor-container" style={{ backgroundColor: "#D7EAF0" }}>
      <header
        className="header"
        style={{
          fontFamily: "sans-serif",
          color: "#0C1187",
          textAlign: "center",
        }}
      >
        <Row className="align-items-center mb-4 justify-content-center">
          <Col xs={12} md={2} className="text-center">
            <img
              src={clinicPhoto}
              alt="Clinic Logo"
              className="logo img-fluid"
              style={{ borderRadius: "50%", height: "100px", width: "100px" }}
            />
          </Col>
          <Col xs={12} md={10} className="text-center">
            <h1
              className="heading"
              style={{
                fontSize: "40px",
                fontWeight: "900",
                paddingRight: "80px",
              }}
            >
              Welcome to {clinicName}
            </h1>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "400",
                color: "#333333",
                paddingRight: "80px",
              }}
            >
              Providing the best care for you and your family
            </h3>
          </Col>
        </Row>
      </header>
 
      <Row className="align-items-center mb-4 justify-content-center">
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handlePreviousDate}>
            <BsChevronLeft />
          </Button>
        </Col>
        <Col xs="auto" className="text-center">
          <h2>{formattedDate}</h2>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleNextDate}>
            <BsChevronRight />
          </Button>
        </Col>
      </Row>
 
      <Row className="mb-4 text-center">
        <Col>
          <Card.Body>
            <Card.Title>Appointments</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {totalAppointments}
            </Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Booked</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {bookedAppointmentCount}
            </Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Completed</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {completedAppointmentsCount}
            </Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Canceled</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {canceledAppointmentsCount}
            </Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Walk-Ins</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {walkInCount}
            </Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Online</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {onlineCount}
            </Card.Text>
          </Card.Body>
        </Col>
 
        <Col>
          <Card.Body>
            <Card.Title>Follow-Ups</Card.Title>
            <Card.Text style={{ paddingTop: "10px", fontSize: "22px" }}>
              {followUpCount}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
      <hr />
 
      <div className="new">
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
      font-size: 25px;
    }
  `}</style>
 
        <div className="legend text-center">
          <div>
            <span
              className="legend-dot"
              style={{
                backgroundColor: "#16B12F",
                width: "8px",
                height: "8px",
              }}
            ></span>
            <span className="legend-text" style={{ fontSize: "16px" }}>
              Available
            </span>
          </div>
          <div>
            <span
              className="legend-dot"
              style={{
                backgroundColor: "#A48B08",
                width: "8px",
                height: "8px",
              }}
            ></span>
            <span className="legend-text" style={{ fontSize: "16px" }}>
              Booked
            </span>
          </div>
          <div>
            <span
              className="legend-dot"
              style={{
                backgroundColor: "#BC1B2E",
                width: "8px",
                height: "8px",
              }}
            ></span>
            <span className="legend-text" style={{ fontSize: "16px" }}>
              Canceled
            </span>
          </div>
          <div>
            <span
              className="legend-dot"
              style={{
                backgroundColor: "#2E56E2",
                width: "8px",
                height: "8px",
              }}
            ></span>
            <span className="legend-text" style={{ fontSize: "16px" }}>
              Blocked
            </span>
          </div>
        </div>
 
        <Row>
          <Col>
            <h5
              className="text-center"
              style={{
                fontFamily: "sans-serif",
                color: "#000000",
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              Morning
            </h5>
            {appointments.morning.length > 0 ? (
              renderSlotCards(appointments.morning)
            ) : (
              <p className="text-center text-danger">
                Slots are not available in the morning.
              </p>
            )}
          </Col>
          <Col>
            <h5
              className="text-center"
              style={{
                fontFamily: "sans-serif",
                color: "#000000",
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              Afternoon
            </h5>
            {appointments.afternoon.length > 0 ? (
              renderSlotCards(appointments.afternoon)
            ) : (
              <p className="text-center text-danger">
                Slots are not available in the afternoon.
              </p>
            )}
          </Col>
          <Col>
            <h5
              className="text-center"
              style={{
                fontFamily: "sans-serif",
                color: "#000000",
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              Evening
            </h5>
            {appointments.evening.length > 0 ? (
              renderSlotCards(appointments.evening)
            ) : (
              <p className="text-center text-danger">
                Slots are not available in the evening.
              </p>
            )}
          </Col>
        </Row>
 
        <hr />
      </div>
 
      <h3
        className="text-center"
        style={{
          fontFamily: "sans-serif",
          color: "#000000",
          fontSize: "35px",
          fontWeight: "600",
        }}
      >
        Today's Appointments
      </h3>
 
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
          <Button
            variant="outline-primary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <BsChevronLeft />
          </Button>
        </Col>
        {todayAppointments.length > 0 ? (
          renderAppointments()
        ) : (
          <Col xs="auto" className="d-flex justify-content-center">
            <div
              className="alert alert-danger p-2"
              style={{ maxWidth: "350px", display: "inline-block" }}
              role="alert"
            >
              {"No appointments available for today."}
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
      {selectedTodayAppointment &&
        renderSelectedAppointmentDetails(selectedTodayAppointment)}
 
      <hr />
      <h3
        className="text-center"
        style={{
          fontFamily: "sans-serif",
          color: "#000000",
          fontSize: "35px",
          fontWeight: "600",
        }}
      >
        Completed Appointments
      </h3>
      <Row className="mb-4 text-center align-items-center justify-content-center">
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleCompletedPrevious}
            disabled={completedIndex === 0}
          >
            <BsChevronLeft />
          </Button>
        </Col>
        {completedAppointments.length > 0 ? (
          renderCompletedAppointments()
        ) : (
          <Col xs="auto" className="d-flex justify-content-center">
            <div
              className="alert alert-danger p-2"
              style={{ maxWidth: "350px", display: "inline-block" }}
              role="alert"
            >
              {"No completed appointments available."}
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
      {selectedCompletedAppointment &&
        renderSelectedAppointmentDetails(selectedCompletedAppointment)}
 
      <hr />
      <h3
        className="text-center"
        style={{
          fontFamily: "sans-serif",
          color: "#000000",
          fontSize: "35px",
          fontWeight: "600",
        }}
      >
        Canceled Appointments
      </h3>
      <Row className="mb-4 text-center align-items-center justify-content-center">
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={handleCanceledPrevious}
            disabled={canceledIndex === 0}
          >
            <BsChevronLeft />
          </Button>
        </Col>
        {canceledAppointments.length > 0 ? (
          renderCanceledAppointments()
        ) : (
          <Col xs="auto" className="d-flex justify-content-center">
            <div
              className="alert alert-danger p-2"
              style={{ maxWidth: "350px", display: "inline-block" }}
              role="alert"
            >
              {"No canceled appointments available."}
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
      {selectedCanceledAppointment &&
        renderSelectedAppointmentDetails(selectedCanceledAppointment)}
 
      {/* Modal for Today's Appointment with toggle buttons */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {format(
                  new Date(selectedAppointment.appointment_date),
                  "dd/MM/yyyy"
                )}
              </p>
              <p>
                <strong>Appointment Slot:</strong>{" "}
                {selectedAppointment.appointment_slot}
              </p>
              <p>
                <strong>Booked By:</strong> {selectedAppointment.booked_by}
              </p>
              <p>
                <strong>Doctor Name:</strong> {selectedAppointment.doctor_name}
              </p>
              <p>
                <strong>Mobile Number:</strong>{" "}
                {selectedAppointment.mobile_number}
              </p>
            </>
          )}
        </Modal.Body>
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
                fontSize: "1.25rem", // Increase font size
                fontWeight: "600", // Increase font weight
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
                fontSize: "1.25rem", // Increase font size
                fontWeight: "600", // Increase font weight
              }}
            />
          </Col>
        </Row>
      </Modal>
 
      <Modal
        show={showCompletedModal}
        onHide={() => setShowCompletedModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Completed Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {format(
                  new Date(selectedAppointment.appointment_date),
                  "dd/MM/yyyy"
                )}
              </p>
              <p>
                <strong>Appointment Slot:</strong>{" "}
                {selectedAppointment.appointment_slot}
              </p>
              <p>
                <strong>Booked By:</strong> {selectedAppointment.booked_by}
              </p>
              <p>
                <strong>Doctor Name:</strong> {selectedAppointment.doctor_name}
              </p>
              <p>
                <strong>Mobile Number:</strong>{" "}
                {selectedAppointment.mobile_number}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
 
 
 {/* Modal for Canceled Appointment without toggle buttons */}
      <Modal
        show={showCanceledModal}
        onHide={() => setShowCanceledModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Canceled Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {format(
                  new Date(selectedAppointment.appointment_date),
                  "dd/MM/yyyy"
                )}
              </p>
              <p>
                <strong>Appointment Slot:</strong>{" "}
                {selectedAppointment.appointment_slot}
              </p>
              <p>
                <strong>Booked By:</strong> {selectedAppointment.booked_by}
              </p>
              <p>
                <strong>Doctor Name:</strong> {selectedAppointment.doctor_name}
              </p>
              <p>
                <strong>Mobile Number:</strong>{" "}
                {selectedAppointment.mobile_number}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
 
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to{" "}
            {confirmAction === "endVisit"
              ? "end this visit"
              : "cancel this appointment"}
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
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
                    formData.document_type === "report"
                      ? "primary"
                      : "outline-primary"
                  }
                  className="me-2"
                  onClick={() =>
                    setFormData({ ...formData, document_type: "report" })
                  }
                >
                  <FontAwesomeIcon icon={faFileAlt} /> Report
                </Button>
                <Button
                  variant={
                    formData.document_type === "invoice"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() =>
                    setFormData({ ...formData, document_type: "invoice" })
                  }
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
    </div>
  );
};
 
export default DoctorHome;
 
 