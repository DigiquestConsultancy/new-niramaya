
// import React, { useState, useEffect } from "react";
// import {Modal,Button,Form,Row,Col,Table,Dropdown,DropdownButton,Container,Card,Toast,ToastContainer,} from "react-bootstrap";
// import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faFileAlt,faReceipt,faEllipsisV,faTimes as faTimesSolid,} from "@fortawesome/free-solid-svg-icons";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
 
// const ClinicBookedAppointment = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [clinicId, setClinicId] = useState("");
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
//   const [expandedPrescriptionId, setExpandedPrescriptionId] = useState(null);
//   const [formDetails, setFormDetails] = useState({});
//   const [selectedPatientId, setSelectedPatientId] = useState(null);
//   const [searchParams, setSearchParams] = useState({ booked_by: "" });
//   const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
//   const [showVitalForm, setShowVitalForm] = useState(false);
//   const [prescriptionDocuments, setPrescriptionDocuments] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([{ medicine_name: "", time: "", comment: "", description: "" },]);
//   const [showRecordForm, setShowRecordForm] = useState(false);
//   const [recordDetails, setRecordDetails] = useState({mobile_number: "",blood_pressure: "",weight: "",height: "",sugar_level: "",oxygen_level: "",symptoms: "",symptoms_comment: "",body_temperature: "",appointment_id: "",});
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [previewFileUrl, setPreviewFileUrl] = useState("");
//   const [previewFileType, setPreviewFileType] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [formData, setFormData] = useState({
//     document_name: "",
//     patient_name: "",
//     document_date: "",
//     document_type: "",
//     document_file: "",
//   });
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [showMedicalRecords, setShowMedicalRecords] = useState(false);
//   const [editingRecordId, setEditingRecordId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [showSymptomsForm, setShowSymptomsForm] = useState(false);
//   const [searchSymptom, setSearchSymptom] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedSymptoms, setSelectedSymptoms] = useState([]);
//   const [uploadedPrescription, setUploadedPrescription] = useState(null);
//   const [isPrescriptionDocs, setIsPrescriptionDocs] = useState(false);
//   const [showPrescriptionDocsForm, setShowPrescriptionDocsForm] =
//     useState(false);
//   const [documentIds, setDocumentIds] = useState([]);
 
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState("success"); // 'success' or 'danger'
 
//   useEffect(() => {
//     const token = localStorage.getItem("patient_token");
//     if (!token) return;
 
//     try {
//       const decodedToken = jwtDecode(token);
//       const mobile_number = decodedToken.mobile_number;
//       setMobileNumber(mobile_number);
 
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         mobile_number: mobile_number,
//       }));
 
//       fetchMedicalRecords(mobile_number);
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }, []);
 
//   const fetchMedicalRecords = async (appointment_id) => {
//     if (!appointment_id) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
 
//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.clinic_id;
//       const userType = decodedToken.user_type;
 
//       const response = await BaseUrl.get(
//         `/patient/patientdocumentusingappointmentid/`,
//         {
//           params: {
//             appointment: appointment_id,
//           },
//         }
//       );
//       if (Array.isArray(response.data)) {
//         setMedicalRecords(response.data);
//       } else {
//         setMedicalRecords([]);
//       }
//       setShowMedicalRecords(true);
//     } catch (error) {
//       console.error("Error fetching medical records:", error);
//       setMedicalRecords([]);
//     }
//   };
 
//   const handleDownloadFile = async (record) => {
//     try {
//       const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
//         params: {
//           patient_id: record.patient,
//           document_id: record.id,
//         },
//         responseType: "blob",
//       });
 
//       const url = URL.createObjectURL(response.data);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${record.document_name}.${
//         response.data.type.split("/")[1]
//       }`;
//       link.click();
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       setShowToast(true);
//       setToastMessage("Failed to download file.");
//       setToastVariant("danger");
//     }
//   };
 
//   const toggleFormModal = async () => {
//     setShowFormModal((prev) => !prev);
 
//     let decodedToken = null;
 
//     try {
//       const token = localStorage.getItem("token");
//       decodedToken = jwtDecode(token);
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return;
//     }
 
//     const clinicId = decodedToken.clinic_id;
//     const userType = decodedToken.user_type;
 
//     if (!showFormModal) {
//       try {
//         const appointmentId = expandedAppointmentId;
//         if (!appointmentId) {
//           console.error("No appointment ID found");
//           return;
//         }
 
//         const documentResponse = await BaseUrl.get(`/patient/patientname/`, {
//           params: {
//             appointment_id: appointmentId,
//           },
//         });
 
//         if (documentResponse.status === 200) {
//           const documentData = documentResponse.data;
 
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             document_name: documentData.document_name || "",
//             document_date: documentData.document_date || "",
//             document_type: documentData.document_type || "",
//             document_file: documentData.document_file || "",
//             patient_name: documentData.name || "", // Ensure the name is correctly set
//           }));
//         } else {
//           console.error("Failed to fetch document data");
//         }
//       } catch (error) {
//         console.error("Error fetching document data:", error);
//       }
//     } else {
//       if (
//         formData.document_name &&
//         formData.patient_name &&
//         selectedFiles.length > 0
//       ) {
//         const formDataToSend = new FormData();
//         formDataToSend.append("appointment", expandedAppointmentId);
//         formDataToSend.append("document_name", formData.document_name);
//         formDataToSend.append("patient_name", formData.patient_name);
//         formDataToSend.append("document_date", formData.document_date);
//         formDataToSend.append("document_type", formData.document_type);
//         formDataToSend.append("document_file", selectedFiles[0]);
//         formDataToSend.append("user_type", userType);
//         formDataToSend.append("clinic_id", clinicId);
 
//         try {
//           const postResponse = await BaseUrl.post(
//             "/patient/patientdocumentusingappointmentid/",
//             formDataToSend,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
 
//           if (postResponse.status === 200) {
//             setUploadedPrescription(selectedFiles[0]);
//             await fetchMedicalRecords(expandedAppointmentId);
//             await fetchAppointments(clinicId);
//             setShowToast(true);
//             setToastMessage("Document uploaded successfully!");
//             setToastVariant("success");
//           } else {
//             console.error("Failed to upload document");
//             setShowToast(true);
//             setToastMessage("Failed to upload document.");
//             setToastVariant("danger");
//           }
//         } catch (postError) {
//           console.error("Error uploading document:", postError);
//           setShowToast(true);
//           setToastMessage("Error uploading document.");
//           setToastVariant("danger");
//         }
//       }
 
//       setFormData({
//         document_name: "",
//         patient_name: "", // Reset patient name after submission
//         document_date: "",
//         document_type: "",
//         document_file: "",
//         patient_mobile_number: "",
//       });
//       setSelectedFiles([]);
//       setEditingRecordId(null);
//       setIsPrescriptionDocs(false);
//     }
//   };
 
//   const handleSave = async () => {
//     let decodedToken = null;
 
//     try {
//       const token = localStorage.getItem("token");
//       decodedToken = jwtDecode(token);
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return;
//     }
 
//     const formDataToSend = new FormData();
 
//     formDataToSend.append("appointment", expandedAppointmentId);
//     formDataToSend.append("document_name", formData.document_name);
//     formDataToSend.append("patient_name", formData.patient_name);
//     formDataToSend.append("document_date", formData.document_date);
//     formDataToSend.append("document_type", formData.document_type);
 
//     if (selectedFiles.length > 0) {
//       formDataToSend.append("document_file", selectedFiles[0]);
//     }
 
//     formDataToSend.append("user_type", decodedToken.user_type);
//     formDataToSend.append("user_id", decodedToken.clinic_id);
 
//     try {
//       if (editingRecordId) {
//         // Include document_id in the payload for PATCH request
//         formDataToSend.append("document_id", editingRecordId);
 
//         await BaseUrl.patch(
//           `/patient/patientdocumentusingappointmentid/`,
//           formDataToSend
//         );
//         setShowFormModal(false);
//         await fetchMedicalRecords(expandedAppointmentId);
//         setShowToast(true);
//         setToastMessage("Record updated successfully!");
//         setToastVariant("success");
//       } else {
//         await BaseUrl.post(
//           `/patient/patientdocumentusingappointmentid/`,
//           formDataToSend
//         );
//         setShowFormModal(false);
//         await fetchMedicalRecords(expandedAppointmentId);
//         setShowToast(true);
//         setToastMessage("Record saved successfully!");
//         setToastVariant("success");
//       }
//     } catch (error) {
//       console.error("Error saving document:", error);
//       setShowToast(true);
//       setToastMessage("Failed to save record.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleFileSelect = (event) => {
//     const files = Array.from(event.target.files);
//     setSelectedFiles([...selectedFiles, ...files]);
//   };
 
//   const handleFileSelectForPrescription = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//   };
 
//   const handleCloseMessageModal = () => {
//     setErrorMessage("");
//     setSuccessMessage("");
//   };
 
//   const handleAddFileClick = () => {
//     document.getElementById("fileInput").click();
//   };
 
//   const handleDeleteFile = (index) => {
//     const updatedFiles = selectedFiles.filter((_, i) => i !== index);
//     setSelectedFiles(updatedFiles);
//   };
 
//   const handleDeleteRecord = async (recordId) => {
//     try {
//       await BaseUrl.delete(`/patient/patientdocumentusingappointmentid/`, {
//         data: {
//           document_id: recordId,
//         },
//       });
//       await fetchMedicalRecords(expandedAppointmentId);
//       await fetchAppointments(clinicId);
//       setShowToast(true);
//       setToastMessage("Record deleted successfully!");
//       setToastVariant("success");
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       setShowToast(true);
//       setToastMessage("Failed to delete record.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleModifyRecord = (record) => {
//     setFormData({
//       document_name: record.document_name,
//       patient_name: record.patient_name,
//       document_date: record.document_date,
//       document_type: record.document_type,
//     });
//     setSelectedFiles([]);
//     setEditingRecordId(record.id);
//     setShowFormModal(true);
//   };
 
//   const handleViewFile = async (record) => {
//     try {
//       const response = await BaseUrl.get(`/patient/viewdocumentbyid/`, {
//         params: {
//           patient_id: record.patient,
//           document_id: record.id,
//         },
//         responseType: "blob",
//       });
 
//       const fileType = response.data.type;
//       const url = URL.createObjectURL(response.data);
 
//       setPreviewFileType(fileType);
//       setPreviewFileUrl(url);
//       setShowPreviewModal(true);
//     } catch (error) {
//       console.error("Error viewing file:", error);
//       setShowToast(true);
//       setToastMessage("Failed to preview file.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleViewPrescription = async (prescriptionId, appointment_id) => {
//     if (expandedPrescriptionId === prescriptionId) {
//       setExpandedPrescriptionId(null);
//     } else {
//       try {
//         const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
//           params: { appointment_id: appointment_id },
//         });
//         const prescriptionData = response.data;
//         setPrescriptionDocuments(prescriptionData);
//         setExpandedPrescriptionId(prescriptionId);
//       } catch (error) {
//         console.error("Error viewing prescription:", error);
//         setShowToast(true);
//         setToastMessage("Failed to view prescription.");
//         setToastVariant("danger");
//       }
//     }
//   };
 
//   const handlePreview = async (documentId) => {
//     try {
//       const response = await BaseUrl.get(
//         `/patient/patientprescriptonfileView/`,
//         {
//           params: { document_id: documentId },
//           responseType: "blob",
//         }
//       );
//       const fileType = response.data.type;
//       const url = URL.createObjectURL(response.data);
//       setPreviewFileType(fileType);
//       setPreviewFileUrl(url);
//       setShowPreviewModal(true);
//     } catch (error) {
//       console.error("Error previewing document:", error);
//       setShowToast(true);
//       setToastMessage("Failed to preview document.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handlePrescriptionDocs = async (appointment_id) => {
//     if (!selectedFile) {
//       return;
//     }
 
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === appointment_id
//       );
 
//       if (!selectedAppointment) {
//         throw new Error("Appointment not found");
//       }
 
//       const appointment_date = selectedAppointment.appointment_date;
 
//       const formData = new FormData();
//       formData.append("document_file", selectedFile);
//       formData.append("document_date", appointment_date);
//       formData.append("appointment", appointment_id);
 
//       const response = await BaseUrl.post(
//         `/patient/patientprescriptonfile/`,
//         formData
//       );
 
//       if (response.status === 200 || response.status === 201) {
//         setPrescriptionDocuments((prevDocuments) => [
//           ...prevDocuments,
//           response.data,
//         ]);
//         setShowPrescriptionDocsForm(false);
//         await fetchMedicalRecords(appointment_id); // Fetch updated medical records
//         await fetchAppointments(clinicId); // Fetch updated appointments
//         setShowToast(true);
//         setToastMessage("Prescription document uploaded successfully!");
//         setToastVariant("success");
//       } else {
//         console.error("Failed to upload prescription document");
//         setShowToast(true);
//         setToastMessage("Failed to upload prescription document.");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error uploading prescription document:", error);
//       setShowToast(true);
//       setToastMessage("Error uploading prescription document.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleClosePreviewModal = () => {
//     setShowPreviewModal(false);
//     setPreviewFileUrl("");
//     setPreviewFileType("");
//   };
 
