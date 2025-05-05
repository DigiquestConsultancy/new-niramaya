// import React, { useState, useEffect, useCallback } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import { useHistory } from "react-router-dom";
// import Loader from "react-js-loader";
// import styled from "styled-components";
// import Sidebar from "./Sidebar";

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

// const ManageReception = () => {
//   const [receptionDetails, setReceptionDetails] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const history = useHistory();

// const [selectedMenu, setSelectedMenu] = useState("Dashboard");
// const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

// const handleMenuClick = (menu) => {
//   setSelectedMenu(menu);
// };

//   const fetchReceptionDetails = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found");
//       }

//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const response = await BaseUrl.get(
//         `/reception/detailsbydoctorid/?doctor_id=${doctor_id}`
//       );

//       if (response.status === 200) {
//         setErrorMessage("");
//         setReceptionDetails(response.data);
//       } else {
//         throw new Error("");
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || "");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchReceptionDetails();
//   }, [fetchReceptionDetails]);

//   const handleViewDetails = (reception_id) => {
//     history.push(`/doctor/receptiondetails/${reception_id}`);
//   };

//   const handleRemove = async (reception_id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this reception?"
//     );
//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await BaseUrl.delete(`/reception/details/`, {
//         data: { reception_ids: [reception_id] },
//       });
//       if (response.status === 200) {
//         setSuccessMessage(response.data.success);
//         setReceptionDetails(
//           receptionDetails.filter(
//             (detail) => detail.reception_id !== reception_id
//           )
//         );
//       } else {
//         throw new Error("");
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || "");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReceptionDetails = receptionDetails.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(receptionDetails.length / itemsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="d-flex">
// <Sidebar
//   selectedMenu={selectedMenu}
//   handleMenuClick={handleMenuClick}
//   isSidebarCollapsed={isSidebarCollapsed}
//   setIsSidebarCollapsed={setIsSidebarCollapsed}
// />

//       {loading && (
//         <LoaderWrapper>
//           <LoaderImage>
//             <Loader
//               type="spinner-circle"
//               bgColor={"#0091A5"}
//               color={"#0091A5"}
//               title={"Loading..."}
//               size={100}
//             />
//           </LoaderImage>
//         </LoaderWrapper>
//       )}

//       {/* Apply the blur effect only when loading */}
//       <div className="container-fluid p-4">
//         <div
//           className="d-flex justify-content-between align-items-center flex-wrap"
//           style={{ marginBottom: "20px" }}
//         >
//           <h1
//             style={{
//               fontFamily: "sans-serif",
//               color: "#0C1187",
//               textAlign: "center",
//               fontSize: "40px",
//               width: "100%",
//               fontWeight: "500",
//             }}
//           >
//             Reception Details
//           </h1>
//           <button
//             type="button"
//             className="btn"
//             style={{
//               backgroundColor: "#024CAA",
//               color: "#f1f8dc",
//               fontFamily: "sans-serif",
//               fontSize: "16px",
//               marginLeft: "auto",
//             }}
//             onClick={() => history.push("/doctor/addreception")}
//           >
//             Add Reception
//           </button>
//         </div>

//         <div className="table-responsive" style={{ overflowX: "auto" }}>
//           <table
//             className="table table-striped"
//             style={{
//               width: "100%",
//               textAlign: "center",
//               fontFamily: "sans-serif",
//               fontSize: "16px",
//               whiteSpace: "nowrap",
//               tableLayout: "fixed",
//               borderRadius: "10px",
//             }}
//           >
//             <thead style={{ backgroundColor: "#0091A5", color: "#fff" }}>
//               <tr>
//                 <th style={tableHeadingStyle}>Mobile Number</th>
//                 <th style={tableHeadingStyle}>Name</th>
//                 <th style={tableHeadingStyle}>Gender</th>
//                 <th style={tableHeadingStyle}>Specialization</th>
//                 <th style={tableHeadingStyle}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentReceptionDetails.length > 0 ? (
//                 currentReceptionDetails.map((detail) => (
//                   <tr key={detail.reception_id}>
//                     <td>{detail.mobile_number}</td>
//                     <td>{detail.name}</td>
//                     <td>{detail.gender}</td>
//                     <td>{detail.specialization}</td>
//                     <td className="d-flex" style={{ gap: "5px" }}>
//                       <button
//                         className="btn me-2"
//                         style={viewButtonStyle}
//                         onClick={() => handleViewDetails(detail.reception_id)}
//                       >
//                         Details
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         style={removeButtonStyle}
//                         onClick={() => handleRemove(detail.reception_id)}
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center" }}>
//                     {errorMessage && (
//                       <div className="alert alert-danger">{errorMessage}</div>
//                     )}
//                     {successMessage && (
//                       <div className="alert alert-success">
//                         {successMessage}
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div
//           className="d-flex justify-content-center mt-4"
//           style={{ position: "absolute", bottom: "20px", width: "100%" }}
//         >
//           <button
//             className="btn btn-secondary mx-1"
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//           >
//             ←
//           </button>
//           {Array.from(
//             { length: Math.ceil(receptionDetails.length / itemsPerPage) },
//             (_, index) => (
//               <button
//                 key={index}
//                 className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"} mx-1`}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </button>
//             )
//           )}
//           <button
//             className="btn btn-secondary mx-1"
//             onClick={handleNextPage}
//             disabled={
//               currentPage === Math.ceil(receptionDetails.length / itemsPerPage)
//             }
//           >
//             →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const tableHeadingStyle = {
//   fontFamily: "sans-serif",
//   fontWeight: "bold",
//   color: "#fff",
//   fontSize: "20px",
//   padding: "15px",
//   backgroundColor: "#0091A5",
// };

// const viewButtonStyle = {
//   backgroundColor: "#024CAA",

//   color: "#f1f8dc",
//   fontFamily: "sans-serif",
//   fontSize: "16px",
// };

// const removeButtonStyle = {
//   backgroundColor: "#BC1B2E",
//   color: "#fff",
//   fontFamily: "sans-serif",
//   fontSize: "16px",
// };

// const mediaStyles = `
//   @media (max-width: 768px) {
//     h1 {
//       font-size: 24px !important;
//     }
//     th {
//       font-size: 16px !important;
//     }
//     td {
//       font-size: 14px !important;
//       padding: 10px !important;
//     }
//     button {
//       font-size: 14px !important;
//       width: auto !important;
//       margin-bottom: 5px !important;
//     }
//     table {
//       table-layout: auto !important;
//     }
//   }

//   @media (max-width: 576px) {
//     h1 {
//       font-size: 20px !important;
//     }
//     th, td {
//       font-size: 12px !important;
//       padding: 8px !important;
//     }
//     button {
//       font-size: 12px !important;
//       width: auto !important;
//     }
//     table {
//       table-layout: auto !important;
//     }
//   }
// `;

// // Inject media query styles dynamically into the document
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = mediaStyles;
// document.head.appendChild(styleSheet);

// export default ManageReception;










import React, { useState, useEffect, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Loader from "react-js-loader";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";

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

const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Title = styled.h1`
  font-family: sans-serif;
  color: #0c1187;
  font-size: 2.5rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  text-align: center;
  font-family: sans-serif;
  font-size: 1rem;
  white-space: nowrap;
  border-radius: 10px;
  overflow: hidden;

  th {
    background-color: #0091a5;
    color: #fff;
    font-weight: bold;
    padding: 1rem;
    font-size: 1.1rem;
  }

  td {
    padding: 0.75rem;
    vertical-align: middle;
  }

  tbody tr:nth-child(odd) {
    background-color: #f6f6f6;
  }

  tbody tr:hover {
    background-color: #e9f7fa;
  }
`;

const Button = styled.button`
  font-family: sans-serif;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;

  &.view {
    background-color: #024caa;
    color: #f1f8dc;
  }

  &.delete {
    background-color: #bc1b2e;
    color: #fff;
  }

  &.add {
    background-color: #024caa;
    color: #f1f8dc;
    margin-left: auto;
  }

  &.page {
    margin: 0 5px;
  }
`;

const Message = styled.div`
  margin: 1rem 0;
  text-align: center;
`;

const ManageReception = () => {
  const [receptionDetails, setReceptionDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetReceptionId, setTargetReceptionId] = useState(null);
  const history = useHistory();

  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const showMessage = (type, msg) => {
    if (type === "error") setErrorMessage(msg);
    else setSuccessMessage(msg);

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 3000);
  };

  const fetchReceptionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const response = await BaseUrl.get(
        `/reception/detailsbydoctorid/?doctor_id=${doctor_id}`
      );
      if (response.status === 200) setReceptionDetails(response.data);
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.error || "Failed to fetch reception details"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceptionDetails();
  }, [fetchReceptionDetails]);

  const handleViewDetails = (id) =>
    history.push(`/doctor/receptiondetails/${id}`);
  const confirmDelete = (id) => {
    setTargetReceptionId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await BaseUrl.delete(`/reception/details/`, {
        data: { reception_ids: [targetReceptionId] },
      });

      if (response.status === 200) {
        showMessage("success", response.data.success);
        setReceptionDetails((prev) =>
          prev.filter((d) => d.reception_id !== targetReceptionId)
        );
      }
    } catch (error) {
      showMessage("error", error.response?.data?.error || "Delete failed");
    } finally {
      setShowConfirmModal(false);
      setTargetReceptionId(null);
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReceptionDetails = receptionDetails.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(receptionDetails.length / itemsPerPage);

  return (
    <div className="d-flex" style={{ height: "calc(100vh - 4rem)", overflowY: "hidden"}}>
      <Sidebar
        selectedMenu={selectedMenu}
        handleMenuClick={handleMenuClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {loading && (
        <LoaderWrapper>
          <Loader
            type="spinner-circle"
            bgColor="#0091A5"
            color="#0091A5"
            title="Loading..."
            size={100}
          />
        </LoaderWrapper>
      )}

      <Container className="overflow-y-auto">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h1
            style={{
              fontFamily: "sans-serif",
              color: "#0C1187",
              textAlign: "center",
              fontSize: "40px",
              width: "100%",
              fontWeight: "500",
            }}
          >
            Reception Details
          </h1>
          <Button
            className="add"
            onClick={() => history.push("/doctor/addreception")}
          >
            Add Reception
          </Button>
        </div>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Mobile Number</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReceptionDetails.length ? (
                currentReceptionDetails.map((detail) => (
                  <tr key={detail.reception_id}>
                    <td>{detail.mobile_number}</td>
                    <td>{detail.name}</td>
                    <td>{detail.gender}</td>
                    <td>{detail.specialization}</td>
                    <td>
                      <span
                        onClick={() => handleViewDetails(detail.reception_id)}
                      >
                        <FaEye
                          style={{
                            fontSize: "24px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        />
                      </span>{" "}
                      <span onClick={() => confirmDelete(detail.reception_id)}>
                        <MdDelete
                          style={{
                            fontSize: "24px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No data found.</td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>

        {/* Pagination */}
        {receptionDetails.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <Button
              className="page"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ←
            </Button>
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx}
                className={`page ${currentPage === idx + 1 ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              className="page"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              →
            </Button>
          </div>
        )}
        {errorMessage && (
          <Message className="alert alert-danger">{errorMessage}</Message>
        )}
        {successMessage && (
          <Message className="alert alert-success">{successMessage}</Message>
        )}
      </Container>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this reception?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReception;
