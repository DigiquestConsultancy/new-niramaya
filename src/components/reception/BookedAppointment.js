// import React, { useState, useEffect } from "react";
// import "../../css/ClinicBookedAppointment.css"; // Import your CSS file
// import {
//   Modal,
//   Button,
//   Form,
//   Row,
//   Col,
//   Table,
//   Dropdown,
//   DropdownButton,
//   Container,
//   Card,
//   Toast,
//   ToastContainer,
// } from "react-bootstrap";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFileAlt,
//   faReceipt,
//   faEllipsisV,
//   faTimes as faTimesSolid,
// } from "@fortawesome/free-solid-svg-icons";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import styled from "styled-components";
// import Loader from "react-js-loader";

// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: rgba(255, 255, 255, 0.7);
//   position: fixed;
//   width: 100%;
//   top: 0;
//   left: 0;
//   z-index: 9999;
// `;

// const LoaderImage = styled.div`
//   width: 400px;
// `;

// const ReceptionBookedAppointment = () => {
//   const [appointments, setAppointments] = useState([]);

//   const [isSearching, setIsSearching] = useState(false);
//   const [receptionId, setReceptionId] = useState("");
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);
//   // const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
//   const [expandedPrescriptionId, setExpandedPrescriptionId] = useState(null);
//   const [formDetails, setFormDetails] = useState({});
//   const [selectedPatientId, setSelectedPatientId] = useState(null);
//   const [searchParams, setSearchParams] = useState({ booked_by: "" });
//   const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
//   const [showVitalForm, setShowVitalForm] = useState(false);
//   const [prescriptionDocuments, setPrescriptionDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [prescriptions, setPrescriptions] = useState([
//     { medicine_name: "", time: [], comment: "", description: "" },
//   ]);
//   const [showRecordForm, setShowRecordForm] = useState(false);
//   const [recordDetails, setRecordDetails] = useState({
//     mobile_number: "",
//     blood_pressure: "",
//     weight: "",
//     height: "",
//     bmi: "",
//     sugar_level: "",
//     oxygen_level: "",
//     symptoms: "",
//     symptoms_comment: "",
//     body_temperature: "",
//     appointment_id: "",
//   });
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
//   const [timeSlots, setTimeSlots] = useState([]); // Define timeSlots here
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [showMedicalRecords, setShowMedicalRecords] = useState(false);
//   const [editingRecordId, setEditingRecordId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [showSymptomsForm, setShowSymptomsForm] = useState(false);
//   const [appointmentData, setAppointmentData] = useState(null); // Store the API response data
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
//     setLoading(true);
//     if (!appointment_id) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.reception_id;
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
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleDownloadFile = async (record) => {
//     setLoading(true);
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
//       setSuccessMessage(response.data.success);
//       link.click();
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       setErrorMessage(error.response?.data?.error);
//     }
//     setLoading(false)
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

//     const receptionId = decodedToken.reception_id;
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
//         formDataToSend.append("reception_id", receptionId);

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
//             await fetchAppointments(receptionId);
//             setSuccessMessage("Document file uploaded successfully");
//           } else {
//             console.error("Failed to upload document");
//             setErrorMessage("Failed to upload document file");
//           }
//         } catch (postError) {
//           console.error("Error uploading document:", postError);
//           setErrorMessage("Error uploading document file");
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
//     setLoading(true);
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
//     formDataToSend.append("user_id", decodedToken.reception_id);

//     try {
//       let response;
//       if (editingRecordId) {
//         // Include document_id in the payload for PATCH request
//         formDataToSend.append("document_id", editingRecordId);

//         response = await BaseUrl.patch(
//           `/patient/patientdocumentusingappointmentid/`,
//           formDataToSend
//         );
//         setSuccessMessage(response.data.success);
//       } else {
//         response = await BaseUrl.post(
//           `/patient/patientdocumentusingappointmentid/`,
//           formDataToSend
//         );
//         setSuccessMessage(response.data.success);
//       }

//       setShowFormModal(false);
//       await fetchMedicalRecords(expandedAppointmentId);
//     } catch (error) {
//       console.error("Error saving document:", error);
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
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
//     setLoading(true)
//     try {
//       const response = await BaseUrl.delete(
//         `/patient/patientdocumentusingappointmentid/`,
//         {
//           data: {
//             document_id: recordId,
//           },
//         }
//       );

//       // Set success message
//       setSuccessMessage(response.data.success);

//       // Refetch records and appointments
//       await fetchMedicalRecords(expandedAppointmentId);
//       await fetchAppointments(receptionId);
//     } catch (error) {

//       // Set error message
//       setErrorMessage(
//         error.response?.data?.error || "Failed to delete the record."
//       );
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleModifyRecord = (record) => {
//     // setLoading(true);
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
//     setLoading(true);
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
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleClosePreviewModal = () => {
//     setShowPreviewModal(false);
//     setPreviewFileUrl("");
//     setPreviewFileType("");
//   };

//   useEffect(() => {
//     const getReceptionIdFromToken = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const decodedToken = jwtDecode(token);
//         const reception_id = decodedToken.reception_id;
//         setReceptionId(reception_id);
//         await fetchAppointments(reception_id);
//       } catch (error) {
//         console.error("Error decoding token or fetching appointments:", error);
//       }
//     };

//     getReceptionIdFromToken();
//   }, []);

//  const fetchAppointments = async (receptionId) => {
//     setLoading(true);
//     try {
//       const response = await BaseUrl.get(
//         `/reception/appointmentbyreceptionid/?reception_id=${receptionId}`
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
//         status: appointment.is_canceled
//           ? "Canceled"
//           : appointment.is_complete
//             ? "Completed"
//             : "Upcoming",
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
//     finally{
//       setLoading(false)
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
//       bmi: "",
//       sugar_level: "",
//       oxygen_level: "",
//       symptoms: "",
//       symptoms_comment: "",
//       sugar_level: "",
//       oxygen_level: "",
//       symptoms: "",
//       symptoms_comment: "",
//       body_temperature: "",
//       appointment_id: "",
//     });
//     setPrescriptions([
//       { medicine_name: "", time: [], comment: "", description: "" },
//     ]);
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
//         // Fetch data for the patient, without waiting for each API to complete before proceeding to the next
//         const fetchDataForPatient = async () => {

//           const patientPromise = BaseUrl.get(
//             `/patient/patient/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
//           );

//           const checkupPromise = BaseUrl.get(`/patient/vital/`, {
//             params: { appointment_id: appointment_id },
//           });

//           const prescriptionPromise = BaseUrl.get(
//             `/patient/patientpriscription/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
//           );

//           const prescriptionDocPromise = BaseUrl.get(
//             `/patient/patientprescriptonfile/`,
//             {
//               params: { appointment_id: appointment_id },
//             }
//           );

//           const symptomsPromise = BaseUrl.get(
//             `/doctor/symptomsdetail/?appointment_id=${appointment_id}`
//           );

//           // You can also await these individually if you want to handle them sequentially

//           // Use Promise.allSettled to ensure all promises are hit, regardless of whether any fail
//           const results = await Promise.allSettled([
//             patientPromise,
//             checkupPromise,
//             prescriptionPromise,
//             prescriptionDocPromise,
//             symptomsPromise,
//             fetchDocumentIds(appointment_id), // fetch document ids
//             fetchMedicalRecords(appointment_id), // fetch medical records
//           ]);

//           // Handle patient details response
//           const patientResponse = results[0];
//           if (
//             patientResponse.status === "fulfilled" &&
//             patientResponse.value.status === 200
//           ) {
//             const patientDetails = patientResponse.value.data;
//             setFormDetails((prevDetails) => ({
//               ...prevDetails,
//               ...patientDetails,
//             }));
//           } else {
//             console.error(
//               "Failed to fetch patient details:",
//               patientResponse.reason
//             );
//           }

//           // Handle checkup details response
//           const checkupResponse = results[1];
//           if (
//             checkupResponse.status === "fulfilled" &&
//             checkupResponse.value.status === 200
//           ) {
//             const checkupDetails = checkupResponse.value.data[0];
//             setRecordDetails((prevDetails) => ({
//               ...prevDetails,
//               ...checkupDetails,
//             }));
//           } else {
//             console.error(
//               "Failed to fetch checkup details:",
//               checkupResponse.reason
//             );
//           }

//           // Handle prescriptions response
//           const prescriptionResponse = results[2];
//           if (
//             prescriptionResponse.status === "fulfilled" &&
//             prescriptionResponse.value.status === 200
//           ) {
//             setPrescriptions(prescriptionResponse.value.data);
//           } else {
//             console.error(
//               "Failed to fetch prescriptions:",
//               prescriptionResponse.reason
//             );
//           }

//           // Handle prescription documents response
//           const prescriptionDocResponse = results[3];
//           if (
//             prescriptionDocResponse.status === "fulfilled" &&
//             prescriptionDocResponse.value.status === 200
//           ) {
//             setPrescriptionDocuments(prescriptionDocResponse.value.data);
//           } else {
//             console.error(
//               "Failed to fetch prescription documents:",
//               prescriptionDocResponse.reason
//             );
//           }

//           // Handle symptoms response
//           const symptomsResponse = results[4];
//           if (
//             symptomsResponse.status === "fulfilled" &&
//             symptomsResponse.value.status === 200
//           ) {
//             setSelectedSymptoms(symptomsResponse.value.data);
//           } else {
//             console.error("Failed to fetch symptoms:", symptomsResponse.reason);
//           }
//         };

//         // Run the fetch operation for the patient
//         await fetchDataForPatient();
//       } catch (error) {
//         console.error("Error fetching patient data:", error);
//       }
//     }
//   };

//   const getPrescriptions = async (appointmentId) => {
//     try {
//       // Call the GET API to fetch prescriptions for a specific appointment
//       const response = await BaseUrl.get(`/patient/patientpriscription/`, {
//         params: { appointment_id: appointmentId },
//       });

//       if (response.status === 200) {
//         const fetchedPrescriptions = response.data; // Assuming the response contains the prescription data
//         setPrescriptions(fetchedPrescriptions); // Update the state with the fetched prescriptions
//         console.log("Prescriptions fetched successfully", fetchedPrescriptions);
//       } else {
//         console.error("Failed to fetch prescriptions");
//         setErrorMessage("Failed to fetch prescriptions");
//       }
//     } catch (error) {
//       console.error("Error fetching prescriptions:", error);
//       setErrorMessage(error.response?.data?.error);
//     }
//   };

//   const handleVitalChange = (e) => {
//     const { name, value } = e.target;
//     setRecordDetails((prevDetails) => {
//       const updatedDetails = { ...prevDetails, [name]: value };

//       // Check if height and weight are present and calculate BMI
//       const heightInMeters = parseFloat(updatedDetails.height) / 100; // Convert cm to meters
//       const weight = parseFloat(updatedDetails.weight);

//       if (heightInMeters && weight) {
//         updatedDetails.bmi = (
//           weight /
//           (heightInMeters * heightInMeters)
//         ).toFixed(2); // Calculate BMI
//       } else {
//         updatedDetails.bmi = ""; // Reset BMI if height or weight is missing
//       }

// return updatedDetails;
//     });
//   };

//   // Function to fetch prescription documents for a specific appointment
//   const fetchPrescriptionDocuments = async (appointment_id) => {
//     setLoading(true);
//     try {
//       // Make the GET request to fetch prescription documents
//       const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
//         params: { appointment_id: appointment_id }, // Pass the appointment ID in the request params
//       });

//       // Check if the response is successful
//       if (response.status === 200) {
//         const prescriptionDocuments = response.data; // Assuming the response contains the document data
//         console.log(
//           "Prescription documents fetched successfully",
//           prescriptionDocuments
//         );
//         return prescriptionDocuments; // Return the fetched documents
//       } else {
//         console.error("Failed to fetch prescription documents");
//         throw new Error("Failed to fetch prescription documents");
//       }
//     } catch (error) {
//       console.error("Error fetching prescription documents:", error);
//       throw error; // Rethrow the error for further handling if needed
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleDeletePrescriptionDoc = async (docId) => {
//     setLoading(true);
//     try {
//       // Call the DELETE API to remove the document
//       const response = await BaseUrl.delete(
//         `/patient/patientprescriptonfile/`,
//         {
//           data: {
//             document_id: docId, // Ensure this matches the expected field in your backend
//           },
//         }
//       );

//       if (response.status === 200) {
//         // Retrieve the success message from the response if available
//         const successMessage =
//           response.data.success || "Prescription document deleted successfully";
//         setSuccessMessage(successMessage);

//         // Immediately update the frontend to remove the deleted document row
//         setPrescriptionDocuments((prevDocuments) => {
//           // Remove the document that matches the deleted docId
//           return prevDocuments.filter((doc) => doc.id !== docId); // Use the correct id here
//         });

//         // Optionally re-fetch appointments if needed, without re-fetching the documents list
//         await fetchAppointments(receptionId);
//       } else {
//         throw new Error("Failed to delete prescription document");
//       }
//     } catch (error) {
//       console.error("Error deleting prescription document:", error);
//       // Display error message from backend if available, or a default message
//       setErrorMessage(
//         error.response?.data?.error || "An error occurred. Please try again."
//       );
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleDownloadPrescriptionDoc = async (doc) => {
//     setLoading(true)
//     try {
//       const response = await BaseUrl.get(
//         `/patient/patientprescriptonfileView/`,
//         {
//           params: {
//             patient_id: doc.patient,
//             document_id: doc.id,
//           },
//           responseType: "blob", // Ensure it's downloading as a blob
//         }
//       );

//       // Use backend message if available, otherwise provide a default
//       setSuccessMessage(response.data.success);

//       const url = URL.createObjectURL(response.data);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${doc.document_name}.${
//         response.data.type.split("/")[1]
//       }`;
//       link.click();
//     } catch (error) {
//       console.error("Error downloading prescription document:", error);

//       // Use backend error message if available, otherwise provide a default
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handlePrint = async (appointment_id) => {
//     setLoading(true)
//     try {
//       if (!appointment_id) {
//         console.error("No appointment ID selected");
//         setErrorMessage("No appointment ID selected");
//         return;
//       }

//       // Make the GET request to fetch appointment data
//       const response = await BaseUrl.get(`/patient/printrepport/`, {
//         params: {
//           appointment_id: expandedAppointmentId, // Use the dynamically passed appointment_id
//         },
//         responseType: "blob", // Assuming the response might be in PDF/blob format
//       });

//       // Create a blob from the response data
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       // Open the PDF in a new browser tab
//       const newWindow = window.open(url);
//       if (newWindow) {
//         newWindow.focus(); // Focus on the new window (tab)
//       }

//       // Set the success message from the backend response or a default
//       setSuccessMessage(response.data.success);
//     } catch (error) {
//       console.error("Error fetching appointment details:", error);

//       // Set the error message from the backend response or a default
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   // Function to download the appointment data (can modify according to your API)
//   const handleDownload = async (appointment_id) => {
//     try {
//       const response = await BaseUrl.get(`/patient/printrepport/`, {
//         params: {
//           appointment_id: expandedAppointmentId, // Dynamically pass the appointment_id
//         },
//         responseType: "blob", // Assuming the response is a PDF or blob
//       });

//       // Create a blob from the response and download it
//       const blob = new Blob([response.data], { type: "application/pdf" }); // Adjust type if needed
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "AppointmentRecord.pdf"); // Set file name
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading the file:", error);
//     }
//   };

//   const handleUpdate = async () => {
//     setLoading(true);
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );

//       if (!selectedAppointment) {
//         setErrorMessage("Selected appointment not found");
//         console.error("Selected appointment not found");
//         return;
//       }

//       const payload = {
//         appointment_id: selectedAppointment.appointment_id,
//         patient_id: selectedAppointment.patient_id,
//         ...formDetails,
//       };

//       const response = await BaseUrl.put(`/patient/patient/`, payload);

//       if (response.status === 201) {
//         await fetchAppointments(receptionId);

//         // Set the success message from backend response or a default message
//         setSuccessMessage(response.data.success);
//       } else {
//         console.error("Failed to update appointment details");

//         // Set the error message from backend response or a default message
//         setErrorMessage(response.data?.message);
//       }
//     } catch (error) {
//       console.error("Error updating appointment details:", error);

//       // Use the backend error message if available, or a fallback message
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (appointment_id) => {
//     setLoading(true);
//     try {
//       // Make the DELETE request to remove the appointment
//       const response = await BaseUrl.delete(`/doctorappointment/getslot/`, {
//         data: { appointment_id }, // Pass the appointment ID for deletion
//       });

//       if (response.status === 200) {
//         // Fetch the updated appointments after successfully deleting the appointment
//         await fetchAppointments(receptionId); // Fetch updated appointments using receptionId

//         // Use backend message if available, otherwise provide a default message

//         setSuccessMessage(response.data.success);

//         // Optional: You can also perform a redirect here if needed
//         // window.location.href = '/reception/booked-appointments'; // Uncomment if you want to redirect
//       } else {
//         // If the response status is not 200, handle it as an error with backend message
//         throw new Error(response.data?.message);
//       }
//     } catch (error) {
//       console.error("Error deleting appointment:", error);

//       // Use backend error message if available, otherwise provide a default message
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleCancelAppointment = async (appointment_id) => {
//     setLoading(true);
//     try {
//       const response = await BaseUrl.patch(`/doctorappointment/getslot/`, {
//         appointment_id,
//       });

//       if (response.status === 200) {
//         await fetchAppointments(receptionId);

//         // Use the backend message if available, or provide a default message
//         setSuccessMessage(response.data.success);
//       } else {
//         console.error("Failed to cancel appointment");

//         // Use the backend error message if available, or provide a default message
//         setErrorMessage(response.data?.message);
//       }
//     } catch (error) {
//       console.error("Error canceling appointment:", error);

//       // Use the backend error message if available, or provide a default message
//       setErrorMessage(error.response?.data?.error);
//     }

//     finally{
//       setLoading(false)
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
//       { medicine_name: "", time: "", comment: "", description: "" },
//       ...prescriptions,
//     ]);
//   };

//   const removePrescriptionRow = async (index) => {
//     setLoading(true)
//     const prescriptionToDelete = prescriptions[index];

//     // Check if the prescription doesn't have an ID (i.e., it hasn't been submitted to the backend)
//     if (!prescriptionToDelete.id) {
//       console.log("Removing unsaved prescription from frontend");

//       // Remove the prescription row from the state without making an API call
//       const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
//       setPrescriptions(updatedPrescriptions);
//       return; // Exit here since there's no need to call the backend
//     }

//     // If the prescription has been submitted and has an ID, proceed with the DELETE API call
//     try {
//       const prescription_id = prescriptionToDelete.id;

//       const response = await BaseUrl.delete(`/patient/patientpriscription/`, {
//         params: { prescription_id },
//       });

//       if (response.status === 200 || response.status === 204) {
//         // Remove the prescription from the UI
//         const updatedPrescriptions = prescriptions.filter(
//           (_, i) => i !== index
//         );
//         setPrescriptions(updatedPrescriptions);

//         // Use backend message if available, otherwise provide a default message
//         setSuccessMessage(
//           response.data.success || "Prescription removed successfully"
//         );
//       } else {
//         console.error("Failed to remove prescription");

//         // Use backend message if available, otherwise provide a default message
//         setErrorMessage(
//           response.data?.message || "Failed to remove prescription"
//         );
//       }
//     } catch (error) {
//       console.error("Error removing prescription:", error);

//       // Use backend error message if available, otherwise provide a default message
//       setErrorMessage(
//         error.response?.data?.error || "Error removing prescription"
//       );
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const fetchPrescriptions = async (appointment_id, patient_id) => {
//     try {
//       // Make the GET API call to fetch prescriptions for the given appointment and patient
//       const response = await BaseUrl.get("/patient/patientpriscription/", {
//         params: {
//           appointment_id: appointment_id, // Pass the appointment ID
//           patient_id: patient_id, // Pass the patient ID
//         },
//       });

//       if (response.status === 200) {
//         const fetchedPrescriptions = response.data; // Assuming the API returns an array of prescriptions

//         // Update the state with the fetched prescriptions
//         setPrescriptions(fetchedPrescriptions); // Set the fetched prescriptions to state
//       } else {
//         console.error("Failed to fetch prescriptions");
//       }
//     } catch (error) {
//       console.error("Error fetching prescriptions:", error);
//     }
//   };

//   const handlePrescriptionSubmit = async (index) => {
//     setLoading(true);
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );

//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         setErrorMessage("No selected appointment found");
//         return;
//       }

//       const patient_id = selectedAppointment.patient_id;
//       const appointment_id = selectedAppointment.appointment_id;

//       // Get the specific prescription for the current index
//       const prescription = prescriptions[index];

//       // Prepare the payload for the individual prescription
//       const payload = {
//         ...prescription,
//         patient_id: patient_id,
//         appointment_id: appointment_id,
//       };

//       // Make the POST API call to submit the individual prescription
//       const response = await BaseUrl.post("/patient/patientpriscription/", [
//         payload,
//       ]);

//       if (response.status === 201) {
//         // Use backend message if available, otherwise provide a default message
//         setSuccessMessage(response.data.success);

//         // Optionally clear this specific prescription row
//         const updatedPrescriptions = prescriptions.map((prescription, i) =>
//           i === index
//             ? { medicine_name: "", time: "", comment: "", description: "" }
//             : prescription
//         );
//         setPrescriptions(updatedPrescriptions);

//         // Fetch the latest prescriptions after successful submission
//         await fetchPrescriptions(appointment_id, patient_id); // Fetch updated prescriptions
//         await fetchDocumentIds(appointment_id);
//       } else {
//         console.error("Failed to submit prescription");

//         // Use backend message if available, otherwise provide a default message
//         setErrorMessage(response.data?.message);
//       }
//     } catch (error) {
//       console.error("Error submitting prescription:", error);

//       // Use backend error message if available, otherwise provide a default message
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleUpdatePrescription = async (index) => {
//     setLoading(true);
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );

//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         setErrorMessage("No selected appointment found");
//         return;
//       }

//       const patient_id = selectedAppointment.patient_id;
//       const appointment_id = selectedAppointment.appointment_id;

//       // Get the specific prescription for the current index
//       const prescription = prescriptions[index];

//       // Prepare the payload for updating the prescription
//       const payload = {
//         prescription_id: prescription.id, // Required for update
//         patient_id: patient_id, // Required for update
//         appointment_id: appointment_id, // Optional based on backend requirements
//         medicine_name: prescription.medicine_name, // Fields to be updated
//         time: prescription.time,
//         comment: prescription.comment,
//         description: prescription.description,
//       };

//       // Make the PUT API call to update the prescription
//       const response = await BaseUrl.put(
//         "/patient/patientpriscription/",
//         payload
//       ); // No prescription_id in URL

//       if (response.status === 200) {
//         // Use the backend message if available, otherwise provide a default message
//         setSuccessMessage(response.data.success);

//         // Fetch the updated prescriptions after updating
//         await fetchPrescriptions(appointment_id, patient_id);
//       } else {
//         console.error("Failed to update prescription");

//         // Use the backend message if available, otherwise provide a default message
//         setErrorMessage(response.data?.message);
//       }
//     } catch (error) {
//       console.error("Error updating prescription:", error);

//       // Use the backend error message if available, otherwise provide a default message
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
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
//             `/patient/vital/`,
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
//               weight: fetchedData.weight,
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
//         height: "",
//         bmi: "",
//         pulse_rate: "",
//         heart_rate: "",
//         body_temperature: "",
//         appointment_date: "",
//       });
//     }
//   };

//   const handleVitalSubmit = async () => {
//     setLoading(true);
//     try {
//       // Find the selected appointment based on the expanded appointment ID
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );

//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }

//       const patient_id = selectedAppointment.patient_id;
//       const appointment_date = selectedAppointment.appointment_date;

//       // Make the POST API call to submit vitals
//       const postResponse = await BaseUrl.post("/patient/vital/", {
//         patient_id: patient_id,
//         appointment_id: expandedAppointmentId,
//         record_date: appointment_date,
//         blood_pressure: recordDetails.blood_pressure,
//         oxygen_level: recordDetails.oxygen_level,
//         sugar_level: recordDetails.sugar_level,
//         weight: recordDetails.weight,
//         height: recordDetails.height,
//         bmi: recordDetails.bmi,
//         pulse_rate: recordDetails.pulse_rate,
//         heart_rate: recordDetails.heart_rate,
//         body_temperature: recordDetails.body_temperature,
//       });

//       if (postResponse.status === 201) {
//         setErrorMessage("");
//         await fetchAppointments(receptionId); // Fetch updated appointments
//         await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//         setRecordDetails({
//           patient_id: "",
//           blood_pressure: "",
//           oxygen_level: "",
//           sugar_level: "",
//           height: "",
//           weight: "",
//           pulse_rate: "",
//           bmi: "",
//           heart_rate: "",
//           body_temperature: "",
//           appointment_id: "",
//           appointment_date: "",
//         });
//         setSuccessMessage("Vitals submitted successfully");
//         setRecordDetails(recordDetails);
//       } else {
//         setErrorMessage("Failed to submit vitals");
//       }
//     } catch (postError) {
//       console.error("Error submitting vitals:", postError);
//       setErrorMessage("Error submitting vitals");
//       setShowToast(true);
//       setToastMessage("Error submitting vitals.");
//       setToastVariant("danger");
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleVitalUpdate = async () => {
//     setLoading(true)
//     try {
//       // Find the selected appointment based on the expanded appointment ID
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );

//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         setErrorMessage("No selected appointment found");
//         return;
//       }

//       const patient_id = selectedAppointment.patient_id;
//       const appointment_id = selectedAppointment.appointment_id;

//       // Prepare the payload for updating the vitals
//       const payload = {
//         blood_pressure: recordDetails.blood_pressure,
//         oxygen_level: recordDetails.oxygen_level,
//         body_temperature: recordDetails.body_temperature,
//         heart_rate: recordDetails.heart_rate,
//         pulse_rate: recordDetails.pulse_rate,
//         sugar_level: recordDetails.sugar_level,
//         weight: recordDetails.weight,
//         bmi: recordDetails.bmi,
//         height: recordDetails.height,
//         patient_id: patient_id,
//         appointment_id: appointment_id, // Include appointment_id in payload
//       };

//       // Make the PUT API call to update the vitals
//       const response = await BaseUrl.put(`/patient/vital/`, payload);

//       if (response.status === 200) {
//         // Use the backend message if available, otherwise provide a default message
//         setSuccessMessage(response.data.success);
//       } else {
//         console.error("Failed to update vitals");

//         // Use backend message if available, otherwise provide a default message
//         setErrorMessage(response.data?.message);
//       }
//     } catch (error) {
//       console.error("Error updating vitals:", error);

//       // Use backend error message if available, otherwise provide a default message
//       setErrorMessage(error.response?.data?.error);
//     }
//     finally{
//       setLoading(false)
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
//     setLoading(true);
//     // Check if the symptom has not been saved yet (i.e., no `id`)
//     if (!symptom.id) {
//       console.log("Unsaved symptom, removing from frontend state:", symptom);

//       // Remove the unsaved row directly from the state without making an API call
//       setSelectedSymptoms((prevSymptoms) =>
//         prevSymptoms.filter((s) => s !== symptom)
//       );

//       // Early exit for unsaved symptoms, no need to proceed with API call
//       return;
//     }

//     try {
//       // Make an API call to delete the saved symptom
//       const response = await BaseUrl.delete(`/doctor/symptomsdetail/`, {
//         data: {
//           appointment_id: expandedAppointmentId, // Send the current expanded appointment ID
//           symptoms_id: symptom.symptoms, // Send the unique ID of the symptom to delete
//         },
//       });

//       if (response.status === 200) {
//         console.log(
//           "Saved symptom deleted from backend and frontend:",
//           symptom
//         );

//         // Remove the saved symptom from the state
//         setSelectedSymptoms((prevSymptoms) =>
//           prevSymptoms.filter((s) => s.id !== symptom.id)
//         );
//         setSuccessMessage(response.data.success);
//       } else {
//         const errorMessage =
//           response.data?.message || "Failed to delete symptom";
//         console.error(errorMessage, symptom);
//         setErrorMessage(errorMessage);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "An error occurred.";
//       console.error("Error deleting symptom:", error.response?.data?.error);
//       setErrorMessage(errorMessage);
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleSaveSymptoms = async () => {
//     setLoading(true)
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

//       let successCount = 0; // Counter to track the number of successful saves

//       for (let i = 0; i < selectedSymptoms.length; i++) {
//         const symptom = selectedSymptoms[i];
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

//           if (response.status === 200 || response.status === 201) {
//             successCount++; // Increment success counter
//             const successMessage = response.data.success;
//             console.log(successMessage); // Log the success message

//             // Store the returned id in the symptom object for future updates
//             selectedSymptoms[i].id = response.data.data.id;
//           } else {
//             const errorMessage =
//               response.data?.message || "Failed to save symptom";
//             console.error(errorMessage, symptom);
//           }
//         } catch (error) {
//           const errorMessage = error.response?.data?.error;
//           console.error("Error saving symptom:", errorMessage);
//         }
//       }

//       if (successCount > 0) {
//         setSuccessMessage(
//           `${successCount} symptom(s) details saved successfully`
//         );
//       } else {
//         setErrorMessage("No symptoms details were saved");
//       }

//       await fetchAppointments(receptionId); // Fetch updated appointments
//       await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//     } catch (error) {
//       console.error("Error saving symptoms:", error);
//       setErrorMessage("An error occurred while saving symptoms");
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   const handleUpdateSymptom = async () => {
//     setLoading(true);
//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === expandedAppointmentId
//       );

//       if (!selectedAppointment) {
//         console.error("No selected appointment found");
//         return;
//       }

//       const appointment_id = expandedAppointmentId;

//       let successCount = 0; // Counter to track the number of successful updates

//       for (const symptom of selectedSymptoms) {
//         const symptomPayload = {
//           symptoms_id: symptom.id, // Use the stored id from the POST response
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

//           if (response.status === 200 || response.status === 201) {
//             successCount++; // Increment success counter
//             const successMessage = response.data.success;
//             console.log(successMessage);
//           } else {
//             const errorMessage =
//               response.data?.message || "Failed to update symptom";
//             console.error(errorMessage, symptom);
//           }
//         } catch (error) {
//           const errorMessage = error.response?.data?.error;
//           console.error("Error updating symptom:", errorMessage);
//         }
//       }

//       if (successCount > 0) {
//         setSuccessMessage(`${successCount} symptom(s) updated successfully`);
//       } else {
//         setErrorMessage("No symptoms were updated");
//       }

//       await fetchAppointments(receptionId); // Fetch updated appointments
//       await fetchMedicalRecords(expandedAppointmentId); // Fetch updated medical records
//     } catch (error) {
//       console.error("Error updating symptoms:", error);
//     }
//     finally{
//       setLoading(false)
//     }
//   };

//   // Add this function to handle input changes in forms
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Validation for the 'name' field to accept only alphabetic characters and spaces
//     if (name === "name" && /[^a-zA-Z\s]/.test(value)) {
//       return; // Ignore the event if invalid characters are typed
//     }

//     // Enhanced validation for the 'mobile_number' field
//     if (name === "mobile_number") {
//       // Allow only numeric input and limit to 10 digits
//       const newValue = value.replace(/[^\d]/g, "").substring(0, 10); // Remove non-digits and limit length
//       setFormDetails((prevDetails) => ({
//         ...prevDetails,
//         [name]: newValue,
//       }));
//       return; // Prevent default processing and further propagation of the input event
//     }

//     // Validation for the 'age' field to accept only numeric input and limit to 150
//     if (name === "age") {
//       const numericValue = parseInt(value, 10);
//       if (/[^0-9]/.test(value) || numericValue > 150) {
//         return; // Ignore the event if non-numeric characters are entered or age exceeds 150
//       }
//     }

//     // Update the form details for all other inputs
//     setFormDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };

//   const handleTimeSelection = (e, index, timeSlot) => {
//     const updatedPrescriptions = prescriptions.map((prescription, i) => {
//       if (i === index) {
//         let updatedTime;
//         if (e.target.checked) {
//           updatedTime = [...prescription.time, timeSlot]; // Add the selected time slot
//         } else {
//           updatedTime = prescription.time.filter((time) => time !== timeSlot); // Remove the deselected time slot
//         }
//         return { ...prescription, time: updatedTime };
//       }
//       return prescription;
//     });
//     setPrescriptions(updatedPrescriptions);
//   };

//   const handlePrescriptionDocs = async (appointment_id) => {
//     setLoading(true);
//     if (!selectedFile) {
//       console.error("No file selected for upload");
//       return;
//     }

//     try {
//       const selectedAppointment = appointments.find(
//         (appointment) => appointment.appointment_id === appointment_id
//       );

//       if (!selectedAppointment) {
//         console.error("Appointment not found");
//         throw new Error("Appointment not found");
//       }

//       const appointment_date = selectedAppointment.appointment_date;

//       const formData = new FormData();
//       formData.append("document_file", selectedFile);
//       formData.append("document_date", appointment_date);
//       formData.append("appointment", appointment_id);

//       const response = await BaseUrl.post(
//         `/patient/patientprescriptonfile/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         // Retrieve the success message from the response if available
//         const successMessage =
//           response.data.success ||
//           "Prescription document uploaded successfully";
//         setSuccessMessage(successMessage);

//         // Add the newly uploaded document to the state
//         setPrescriptionDocuments((prevDocuments) => [
//           ...prevDocuments,
//           response.data,
//         ]);
//         setShowPrescriptionDocsForm(false);

//         // Optionally, re-fetch documents or other data as a backup
//         const updatedDocuments =
//           await fetchPrescriptionDocuments(appointment_id);
//         setPrescriptionDocuments(updatedDocuments); // Update with the full list
//         await fetchMedicalRecords(appointment_id);
//         await fetchAppointments(receptionId);
//       } else {
//         const errorMessage =
//           response.data.error || "Failed to upload prescription document";
//         console.error(errorMessage);
//         setErrorMessage(errorMessage);
//       }
//     } catch (error) {
//       console.error("Error uploading prescription document:", error);
//       setErrorMessage(
//         error.response?.data?.error || "Error uploading prescription document"
//       );
//     } finally {
//       setSelectedFile(null); // Reset file selection
//     }

//       setLoading(false)

//   };
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams((prevParams) => ({
//       ...prevParams,
//       [name]: value,
//     }));
//   };

//   // Function to reset the page to default content
//   const resetToDefault = () => {
//     setIsSearching(false);
//     // Logic to restore the default page content
//     // Set the default content back to what it was originally
//   };

//   // Debounced search function
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchParams.booked_by) {
//         // Trigger search only if there is a search value
//         handleSearch();
//       } else {
//         // If input is empty, reset to the default content
//         resetToDefault();
//       }
//     }, 500); // 500ms debounce

//     return () => clearTimeout(delayDebounceFn); // Cleanup the timeout
//   }, [searchParams.booked_by]); // Only run the effect when searchParams.booked_by changes

//   // Function to handle search API call
//   const handleSearch = async () => {
//     setIsSearching(true); // Optional: Set loading state
//     try {
//       const response = await BaseUrl.get("/reception/receptionsearch/", {
//         params: {
//           reception_id: receptionId,
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
//         status: appointment.is_canceled
//           ? "Canceled"
//           : appointment.is_complete
//             ? "Completed"
//             : "Upcoming",
//       }));

//       setAppointments(fetchedAppointments);
//       setErrorMessage(""); // Clear error message if appointments are found
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//       setErrorMessage("No appointments found");
//       setAppointments([]); // Clear appointments list if an error occurs
//     } finally {
//       setIsSearching(false); // Optional: Remove loading state
//     }
//   };

//   // const handleSearch = async () => {
//   //   setIsSearching(true); // Optional: Set loading state
//   //   try {
//   //     const response = await BaseUrl.get("/reception/receptionsearch/", {
//   //       params: {
//   //         reception_id: receptionId,
//   //         query: searchParams.booked_by,
//   //       },
//   //     });
//   //     // Handle the response data
//   //     console.log(response.data);
//   //   } catch (error) {
//   //     console.error("Error fetching search results:", error);
//   //   } finally {
//   //     setIsSearching(false); // Optional: Remove loading state
//   //   }
//   // };

//   return (
//     <Container fluid>
//       {errorMessage && (
//         <div className="alert alert-danger" role="alert">
//           {errorMessage}
//         </div>
//       )}
//            {loading && (
//         <LoaderWrapper>
//           <LoaderImage>
//             <Loader
//               type="spinner-circle"
//               bgColor="#0091A5"
//               color="#0091A5"
//               title="Loading..."
//               size={100}
//             />
//           </LoaderImage>
//         </LoaderWrapper>
//       )}

//       <div className="mb-3">
//         <Card
//           className="shadow-sm mb-3"
//           style={{
//             borderRadius: "15px",
//             border: " #0091A5",
//             background: "#0091A5",
//           }}
//         >
//           <Card.Body>
//             <h5
//               className="card-title mb-4"
//               style={{
//                 color: "#003366", // Text color
//                 fontFamily: "Sans-Serif", // Font family
//               }}
//             >
//               Search Appointments
//             </h5>

//             <Form
//               onSubmit={(e) => {
//                 e.preventDefault(); // Prevent page reload on Enter
//                 handleSearch(); // Execute search manually if button is pressed
//               }}
//             >
//               <Form.Group
//                 className="form-group-responsive"
//                 style={{
//                   maxWidth: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   margin: "0 auto",
//                   padding: "0 20px",
//                 }}
//               >
//                 <label
//                   htmlFor="booked_by"
//                   style={{
//                     marginBottom: "0",
//                     marginRight: "10px",
//                     flexShrink: 0,
//                     whiteSpace: "nowrap",
//                   }}
//                 ></label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="booked_by"
//                   name="booked_by"
//                   value={searchParams.booked_by}
//                   onChange={handleSearchChange}
//                   placeholder="Date/Time Slot/Doctor/Booked By/Mobile Number"
//                   style={{
//                     border: "2px solid #007bff",
//                     borderTopLeftRadius: "5px",
//                     borderBottomLeftRadius: "5px",
//                     height: "38px",
//                     flex: 1,
//                     marginRight: "-1px",
//                   }}
//                 />
//                 <Button
//                   onClick={handleSearch}
//                   type="submit"
//                   className="search-button"
//                   style={{
//                     borderTopRightRadius: "5px",
//                     borderBottomRightRadius: "5px",
//                     height: "40px",
//                     width: "80px",
//                     backgroundColor: "#0166CB",
//                     color: "white",
//                     border: "2px solid #007bff",
//                     paddingLeft: "12px",
//                     paddingRight: "12px",
//                   }}
//                 >
//                   {isSearching ? "Searching..." : "Search"}
//                 </Button>
//               </Form.Group>
//             </Form>

//           </Card.Body>
//         </Card>
//       </div>

//   <Card
//         className="shadow-sm"
//         style={{
//           borderRadius: "15px",
//           border: " #0091A5",
//           background: "#0091A5",
//         }}
//       >
//         {/* Success/Error Modal */}
//         <Modal
//           show={!!errorMessage || !!successMessage}
//           onHide={handleCloseMessageModal}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>{errorMessage ? "Error" : "Success"}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <p>{errorMessage || successMessage}</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="primary" onClick={handleCloseMessageModal}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//         <Card.Body>
//           <h5
//             className="card-title mb-4"
//             style={{
//               color: "#ffffff", // Text color
//               fontFamily: "Sans-Serif", // Font family
//             }}
//           >
//             Booked Appointments
//           </h5>

//           <Table className="table table-hover">
//             <thead className="table-light">
//               <tr>
//                 <th
//                   style={{
//                     background: "#D7EAF0", // Background color
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Date
//                 </th>
//                 <th
//                   style={{
//                     background: "#D7EAF0",
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Time Slot
//                 </th>
//                 <th
//                   style={{
//                     background: "#D7EAF0",
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Doctor
//                 </th>
//                 <th
//                   style={{
//                     background: "#D7EAF0",
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Booked By
//                 </th>
//                 <th
//                   style={{
//                     background: "#D7EAF0",
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Status
//                 </th>
//                 <th
//                   style={{
//                     background: "#D7EAF0",
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Mobile Number
//                 </th>
//                 <th
//                   style={{
//                     background: "#D7EAF0",
//                     color: "#003366", // Text color
//                   }}
//                 >
//                   Actions
//                 </th>
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
//                     <td>{appointment.status}</td>
//                     <td>{appointment.mobile_number}</td>
//                     <td>

//                       {expandedAppointmentId === appointment.appointment_id ? (
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
//                       <td colSpan="7">
//                         <Card
//                           className="shadow-sm mt-3"
//                           style={{
//                             borderRadius: "15px",
//                             border: " #0091A5",
//                             background: "#0091A5",
//                           }}
//                         >
//                           <Card.Body
//                             style={{
//                               position: "relative", // Allows absolute positioning within the Card
//                             }}
//                           >
//                             {/* Container for Heading and Print Button */}
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "flex-start", // Aligns items to the left
//                                 padding: "10px 20px", // Adds padding around the content
//                               }}
//                             >
//                               <h5
//                                 style={{
//                                   fontWeight: "600",
//                                   fontSize: "40px",
//                                   color: "#ffffff",
//                                   fontFamily: "Sans-Serif",
//                                   lineHeight: "46.88px",
//                                   margin: "0px", // Removes margin to keep elements close
//                                   textAlign: "left",
//                                 }}
//                               >
//                                 Patient Details
//                               </h5>
//                               <Button
//                                 style={{
//                                   marginLeft: "20px", // Space from heading
//                                   backgroundColor: "#0166CB", // Button color
//                                   color: "#ffffff", // Text color
//                                   border: "none", // No border
//                                   borderRadius: "5px", // Rounded corners
//                                   padding: "10px 20px", // Padding
//                                   cursor: "pointer", // Pointer cursor on hover
//                                 }}
//                                 onClick={handlePrint}
//                               >
//                                 Print
//                               </Button>
//                             </div>

//                             {/* Update Button in Top Right Corner */}
//                             <Button
//                               style={{
//                                 position: "absolute", // Absolute positioning within the card
//                                 top: "10px", // Distance from the top of the Card
//                                 right: "10px", // Distance from the right of the Card
//                                 backgroundColor: "#0166CB", // Bootstrap primary color
//                                 color: "#ffffff", // Text color
//                                 border: "none", // No border
//                                 borderRadius: "5px", // Rounded corners
//                                 padding: "10px 20px", // Padding
//                                 cursor: "pointer", // Pointer cursor on hover
//                               }}
//                               onClick={handleUpdate}
//                             >
//                               Update
//                             </Button>

//                             <Form>
//                               <Row className="mb-3">
//                                 {/* Adjust column sizes for better spacing */}
//                                 <Col sm={6} md={4}>
//                                   <Form.Group
//                                     controlId="formName"
//                                     className="mb-3"
//                                   >
//                                     <Form.Label
//                                       style={{
//                                         color: "#003366", // Text color
//                                         fontFamily: "Sans-Serif", // Font family
//                                         fontSize: "25px", // Font size
//                                         fontWeight: 600, // Font weight
//                                         lineHeight: "29.3px", // Line height
//                                         textAlign: "left", // Left align the label
//                                         width: "100%", // Make sure label takes full width
//                                       }}
//                                     >
//                                       Name
//                                     </Form.Label>

//                                     <Form.Control
//                                       type="text"
//                                       name="name"
//                                       value={formDetails.name || ""}
//                                       onChange={handleInputChange}
//                                       style={{
//                                         textAlign: "left", // Ensure the input text is left-aligned
//                                       }}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col sm={6} md={4}>
//                                   <Form.Group
//                                     controlId="formMobileNumber"
//                                     className="mb-3"
//                                   >
//                                     <Form.Label
//                                       style={{
//                                         color: "#003366", // Text color (adjust to the desired color)
//                                         fontFamily: "Sans-Serif", // Font family
//                                         fontSize: "25px", // Font size
//                                         fontWeight: 600, // Font weight
//                                         lineHeight: "29.3px", // Line height
//                                         textAlign: "left", // Left align the label
//                                         width: "100%", // Ensure label takes full width
//                                       }}
//                                     >
//                                       Mobile Number
//                                     </Form.Label>

//                                     <Form.Control
//                                       type="text"
//                                       name="mobile_number"
//                                       value={formDetails.mobile_number || ""}
//                                       onChange={handleInputChange}
//                                       style={{
//                                         textAlign: "left", // Ensure input text is left-aligned
//                                       }}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col sm={6} md={4}>
//                                   <Form.Group
//                                     controlId="formAge"
//                                     className="mb-3"
//                                   >
//                                     <Form.Label
//                                       style={{
//                                         color: "#003366", // Text color (adjusted to match the previous examples)
//                                         fontFamily: "Sans-Serif", // Font family
//                                         fontSize: "25px", // Font size
//                                         fontWeight: 600, // Font weight for boldness
//                                         lineHeight: "29.3px", // Line height for proper spacing
//                                         textAlign: "left", // Align text to the left
//                                         width: "100%", // Ensure the label takes full width
//                                       }}
//                                     >
//                                       Age
//                                     </Form.Label>

//                                     <Form.Control
//                                       type="text"
//                                       name="age"
//                                       value={formDetails.age || ""}
//                                       onChange={handleInputChange}
//                                       style={{
//                                         textAlign: "left", // Ensure the input text is left-aligned
//                                       }}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col sm={6} md={4}>
//                                   <Form.Group
//                                     controlId="formGender"
//                                     className="mb-3"
//                                   >
//                                     <Form.Label
//                                       style={{
//                                         color: "#003366", // Text color (adjusted to match other fields)
//                                         fontFamily: "Sans-Serif", // Font family
//                                         fontSize: "25px", // Font size
//                                         fontWeight: 600, // Bold font weight
//                                         lineHeight: "29.3px", // Line height for proper spacing
//                                         textAlign: "left", // Align text to the left
//                                         width: "100%", // Ensure the label takes full width
//                                       }}
//                                     >
//                                       Gender
//                                     </Form.Label>

//                                     <Form.Control
//                                       type="text"
//                                       name="gender"
//                                       value={formDetails.gender || ""}
//                                       onChange={handleInputChange}
//                                       style={{
//                                         textAlign: "left", // Ensure the input text is left-aligned
//                                       }}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                                 <Col sm={6} md={4}>
//                                   <Form.Group
//                                     controlId="formAddress"
//                                     className="mb-3"
//                                   >
//                                     <Form.Label
//                                       style={{
//                                         color: "#003366", // Text color (adjusted to match other fields)
//                                         fontFamily: "Sans-Serif", // Font family
//                                         fontSize: "25px", // Font size
//                                         fontWeight: 600, // Bold font weight
//                                         lineHeight: "29.3px", // Line height for proper spacing
//                                         textAlign: "left", // Align text to the left
//                                         width: "100%", // Ensure the label takes full width
//                                       }}
//                                     >
//                                       Address
//                                     </Form.Label>

//                                     <Form.Control
//                                       type="text"
//                                       name="address"
//                                       value={formDetails.address || ""}
//                                       onChange={handleInputChange}
//                                       style={{
//                                         textAlign: "left", // Ensure the input text is left-aligned
//                                       }}
//                                     />
//                                   </Form.Group>
//                                 </Col>
//                               </Row>
//                               {/* Center buttons */}
//                               <div className="d-flex justify-content-center gap-2">
//                                 {/* <Button
//                                   variant="primary"
//                                   onClick={handleUpdate}
//                                 >
//                                   Update
//                                 </Button> */}
//                                 <Button
//                                   style={{
//                                     backgroundColor: "#0166CB", // Setting the background color to the same blue
//                                     color: "#FFFFFF", // White text for readability
//                                     border: "none", // Removing default border
//                                     borderRadius: "5px", // Rounded corners for a smooth look
//                                     padding: "10px 20px", // Adequate padding for content spacing
//                                     cursor: "pointer", // Cursor changes to pointer on hover to indicate clickable area
//                                   }}
//                                   onClick={() =>
//                                     handleDelete(appointment.appointment_id)
//                                   }
//                                 >
//                                   Delete
//                                 </Button>

//                                 <Button
//                                   style={{
//                                     backgroundColor: "#0166CB", // Setting the background color
//                                     color: "#FFFFFF", // Ensuring text color is white for readability
//                                     border: "none", // No border for a cleaner look
//                                     borderRadius: "5px", // Rounded corners for aesthetics
//                                     padding: "10px 20px", // Padding for better text spacing
//                                     cursor: "pointer", // Cursor change on hover to indicate it's clickable
//                                   }}
//                                   onClick={() =>
//                                     handleCancelAppointment(
//                                       appointment.appointment_id
//                                     )
//                                   }
//                                 >
//                                   Cancel Appointment
//                                 </Button>
//                               </div>
//                               <div className="d-flex justify-content-end mt-4">
//                                 {/* <Button
//                                   variant="outline-secondary"
//                                   className="me-2"
//                                   onClick={handlePrint}
//                                 >
//                                   Print
//                                 </Button> */}
//                               </div>
//                             </Form>
//                           </Card.Body>
//                         </Card>
//                       </td>
//                     </tr>
//                   )}

//                 {showSymptomsForm &&
//                     expandedAppointmentId === appointment.appointment_id && (
//                       <tr>
//                         <td colSpan="7">
//                           <Card
//                             className="shadow-sm mt-3"
//                             style={{
//                               borderRadius: "15px",
//                               border: "#0091A5",
//                               background: "#0091A5",
//                             }}
//                           >
//                             <Card.Body style={{ position: "relative" }}>
//                               {/* Container for Heading, Search Bar, and Update Button */}
//                               <div
//                                 className="symptoms-header"
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "flex-start",
//                                   padding: "10px 20px",
//                                 }}
//                               >
//                                 <h5
//                                   style={{
//                                     fontWeight: "600",
//                                     fontSize: "40px",
//                                     color: "#ffffff",
//                                     fontFamily: "Sans-Serif",
//                                     lineHeight: "46.88px",
//                                     margin: "0px 20px 0px 0px",
//                                     textAlign: "left",
//                                   }}
//                                 >
//                                   Symptoms
//                                 </h5>
//                                 <Form.Control
//                                   type="text"
//                                   placeholder="Search symptoms"
//                                   value={searchSymptom}
//                                   onChange={handleSymptomSearch}
//                                   style={{
//                                     width: "300px",
//                                     margin: "0px",
//                                   }}
//                                 />
//                                 <Button
//                                   style={{
//                                     marginLeft: "auto",
//                                     backgroundColor: "#0166CB",
//                                     color: "#ffffff",
//                                     border: "none",
//                                     borderRadius: "5px",
//                                     padding: "10px 20px",
//                                     cursor: "pointer",
//                                   }}
//                                   onClick={handleUpdateSymptom}
//                                 >
//                                   Update Symptoms
//                                 </Button>
//                               </div>

//                               <Form>
//                                 <Row className="mb-3">
//                                   <Col xs={12}>
//                                     {searchResults.length > 0 && (
//                                       <ul className="list-group mt-2">
//                                         {searchResults.map((symptom, index) => (
//                                           <li
//                                             key={index}
//                                             className="list-group-item"
//                                             onClick={() =>
//                                               handleAddSymptom({
//                                                 id: symptom.id,
//                                                 symptoms_name:
//                                                   symptom.symptoms_name,
//                                                 severity: "",
//                                               })
//                                             }
//                                             style={{ cursor: "pointer" }}
//                                           >
//                                             {symptom.symptoms_name}
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     )}
//                                   </Col>
//                                 </Row>

//                                 <Table striped bordered hover>
//                                   <thead className="table-light">
//                                     <tr>
//                                       <th
//                                         style={{
//                                           fontFamily: "sans-serif",
//                                           backgroundColor: "#D7EAF0",
//                                           color: "#003366",
//                                         }}
//                                       >
//                                         Symptom
//                                       </th>
//                                       <th
//                                         style={{
//                                           fontFamily: "sans-serif",
//                                           backgroundColor: "#D7EAF0",
//                                           color: "#003366",
//                                         }}
//                                       >
//                                         Severity
//                                       </th>
//                                       <th
//                                         style={{
//                                           fontFamily: "sans-serif",
//                                           backgroundColor: "#D7EAF0",
//                                           color: "#003366",
//                                         }}
//                                       >
//                                         Since
//                                       </th>
//                                       <th
//                                         style={{
//                                           fontFamily: "sans-serif",
//                                           backgroundColor: "#D7EAF0",
//                                           color: "#003366",
//                                         }}
//                                       >
//                                         More Options
//                                       </th>
//                                       <th
//                                         style={{
//                                           fontFamily: "sans-serif",
//                                           backgroundColor: "#D7EAF0",
//                                           color: "#003366",
//                                         }}
//                                       >
//                                         Actions
//                                       </th>
//                                     </tr>
//                                   </thead>

//                                   <tbody>
//                                     {selectedSymptoms.map((symptom, index) => (
//                                       <tr key={index}>
//                                         <td>{symptom.symptoms_name}</td>
//                                         <td>
//                                           <Form.Select
//                                             name={`severity-${index}`}
//                                             value={symptom.severity}
//                                             onChange={(e) =>
//                                               handleSeverityChange(index, e)
//                                             }
//                                           >
//                                             <option value="">
//                                               Select Severity
//                                             </option>
//                                             <option value="mild">Mild</option>
//                                             <option value="moderate">
//                                               Moderate
//                                             </option>
//                                             <option value="severe">
//                                               Severe
//                                             </option>
//                                           </Form.Select>
//                                         </td>
//                                         <td>
//                                           <Form.Control
//                                             type="text"
//                                             name={`since-${index}`}
//                                             value={symptom.since}
//                                             onChange={(e) =>
//                                               handleSinceChange(index, e)
//                                             }
//                                           />
//                                         </td>
//                                         <td>
//                                           <Form.Control
//                                             type="text"
//                                             name={`more_options-${index}`}
//                                             value={symptom.more_options}
//                                             onChange={(e) =>
//                                               handleMoreOptionsChange(index, e)
//                                             }
//                                           />
//                                         </td>
//                                         <td>
//                                           <Button
//                                             style={{
//                                               backgroundColor: "#0166CB",
//                                               color: "#FFFFFF",
//                                               border: "none",
//                                               borderRadius: "5px",
//                                               padding: "10px 20px",
//                                               cursor: "pointer",
//                                             }}
//                                             onClick={() =>
//                                               handleRemoveSymptom(symptom)
//                                             }
//                                           >
//                                             Remove
//                                           </Button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </Table>
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                   }}
//                                 >
//                                   <Button
//                                     variant="primary"
//                                     onClick={handleSaveSymptoms}
//                                     style={{
//                                       background: "#0166CB",
//                                       border: "none",
//                                       width: "74.05px",
//                                       height: "36px",
//                                     }}
//                                   >
//                                     Save
//                                   </Button>
//                                 </div>
//                               </Form>
//                             </Card.Body>
//                           </Card>
//                         </td>
//                       </tr>
//                     )}

//                 {showVitalForm &&
//                     expandedAppointmentId === appointment.appointment_id && (
//                       <tr>
//                         <td colSpan="7">
//                           <Card
//                             className="shadow-sm mt-3"
//                             style={{
//                               borderRadius: "15px",
//                               border: " #0091A5",
//                               background: "#0091A5",
//                             }}
//                           >
//                             <Card.Body
//                               style={{
//                                 position: "relative", // Allows absolute positioning within the Card
//                               }}
//                             >
//                               {/* Flexbox container for heading and alignment */}
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "flex-start", // Align items to the left
//                                   padding: "10px 20px", // Adds padding around the content
//                                 }}
//                               >
//                                 <h5
//                                   style={{
//                                     fontWeight: "600",
//                                     fontSize: "40px", // Matches font size of "Symptoms" heading
//                                     color: "#ffffff",
//                                     fontFamily: "Sans-Serif", // Matches font family
//                                     lineHeight: "46.88px", // Matches line height
//                                     margin: "0px", // Removes margin to keep elements close
//                                     textAlign: "left", // Align heading to the left
//                                   }}
//                                 >
//                                   Patient Vitals
//                                 </h5>
//                               </div>

//                               {/* Update button in top right corner */}
//                               <Button
//                                 style={{
//                                   position: "absolute", // Absolute positioning within the card
//                                   top: "10px", // Distance from the top of the Card
//                                   right: "10px", // Distance from the right of the Card
//                                   backgroundColor: "#0166CB", // Bootstrap primary color
//                                   color: "#ffffff", // Text color
//                                   border: "none", // No border
//                                   borderRadius: "5px", // Rounded corners
//                                   padding: "10px 20px", // Padding
//                                   cursor: "pointer", // Pointer cursor on hover
//                                 }}
//                                 onClick={handleVitalUpdate}
//                               >
//                                 Update Vitals
//                               </Button>

//                               {/* Table for Vitals */}
//                               <Table
//                                 bordered
//                                 hover
//                                 responsive
//                                 className="table-sm"
//                                 style={{ fontSize: "0.9rem" }}
//                               >
//                                 <thead>
//                                   <tr>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Blood Pressure
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Oxygen Level
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Body Temp.
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Heart Rate
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Pulse Rate
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Sugar Level
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Height (cm)
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       Weight (kg)
//                                     </th>
//                                     <th
//                                       style={{
//                                         fontFamily: "sans-serif",
//                                         backgroundColor: "#D7EAF0",
//                                         color: "#003366", // Applying text color
//                                       }}
//                                     >
//                                       BMI
//                                     </th>
//                                   </tr>
//                                 </thead>

//                                 <tbody>
//                                   <tr>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="blood_pressure"
//                                         value={recordDetails.blood_pressure}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="oxygen_level"
//                                         value={recordDetails.oxygen_level}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="body_temperature"
//                                         value={recordDetails.body_temperature}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="heart_rate"
//                                         value={recordDetails.heart_rate}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="pulse_rate"
//                                         value={recordDetails.pulse_rate}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="sugar_level"
//                                         value={recordDetails.sugar_level}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="height"
//                                         value={recordDetails.height || ""}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="weight"
//                                         value={recordDetails.weight || ""}
//                                         onChange={handleVitalChange}
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                     <td>
//                                       <Form.Control
//                                         type="text"
//                                         name="bmi"
//                                         value={recordDetails.bmi || ""}
//                                         readOnly // BMI is calculated automatically
//                                         style={{ padding: "5px" }}
//                                       />
//                                     </td>
//                                   </tr>
//                                 </tbody>
//                               </Table>

//                               {/* Action buttons */}
//                               <div
//                                 style={{
//                                   display: "flex", // Flexbox layout
//                                   justifyContent: "center", // Center horizontally
//                                   alignItems: "center", // Center vertically (optional)
//                                 }}
//                               >
//                                 <Button
//                                   variant="primary"
//                                   onClick={handleVitalSubmit}
//                                   className="me-2"
//                                   style={{
//                                     background: "#0166CB", // Set the background color to #0166CB
//                                     border: "none", // Optional: Remove any border if needed
//                                   }}
//                                 >
//                                   Submit
//                                 </Button>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </td>
//                       </tr>
//                     )}

//                   {showPrescriptionForm &&
//                     expandedAppointmentId === appointment.appointment_id && (
//                       <tr>
//                         <td colSpan="7">
//                           <Card
//                             className="shadow-sm mt-3"
//                             style={{
//                               borderRadius: "15px",
//                               border: " #0091A5",
//                               background: "#0091A5",
//                             }}
//                           >
//                             <Card.Body style={{ position: "relative" }}>
//                               {/* Container for Heading, Add Prescription, and Upload Prescription Buttons */}
//                               <div
//                                 className="prescription-header"
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "flex-start",
//                                   padding: "10px 20px",
//                                 }}
//                               >
//                                 <h5
//                                   style={{
//                                     fontWeight: "600",
//                                     fontSize: "40px",
//                                     color: "#ffffff",
//                                     fontFamily: "Sans-Serif",
//                                     lineHeight: "46.88px",
//                                     margin: "0px",
//                                     textAlign: "left",
//                                   }}
//                                 >
//                                   Prescription
//                                 </h5>
//                                 <Button
//                                   variant="success"
//                                   className="ms-3"
//                                   onClick={addPrescriptionRow}
//                                   style={{
//                                     backgroundColor: "#00DAF7",
//                                     color: "#003366",
//                                     border: "none",
//                                     borderRadius: "5px",
//                                     padding: "10px 20px",
//                                     cursor: "pointer",
//                                   }}
//                                 >
//                                   Add Prescription
//                                 </Button>
//                                 <div className="upload-prescription-wrapper">
//                                   <Button
//                                     variant="outline-primary"
//                                     style={{
//                                       position: "absolute", // Position the button absolutely
//                                       top: "10px", // Distance from the top of the Card
//                                       right: "10px", // Distance from the right side of the Card
//                                       background: "#0166CB",
//                                       color: "#ffffff",
//                                       border: "none",
//                                       borderRadius: "5px",
//                                       padding: "10px 20px",
//                                       cursor: "pointer", // Pointer cursor for interactivity
//                                     }}
//                                     onClick={() => {
//                                       setIsPrescriptionDocs(true);
//                                       setShowPrescriptionDocsForm(true);
//                                     }}
//                                   >
//                                     Upload Prescription
//                                   </Button>
//                                 </div>
//                               </div>

//                               {/* Prescription Form */}
//                               <Form>
//                                 {prescriptions.map((prescription, index) => (
//                                   <Row className="mb-3" key={index}>
//                                     <Col>
//                                       <Form.Group
//                                         controlId={`formMedicineName${index}`}
//                                       >
//                                         <Form.Label
//                                           style={{
//                                             color: "#003366",
//                                             fontFamily: "Sans-Serif",
//                                             fontSize: "25px",
//                                             fontWeight: 600,
//                                             lineHeight: "29.3px",
//                                             textAlign: "left",
//                                             width: "186px",
//                                             height: "40px",
//                                             opacity: 1,
//                                           }}
//                                         >
//                                           Medicine Name
//                                         </Form.Label>
//                                         <Form.Control
//                                           type="text"
//                                           name="medicine_name"
//                                           value={prescription.medicine_name}
//                                           onChange={(e) =>
//                                             handlePrescriptionChange(index, e)
//                                           }
//                                         />
//                                       </Form.Group>
//                                     </Col>
//                                     <Col>
//                                       <Form.Group
//                                         controlId={`formComment${index}`}
//                                       >
//                                         <Form.Label
//                                           style={{
//                                             color: "#003366",
//                                             fontFamily: "Sans-Serif",
//                                             fontSize: "25px",
//                                             fontWeight: 600,
//                                             lineHeight: "29.3px",
//                                             textAlign: "left",
//                                             width: "186px",
//                                             height: "40px",
//                                             opacity: 1,
//                                           }}
//                                         >
//                                           Precautions
//                                         </Form.Label>
//                                         <Form.Control
//                                           type="text"
//                                           name="comment"
//                                           value={prescription.comment}
//                                           onChange={(e) =>
//                                             handlePrescriptionChange(index, e)
//                                           }
//                                         />
//                                       </Form.Group>
//                                     </Col>
//                                     <Col>
//                                       <Form.Group
//                                         controlId={`formDescription${index}`}
//                                       >
//                                         <Form.Label
//                                           style={{
//                                             color: "#003366",
//                                             fontFamily: "Sans-Serif",
//                                             fontSize: "25px",
//                                             fontWeight: 600,
//                                             lineHeight: "29.3px",
//                                             textAlign: "left",
//                                             width: "186px",
//                                             height: "40px",
//                                             opacity: 1,
//                                           }}
//                                         >
//                                           Description
//                                         </Form.Label>
//                                         <Form.Control
//                                           type="text"
//                                           name="description"
//                                           value={prescription.description}
//                                           onChange={(e) =>
//                                             handlePrescriptionChange(index, e)
//                                           }
//                                         />
//                                       </Form.Group>
//                                     </Col>
//                                     <Col>
//                                       <Form.Group
//                                         controlId={`formTimeSlot${index}`}
//                                       >
//                                         <Form.Label
//                                           style={{
//                                             color: "#003366",
//                                             fontFamily: "Sans-Serif",
//                                             fontSize: "25px",
//                                             fontWeight: 600,
//                                             lineHeight: "29.3px",
//                                             textAlign: "left",
//                                             width: "186px",
//                                             height: "40px",
//                                             opacity: 1,
//                                           }}
//                                         >
//                                           Time
//                                         </Form.Label>
//                                         <Form.Control
//                                           as="select"
//                                           name="time"
//                                           value={prescription.time}
//                                           onChange={(e) =>
//                                             handlePrescriptionChange(index, e)
//                                           }
//                                         >
//                                           <option value="">Select Time</option>
//                                           <option value="morning">
//                                             Morning
//                                           </option>
//                                           <option value="morning-afternoon">
//                                             Morning-Afternoon
//                                           </option>
//                                           <option value="morning-afternoon-evening">
//                                             Morning-Afternoon-Evening
//                                           </option>
//                                           <option value="morning-afternoon-evening-night">
//                                             Morning-Afternoon-Evening-Night
//                                           </option>
//                                           <option value="afternoon">
//                                             Afternoon
//                                           </option>
//                                           <option value="evening">
//                                             Evening
//                                           </option>
//                                           <option value="night">Night</option>
//                                         </Form.Control>
//                                       </Form.Group>
//                                     </Col>
//                                     <Col className="d-flex align-items-center">
//                                       <Button
//                                         variant="primary"
//                                         onClick={() =>
//                                           handlePrescriptionSubmit(index)
//                                         }
//                                         className="me-2"
//                                         style={{
//                                           background: "#0166CB",
//                                           border: "none",
//                                           padding: "6px 12px",
//                                           fontSize: "0.9rem",
//                                           borderRadius: "5px",
//                                           height: "40px",
//                                           width: "80px",
//                                           marginTop: "44px",
//                                         }}
//                                       >
//                                         Submit
//                                       </Button>
//                                       <Button
//                                         variant="danger"
//                                         onClick={() =>
//                                           handleUpdatePrescription(index)
//                                         }
//                                         className="me-2"
//                                         style={{
//                                           background: "#0166CB",
//                                           border: "none",
//                                           padding: "6px 12px",
//                                           fontSize: "0.9rem",
//                                           borderRadius: "5px",
//                                           height: "40px",
//                                           width: "80px",
//                                           marginTop: "44px",
//                                         }}
//                                       >
//                                         Update
//                                       </Button>
//                                       <Button
//                                         variant="danger"
//                                         onClick={() =>
//                                           removePrescriptionRow(index)
//                                         }
//                                         className="me-2"
//                                         style={{
//                                           background: "#0166CB",
//                                           border: "none",
//                                           padding: "6px 12px",
//                                           fontSize: "0.9rem",
//                                           borderRadius: "5px",
//                                           height: "40px",
//                                           width: "80px",
//                                           marginTop: "44px",
//                                         }}
//                                       >
//                                         Delete
//                                       </Button>
//                                     </Col>
//                                   </Row>
//                                 ))}
//                               </Form>

//                               {/* Prescription Documents Section and Modal */}
//                               {/* Add your Table and Modal code here */}
//                             </Card.Body>
//                           </Card>
//                           <Table
//                             striped
//                             bordered
//                             hover
//                             style={{ backgroundColor: "#D7EAF0" }}
//                           >
//                             <thead className="table-light">
//                               <tr>
//                                 <th
//                                   style={{
//                                     fontFamily: "sans-serif",
//                                     backgroundColor: "#D7EAF0",
//                                     color: "#003366",
//                                   }}
//                                 >
//                                   SNo.
//                                 </th>
//                                 <th
//                                   style={{
//                                     fontFamily: "sans-serif",
//                                     backgroundColor: "#D7EAF0",
//                                     color: "#003366",
//                                   }}
//                                 >
//                                   Document Date
//                                 </th>
//                                 <th
//                                   className="text-center"
//                                   style={{
//                                     fontFamily: "sans-serif",
//                                     backgroundColor: "#D7EAF0",
//                                     color: "#003366",
//                                   }}
//                                 >
//                                   Actions
//                                 </th>
//                               </tr>
//                             </thead>

//                             <tbody>
//                               {prescriptionDocuments.map((doc, index) => (
//                                 <React.Fragment key={doc.id}>
//                                   <tr>
//                                     <td>{index + 1}</td>
//                                     <td>{doc.document_date}</td>
//                                     <td className="text-center">
//                                       <div className="d-flex justify-content-center align-items-center">
//                                         <Button
//                                           variant="primary"
//                                           className="me-2"
//                                           onClick={() => handlePreview(doc.id)}
//                                           style={{
//                                             backgroundColor: "#0166CB",
//                                             borderColor: "#0166CB",
//                                           }}
//                                         >
//                                           Preview
//                                         </Button>

//                                         <DropdownButton
//                                           id="dropdown-basic-button"
//                                           title={
//                                             <FontAwesomeIcon
//                                               icon={faEllipsisV}
//                                             />
//                                           }
//                                           variant="secondary"
//                                         >
//                                           <Dropdown.Item
//                                             onClick={() =>
//                                               handleDownloadPrescriptionDoc(doc)
//                                             }
//                                           >
//                                             Download
//                                           </Dropdown.Item>
//                                           <Dropdown.Item
//                                             onClick={() =>
//                                               handleDeletePrescriptionDoc(
//                                                 doc.id
//                                               )
//                                             }
//                                           >
//                                             Delete
//                                           </Dropdown.Item>
//                                         </DropdownButton>
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 </React.Fragment>
//                               ))}
//                             </tbody>
//                           </Table>

//                           <Modal
//                             show={showPrescriptionDocsForm}
//                             onHide={() => setShowPrescriptionDocsForm(false)}
//                           >
//                             <Modal.Header closeButton>
//                               <Modal.Title>
//                                 Upload Prescription File
//                               </Modal.Title>
//                             </Modal.Header>
//                             <Modal.Body>
//                               <Form>
//                                 <Form.Group controlId="formPrescriptionFile">
//                                   <Form.Label>Prescription File</Form.Label>
//                                   <Form.Control
//                                     type="file"
//                                     onChange={handleFileSelectForPrescription}
//                                   />
//                                 </Form.Group>
//                               </Form>
//                             </Modal.Body>
//                             <Modal.Footer>
//                               <Button
//                                 variant="secondary"
//                                 onClick={() =>
//                                   setShowPrescriptionDocsForm(false)
//                                 }
//                               >
//                                 Cancel
//                               </Button>
//                               <Button
//                                 variant="primary"
//                                 onClick={() =>
//                                   handlePrescriptionDocs(
//                                     appointment.appointment_id
//                                   )
//                                 }
//                               >
//                                 Upload
//                               </Button>
//                             </Modal.Footer>
//                           </Modal>
//                         </td>
//                       </tr>
//                     )}

//                   {showRecordForm &&
//                     expandedAppointmentId === appointment.appointment_id && (
//                       <tr>
//                         <td colSpan="7">
//                           <Card
//                             className="shadow-sm mt-3"
//                             style={{
//                               borderRadius: "15px",
//                               border: " #0091A5",
//                               background: "#0091A5",
//                             }}
//                           >
//                             <Card.Body>
//                               {/* Bold and larger font for heading */}
//                               <h5
//                                 style={{
//                                   fontFamily: "Sans-Serif", // Set the font family
//                                   fontSize: "40px", // Set the font size
//                                   fontWeight: 600, // Set the font weight
//                                   lineHeight: "46.88px", // Set the line height
//                                   textAlign: "left", // Align text to the left
//                                   width: "225px", // Set the width
//                                   height: "46px", // Set the height
//                                   gap: "0px", // Gap property
//                                   opacity: 1, // Ensure full visibility
//                                   // background: '#FFFFFF',     // Set background color to white
//                                   color: "#ffffff", // Set the text color for contrast
//                                 }}
//                               >
//                                 Document
//                               </h5>

//                               <Button
//                                 variant="outline-primary"
//                                 style={{
//                                   position: "absolute", // Absolute positioning inside the card
//                                   top: "10px", // Distance from the top of the card
//                                   right: "10px", // Distance from the right of the card
//                                   background: "#0166CB", // Background color
//                                   color: "#ffffff", // Text color
//                                   border: "none", // Remove the border
//                                   borderRadius: "5px", // Rounded corners
//                                   padding: "10px 20px", // Padding for size
//                                 }}
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
//                                         <th
//                                           style={{
//                                             fontFamily: "sans-serif",
//                                             fontWeight: "bold",
//                                             background: "#D7EAF0",
//                                             color: "#003366",
//                                           }}
//                                         >
//                                           Document Name
//                                         </th>
//                                         <th
//                                           style={{
//                                             fontFamily: "sans-serif",
//                                             fontWeight: "bold",
//                                             background: "#D7EAF0",
//                                             color: "#003366",
//                                           }}
//                                         >
//                                           Patient Name
//                                         </th>
//                                         <th
//                                           style={{
//                                             fontFamily: "sans-serif",
//                                             fontWeight: "bold",
//                                             background: "#D7EAF0",
//                                             color: "#003366",
//                                           }}
//                                         >
//                                           Document Date
//                                         </th>
//                                         <th
//                                           style={{
//                                             fontFamily: "sans-serif",
//                                             fontWeight: "bold",
//                                             background: "#D7EAF0",
//                                             color: "#003366",
//                                           }}
//                                         >
//                                           Document Type
//                                         </th>
//                                         <th
//                                           style={{
//                                             fontFamily: "sans-serif",
//                                             fontWeight: "bold",
//                                             background: "#D7EAF0",
//                                             color: "#003366",
//                                           }}
//                                         >
//                                           Document File
//                                         </th>
//                                         <th
//                                           style={{
//                                             fontFamily: "sans-serif",
//                                             background: "#D7EAF0",
//                                             fontWeight: "bold",
//                                             color: "#003366",
//                                           }}
//                                         >
//                                           Actions
//                                         </th>
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
//                                               style={{
//                                                 backgroundColor: "#0166CB",
//                                                 color: "#ffffff",
//                                               }}
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
//                                         ? "Edit Medical Record"
//                                         : "Upload Medical Record"}
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

//       <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
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

//       {/* Preview Modal */}
//       <Modal show={showPreviewModal} onHide={handleClosePreviewModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Preview Document</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
//           {previewFileType.includes("image") ? (
//             <img
//               src={previewFileUrl}
//               alt="Document Preview"
//               style={{
//                 maxWidth: "100%", // Fit image within the modal width
//                 maxHeight: "500px", // Ensure the image doesn't exceed the modal height
//                 display: "block",
//                 margin: "0 auto", // Center the image
//               }}
//             />
//           ) : previewFileType.includes("pdf") ? (
//             <iframe
//               src={previewFileUrl}
//               title="Document Preview"
//               style={{
//                 width: "100%",
//                 height: "500px", // Set a fixed height for PDF preview
//                 border: "none",
//               }}
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

// export default ReceptionBookedAppointment;









import React, { useState, useEffect } from "react";
import "../../css/ClinicBookedAppointment.css";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Table,
  Dropdown,
  DropdownButton,
  Container,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faReceipt,
  faEllipsisV,
  faTimes as faTimesSolid,
} from "@fortawesome/free-solid-svg-icons";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Loader from "react-js-loader";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const LoaderImage = styled.div`
  width: 400px;
`;

const ReceptionBookedAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [receptionId, setReceptionId] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  const [prescriptions, setPrescriptions] = useState([
    { medicine_name: "", time: [], comment: "", description: "" },
  ]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordDetails, setRecordDetails] = useState({
    mobile_number: "",
    blood_pressure: "",
    weight: "",
    height: "",
    bmi: "",
    sugar_level: "",
    oxygen_level: "",
    symptoms: "",
    symptoms_comment: "",
    body_temperature: "",
    appointment_id: "",
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileType, setPreviewFileType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    document_name: "",
    patient_name: "",
    document_date: "",
    document_type: "",
    document_file: "",
  });
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
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    const token = localStorage.getItem("patient_token");

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMedicalRecords = async (appointment_id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.reception_id;
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
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (record) => {
    try {
      setLoading(true);
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
      setSuccessMessage(response.data.success);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFormModal = async () => {
    setShowFormModal((prev) => !prev);
    let decodedToken = null;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return;
    }
    const receptionId = decodedToken.reception_id;
    const userType = decodedToken.user_type;

    if (!showFormModal) {
      try {
        setLoading(true);
        const appointmentId = expandedAppointmentId;
        if (!appointmentId) {
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
            patient_name: documentData.name || "",
          }));
        } else {
          console.error("Failed to fetch document data");
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      } finally {
        setLoading(false);
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
        formDataToSend.append("reception_id", receptionId);

        try {
          setLoading(true);
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
            await fetchAppointments(receptionId);
            setSuccessMessage("Document file uploaded successfully");
          } else {
            setErrorMessage("Failed to upload document file");
          }
        } catch (postError) {
          setErrorMessage("Error uploading document file");
        } finally {
          setLoading(false);
        }
      }

      setFormData({
        document_name: "",
        patient_name: "",
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
      setLoading(true);
      const token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
    } catch (error) {
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
    formDataToSend.append("user_id", decodedToken.reception_id);

    try {
      setLoading(true);
      let response;
      if (editingRecordId) {
        formDataToSend.append("document_id", editingRecordId);
        response = await BaseUrl.patch(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend
        );
        setSuccessMessage(response.data.success);
      } else {
        response = await BaseUrl.post(
          `/patient/patientdocumentusingappointmentid/`,
          formDataToSend
        );
        setSuccessMessage(response.data.success);
      }
      setShowFormModal(false);
      await fetchMedicalRecords(expandedAppointmentId);
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
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
      setLoading(true);
      const response = await BaseUrl.delete(
        `/patient/patientdocumentusingappointmentid/`,
        {
          data: {
            document_id: recordId,
          },
        }
      );
      setSuccessMessage(response.data.success);
      await fetchMedicalRecords(expandedAppointmentId);
      await fetchAppointments(receptionId);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to delete the record."
      );
    } finally {
      setLoading(false);
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
      setLoading(true);
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
      setShowToast(true);
      setToastMessage("Failed to preview file.");
      setToastVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = async (prescriptionId, appointment_id) => {
    if (expandedPrescriptionId === prescriptionId) {
      setExpandedPrescriptionId(null);
    } else {
      try {
        setLoading(true);
        const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
          params: { appointment_id: appointment_id },
        });
        const prescriptionData = response.data;
        setPrescriptionDocuments(prescriptionData);
        setExpandedPrescriptionId(prescriptionId);
      } catch (error) {
        setShowToast(true);
        setToastMessage("Failed to view prescription.");
        setToastVariant("danger");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePreview = async (documentId) => {
    try {
      setLoading(true);
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
      setShowToast(true);
      setToastMessage("Failed to preview document.");
      setToastVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFileUrl("");
    setPreviewFileType("");
  };

  useEffect(() => {
    const getReceptionIdFromToken = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const reception_id = decodedToken.reception_id;
        setReceptionId(reception_id);
        await fetchAppointments(reception_id);
      } catch (error) {
        console.error("Error decoding token or fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    getReceptionIdFromToken();
  }, []);

  const fetchAppointments = async (receptionId) => {
    try {
      setLoading(true);
      const response = await BaseUrl.get(
        `/reception/appointmentbyreceptionid/?reception_id=${receptionId}`
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
        status: appointment.is_canceled
          ? "Canceled"
          : appointment.is_complete
            ? "Completed"
            : "Upcoming",
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
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = async (appointment_id, details) => {
    setFormDetails({});
    setRecordDetails({
      mobile_number: "",
      blood_pressure: "",
      weight: "",
      height: "",
      bmi: "",
      sugar_level: "",
      oxygen_level: "",
      symptoms: "",
      symptoms_comment: "",
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
    setMedicalRecords([]);
    if (expandedAppointmentId === appointment_id) {
      setExpandedAppointmentId(null);
      setShowPrescriptionForm(false);
      setShowRecordForm(false);
      setShowVitalForm(false);
      setShowMedicalRecords(false);
      setShowSymptomsForm(false);
    } else {
      setExpandedAppointmentId(appointment_id);
      setFormDetails({
        name: details.name || "",
        age: details.age || "",
        gender: details.gender || "",
        mobile_number: details.mobile_number || "",
        address: details.address || "",
      });
      setShowVitalForm(true);
      setShowPrescriptionForm(true);
      setShowRecordForm(true);
      setShowSymptomsForm(true);
      setShowMedicalRecords(true);

      try {
        setLoading(true);
        const fetchDataForPatient = async () => {
          const patientPromise = BaseUrl.get(
            `/patient/patient/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
          );

          const checkupPromise = BaseUrl.get(`/patient/vital/`, {
            params: { appointment_id: appointment_id },
          });

          const prescriptionPromise = BaseUrl.get(
            `/patient/patientpriscription/?patient_id=${details.patient_id}&appointment_id=${appointment_id}`
          );

          const prescriptionDocPromise = BaseUrl.get(
            `/patient/patientprescriptonfile/`,
            {
              params: { appointment_id: appointment_id },
            }
          );

          const symptomsPromise = BaseUrl.get(
            `/doctor/symptomsdetail/?appointment_id=${appointment_id}`
          );

          const results = await Promise.allSettled([
            patientPromise,
            checkupPromise,
            prescriptionPromise,
            prescriptionDocPromise,
            symptomsPromise,
            fetchDocumentIds(appointment_id),
            fetchMedicalRecords(appointment_id),
          ]);

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

        await fetchDataForPatient();
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPrescriptions = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await BaseUrl.get(`/patient/patientpriscription/`, {
        params: { appointment_id: appointmentId },
      });

      if (response.status === 200) {
        const fetchedPrescriptions = response.data;
        setPrescriptions(fetchedPrescriptions);
      } else {
        setErrorMessage("Failed to fetch prescriptions");
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setRecordDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: value };
      const heightInMeters = parseFloat(updatedDetails.height) / 100;
      const weight = parseFloat(updatedDetails.weight);

      if (heightInMeters && weight) {
        updatedDetails.bmi = (
          weight /
          (heightInMeters * heightInMeters)
        ).toFixed(2);
      } else {
        updatedDetails.bmi = "";
      }

      return updatedDetails;
    });
  };

  const fetchPrescriptionDocuments = async (appointment_id) => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await BaseUrl.get(`/patient/patientprescriptonfile/`, {
        params: { appointment_id: appointment_id },
      });

      if (response.status === 200) {
        const prescriptionDocuments = response.data;
        return prescriptionDocuments;
      } else {
        throw new Error("Failed to fetch prescription documents");
      }
    } catch (error) {
      console.error("Error fetching prescription documents:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrescriptionDoc = async (docId) => {
    try {
      setLoading(true);
      const response = await BaseUrl.delete(
        `/patient/patientprescriptonfile/`,
        {
          data: {
            document_id: docId,
          },
        }
      );

      if (response.status === 200) {
        const successMessage =
          response.data.success || "Prescription document deleted successfully";
        setSuccessMessage(successMessage);
        setPrescriptionDocuments((prevDocuments) => {
          return prevDocuments.filter((doc) => doc.id !== docId);
        });
        await fetchAppointments(receptionId);
      } else {
        throw new Error("Failed to delete prescription document");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrescriptionDoc = async (doc) => {
    try {
      setLoading(true);
      const response = await BaseUrl.get(
        `/patient/patientprescriptonfileView/`,
        {
          params: {
            patient_id: doc.patient,
            document_id: doc.id,
          },
          responseType: "blob",
        }
      );
      setSuccessMessage(response.data.success);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.document_name}.${
        response.data.type.split("/")[1]
      }`;
      link.click();
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async (appointment_id) => {
    try {
      setLoading(true);
      const response = await BaseUrl.get(`/patient/printrepport/`, {
        params: {
          appointment_id: expandedAppointmentId,
        },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url);
      if (newWindow) {
        newWindow.focus();
      }
      setSuccessMessage(response.data.success);
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (appointment_id) => {
    try {
      setLoading(true);
      const response = await BaseUrl.get(`/patient/printrepport/`, {
        params: {
          appointment_id: expandedAppointmentId,
        },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AppointmentRecord.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
      const payload = {
        appointment_id: selectedAppointment.appointment_id,
        patient_id: selectedAppointment.patient_id,
        ...formDetails,
      };

      const response = await BaseUrl.put(`/patient/patient/`, payload);
      if (response.status === 201) {
        await fetchAppointments(receptionId);
        setSuccessMessage(response.data.success);
      } else {
        setErrorMessage(response.data?.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointment_id) => {
    try {
      setLoading(true);
      const response = await BaseUrl.delete(`/doctorappointment/getslot/`, {
        data: { appointment_id },
      });

      if (response.status === 200) {
        await fetchAppointments(receptionId);
        setSuccessMessage(response.data.success);
      } else {
        throw new Error(response.data?.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointment_id) => {
    try {
      setLoading(true);
      const response = await BaseUrl.patch(`/doctorappointment/getslot/`, {
        appointment_id,
      });

      if (response.status === 200) {
        await fetchAppointments(receptionId);
        setSuccessMessage(response.data.success);
      } else {
        setErrorMessage(response.data?.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
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
    setPrescriptions([
      { medicine_name: "", time: "", comment: "", description: "" },
      ...prescriptions,
    ]);
  };

  const removePrescriptionRow = async (index) => {
    const prescriptionToDelete = prescriptions[index];
    if (!prescriptionToDelete.id) {
      const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
      setPrescriptions(updatedPrescriptions);
      return;
    }
    try {
      setLoading(true);
      const prescription_id = prescriptionToDelete.id;
      const response = await BaseUrl.delete(`/patient/patientpriscription/`, {
        params: { prescription_id },
      });

      if (response.status === 200 || response.status === 204) {
        const updatedPrescriptions = prescriptions.filter(
          (_, i) => i !== index
        );
        setPrescriptions(updatedPrescriptions);
        setSuccessMessage(
          response.data.success || "Prescription removed successfully"
        );
      } else {
        setErrorMessage(
          response.data?.message || "Failed to remove prescription"
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error removing prescription"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (appointment_id, patient_id) => {
    try {
      setLoading(true);
      const response = await BaseUrl.get("/patient/patientpriscription/", {
        params: {
          appointment_id: appointment_id,
          patient_id: patient_id,
        },
      });
      if (response.status === 200) {
        const fetchedPrescriptions = response.data;
        setPrescriptions(fetchedPrescriptions);
      } else {
        console.error("Failed to fetch prescriptions");
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionSubmit = async (index) => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
      if (!selectedAppointment) {
        console.error("No selected appointment found");
        setErrorMessage("No selected appointment found");
        return;
      }
      const patient_id = selectedAppointment.patient_id;
      const appointment_id = selectedAppointment.appointment_id;
      const prescription = prescriptions[index];
      const payload = {
        ...prescription,
        patient_id: patient_id,
        appointment_id: appointment_id,
      };
      const response = await BaseUrl.post("/patient/patientpriscription/", [
        payload,
      ]);

      if (response.status === 201) {
        setSuccessMessage(response.data.success);
        const updatedPrescriptions = prescriptions.map((prescription, i) =>
          i === index
            ? { medicine_name: "", time: "", comment: "", description: "" }
            : prescription
        );
        setPrescriptions(updatedPrescriptions);
        await fetchPrescriptions(appointment_id, patient_id);
        await fetchDocumentIds(appointment_id);
      } else {
        setErrorMessage(response.data?.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrescription = async (index) => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
      const patient_id = selectedAppointment.patient_id;
      const appointment_id = selectedAppointment.appointment_id;
      const prescription = prescriptions[index];
      const payload = {
        prescription_id: prescription.id,
        patient_id: patient_id,
        appointment_id: appointment_id,
        medicine_name: prescription.medicine_name,
        time: prescription.time,
        comment: prescription.comment,
        description: prescription.description,
      };

      const response = await BaseUrl.put(
        "/patient/patientpriscription/",
        payload
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        await fetchPrescriptions(appointment_id, patient_id);
      } else {
        setErrorMessage(response.data?.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentIds = async (appointmentId) => {
    try {
      setLoading(true);
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
      }
    } catch (error) {
      console.error("Error fetching document IDs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVitalForm = async (appointment_id) => {
    setShowVitalForm(!showVitalForm);
    setShowPrescriptionForm(false);
    setExpandedAppointmentId(appointment_id);

    if (!showVitalForm) {
      try {
        setLoading(true);
        const selectedAppointment = appointments.find(
          (appointment) => appointment.appointment_id === appointment_id
        );

        if (selectedAppointment) {
          const appointment_date = selectedAppointment.appointment_date;

          const fetchDataResponse = await BaseUrl.get(`/patient/vital/`, {
            params: {
              appointment_id: appointment_id,
              appointment_date: appointment_date,
            },
          });
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
              weight: fetchedData.weight,
              appointment_date: appointment_date,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching vitals data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setRecordDetails({
        appointment_id: "",
        blood_pressure: "",
        oxygen_level: "",
        sugar_level: "",
        weight: "",
        height: "",
        bmi: "",
        pulse_rate: "",
        heart_rate: "",
        body_temperature: "",
        appointment_date: "",
      });
    }
  };

  const handleVitalSubmit = async () => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );

      if (!selectedAppointment) {
        console.error("No selected appointment found");
        return;
      }
      const patient_id = selectedAppointment.patient_id;
      const appointment_date = selectedAppointment.appointment_date;
      const postResponse = await BaseUrl.post("/patient/vital/", {
        patient_id: patient_id,
        appointment_id: expandedAppointmentId,
        record_date: appointment_date,
        blood_pressure: recordDetails.blood_pressure,
        oxygen_level: recordDetails.oxygen_level,
        sugar_level: recordDetails.sugar_level,
        weight: recordDetails.weight,
        height: recordDetails.height,
        bmi: recordDetails.bmi,
        pulse_rate: recordDetails.pulse_rate,
        heart_rate: recordDetails.heart_rate,
        body_temperature: recordDetails.body_temperature,
      });

      if (postResponse.status === 201) {
        setErrorMessage("");
        await fetchAppointments(receptionId);
        await fetchMedicalRecords(expandedAppointmentId);
        setRecordDetails({
          patient_id: "",
          blood_pressure: "",
          oxygen_level: "",
          sugar_level: "",
          height: "",
          weight: "",
          pulse_rate: "",
          bmi: "",
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
      setErrorMessage("Error submitting vitals");
      setShowToast(true);
      setToastMessage("Error submitting vitals.");
      setToastVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleVitalUpdate = async () => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
      const patient_id = selectedAppointment.patient_id;
      const appointment_id = selectedAppointment.appointment_id;
      const payload = {
        blood_pressure: recordDetails.blood_pressure,
        oxygen_level: recordDetails.oxygen_level,
        body_temperature: recordDetails.body_temperature,
        heart_rate: recordDetails.heart_rate,
        pulse_rate: recordDetails.pulse_rate,
        sugar_level: recordDetails.sugar_level,
        weight: recordDetails.weight,
        bmi: recordDetails.bmi,
        height: recordDetails.height,
        patient_id: patient_id,
        appointment_id: appointment_id,
      };
      const response = await BaseUrl.put(`/patient/vital/`, payload);

      if (response.status === 200) {
        setSuccessMessage(response.data.success);
      } else {
        setErrorMessage(response.data?.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
    } finally {
      setLoading(false);
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
        setLoading(true);
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
      } finally {
        setLoading(false);
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
      ...prevSymptoms,
    ]);
    setSearchSymptom("");
    setSearchResults([]);
  };

  const handleRemoveSymptom = async (symptom) => {
    if (!symptom.id) {
      setSelectedSymptoms((prevSymptoms) =>
        prevSymptoms.filter((s) => s !== symptom)
      );
      return;
    }

    try {
      setLoading(true);
      const response = await BaseUrl.delete(`/doctor/symptomsdetail/`, {
        data: {
          appointment_id: expandedAppointmentId,
          symptoms_id: symptom.symptoms,
        },
      });

      if (response.status === 200) {
        setSelectedSymptoms((prevSymptoms) =>
          prevSymptoms.filter((s) => s.id !== symptom.id)
        );
        setSuccessMessage(response.data.success);
      } else {
        const errorMessage =
          response.data?.message || "Failed to delete symptom";
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSymptoms = async () => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
      const appointment_id = expandedAppointmentId;
      const appointment_date = selectedAppointment.appointment_date;
      let successCount = 0;
      for (let i = 0; i < selectedSymptoms.length; i++) {
        const symptom = selectedSymptoms[i];
        const symptomPayload = {
          symptoms: symptom.Symptoms_id,
          appointment: appointment_id,
          symptom_date: appointment_date,
          since: symptom.since,
          severity: symptom.severity,
          more_options: symptom.more_options,
        };

        try {
          setLoading(true);
          const response = await BaseUrl.post(
            "/doctor/symptomsdetail/",
            symptomPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            successCount++;
            const successMessage = response.data.success;
            selectedSymptoms[i].id = response.data.data.id;
          } else {
            const errorMessage =
              response.data?.message || "Failed to save symptom";
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error;
        } finally {
          setLoading(false);
        }
      }
      if (successCount > 0) {
        setSuccessMessage(
          `${successCount} symptom(s) details saved successfully`
        );
      } else {
        setErrorMessage("No symptoms details were saved");
      }

      await fetchAppointments(receptionId);
      await fetchMedicalRecords(expandedAppointmentId);
    } catch (error) {
      setErrorMessage("An error occurred while saving symptoms");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSymptom = async () => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === expandedAppointmentId
      );
      const appointment_id = expandedAppointmentId;
      let successCount = 0;
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
          setLoading(true);
          const response = await BaseUrl.put(
            "/doctor/symptomsdetail/",
            symptomPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200 || response.status === 201) {
            successCount++;
            const successMessage = response.data.success;
          } else {
            const errorMessage =
              response.data?.message || "Failed to update symptom";
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error;
        } finally {
          setLoading(false);
        }
      }

      if (successCount > 0) {
        setSuccessMessage(`${successCount} symptom(s) updated successfully`);
      } else {
        setErrorMessage("No symptoms were updated");
      }
      await fetchAppointments(receptionId);
      await fetchMedicalRecords(expandedAppointmentId);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && /[^a-zA-Z\s]/.test(value)) {
      return;
    }
    if (name === "mobile_number") {
      const newValue = value.replace(/[^\d]/g, "").substring(0, 10);
      setFormDetails((prevDetails) => ({
        ...prevDetails,
        [name]: newValue,
      }));
      return;
    }
    if (name === "age") {
      const numericValue = parseInt(value, 10);
      if (/[^0-9]/.test(value) || numericValue > 150) {
        return;
      }
    }
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
          updatedTime = [...prescription.time, timeSlot];
        } else {
          updatedTime = prescription.time.filter((time) => time !== timeSlot);
        }
        return { ...prescription, time: updatedTime };
      }
      return prescription;
    });
    setPrescriptions(updatedPrescriptions);
  };

  const handlePrescriptionDocs = async (appointment_id) => {
    try {
      setLoading(true);
      const selectedAppointment = appointments.find(
        (appointment) => appointment.appointment_id === appointment_id
      );
      const appointment_date = selectedAppointment.appointment_date;
      const formData = new FormData();
      formData.append("document_file", selectedFile);
      formData.append("document_date", appointment_date);
      formData.append("appointment", appointment_id);

      const response = await BaseUrl.post(
        `/patient/patientprescriptonfile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const successMessage =
          response.data.success ||
          "Prescription document uploaded successfully";
        setSuccessMessage(successMessage);
        setPrescriptionDocuments((prevDocuments) => [
          ...prevDocuments,
          response.data,
        ]);
        setShowPrescriptionDocsForm(false);
        const updatedDocuments =
          await fetchPrescriptionDocuments(appointment_id);
        setPrescriptionDocuments(updatedDocuments);
        await fetchMedicalRecords(appointment_id);
        await fetchAppointments(receptionId);
      } else {
        const errorMessage =
          response.data.error || "Failed to upload prescription document";
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error uploading prescription document"
      );
    } finally {
      setSelectedFile(null);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const resetToDefault = () => {
    setIsSearching(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchParams.booked_by) {
        handleSearch();
      } else {
        resetToDefault();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParams.booked_by]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      setLoading(true);
      const response = await BaseUrl.get("/reception/receptionsearch/", {
        params: {
          reception_id: receptionId,
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
        status: appointment.is_canceled
          ? "Canceled"
          : appointment.is_complete
            ? "Completed"
            : "Upcoming",
      }));

      setAppointments(fetchedAppointments);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("No appointments found");
      setAppointments([]);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.appointment_date);
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(appointment);
    return acc;
  }, {}); 

  return (
   <Container fluid style={{backgroundColor: "#F2F9FF", margin: "0px", padding: "0px"}}>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {loading && (
        <LoaderWrapper>
          <LoaderImage>
            <Loader
              type="spinner-circle"
              bgColor="#0091A5"
              color="#0091A5"
              title="Loading..."
              size={100}
            />
          </LoaderImage>
        </LoaderWrapper>
      )}

      <div
        className="shadow-sm mb-5 p-5"
        style={{
          backgroundColor: "#D7EAF0",
          padding: "30px 0",
        }}
      >
        <h5
          className="card-title mb-5 text-center"
          style={{
            color: "#003366",
            fontFamily: "Sans-Serif",
            fontWeight: "bold",
          }}
        >
          Search Appointments
        </h5>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div
            className="d-flex align-items-center mx-auto mb-5"
            style={{
              maxWidth: "600px",
              gap: "10px",
            }}
          >
            <Form.Control
              type="text"
              id="booked_by"
              name="booked_by"
              value={searchParams.booked_by}
              onChange={handleSearchChange}
              placeholder="Date/Time Slot/Doctor/Booked By/Mobile Number"
              className="flex-grow-1"
              style={{
                border: "2px solid #007bff",
                borderRadius: "5px 0 0 5px",
                height: "40px",
                padding: "0 10px",
                fontSize: "1rem",
              }}
            />
            <Button
              onClick={handleSearch}
              type="submit"
              style={{
                borderRadius: "0 5px 5px 0",
                backgroundColor: "#0166CB",
                color: "white",
                border: "2px solid #007bff",
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "0 20px",
                height: "40px",
              }}
              className="search-button"
            >
              Search
            </Button>
          </div>
        </Form>
      </div>

      <div className="p-2">
        <Modal
          show={!!errorMessage || !!successMessage}
          onHide={handleCloseMessageModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{errorMessage ? "Error" : "Success"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{errorMessage || successMessage}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseMessageModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Card.Body>
          <h2
            className="card-title text-center mb-4"
            style={{
              color: "#000",
              fontFamily: "Sans-Serif",
              fontWeight: "700",
            }}
          >
            Booked Appointments <br />
            <span
              style={{
                color: "#000",
                fontSize: "14px",
                fontWeight: "700",
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  backgroundColor: " #F5ECD5",
                  borderRadius: "50%",
                  border: "2px solid black",
                  marginRight: "8px",
                }}
              ></span>
              (Booked By Patient)
            </span>
          </h2>

          {Object.keys(groupedAppointments).map((date) => (
                    <div key={date}><hr/>
                      <h4 style={{ color: "#003366" }} className="text-center">
                        {date}
                      </h4>
                      <Row className="d-flex justify-content-center align-items-center mx-auto">
                        {groupedAppointments[date].map((appointment) => (
                <Col
                  sm={12}
                  md={
                    expandedAppointmentId === appointment.appointment_id
                      ? 12
                      : 4
                  }
                  lg={
                    expandedAppointmentId === appointment.appointment_id
                      ? 12
                      : 2
                  }
                  key={appointment.appointment_id}
                  className="mb-5 p-3"
                >
                  <Card>
                    <Card.Header
                      style={{
                        background: "#D7EAF0",
                        color: "#003366",
                        fontWeight: "bold",
                      }}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center"
                        onClick={() =>
                          expandedAppointmentId === appointment.appointment_id
                            ? setExpandedAppointmentId(null)
                            : toggleForm(
                                appointment.appointment_id,
                                appointment
                              )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <span>{appointment.appointment_date}</span>
                        {expandedAppointmentId ===
                        appointment.appointment_id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                    </Card.Header>
                    <Card.Body
                      style={{ overflowX: "auto", whiteSpace: "nowrap", background: appointment.booked_by !== appointment.doctor_name ? "#F5ECD5" : "#FFFFFF" }}
                    >
                      <p>
                        <strong>Time Slot:</strong>{" "}
                        {appointment.appointment_slot}
                      </p>
                      <p>
                        <strong>Booked By:</strong> {appointment.booked_by}
                      </p>
                      <p>
                        <strong>Status:</strong> {appointment.status}
                      </p>

                      {expandedAppointmentId === appointment.appointment_id && (
                        <tr>
                          <td>
                            <Card
                              className="shadow-sm mt-3"
                              style={{
                                borderRadius: "15px",
                                border: " #0091A5",
                                background: "#f1f8fb",
                              }}
                            >
                              <Card.Body
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <h2
                                      style={{
                                        fontWeight: "600",
                                        color: "#000",
                                        fontFamily: "Sans-Serif",
                                        lineHeight: "46.88px",
                                        margin: "0px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Patient Details
                                    </h2>
                                    <Button
                                      style={{
                                        marginLeft: "20px",
                                        backgroundColor: "#295F98",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        setShowPatientDetails((prev) => !prev)
                                      }
                                    >
                                      {showPatientDetails
                                        ? "Hide Details"
                                        : "Show Details"}
                                    </Button>
                                  </div>
                                </div>
                                {showPatientDetails && (
                                  <Form>
                                    <Row className="mb-3">
                                      <Col sm={6} md={4}>
                                        <Form.Group
                                          controlId="formName"
                                          className="mb-3"
                                        >
                                          <Form.Label
                                            style={{
                                              color: "#003366",
                                              fontFamily: "Sans-Serif",
                                              fontSize: "18px",
                                              fontWeight: 600,
                                              lineHeight: "29.3px",
                                              textAlign: "left",
                                              width: "100%",
                                            }}
                                          >
                                            Name
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            name="name"
                                            value={formDetails.name || ""}
                                            onChange={handleInputChange}
                                            style={{
                                              textAlign: "left",
                                            }}
                                          />
                                        </Form.Group>
                                      </Col>
                                      <Col sm={6} md={4}>
                                        <Form.Group
                                          controlId="formMobileNumber"
                                          className="mb-3"
                                        >
                                          <Form.Label
                                            style={{
                                              color: "#003366",
                                              fontFamily: "Sans-Serif",
                                              fontSize: "18px",
                                              fontWeight: 600,
                                              lineHeight: "29.3px",
                                              textAlign: "left",
                                              width: "100%",
                                            }}
                                          >
                                            Mobile Number
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            name="mobile_number"
                                            value={
                                              formDetails.mobile_number || ""
                                            }
                                            onChange={handleInputChange}
                                            style={{
                                              textAlign: "left",
                                            }}
                                            disabled
                                          />
                                        </Form.Group>
                                      </Col>
                                      <Col sm={6} md={4}>
                                        <Form.Group
                                          controlId="formAge"
                                          className="mb-3"
                                        >
                                          <Form.Label
                                            style={{
                                              color: "#003366",
                                              fontFamily: "Sans-Serif",
                                              fontSize: "18px",
                                              fontWeight: 600,
                                              lineHeight: "29.3px",
                                              textAlign: "left",
                                              width: "100%",
                                            }}
                                          >
                                            Age
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            name="age"
                                            value={formDetails.age || ""}
                                            onChange={handleInputChange}
                                            style={{
                                              textAlign: "left",
                                            }}
                                          />
                                        </Form.Group>
                                      </Col>
                                      <Col sm={6} md={4}>
                                        <Form.Group
                                          controlId="formGender"
                                          className="mb-3"
                                        >
                                          <Form.Label
                                            style={{
                                              color: "#003366",
                                              fontFamily: "Sans-Serif",
                                              fontSize: "18px",
                                              fontWeight: 600,
                                              lineHeight: "29.3px",
                                              textAlign: "left",
                                              width: "100%",
                                            }}
                                          >
                                            Gender
                                          </Form.Label>
                                          <Form.Select
                                            name="gender"
                                            value={formDetails.gender || ""}
                                            onChange={handleInputChange}
                                            style={{
                                              textAlign: "left",
                                            }}
                                          >
                                            <option value="">
                                              Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                              Female
                                            </option>
                                            <option value="others">
                                              Others
                                            </option>
                                          </Form.Select>
                                        </Form.Group>
                                      </Col>
                                      <Col sm={6} md={4}>
                                        <Form.Group
                                          controlId="formAddress"
                                          className="mb-3"
                                        >
                                          <Form.Label
                                            style={{
                                              color: "#003366",
                                              fontFamily: "Sans-Serif",
                                              fontSize: "18px",
                                              fontWeight: 600,
                                              lineHeight: "29.3px",
                                              textAlign: "left",
                                              width: "100%",
                                            }}
                                          >
                                            Address
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            name="address"
                                            value={formDetails.address || ""}
                                            onChange={handleInputChange}
                                            style={{
                                              textAlign: "left",
                                            }}
                                          />
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <div className="d-flex justify-content-center gap-2">
                                      <Button
                                        style={{
                                          backgroundColor: "#C62E2E",
                                          color: "#FFFFFF",
                                          border: "none",
                                          borderRadius: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleDelete(
                                            appointment.appointment_id
                                          )
                                        }
                                      >
                                        Delete
                                      </Button>

                                      <Button
                                        style={{
                                          backgroundColor: "#FF8A08",
                                          color: "#FFFFFF",
                                          border: "none",
                                          borderRadius: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleCancelAppointment(
                                            appointment.appointment_id
                                          )
                                        }
                                      >
                                        Cancel Appointment
                                      </Button>
                                      <Button
                                        style={{
                                          backgroundColor: "#295F98",
                                          color: "#ffffff",
                                          border: "none",
                                          borderRadius: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </Button>
                                    </div>
                                    <div className="d-flex justify-content-end mt-4"></div>
                                  </Form>
                                )}
                              </Card.Body>
                            </Card>
                          </td>
                        </tr>
                      )}
                      {showSymptomsForm &&
                        expandedAppointmentId ===
                          appointment.appointment_id && (
                          <tr>
                            <td>
                              <Card
                                className="shadow-sm mt-3"
                                style={{
                                  borderRadius: "15px",
                                  border: "#0091A5",
                                  background: "#f1f8fb",
                                }}
                              >
                                <Card.Body style={{ position: "relative" }}>
                                  <div
                                    className="symptoms-header"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <h2
                                      style={{
                                        fontWeight: "600",
                                        color: "#000",
                                        fontFamily: "Sans-Serif",
                                        lineHeight: "46.88px",
                                        margin: "0px 20px 0px 0px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Symptoms
                                    </h2>
                                    <Form.Control
                                      type="text"
                                      placeholder="Search symptoms"
                                      value={searchSymptom}
                                      onChange={handleSymptomSearch}
                                      style={{
                                        width: "300px",
                                        margin: "0px",
                                      }}
                                    />
                                    <Button
                                      style={{
                                        marginLeft: "auto",
                                        backgroundColor: "#295F98",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                      onClick={handleUpdateSymptom}
                                    >
                                      Update Symptoms
                                    </Button>
                                  </div>

                                  <Form>
                                    <Row className="mb-3">
                                      <Col xs={12}>
                                        {searchResults.length > 0 && (
                                          <ul className="list-group mt-2">
                                            {searchResults.map(
                                              (symptom, index) => (
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
                                              )
                                            )}
                                          </ul>
                                        )}
                                      </Col>
                                    </Row>

                                    <Table striped bordered hover>
                                      <thead className="table-light">
                                        <tr>
                                          <th
                                            style={{
                                              fontFamily: "sans-serif",
                                              backgroundColor: "#D7EAF0",
                                              color: "#003366",
                                              width: "50%",
                                            }}
                                          >
                                            Symptom
                                          </th>
                                          <th
                                            style={{
                                              fontFamily: "sans-serif",
                                              backgroundColor: "#D7EAF0",
                                              color: "#003366",
                                              width: "10%",
                                            }}
                                          >
                                            Severity
                                          </th>
                                          <th
                                            style={{
                                              fontFamily: "sans-serif",
                                              backgroundColor: "#D7EAF0",
                                              color: "#003366",
                                              width: "10%",
                                            }}
                                          >
                                            Since
                                          </th>
                                          <th
                                            style={{
                                              fontFamily: "sans-serif",
                                              backgroundColor: "#D7EAF0",
                                              color: "#003366",
                                              width: "25%",
                                            }}
                                          >
                                            More Options
                                          </th>
                                          <th
                                            style={{
                                              fontFamily: "sans-serif",
                                              backgroundColor: "#D7EAF0",
                                              color: "#003366",
                                              width: "5%",
                                            }}
                                          >
                                            Actions
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedSymptoms.map(
                                          (symptom, index) => (
                                            <tr key={index}>
                                              <td>{symptom.symptoms_name}</td>
                                              <td>
                                                <Form.Select
                                                  name={`severity-${index}`}
                                                  value={symptom.severity}
                                                  onChange={(e) =>
                                                    handleSeverityChange(
                                                      index,
                                                      e
                                                    )
                                                  }
                                                >
                                                  <option value="">
                                                    Select Severity
                                                  </option>
                                                  <option value="mild">
                                                    Mild
                                                  </option>
                                                  <option value="moderate">
                                                    Moderate
                                                  </option>
                                                  <option value="severe">
                                                    Severe
                                                  </option>
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
                                                />
                                              </td>
                                              <td>
                                                <Form.Control
                                                  type="text"
                                                  name={`more_options-${index}`}
                                                  value={symptom.more_options}
                                                  onChange={(e) =>
                                                    handleMoreOptionsChange(
                                                      index,
                                                      e
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <Button
                                                  style={{
                                                    backgroundColor: "#C62E2E",
                                                    color: "#FFFFFF",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    handleRemoveSymptom(symptom)
                                                  }
                                                >
                                                  Remove
                                                </Button>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </Table>

                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Button
                                        variant="primary"
                                        onClick={handleSaveSymptoms}
                                        style={{
                                          background: "#295F98",
                                          border: "none",
                                          width: "74.05px",
                                          height: "36px",
                                        }}
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </Form>
                                </Card.Body>
                              </Card>
                            </td>
                          </tr>
                        )}

                      {showVitalForm &&
                        expandedAppointmentId ===
                          appointment.appointment_id && (
                          <tr>
                            <td>
                              <Card
                                className="shadow-sm mt-3"
                                style={{
                                  borderRadius: "15px",
                                  border: " #0091A5",
                                  background: "#f1f8fb",
                                }}
                              >
                                <Card.Body
                                  style={{
                                    position: "relative",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <h2
                                      style={{
                                        fontWeight: "600",
                                        color: "#000",
                                        fontFamily: "Sans-Serif",
                                        lineHeight: "46.88px",
                                        margin: "0px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Patient Vitals
                                    </h2>
                                  </div>

                                  <Button
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                      backgroundColor: "#295F98",
                                      color: "#ffffff",
                                      border: "none",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                    }}
                                    onClick={handleVitalUpdate}
                                  >
                                    Update Vitals
                                  </Button>

                                  <Table
                                    bordered
                                    hover
                                    responsive
                                    className="table-sm mt-3"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Blood Pressure
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Oxygen Level
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Body Temp.
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Heart Rate
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Pulse Rate
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Sugar Level
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Height (cm)
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          Weight (kg)
                                        </th>
                                        <th
                                          style={{
                                            fontFamily: "sans-serif",
                                            fontSize: "16px",
                                            backgroundColor: "#D7EAF0",
                                            color: "#003366",
                                          }}
                                        >
                                          BMI
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <tr>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="blood_pressure"
                                            value={recordDetails.blood_pressure}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="oxygen_level"
                                            value={recordDetails.oxygen_level}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="body_temperature"
                                            value={
                                              recordDetails.body_temperature
                                            }
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="heart_rate"
                                            value={recordDetails.heart_rate}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="pulse_rate"
                                            value={recordDetails.pulse_rate}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="sugar_level"
                                            value={recordDetails.sugar_level}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="height"
                                            value={recordDetails.height || ""}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="weight"
                                            value={recordDetails.weight || ""}
                                            onChange={handleVitalChange}
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            name="bmi"
                                            value={recordDetails.bmi || ""}
                                            readOnly
                                            style={{ padding: "5px" }}
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Button
                                      variant="primary"
                                      onClick={handleVitalSubmit}
                                      className="me-2"
                                      style={{
                                        background: "#295F98",
                                        border: "none",
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </td>
                          </tr>
                        )}

                      {showPrescriptionForm &&
                        expandedAppointmentId ===
                          appointment.appointment_id && (
                          <tr>
                            <td>
                              <Card
                                className="shadow-sm mt-3"
                                style={{
                                  borderRadius: "15px",
                                  border: " #0091A5",
                                  background: "#f1f8fb",
                                }}
                              >
                                <Card.Body style={{ position: "relative" }}>
                                  <div
                                    className="prescription-header"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <h2
                                      style={{
                                        fontWeight: "600",
                                        color: "#000",
                                        fontFamily: "Sans-Serif",
                                        lineHeight: "46.88px",
                                        margin: "0px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Prescription
                                    </h2>
                                    <div className="upload-prescription-wrapper">
                                      <Button
                                        style={{
                                          position: "absolute",
                                          top: "10px",
                                          right: "10px",
                                          background: "#295F98",
                                          color: "#fff",
                                          border: "none",
                                          borderRadius: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={addPrescriptionRow}
                                      >
                                        Add Prescription
                                      </Button>
                                    </div>
                                    <Button
                                      variant="success"
                                      className="ms-3"
                                      onClick={() => {
                                        setIsPrescriptionDocs(true);
                                        setShowPrescriptionDocsForm(true);
                                      }}
                                      style={{
                                        backgroundColor: "#295F98",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Upload Prescription
                                    </Button>
                                  </div>

                                  <Form className="mt-3">
                                    {prescriptions.map(
                                      (prescription, index) => (
                                        <Row className="mb-3" key={index}>
                                          <Col>
                                            <Form.Group
                                              controlId={`formMedicineName${index}`}
                                            >
                                              <Form.Label
                                                style={{
                                                  color: "#003366",
                                                  fontFamily: "Sans-Serif",
                                                  fontSize: "18px",
                                                  fontWeight: 600,
                                                  lineHeight: "29.3px",
                                                  textAlign: "left",
                                                  opacity: 1,
                                                }}
                                              >
                                                Medicine Name
                                              </Form.Label>
                                              <Form.Control
                                                type="text"
                                                name="medicine_name"
                                                value={
                                                  prescription.medicine_name
                                                }
                                                onChange={(e) =>
                                                  handlePrescriptionChange(
                                                    index,
                                                    e
                                                  )
                                                }
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col>
                                            <Form.Group
                                              controlId={`formComment${index}`}
                                            >
                                              <Form.Label
                                                style={{
                                                  color: "#003366",
                                                  fontFamily: "Sans-Serif",
                                                  fontSize: "18px",
                                                  fontWeight: 600,
                                                  lineHeight: "29.3px",
                                                  textAlign: "left",
                                                  opacity: 1,
                                                }}
                                              >
                                                Precautions
                                              </Form.Label>
                                              <Form.Control
                                                type="text"
                                                name="comment"
                                                value={prescription.comment}
                                                onChange={(e) =>
                                                  handlePrescriptionChange(
                                                    index,
                                                    e
                                                  )
                                                }
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col>
                                            <Form.Group
                                              controlId={`formTimeSlot${index}`}
                                            >
                                              <Form.Label
                                                style={{
                                                  color: "#003366",
                                                  fontFamily: "Sans-Serif",
                                                  fontSize: "px",
                                                  fontWeight: 600,
                                                  lineHeight: "29.3px",
                                                  textAlign: "left",
                                                  opacity: 1,
                                                }}
                                              >
                                                Description
                                              </Form.Label>
                                              <Form.Control
                                                as="select"
                                                name="time"
                                                value={prescription.time}
                                                onChange={(e) =>
                                                  handlePrescriptionChange(
                                                    index,
                                                    e
                                                  )
                                                }
                                              >
                                                <option value="">
                                                  Select Time
                                                </option>
                                                <option value="morning">
                                                  Morning
                                                </option>
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
                                                <option value="evening">
                                                  Evening
                                                </option>
                                                <option value="night">
                                                  Night
                                                </option>
                                              </Form.Control>
                                            </Form.Group>
                                          </Col>

                                          <Col>
                                            <Form.Group
                                              controlId={`formDescription${index}`}
                                            >
                                              <Form.Label
                                                style={{
                                                  color: "#003366",
                                                  fontFamily: "Sans-Serif",
                                                  fontSize: "18px",
                                                  fontWeight: 600,
                                                  lineHeight: "29.3px",
                                                  textAlign: "left",
                                                  opacity: 1,
                                                }}
                                              >
                                                Duration
                                              </Form.Label>
                                              <Form.Control
                                                type="text"
                                                name="description"
                                                value={prescription.description}
                                                onChange={(e) =>
                                                  handlePrescriptionChange(
                                                    index,
                                                    e
                                                  )
                                                }
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col className="d-flex align-items-center">
                                            <Button
                                              variant="primary"
                                              onClick={() =>
                                                handlePrescriptionSubmit(index)
                                              }
                                              className="me-2"
                                              style={{
                                                background: "#295F98",
                                                border: "none",
                                                fontSize: "0.9rem",
                                                borderRadius: "5px",
                                                marginTop: "44px",
                                              }}
                                            >
                                              Submit
                                            </Button>
                                            <Button
                                              variant="danger"
                                              onClick={() =>
                                                handleUpdatePrescription(index)
                                              }
                                              className="me-2"
                                              style={{
                                                background: "#295F98",
                                                border: "none",
                                                fontSize: "0.9rem",
                                                borderRadius: "5px",
                                                marginTop: "44px",
                                              }}
                                            >
                                              Update
                                            </Button>
                                            <Button
                                              variant="danger"
                                              onClick={() =>
                                                removePrescriptionRow(index)
                                              }
                                              className="me-2"
                                              style={{
                                                background: "#C62E2E",
                                                border: "none",
                                                fontSize: "0.9rem",
                                                borderRadius: "5px",
                                                marginTop: "44px",
                                              }}
                                            >
                                              Delete
                                            </Button>
                                          </Col>
                                        </Row>
                                      )
                                    )}
                                  </Form>
                                </Card.Body>
                              </Card>
                              <Table
                                striped
                                bordered
                                hover
                                style={{ backgroundColor: "#D7EAF0" }}
                              >
                                <thead className="table-light">
                                  <tr>
                                    <th
                                      style={{
                                        fontFamily: "sans-serif",
                                        backgroundColor: "#D7EAF0",
                                        color: "#003366",
                                      }}
                                    >
                                      SNo.
                                    </th>
                                    <th
                                      style={{
                                        fontFamily: "sans-serif",
                                        backgroundColor: "#D7EAF0",
                                        color: "#003366",
                                      }}
                                    >
                                      Document Date
                                    </th>
                                    <th
                                      className="text-center"
                                      style={{
                                        fontFamily: "sans-serif",
                                        backgroundColor: "#D7EAF0",
                                        color: "#003366",
                                      }}
                                    >
                                      Actions
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {prescriptionDocuments.map((doc, index) => (
                                    <React.Fragment key={doc.id}>
                                      <tr>
                                        <td>{index + 1}</td>
                                        <td>{doc.document_date}</td>
                                        <td className="text-center">
                                          <div className="d-flex justify-content-center align-items-center">
                                            <Button
                                              variant="primary"
                                              className="me-2"
                                              onClick={() =>
                                                handlePreview(doc.id)
                                              }
                                              style={{
                                                backgroundColor: "#295F98",
                                                borderColor: "#0166CB",
                                              }}
                                            >
                                              Preview
                                            </Button>

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
                                                  handleDownloadPrescriptionDoc(
                                                    doc
                                                  )
                                                }
                                              >
                                                Download
                                              </Dropdown.Item>
                                              <Dropdown.Item
                                                onClick={() =>
                                                  handleDeletePrescriptionDoc(
                                                    doc.id
                                                  )
                                                }
                                              >
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

                              <Modal
                                show={showPrescriptionDocsForm}
                                onHide={() =>
                                  setShowPrescriptionDocsForm(false)
                                }
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Upload Prescription File
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <Form>
                                    <Form.Group controlId="formPrescriptionFile">
                                      <Form.Label>Prescription File</Form.Label>
                                      <Form.Control
                                        type="file"
                                        onChange={
                                          handleFileSelectForPrescription
                                        }
                                      />
                                    </Form.Group>
                                  </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    variant="secondary"
                                    onClick={() =>
                                      setShowPrescriptionDocsForm(false)
                                    }
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

                      {showRecordForm &&
                        expandedAppointmentId ===
                          appointment.appointment_id && (
                          <tr>
                            <td colSpan="7">
                              <Card
                                className="shadow-sm mt-3"
                                style={{
                                  borderRadius: "15px",
                                  border: " #0091A5",
                                  background: "#f1f8fb",
                                }}
                              >
                                <Card.Body>
                                  <h2
                                    style={{
                                      fontFamily: "Sans-Serif",
                                      fontWeight: 600,
                                      lineHeight: "46.88px",
                                      textAlign: "left",
                                      width: "225px",
                                      height: "46px",
                                      gap: "0px",
                                      opacity: 1,
                                      color: "#000",
                                    }}
                                  >
                                    Document
                                  </h2>

                                  <Button
                                    variant="outline-primary"
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                      background: "#295F98",
                                      color: "#ffffff",
                                      border: "none",
                                      borderRadius: "5px",
                                    }}
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
                                            <th
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontWeight: "bold",
                                                background: "#D7EAF0",
                                                color: "#003366",
                                              }}
                                            >
                                              Document Name
                                            </th>
                                            <th
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontWeight: "bold",
                                                background: "#D7EAF0",
                                                color: "#003366",
                                              }}
                                            >
                                              Patient Name
                                            </th>
                                            <th
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontWeight: "bold",
                                                background: "#D7EAF0",
                                                color: "#003366",
                                              }}
                                            >
                                              Document Date
                                            </th>
                                            <th
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontWeight: "bold",
                                                background: "#D7EAF0",
                                                color: "#003366",
                                              }}
                                            >
                                              Document Type
                                            </th>
                                            <th
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontWeight: "bold",
                                                background: "#D7EAF0",
                                                color: "#003366",
                                              }}
                                            >
                                              Document File
                                            </th>
                                            <th
                                              style={{
                                                fontFamily: "sans-serif",
                                                background: "#D7EAF0",
                                                fontWeight: "bold",
                                                color: "#003366",
                                              }}
                                            >
                                              Actions
                                            </th>
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
                                                  style={{
                                                    backgroundColor: "#295F98",
                                                    color: "#ffffff",
                                                  }}
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
                                                      handleDeleteRecord(
                                                        record.id
                                                      )
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
                                                formData.document_type ===
                                                "report"
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
                                              <FontAwesomeIcon
                                                icon={faFileAlt}
                                              />{" "}
                                              Report
                                            </Button>
                                            <Button
                                              variant={
                                                formData.document_type ===
                                                "invoice"
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
                                              <FontAwesomeIcon
                                                icon={faReceipt}
                                              />{" "}
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
                                            <Button
                                              onClick={handleAddFileClick}
                                            >
                                              Add a File
                                            </Button>
                                            {selectedFiles.map(
                                              (file, index) => (
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
                                              )
                                            )}
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
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
            ))}
        </Card.Body>
      </div>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
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

      <Modal show={showPreviewModal} onHide={handleClosePreviewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preview Document</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
          {previewFileType.includes("image") ? (
            <img
              src={previewFileUrl}
              alt="Document Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                display: "block",
                margin: "0 auto",
              }}
            />
          ) : previewFileType.includes("pdf") ? (
            <iframe
              src={previewFileUrl}
              title="Document Preview"
              style={{
                width: "100%",
                height: "500px",
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

export default ReceptionBookedAppointment;