//   useEffect(() => {
//     const getClinicIdFromToken = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
 
//       try {
//         const decodedToken = jwtDecode(token);
//         const clinic_id = decodedToken.clinic_id;
//         setClinicId(clinic_id);
//         await fetchAppointments(clinic_id);
//       } catch (error) {
//         console.error("Error decoding token or fetching appointments:", error);
//       }
//     };
 
//     getClinicIdFromToken();
//   }, []);
 
//   const fetchAppointments = async (clinicId) => {
//     try {
//       const response = await BaseUrl.get(
//         `/clinic/appointmentbyclinicid/?clinic_id=${clinicId}`
//       );
//       const fetchedAppointments = response.data.map((appointment) => ({
//         appointment_id: appointment.appointment_id,
//         appointment_date: appointment.appointment_date,
//         appointment_slot: appointment.appointment_slot,
//         doctor_name: appointment.doctor_name,
//         booked_by: appointment.booked_by,
//         mobile_number: appointment.mobile_number,
//         patient_id: appointment.patient_id,
//         is_patient: appointment.is_patient,
//       }));
//       setAppointments(fetchedAppointments);
//       if (fetchedAppointments.length > 0) {
//         setSelectedPatientId(fetchedAppointments[0].patient_id);
//       }
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       setShowToast(true);
//       setToastMessage("Failed to fetch appointments.");
//       setToastVariant("danger");
//     }
//   };
 
//   const toggleForm = async (appointment_id, details) => {
//     // Clear all state before fetching new data
//     setFormDetails({});
//     setRecordDetails({
//       mobile_number: "",
//       blood_pressure: "",
//       weight: "",
//       height: "",
//       sugar_level: "",
//       oxygen_level: "",
//       symptoms: "",
//       symptoms_comment: "",
//       body_temperature: "",
//       appointment_id: "",
//     });
//     setPrescriptions([{ medicine_name: "", time: [], comment: "", description: "" }]);
//     setSelectedSymptoms([]);
//     setPrescriptionDocuments([]);
//     setMedicalRecords([]); // Clear medical records
 
//     // Check if the same appointment is clicked (to close the expanded section)
//     if (expandedAppointmentId === appointment_id) {
//       setExpandedAppointmentId(null); // Close the expanded section
//       setShowPrescriptionForm(false);
//       setShowRecordForm(false);
//       setShowVitalForm(false);
//       setShowMedicalRecords(false);
//       setShowSymptomsForm(false);
//     } else {
//       // Set the newly selected appointment
//       setExpandedAppointmentId(appointment_id);
 
//       // Set the form details for the new patient
//       setFormDetails({
//         name: details.name || "",
//         age: details.age || "",
//         gender: details.gender || "",
//         mobile_number: details.mobile_number || "",
//         address: details.address || "",
//       });
 
//       // ** Show forms immediately **
//       setShowVitalForm(true);
//       setShowPrescriptionForm(true);
//       setShowRecordForm(true);
//       setShowSymptomsForm(true);
//       setShowMedicalRecords(true);
 
//       try {
//         // Ensure that only the latest request for the selected patient is processed
//         const fetchDataForPatient = async () => {
//           // Fetch patient details
//           const patientResponse = await BaseUrl.get(
//             `/patient/patient/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
//           );
//           if (patientResponse.status === 200) {
//             const patientDetails = patientResponse.data;
//             setFormDetails((prevDetails) => ({
//               ...prevDetails,
//               ...patientDetails,
//             }));
//           }
 
//           // Fetch vitals or checkup details
//           const checkupResponse = await BaseUrl.get(`/patient/patientcheckup/`, {
//             params: { appointment_id: appointment_id },
//           });
//           if (checkupResponse.status === 200 && checkupResponse.data.length > 0) {
//             const checkupDetails = checkupResponse.data[0];
//             setRecordDetails((prevDetails) => ({
//               ...prevDetails,
//               ...checkupDetails,
//             }));
//           }
 
//           // Fetch prescriptions
//           const prescriptionResponse = await BaseUrl.get(
//             `/patient/patientpriscription/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
//           );
//           if (prescriptionResponse.status === 200) {
//             setPrescriptions(prescriptionResponse.data);
//           }
 
//           // Fetch prescription documents
//           const prescriptionDocResponse = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
//             params: { appointment_id: appointment_id },
//           });
//           if (prescriptionDocResponse.status === 200) {
//             setPrescriptionDocuments(prescriptionDocResponse.data);
//           }
 
//           // Fetch document IDs by calling the fetchDocumentIds function
//           await fetchDocumentIds(appointment_id);
 
//           // Fetch medical records
//           await fetchMedicalRecords(appointment_id);
 
//           // Fetch symptoms
//           const symptomsResponse = await BaseUrl.get(
//             `/doctor/symptomsdetail/?appointment_id=${appointment_id}`
//           );
//           if (symptomsResponse.status === 200) {
//             setSelectedSymptoms(symptomsResponse.data);
//           }
 
//           // Fetch prescription times (new API call)
//           const prescriptionTimeResponse = await BaseUrl.get(`/patient/time/`, {
//             params: { appointment_id: appointment_id },
//           });
//           if (prescriptionTimeResponse.status === 200) {
//             // Assuming you'll update the state with prescription times
//             const prescriptionTimes = prescriptionTimeResponse.data;
//             console.log(prescriptionTimes);
//             setPrescriptions((prevPrescriptions) =>
//               prevPrescriptions.map((prescription, index) => ({
//                 ...prescription,
//                 time: prescriptionTimes[index]?.times || [],
//               }))
//             );
//           }
//         };
 
//         // Run the fetch operation for the patient
//         await fetchDataForPatient();
//       } catch (error) {
//         console.error("Error fetching patient data:", error);
//       }
//     }
//   };
 
//   const toggleVitalForm = async (appointment_id) => {
//     setShowVitalForm(!showVitalForm);
//     setShowPrescriptionForm(false);
//     setExpandedAppointmentId(appointment_id);
 
//     if (!showVitalForm) {
//       try {
//         const selectedAppointment = appointments.find(
//           (appointment) => appointment.appointment_id === appointment_id
//         );
 
//         if (selectedAppointment) {
//           const appointment_date = selectedAppointment.appointment_date;
 
//           const fetchDataResponse = await BaseUrl.get(
//             `/patient/patientcheckup/`,
//             {
//               params: {
//                 appointment_id: appointment_id,
//                 appointment_date: appointment_date,
//               },
//             }
//           );
 
//           if (
//             fetchDataResponse.status === 200 &&
//             fetchDataResponse.data.length > 0
//           ) {
//             const fetchedData = fetchDataResponse.data[0];
 
//             setRecordDetails({
//               appointment_id: appointment_id,
//               blood_pressure: fetchedData.blood_pressure || "",
//               oxygen_level: fetchedData.oxygen_level || "",
//               body_temperature: fetchedData.body_temperature || "",
//               heart_rate: fetchedData.heart_rate || "",
//               pulse_rate: fetchedData.pulse_rate || "",
//               sugar_level: fetchedData.sugar_level || "",
//               weight: fetchedData.weight ,
//               appointment_date: appointment_date,
//             });
//           } else {
//             console.error("No vitals data found");
//           }
//         } else {
//           console.error("No selected appointment found");
//         }
//       } catch (error) {
//         console.error("Error fetching vitals data:", error);
//       }
//     } else {
//       setRecordDetails({
//         appointment_id: "",
//         blood_pressure: "",
//         oxygen_level: "",
//         sugar_level: "",
//         weight: "",
//         pulse_rate: "",
//         heart_rate: "",
//         body_temperature: "",
//         appointment_date: "",
//       });
//     }
//   };
 
//   const handleVitalChange = (e) => {
//     const { name, value } = e.target;
//     setRecordDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };
 
//   const handleDeletePrescriptionDoc = async (docId) => {
//     try {
//       await BaseUrl.delete(`/patient/patientprescriptonfile/`, {
//         data: {
//           document_id: docId,
//         },
//       });
//       // Refresh the document list after deletion
//       await fetchMedicalRecords(expandedAppointmentId);
//     } catch (error) {
//       console.error("Error deleting prescription document:", error);
//     }
//   };
 
//   const handleDownloadPrescriptionDoc = async (doc) => {
//     try {
//       const response = await BaseUrl.get(`/patient/patientprescriptonfileView/`, {
//         params: {
//           patient_id: doc.patient,
//           document_id: doc.id,
//         },
//         responseType: "blob", // Ensure it's downloading as a blob
//       });
 
//       const url = URL.createObjectURL(response.data);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${doc.document_name}.${response.data.type.split("/")[1]}`;
//       link.click();
//     } catch (error) {
//       console.error("Error downloading prescription document:", error);
//     }
//   };
 
//   const handleUpdate = async () => {
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );
 
//       if (!selectedAppointment) {
//         throw new Error("Selected appointment not found");
//       }
 
//       const payload = {
//         appointment_id: selectedAppointment.appointment_id,
//         patient_id: selectedAppointment.patient_id,
//         ...formDetails,
//       };
 
//       const response = await BaseUrl.put(`/patient/patient/`, payload);
 
//       if (response.status === 200) {
//         await fetchAppointments(clinicId);
//         setErrorMessage("");
//         setShowToast(true);
//         setToastMessage("Appointment details updated successfully!");
//         setToastVariant("success");
//       } else {
//         console.error("Failed to update appointment details");
//         setShowToast(true);
//         setToastMessage("Failed to update appointment details.");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error updating appointment details:", error);
//       setShowToast(true);
//       setToastMessage("Error updating appointment details.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleDelete = async (appointment_id) => {
//     try {
//       const response = await BaseUrl.delete(`/doctorappointment/getslot/`, {
//         data: { appointment_id },
//       });
 
//       if (response.status === 200) {
//         await fetchAppointments(clinicId);
//         setErrorMessage("");
//         setShowToast(true);
//         setToastMessage("Appointment deleted successfully!");
//         setToastVariant("success");
//       } else {
//         throw new Error("Failed to cancel appointment");
//       }
//     } catch (error) {
//       console.error("Error deleting appointment:", error);
//       setShowToast(true);
//       setToastMessage("Failed to delete appointment.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleCancelAppointment = async (appointment_id) => {
//     try {
//       const response = await BaseUrl.patch(`/doctorappointment/getslot/`, {
//         appointment_id,
//       });
 
//       if (response.status === 200) {
//         await fetchAppointments(clinicId);
//         setShowToast(true);
//         setToastMessage("Appointment cancelled successfully!");
//         setToastVariant("success");
//       } else {
//         console.error("Failed to cancel appointment");
//         setShowToast(true);
//         setToastMessage("Failed to cancel appointment.");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error canceling appointment:", error);
//       setShowToast(true);
//       setToastMessage("Error canceling appointment.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handlePrescriptionChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedPrescriptions = prescriptions.map((prescription, i) =>
//       i === index ? { ...prescription, [name]: value } : prescription
//     );
//     setPrescriptions(updatedPrescriptions);
//   };
 
//   const addPrescriptionRow = () => {
//     setPrescriptions([
//       ...prescriptions,
//       { medicine_name: "", time: "", comment: "", description: "" },
//     ]);
//   };
 
//   const removePrescriptionRow = async (index) => {
//     try {
//       const prescriptionToDelete = prescriptions[index];
//       const prescription_id = prescriptionToDelete.id;
 
//       if (!prescription_id) {
//         console.error("No prescription ID found");
//         return;
//       }
//       const response = await BaseUrl.delete(`/patient/patientpriscription/`, {
//         params: { prescription_id },
//       });
 
//       if (response.status === 200 || response.status === 204) {
//         const updatedPrescriptions = prescriptions.filter(
//           (_, i) => i !== index
//         );
//         setPrescriptions(updatedPrescriptions);
//         setShowToast(true);
//         setToastMessage("Prescription removed successfully!");
//         setToastVariant("success");
//       } else {
//         console.error("Failed to remove prescription");
//         setShowToast(true);
//         setToastMessage("Failed to remove prescription.");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error removing prescription:", error);
//       setShowToast(true);
//       setToastMessage("Error removing prescription.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handlePrescriptionSubmit = async () => {
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );
 
//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }
 
//       const patient_id = selectedAppointment.patient_id;
//       const appointment_id = selectedAppointment.appointment_id;
 
//       // Assuming you want to send the most recently added prescription (last one in the array)
//       const prescription = prescriptions[prescriptions.length - 1]; // Select the last added prescription
 
