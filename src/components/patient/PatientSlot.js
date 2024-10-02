
// import React, { useState, useEffect } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import {jwtDecode} from 'jwt-decode';
// import BaseUrl from '../../api/BaseUrl'; // Adjust path as per your project structure
// import { FaEdit, FaTimes } from 'react-icons/fa';
 
// const PatientSlot = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);
//   const [showPatientDetails, setShowPatientDetails] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isExistingUser, setIsExistingUser] = useState(false); // State to check if patient details exist
 
//   const [formData, setFormData] = useState({
//     name: '',
//     gender: '',
//     date_of_birth: '',
//     address: '',
//     mobile_number: '',
//     blood_group: '',
//   });
//   const [searchParams, setSearchParams] = useState({
//     doctor_name: '',
//     mobile_number: '',
//     patient_name: '',
//     specialization: '',
//   });
 
//   useEffect(() => {
//     fetchAppointmentDetails();
//   }, []);
 
//   const fetchAppointmentDetails = async () => {
//     try {
//       const token = localStorage.getItem('patient_token');
//       const decodedToken = jwtDecode(token);
//       const patient_id = decodedToken.patient_id;
 
//       if (!patient_id) {
//         throw new Error('No patient ID found');
//       }
 
//       const response = await BaseUrl.get(`/patientappointment/viewslot/?patient_id=${patient_id}`);
 
//       if (response.status === 200) {
//         setErrorMessage('');
//         const bookedAppointments = Array.isArray(response.data.data) ? response.data.data.filter(appointment => appointment.is_booked) : [];
//         setAppointments(bookedAppointments);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || 'Error fetching appointment details.');
//     }
//   };
 
 
//   const handleModify = async (appointmentId) => {
//     try {
//       const mobile_number = localStorage.getItem('mobile_number');
//       const response = await BaseUrl.get(`/patient/details/?mobile_number=${mobile_number}`);
 
//       if (response.status === 200) {
//         setShowPatientDetails(true);
//       } else {
//         throw new Error('Failed to fetch patient details');
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || 'Error fetching patient details.');
//     }
//   };
 
//   const handleCancel = (appointmentId) => {
//     setShowConfirmation(true);
//     setAppointmentIdToDelete(appointmentId);
//   };
 
//   const confirmCancel = async () => {
//     try {
//       const token = localStorage.getItem('patient_token');
//       const decodedToken = jwtDecode(token);
//       const patient_id = decodedToken.patient_id;
 
//       if (!patient_id) {
//         throw new Error('No patient ID found');
//       }
 
//       const requestData = {
//         patient_id: patient_id,
//         slot_id: appointmentIdToDelete,
//       };
 
//       const response = await BaseUrl.patch('/patientappointment/viewslot/', requestData);
//       if (response.status === 200) {
//         fetchAppointmentDetails();
//         setShowConfirmation(false);
//       } else {
//         throw new Error('Failed to cancel appointment');
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || 'Error cancelling appointment.');
//     }
//   };
 
