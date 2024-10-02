// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import jwtDecode from 'jwt-decode';
// import '../../css/BookAppointment.css';

// const BookAppointment = ({ token }) => {
//     const [name, setName] = useState('');
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [address, setAddress] = useState('');
//     const [dateOfBirth, setDateOfBirth] = useState('');
//     const [age, setAge] = useState('');
//     const [gender, setGender] = useState('');
//     const [bloodGroup, setBloodGroup] = useState('');
//     const [doctorName, setDoctorName] = useState('');
//     const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
//     const [slots, setSlots] = useState([]);
//     const [selectedDoctor, setSelectedDoctor] = useState('');
//     const [selectedSlot, setSelectedSlot] = useState(null);
//     const [showSlots, setShowSlots] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [saveDetailsMessage, setSaveDetailsMessage] = useState('');
//     const [slotBookingMessage, setSlotBookingMessage] = useState('');
//     const resultsRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (resultsRef.current && !resultsRef.current.contains(event.target)) {
//                 // setResults([]);
//             }
//         };

//         document.addEventListener('click', handleClickOutside);

//         return () => {
//             document.removeEventListener('click', handleClickOutside);
//         };
//     }, []);

//     useEffect(() => {
//         const handleBookAppointment = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     throw new Error('No token found');
//                 }

//                 const decodedToken = jwtDecode(token);
//                 const userId = decodedToken.user_id;

//                 const response = await axios.get('http://192.168.29.220:8000/doctor/doctorname/?doctor_id=3', {
//                     params: { user_id: userId }
//                 });

//                 const doctorsData = response.data || [];
//                 if (doctorsData.length > 0) {
//                     setDoctorName(doctorsData[0].name);
//                     setSelectedDoctor(doctorsData[0].id);
//                 } else {
//                     setDoctorName('');
//                 }
//             } catch (error) {
//                 console.error('Error fetching doctor names:', error);
//                 setDoctorName('');
//             }
//         };

//         handleBookAppointment();
//     }, []);

//     const handleSaveDetail = async () => {
//         try {
//             const response = await axios.post('http://192.168.29.95:8000/patient/slot/', {
//                 name,
//                 mobile_number: mobileNumber,
//                 date_of_birth: dateOfBirth,
//                 age,
//                 blood_group: bloodGroup,
//                 gender,
//                 address
//             });
//             console.log('Details saved successfully:', response.data);
//             setSaveDetailsMessage({ text: 'Details saved successfully.', type: 'success' });
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error('Error saving details:', error);
//             setSaveDetailsMessage({ text: 'Error saving details. Please try again.', type: 'error' });
//         }
//     };

//     const handleViewSlots = async () => {
//         try {
//             const response = await axios.get('http://192.168.29.220:8000/doctorappointment/blankslot/?doctor_id=1');
//             const slotsData = response.data || [];
//             setSlots(slotsData);
//             setShowSlots(true);
//         } catch (error) {
//             console.error('Error fetching slots:', error);
//             setSlots([]);
//         }
//     };

//     const handleSlotClick = (slot) => {
//         setSelectedSlot(slot);
//         console.log(`Slot selected: ${slot.appointment_date} - ${slot.appointment_slot}`);
//         setIsModalOpen(true);
//     };

//     const handleConfirmAppointment = async () => {
//         try {
//             const response = await axios.post('http://192.168.29.220:8000/patientappointment/bookslot/', {
//                 doctor: '1',
//                 patient: 1,
//                 appointment_slot: selectedSlot.id,
//             });
//             console.log('Appointment booked successfully:', response.data);
//             setSlotBookingMessage({ text: 'Appointment booked successfully.', type: 'success' });
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error('Error booking appointment:', error);
//             setSlotBookingMessage({ text: 'Error booking appointment. Please try again.', type: 'error' });
//         }
//     };

//     const handleCancelAppointment = () => {
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="book-appointment">
//             <h2 className="book-appointment-heading">Book Appointment</h2>
//             <div className="row">
//                 <div className="col">
//                     <label className="book-appointment-label">Name:</label>
//                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="book-appointment-input" />
//                 </div>
//                 <div className="col">
//                     <label className="book-appointment-label">Mobile Number:</label>
//                     <input type="number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="book-appointment-input" />
//                 </div>
//                 <div className="col">
//                     <label className="book-appointment-label">Date of Birth:</label>
//                     <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="book-appointment-input" />
//                 </div>
//             </div>
//             <div className="row">
//                 <div className="col">
//                     <label className="book-appointment-label">Age:</label>
//                     <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="book-appointment-input" />
//                 </div>
//                 <div className="col">
//                     <label className="book-appointment-label">Blood Group:</label>
//                     <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="book-appointment-input" />
//                 </div>
//                 <div className="col">
//                     <label className="book-appointment-label">Gender:</label>
//                     <select value={gender} onChange={(e) => setGender(e.target.value)} className="book-appointment-input">
//                         <option value="select">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                     </select>
//                 </div>
//             </div>
//             <div className="row">
//                 <div className="col">
//                     <label className="book-appointment-label">Address:</label>
//                     <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="book-appointment-input" />
//                 </div>
//             </div>
//             <button onClick={handleSaveDetail} className="book-appointment-button">Save Detail</button>
//             <div className="message-container">
//                 {saveDetailsMessage && (
//                     <div className={`message ${saveDetailsMessage.type === 'success' ? 'success' : 'error'}`}>
//                         {saveDetailsMessage.text}
//                     </div>
//                 )}
//             </div>
//             <div className="row">
//                 <div className="col">
//                     <label className="book-appointment-label">Doctor Name:</label>
//                     <input
//                         type="text"
//                         value={doctorName}
//                         onChange={(e) => setDoctorName(e.target.value)}
//                         className="book-appointment-input"
//                     />
//                 </div>
//                 <div className="col">
//                     <label className="book-appointment-label">Appointment Date:</label>
//                     <input
//                         type="date"
//                         value={appointmentDate}
//                         onChange={(e) => setAppointmentDate(e.target.value)}
//                         className="book-appointment-input"
//                     />
//                 </div>
//             </div>
//             <button onClick={handleViewSlots} className="book-appointment-button">View Slots</button>
//             <div className="message-container">
//                 {slotBookingMessage && (
//                     <div className={`message ${slotBookingMessage.type === 'success' ? 'success' : 'error'}`}>
//                         {slotBookingMessage.text}
//                     </div>
//                 )}
//             </div>
//             {showSlots && (
//                 <div className="slot-details">
//                     <h3>Available Slots</h3>
//                     {slots.length ? (
//                         <div className="slot-grid">
//                             {slots.map((slot, index) => (
//                                 <div
//                                     key={index}
//                                     onClick={() => handleSlotClick(slot)}
//                                     className={`slot-item ${selectedSlot === slot ? 'selected-slot' : ''}`}
//                                     aria-disabled={slot.is_booked ? 'true' : 'false'}
//                                 >
//                                     {slot.appointment_slot}
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p>No slots available</p>
//                     )}
//                 </div>
//             )}
//             {isModalOpen && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <h4>Confirm Appointment</h4>
//                         <button onClick={handleConfirmAppointment} className="confirm-button">Confirm</button>
//                         <button onClick={handleCancelAppointment} className="cancel-button">Cancel</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BookAppointment;