//       // Prepare the payload for a single prescription but in an array (list)
//       const payload = [
//         {
//           ...prescription,
//           patient_id: patient_id,
//           appointment_id: appointment_id,
//         },
//       ];
 
//       // Make the POST API call to submit a single prescription as part of an array
//       const response = await BaseUrl.post('/patient/patientpriscription/', payload);
 
//       if (response.status === 201) {
//         // Reset the form after successful submission
//         setShowPrescriptionForm(true);
//         setPrescriptions([{ medicine_name: '', time: [], comment: '', description: '' }]);
//         console.log('Prescription submitted successfully');
//       } else {
//         console.error('Failed to submit prescription');
//       }
//     } catch (error) {
//       console.error('Error submitting prescription:', error);
//     }
//   };
 
//   const handleUpdatePrescription = async () => {
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );
 
//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }
 
//       const patient_id = selectedAppointment.patient_id;
 
//       // Assuming we are updating the last added prescription
//       const prescription = prescriptions[prescriptions.length - 1]; // Select the last added prescription
 
//       // Prepare the payload for a single prescription but in an array (list)
//       const payload = [
//         {
//           prescription_id: prescription.prescription_id || null, // Ensure prescription_id is included
//           patient_id: patient_id,
//           appointment_id: expandedAppointmentId,
//           medicine_name: prescription.medicine_name,
//           // time: prescription.time, // Include this if needed
//           comment: prescription.comment,
//           description: prescription.description,
//         },
//       ];
 
//       // Make the PUT API call to update a single prescription (inside an array)
//       const response = await BaseUrl.put('/patient/patientpriscription/', payload);
 
//       if (response.status === 200) {
//         console.log("Prescription updated successfully");
//       } else {
//         console.error("Failed to update prescription");
//       }
//     } catch (error) {
//       console.error("Error updating prescription:", error);
//     }
//   };
 
 
//   const fetchDocumentIds = async (appointmentId) => {
//     try {
//       const response = await BaseUrl.get(
//         `/patient/patientdocumentusingappointmentid/`,
//         {
//           params: {
//             appointment: appointmentId,
//           },
//         }
//       );
 
//       if (response.status === 200) {
//         const ids = response.data.map((doc) => doc.id);
//         setDocumentIds(ids);
//       } else {
//         console.error("Failed to fetch document IDs");
//       }
//     } catch (error) {
//       console.error("Error fetching document IDs:", error);
//     }
//   };
 
//   const handleVitalSubmit = async () => {
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );
 
//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }
 
//       const patient_id = selectedAppointment.patient_id;
//       const appointment_date = selectedAppointment.appointment_date;
 
//       try {
//         const postResponse = await BaseUrl.post("/patient/patientcheckup/", {
//           patient_id: patient_id,
//           appointment_id: expandedAppointmentId,
//           record_date: appointment_date,
//           blood_pressure: recordDetails.blood_pressure,
//           oxygen_level: recordDetails.oxygen_level,
//           sugar_level: recordDetails.sugar_level,
//           weight: recordDetails.weight,
//           pulse_rate: recordDetails.pulse_rate,
//           heart_rate: recordDetails.heart_rate,
//           body_temperature: recordDetails.body_temperature,
//         });
 
//         if (postResponse.status === 200) {
//           setErrorMessage("");
//           await fetchAppointments(clinicId); // Fetch updated appointments
//           await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//           setRecordDetails({
//             patient_id: "",
//             blood_pressure: "",
//             oxygen_level: "",
//             sugar_level: "",
//             weight: "",
//             pulse_rate: "",
//             heart_rate: "",
//             body_temperature: "",
//             appointment_id: "",
//             appointment_date: "",
//           });
//           setShowToast(true);
//           setToastMessage("Vitals submitted successfully!");
//           setToastVariant("success");
//         } else {
//           console.error("Failed to submit vitals");
//           setShowToast(true);
//           setToastMessage("Failed to submit vitals.");
//           setToastVariant("danger");
//         }
//       } catch (postError) {
//         if (postError.response?.status === 400) {
//           try {
//             const putResponse = await BaseUrl.put("/patient/patientcheckup/", {
//               patient_id: patient_id,
//               appointment_id: expandedAppointmentId,
//               appointment_date: appointment_date,
//               blood_pressure: recordDetails.blood_pressure,
//               oxygen_level: recordDetails.oxygen_level,
//               sugar_level: recordDetails.sugar_level,
//               weight: recordDetails.weight,
//               pulse_rate: recordDetails.pulse_rate,
//               heart_rate: recordDetails.heart_rate,
//               body_temperature: recordDetails.body_temperature,
//             });
 
//             if (putResponse.status === 200) {
//               setErrorMessage("");
//               await fetchAppointments(clinicId); // Fetch updated appointments
//               await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//               setRecordDetails({
//                 patient_id: "",
//                 blood_pressure: "",
//                 oxygen_level: "",
//                 sugar_level: "",
//                 weight: "",
//                 pulse_rate: "",
//                 heart_rate: "",
//                 body_temperature: "",
//                 appointment_id: "",
//                 appointment_date: "",
//               });
//               setShowToast(true);
//               setToastMessage("Vitals updated successfully!");
//               setToastVariant("success");
//             } else {
//               console.error("Failed to update vitals");
//               setShowToast(true);
//               setToastMessage("Failed to update vitals.");
//               setToastVariant("danger");
//             }
//           } catch (putError) {
//             console.error("Error updating vitals:", putError);
//             setShowToast(true);
//             setToastMessage("Error updating vitals.");
//             setToastVariant("danger");
//           }
//         } else {
//           console.error("Error submitting vitals:", postError);
//           setShowToast(true);
//           setToastMessage("Error submitting vitals.");
//           setToastVariant("danger");
//         }
//       }
//     } catch (error) {
//       console.error("Error submitting vitals:", error);
//       setShowToast(true);
//       setToastMessage("Error submitting vitals.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams((prevParams) => ({
//       ...prevParams,
//       [name]: value,
//     }));
//   };
 
//   const handleSearch = async () => {
//     try {
//       const response = await BaseUrl.get("/clinic/clinicsearch/", {
//         params: {
//           clinic_id: clinicId,
//           query: searchParams.booked_by,
//         },
//       });
 
//       const fetchedAppointments = response.data.map((appointment) => ({
//         appointment_id: appointment.appointment_id,
//         appointment_date: appointment.appointment_date,
//         appointment_slot: appointment.appointment_slot,
//         doctor_name: appointment.doctor_name,
//         booked_by: appointment.booked_by,
//         mobile_number: appointment.mobile_number,
//         patient_id: appointment.patient_id,
//         is_patient: appointment.is_patient,
//       }));
 
//       setAppointments(fetchedAppointments);
//     } catch (error) {
//       console.error("Error searching appointments:", error);
//       setShowToast(true);
//       setToastMessage("Failed to search appointments.");
//       setToastVariant("danger");
//     }
//   };
 
//   const handleSeverityChange = (index, event) => {
//     const { value } = event.target;
//     setSelectedSymptoms((prevSymptoms) =>
//       prevSymptoms.map((symptom, i) =>
//         i === index ? { ...symptom, severity: value } : symptom
//       )
//     );
//   };
 
//   const handleSymptomDetailChange = (index, event) => {
//     const { value } = event.target;
//     setSelectedSymptoms((prevSymptoms) =>
//       prevSymptoms.map((symptom, i) =>
//         i === index ? `${symptom.symptoms_name}: ${value}` : symptom
//       )
//     );
//   };
 
//   const handleSymptomSearch = async (e) => {
//     const value = e.target.value;
//     setSearchSymptom(value);
 
//     if (value) {
//       try {
//         const response = await BaseUrl.get(`/doctor/symptomssearch/`, {
//           params: { name: value },
//         });
 
//         const symptomsFromApi = response.data;
 
//         if (symptomsFromApi.length > 0) {
//           setSearchResults(symptomsFromApi);
//         } else {
//           setSearchResults([]);
//         }
//       } catch (error) {
//         console.error("Error fetching symptoms:", error);
//       }
//     } else {
//       setSearchResults([]);
//     }
//   };
 
//   const handleSinceChange = (index, event) => {
//     const value = event.target.value;
//     setSelectedSymptoms((prevSymptoms) =>
//       prevSymptoms.map((symptom, i) =>
//         i === index ? { ...symptom, since: value } : symptom
//       )
//     );
//   };
 
//   const handleMoreOptionsChange = (index, event) => {
//     const value = event.target.value;
//     setSelectedSymptoms((prevSymptoms) =>
//       prevSymptoms.map((symptom, i) =>
//         i === index ? { ...symptom, more_options: value } : symptom
//       )
//     );
//   };
 
//   const toggleSymptomsForm = async (appointment_id) => {
//     setShowSymptomsForm(!showSymptomsForm);
//     setExpandedAppointmentId(appointment_id);
 
//     if (!showSymptomsForm) {
//       try {
//         const selectedAppointment = appointments.find(
//           (appointment) => appointment.appointment_id === appointment_id
//         );
 
//         if (selectedAppointment) {
//           const response = await BaseUrl.get(
//             `/patient/patientsymptoms/?appointment_id=${appointment_id}`
//           );
//           if (response.status === 200) {
//             setSelectedSymptoms(response.data.symptoms || []);
//           } else {
//             console.error("Failed to fetch symptoms");
//           }
//         } else {
//           console.error("No selected appointment found");
//         }
//       } catch (error) {
//         console.error("Error fetching symptoms:", error);
//         setErrorMessage("Failed to fetch symptoms.");
//       }
//     } else {
//       setSelectedSymptoms([]);
//     }
//   };
 
//   const handleSymptomSearchChange = (e) => {
//     setSearchSymptom(e.target.value);
//   };
 
//   const handleAddSymptom = (symptom) => {
//     setSelectedSymptoms((prevSymptoms) => [
//       {
//         id: symptom.id,
//         symptoms_name: symptom.symptoms_name,
//         Symptoms_id: symptom.id,
//         severity: "",
//         since: "",
//         more_options: "",
//       },
//       ...prevSymptoms, // Prepend the new symptom to the start of the array
//     ]);
//     setSearchSymptom("");
//     setSearchResults([]);
//   };
 
 
//   const handleRemoveSymptom = async (symptom) => {
//     try {
//       const response = await BaseUrl.delete(`/doctor/symptomsdetail/`, {
//         data: {
//           appointment_id: expandedAppointmentId,
//           symptoms_id: symptom.symptoms,
//         },
//       });
 
//       if (response.status === 204) {
//         setSelectedSymptoms((prevSymptoms) =>
//           prevSymptoms.filter((s) => s.id !== symptom.id)
//         );
//       } else {
//         console.error("Failed to delete symptom");
//       }
//     } catch (error) {
//       console.error("Error deleting symptom:", error);
//     }
//   };
 
//   const handleSaveSymptoms = async () => {
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );
 
//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }
 
//       const appointment_id = expandedAppointmentId;
//       const appointment_date = selectedAppointment.appointment_date;
 
//       for (const symptom of selectedSymptoms) {
//         const symptomPayload = {
//           symptoms: symptom.Symptoms_id,
//           appointment: appointment_id,
//           symptom_date: appointment_date,
//           since: symptom.since,
//           severity: symptom.severity,
//           more_options: symptom.more_options,
//         };
 
//         try {
//           const response = await BaseUrl.post(
//             "/doctor/symptomsdetail/",
//             symptomPayload,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
 
//           if (response.status === 201 || response.status === 200) {
//             console.log("Symptom saved successfully");
//           } else {
//             console.error("Failed to save symptom");
//           }
//         } catch (error) {
//           console.error("Error saving symptom:", error);
//         }
//       }
 
//       await fetchAppointments(clinicId); // Fetch updated appointments
//       await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//     } catch (error) {
//       console.error("Error saving symptoms:", error);
//     }
//   };
 
//   const handleUpdateSymptom = async () => {
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );
 
//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }
 
//       const appointment_id = expandedAppointmentId;
//       const appointment_date = selectedAppointment.appointment_date;
 
//       for (const symptom of selectedSymptoms) {
//         const symptomPayload = {
//           symptoms_id: symptom.id,
//           symptoms_name: symptom.symptoms_name,
//           appointment_id: appointment_id,
//           since: symptom.since,
//           severity: symptom.severity,
//           more_options: symptom.more_options,
//         };
 
//         try {
//           const response = await BaseUrl.put(
//             "/doctor/symptomsdetail/",
//             symptomPayload,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
 
//           if (response.status === 201 || response.status === 200) {
//             console.log("Symptom updated successfully");
//           } else {
//             console.error("Failed to update symptom");
//           }
//         } catch (error) {
//           console.error("Error updating symptom:", error);
//         }
//       }
 