//   const cancelCancel = () => {
//     setShowConfirmation(false);
//   };
 
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prevParams => ({
//       ...prevParams,
//       [name]: value
//     }));
//   };
 
//   const handleSearch = async () => {
//     try {
//       const token = localStorage.getItem('patient_token');
//       const decodedToken = jwtDecode(token);
//       const patient_id = decodedToken.patient_id;
 
//       if (!patient_id) {
//         throw new Error('No patient ID found');
//       }
 
//       const response = await BaseUrl.get('/patientappointment/searchmyslot/', {
//         params: {
//           patient_id: patient_id,
//           query: searchParams.doctor_name || searchParams.mobile_number || searchParams.patient_name || searchParams.specialization,
//         }
//       });
 
//       if (response.status === 200) {
//         setErrorMessage('');
//         const fetchedAppointments = response.data.map(appointment => ({
//           id: appointment.id,
//           appointment_date: appointment.appointment_date,
//           doctor_specialization: appointment.doctor_specialization,
//           booked_by: appointment.booked_by,
//           appointment_slot: appointment.appointment_slot,
//           doctor_name: appointment.doctor_name
//         }));
//         setAppointments(fetchedAppointments);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setErrorMessage(error.response.data.error);
//         setAppointments([]); // Clear the appointments list
//       } else {
//         setErrorMessage(error.response?.data?.error || 'Error fetching search results.');
//       }
//     }
//   };
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formDataToSubmit = new FormData();
//     for (const key in formData) {
//       formDataToSubmit.append(key, formData[key]);
//     }
 
//     try {
//       const mobile_number = localStorage.getItem('mobile_number');
//       formDataToSubmit.append('mobile_number', mobile_number);
 
//       let response;
//       if (isExistingUser) {
//         // Check if user details already exist
//         const existingUserResponse = await BaseUrl.get(`/patient/details/?mobile_number=${mobile_number}`);
//         if (existingUserResponse.status === 200) {
//           // User details exist, show error
//           throw new Error('User details already exist for this mobile number');
//         }
//       }
 
//       // Proceed to update or create user details
//       if (!isExistingUser) {
//         response = await BaseUrl.put(`/patient/details/?mobile_number=${mobile_number}`, formDataToSubmit);
//       } else {
//         response = await BaseUrl.post(`/patient/details/?mobile_number=${mobile_number}`, formDataToSubmit);
//       }
 
//       if (response.status === 200) {
//         setSuccessMessage(response.data.success);
//         setErrorMessage('');
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || 'Error submitting form.');
//       setSuccessMessage('');
//     }
//   };
 
 
//   return (
//     <div className="container mt-5">
//       {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2>My Appointments</h2>
//         <div className="input-group" style={{ maxWidth: '600px' }}>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="DoctorName/MobileNumber/PatientName/Specialisation/AppointmentDate"
//             name="doctor_name"
//             value={searchParams.doctor_name}
//             onChange={handleSearchChange}
//             onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
//           />
//           <button className="btn btn-primary" onClick={handleSearch}>Search</button>
//         </div>
//       </div>
//       <table className="table table-striped mt-3">
//         <thead>
//           <tr>
//             <th>Appointment Date</th>
//             <th>Specialization</th>
//             <th>Patient Name</th>
//             <th>Time</th>
//             <th>Doctor</th>
//             <th>Operations</th>
//           </tr>
//         </thead>
//         <tbody>
//           {appointments.length > 0 ? (
//             appointments.map((appointment) => (
//               <tr key={appointment.id}>
//                 <td>{appointment.appointment_date}</td>
//                 <td>{appointment.doctor_specialization}</td>
//                 <td>{appointment.booked_by}</td>
//                 <td>{appointment.appointment_slot}</td>
//                 <td>{appointment.doctor_name}</td>
//                 <td>
//                   <button className="btn btn-sm btn-info" onClick={() => handleModify(appointment.id)}>
//                     <FaEdit />
//                   </button>
//                   <button className="btn btn-sm btn-danger ml-2" onClick={() => handleCancel(appointment.id)}>
//                     <FaTimes />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6">No appointments found.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
 
//       {/* Patient Details Modal */}
//       <Modal show={showPatientDetails} onHide={() => setShowPatientDetails(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Patient Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Gender</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Date of Birth</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="date_of_birth"
//                 value={formData.date_of_birth}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Address</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Mobile Number</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="mobile_number"
//                 value={formData.mobile_number}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Blood Group</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="blood_group"
//                 value={formData.blood_group}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary">
//               Save Details
//             </button>
//           </form>
//         </Modal.Body>
//       </Modal>
 
//       {/* Confirmation Modal */}
//       <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirmation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to cancel this appointment?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={cancelCancel}>
//             No
//           </Button>
//           <Button variant="danger" onClick={confirmCancel}>
//             Yes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };
 
// export default PatientSlot;




import React, { useState, useEffect } from "react";
import {Modal,Button,Form,Table,Row,Col,Dropdown,DropdownButton,Card,} from "react-bootstrap";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import BaseUrl from "../../api/BaseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFileAlt,faReceipt,faEllipsisV,faTimes as faTimesSolid,} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
 
const PatientSlot = () => {
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
 
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [isPrescriptionDocs, setIsPrescriptionDocs] = useState(false);
  const [formDetails, setFormDetails] = useState({});
  const [fetchPatientDetails, setfetchPatientDetails] = useState();
  const [previewFileType, setPreviewFileType] = useState("");
  const [searchSymptom, setSearchSymptom] = useState("");
  const [fetchPrescriptionDetails, setFetchPrescriptionDetails] = useState();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [fetchRecordDetails, setFetchRecordDetails] = useState();
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [uploadedPrescription, setUploadedPrescription] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // 'success' or 'danger'
  const [successMessage, setSuccessMessage] = useState("");
  const [prescriptionDocuments, setPrescriptionDocuments] = useState([]);
  const [showPrescriptionDocsForm, setShowPrescriptionDocsForm] =useState(false);
  const [showSymptomsForm, setShowSymptomsForm] = useState(false);
  const [documentIds, setDocumentIds] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchParams, setSearchParams] = useState({ doctor_name: "" });
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showVitalForm, setShowVitalForm] = useState(false); // Add this line
  const [prescriptionDetails, setPrescriptionDetails] = useState({medicine_name: "",time: "",comment: "",description: "",});
  const [recordDetails, setRecordDetails] = useState({mobile_number: "",blood_pressure: "",weight: "",height: "",oxygen_level: "",symptoms: "",symptoms_comment: "",body_temperature: "",});
  const [prescriptions, setPrescriptions] = useState([{ medicine_name: "", time: "", description: "", precautions: "" },]);
  const [formData, setFormData] = useState({name: "",gender: "",date_of_birth: "",address: "",mobile_number: "",blood_group: "",});
 
  useEffect(() => {
    fetchAppointmentDetails();
  }, []);
 
  const fetchAppointmentDetails = async () => {
    try {
      const token = localStorage.getItem("patient_token");
      const decodedToken = jwtDecode(token);
      const patient_id = decodedToken.patient_id;
 
      if (!patient_id) {
        throw new Error("No patient ID found");
      }
 
      const response = await BaseUrl.get(
        `/patientappointment/viewslot/?patient_id=${patient_id}`
      );
 
      if (response.status === 200) {
        setErrorMessage("");
        const bookedAppointments = Array.isArray(response.data.data)
          ? response.data.data.filter((appointment) => appointment.is_booked)
          : [];
        setAppointments(bookedAppointments);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error fetching appointment details."
      );
    }
  };
  const fetchMedicalRecords = async (appointment_id) => {
    if (!appointment_id) return;
 
    try {
      const token = localStorage.getItem("patient_token");
      if (!token) return;
 
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.patient_id;
      const userType = decodedToken.user_type;
 
      const response = await BaseUrl.get(
        `/patient/patientdocumentusingappointmentid/`,
        {
          params: {
            appointment: appointment_id,
          },
        }
      );
 
      // Check if the response contains an array of data
      if (Array.isArray(response.data)) {
        setMedicalRecords(response.data); // Set the fetched records to state
      } else {
        setMedicalRecords([]); // If no data, set medicalRecords to an empty array
      }
 
      setShowMedicalRecords(true);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setMedicalRecords([]); // Set to empty if there's an error
    }
  };
 
  const handleModifyRecord = (record) => {
    setFormData({
      document_name: record.document_name,
      patient_name: record.patient_name,
      document_date: record.document_date,
      document_type: record.document_type,
    });
    setSelectedFiles([]);
    setEditingRecordId(record.id);
    setShowFormModal(true);
  };
  const handleViewFile = async (record) => {
    try {
      const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
        params: {
          patient_id: record.patient,
          document_id: record.id,
        },
        responseType: "blob",
      });
 
      const fileType = response.data.type;
      const url = URL.createObjectURL(response.data);
 
      setPreviewFileType(fileType);
      setPreviewFileUrl(url);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error viewing file:", error);
      setShowToast(true);
      setToastMessage("Failed to preview file.");
      setToastVariant("danger");
    }
  };
 
  const handleDownloadFile = async (record) => {
    try {
      const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
        params: {
          patient_id: record.patient,
          document_id: record.id,
        },
        responseType: "blob",
      });
 
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${record.document_name}.${
        response.data.type.split("/")[1]
      }`;
      setSuccessMessage("Document file downloaded successfully");
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
      setErrorMessage("Failed to download Document file");
    }
  };
  const handleDeleteFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };
  const handleDeleteRecord = async (recordId) => {
    try {
      await BaseUrl.delete(`/patient/patientdocumentusingappointmentid/`, {
        data: {
          document_id: recordId,
        },
      });
      await fetchMedicalRecords(expandedAppointmentId);
      // await fetchAppointments(clinicId);
      setSuccessMessage("File record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      setErrorMessage("Failed to delete record file");
    }
  };
 
  const handleSave = async () => {
    let decodedToken = null;
 
    try {
      // Retrieve and decode the patient token (assuming it's stored as 'patient_token')
      const token = localStorage.getItem("patient_token");
      decodedToken = jwtDecode(token); // Decode the token to extract patient details
    } catch (error) {
      console.error("Error decoding patient token:", error);
      return;
    }
 
    const patientId = decodedToken.patient_id; // Extract patient_id from token
    const userType = decodedToken.user_type;  // Extract user_type from token
 
    const formDataToSend = new FormData();
    formDataToSend.append("appointment", expandedAppointmentId);  // Pass appointment ID
    formDataToSend.append("document_name", formData.document_name);  // Document name
    formDataToSend.append("patient_name", formData.patient_name);  // Patient name
    formDataToSend.append("document_date", formData.document_date);  // Document date
    formDataToSend.append("document_type", formData.document_type);  // Document type
 
    // If a file is selected, append the file to the formData
    if (selectedFiles.length > 0) {
      formDataToSend.append("document_file", selectedFiles[0]);
    }
 
    // Append user_type and patient_id decoded from token
    formDataToSend.append("user_type", userType);
    formDataToSend.append("patient_id", patientId);  // Change from user_id to patient_id if needed by backend
 
    try {
      // Check if it's an update (PATCH) or new save (POST)
      if (editingRecordId) {
        // Update (PATCH request)
        formDataToSend.append("document_id", editingRecordId);  // Include document ID for updating
 
        await BaseUrl.patch(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend
        );
        setShowFormModal(false);
        await fetchMedicalRecords(expandedAppointmentId);  // Refresh the medical records after update
        setSuccessMessage("Document file updated successfully");
      } else {
        // Create new (POST request)
        await BaseUrl.post(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend
        );
        setShowFormModal(false);
        await fetchMedicalRecords(expandedAppointmentId);  // Refresh the medical records after saving
        setSuccessMessage("Document record saved successfully");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      setErrorMessage("Failed to save document record");
    }
};
 
 
  // const fetchDocumentIds = async (appointmentId) => {
  //   try {
  //     const response = await BaseUrl.get(
  //       `/patient/patientdocumentusingappointmentid/`,
  //       {
  //         params: {
  //           appointment: appointmentId,
  //         },
  //       }
  //     );
 
  //     if (response.status === 200) {
  //       const ids = response.data.map((doc) => doc.id);
  //       setDocumentIds(ids); // Ensure you have a state or a way to handle these IDs in your component
  //     } else {
  //       console.error("Failed to fetch document IDs");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching document IDs:", error);
  //   }
  // };
 
  const fetchDocumentIds = async (appointmentId) => {
    try {
      const response = await BaseUrl.get(
        `/patient/patientdocumentusingappointmentid/`,
        {
          params: {
            appointment: appointmentId,
          },
        }
      );
 
      if (response.status === 200) {
        const ids = response.data.map((doc) => doc.id);
        setDocumentIds(ids);
      } else {
        console.error("Failed to fetch document IDs");
      }
    } catch (error) {
      console.error("Error fetching document IDs:", error);
    }
  };
  const handlePreview = async (documentId) => {
    try {
      const response = await BaseUrl.get(
        `/patient/patientprescriptonfileView/`,
        {
          params: { document_id: documentId },
          responseType: "blob",
        }
      );
      const fileType = response.data.type;
      const url = URL.createObjectURL(response.data);
      setPreviewFileType(fileType);
      setPreviewFileUrl(url);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error previewing document:", error);
      setShowToast(true);
      setToastMessage("Failed to preview document.");
      setToastVariant("danger");
    }
  };
 
  const handleFileSelectForPrescription = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
 
  const toggleForm = async (appointment_id, details) => {
    // Clear all state before fetching new data
    setFormDetails({});
    setRecordDetails({
      mobile_number: "",
      blood_pressure: "",
      weight: "",
      height: "",
      sugar_level: "",
      oxygen_level: "",
      symptoms: "",
      symptoms_comment: "",
      body_temperature: "",
      appointment_id: "",
    });
    setPrescriptions([
      { medicine_name: "", time: [], comment: "", description: "" },
    ]);
    setSelectedSymptoms([]);
    setPrescriptionDocuments([]);
    setMedicalRecords([]); // Clear medical records
 
    // Check if the same appointment is clicked (to close the expanded section)
    if (expandedAppointmentId === appointment_id) {
      setExpandedAppointmentId(null); // Close the expanded section
      setShowPrescriptionForm(false);
      setShowRecordForm(false);
      setShowVitalForm(false);
      setShowMedicalRecords(false);
      setShowSymptomsForm(false);
    } else {
      // Set the newly selected appointment
      setExpandedAppointmentId(appointment_id);
 
      // Set the form details for the new patient
      setFormDetails({
        name: details.name || "",
        age: details.age || "",
        gender: details.gender || "",
        mobile_number: details.mobile_number || "",
        address: details.address || "",
      });
 
      // ** Show forms immediately **
      setShowVitalForm(true);
      setShowPrescriptionForm(true);
      setShowRecordForm(true);
      setShowSymptomsForm(true);
      setShowMedicalRecords(true);
 
      try {
        // Extract patient_id from the token
        const token = localStorage.getItem("patient_token");
        const decodedToken = jwtDecode(token);
        const patient_id = decodedToken.patient_id; // Extract patient_id from the token
 
        if (!patient_id) {
          throw new Error("No patient ID found in token");
        }
 
        // Fetch data for the patient, without waiting for each API to complete before proceeding to the next
        const fetchDataForPatient = async () => {
          const patientPromise = BaseUrl.get(`/patient/patient/`, {
            params: {
              patient_id: patient_id, // Use the patient_id from the token
              appointment_id: appointment_id,
            },
          });
 
          const checkupPromise = BaseUrl.get(`/patient/patientcheckup/`, {
            params: { appointment_id: appointment_id },
          });
 
          const prescriptionPromise = BaseUrl.get(
            `/patient/patientpriscription/`,
            {
              params: {
                patient_id: patient_id, // Use the patient_id from the token
                appointment_id: appointment_id,
              },
            }
          );
 
          const prescriptionDocPromise = BaseUrl.get(
            `/patient/patientprescriptonfile/`,
            {
              params: { appointment_id: appointment_id },
            }
          );
 
          const symptomsPromise = BaseUrl.get(`/doctor/symptomsdetail/`, {
            params: { appointment_id: appointment_id },
          });
 
          // Use Promise.allSettled to ensure all promises are hit, regardless of whether any fail
          const results = await Promise.allSettled([
            patientPromise,
            checkupPromise,
            prescriptionPromise,
            prescriptionDocPromise,
            symptomsPromise,
            fetchDocumentIds(appointment_id), // fetch document ids
            fetchMedicalRecords(appointment_id), // fetch medical records
          ]);
 
          // Handle patient details response
          const patientResponse = results[0];
          if (
            patientResponse.status === "fulfilled" &&
            patientResponse.value.status === 200
          ) {
            const patientDetails = patientResponse.value.data;
            setFormDetails((prevDetails) => ({
              ...prevDetails,
              ...patientDetails,
            }));
          } else {
            console.error(
              "Failed to fetch patient details:",
              patientResponse.reason
            );
          }
 
          // Handle checkup details response
          const checkupResponse = results[1];
          if (
            checkupResponse.status === "fulfilled" &&
            checkupResponse.value.status === 200
          ) {
            const checkupDetails = checkupResponse.value.data[0];
            setRecordDetails((prevDetails) => ({
              ...prevDetails,
              ...checkupDetails,
            }));
          } else {
            console.error(
              "Failed to fetch checkup details:",
              checkupResponse.reason
            );
          }
 
          // Handle prescriptions response
          const prescriptionResponse = results[2];
          if (
            prescriptionResponse.status === "fulfilled" &&
            prescriptionResponse.value.status === 200
          ) {
            setPrescriptions(prescriptionResponse.value.data);
          } else {
            console.error(
              "Failed to fetch prescriptions:",
              prescriptionResponse.reason
            );
          }
 
          // Handle prescription documents response
          const prescriptionDocResponse = results[3];
          if (
            prescriptionDocResponse.status === "fulfilled" &&
            prescriptionDocResponse.value.status === 200
          ) {
            setPrescriptionDocuments(prescriptionDocResponse.value.data);
          } else {
            console.error(
              "Failed to fetch prescription documents:",
              prescriptionDocResponse.reason
            );
          }
 
          // Handle symptoms response
          const symptomsResponse = results[4];
          if (
            symptomsResponse.status === "fulfilled" &&
            symptomsResponse.value.status === 200
          ) {
            setSelectedSymptoms(symptomsResponse.value.data);
          } else {
            console.error("Failed to fetch symptoms:", symptomsResponse.reason);
          }
        };
 
        // Run the fetch operation for the patient
        await fetchDataForPatient();
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    }
  };
 
  const fetchPatientDetailsData = async (appointment_id) => {
    try {
      const token = localStorage.getItem("patient_token");
      const decodedToken = jwtDecode(token);
      const patient_id = decodedToken.patient_id;
 
      const response = await BaseUrl.get(
        `/patient/patient/?patient_id=${patient_id}&appointment_id=${appointment_id}`
      );
 
      if (response.status === 200) {
        const patientDetails = response.data;
        setFormDetails((prevDetails) => ({
          ...prevDetails,
          ...patientDetails,
        }));
      } else {
        throw new Error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setErrorMessage("Error fetching patient details.");
    }
  };
 
  const fetchPrescriptionDetailsData = async (appointment_id) => {
    try {
      const token = localStorage.getItem("patient_token");
      const decodedToken = jwtDecode(token);
      const patient_id = decodedToken.patient_id;
 
      if (!patient_id) {
        throw new Error("No patient ID found");
      }
 
      const fetchDataResponse = await BaseUrl.get(
        `/patient/patientcheckup/?appointment_id=${appointment_id}`
      );
 
      if (fetchDataResponse.status === 200) {
        const fetchedData = fetchDataResponse.data[0];
 
        setPrescriptionDetails({
          ...prescriptionDetails,
          ...fetchedData,
        });
      } else {
        throw new Error("Failed to fetch prescription data");
      }
    } catch (error) {
      console.error("Error fetching prescription data:", error);
      setErrorMessage(
        error.response?.data?.error || "Error fetching prescription data."
      );
    }
  };
  const fetchVitalDetailsData = async (appointment_id) => {
    try {
      const token = localStorage.getItem("patient_token");
      const decodedToken = jwtDecode(token);
      const patient_id = decodedToken.patient_id;
 
      if (!patient_id) {
        throw new Error("No patient ID found");
      }
 
      const fetchDataResponse = await BaseUrl.get(
        `/patient/patientcheckup/?appointment_id=${appointment_id}`
      );
 
      if (fetchDataResponse.status === 200) {
        const fetchedData = fetchDataResponse.data[0];
 
        setPrescriptionDetails({
          ...prescriptionDetails,
          ...fetchedData,
        });
      } else {
        throw new Error("Failed to fetch prescription data");
      }
    } catch (error) {
      console.error("Error fetching prescription data:", error);
      setErrorMessage(
        error.response?.data?.error || "Error fetching prescription data."
      );
    }
  };
 
  const fetchRecordDetailsData = async (appointment_id) => {
    try {
      const response = await BaseUrl.get(
        `/patient/patientcheckup/?appointment_id=${appointment_id}`
      );
      if (response.status === 200) {
        const fetchedData = response.data[0];
        setRecordDetails(fetchedData);
      } else {
        throw new Error("Failed to fetch record data");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error fetching record data."
      );
    }
  };
 
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };
 
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("patient_token");
      const decodedToken = jwtDecode(token);
      const patient_id = decodedToken.patient_id;
 
      if (!patient_id) {
        throw new Error("No patient ID found");
      }
 
      const response = await BaseUrl.get("/patientappointment/searchmyslot/", {
        params: {
          patient_id: patient_id,
          query:
            searchParams.doctor_name ||
            searchParams.mobile_number ||
            searchParams.patient_name ||
            searchParams.specialization,
        },
      });
 
      if (response.status === 200) {
        setErrorMessage("");
        const fetchedAppointments = response.data.map((appointment) => ({
          id: appointment.id,
          appointment_date: appointment.appointment_date,
          doctor_specialization: appointment.doctor_specialization,
          booked_by: appointment.booked_by,
          appointment_slot: appointment.appointment_slot,
          doctor_name: appointment.doctor_name,
        }));
        setAppointments(fetchedAppointments);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.error);
        setAppointments([]); // Clear the appointments list
      } else {
        setErrorMessage(
          error.response?.data?.error || "Error fetching search results."
        );
      }
    }
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  const handlePrescriptionInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
 
  const handleRecordInputChange = (e) => {
    const { name, value } = e.target;
    setRecordDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
 
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFileUrl("");
    setPreviewFileType("");
  };
  const togglePrescriptionForm = async (appointment_id) => {
    setShowPrescriptionForm(!showPrescriptionForm);
    setShowVitalForm(false); // Close the vital form if open
    setExpandedAppointmentId(appointment_id);
 
    if (!showPrescriptionForm) {
      try {
        // Find the selected appointment object from already fetched appointments
        const selectedAppointment = appointments.find(
          (appointment) => appointment.appointment_id === appointment_id
        );
 
        if (selectedAppointment) {
          const patient_id = selectedAppointment.patient_id; // Extract patient_id
 
          // Fetch prescription data based on patient_id and appointment_id
          const fetchDataResponse = await BaseUrl.get(
            `/patient/patientpriscription/?patient_id=${patient_id}&appointment_id=${appointment_id}`
          );
 
          if (fetchDataResponse.status === 200) {
            const fetchedData = fetchDataResponse.data[0]; // Assuming fetchedData is an object with required fields
 
            // Update prescription details with fetched data
            setPrescriptionDetails({
              patient_id: patient_id, // Use the correct patient_id
              appointment_id: appointment_id, // Use the correct appointment_id
              medicine_name: fetchedData.medicine_name || "", // Populate medicine_name
              time: fetchedData.time || "", // Populate time
              comment: fetchedData.comment || "", // Populate comment
              description: fetchedData.description || "", // Populate description
            });
          } else {
            throw new Error("Failed to fetch prescription data");
          }
        } else {
          throw new Error("Appointment not found");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.error || "Error fetching prescription data."
        );
      }
    } else {
      // Clear prescription form fields when toggling to hide form
      setPrescriptionDetails({
        patient_id: formDetails.patient_id, // Assuming patient_id is needed
        medicine_name: "",
        time: "",
        comment: "",
        description: "",
        appointment_id: "", // Assuming appointment_id should be cleared
      });
    }
  };
  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
 
    // Update the specific prescription entry based on the index
    const updatedPrescriptions = prescriptions.map((prescription, i) =>
      i === index ? { ...prescription, [name]: value } : prescription
    );
 
    setPrescriptions(updatedPrescriptions);
  };
 
  const handleMoreOptionsChange = (index, event) => {
    const value = event.target.value;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, more_options: value } : symptom
      )
    );
  };
  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setRecordDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
 
  const handleSinceChange = (index, event) => {
    const value = event.target.value;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, since: value } : symptom
      )
    );
  };
  const handleSeverityChange = (index, event) => {
    const { value } = event.target;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, severity: value } : symptom
      )
    );
  };
  const handleAddSymptom = (symptom) => {
    setSelectedSymptoms((prevSymptoms) => [
      {
        id: symptom.id,
        symptoms_name: symptom.symptoms_name,
        Symptoms_id: symptom.id,
        severity: "",
        since: "",
        more_options: "",
      },
      ...prevSymptoms, // Prepend the new symptom to the start of the array
    ]);
    setSearchSymptom("");
    setSearchResults([]);
  };
  const handleSymptomSearch = async (e) => {
    const value = e.target.value;
    setSearchSymptom(value);
 
    if (value) {
      try {
        const response = await BaseUrl.get(`/doctor/symptomssearch/`, {
          params: { name: value },
        });
 
        const symptomsFromApi = response.data;
 
        if (symptomsFromApi.length > 0) {
          setSearchResults(symptomsFromApi);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    } else {
      setSearchResults([]);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handlePrescriptionDocs = async (appointment_id) => {
    if (!selectedFile) {
      return;
    }
 
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === appointment_id
      );
 
      if (!selectedAppointment) {
        throw new Error("Appointment not found");
      }
 
      const appointment_date = selectedAppointment.appointment_date;
 
      const formData = new FormData();
      formData.append("document_file", selectedFile);
      formData.append("document_date", appointment_date);
      formData.append("appointment", expandedAppointmentId);
 
      const response = await BaseUrl.post(
        `/patient/patientprescriptonfile/`,
        formData
      );
 
      if (response.status === 200 || response.status === 201) {
        setPrescriptionDocuments((prevDocuments) => [
          ...prevDocuments,
          response.data,
        ]);
        setShowPrescriptionDocsForm(false);
        // await fetchMedicalRecords(appointment_id); // Fetch updated medical records
        // await fetchAppointmentDetails(patientId); // Fetch updated appointments
        setSuccessMessage("Prescription document uploaded successfully");
      } else {
        console.error("Failed to upload prescription document");
        setErrorMessage("Failed to upload prescription document");
      }
    } catch (error) {
      console.error("Error uploading prescription document:", error);
      setErrorMessage("Error uploading prescription document");
    }
  };
  const handleCloseMessageModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };
  const handleAddFileClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const toggleFormModal = async () => {
    setShowFormModal((prev) => !prev);
 
    let decodedToken = null;
 
    try {
      // Retrieve and decode the patient token
      const token = localStorage.getItem("patient_token");  // Assuming patient token is stored as 'patient_token'
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding patient token:", error);
      return;
    }
 
    // Decode patient_id and user_type from the token
    const patientId = decodedToken.patient_id;
    const userType = decodedToken.user_type;
 
    if (!showFormModal) {
      try {
        const appointmentId = expandedAppointmentId;
        if (!appointmentId) {
          console.error("No appointment ID found");
          return;
        }
 
        // Fetch patient details by appointment_id
        const documentResponse = await BaseUrl.get(`/patient/patientname/`, {
          params: {
            appointment_id: appointmentId,
          },
        });
 
        if (documentResponse.status === 200) {
          const documentData = documentResponse.data;
 
          // Update the form with fetched document data
          setFormData((prevFormData) => ({
            ...prevFormData,
            document_name: documentData.document_name || "",
            document_date: documentData.document_date || "",
            document_type: documentData.document_type || "",
            document_file: documentData.document_file || "",
            patient_name: documentData.name || "", // Ensure the name is correctly set
          }));
        } else {
          console.error("Failed to fetch document data");
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    } else {
      if (
        formData.document_name &&
        formData.patient_name &&
        selectedFiles.length > 0
      ) {
        const formDataToSend = new FormData();
        formDataToSend.append("appointment", expandedAppointmentId);
        formDataToSend.append("document_name", formData.document_name);
        formDataToSend.append("patient_name", formData.patient_name);
        formDataToSend.append("document_date", formData.document_date);
        formDataToSend.append("document_type", formData.document_type);
        formDataToSend.append("document_file", selectedFiles[0]);
        formDataToSend.append("user_type", userType);  // Attach decoded user_type from token
        formDataToSend.append("user_id", patientId);   // Attach decoded patient_id from token
 
        try {
          // Send POST request to save document
          const postResponse = await BaseUrl.post(
            "/patient/patientdocumentusingappointmentid/",
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
 
          if (postResponse.status === 200) {
            setUploadedPrescription(selectedFiles[0]);
            await fetchMedicalRecords(expandedAppointmentId);
            setSuccessMessage("Document file uploaded successfully");
          } else {
            console.error("Failed to upload document");
            setErrorMessage("Failed to upload document file");
          }
        } catch (postError) {
          console.error("Error uploading document:", postError);
          setErrorMessage("Error uploading document file");
        }
      }
 
      // Reset form after submission
      setFormData({
        document_name: "",
        patient_name: "", // Reset patient name after submission
        document_date: "",
        document_type: "",
        document_file: "",
        patient_mobile_number: "",
      });
      setSelectedFiles([]);
      setEditingRecordId(null);
      setIsPrescriptionDocs(false);
    }
};
 
 
  const handleDownloadPrescriptionDoc = async (doc) => {
    try {
      const response = await BaseUrl.get(
        `/patient/patientprescriptonfileView/`,
        {
          params: {
            patient_id: doc.patient,
            document_id: doc.id,
          },
          responseType: "blob", // Ensure it's downloading as a blob
        }
      );
      setSuccessMessage("Prescription document downloaded successfully");
 
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.document_name}.${
        response.data.type.split("/")[1]
      }`;
      link.click();
    } catch (error) {
      console.error("Error downloading prescription document:", error);
      setErrorMessage("Failed to download preset document");
    }
  };
  const addPrescriptionRow = () => {
    setPrescriptions([
      { medicine_name: "", time: "", comment: "", description: "" },
      ...prescriptions,
    ]);
  };
 
 return (
    <div
      className="container-fluid mt-5"
      style={{ width: "100%", backgroundColor: "#F8EDE3" }}
    >
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ backgroundColor: "#F8EDE3" }}
      >
        <b>
          <h2>My Appointments</h2>
        </b>
        <div className="input-group" style={{ maxWidth: "600px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="DoctorName/MobileNumber/PatientName/Specialisation/AppointmentDate"
            name="doctor_name"
            value={searchParams.doctor_name}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Appointment Date</th>
            <th>Specialization</th>
            <th>Patient Name</th>
            <th>Time</th>
            <th>Doctor</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <React.Fragment key={appointment.id}>
                <tr
                  style={{
                    backgroundColor:
                      expandedAppointmentId === appointment.id
                        ? "#f0f0f0"
                        : "transparent",
                  }}
                >
                  <td>{appointment.appointment_date}</td>
                  <td>{appointment.doctor_specialization}</td>
                  <td>{appointment.booked_by}</td>
                  <td>{appointment.appointment_slot}</td>
                  <td>{appointment.doctor_name}</td>
                  <td>
                    <FaEdit
                      className="me-2"
                      onClick={() => toggleForm(appointment.id, appointment)}
                    />
                    <FaTrash
                      className="me-2"
                      onClick={() => {
                        setShowConfirmation(true);
                        setAppointmentIdToDelete(appointment.id);
                      }}
                    />
                    {expandedAppointmentId === appointment.id ? (
                      <FaChevronUp
                        onClick={() => setExpandedAppointmentId(null)}
                      />
                    ) : (
                      <FaChevronDown
                        onClick={() => toggleForm(appointment.id, appointment)}
                      />
                    )}
                  </td>
                </tr>
                {expandedAppointmentId === appointment.id && (
                  <tr>
                    <td colSpan="6">
                      <Card
                        className="shadow-sm mt-3"
                        style={{
                          borderRadius: "15px",
                          border: "2px solid #ffc107",
                          background:
                            "linear-gradient(145deg, #fff3cd, #ffeeba)",
                        }}
                      >
                        <Card.Body>
                          <b>
                            <h5>Patient Details</h5>
                          </b>
                          <Form>
                            <Row className="mb-3">
                              <Col>
                                <Form.Group controlId="formName">
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="name"
                                    value={formDetails.name || ""}
                                    onChange={handleInputChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formMobileNumber">
                                  <Form.Label>Mobile Number</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="mobile_number"
                                    value={formDetails.mobile_number || ""}
                                    onChange={handleInputChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formAge">
                                  <Form.Label>Age</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="age"
                                    value={formDetails.age || ""}
                                    onChange={handleInputChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formGender">
                                  <Form.Label>Gender</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="gender"
                                    value={formDetails.gender || ""}
                                    onChange={handleInputChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formAddress">
                                  <Form.Label>Address</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="address"
                                    value={formDetails.address || ""}
                                    onChange={handleInputChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Form>
                        </Card.Body>
                      </Card>
                    </td>
                  </tr>
                )}
                {expandedAppointmentId === appointment.id &&
                  showSymptomsForm && (
                    <tr>
                      <td colSpan="6">
                        <Card
                          className="shadow-sm mt-3"
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #fd7e14",
                            background:
                              "linear-gradient(145deg, #fde2cd, #fbd5b4)",
                          }}
                        >
                          <Card.Body>
                            <b>
                              <h5>Symptoms</h5>
                            </b>
                            <Form>
                              <Row className="mb-3">
                                <Col xs={12}>
                                  <Form.Group controlId="symptomSearch">
                                    {/* <Form.Label>Search Symptoms</Form.Label> */}
                                    {/* <Form.Control
                      type="text"
                      placeholder="Search symptoms"
                      value={searchSymptom}
                      onChange={handleSymptomSearch}
                    /> */}
                                    {searchResults.length > 0 && (
                                      <ul className="list-group mt-2">
                                        {searchResults.map((symptom, index) => (
                                          <li
                                            key={index}
                                            className="list-group-item"
                                            onClick={() =>
                                              handleAddSymptom({
                                                id: symptom.id,
                                                symptoms_name:
                                                  symptom.symptoms_name,
                                                severity: "",
                                              })
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            {symptom.symptoms_name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </Form.Group>
                                </Col>
                              </Row>
 
                              <Table striped bordered hover>
                                <thead className="table-light">
                                  <tr>
                                    <th>Symptom</th>
                                    <th>Severity</th>
                                    <th>Since</th>
                                    <th>More Options</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedSymptoms.map((symptom, index) => (
                                    <tr key={index}>
                                      <td>{symptom.symptoms_name}</td>
                                      <td>
                                        <Form.Select
                                          name={`severity-${index}`}
                                          value={symptom.severity}
                                          onChange={(e) =>
                                            handleSeverityChange(index, e)
                                          }
                                          disabled
                                        >
                                          <option value="">
                                            Select Severity
                                          </option>
                                          <option value="mild">Mild</option>
                                          <option value="moderate">
                                            Moderate
                                          </option>
                                          <option value="severe">Severe</option>
                                        </Form.Select>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="text"
                                          name={`since-${index}`}
                                          value={symptom.since}
                                          onChange={(e) =>
                                            handleSinceChange(index, e)
                                          }
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="text"
                                          name={`more_options-${index}`}
                                          value={symptom.more_options}
                                          onChange={(e) =>
                                            handleMoreOptionsChange(index, e)
                                          }
                                          disabled
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </Form>
                          </Card.Body>
                        </Card>
                      </td>
                    </tr>
                  )}
 
{showVitalForm && expandedAppointmentId === appointment.id && (
                  <tr>
                    <td colSpan="6">
                      <Card
                        className="shadow-sm mt-3"
                        style={{
                          borderRadius: "15px",
                          border: "2px solid #17a2b8",
                          background:
                            "linear-gradient(145deg, #e3f5f9, #d0ebf5)",
                        }}
                      >
                        <Card.Body>
                          <h5>Vitals</h5>
                          <Form>
                            <Row className="mb-3">
                              <Col>
                                <Form.Group controlId="formBloodPressure">
                                  <Form.Label>Blood Pressure</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="blood_pressure"
                                    value={recordDetails.blood_pressure}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formOxygenLevel">
                                  <Form.Label>Oxygen Level</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="oxygen_level"
                                    value={recordDetails.oxygen_level}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formTemperature">
                                  <Form.Label>Body Temperature</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="body_temperature"
                                    value={recordDetails.body_temperature}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formHeartRate">
                                  <Form.Label>Heart Rate</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="heart_rate"
                                    value={recordDetails.heart_rate}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formPulseRate">
                                  <Form.Label>Pulse Rate</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="pulse_rate"
                                    value={recordDetails.pulse_rate}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formSugarLevel">
                                  <Form.Label>Sugar Level</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="sugar_level"
                                    value={recordDetails.sugar_level}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group controlId="formWeight">
                                  <Form.Label>Weight</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="weight"
                                    value={recordDetails.weight}
                                    onChange={handleVitalChange}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Form>
                        </Card.Body>
                      </Card>
                    </td>
                  </tr>
                )}
 
                {showPrescriptionForm &&
                  expandedAppointmentId === appointment.id && (
                    <tr>
                      <td colSpan="6">
                        <Card
                          className="shadow-sm mt-3"
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #dc3545",
                            background:
                              "linear-gradient(145deg, #f8d7da, #f1aeb6)",
                          }}
                        >
                          <Card.Body>
                            <div className="d-flex justify-content-center align-items-center mb-3">
                              <h5 className="text-center d-inline-block mb-0">
                                Prescription
                              </h5>
                            </div>
 
                            <Form>
                              {prescriptions.map((prescription, index) => (
                                <Row className="mb-3" key={index}>
                                  <Col>
                                    <Form.Group
                                      controlId={`formMedicineName${index}`}
                                    >
                                      <Form.Label>Medicine Name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="medicine_name"
                                        value={prescription.medicine_name}
                                        onChange={(e) =>
                                          handlePrescriptionChange(index, e)
                                        }
                                        disabled
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group
                                      controlId={`formComment${index}`}
                                    >
                                      <Form.Label>Precautions</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="comment"
                                        value={prescription.comment}
                                        onChange={(e) =>
                                          handlePrescriptionChange(index, e)
                                        }
                                        disabled
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group
                                      controlId={`formDescription${index}`}
                                    >
                                      <Form.Label>Description</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="description"
                                        value={prescription.description}
                                        onChange={(e) =>
                                          handlePrescriptionChange(index, e)
                                        }
                                        disabled
                                      />
                                    </Form.Group>
                                  </Col>
 
                                  {/* Time Slot Dropdown */}
                                  <Col>
                                    <Form.Group
                                      controlId={`formTimeSlot${index}`}
                                    >
                                      <Form.Label>Time</Form.Label>
                                      <Form.Control
                                        as="select"
                                        name="time"
                                        value={prescription.time}
                                        onChange={(e) =>
                                          handlePrescriptionChange(index, e)
                                        }
                                        disabled
                                      >
                                        <option value="">Select Time</option>
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
                                        <option value="afternoon">
                                          Afternoon
                                        </option>
                                        <option value="evening">Evening</option>
                                        <option value="night">Night</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
 
                                  <Col className="d-flex align-items-center"></Col>
                                </Row>
                              ))}
                            </Form>
 
                            <Button
                              variant="outline-primary"
                              className="float-end mb-5"
                              onClick={() => {
                                setIsPrescriptionDocs(true);
                                setShowPrescriptionDocsForm(true);
                              }}
                            >
                              Upload Prescription
                            </Button>
                          </Card.Body>
                        </Card>
 
                        {/* Prescription Documents Section */}
                        <Table striped bordered hover>
                          <thead className="table-light">
                            <tr>
                              <th>SNo.</th>
                              <th>Document Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptionDocuments.map((doc, index) => (
                              <React.Fragment key={doc.id}>
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{doc.document_date}</td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => handlePreview(doc.id)}
                                      >
                                        Preview
                                      </Button>
                                      <DropdownButton
                                        id="dropdown-basic-button"
                                        title={
                                          <FontAwesomeIcon icon={faEllipsisV} />
                                        }
                                        variant="secondary"
                                      >
                                        <Dropdown.Item
                                          onClick={() =>
                                            handleDownloadPrescriptionDoc(doc)
                                          }
                                        >
                                          Download
                                        </Dropdown.Item>
                                      </DropdownButton>
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </Table>
 
                        {/* Modal for uploading prescription files */}
                        <Modal
                          show={showPrescriptionDocsForm}
                          onHide={() => setShowPrescriptionDocsForm(false)}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Upload Prescription File</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form>
                              <Form.Group controlId="formPrescriptionFile">
                                <Form.Label>Prescription File</Form.Label>
                                <Form.Control
                                  type="file"
                                  onChange={handleFileSelectForPrescription}
                                />
                              </Form.Group>
                            </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={() => setShowPrescriptionDocsForm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handlePrescriptionDocs(
                                  appointment.appointment_id
                                )
                              }
                            >
                              Upload
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </td>
                    </tr>
                  )}
 
                {showRecordForm && expandedAppointmentId === appointment.id && (
                  <tr>
                    <td colSpan="6">
                      <Card
                        className="shadow-sm mt-3"
                        style={{
                          borderRadius: "15px",
                          border: "2px solid #6f42c1",
                          background:
                            "linear-gradient(145deg, #e5e5f7, #d8d8f1)",
                        }}
                      >
                        <Card.Body>
                          <h5>Document</h5>
                          <Button
                            variant="outline-primary"
                            className="float-end mb-5"
                            onClick={() => {
                              setIsPrescriptionDocs(true);
                              toggleFormModal();
                            }}
                          >
                            Upload Document
                          </Button>
                          <Row className="mb-5">
                            <Col xs={12} md={12}>
                              <Table striped bordered hover>
                                <thead className="table-light">
                                  <tr>
                                    <th>Document Name</th>
                                    <th>Patient Name</th>
                                    <th>Document Date</th>
                                    <th>Document Type</th>
                                    <th>Document File</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {medicalRecords.map((record) => (
                                    <tr key={record.id}>
                                      <td>{record.document_name}</td>
                                      <td>{record.patient_name}</td>
                                      <td>{record.document_date}</td>
                                      <td>{record.document_type}</td>
                                      <td>
                                        <Button
                                          onClick={() => handleViewFile(record)}
                                        >
                                          View
                                        </Button>
                                      </td>
                                      <td>
                                        <DropdownButton
                                          id="dropdown-basic-button"
                                          title={
                                            <FontAwesomeIcon
                                              icon={faEllipsisV}
                                            />
                                          }
                                          variant="secondary"
                                        >
                                          <Dropdown.Item
                                            onClick={() =>
                                              handleModifyRecord(record)
                                            }
                                          >
                                            Modify
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={() =>
                                              handleDownloadFile(record)
                                            }
                                          >
                                            Download
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={() =>
                                              handleDeleteRecord(record.id)
                                            }
                                          >
                                            Delete
                                          </Dropdown.Item>
                                        </DropdownButton>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </Col>
                          </Row>
 
                          <Modal show={showFormModal} onHide={toggleFormModal}>
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
                                      setFormData({
                                        ...formData,
                                        document_name: e.target.value,
                                      })
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
                                      setFormData({
                                        ...formData,
                                        patient_name: e.target.value,
                                      })
                                    }
                                  />
                                </Form.Group>
                                <Form.Group controlId="documentDate">
                                  <Form.Label>Document Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={formData.document_date}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        document_date: e.target.value,
                                      })
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
                                        setFormData({
                                          ...formData,
                                          document_type: "report",
                                        })
                                      }
                                    >
                                      <FontAwesomeIcon icon={faFileAlt} />{" "}
                                      Report
                                    </Button>
                                    <Button
                                      variant={
                                        formData.document_type === "invoice"
                                          ? "primary"
                                          : "outline-primary"
                                      }
                                      onClick={() =>
                                        setFormData({
                                          ...formData,
                                          document_type: "invoice",
                                        })
                                      }
                                    >
                                      <FontAwesomeIcon icon={faReceipt} />{" "}
                                      Invoice
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
                                    <Button onClick={handleAddFileClick}>
                                      Add a File
                                    </Button>
                                    {selectedFiles.map((file, index) => (
                                      <div
                                        key={index}
                                        className="selected-file"
                                      >
                                        <span>{file.name}</span>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFile(index)
                                          }
                                        >
                                          <FontAwesomeIcon
                                            icon={faTimesSolid}
                                          />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="primary" onClick={handleSave}>
                                {editingRecordId ? "Update" : "Save"}
                              </Button>
                            </Modal.Footer>
                          </Modal>
 
                          <Modal
                            show={!!errorMessage || !!successMessage}
                            onHide={handleCloseMessageModal}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>
                                {errorMessage ? "Error" : "Success"}
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <p>{errorMessage || successMessage}</p>
                            </Modal.Body>
                            <Modal.Footer></Modal.Footer>
                          </Modal>
                        </Card.Body>
                      </Card>
                    </td>
                  </tr>
                )}
                {/* Preview Modal */}
                <Modal
                  show={showPreviewModal}
                  onHide={handleClosePreviewModal}
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Preview Document</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
                    {previewFileType.includes("image") ? (
                      <img
                        src={previewFileUrl}
                        alt="Document Preview"
                        style={{
                          maxWidth: "100%", // Fit image within the modal width
                          maxHeight: "500px", // Ensure the image doesn't exceed the modal height
                          display: "block",
                          margin: "0 auto", // Center the image
                        }}
                      />
                    ) : previewFileType.includes("pdf") ? (
                      <iframe
                        src={previewFileUrl}
                        title="Document Preview"
                        style={{
                          width: "100%",
                          height: "500px", // Set a fixed height for PDF preview
                          border: "none",
                        }}
                      ></iframe>
                    ) : (
                      <p>No preview available for this file type.</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleClosePreviewModal}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6">No appointments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
 
export default PatientSlot;
 