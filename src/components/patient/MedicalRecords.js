import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row, Table, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faReceipt, faPrescription, faTimes, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import BaseUrl from '../../api/BaseUrl';

const MedicalRecords = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileType, setPreviewFileType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    document_name: "",
    patient_name: "",
    document_date: "",
    document_type: "",
    document_file: "",
  });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('patient_token');
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const mobile_number = decodedToken.mobile_number;
      setMobileNumber(mobile_number);

      setFormData(prevFormData => ({
        ...prevFormData,
        mobile_number: mobile_number
      }));

      fetchMedicalRecords(mobile_number);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  const fetchMedicalRecords = async (mobile_number) => {
    if (!mobile_number) return;

    try {
      const response = await BaseUrl.get(`/patient/patientdocument/?mobile_number=${mobile_number}`);
      if (response.data.success) {
        // Set message from backend when no documents are available
        setMedicalRecords([]);
        setSuccessMessage(response.data.success);
      } else if (Array.isArray(response.data)) {
        setMedicalRecords(response.data);
        setSuccessMessage(""); // Clear message if documents are present
      } 
    } catch (error) {
      console.error("Error fetching medical records:", error);
      // setMedicalRecords([]);
    }
  };
  

  const fetchPatientName = async (patientId) => {
    try {
      const response = await BaseUrl.get(`/patient/patientname/?patient_id=${patientId}`);
      return response.data.name;
    } catch (error) {
      console.error("Error fetching patient name:", error);
      return "";
    }
  };

  const toggleFormModal = async () => {
    if (!showFormModal) {
      const token = localStorage.getItem('patient_token');
      const decoded = jwtDecode(token);
      const patientId = decoded.patient_id;
      const patientName = await fetchPatientName(patientId);
      setFormData((prevFormData) => ({
        ...prevFormData,
        patient_name: patientName,
      }));
    } else {
      setFormData({
        document_name: "",
        patient_name: "",
        document_date: "",
        document_type: "",
        document_file: "",
      });
      setSelectedFiles([]);
      setEditingRecordId(null);
    }
    setShowFormModal(!showFormModal);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("mobile_number", mobileNumber);
    formDataToSend.append("document_name", formData.document_name);
    formDataToSend.append("patient_name", formData.patient_name);
    formDataToSend.append("document_date", formData.document_date);
    formDataToSend.append("document_type", formData.document_type);

    if (selectedFiles.length > 0) {
      formDataToSend.append("document_file", selectedFiles[0]);
    }

    try {
      if (editingRecordId) {
        // Update existing record
        await BaseUrl.put(`/patient/patientdocument/`, formDataToSend);
        setSuccessMessage("Medical record updated successfully.");
      } else {
        // Create new record
        await BaseUrl.post(`/patient/patientdocument/`, formDataToSend);
        setSuccessMessage("Medical record saved successfully.");
      }
      setShowFormModal(false);
      fetchMedicalRecords(mobileNumber);
    } catch (error) {
      console.error("Error saving medical record:", error);
      setErrorMessage("Failed to save the medical record. Please try again.");
    }
  };

  const handleCloseMessageModal = () => {
    setSuccessMessage('');
    setErrorMessage('');
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
      await BaseUrl.delete(`/patient/patientdocument/`, {
        params: {
          mobile_number: mobileNumber,
          document_id: recordId,
        },
      });
      fetchMedicalRecords(mobileNumber); // Refresh the list of medical records
      setSuccessMessage("Medical record deleted successfully.");
    } catch (error) {
      console.error("Error deleting medical record:", error);
      setErrorMessage("Failed to delete the medical record. Please try again.");
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

  const handleDownloadFile = async (record) => {
    try {
      const response = await BaseUrl.get(`/patient/viewdocument/`, {
        params: {
          patient_id: record.patient,
          document_id: record.id
        },
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${record.document_name}.${response.data.type.split('/')[1]}`;
      link.click();
    } catch (error) {
      console.error("Error downloading document:", error);
      setErrorMessage("Failed to download the document. Please try again.");
    }
  };

  const handleViewFile = async (record) => {
    try {
      const response = await BaseUrl.get(`/patient/viewdocument/`, {
        params: {
          patient_id: record.patient,
          document_id: record.id,
        },
        responseType: 'blob',
      });

      const fileType = response.data.type;
      const url = URL.createObjectURL(response.data);

      setPreviewFileType(fileType);
      setPreviewFileUrl(url);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error fetching document:", error);
      setErrorMessage("Document not found for this patient.");
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFileUrl("");
    setPreviewFileType("");
  };

  return (
    <Container fluid>
      <Row className="mb-5">
        <Col xs={12} md={12}>
          <Button
            variant="outline-primary"
            className="float-end mb-5"
            onClick={toggleFormModal}
          >
            Upload Records
          </Button>

          {/* Always display the table, even if there are no records */}
          <Table striped bordered hover>
            <thead>
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
              {medicalRecords.length > 0 ? (
                medicalRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.document_name}</td>
                    <td>{record.patient_name}</td>
                    <td>{record.document_date}</td>
                    <td>{record.document_type}</td>
                    <td>
                      <Button onClick={() => handleViewFile(record)}>View</Button>
                    </td>
                    <td>
                      <DropdownButton
                        id="dropdown-basic-button"
                        title={<FontAwesomeIcon icon={faEllipsisV} />}
                        variant="secondary"
                      >
                        <Dropdown.Item onClick={() => handleModifyRecord(record)}>
                          Modify
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDownloadFile(record)}>
                          Download
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeleteRecord(record.id)}>
                          Delete
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showFormModal} onHide={toggleFormModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRecordId ? "Edit Medical Record" : "Upload Medical Record"}</Modal.Title>
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
                    formData.document_type === "prescription"
                      ? "primary"
                      : "outline-primary"
                  }
                  className="me-2"
                  onClick={() =>
                    setFormData({ ...formData, document_type: "prescription" })
                  }
                >
                  <FontAwesomeIcon icon={faPrescription} /> Prescription
                </Button>
                <Button
                  variant={
                    formData.document_type === "invoice" ? "primary" : "outline-primary"
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
                    <Button variant="danger" size="sm" onClick={() => handleDeleteFile(index)}>
                      <FontAwesomeIcon icon={faTimes} />
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

      <Modal show={showPreviewModal} onHide={handleClosePreviewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewFileUrl && (
            previewFileType === 'application/pdf' ? (
              <embed src={previewFileUrl} width="100%" height="400px" type="application/pdf" />
            ) : (
              <img src={previewFileUrl} alt="Document preview" style={{ width: "100%" }} />
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreviewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!errorMessage || !!successMessage} onHide={handleCloseMessageModal}>
        <Modal.Header closeButton>
          <Modal.Title>{errorMessage ? 'Error' : 'Success'}</Modal.Title>
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
    </Container>
  );
};

export default MedicalRecords;

