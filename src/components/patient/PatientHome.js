// import React, { useState, useEffect, useRef } from 'react';
// import { Modal, Container, Row, Col, Card, Button, Alert} from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import onlineconsultation from '../../images/free-consultation.png';
// import finddoctor from '../../images/finddoc.png';
// import bookappointment from '../../images/Interaction.jpg';
// import prescription from '../../images/prescription.jpg';
// import myappointment from '../../images/myappointment.jpg';
// import mydocument from '../../images/patient.file.jpg';
// import '../../css/PatientHome.css';
// import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';
// import BaseUrl from '../../api/BaseUrl';
// import '../../css/SearchResult.css';
// import { format, addDays } from 'date-fns';
 
// const PatientHome = () => {
//   const [location, setLocation] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [patientDetails, setPatientDetails] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showSlots, setShowSlots] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [selectedDateIndex, setSelectedDateIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [slots, setSlots] = useState({});
//   const [errorMessage, setErrorMessage] = useState('');
//   const [availableDates, setAvailableDates] = useState([]);
//   const [query, setQuery] = useState('');
//   const [slotCounts, setSlotCounts] = useState(Array(3).fill(null));
//   const [results, setResults] = useState([]);
//   const [fetchedDates, setFetchedDates] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [completedIndex, setCompletedIndex] = useState(0);
//   const [canceledIndex, setCanceledIndex] = useState(0);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [completedAppointments, setCompletedAppointments] = useState([]);
//   const [canceledAppointments, setCanceledAppointments] = useState([]);
//   const resultsRef = useRef(null);
 
//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(':');
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     const options = { hour: 'numeric', minute: 'numeric', hour12: true };
//     return new Intl.DateTimeFormat('en-US', options).format(date);
//   };
 
//   const formatDate = (dateString) => {
//     const options = { month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
 
//   const formatDay = (dateString) => {
//     const options = { weekday: 'short' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
 
//   const handleInputChange = async (e) => {
//     const { value } = e.target;
//     setSearchTerm(value);
//     if (value.trim().length < 3) {
//       setResults([]); // Clear results if search query is less than 3 characters
//       return;
//     }
//     try {
//       const response = await BaseUrl.get('/doctor/searchdoctor/', {
//         params: { query: value }
//       });
//       setResults(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
 
//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//   };
 
 
//   const handleDateChange = (index) => {
//     const selectedDate = availableDates[index];
//     setSelectedDateIndex(index);
//     fetchSlots(selectedDate);
//   };
 
//   const handleSlotClick = (slot) => {
//     setSelectedSlot(slot);
//     setIsModalOpen(true);
//   };
 
//   const handleConfirmAppointment = async () => {
//     if (!selectedDoctor || !selectedSlot) return;
 
//     try {
//       setLoading(true);
//       const patient_token = localStorage.getItem('patient_token');
//       if (!patient_token) {
//         throw new Error('No patient token found');
//       }
 
//       const decodedToken = JSON.parse(atob(patient_token.split('.')[1]));
//       const patient_id = decodedToken.patient_id;
 
//       if (!patient_id) {
//         throw new Error('No patient ID found in token');
//       }
 
//       const response = await BaseUrl.post('/patientappointment/bookslot/', {
//         doctor: selectedDoctor.id,
//         patient: patient_id,
//         appointment_status: " ",
//         appointment_slot: selectedSlot.id
//       });
 
//       if (response && response.data) {
//         setPatientDetails({
//           patientId: response.data.patientId,
//           appointmentStatus: response.data.appointmentStatus
//         });
//         setIsModalOpen(false);
//         setSuccessMessage(response.data.success);
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (error) {
//       console.error('Error confirming booking:', error.message);
//       setErrorMessage('Failed to confirm appointment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const handleCancelAppointment = () => {
//     setIsModalOpen(false);
//   };
 
//   const handleClick = (doctor) => {
//     setSelectedDoctor(doctor);
//     setResults([]); // Automatically close search results when a doctor is selected
//   };
 
//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };
 
//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, upcomingAppointments.length - 1));
//   };
 
//   const handleCompletedPrevious = () => {
//     setCompletedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };
 
//   const handleCompletedNext = () => {
//     setCompletedIndex((prevIndex) => Math.min(prevIndex + 1, canceledAppointments.length - 1));
//   };
//   const handleCanceledPrevious = () => {
//     setCanceledIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };
 
//   const handleCanceledNext = () => {
//     setCanceledIndex((prevIndex) => Math.min(prevIndex + 1, canceledAppointments.length - 1));
//   };
 
//   const fetchSlots = async (selectedDate) => {
//     if (!selectedDoctor || !selectedDate) return;
 
//     try {
//       setLoading(true);
//       const slotsResponse = await BaseUrl.get(`/doctorappointment/blankslot/?doctor_id=${selectedDoctor.id}&slot_date=${selectedDate}`);
//       const slotsData = slotsResponse.data;
//       setSlots(slotsData);
//       setShowSlots(true);
//     } catch (error) {
//       console.error('Error fetching slots:', error);
//       setSlots([]); // Reset slots to an empty array on error
//       setErrorMessage('Failed to fetch slots. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (resultsRef.current && !resultsRef.current.contains(event.target)) {
//         setResults([]);
//       }
//     };
 
//     document.addEventListener('click', handleClickOutside);
 
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);
 
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const locationResponse = await BaseUrl.get('/patient/location/');
//         const { city, state } = locationResponse.data;
//         const locationString = `${city}, ${state}`;
//         setLocation(locationString); // Set location state
//       } catch (error) {
//         console.error('Error fetching location data:', error);
//       }
//     };
 
