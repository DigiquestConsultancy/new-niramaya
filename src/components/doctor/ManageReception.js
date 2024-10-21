// import React, { useState, useEffect, useCallback } from 'react';
// import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
// import {jwtDecode} from 'jwt-decode'; // Corrected import
// import { useHistory } from 'react-router-dom';
 
// const ManageReception = () => {
//   const [receptionDetails, setReceptionDetails] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const history = useHistory();
 
//   const fetchReceptionDetails = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found');
//       }
 
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;
 
//       const response = await BaseUrl.get(`/reception/detailsbydoctorid/?doctor_id=${doctor_id}`);
     
//       if (response.status === 200) {
//         console.log(response.data); // Add this line
//         setErrorMessage('');
//         setReceptionDetails(response.data);
//       } else {
//         throw new Error('Unexpected response status');
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || 'Error fetching reception details.');
//     }
//   }, []);
 
//   useEffect(() => {
//     fetchReceptionDetails();
//   }, [fetchReceptionDetails]);
 
//   const handleViewDetails = (reception_id) => {
//     history.push(`/doctor/receptiondetails/${reception_id}`);
//   };
 
//   const handleRemove = async (reception_id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this reception?");
//     if (!confirmDelete) {
//       return;
//     }
 
//     try {
//       const response = await BaseUrl.delete(`/reception/details/`, {
//         data: { reception_ids: [reception_id] }
//       });
//       if (response.status === 200) {
//         setSuccessMessage(response.data.success);
//         setReceptionDetails(receptionDetails.filter(detail => detail.reception_id !== reception_id));
//       } else {
//         throw new Error('Failed to delete reception details');
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || 'Error deleting reception details.');
//     }
//   };
 
//   return (
//     <div className="container mt-5">
//       {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//       {successMessage && <div className="alert alert-success">{successMessage}</div>}
//       <div className="d-flex justify-content-between align-items-center">
//         <h2>Reception Details</h2>
//         <button type="button" className="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={() => history.push('/doctor/addreception')}>
//           Add Reception
//         </button>
//       </div>
//       <table className="table table-striped mt-3">
//         <thead>
//           <tr>
//             <th>Mobile Number</th>
//             <th>Name</th>
//             <th>Gender</th>
//             <th>Specialization</th>
//             <th style={{ paddingLeft: '5rem' }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {receptionDetails.length > 0 ? (
//             receptionDetails.map((detail) => (
//               <tr key={detail.reception_id}>
//                 <td>{detail.mobile_number}</td>
//                 <td>{detail.name}</td>
//                 <td>{detail.gender}</td>
//                 <td>{detail.specialization}</td>
//                 <td>
//                   <button className="btn me-2" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={() => handleViewDetails(detail.reception_id)}>View Details</button>
//                   <button className="btn btn-danger" onClick={() => handleRemove(detail.reception_id)}>Remove</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center">No reception details found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };
 
// export default ManageReception;



import React, { useState, useEffect, useCallback } from 'react';
import BaseUrl from '../../api/BaseUrl'; // Import the BaseUrl instance
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { useHistory } from 'react-router-dom';
 
const ManageReception = () => {
  const [receptionDetails, setReceptionDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();
 
  const fetchReceptionDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
 
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;
 
      const response = await BaseUrl.get(`/reception/detailsbydoctorid/?doctor_id=${doctor_id}`);
 
      if (response.status === 200) {
        setErrorMessage('');
        setReceptionDetails(response.data);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error fetching reception details.');
    }
  }, []);
 
  useEffect(() => {
    fetchReceptionDetails();
  }, [fetchReceptionDetails]);
 
  const handleViewDetails = (reception_id) => {
    history.push(`/doctor/receptiondetails/${reception_id}`);
  };
 
  const handleRemove = async (reception_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reception?");
    if (!confirmDelete) {
      return;
    }
 
    try {
      const response = await BaseUrl.delete(`/reception/details/`, {
        data: { reception_ids: [reception_id] }
      });
      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setReceptionDetails(receptionDetails.filter(detail => detail.reception_id !== reception_id));
      } else {
        throw new Error('Failed to delete reception details');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error deleting reception details.');
    }
  };
 
  return (
    <div className="container mt-5">
 
      <div className="d-flex justify-content-between align-items-center">
        <h2>Reception Details</h2>
        <button type="button" className="btn" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={() => history.push('/doctor/addreception')}>
          Add Reception
        </button>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Mobile Number</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Specialization</th>
            <th style={{ paddingLeft: '5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {receptionDetails.length > 0 ? (
            receptionDetails.map((detail) => (
              <tr key={detail.reception_id}>
                <td>{detail.mobile_number}</td>
                <td>{detail.name}</td>
                <td>{detail.gender}</td>
                <td>{detail.specialization}</td>
                <td>
                  <button className="btn me-2" style={{ backgroundColor: '#199fd9', color: '#f1f8dc' }} onClick={() => handleViewDetails(detail.reception_id)}>View Details</button>
                  <button className="btn btn-danger" onClick={() => handleRemove(detail.reception_id)}>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              {/* <td colSpan="5" className="text-center">No reception details found</td> */}
              <td colSpan={5} className='text-center'>{errorMessage}</td>
              <td colSpan={5} className='text-center'>{successMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
 
export default ManageReception;