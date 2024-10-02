import React, { useState, useEffect, useRef } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import { jwtDecode } from 'jwt-decode';
import { Modal, Button, Form } from 'react-bootstrap';
 
const AddClinic = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [message, setMessage] = useState('');
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const inputRefs = useRef([]);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        address: '',
        date_of_birth: '',
        profile_pic: '',
        qualification: '',
        specialization: '',
        mobile_number: ''
    });
    const [doctorId, setDoctorId] = useState('');
    const [errors, setErrors] = useState({}); // State to manage errors
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setDoctorId(decodedToken.doctor_id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);
 
    const handleVerify = async () => {
        try {
            const response = await BaseUrl.get(`/clinic/register/?mobile_number=${mobileNumber}`);
            if (response.status === 200) {
                setVerificationStatus(response.data.success);
                setShowOtpModal(true);
            } else {
                setVerificationStatus('Verification failed');
            }
        } catch (error) {
            setVerificationStatus(error.response?.data?.error || 'Verification failed');
        }
    };
 
    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
 
        // Move to the next input field when a digit is entered
        if (value.length === 1 && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };
 
    const handleVerifyOtp = async () => {
        try {
            const enteredOtp = otp.join('');
            const response = await BaseUrl.post('/clinic/register/', {
                mobile_number: mobileNumber,
                otp: enteredOtp,
                doctor_id: doctorId
            });
            if (response.status === 201) {
                setShowOtpModal(false);
                setShowDetailsForm(true);
                localStorage.setItem('mobile_number', mobileNumber);
                setFormData({ ...formData, mobile_number: mobileNumber });
                setMessage(response.data.success);
            } else {
                setVerificationStatus('OTP verification failed');
            }
        } catch (error) {
            setVerificationStatus(error.response?.data?.error || 'OTP verification failed');
        }
    };
 
    const handleResendOtp = async () => {
        try {
            const response = await BaseUrl.get(`/clinic/register/?mobile_number=${mobileNumber}`);
            if (response.status === 200) {
                setMessage(response.data.success);
                setOtp(new Array(6).fill(''));
                inputRefs.current[0].focus(); // Focus on the first input field when resending OTP
            }
        } catch (error) {
            setVerificationStatus(error.response?.data?.error || 'OTP resend failed');
        }
    };
 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
 
        // Validation logic
        let newErrors = { ...errors };
 
        switch (name) {
            case 'name':
                if (!/^[a-zA-Z\s]*$/.test(value)) {
                    newErrors[name] = 'Name should contain only alphabets';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'address':
                if (!value.trim()) {
                    newErrors[name] = 'Address cannot be blank';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'gender':
                if (!value) {
                    newErrors[name] = 'Gender is required';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'date_of_birth':
                if (!value) {
                    newErrors[name] = 'Date of birth is required';
                } else {
                    delete newErrors[name];
                }
                break;
            default:
                break;
        }
 
        setErrors(newErrors);
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        try {
            const response = await BaseUrl.post('/clinic/details/', data);
            if (response.status === 201) {
                setMessage(response.data.success);
            } else {
                setMessage('Form submission failed');
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'Form submission failed');
        }
    };
 
    return (
        <div className="container mt-5">
            <h2>Manage Clinic</h2>
            {!showDetailsForm && (
                <div className="form-group row">
                    <label htmlFor="mobileNumber" className="col-sm-2 col-form-label">Mobile Number:</label>
                    <div className="col-sm-8">
                        <input
                            type="text"
                            className="form-control"
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <button className="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={handleVerify}>Verify</button>
                    </div>
                </div>
            )}
            {verificationStatus && (
                <div className="mt-3 alert alert-info">
                    {verificationStatus}
                </div>
            )}
            {showDetailsForm && (
                <Form onSubmit={handleSubmit} className="mt-4" encType="multipart/form-data">
                    <div className="row">
                        <Form.Group controlId="formProfilePic" className="col-md-4">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" name="profile_pic" onChange={handleInputChange} />
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formMobileNumber" className="col-md-4">
                            <Form.Label>Mobile Number</Form.Label><span className="text-danger">*</span> {/* Mandatory indicator */}
                            <Form.Control type="text" name="mobile_number" value={formData.mobile_number} disabled />
                        </Form.Group>
                        <Form.Group controlId="formName" className="col-md-4">
                            <Form.Label>Name</Form.Label><span className="text-danger">*</span> {/* Mandatory indicator */}
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                            {errors.name && <p className="text-danger">{errors.name}</p>}
                        </Form.Group>
                        <Form.Group controlId="formGender" className="col-md-4">
                            <Form.Label>Gender</Form.Label><span className="text-danger">*</span> {/* Mandatory indicator */}
                            <Form.Control as="select" name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                            {errors.gender && <p className="text-danger">{errors.gender}</p>}
                        </Form.Group>
                    </div>
                    <div className="row mt-3">
                        <Form.Group controlId="formDateOfBirth" className="col-md-4">
                            <Form.Label>Date of Birth</Form.Label><span className="text-danger">*</span> {/* Mandatory indicator */}
                            <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} max={today} onChange={handleInputChange} />
                            {errors.date_of_birth && <p className="text-danger">{errors.date_of_birth}</p>}
                        </Form.Group>
                        <Form.Group controlId="formQualification" className="col-md-4">
                            <Form.Label>Qualification</Form.Label>
                            <Form.Control type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="formSpecialization" className="col-md-4">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Control type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} />
                        </Form.Group>
                    </div>
                    <div className="row mt-3">
                        <Form.Group controlId="formAddress" className="col-md-12">
                            <Form.Label>Address</Form.Label><span className="text-danger">*</span> {/* Mandatory indicator */}
                            <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} />
                            {errors.address && <p className="text-danger">{errors.address}</p>}
                        </Form.Group>
                    </div>
                    <Button variant="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} type="submit" className="mt-3">Submit</Button>
                    {message && <p className="mt-3 alert alert-info">{message}</p>}
                </Form>
            )}
            <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>OTP Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="otp-container d-flex justify-content-between mb-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="form-control otp-input"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                ref={(el) => (inputRefs.current[index] = el)}
                            />
                        ))}
                    </div>
                    <Button variant="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={handleVerifyOtp}>Verify OTP</Button>
                    <Button variant="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={handleResendOtp} className="ms-2">Resend OTP</Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};
 
export default AddClinic;