//     fetchLocationData(); // Call the fetchLocationData function when the component mounts
//   }, []);
 
//   useEffect(() => {
//     // Initialize available dates: today, tomorrow, and a future date (16 Aug)
//     const today = new Date();
//     const dates = [
//       format(today, 'yyyy-MM-dd'),
//       format(addDays(today, 1), 'yyyy-MM-dd'),
//       format(addDays(today, 2), 'yyyy-MM-dd'),
 
//     ];
//     setAvailableDates(dates);
 
//     // Fetch the slot counts for these dates
//     fetchSlotCounts(dates);
//   }, [selectedDoctor]);
 
//   const fetchSlotCounts = async (dates) => {
//     if (!selectedDoctor) return;
 
//     try {
//       const countResponse = await BaseUrl.get(`/clinic/countavailableslots/?doctor_id=${selectedDoctor.id}&dates=${dates.join('&dates=')}`);
//       const countData = countResponse.data;
//       const newSlotCounts = dates.map(date => {
//         const dateCount = countData.find(item => item.date === date);
//         return dateCount ? dateCount.count : 0;
//       });
 
//       setSlotCounts(newSlotCounts);
//     } catch (error) {
//       console.error('Error fetching slot counts:', error);
//       setSlotCounts(dates.map(() => 0)); // Set all counts to 0 on error
//       setErrorMessage('Failed to fetch slot counts. Please try again.');
//     }
//   };
 
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const patient_token = localStorage.getItem('patient_token');
//         if (!patient_token) {
//           throw new Error('No patient token found');
//         }
 
//         const decodedToken = JSON.parse(atob(patient_token.split('.')[1]));
//         const patient_id = decodedToken.patient_id;
 
//         if (!patient_id) {
//           throw new Error('No patient ID found in token');
//         }
 
//         const response = await BaseUrl.get(`/patient/patient/?patient_id=${patient_id}`);
//         const appointments = response.data;
 
//         const upcoming = appointments.filter(
//           (appointment) =>
//             !appointment.is_blocked &&
//             !appointment.is_canceled &&
//             !appointment.is_complete &&
//             appointment.is_booked
//         );
 
//         const completed = appointments.filter(
//           (appointment) =>
//             !appointment.is_blocked &&
//             !appointment.is_canceled &&
//             appointment.is_complete &&
//             appointment.is_booked
//         );
 
//         const canceled = appointments.filter(
//           (appointment) =>
 
//             appointment.is_canceled &&
 
//             appointment.is_booked
//         );
 
//         setUpcomingAppointments(upcoming);
//         setCompletedAppointments(completed);
//         setCanceledAppointments(canceled);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       }
//     };
 
//     fetchAppointments();
//   }, []);
 
//   const renderCards = () => {
//     const cardData = [
//       { image: onlineconsultation, title: 'Online Consultation', text: 'Description for online consultation.' },
//       { image: finddoctor, title: 'Find Doctor near you', text: 'Find doctors available near your location.', link: '/patient/bookappointment' },
//       { image: bookappointment, title: 'Book Appointment', text: 'Easily book appointments online.', link: '/patient/bookappointment' },
//       { image: prescription, title: 'Prescription & Vitals', text: 'Manage your prescriptions and vitals.' },
//       { image: myappointment, title: 'My Appointments', text: 'View and manage your appointments.', link: '/patient/slots' },
//       { image: mydocument, title: 'My Documents', text: 'Upload and manage your document.', link: '/patient/medicalrecords' },
//     ];
 
//     return cardData.map((card, index) => (
//       <Col key={index} className="mb-4" xs={12} md={4}>
//         <Card className="h-100 shadow-sm patient-card">
//           <Card.Img variant="top" src={card.image} alt={card.title} className="patient-card-img" />
//           <Card.Body>
//             <Card.Title className="patient-card-title">{card.title}</Card.Title>
//             <Card.Text className="patient-card-text">{card.text}</Card.Text>
//             {card.link ? (
//               <Button as={Link} to={card.link} variant="primary">Go to {card.title}</Button>
//             ) : (
//               <Button variant="primary" disabled>No Link</Button>
//             )}
//           </Card.Body>
//         </Card>
//       </Col>
//     ));
//   };
 
//   const renderAppointments = (title, appointments, handlePrevious, handleNext, currentIndex) => {
//     const isPreviousDisabled = currentIndex === 0;
//     const isNextDisabled = currentIndex >= appointments.length - 1;
 
//     return (
//       <div className="mb-4">
//         <h3 className="text-center">{title}</h3>
//         <Row className="text-center align-items-center">
//           <Col xs="auto">
//             <Button
//               variant="outline-primary"
//               onClick={handlePrevious}
//               disabled={isPreviousDisabled}
//               style={{
//                 color: isPreviousDisabled ? '#A9A9A9' : '',
//                 borderColor: isPreviousDisabled ? '#A9A9A9' : ''
//               }}
//             >
//               <BsChevronLeft />
//             </Button>
//           </Col>
//           {appointments.slice(currentIndex, currentIndex + 1).map((appointment, index) => (
//             <Col key={index} md={8} className="mb-4">
//               <Card className="h-100 shadow-sm appointment-card">
//                 <Card.Body>
//                   <Card.Title className="appointment-time">
//                     <div>Date: {formatDate(appointment.appointment_date)}</div>
//                     <div>Time: {formatTime(appointment.appointment_slot)}</div>
//                   </Card.Title>
//                   <Card.Text className="appointment-details">{appointment.details}</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//           <Col xs="auto">
//             <Button
//               variant="outline-primary"
//               onClick={handleNext}
//               disabled={isNextDisabled}
//               style={{
//                 color: isNextDisabled ? '#A9A9A9' : '',
//                 borderColor: isNextDisabled ? '#A9A9A9' : ''
//               }}
//             >
//               <BsChevronRight />
//             </Button>
//           </Col>
//         </Row>
//       </div>
//     );
//   };
 
 
//   const PatientDetailsModal = ({ isOpen, onClose, appointmentStatus, onConfirm, onCancel }) => {
//     return (
//       <Modal show={isOpen} onHide={onClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Appointment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Click on CONFIRM to confirm your appointment {appointmentStatus}</p>
//           <div className="modal-actions d-flex justify-content-between">
//             <Button variant="secondary" onClick={onCancel}>Cancel</Button>
//             <Button variant="primary" onClick={onConfirm}>Confirm</Button>
//           </div>
//         </Modal.Body>
//       </Modal>
//     );
//   };
 