//       await fetchAppointments(clinicId); // Fetch updated appointments
//       await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//     } catch (error) {
//       console.error("Error updating symptoms:", error);
//     }
//   };
 
 
//   // Add this function to handle input changes in forms
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };
 
//   return (
//     <Container fluid>
//       {errorMessage && (
//         <div className="alert alert-danger" role="alert">
//           {errorMessage}
//         </div>
//       )}
 
//       <div className="mb-3">
//         <Card
//           className="shadow-sm mb-3"
//           style={{
//             borderRadius: "15px",
//             border: "2px solid #007bff",
//             background: "linear-gradient(145deg, #f0f9ff, #cfe3f8)",
//           }}
//         >
//           <Card.Body>
//             <h5 className="card-title mb-4" style={{ color: "#007bff" }}>
//               Search Appointments
//             </h5>
//             <Form>
//               <Form.Group>
//                 <label htmlFor="booked_by" className="form-label">
//                   Search by Booked By:
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="booked_by"
//                   name="booked_by"
//                   value={searchParams.booked_by}
//                   onChange={handleSearchChange}
//                   placeholder="Date/Time Slot/Doctor/Booked By/Mobile Number"
//                 />
//               </Form.Group>
//               <Button className="btn btn-primary mt-3" onClick={handleSearch}>
//                 Search
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       </div>
 
//       <Card
//         className="shadow-sm"
//         style={{
//           borderRadius: "15px",
//           border: "2px solid #28a745",
//           background: "linear-gradient(145deg, #e8f5e9, #c8e6c9)",
//         }}
//       >
//         <Card.Body>
//           <h5 className="card-title mb-4" style={{ color: "#28a745" }}>
//             Booked Appointments
//           </h5>
//           <Table className="table table-hover">
//             <thead className="table-light">
//               <tr>
//                 <th>Date</th>
//                 <th>Time Slot</th>
//                 <th>Doctor</th>
//                 <th>Booked By</th>
//                 <th>Mobile Number</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.map((appointment) => (
//                 <React.Fragment key={appointment.appointment_id}>
//                   <tr className={appointment.is_patient ? "table-danger" : ""}>
//                     <td>{appointment.appointment_date}</td>
//                     <td>{appointment.appointment_slot}</td>
//                     <td>{appointment.doctor_name}</td>
//                     <td>{appointment.booked_by}</td>
//                     <td>{appointment.mobile_number}</td>
//                     <td>
//                       <FaEdit
//                         className="me-2 text-primary"
//                         onClick={() =>
//                           toggleForm(appointment.appointment_id, appointment)
//                         }
//                         style={{ cursor: "pointer" }}
//                       />
//                       <FaTrash
//                         className="me-2 text-danger"
//                         onClick={() => {
//                           setShowConfirmation(true);
//                           setAppointmentIdToDelete(
//                             appointment.appointment_id
//                           );
//                         }}
//                         style={{ cursor: "pointer" }}
//                       />
//                       {expandedAppointmentId ===
//                       appointment.appointment_id ? (
//                         <FaChevronUp
//                           onClick={() => setExpandedAppointmentId(null)}
//                           style={{ cursor: "pointer" }}
//                         />
//                       ) : (
//                         <FaChevronDown
//                           onClick={() =>
//                             toggleForm(appointment.appointment_id, appointment)
//                           }
//                           style={{ cursor: "pointer" }}
//                         />
//                       )}
//                     </td>
//                   </tr>
 
//                   {expandedAppointmentId === appointment.appointment_id && (
//                     <tr>
//                       <td colSpan="6">
//                         <Card
//                           className="shadow-sm mt-3"
//                           style={{
//                             borderRadius: "15px",
//                             border: "2px solid #ffc107",
//                             background: "linear-gradient(145deg, #fff3cd, #ffeeba)",
//                           }}
//                         >
//                           <Card.Body>
//                             <h5>Patient Details</h5>
//                             <Form>
//                               <Row className="mb-3">
//                                 <Col>
//                                   <Form.Group controlId="formName">
//                                     <Form.Label>Name</Form.Label>
//                                     <Form.Control
//                                       type="text"
//                                       name="name"
//                                       value={formDetails.name || ""}
//                                       onChange={handleInputChange}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col>
//                                   <Form.Group controlId="formMobileNumber">
//                                     <Form.Label>Mobile Number</Form.Label>
//                                     <Form.Control
//                                       type="text"
//                                       name="mobile_number"
//                                       value={formDetails.mobile_number || ""}
//                                       onChange={handleInputChange}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col>
//                                   <Form.Group controlId="formAge">
//                                     <Form.Label>Age</Form.Label>
//                                     <Form.Control
//                                       type="text"
//                                       name="age"
//                                       value={formDetails.age || ""}
//                                       onChange={handleInputChange}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col>
//                                   <Form.Group controlId="formGender">
//                                     <Form.Label>Gender</Form.Label>
//                                     <Form.Control
//                                       type="text"
//                                       name="gender"
//                                       value={formDetails.gender || ""}
//                                       onChange={handleInputChange}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col>
//                                   <Form.Group controlId="formAddress">
//                                     <Form.Label>Address</Form.Label>
//                                     <Form.Control
//                                       type="text"
//                                       name="address"
//                                       value={formDetails.address || ""}
//                                       onChange={handleInputChange}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                               </Row>
//                               <Button variant="primary" onClick={handleUpdate}>
//                                 Update
//                               </Button>
//                               <Button
//                                 variant="danger"
//                                 className="ms-2"
//                                 onClick={() =>
//                                   handleDelete(appointment.appointment_id)
//                                 }
//                               >
//                                 Delete
//                               </Button>
//                               <Button
//                                 variant="warning"
//                                 className="ms-2"
//                                 onClick={() =>
//                                   handleCancelAppointment(
//                                     appointment.appointment_id
//                                   )
//                                 }
//                               >
//                                 Cancel Appointment
//                               </Button>
 
                             
//                             </Form>
//                           </Card.Body>
//                         </Card>
//                       </td>
//                     </tr>
//                   )}
 
// {showSymptomsForm &&
//   expandedAppointmentId === appointment.appointment_id && (
//     <tr>
//       <td colSpan="6">
//         <Card
//           className="shadow-sm mt-3"
//           style={{
//             borderRadius: "15px",
//             border: "2px solid #fd7e14",
//             background: "linear-gradient(145deg, #fde2cd, #fbd5b4)",
//           }}
//         >
//           <Card.Body>
//             <h5>Symptoms</h5>
//             <Form>
//               <Row className="mb-3">
//                 <Col xs={12}>
//                   <Form.Group controlId="symptomSearch">
//                     <Form.Label>Search Symptoms</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Search symptoms"
//                       value={searchSymptom}
//                       onChange={handleSymptomSearch}
//                     />
//                      {searchResults.length > 0 && (
//                                   <ul className="list-group mt-2">
//                                     {searchResults.map((symptom, index) => (
//                                       <li
//                                         key={index}
//                                         className="list-group-item"
//                                         onClick={() =>
//                                           handleAddSymptom({
//                                             id: symptom.id,
//                                             symptoms_name:
//                                               symptom.symptoms_name,
//                                             severity: "",
//                                           })
//                                         }
//                                         style={{ cursor: "pointer" }}
//                                       >
//                                         {symptom.symptoms_name}
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 )}
//                   </Form.Group>
//                 </Col>
//               </Row>
 
//               <Table striped bordered hover>
//                 <thead className="table-light">
//                   <tr>
//                     <th>Symptom</th>
//                     <th>Severity</th>
//                     <th>Since</th>
//                     <th>More Options</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedSymptoms.map((symptom, index) => (
//                     <tr key={index}>
//                       <td>{symptom.symptoms_name}</td>
//                       <td>
//                         <Form.Select
//                           name={`severity-${index}`}
//                           value={symptom.severity}
//                           onChange={(e) => handleSeverityChange(index, e)}
//                         >
//                           <option value="">Select Severity</option>
//                           <option value="mild">Mild</option>
//                           <option value="moderate">Moderate</option>
//                           <option value="severe">Severe</option>
//                         </Form.Select>
//                       </td>
//                       <td>
//                         <Form.Control
//                           type="text"
//                           name={`since-${index}`}
//                           value={symptom.since}
//                           onChange={(e) => handleSinceChange(index, e)}
//                         />
//                       </td>
//                       <td>
//                         <Form.Control
//                           type="text"
//                           name={`more_options-${index}`}
//                           value={symptom.more_options}
//                           onChange={(e) => handleMoreOptionsChange(index, e)}
//                         />
//                       </td>
//                       <td>
//                         <Button
//                           variant="danger"
//                           onClick={() => handleRemoveSymptom(symptom)}
//                         >
//                           Remove
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//               <Button variant="primary" onClick={handleSaveSymptoms}>
//                 Save
//               </Button>
//               <Button
//                 variant="warning"
//                 className="ms-2"
//                 onClick={handleUpdateSymptom}
//               >
//                 Update Symptoms
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="ms-2"
//                 onClick={() => setShowSymptomsForm(false)}
//               >
//                 Cancel
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       </td>
//     </tr>
//   )}
 
//                   {showVitalForm &&
//                     expandedAppointmentId === appointment.appointment_id && (
//                       <tr>
//                         <td colSpan="6">
//                           <Card
//                             className="shadow-sm mt-3"
//                             style={{
//                               borderRadius: "15px",
//                               border: "2px solid #17a2b8",
//                               background:
//                                 "linear-gradient(145deg, #e3f5f9, #d0ebf5)",
//                             }}
//                           >
//                             <Card.Body>
//                               <h5>Vitals</h5>
//                               <Form>
//                                 <Row className="mb-3">
//                                   <Col>
//                                     <Form.Group controlId="formBloodPressure">
//                                       <Form.Label>Blood Pressure</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         name="blood_pressure"
//                                         value={recordDetails.blood_pressure}
//                                         onChange={handleVitalChange}
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col>
//                                     <Form.Group controlId="formOxygenLevel">
//                                       <Form.Label>Oxygen Level</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         name="oxygen_level"
//                                         value={recordDetails.oxygen_level}
//                                         onChange={handleVitalChange}
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col>
//                                     <Form.Group controlId="formTemperature">
//                                       <Form.Label>Body Temperature</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         name="body_temperature"
//                                         value={
//                                           recordDetails.body_temperature
//                                         }
//                                         onChange={handleVitalChange}
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col>
//                                     <Form.Group controlId="formHeartRate">
//                                       <Form.Label>Heart Rate</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         name="heart_rate"
//                                         value={recordDetails.heart_rate}
//                                         onChange={handleVitalChange}
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col>
//                                     <Form.Group controlId="formPulseRate">
//                                       <Form.Label>Pulse Rate</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         name="pulse_rate"
//                                         value={recordDetails.pulse_rate}
//                                         onChange={handleVitalChange}
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col>
//                               <Form.Group controlId="formSugarLevel">
//                                 <Form.Label>sugar level</Form.Label>
//                                 <Form.Control
//                                   type="text"
//                                   name="sugar_level"
//                                   value={recordDetails.sugar_level}
//                                   onChange={handleVitalChange}
//                                 />
//                               </Form.Group>
//                             </Col>
                       
//                             <Col>
//                               <Form.Group controlId="formWeight">
//                                 <Form.Label>Weight</Form.Label>
//                                 <Form.Control
//                                   type="text"
//                                   name="weight"
//                                   value={recordDetails.weight}
//                                   onChange={handleVitalChange}
//                                 />
//                               </Form.Group>
//                             </Col>
//                                 </Row>
//                                 <Button
//                                   variant="primary"
//                                   onClick={handleVitalSubmit}
//                                 >
//                                   Submit
//                                 </Button>
//                                 <Button
//                                   variant="secondary"
//                                   className="ms-2"
//                                   onClick={() => setShowVitalForm(false)}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </Form>
//                             </Card.Body>
//                           </Card>
//                         </td>
//                       </tr>
//                     )}
 
// {showPrescriptionForm &&
//   expandedAppointmentId === appointment.appointment_id && (
//     <tr>
//       <td colSpan="6">
//         <Card
//           className="shadow-sm mt-3"
//           style={{
//             borderRadius: "15px",
//             border: "2px solid #dc3545",
//             background: "linear-gradient(145deg, #f8d7da, #f1aeb6)",
//           }}
//         >
//           <Card.Body>
//             <div className="d-flex justify-content-center align-items-center mb-3">
//               <h5 className="text-center d-inline-block mb-0">Prescription</h5>
//               <Button
//                 variant="success"
//                 className="ms-3 d-inline-block"
//                 onClick={addPrescriptionRow}
//               >
//                 Add Prescription
//               </Button>
//             </div>
 