//   return (
//     <Container fluid className="p-5 bg-light patient-container">
//       <header className="mb-5 patient-header text-center">
//         <h1>Welcome to Patient Portal</h1>
//         <h2 className="text-primary">Find and Book</h2>
//       </header>
 
//       <div className="mb-4 text-center">
//         <div className="input-group search-group">
//           <input
//             type="text"
//             className="form-control"
//             value={location}
//             onChange={handleLocationChange}
//             placeholder="Your location"
//           />
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search Doctors / Specialization..."
//             aria-label="Search"
//             value={searchTerm}
//             onChange={handleInputChange}
//           />
//         </div>
//         {selectedDoctor && (
//           <Card className="selected-doctor-card">
//             <Card.Body>
//               {/* <div style={{ position: 'relative', width: '100%', height: '200px' }}> */}
//               {/* Your other content here */}
 
//               <Button
//                 variant="dark"
//                 className="close-button"
//                 onClick={() => setSelectedDoctor(null)}
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   right: '30px',
//                 }}
//               >
//                 <BsX />
//               </Button>
//               {/* </div> */}
//               <Row>
//                 <Col md={8}>
//                   {selectedDoctor.profile_pic && (
//                     <Card.Img variant="top" src={selectedDoctor.profile_pic} alt={selectedDoctor.name} />
//                   )}
//                   <Card.Title>{selectedDoctor.name}</Card.Title>
//                   <Card.Text>Specializations: {selectedDoctor.specializations}</Card.Text>
//                   <Card.Text>Experience: {selectedDoctor.experience} years</Card.Text>
//                   <Card.Text>Address: {selectedDoctor.address}</Card.Text>
//                   <Card.Text>Qualifications: {selectedDoctor.qualification}</Card.Text>
//                   <Card.Text>{selectedDoctor.details}</Card.Text>
//                 </Col>
//                 <Col md={4} className="d-flex align-items-center">
//                   <Button variant="primary" onClick={() => handleDateChange(0)} className="w-50">
//                     Book Slot <br /><small>No Booking Fee</small>
//                   </Button>
//                 </Col>
//               </Row>
//               {showSlots && (
//                 <div className="mt-3">
//                   <h3>Select Slot</h3>
//                   <div className="date-buttons mb-3 d-flex justify-content-between">
//                     {availableDates.map((date, index) => (
//                       <div key={index} className="text-center me-2">
//                         <Button
//                           variant={selectedDateIndex === index ? "primary" : "outline-primary"}
//                           className="date"
//                           onClick={() => handleDateChange(index)}
//                         >
//                           {index === 0 ? "Today" : index === 1 ? "Tomorrow" : `${formatDay(date)} (${formatDate(date)})`}
//                         </Button>
//                         <div>
//                           <span className={`slot-count ${slotCounts[index] > 0 ? 'text-success' : 'text-danger'}`}>
//                             {slotCounts[index] > 0 ? `${slotCounts[index]} slots available` : '0 slots available'}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
 
 
//                   {loading ? (
//                     <p>Loading slots...</p>
//                   ) : (
//                     <div className="slots-section">
//                       {Array.isArray(slots) && slots.length > 0 ? (
//                         slots.map((slot) => (
//                           <Button
//                             key={slot.id}
//                             variant="outline-primary"
//                             className="me-2 mb-2"
//                             onClick={() => handleSlotClick(slot)}
//                           >
//                             {formatTime(slot.appointment_slot)}
//                           </Button>
//                         ))
//                       ) : (
//                         <p>No slots available.</p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         )}
 
//         <PatientDetailsModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           appointmentStatus={patientDetails.appointmentStatus}
//           onConfirm={handleConfirmAppointment}
//           onCancel={handleCancelAppointment}
//         />
//         {successMessage && <Alert variant="success">{successMessage}</Alert>}
//         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//         <div ref={resultsRef}>
//           {searchTerm.trim().length >= 3 && results.length > 0 && !selectedDoctor && (
//             <div className="search-results">
//               {results.map((result, index) => (
//                 <Card key={index} onClick={() => handleClick(result)} className="search-result">
//                   <Card.Body className='card-result'>
//                     {result.profile_pic ? (
//                       <img src={result.profile_pic} alt={result.name} className="profile-pic" />
//                     ) : (
//                       <div className="no-profile-pic">No Picture</div>
//                     )}
//                     <div className="doctor-details">
//                       <Card.Title className="doctor-name">{result.name}</Card.Title>
//                       <Card.Text className="specialization">{result.specializations}</Card.Text>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
 