//             <Form>
//               {prescriptions.map((prescription, index) => (
//                 <Row className="mb-3" key={index}>
//                   <Col>
//                     <Form.Group controlId={`formMedicineName${index}`}>
//                       <Form.Label>Medicine Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="medicine_name"
//                         value={prescription.medicine_name}
//                         onChange={(e) => handlePrescriptionChange(index, e)}
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group controlId={`formComment${index}`}>
//                       <Form.Label>Precautions</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="comment"
//                         value={prescription.comment}
//                         onChange={(e) => handlePrescriptionChange(index, e)}
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group controlId={`formDescription${index}`}>
//                       <Form.Label>Description</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="description"
//                         value={prescription.description}
//                         onChange={(e) => handlePrescriptionChange(index, e)}
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col className="d-flex align-items-center">
//                     <Button
//                       variant="danger"
//                       onClick={() => removePrescriptionRow(index)}
//                       className="me-2"
//                     >
//                       Remove
//                     </Button>
//                     {/* Submit All Prescriptions */}
//                     <Button
//                       variant="primary"
//                       onClick={handlePrescriptionSubmit} // Adjusted for submitting all prescriptions
//                       className="me-2"
//                     >
//                       Submit
//                     </Button>
//                     {/* Update Prescription */}
//                     <Button
//                       variant="warning"
//                       onClick={() => handleUpdatePrescription(index)}
//                     >
//                       Update
//                     </Button>
//                   </Col>
//                 </Row>
//               ))}
//             </Form>
 
//             <Button
//               variant="outline-primary"
//               className="float-end mb-5"
//               onClick={() => {
//                 setIsPrescriptionDocs(true);
//                 setShowPrescriptionDocsForm(true);
//               }}
//             >
//               Upload Prescription
//             </Button>
//           </Card.Body>
//         </Card>
 
//         {/* Prescription Documents Section */}
//         <Table striped bordered hover>
//           <thead className="table-light">
//             <tr>
//               <th>SNo.</th>
//               <th>Document Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {prescriptionDocuments.map((doc, index) => (
//               <React.Fragment key={doc.id}>
//                 <tr>
//                   <td>{index + 1}</td>
//                   <td>{doc.document_date}</td>
//                   <td>
//                     <div className="d-flex align-items-center">
//                       <Button
//                         variant="primary"
//                         className="me-2"
//                         onClick={() => handlePreview(doc.id)}
//                       >
//                         Preview
//                       </Button>
//                       <DropdownButton
//                         id="dropdown-basic-button"
//                         title={<FontAwesomeIcon icon={faEllipsisV} />}
//                         variant="secondary"
//                       >
//                         <Dropdown.Item onClick={() => handleDownloadPrescriptionDoc(doc)}>
//                           Download
//                         </Dropdown.Item>
//                         <Dropdown.Item onClick={() => handleDeletePrescriptionDoc(doc.id)}>
//                           Delete
//                         </Dropdown.Item>
//                       </DropdownButton>
//                     </div>
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </Table>
 