//       <Row className="main-content">
//         <Col md={7}>
//           <Row className="row-cards">
//             {renderCards()}
//           </Row>
//         </Col>
//         <Col md={5} className="right-panel">
//           {renderAppointments('Upcoming Appointments', upcomingAppointments, handlePrevious, handleNext, currentIndex)}
//           {renderAppointments('Completed Appointments', completedAppointments, handleCompletedPrevious, handleCompletedNext, completedIndex)}
//           {renderAppointments('Canceled Appointments', canceledAppointments, handleCanceledPrevious, handleCanceledNext, canceledIndex)}
//         </Col>
//       </Row>
//     </Container>
//   );
 
// };
// export default PatientHome;




import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import onlineconsultation from '../../images/free-consultation.png';
import finddoctor from '../../images/finddoc.png';
import bookappointment from '../../images/Interaction.jpg';
import prescription from '../../images/prescription.jpg';
import myappointment from '../../images/myappointment.jpg';
import mydocument from '../../images/patient.file.jpg';
import '../../css/PatientHome.css';
import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';
import BaseUrl from '../../api/BaseUrl';
import '../../css/SearchResult.css';
import { format, addDays } from 'date-fns';
 
const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
 
const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
 
const formatDay = (dateString) => {
  const options = { weekday: 'short' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
 
const isMorning = (time) => {
  const hour = parseInt(time.split(':')[0], 10);
  return hour >= 6 && hour < 12;
};
 
const isAfternoon = (time) => {
  const hour = parseInt(time.split(':')[0], 10);
  return hour >= 12 && hour < 18;
};
 
const isEvening = (time) => {
  const hour = parseInt(time.split(':')[0], 10);
  return hour >= 18 && hour < 24;
};
 
const PatientDetailsModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  handleSaveDetails,
  name,
  mobile,
  dob,
  age,
  bloodGroup,
  gender,
  address,
  sameAsAppointment,
  setName,
  setMobile,
  setDob,
  setAge,
  setBloodGroup,
  setGender,
  setAddress,
  setSameAsAppointment,
  detailsFetched // New prop to indicate whether details were fetched
}) => {
  const [altName, setAltName] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [altDob, setAltDob] = useState('');
  const [altAge, setAltAge] = useState('');
  const [altBloodGroup, setAltBloodGroup] = useState('');
  const [altGender, setAltGender] = useState('');
  const [altAddress, setAltAddress] = useState('');
 
  const [manualName, setManualName] = useState(false);
  const [manualMobile, setManualMobile] = useState(false);
  const [manualDob, setManualDob] = useState(false);
  const [manualBloodGroup, setManualBloodGroup] = useState(false);
  const [manualGender, setManualGender] = useState(false);
  const [manualAddress, setManualAddress] = useState(false);
 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  const detailsAvailable = name && mobile && dob && bloodGroup && gender && address;
 
  useEffect(() => {
    const storedMobileNumber = localStorage.getItem('mobile_number');
    if (storedMobileNumber) {
      setMobile(storedMobileNumber);
    }
  }, [setMobile]);
 
  useEffect(() => {
    if (sameAsAppointment) {
      if (!manualName) setAltName(name);
      if (!manualMobile) setAltMobile(mobile);
      if (!manualDob) setAltDob(dob);
      if (!manualBloodGroup) setAltBloodGroup(bloodGroup);
      if (!manualGender) setAltGender(gender);
      if (!manualAddress) setAltAddress(address);
    } else if (!detailsAvailable) {
      if (!manualName) setAltName('');
      if (!manualMobile) setAltMobile('');
      if (!manualDob) setAltDob('');
      if (!manualBloodGroup) setAltBloodGroup('');
      if (!manualGender) setAltGender('');
      if (!manualAddress) setAltAddress('');
    }
  }, [sameAsAppointment, detailsAvailable, name, mobile, dob, bloodGroup, gender, address, manualName, manualMobile, manualDob, manualBloodGroup, manualGender, manualAddress]);
 
  const handleAltNameChange = (e) => {
    setManualName(true);
    setAltName(e.target.value);
  };
 
  const handleAltMobileChange = (e) => {
    setManualMobile(true);
    setAltMobile(e.target.value);
  };
 
  const handleAltDobChange = (e) => {
    setManualDob(true);
    setAltDob(e.target.value);
  };
 
  const handleAltBloodGroupChange = (e) => {
    setManualBloodGroup(true);
    setAltBloodGroup(e.target.value);
  };
 
  const handleAltGenderChange = (e) => {
    setManualGender(true);
    setAltGender(e.target.value);
  };
 
  const handleAltAddressChange = (e) => {
    setManualAddress(true);
    setAltAddress(e.target.value);
  };
 
  const handleSubmit = async () => {
    const patientDetails = {
      name: altName,
      mobile_number: altMobile,
      date_of_birth: altDob,
      blood_group: altBloodGroup,
      gender: altGender.toLowerCase(),
      address: altAddress,
    };
 
    const patientId = await handleSaveDetails(patientDetails);
 
    if (patientId) {
      setShowConfirmModal(true);
    } else {
      setErrorMessage('Failed to save details. Please try again.');
    }
  };
 
  const handleConfirmBooking = () => {
    setShowConfirmModal(false);
    onConfirm();
  };
 
  return (
    <>
      <Modal show={isOpen} onHide={onClose} centered size="xl">
        <Modal.Header closeButton style={{ backgroundColor: '#D1E9F6', color: '#000', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Modal.Title style={{ margin: 0 }}>Kindly Fill Your Details !!</Modal.Title>
          </div>
        </Modal.Header>
 
        <Modal.Body style={{ padding: '20px 30px' }}>
          <h4>Permanent Details</h4>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: 'bold' }}>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: '5px', padding: '10px' }}
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: 'bold' }}>Mobile No</label>
                <input
                  type="text"
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={{ borderRadius: '5px', padding: '10px' }}
                  disabled
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: 'bold' }}>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ borderRadius: '5px', padding: '10px' }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: 'bold' }}>Blood Group</label>
                <input
                  type="text"
                  className="form-control"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{ borderRadius: '5px', padding: '10px' }}
                />
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: 'bold' }}>Gender</label>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ borderRadius: '5px', padding: '10px' }}
                >
                  <option value="select">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-4 form-group">
                <label style={{ fontWeight: 'bold' }}>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ borderRadius: '5px', padding: '10px' }}
                />
              </div>
            </div>
 
            {/* Conditionally render varying details if details were not fetched */}
            {!detailsFetched && (
              <>
                <div className="form-check my-4" style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={sameAsAppointment}
                    onChange={() => setSameAsAppointment(!sameAsAppointment)}
                    style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                  />
                  <label className="form-check-label" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Same as appointment details
                  </label>
                </div>
                <h4>Varying Details</h4>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: 'bold' }}>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={altName}
                      onChange={handleAltNameChange}
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: sameAsAppointment ? '#e9ecef' : '#fff',
                      }}
                      disabled={sameAsAppointment}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: 'bold' }}>Mobile No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={altMobile}
                      onChange={handleAltMobileChange}
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: sameAsAppointment ? '#e9ecef' : '#fff',
                      }}
                      disabled={sameAsAppointment}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: 'bold' }}>Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={altDob}
                      onChange={handleAltDobChange}
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: sameAsAppointment ? '#e9ecef' : '#fff',
                      }}
                      disabled={sameAsAppointment}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: 'bold' }}>Blood Group</label>
                    <input
                      type="text"
                      className="form-control"
                      value={altBloodGroup}
                      onChange={handleAltBloodGroupChange}
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: sameAsAppointment ? '#e9ecef' : '#fff',
                      }}
                      disabled={sameAsAppointment}
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: 'bold' }}>Gender</label>
                    <select
                      className="form-control"
                      value={altGender}
                      onChange={handleAltGenderChange}
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: sameAsAppointment ? '#e9ecef' : '#fff',
                      }}
                      disabled={sameAsAppointment}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-4 form-group">
                    <label style={{ fontWeight: 'bold' }}>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={altAddress}
                      onChange={handleAltAddressChange}
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: sameAsAppointment ? '#e9ecef' : '#fff',
                      }}
                      disabled={sameAsAppointment}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
 
          <div className="modal-actions d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={onCancel} style={{ padding: '10px 20px', fontSize: '1.1rem' }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '1.1rem' }}>
              Save Details
            </Button>
          </div>
        </Modal.Body>
      </Modal>
 
      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to confirm this appointment?</p>
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmBooking}>
              Confirm
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
const PatientHome = () => {
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // const [patientDetails, setPatientDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [query, setQuery] = useState('');
  const [slotCounts, setSlotCounts] = useState(Array(3).fill(null));
  const [patientId, setPatientId] = useState(null); // Store patient ID after saving
  const [results, setResults] = useState([]);
  // const [fetchedDates, setFetchedDates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndex, setCompletedIndex] = useState(0);
  const [canceledIndex, setCanceledIndex] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const resultsRef = useRef(null);
 
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
 
  const [sameAsAppointment, setSameAsAppointment] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
 
  const [altName, setAltName] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [altDob, setAltDob] = useState('');
  const [altAge, setAltAge] = useState('');
  const [altBloodGroup, setAltBloodGroup] = useState('');
  const [altGender, setAltGender] = useState('');
  const [altAddress, setAltAddress] = useState('');
 
  const history = useHistory(); // Initialize the useNavigate hook
 
 
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const handleInputChange = async (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (value.trim().length < 3) {
      setResults([]); // Clear results if search query is less than 3 characters
      return;
    }
    try {
      const response = await BaseUrl.get('/doctor/searchdoctor/', {
        params: { query: value }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  // Effect to handle clicks outside the results container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setResults([]);
      }
    };
 
    document.addEventListener('click', handleClickOutside);
 
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  // Effect to fetch location data once when the component mounts
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationResponse = await BaseUrl.get('/patient/location/');
        const { city, state } = locationResponse.data;
        const locationString = `${city}, ${state}`;
        setLocation(locationString); // Set location state
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
 
    fetchLocationData(); // Call the fetchLocationData function when the component mounts
  }, []);
 
  useEffect(() => {
    // Initialize available dates: today, tomorrow, and the day after tomorrow
    const today = new Date();
    const dates = [
      format(today, 'yyyy-MM-dd'),
      format(addDays(today, 1), 'yyyy-MM-dd'),
      format(addDays(today, 2), 'yyyy-MM-dd'),
    ];
    setAvailableDates(dates);
 
    // Fetch the slot counts for these dates
    fetchSlotCounts(dates);
  }, [selectedDoctor]);
 
  const fetchSlotCounts = async (dates) => {
    if (!selectedDoctor) return;
 
    try {
      const countResponse = await BaseUrl.get(`/clinic/countavailableslots/?doctor_id=${selectedDoctor.id}&dates=${dates.join('&dates=')}`);
      const countData = countResponse.data;
      const newSlotCounts = dates.map(date => {
        const dateCount = countData.find(item => item.date === date);
        return dateCount ? dateCount.count : 0;
      });
 
      setSlotCounts(newSlotCounts);
    } catch (error) {
      console.error('Error fetching slot counts:', error);
      setSlotCounts(dates.map(() => 0)); // Set all counts to 0 on error
      setErrorMessage('Failed to fetch slot counts. Please try again.');
    }
  };
 
  const fetchSlots = async (selectedDate) => {
    if (!selectedDoctor || !selectedDate) return;
 
    try {
      setLoading(true);
      const slotsResponse = await BaseUrl.get(`/doctorappointment/blankslot/?doctor_id=${selectedDoctor.id}&slot_date=${selectedDate}`);
      const slotsData = slotsResponse.data;
      setSlots(slotsData);
      setShowSlots(true);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]); // Reset slots to an empty array on error
      setErrorMessage('Failed to fetch slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const handleSlotClick = async (slot) => {
    setSelectedSlot(slot);
 
    try {
      // Extract the mobile number from the patient_token or from local storage
      const mobile_number = localStorage.getItem('mobile_number');
 
      // Fetch patient details using the mobile number
      const response = await BaseUrl.get('/patient/details/', {
        params: { mobile_number: mobile_number }
      });
 
      if (response && response.data && response.data.length > 0) {
        const patient = response.data[0];
 
        // Populate the form with the patient details
        setName(patient.name || '');
        setMobile(patient.mobile_number || '');
        setDob(patient.date_of_birth || '');
        setAge(patient.age ? patient.age.toString() : '');
        setBloodGroup(patient.blood_group || '');
        setGender(patient.gender || '');
        setAddress(patient.address || '');
 
        // If the "Same as appointment" checkbox is checked, populate the alternate details as well
        if (sameAsAppointment) {
          setAltName(patient.name || '');
          setAltMobile(patient.mobile_number || '');
          setAltDob(patient.date_of_birth || '');
          setAltAge(patient.age ? patient.age.toString() : '');
          setAltBloodGroup(patient.blood_group || '');
          setAltGender(patient.gender || '');
          setAltAddress(patient.address || '');
        }
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setErrorMessage('Failed to fetch patient details. Please try again.');
    }
 
    // Open the modal after fetching the details
    setIsModalOpen(true);
  };
  const handleSaveDetails = async (details) => {
    try {
      const response = await BaseUrl.post('/patient/patient/', details);
      if (response.status === 201) {
        const savedPatientId = response.data.data.id;
        setPatientId(savedPatientId); // Store the patient ID
        setErrorMessage('');
        return savedPatientId; // Return the patient ID
      } else {
        setErrorMessage(response.data.error || 'Failed to save patient details');
        return null;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred while saving patient details.');
      }
      return null;
    }
  };
  const handleConfirmAppointment = async () => {
    try {
      setLoading(true);
 
      const response = await BaseUrl.post('/patientappointment/bookslot/', {
        doctor: selectedDoctor.id,
        patient: patientId,
        appointment_slot: selectedSlot.id,
      });
 
      if (response && response.data) {
        const appointmentId = response.data.appointment_id;
 
        const patchResponse = await BaseUrl.patch(`/patient/patient/`, {
          appointment: selectedSlot.id,
          patient_id: patientId
        });
 
        if (patchResponse.status === 200) {
          setIsModalOpen(false);
          setSuccessMessage('Appointment confirmed and patient details updated successfully.');
          setShowSuccessPopup(true);
 
          // Delay the redirect to allow the user to see the success popup for 2 seconds
          setTimeout(() => {
            setShowSuccessPopup(false); // Close the success popup
            history.push('/patient/home');  // Redirect to the home page
          }, 2000); // 2000 milliseconds = 2 seconds
        } else {
          setErrorMessage('Failed to update patient details with appointment ID.');
        }
      }
      else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error confirming booking or patching patient details:', error.message);
      setErrorMessage('Failed to confirm appointment or update patient details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const handleCancelAppointment = () => {
    setIsModalOpen(false);
  };
 
  const handleDateChange = (index) => {
    const selectedDate = availableDates[index];
    setSelectedDateIndex(index);
 
    // Fetch slots and counts for the selected date
    fetchSlots(selectedDate);
  };
 
  const handleClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowSlots(false);
  };
 
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCloseDoctorCard = () => {
    setSelectedDoctor(null); // Deselect the doctor
    setQuery(''); // Clear search query
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, upcomingAppointments.length - 1));
  };
 
  const handleCompletedPrevious = () => {
    setCompletedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCompletedNext = () => {
    setCompletedIndex((prevIndex) => Math.min(prevIndex + 1, canceledAppointments.length - 1));
  };
  const handleCanceledPrevious = () => {
    setCanceledIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
 
  const handleCanceledNext = () => {
    setCanceledIndex((prevIndex) => Math.min(prevIndex + 1, canceledAppointments.length - 1));
  };
 
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patient_token = localStorage.getItem('patient_token');
        if (!patient_token) {
          throw new Error('No patient token found');
        }
 
        const decodedToken = JSON.parse(atob(patient_token.split('.')[1]));
        const patient_id = decodedToken.patient_id;
 
        if (!patient_id) {
          throw new Error('No patient ID found in token');
        }
 
        const response = await BaseUrl.get(`/patient/patient/?patient_id=${patient_id}`);
        const appointments = response.data;
 
        const upcoming = appointments.filter(
          (appointment) =>
            !appointment.is_blocked &&
            !appointment.is_canceled &&
            !appointment.is_complete &&
            appointment.is_booked
        );
 
        const completed = appointments.filter(
          (appointment) =>
            !appointment.is_blocked &&
            !appointment.is_canceled &&
            appointment.is_complete &&
            appointment.is_booked
        );
 
        const canceled = appointments.filter(
          (appointment) =>
 
            appointment.is_canceled &&
 
            appointment.is_booked
        );
 
        setUpcomingAppointments(upcoming);
        setCompletedAppointments(completed);
        setCanceledAppointments(canceled);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
 
    fetchAppointments();
  }, []);
 
  const renderCards = () => {
    const cardData = [
      { image: onlineconsultation, title: 'Online Consultation', text: 'Description for online consultation.' },
      { image: finddoctor, title: 'Find Doctor near you', text: 'Find doctors available near your location.', link: '/patient/bookappointment' },
      { image: bookappointment, title: 'Book Appointment', text: 'Easily book appointments online.', link: '/patient/bookappointment' },
      { image: prescription, title: 'Prescription & Vitals', text: 'Manage your prescriptions and vitals.' },
      { image: myappointment, title: 'My Appointments', text: 'View and manage your appointments.', link: '/patient/slots' },
      { image: mydocument, title: 'My Documents', text: 'Upload and manage your document.', link: '/patient/medicalrecords' },
    ];
 
    return cardData.map((card, index) => (
      <Col key={index} className="mb-4" xs={12} md={6}>
        {card.link ? (
          <Link to={card.link} className="text-decoration-none">
            <Card className="h-100 shadow-sm patient-card">
              <Card.Img variant="top" src={card.image} alt={card.title} className="patient-card-img" />
              <Card.Body>
                <Card.Title className="patient-card-title">{card.title}</Card.Title>
                <Card.Text className="patient-card-text">{card.text}</Card.Text>
                <Button variant="primary">Go to {card.title}</Button>
              </Card.Body>
            </Card>
          </Link>
        ) : (
          <Card className="h-100 shadow-sm patient-card">
            <Card.Img variant="top" src={card.image} alt={card.title} className="patient-card-img" />
            <Card.Body>
              <Card.Title className="patient-card-title">{card.title}</Card.Title>
              <Card.Text className="patient-card-text">{card.text}</Card.Text>
              <Button variant="primary" disabled>No Link</Button>
            </Card.Body>
          </Card>
        )}
      </Col>
    ));
  };
  const renderAppointments = (title, appointments, handlePrevious, handleNext, currentIndex) => {
    const isPreviousDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex >= appointments.length - 1;
    return (
      <div className="mb-4">
        <h3 className="text-center">{title}</h3>
        <Row className="text-center align-items-center">
          <Col xs="auto">
            <Button
              variant="outline-primary"
              onClick={handlePrevious}
              disabled={isPreviousDisabled}
              style={{
                color: isPreviousDisabled ? '#A9A9A9' : '',
                borderColor: isPreviousDisabled ? '#A9A9A9' : ''
              }}
            >
              <BsChevronLeft />
            </Button>
          </Col>
          {appointments.length > 0 ? (
            appointments.slice(currentIndex, currentIndex + 1).map((appointment, index) => (
              <Col key={index} md={8} className="mb-4">
                <Card className="h-100 shadow-sm appointment-card">
                  <Card.Body>
                    <Card.Title className="appointment-time">
                      <div>Date: {formatDate(appointment.appointment_date)}</div>
                      <div>Time: {formatTime(appointment.appointment_slot)}</div>
                    </Card.Title>
                    <Card.Text className="appointment-details">{appointment.details}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={8} className="mb-4">
              <div
                style={{
                  backgroundColor: '#f8d7da', // Light red background
                  color: '#721c24',           // Dark red text
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #f5c6cb', // Border matching the background
                  textAlign: 'center'
                }}
              >
                No {title.toLowerCase()} available.
              </div>
            </Col>
          )}
          <Col xs="auto">
            <Button
              variant="outline-primary"
              onClick={handleNext}
              disabled={isNextDisabled}
              style={{
                color: isNextDisabled ? '#A9A9A9' : '',
                borderColor: isNextDisabled ? '#A9A9A9' : ''
              }}
            >
              <BsChevronRight />
            </Button>
          </Col>
        </Row>
      </div>
    );
 
  };
  return (
    <Container fluid className="p-5 bg-light patient-container">
      <header className="mb-5 patient-header text-center">
        <h1>Welcome to Patient Portal</h1>
        <h2 className="text-primary">Find and Book</h2>
      </header>
 
      <div className="mb-4 text-center">
        <div className="input-group search-group">
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={handleLocationChange}
            placeholder="Your location"
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search Doctors / Specialization..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        {selectedDoctor && (
          <Card>
            <Card.Body>
              <Row>
 
                <Col md={8}>
                  {selectedDoctor.profile_pic && (
                    <Card.Img variant="top" src={selectedDoctor.profile_pic} alt={selectedDoctor.name} />
                  )}
                  <Card.Title>{selectedDoctor.name}</Card.Title>
                  <Card.Text>Specializations: {selectedDoctor.specializations}</Card.Text>
                  <Card.Text>Experience: {selectedDoctor.experience} years</Card.Text>
                  <Card.Text>Address: {selectedDoctor.address}</Card.Text>
                  <Card.Text>Qualifications: {selectedDoctor.qualification}</Card.Text>
                  <Card.Text>{selectedDoctor.details}</Card.Text>
                </Col>
                <Col md={4} className="d-flex align-items-center">
 
                  <Button variant="primary" onClick={() => handleDateChange(0)} className="w-50">
                    Book Slot <br />
                    <small>No Booking Fee</small>
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleCloseDoctorCard}
                    className="close-card-btn"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  >
                    <BsX size={40} />
                  </Button>
                </Col>
              </Row>
              {showSlots && (
                <div className="mt-3">
                  <h3>Select Slot</h3>
                  <div className="date-buttons mb-3 d-flex justify-content-between">
                    {availableDates.map((date, index) => (
                      <div key={index} className="text-center me-4">
                        <Button
                          variant={selectedDateIndex === index ? "primary" : "outline-primary"}
                          className="date"
                          onClick={() => handleDateChange(index)}
                        >
                          {index === 0 ? "Today" : index === 1 ? "Tomorrow" : `${formatDay(date)} (${formatDate(date)})`}
                        </Button>
                        <div>
                          <span className={`slot-count ${slotCounts[index] > 0 ? 'text-success' : 'text-danger'}`}>
                            {slotCounts[index] > 0 ? `${slotCounts[index]} slots available` : '0 slots available'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {loading ? (
                    <p>Loading slots...</p>
                  ) : (
                    <div className="slots-section d-flex flex-column align-items-center">
                      {Array.isArray(slots) && slots.length > 0 ? (
                        <div className="w-100 d-flex justify-content-between">
                          {/* Morning Slots */}
                          <div className="slot-section me-4">
                            <h4 className="slot-title mb-4">Morning</h4>
                            <div className="d-flex flex-wrap">
                              {slots.filter(slot => isMorning(slot.appointment_slot)).map(slot => (
                                <Button
                                  key={slot.id}
                                  variant="outline-primary"
                                  className="slot-button mb-2"
                                  onClick={() => handleSlotClick(slot)}
                                  style={{
                                    margin: '5px',
                                    padding: '10px',
                                    textAlign: 'center',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  {formatTime(slot.appointment_slot)}
                                </Button>
                              ))}
                            </div>
                          </div>
 
                          {/* Afternoon Slots */}
                          <div className="slot-section me-4">
                            <h4 className="slot-title mb-4">Afternoon</h4>
                            <div className="d-flex flex-wrap">
                              {slots.filter(slot => isAfternoon(slot.appointment_slot)).map(slot => (
                                <Button
                                  key={slot.id}
                                  variant="outline-primary"
                                  className="slot-button mb-2"
                                  onClick={() => handleSlotClick(slot)}
                                  style={{
                                    margin: '5px',
                                    padding: '10px',
                                    textAlign: 'center',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  {formatTime(slot.appointment_slot)}
                                </Button>
                              ))}
                            </div>
                          </div>
 
                          {/* Evening Slots */}
                          <div className="slot-section">
                            <h4 className="slot-title mb-4">Evening</h4>
                            {slots.filter(slot => isEvening(slot.appointment_slot)).length > 0 ? (
                              <div className="d-flex flex-wrap">
                                {slots.filter(slot => isEvening(slot.appointment_slot)).map(slot => (
                                  <Button
                                    key={slot.id}
                                    variant="outline-primary"
                                    className="slot-button mb-2"
                                    onClick={() => handleSlotClick(slot)}
                                    style={{
                                      margin: '5px',
                                      padding: '10px',
                                      textAlign: 'center',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    {formatTime(slot.appointment_slot)}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-danger">Slots are not available in the evening.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p>No slots available.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        )}
        <PatientDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAppointment}
          onCancel={handleCancelAppointment}
          handleSaveDetails={handleSaveDetails}
          name={name}
          mobile={mobile}
          dob={dob}
          age={age}
          bloodGroup={bloodGroup}
          gender={gender}
          address={address}
          sameAsAppointment={sameAsAppointment}
          setName={setName}
          setMobile={setMobile}
          setDob={setDob}
          setAge={setAge}
          setBloodGroup={setBloodGroup}
          setGender={setGender}
          setAddress={setAddress}
          setSameAsAppointment={setSameAsAppointment} // Ensure this is passed down
        />
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
 
        <Modal show={showSuccessPopup} centered>
          <Modal.Body className="text-center" >
            <h4>Appointment Successfully Booked!</h4>
            <p>Thank you for booking your appointment.</p>
          </Modal.Body>
        </Modal>
 
        <div ref={resultsRef}>
          {searchTerm.trim().length >= 3 && results.length > 0 && !selectedDoctor && (
            <div className="search-results">
              {results.map((result, index) => (
                <Card key={index} onClick={() => handleClick(result)} className="search-result">
                  <Card.Body className='card-result'>
                    {result.profile_pic ? (
                      <img src={result.profile_pic} alt={result.name} className="profile-pic" />
                    ) : (
                      <div className="no-profile-pic">No Picture</div>
                    )}
                    <div className="doctor-details">
                      <Card.Title className="doctor-name">{result.name}</Card.Title>
                      <Card.Text className="specialization">{result.specializations}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
 
      <Row className="main-content">
        <Col md={8}>
          <Row className="row-cards">
            {renderCards()}
          </Row>
        </Col>
        <Col md={4} className="right-panel">
          {renderAppointments('Upcoming Appointments', upcomingAppointments, handlePrevious, handleNext, currentIndex)}
          {renderAppointments('Completed Appointments', completedAppointments, handleCompletedPrevious, handleCompletedNext, completedIndex)}
          {renderAppointments('Canceled Appointments', canceledAppointments, handleCanceledPrevious, handleCanceledNext, canceledIndex)}
        </Col>
      </Row>
 
    </Container>
  );
 
};
export default PatientHome;