//         {/* Modal for uploading prescription files */}
//         <Modal
//           show={showPrescriptionDocsForm}
//           onHide={() => setShowPrescriptionDocsForm(false)}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Upload Prescription File</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group controlId="formPrescriptionFile">
//                 <Form.Label>Prescription File</Form.Label>
//                 <Form.Control
//                   type="file"
//                   onChange={handleFileSelectForPrescription}
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowPrescriptionDocsForm(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={() =>
//                 handlePrescriptionDocs(appointment.appointment_id)
//               }
//             >
//               Upload
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </td>
//     </tr>
//   )}
 
// {showRecordForm &&
//                     expandedAppointmentId === appointment.appointment_id && (
//                       <tr>
//                         <td colSpan="6">
//                           <Card
//                             className="shadow-sm mt-3"
//                             style={{
//                               borderRadius: "15px",
//                               border: "2px solid #6f42c1",
//                               background:
//                                 "linear-gradient(145deg, #e5e5f7, #d8d8f1)",
//                             }}
//                           >
//                             <Card.Body>
//                               <h5>Document</h5>
//                               <Button
//                                 variant="outline-primary"
//                                 className="float-end mb-5"
//                                 onClick={() => {
//                                   setIsPrescriptionDocs(true);
//                                   toggleFormModal();
//                                 }}
//                               >
//                                 Upload Document
//                               </Button>
//                               <Row className="mb-5">
//                                 <Col xs={12} md={12}>
//                                   <Table striped bordered hover>
//                                     <thead className="table-light">
//                                       <tr>
//                                         <th>Document Name</th>
//                                         <th>Patient Name</th>
//                                         <th>Document Date</th>
//                                         <th>Document Type</th>
//                                         <th>Document File</th>
//                                         <th>Actions</th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {medicalRecords.map((record) => (
//                                         <tr key={record.id}>
//                                           <td>{record.document_name}</td>
//                                           <td>{record.patient_name}</td>
//                                           <td>{record.document_date}</td>
//                                           <td>{record.document_type}</td>
//                                           <td>
//                                             <Button
//                                               onClick={() =>
//                                                 handleViewFile(record)
//                                               }
//                                             >
//                                               View
//                                             </Button>
//                                           </td>
//                                           <td>
//                                             <DropdownButton
//                                               id="dropdown-basic-button"
//                                               title={
//                                                 <FontAwesomeIcon
//                                                   icon={faEllipsisV}
//                                                 />
//                                               }
//                                               variant="secondary"
//                                             >
//                                               <Dropdown.Item
//                                                 onClick={() =>
//                                                   handleModifyRecord(record)
//                                                 }
//                                               >
//                                                 Modify
//                                               </Dropdown.Item>
//                                               <Dropdown.Item
//                                                 onClick={() =>
//                                                   handleDownloadFile(record)
//                                                 }
//                                               >
//                                                 Download
//                                               </Dropdown.Item>
//                                               <Dropdown.Item
//                                                 onClick={() =>
//                                                   handleDeleteRecord(record.id)
//                                                 }
//                                               >
//                                                 Delete
//                                               </Dropdown.Item>
//                                             </DropdownButton>
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </Table>
//                                 </Col>
//                               </Row>
 
//                               <Modal
//                                 show={showFormModal}
//                                 onHide={toggleFormModal}
//                               >
//                                 <Modal.Header closeButton>
//                                   <Modal.Title>
//                                     {isPrescriptionDocs
//                                       ? "Upload Document Files"
//                                       : editingRecordId
//                                       ? "Edit Medical Record"
//                                       : "Upload Medical Record"}
//                                   </Modal.Title>
//                                 </Modal.Header>
//                                 <Modal.Body>
//                                   <Form>
//                                     <Form.Group controlId="documentName">
//                                       <Form.Label>Document Name</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         placeholder="Enter document name"
//                                         value={formData.document_name}
//                                         onChange={(e) =>
//                                           setFormData({
//                                             ...formData,
//                                             document_name: e.target.value,
//                                           })
//                                         }
//                                       />
//                                     </Form.Group>
//                                     <Form.Group controlId="patientName">
//                                       <Form.Label>Patient Name</Form.Label>
//                                       <Form.Control
//                                         type="text"
//                                         placeholder="Enter patient name"
//                                         value={formData.patient_name}
//                                         onChange={(e) =>
//                                           setFormData({
//                                             ...formData,
//                                             patient_name: e.target.value,
//                                           })
//                                         }
//                                       />
//                                     </Form.Group>
//                                     <Form.Group controlId="documentDate">
//                                       <Form.Label>Document Date</Form.Label>
//                                       <Form.Control
//                                         type="date"
//                                         value={formData.document_date}
//                                         onChange={(e) =>
//                                           setFormData({
//                                             ...formData,
//                                             document_date: e.target.value,
//                                           })
//                                         }
//                                       />
//                                     </Form.Group>
 
//                                     <Form.Group controlId="documentType">
//                                       <Form.Label>Document Type</Form.Label>
//                                       <div className="d-flex">
//                                         <Button
//                                           variant={
//                                             formData.document_type === "report"
//                                               ? "primary"
//                                               : "outline-primary"
//                                           }
//                                           className="me-2"
//                                           onClick={() =>
//                                             setFormData({
//                                               ...formData,
//                                               document_type: "report",
//                                             })
//                                           }
//                                         >
//                                           <FontAwesomeIcon icon={faFileAlt} />{" "}
//                                           Report
//                                         </Button>
//                                         <Button
//                                           variant={
//                                             formData.document_type === "invoice"
//                                               ? "primary"
//                                               : "outline-primary"
//                                           }
//                                           onClick={() =>
//                                             setFormData({
//                                               ...formData,
//                                               document_type: "invoice",
//                                             })
//                                           }
//                                         >
//                                           <FontAwesomeIcon icon={faReceipt} />{" "}
//                                           Invoice
//                                         </Button>
//                                       </div>
//                                     </Form.Group>
 
//                                     <Form.Group controlId="documentFile">
//                                       <Form.Label>Document File</Form.Label>
//                                       <div className="file-input">
//                                         <input
//                                           type="file"
//                                           id="fileInput"
//                                           onChange={handleFileSelect}
//                                           style={{ display: "none" }}
//                                         />
//                                         <Button onClick={handleAddFileClick}>
//                                           Add a File
//                                         </Button>
//                                         {selectedFiles.map((file, index) => (
//                                           <div
//                                             key={index}
//                                             className="selected-file"
//                                           >
//                                             <span>{file.name}</span>
//                                             <Button
//                                               variant="danger"
//                                               size="sm"
//                                               onClick={() =>
//                                                 handleDeleteFile(index)
//                                               }
//                                             >
//                                               <FontAwesomeIcon
//                                                 icon={faTimesSolid}
//                                               />
//                                             </Button>
//                                           </div>
//                                         ))}
//                                       </div>
//                                     </Form.Group>
//                                   </Form>
//                                 </Modal.Body>
//                                 <Modal.Footer>
//                                   <Button
//                                     variant="secondary"
//                                     onClick={toggleFormModal}
//                                   >
//                                     Cancel
//                                   </Button>
//                                   <Button
//                                     variant="primary"
//                                     onClick={handleSave}
//                                   >
//                                     {editingRecordId ? "Update" : "Save"}
//                                   </Button>
//                                 </Modal.Footer>
//                               </Modal>
 
//                               <Modal
//                                 show={!!errorMessage || !!successMessage}
//                                 onHide={handleCloseMessageModal}
//                               >
//                                 <Modal.Header closeButton>
//                                   <Modal.Title>
//                                     {errorMessage ? "Error" : "Success"}
//                                   </Modal.Title>
//                                 </Modal.Header>
//                                 <Modal.Body>
//                                   <p>{errorMessage || successMessage}</p>
//                                 </Modal.Body>
//                                 <Modal.Footer>
//                                   <Button
//                                     variant="primary"
//                                     onClick={handleCloseMessageModal}
//                                   >
//                                     Close
//                                   </Button>
//                                 </Modal.Footer>
//                               </Modal>
//                             </Card.Body>
//                           </Card>
//                         </td>
//                       </tr>
//                     )}

//                 </React.Fragment>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
 
//       <Modal
//         show={showConfirmation}
//         onHide={() => setShowConfirmation(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this appointment?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowConfirmation(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={() => {
//               handleDelete(appointmentIdToDelete);
//               setShowConfirmation(false);
//             }}
//           >
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
 
//       <Modal
//         show={showPreviewModal}
//         onHide={handleClosePreviewModal}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Preview Document</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {previewFileType.includes("image") ? (
//             <img src={previewFileUrl} alt="Document Preview" />
//           ) : previewFileType.includes("pdf") ? (
//             <iframe
//               src={previewFileUrl}
//               title="Document Preview"
//               width="100%"
//               height="600px"
//             ></iframe>
//           ) : (
//             <p>No preview available for this file type.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClosePreviewModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
 
//       <ToastContainer position="top-end" className="p-3">
//         <Toast
//           onClose={() => setShowToast(false)}
//           show={showToast}
//           bg={toastVariant}
//           delay={3000}
//           autohide
//         >
//           <Toast.Body>{toastMessage}</Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </Container>
//   );
// };
 
// export default ClinicBookedAppointment;
 
import React, { useState, useEffect } from "react";
import '../../css/ClinicBookedAppointment.css'; // Import your CSS file
import {Modal,Button,Form,Row,Col,Table,Dropdown,DropdownButton,Container,Card,Toast,ToastContainer,} from "react-bootstrap";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFileAlt,faReceipt,faEllipsisV,faTimes as faTimesSolid,} from "@fortawesome/free-solid-svg-icons";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
const ClinicBookedAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [clinicId, setClinicId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState(null);
  const [formDetails, setFormDetails] = useState({});
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchParams, setSearchParams] = useState({ booked_by: "" });
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [prescriptionDocuments, setPrescriptionDocuments] = useState([]);
  // const [prescriptions, setPrescriptions] = useState([
  //   { medicine_name: "", time: "", comment: "", description: "" },
  // ]);
  const [prescriptions, setPrescriptions] = useState([
    { medicine_name: "", time: [], comment: "", description: "" },
  ]);
 
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordDetails, setRecordDetails] = useState({mobile_number: "",blood_pressure: "",weight: "",height: "",sugar_level: "",oxygen_level: "",symptoms: "",symptoms_comment: "",body_temperature: "",appointment_id: "",});
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileType, setPreviewFileType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({document_name: "",patient_name: "",document_date: "",document_type: "",document_file: "",});
  const [timeSlots, setTimeSlots] = useState([]); // Define timeSlots here
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSymptomsForm, setShowSymptomsForm] = useState(false);
  const [searchSymptom, setSearchSymptom] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [uploadedPrescription, setUploadedPrescription] = useState(null);
  const [isPrescriptionDocs, setIsPrescriptionDocs] = useState(false);
  const [showPrescriptionDocsForm, setShowPrescriptionDocsForm] =
    useState(false);
  const [documentIds, setDocumentIds] = useState([]);
 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // 'success' or 'danger'
 
  useEffect(() => {
    const token = localStorage.getItem("patient_token");
    if (!token) return;
 
    try {
      const decodedToken = jwtDecode(token);
      const mobile_number = decodedToken.mobile_number;
      setMobileNumber(mobile_number);
 
      setFormData((prevFormData) => ({
        ...prevFormData,
        mobile_number: mobile_number,
      }));
 
      fetchMedicalRecords(mobile_number);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
 
  const fetchMedicalRecords = async (appointment_id) => {
    if (!appointment_id) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
 
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.clinic_id;
      const userType = decodedToken.user_type;
 
      const response = await BaseUrl.get(
        `/patient/patientdocumentusingappointmentid/`,
        {
          params: {
            appointment: appointment_id,
          },
        }
      );
      if (Array.isArray(response.data)) {
        setMedicalRecords(response.data);
      } else {
        setMedicalRecords([]);
      }
      setShowMedicalRecords(true);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setMedicalRecords([]);
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
 
  const toggleFormModal = async () => {
    setShowFormModal((prev) => !prev);
 
    let decodedToken = null;
 
    try {
      const token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return;
    }
 
    const clinicId = decodedToken.clinic_id;
    const userType = decodedToken.user_type;
 
    if (!showFormModal) {
      try {
        const appointmentId = expandedAppointmentId;
        if (!appointmentId) {
          console.error("No appointment ID found");
          return;
        }
 
        const documentResponse = await BaseUrl.get(`/patient/patientname/`, {
          params: {
            appointment_id: appointmentId,
          },
        });
 
        if (documentResponse.status === 200) {
          const documentData = documentResponse.data;
 
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
        formDataToSend.append("user_type", userType);
        formDataToSend.append("clinic_id", clinicId);
 
        try {
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
            await fetchAppointments(clinicId);
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
 
  const handleSave = async () => {
    let decodedToken = null;
 
    try {
      const token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return;
    }
 
    const formDataToSend = new FormData();
 
    formDataToSend.append("appointment", expandedAppointmentId);
    formDataToSend.append("document_name", formData.document_name);
    formDataToSend.append("patient_name", formData.patient_name);
    formDataToSend.append("document_date", formData.document_date);
    formDataToSend.append("document_type", formData.document_type);
 
    if (selectedFiles.length > 0) {
      formDataToSend.append("document_file", selectedFiles[0]);
    }
 
    formDataToSend.append("user_type", decodedToken.user_type);
    formDataToSend.append("user_id", decodedToken.clinic_id);
 
    try {
      if (editingRecordId) {
        // Include document_id in the payload for PATCH request
        formDataToSend.append("document_id", editingRecordId);
 
        await BaseUrl.patch(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend
        );
        setShowFormModal(false);
        await fetchMedicalRecords(expandedAppointmentId);
        setSuccessMessage("Document file updated successfully");
      } else {
        await BaseUrl.post(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend
        );
        setShowFormModal(false);
        await fetchMedicalRecords(expandedAppointmentId);
        setSuccessMessage("Document record saved successfully");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      setErrorMessage("Failed to save document record");
    }
  };
 
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };
 
  const handleFileSelectForPrescription = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
 
  const handleCloseMessageModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };
 
  const handleAddFileClick = () => {
    document.getElementById("fileInput").click();
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
      await fetchAppointments(clinicId);
      setSuccessMessage("File record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      setErrorMessage("Failed to delete record file");
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
 
  const handleViewPrescription = async (prescriptionId, appointment_id) => {
    if (expandedPrescriptionId === prescriptionId) {
      setExpandedPrescriptionId(null);
    } else {
      try {
        const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
          params: { appointment_id: appointment_id },
        });
        const prescriptionData = response.data;
        setPrescriptionDocuments(prescriptionData);
        setExpandedPrescriptionId(prescriptionId);
      } catch (error) {
        console.error("Error viewing prescription:", error);
        setShowToast(true);
        setToastMessage("Failed to view prescription.");
        setToastVariant("danger");
      }
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
      formData.append("appointment", appointment_id);
 
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
        await fetchMedicalRecords(appointment_id); // Fetch updated medical records
        await fetchAppointments(clinicId); // Fetch updated appointments
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
 
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFileUrl("");
    setPreviewFileType("");
  };
 
  useEffect(() => {
    const getClinicIdFromToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
 
      try {
        const decodedToken = jwtDecode(token);
        const clinic_id = decodedToken.clinic_id;
        setClinicId(clinic_id);
        await fetchAppointments(clinic_id);
      } catch (error) {
        console.error("Error decoding token or fetching appointments:", error);
      }
    };
 
    getClinicIdFromToken();
  }, []);
 
  const fetchAppointments = async (clinicId) => {
    try {
      const response = await BaseUrl.get(
        `/clinic/appointmentbyclinicid/?clinic_id=${clinicId}`
      );
      const fetchedAppointments = response.data.map((appointment) => ({
        appointment_id: appointment.appointment_id,
        appointment_date: appointment.appointment_date,
        appointment_slot: appointment.appointment_slot,
        doctor_name: appointment.doctor_name,
        booked_by: appointment.booked_by,
        mobile_number: appointment.mobile_number,
        patient_id: appointment.patient_id,
        is_patient: appointment.is_patient,
      }));
      setAppointments(fetchedAppointments);
      if (fetchedAppointments.length > 0) {
        setSelectedPatientId(fetchedAppointments[0].patient_id);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setShowToast(true);
      setToastMessage("Failed to fetch appointments.");
      setToastVariant("danger");
    }
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
    setPrescriptions([{ medicine_name: "", time: [], comment: "", description: "" }]);
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
        // Fetch data for the patient, without waiting for each API to complete before proceeding to the next
        const fetchDataForPatient = async () => {
          const patientPromise = BaseUrl.get(
            `/patient/patient/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
          );
 
          const checkupPromise = BaseUrl.get(`/patient/patientcheckup/`, {
            params: { appointment_id: appointment_id },
          });
 
          const prescriptionPromise = BaseUrl.get(
            `/patient/patientpriscription/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
          );
 
          const prescriptionDocPromise = BaseUrl.get(`/patient/patientprescriptonfile/`, {
            params: { appointment_id: appointment_id },
          });
 
          const symptomsPromise = BaseUrl.get(`/doctor/symptomsdetail/?appointment_id=${appointment_id}`);
 
          // You can also await these individually if you want to handle them sequentially
 
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
          if (patientResponse.status === "fulfilled" && patientResponse.value.status === 200) {
            const patientDetails = patientResponse.value.data;
            setFormDetails((prevDetails) => ({
              ...prevDetails,
              ...patientDetails,
            }));
          } else {
            console.error("Failed to fetch patient details:", patientResponse.reason);
          }
 
          // Handle checkup details response
          const checkupResponse = results[1];
          if (checkupResponse.status === "fulfilled" && checkupResponse.value.status === 200) {
            const checkupDetails = checkupResponse.value.data[0];
            setRecordDetails((prevDetails) => ({
              ...prevDetails,
              ...checkupDetails,
            }));
          } else {
            console.error("Failed to fetch checkup details:", checkupResponse.reason);
          }
 
          // Handle prescriptions response
          const prescriptionResponse = results[2];
          if (prescriptionResponse.status === "fulfilled" && prescriptionResponse.value.status === 200) {
            setPrescriptions(prescriptionResponse.value.data);
          } else {
            console.error("Failed to fetch prescriptions:", prescriptionResponse.reason);
          }
 
          // Handle prescription documents response
          const prescriptionDocResponse = results[3];
          if (prescriptionDocResponse.status === "fulfilled" && prescriptionDocResponse.value.status === 200) {
            setPrescriptionDocuments(prescriptionDocResponse.value.data);
          } else {
            console.error("Failed to fetch prescription documents:", prescriptionDocResponse.reason);
          }
 
          // Handle symptoms response
          const symptomsResponse = results[4];
          if (symptomsResponse.status === "fulfilled" && symptomsResponse.value.status === 200) {
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
 
  const getPrescriptions = async (appointmentId) => {
    try {
      // Call the GET API to fetch prescriptions for a specific appointment
      const response = await BaseUrl.get(`/patient/patientpriscription/`, {
        params: { appointment_id: appointmentId },
      });
 
      if (response.status === 200) {
        const fetchedPrescriptions = response.data; // Assuming the response contains the prescription data
        setPrescriptions(fetchedPrescriptions); // Update the state with the fetched prescriptions
        console.log("Prescriptions fetched successfully", fetchedPrescriptions);
      } else {
        console.error("Failed to fetch prescriptions");
        setErrorMessage("Failed to fetch prescriptions");
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setErrorMessage("Error fetching prescriptions");
    }
  };
 
 
 
 
 
 
  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setRecordDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
// Function to fetch prescription documents for a specific appointment
const fetchPrescriptionDocuments = async (appointment_id) => {
  try {
    // Make the GET request to fetch prescription documents
    const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
      params: { appointment_id: appointment_id }, // Pass the appointment ID in the request params
    });
 
    // Check if the response is successful
    if (response.status === 200) {
      const prescriptionDocuments = response.data; // Assuming the response contains the document data
      console.log("Prescription documents fetched successfully", prescriptionDocuments);
      return prescriptionDocuments; // Return the fetched documents
    } else {
      console.error("Failed to fetch prescription documents");
      throw new Error("Failed to fetch prescription documents");
    }
  } catch (error) {
    console.error("Error fetching prescription documents:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};
 
const handleDeletePrescriptionDoc = async (docId, appointment_id) => {
  try {
    const response = await BaseUrl.delete(`/patient/patientprescriptonfile/`, {
      data: {
        document_id: docId,
      },
    });
 
    if (response.status === 204) {
      setSuccessMessage("Prescription document deleted successfully");
 
      // Refresh the prescription document list after deletion only if response status is 204
      // await fetchPrescriptionDocuments(expandedAppointmentId); // Call the fetchPrescriptionDocuments function
    } else {
      // If the response is not 204, handle it as an error
      throw new Error("Failed to delete prescription document");
    }
  } catch (error) {
    console.error("Error deleting prescription document:", error);
    setErrorMessage({ type: 'error', text: error.response?.data?.error || "An error occurred. Please try again."});
  }
};
 
  const handleDownloadPrescriptionDoc = async (doc) => {
    try {
      const response = await BaseUrl.get(`/patient/patientprescriptonfileView/`, {
        params: {
          patient_id: doc.patient,
          document_id: doc.id,
        },
        responseType: "blob", // Ensure it's downloading as a blob
      });
      setSuccessMessage("Prescription document downloaded successfully");
 
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.document_name}.${response.data.type.split("/")[1]}`;
      link.click();
    } catch (error) {
      console.error("Error downloading prescription document:", error);
      setErrorMessage("Failed to download preset document");
    }
  };
 
  const handleUpdate = async () => {
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        throw new Error("Selected appointment not found");
      }
 
      const payload = {
        appointment_id: selectedAppointment.appointment_id,
        patient_id: selectedAppointment.patient_id,
        ...formDetails,
      };
 
      const response = await BaseUrl.put(`/patient/patient/`, payload);
 
      if (response.status === 200) {
        await fetchAppointments(clinicId);
        setSuccessMessage("Appointment slot and patient details have been updated successfully");
      } else {
        console.error("Failed to update appointment details");
        setErrorMessage("Appointment slot not found");
      }
    } catch (error) {
      console.error("Error updating appointment details:", error);
      setErrorMessage("Booked by patient not found");
    }
  };
 
  const handleDelete = async (appointment_id) => {
    try {
      // Make the DELETE request to remove the appointment
      const response = await BaseUrl.delete(`/doctorappointment/getslot/`, {
        data: { appointment_id }, // Pass the appointment ID for deletion
      });
 
      if (response.status === 204) {
        // Fetch the updated appointments after successfully deleting the appointment
        await fetchAppointments(clinicId); // Fetch updated appointments using clinicId
        setSuccessMessage("Appointment slot has been deleted successfully");
 
        // Optional: You can also perform a redirect here if needed
        // For example, redirect to the main appointments page or any other page
        // window.location.href = '/clinic/booked-appointments'; // Uncomment if you want to redirect
      } else {
        // If the response status is not 200, handle it as an error
        throw new Error("Failed to delete appointment");
      }
    } catch (error) {
      // Log any errors encountered during the process and show an error message to the user
      console.error("Error deleting appointment:", error);
      setErrorMessage("Appointment slot not found");
    }
  };
 
 
 
  const handleCancelAppointment = async (appointment_id) => {
    try {
      const response = await BaseUrl.patch(`/doctorappointment/getslot/`, {
        appointment_id,
      });
 
      if (response.status === 200) {
        await fetchAppointments(clinicId);
        setSuccessMessage("Appointment slot has been freed up successfully");
      } else {
        console.error("Failed to cancel appointment");
        setErrorMessage("Appointment slot not found");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      setErrorMessage("Appointment slot not found");
    }
  };
 
  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPrescriptions = prescriptions.map((prescription, i) =>
      i === index ? { ...prescription, [name]: value } : prescription
    );
    setPrescriptions(updatedPrescriptions);
  };
 
 
 
  const addPrescriptionRow = () => {
    setPrescriptions([{ medicine_name: "", time: "", comment: "", description: "" }, ...prescriptions]);
  };
 
 
 
 
  const removePrescriptionRow = async (index) => {
    try {
      const prescriptionToDelete = prescriptions[index];
      const prescription_id = prescriptionToDelete.id;
 
      if (!prescription_id) {
        console.error("No prescription ID found");
        return;
      }
 
      // Call the DELETE API to remove the prescription
      const response = await BaseUrl.delete(`/patient/patientpriscription/`, {
        params: { prescription_id },
      });
 
      if (response.status === 200 || response.status === 204) {
        // Remove the prescription from the UI
        const updatedPrescriptions = prescriptions.filter(
          (_, i) => i !== index
        );
        setPrescriptions(updatedPrescriptions);
 
        // Call the getPrescriptions function to refresh the list of prescriptions
        await getPrescriptions(expandedAppointmentId);
         // Fetch updated prescriptions
       
 
        setSuccessMessage("Prescription removed successfully");
      } else {
        console.error("Failed to remove prescription");
        setErrorMessage("Error removing prescription");
      }
    } catch (error) {
      console.error("Error removing prescription:", error);
      setErrorMessage("Error removing prescription");
    }
  };
 
  const fetchPrescriptions = async (appointment_id, patient_id) => {
    try {
      // Make the GET API call to fetch prescriptions for the given appointment and patient
      const response = await BaseUrl.get('/patient/patientpriscription/', {
        params: {
          appointment_id: appointment_id, // Pass the appointment ID
          patient_id: patient_id,         // Pass the patient ID
        },
      });
 
      if (response.status === 200) {
        const fetchedPrescriptions = response.data; // Assuming the API returns an array of prescriptions
 
        // Update the state with the fetched prescriptions
        setPrescriptions(fetchedPrescriptions); // Set the fetched prescriptions to state
 
       
      } else {
        console.error('Failed to fetch prescriptions');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };
 
 
 
 
  const handlePrescriptionSubmit = async (index) => {
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
 
      const patient_id = selectedAppointment.patient_id;
      const appointment_id = selectedAppointment.appointment_id;
 
      // Get the specific prescription for the current index
      const prescription = prescriptions[index];
 
      if (!prescription.medicine_name || !prescription.time || !prescription.comment) {
        setErrorMessage("Please fill out all required fields before submitting.");
        return;
      }
 
      // Prepare the payload for the individual prescription
      const payload = {
        ...prescription,
        patient_id: patient_id,
        appointment_id: appointment_id,
      };
 
      // Make the POST API call to submit the individual prescription
      const response = await BaseUrl.post('/patient/patientpriscription/', [payload]);
 
      if (response.status === 201) {
        setSuccessMessage("Prescription submitted successfully");
 
        // Optionally clear this specific prescription row
        const updatedPrescriptions = prescriptions.map((prescription, i) =>
          i === index ? { medicine_name: '', time: '', comment: '', description: '' } : prescription
        );
        setPrescriptions(updatedPrescriptions);
 
        // Fetch the latest prescriptions after successful submission
        await fetchPrescriptions(appointment_id, patient_id); // Fetch updated prescriptions
        await fetchDocumentIds(appointment_id);
      } else {
        console.error('Failed to submit prescription');
        setErrorMessage("Failed to submit prescription");
      }
    } catch (error) {
      console.error('Error submitting prescription:', error);
      setErrorMessage("Failed to submit prescription");
    }
  };
 
 
 
 
     
 
 
 
 
 
 
 
 
 
 
 
  const handleUpdatePrescription = async (index) => {
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
 
      const patient_id = selectedAppointment.patient_id;
      const appointment_id = selectedAppointment.appointment_id;
 
      // Get the specific prescription for the current index
      const prescription = prescriptions[index];
 
      // Ensure the prescription has a valid prescription_id for updating
      // if (!prescription.prescription_id) {
      //   setErrorMessage("Prescription ID is required for updating.");
      //   return;
      // }
 
      // Prepare the payload for updating the prescription
      const payload = {
        prescription_id: prescription.id, // Required for update
        patient_id: patient_id,                        // Required for update
        appointment_id: appointment_id,                // Optional based on backend requirements
        medicine_name: prescription.medicine_name,     // Fields to be updated
        time: prescription.time,
        comment: prescription.comment,
        description: prescription.description,
      };
 
      // Make the PUT API call to update the prescription
      const response = await BaseUrl.put('/patient/patientpriscription/', payload); // No prescription_id in URL
 
      if (response.status === 200) {
        console.log("Prescription updated successfully");
        setSuccessMessage("Prescription updated successfully");
 
        // Fetch the updated prescriptions after updating
        await fetchPrescriptions(appointment_id, patient_id);
      } else {
        console.error("Failed to update prescription");
        setErrorMessage("Failed to update prescription");
      }
    } catch (error) {
      console.error("Error updating prescription:", error);
      setErrorMessage("Error updating prescription");
    }
  };
 
 
 
 
 
     
 
 
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
 
  const toggleVitalForm = async (appointment_id) => {
    setShowVitalForm(!showVitalForm);
    setShowPrescriptionForm(false);
    setExpandedAppointmentId(appointment_id);
 
    if (!showVitalForm) {
      try {
        const selectedAppointment = appointments.find(
          (appointment) => appointment.appointment_id === appointment_id
        );
 
        if (selectedAppointment) {
          const appointment_date = selectedAppointment.appointment_date;
 
          const fetchDataResponse = await BaseUrl.get(
            `/patient/patientcheckup/`,
            {
              params: {
                appointment_id: appointment_id,
                appointment_date: appointment_date,
              },
            }
          );
 
          if (
            fetchDataResponse.status === 200 &&
            fetchDataResponse.data.length > 0
          ) {
            const fetchedData = fetchDataResponse.data[0];
 
            setRecordDetails({
              appointment_id: appointment_id,
              blood_pressure: fetchedData.blood_pressure || "",
              oxygen_level: fetchedData.oxygen_level || "",
              body_temperature: fetchedData.body_temperature || "",
              heart_rate: fetchedData.heart_rate || "",
              pulse_rate: fetchedData.pulse_rate || "",
              sugar_level: fetchedData.sugar_level || "",
              weight: fetchedData.weight ,
              appointment_date: appointment_date,
            });
          } else {
            console.error("No vitals data found");
          }
        } else {
          console.error("No selected appointment found");
        }
      } catch (error) {
        console.error("Error fetching vitals data:", error);
      }
    } else {
      setRecordDetails({
        appointment_id: "",
        blood_pressure: "",
        oxygen_level: "",
        sugar_level: "",
        weight: "",
        pulse_rate: "",
        heart_rate: "",
        body_temperature: "",
        appointment_date: "",
      });
    }
  };
 
  const handleVitalSubmit = async () => {
    try {
      // Find the selected appointment based on the expanded appointment ID
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
 
      const patient_id = selectedAppointment.patient_id;
      const appointment_date = selectedAppointment.appointment_date;
 
      // Make the POST API call to submit vitals
      const postResponse = await BaseUrl.post("/patient/patientcheckup/", {
        patient_id: patient_id,
        appointment_id: expandedAppointmentId,
        record_date: appointment_date,
        blood_pressure: recordDetails.blood_pressure,
        oxygen_level: recordDetails.oxygen_level,
        sugar_level: recordDetails.sugar_level,
        weight: recordDetails.weight,
        pulse_rate: recordDetails.pulse_rate,
        heart_rate: recordDetails.heart_rate,
        body_temperature: recordDetails.body_temperature,
      });
 
      if (postResponse.status === 201) {
        setErrorMessage("");
        await fetchAppointments(clinicId); // Fetch updated appointments
        await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
        setRecordDetails({
          patient_id: "",
          blood_pressure: "",
          oxygen_level: "",
          sugar_level: "",
          weight: "",
          pulse_rate: "",
          heart_rate: "",
          body_temperature: "",
          appointment_id: "",
          appointment_date: "",
        });
        setSuccessMessage("Vitals submitted successfully");
setRecordDetails(recordDetails);
      } else {
        setErrorMessage("Failed to submit vitals");
      }
    } catch (postError) {
      console.error("Error submitting vitals:", postError);
      setErrorMessage("Error submitting vitals");
      setShowToast(true);
      setToastMessage("Error submitting vitals.");
      setToastVariant("danger");
    }
  };
 
 
  const handleVitalUpdate = async () => {
    try {
      // Find the selected appointment based on the expanded appointment ID
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
 
      const patient_id = selectedAppointment.patient_id;
      const appointment_id = selectedAppointment.appointment_id;
 
      // Prepare the payload for updating the vitals, including appointment_id in the payload
      const payload = {
        blood_pressure: recordDetails.blood_pressure,
        oxygen_level: recordDetails.oxygen_level,
        body_temperature: recordDetails.body_temperature,
        heart_rate: recordDetails.heart_rate,
        pulse_rate: recordDetails.pulse_rate,
        sugar_level: recordDetails.sugar_level,
        weight: recordDetails.weight,
        patient_id: patient_id,
        appointment_id: appointment_id, // Send appointment_id in payload
      };
 
      // Make the PUT API call to update the vitals (no appointment_id in the URL)
      const response = await BaseUrl.put(`/patient/patientcheckup/`, payload);
 
      if (response.status === 200) {
        console.log("Vitals updated successfully");
        setSuccessMessage("Vitals updated successfully");
      } else {
        console.error("Failed to update vitals");
        setErrorMessage("Failed to update vitals");
      }
    } catch (error) {
      console.error("Error updating vitals:", error);
      setErrorMessage("Error updating vitals");
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
      const response = await BaseUrl.get("/clinic/clinicsearch/", {
        params: {
          clinic_id: clinicId,
          query: searchParams.booked_by,
        },
      });
 
      const fetchedAppointments = response.data.map((appointment) => ({
        appointment_id: appointment.appointment_id,
        appointment_date: appointment.appointment_date,
        appointment_slot: appointment.appointment_slot,
        doctor_name: appointment.doctor_name,
        booked_by: appointment.booked_by,
        mobile_number: appointment.mobile_number,
        patient_id: appointment.patient_id,
        is_patient: appointment.is_patient,
      }));
 
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error searching appointments:", error);
      setErrorMessage("No appointments found");
    }
  };
 
  const handleSeverityChange = (index, event) => {
    const { value } = event.target;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, severity: value } : symptom
      )
    );
  };
 
  const handleSymptomDetailChange = (index, event) => {
    const { value } = event.target;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? `${symptom.symptoms_name}: ${value}` : symptom
      )
    );
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
 
  const handleSinceChange = (index, event) => {
    const value = event.target.value;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, since: value } : symptom
      )
    );
  };
 
  const handleMoreOptionsChange = (index, event) => {
    const value = event.target.value;
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, more_options: value } : symptom
      )
    );
  };
 
  const toggleSymptomsForm = async (appointment_id) => {
    setShowSymptomsForm(!showSymptomsForm);
    setExpandedAppointmentId(appointment_id);
 
    if (!showSymptomsForm) {
      try {
        const selectedAppointment = appointments.find(
          (appointment) => appointment.appointment_id === appointment_id
        );
 
        if (selectedAppointment) {
          const response = await BaseUrl.get(
            `/patient/patientsymptoms/?appointment_id=${appointment_id}`
          );
          if (response.status === 200) {
            setSelectedSymptoms(response.data.symptoms || []);
          } else {
            console.error("Failed to fetch symptoms");
          }
        } else {
          console.error("No selected appointment found");
        }
      } catch (error) {
        console.error("Error fetching symptoms:", error);
        setErrorMessage("Failed to fetch symptoms.");
      }
    } else {
      setSelectedSymptoms([]);
    }
  };
 
  const handleSymptomSearchChange = (e) => {
    setSearchSymptom(e.target.value);
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
 
 
  const handleRemoveSymptom = async (symptom) => {
    try {
      const response = await BaseUrl.delete(`/doctor/symptomsdetail/`, {
        data: {
          appointment_id: expandedAppointmentId,
          symptoms_id: symptom.symptoms,
        },
      });
 
      if (response.status === 204) {
        setSelectedSymptoms((prevSymptoms) =>
          prevSymptoms.filter((s) => s.id !== symptom.id)
        );
        setSuccessMessage("Symptoms Detail deleted successfully");
      } else {
        console.error("Failed to delete symptom");
        setErrorMessage("Symptoms Detail not found");
      }
    } catch (error) {
      console.error("Error deleting symptom:", error);
    }
  };
 
  const handleSaveSymptoms = async () => {
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
 
      const appointment_id = expandedAppointmentId;
      const appointment_date = selectedAppointment.appointment_date;
 
      let successCount = 0; // Counter to track the number of successful API calls
 
      for (const symptom of selectedSymptoms) {
        const symptomPayload = {
          symptoms: symptom.Symptoms_id,
          appointment: appointment_id,
          symptom_date: appointment_date,
          since: symptom.since,
          severity: symptom.severity,
          more_options: symptom.more_options,
        };
 
        try {
          const response = await BaseUrl.post(
            "/doctor/symptomsdetail/",
            symptomPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
 
          // Check if the response status is 200 or 201
          if (response.status === 200 || response.status === 201) {
            successCount++; // Increment the success counter for successful responses
          } else {
            console.error("Failed to save symptom:", symptom);
          }
        } catch (error) {
          console.error("Error saving symptom:", error);
        }
      }
 
      // If any of the symptoms were saved successfully, print the success message
      if (successCount > 0) {
        setSuccessMessage(`${successCount} symptom(s) details saved successfully`);
      } else {
        setErrorMessage("No symptoms details were saved");
      }
 
      await fetchAppointments(clinicId); // Fetch updated appointments
      await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }
  };
 
 
  const handleUpdateSymptom = async () => {
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
 
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
 
      const appointment_id = expandedAppointmentId;
      const appointment_date = selectedAppointment.appointment_date;
 
      let successCount = 0; // Counter to track the number of successful updates
 
      for (const symptom of selectedSymptoms) {
        const symptomPayload = {
          symptoms_id: symptom.id,
          symptoms_name: symptom.symptoms_name,
          appointment_id: appointment_id,
          since: symptom.since,
          severity: symptom.severity,
          more_options: symptom.more_options,
        };
 
        try {
          const response = await BaseUrl.put(
            "/doctor/symptomsdetail/",
            symptomPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
 
          // Check if the response status is 200 or 201
          if (response.status === 200 || response.status === 201) {
            successCount++; // Increment success counter
          } else {
            console.error("Failed to update symptom:", symptom);
          }
        } catch (error) {
          console.error("Error updating symptom:", error);
        }
      }
 
      // If any symptoms were updated successfully, print the success message
      if (successCount > 0) {
        setSuccessMessage(`${successCount} symptom(s) updated successfully`);
      } else {
        setErrorMessage("No symptoms were updated");
      }
 
      await fetchAppointments(clinicId); // Fetch updated appointments
      await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
    } catch (error) {
      console.error("Error updating symptoms:", error);
    }
  };
 
 
  // Add this function to handle input changes in forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
 
  const handleTimeSelection = (e, index, timeSlot) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) => {
      if (i === index) {
        let updatedTime;
        if (e.target.checked) {
          updatedTime = [...prescription.time, timeSlot]; // Add the selected time slot
        } else {
          updatedTime = prescription.time.filter((time) => time !== timeSlot); // Remove the deselected time slot
        }
        return { ...prescription, time: updatedTime };
      }
      return prescription;
    });
    setPrescriptions(updatedPrescriptions);
  };
 
  return (
    <Container fluid>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
 
      <div className="mb-3">
        <Card
          className="shadow-sm mb-3"
          style={{
            borderRadius: "15px",
            border: "2px solid #007bff",
            background: "linear-gradient(145deg, #f0f9ff, #cfe3f8)",
          }}
        >
          <Card.Body>
            <h5 className="card-title mb-4" style={{ color: "#007bff" }}>
              Search Appointments
            </h5>
            <Form>
              <Form.Group>
                <label htmlFor="booked_by" className="form-label">
                  Search by Booked By:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="booked_by"
                  name="booked_by"
                  value={searchParams.booked_by}
                  onChange={handleSearchChange}
                  placeholder="Date/Time Slot/Doctor/Booked By/Mobile Number"
                />
              </Form.Group>
              <Button className="btn btn-primary mt-3" onClick={handleSearch}>
                Search
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
 
      <Card
        className="shadow-sm"
        style={{
          borderRadius: "15px",
          border: "2px solid #28a745",
          background: "linear-gradient(145deg, #e8f5e9, #c8e6c9)",
        }}
      >
         {/* Success/Error Modal */}
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
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseMessageModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        <Card.Body>
          <h5 className="card-title mb-4" style={{ color: "#28a745" }}>
            Booked Appointments
          </h5>
          <Table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Doctor</th>
                <th>Booked By</th>
                <th>Mobile Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <React.Fragment key={appointment.appointment_id}>
                  <tr className={appointment.is_patient ? "table-danger" : ""}>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.appointment_slot}</td>
                    <td>{appointment.doctor_name}</td>
                    <td>{appointment.booked_by}</td>
                    <td>{appointment.mobile_number}</td>
                    <td>
                      <FaEdit
                        className="me-2 text-primary"
                        onClick={() =>
                          toggleForm(appointment.appointment_id, appointment)
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <FaTrash
                        className="me-2 text-danger"
                        onClick={() => {
                          setShowConfirmation(true);
                          setAppointmentIdToDelete(
                            appointment.appointment_id
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      {expandedAppointmentId ===
                      appointment.appointment_id ? (
                        <FaChevronUp
                          onClick={() => setExpandedAppointmentId(null)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <FaChevronDown
                          onClick={() =>
                            toggleForm(appointment.appointment_id, appointment)
                          }
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </td>
                  </tr>
 
                  {expandedAppointmentId === appointment.appointment_id && (
                    <tr>
                      <td colSpan="6">
                        <Card
                          className="shadow-sm mt-3"
                          style={{
                            borderRadius: "15px",
                            border: "2px solid #ffc107",
                            background: "linear-gradient(145deg, #fff3cd, #ffeeba)",
                          }}
                        >
                          <Card.Body>
                            <h5>Patient Details</h5>
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
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Button variant="primary" onClick={handleUpdate}>
                                Update
                              </Button>
                              <Button
                                variant="danger"
                                className="ms-2"
                                onClick={() =>
                                  handleDelete(appointment.appointment_id)
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                variant="warning"
                                className="ms-2"
                                onClick={() =>
                                  handleCancelAppointment(
                                    appointment.appointment_id
                                  )
                                }
                              >
                                Cancel Appointment
                              </Button>
 
                             
                            </Form>
                          </Card.Body>
                        </Card>
                      </td>
                    </tr>
                  )}
 
{showSymptomsForm &&
  expandedAppointmentId === appointment.appointment_id && (
    <tr>
      <td colSpan="6">
        <Card
          className="shadow-sm mt-3"
          style={{
            borderRadius: "15px",
            border: "2px solid #fd7e14",
            background: "linear-gradient(145deg, #fde2cd, #fbd5b4)",
          }}
        >
          <Card.Body>
            <h5>Symptoms</h5>
            <Form>
              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Group controlId="symptomSearch">
                    <Form.Label>Search Symptoms</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search symptoms"
                      value={searchSymptom}
                      onChange={handleSymptomSearch}
                    />
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
                    <th>Actions</th>
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
                          onChange={(e) => handleSeverityChange(index, e)}
                        >
                          <option value="">Select Severity</option>
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name={`since-${index}`}
                          value={symptom.since}
                          onChange={(e) => handleSinceChange(index, e)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name={`more_options-${index}`}
                          value={symptom.more_options}
                          onChange={(e) => handleMoreOptionsChange(index, e)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveSymptom(symptom)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary" onClick={handleSaveSymptoms}>
                Save
              </Button>
              <Button
                variant="warning"
                className="ms-2"
                onClick={handleUpdateSymptom}
              >
                Update Symptoms
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setShowSymptomsForm(false)}
              >
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </td>
    </tr>
  )}
 
{showVitalForm &&
  expandedAppointmentId === appointment.appointment_id && (
    <tr>
      <td colSpan="6">
        <Card
          className="shadow-sm mt-3"
          style={{
            borderRadius: "15px",
            border: "2px solid #17a2b8",
            background: "linear-gradient(145deg, #e3f5f9, #d0ebf5)",
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
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" onClick={handleVitalSubmit}>
                Submit
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setShowVitalForm(false)}
              >
                Cancel
              </Button>
              {/* Add the new "Update" button */}
              <Button
                variant="warning"
                className="ms-2"
                onClick={handleVitalUpdate} // Define this function for update functionality
              >
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </td>
    </tr>
  )}
 
 
{showPrescriptionForm &&
  expandedAppointmentId === appointment.appointment_id && (
    <tr>
      <td colSpan="6">
        <Card
          className="shadow-sm mt-3"
          style={{
            borderRadius: "15px",
            border: "2px solid #dc3545",
            background: "linear-gradient(145deg, #f8d7da, #f1aeb6)",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <h5 className="text-center d-inline-block mb-0">Prescription</h5>
              <Button
                variant="success"
                className="ms-3 d-inline-block"
                onClick={addPrescriptionRow}
              >
                Add Prescription
              </Button>
            </div>
 
            <Form>
              {prescriptions.map((prescription, index) => (
                <Row className="mb-3" key={index}>
                  <Col>
                    <Form.Group controlId={`formMedicineName${index}`}>
                      <Form.Label>Medicine Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="medicine_name"
                        value={prescription.medicine_name}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`formComment${index}`}>
                      <Form.Label>Precautions</Form.Label>
                      <Form.Control
                        type="text"
                        name="comment"
                        value={prescription.comment}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`formDescription${index}`}>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={prescription.description}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                      />
                    </Form.Group>
                  </Col>
 
                  {/* Time Slot Dropdown */}
                  <Col>
                    <Form.Group controlId={`formTimeSlot${index}`}>
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        as="select"
                        name="time"
                        value={prescription.time}
                        onChange={(e) => handlePrescriptionChange(index, e)}
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
                    </Form.Group>
                  </Col>
 
                  <Col className="d-flex align-items-center">
                    <Button
                      variant="danger"
                      onClick={() => removePrescriptionRow(index)}
                      className="me-2"
                    >
                      Remove
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handlePrescriptionSubmit(index)}
                      className="me-2"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleUpdatePrescription(index)}
                    >
                      Update
                    </Button>
                  </Col>
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
                        title={<FontAwesomeIcon icon={faEllipsisV} />}
                        variant="secondary"
                      >
                        <Dropdown.Item onClick={() => handleDownloadPrescriptionDoc(doc)}>
                          Download
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeletePrescriptionDoc(doc.id)}>
                          Delete
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
            <Button variant="secondary" onClick={() => setShowPrescriptionDocsForm(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                handlePrescriptionDocs(appointment.appointment_id)
              }
            >
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </td>
    </tr>
  )}
 
 
 
 
 
 
 
 
{showRecordForm &&
                    expandedAppointmentId === appointment.appointment_id && (
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
                                              onClick={() =>
                                                handleViewFile(record)
                                              }
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
 
                              <Modal
                                show={showFormModal}
                                onHide={toggleFormModal}
                              >
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
                                  <Button
                                    variant="secondary"
                                    onClick={toggleFormModal}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={handleSave}
                                  >
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
                                <Modal.Footer>
                                  <Button
                                    variant="primary"
                                    onClick={handleCloseMessageModal}
                                  >
                                    Close
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </Card.Body>
                          </Card>
                        </td>
                      </tr>
                    )}
 
 
 
 
 
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
 
      <Modal
        show={showConfirmation}
        onHide={() => setShowConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(appointmentIdToDelete);
              setShowConfirmation(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
 
      {/* Preview Modal */}
      <Modal
        show={showPreviewModal}
        onHide={handleClosePreviewModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Preview Document</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
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
          <Button variant="secondary" onClick={handleClosePreviewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
     
 
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg={toastVariant}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};
 
export default ClinicBookedAppointment;
 
 