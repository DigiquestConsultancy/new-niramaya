

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Table,
//   Button,
//   Row,
//   Col,
//   Form,
//   InputGroup,
//   Pagination,
// } from "react-bootstrap";
// import { FaDownload, FaSearch } from "react-icons/fa";
// import Papa from "papaparse";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import * as XLSX from "xlsx";
// import styled from "styled-components";
// import Loader from "react-js-loader";
// import _ from "lodash";
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
// const PaymentHistory = () => {
//   const [clinicPhoto, setClinicPhoto] = useState(null);
//   const [clinicName, setClinicName] = useState("");
//   const [doctorId, setDoctorId] = useState(null);
//   const [payments, setPayments] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [search, setSearch] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [totalPatients, setTotalPatients] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 15;
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [selectedMenu, setSelectedMenu] = useState("Dashboard");
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   const handleMenuClick = (menu) => {
//     setSelectedMenu(menu);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setDoctorId(decoded.doctor_id);
//     }
//   }, []);

//   useEffect(() => {
//     if (doctorId) {
//       fetchClinicDetails();
//       fetchPayments();
//     }
//   }, [doctorId]);

//   const fetchClinicDetails = async () => {
//     try {
//       const response = await BaseUrl.get("/doctor/opddays/", {
//         params: { doctor_id: doctorId },
//       });
//       if (response.status === 200 && response.data.length > 0) {
//         const data = response.data[0];
//         setClinicName(data.clinic_name);
//         if (data.doc_file) {
//           const fullImageUrl = `${BaseUrl.defaults.baseURL}${data.doc_file}`;
//           setClinicPhoto(fullImageUrl);
//         }
//       }
//     } catch (error) {}
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchPayments();
//     }
//   }, [selectedDate]);

//   const fetchPaymentsByDateRange = async () => {
//     setLoading(true);
//     try {
//       const response = await BaseUrl.get("/doctor/csv/", {
//         params: { start_date: startDate, end_date: endDate },
//       });

//       if (response.status === 200 && response.data) {
//         Papa.parse(response.data, {
//           complete: (result) => {
//             const validPayments = result.data.filter(
//               (row) =>
//                 row["Patient Name"] && row["Doctor Name"] && row["Amount"]
//             );

//             setPayments(validPayments);

//             const totalPatientsPaid = validPayments.length;
//             setTotalPatients(totalPatientsPaid);
//           },
//           header: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setPayments([]);
//       setTotalPatients(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await BaseUrl.get("/doctor/csv/", {
//         params: { date: selectedDate },
//       });

//       if (response.status === 200 && response.data) {
//         Papa.parse(response.data, {
//           complete: (result) => {
//             const validPayments = result.data.filter(
//               (row) =>
//                 row["Patient Name"] && row["Doctor Name"] && row["Amount"]
//             );

//             setPayments(validPayments);

//             const totalPatientsPaid = validPayments.length;
//             setTotalPatients(totalPatientsPaid);
//           },
//           header: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setPayments([]);
//       setTotalPatients(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadExcel = async () => {
//     setLoading(true);
//     try {
//       if (payments.length === 0) {
//         alert("No payments to download!");
//         return;
//       }

//       const fileName =
//         startDate && endDate
//           ? `Payments_${startDate}_to_${endDate}.xlsx`
//           : `Payments_${selectedDate}.xlsx`;

//       const ws = XLSX.utils.json_to_sheet(payments);

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Payments");

//       XLSX.writeFile(wb, fileName);
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const indexOfLastPayment = currentPage * rowsPerPage;
//   const indexOfFirstPayment = indexOfLastPayment - rowsPerPage;
//   const currentPayments = payments.slice(
//     indexOfFirstPayment,
//     indexOfLastPayment
//   );

//   const totalPages = Math.ceil(payments.length / rowsPerPage);

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//   };

//   const [searchParams, setSearchParams] = useState({
//     query: "",
//   });

//   const fetchSearch = async ({ query = "" } = {}) => {
//     setLoading(true);
//     try {
//       const params = { query };

//       const response = await BaseUrl.get("/doctor/paymentsearch/", { params });

//       if (response.status === 200 && response.data) {
//         // Parse the CSV response
//         Papa.parse(response.data, {
//           complete: (result) => {
//             const validPayments = result.data.filter(
//               (row) =>
//                 row["Amount"] &&
//                 row["Patient Name"] &&
//                 row["Customer Phone"] &&
//                 row["Appointment Date"]
//             );

//             setPayments(validPayments);
//             setTotalPatients(validPayments.length);
//           },
//           header: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setPayments([]);
//       setTotalPatients(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedSearch = useCallback(
//     _.debounce((query) => {
//       fetchSearch({ query }); // Pass query directly
//     }, 500),
//     []
//   );

//   const handleSearchsChange = (e) => {
//     const value = e.target.value.trim();
//     setSearchQuery(value);
//     debouncedSearch(value);

//     // Fetch all results when input is cleared
//     if (!value) {
//       fetchSearch({});
//     }
//   };

//   return (
//     <div
//       className="payment-history-container d-flex"
//       style={{ height: "calc(100vh - 4rem)", overflowY: "hidden" }}
//     >
//       <Sidebar
//         selectedMenu={selectedMenu}
//         handleMenuClick={handleMenuClick}
//         isSidebarCollapsed={isSidebarCollapsed}
//         setIsSidebarCollapsed={setIsSidebarCollapsed}
//       />
//       <main className="p-4 overflow-y-auto">
//         {loading && (
//           <LoaderWrapper>
//             <LoaderImage>
//               <Loader
//                 type="spinner-circle"
//                 bgColor="#0091A5"
//                 color="#0091A5"
//                 title="Loading..."
//                 size={100}
//               />
//             </LoaderImage>
//           </LoaderWrapper>
//         )}

//         <Row
//           className="align-items-center mb-4"
//           style={{ padding: "10px 20px" }}
//         >
//           <Col xs="12" sm="6" md="4" className="text-center mb-3 mb-md-0">
//             <h5
//               style={{ color: "#000", fontWeight: "bold", marginBottom: "5px" }}
//             >
//               Payments
//             </h5>
//             <p style={{ fontSize: "16px", color: "#000" }}>
//               Payroll{" "}
//               <span style={{ fontWeight: "bold" }}>
//                 {new Date().toLocaleString("default", {
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </span>
//             </p>
//           </Col>

//           <Col xs="12" sm="6" md="4" className="text-center mb-3 mb-md-0">
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               style={{
//                 padding: "5px 10px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 width: "100%",
//                 borderRadius: "8px",
//               }}
//             />
//           </Col>

//           <Col xs="12" sm="6" md="4" className="text-center">
//             {clinicPhoto && (
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <img
//                   src={clinicPhoto}
//                   alt="Doctor Profile"
//                   style={{
//                     width: "50px",
//                     height: "50px",
//                     borderRadius: "50%",
//                     marginRight: "10px",
//                   }}
//                 />
//                 <p
//                   style={{
//                     margin: "0",
//                     fontSize: "16px",
//                     fontWeight: "bold",
//                     color: "#0174BE",
//                   }}
//                 >
//                   {clinicName || "Doctor Name"}
//                 </p>
//               </div>
//             )}
//           </Col>
//         </Row>

//         <hr />

//         <div
//           className="filters-section mb-4 p-3"
//           style={{
//             backgroundColor: "#FFFFFF",
//             borderRadius: "10px",
//             width: "100%",
//             maxWidth: "700px",
//             margin: "0 auto",
//           }}
//         >
//           <Row className="align-items-center justify-content-center">
//             <Col xs="auto" className="d-flex align-items-center mb-2 mb-sm-0">
//               <div style={{ marginRight: "10px" }}>From</div>
//               <Form.Control
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 placeholder="Start Date"
//                 style={{ minWidth: "180px", height: "40px" }}
//                 required
//               />
//             </Col>

//             <Col xs="auto" className="d-flex align-items-center mb-2 mb-sm-0">
//               <div style={{ marginRight: "10px" }}>To</div>
//               <Form.Control
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 placeholder="End Date"
//                 style={{ minWidth: "180px", height: "40px" }}
//                 required
//               />
//             </Col>

//             <Col xs="auto" className="d-flex justify-content-center">
//               <Button
//                 onClick={fetchPaymentsByDateRange}
//                 style={{
//                   backgroundColor: "#0174BE",
//                   borderColor: "#0174BE",
//                   minWidth: "120px",
//                   height: "40px",
//                 }}
//               >
//                 <FaSearch /> Search
//               </Button>
//             </Col>
//           </Row>
//         </div>

//         <Row className="align-items-center mb-4 justify-content-between">
//           <Col md="auto" className="text-center">
//             <Button
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 borderColor: "#D7EAF0",
//                 color: "#000",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 borderRadius: "8px",
//                 padding: "10px 20px",
//                 boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               Total Patient :{" "}
//               <strong style={{ color: "#0174BE", fontSize: "18px" }}>
//                 {totalPatients}
//               </strong>
//             </Button>
//           </Col>

//           <Col md="6" className="text-center">
//             <InputGroup style={{ maxWidth: "550px", margin: "0 auto" }}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by Patient Name or Transaction ID"
//                 value={searchQuery}
//                 onChange={handleSearchsChange}
//                 style={{
//                   borderRadius: "8px 0 0 8px",
//                   borderColor: "#0174BE",
//                   height: "50px",
//                 }}
//               />
//               <Button
//                 onClick={() => debouncedSearch(searchQuery)}
//                 style={{
//                   backgroundColor: "#0174BE",
//                   color: "#FFFFFF",
//                   borderRadius: "0 8px 8px 0",
//                   height: "50px",
//                 }}
//               >
//                 <FaSearch />
//               </Button>
//             </InputGroup>
//           </Col>

//           <Col md="auto" className="text-center">
//             <Button
//               onClick={downloadExcel}
//               style={{
//                 backgroundColor: "#28A745",
//                 color: "#FFFFFF",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 borderRadius: "8px",
//                 padding: "10px 20px",
//               }}
//             >
//               <FaDownload style={{ marginRight: "5px" }} /> Download Excel
//             </Button>
//           </Col>
//         </Row>

//         <hr />

//         <div
//           className="table-section p-3"
//           style={{ backgroundColor: "#0091A5", borderRadius: "10px" }}
//         >
//           <h5 className="text-white mb-3">Payroll {selectedDate}</h5>
//           <Table striped bordered hover>
//             <thead style={{ backgroundColor: "#0174BE", color: "#FFFFFF" }}>
//               <tr>
//                 <th>S. No</th>
//                 <th>Amount</th>
//                 <th>Patient Name</th>
//                 <th>Patient Phone</th>
//                 <th>Age</th>
//                 <th>Address</th>
//                 <th>Doctor Name</th>
//                 <th>Appointment Date</th>
//                 <th>Transaction ID</th>
//                 <th>Payment Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentPayments.length > 0 ? (
//                 currentPayments.map((payment, index) => (
//                   <tr key={index}>
//                     <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                     <td>{payment["Amount"]}</td>
//                     <td>{payment["Patient Name"]}</td>
//                     <td>{payment["Customer Phone"]}</td>
//                     <td>{payment["Age"]}</td>
//                     <td>{payment["Address"]}</td>
//                     <td>{payment["Doctor Name"]}</td>
//                     <td>{payment["Appointment Date"]}</td>
//                     <td>{payment["cf_payment_id"]}</td>
//                     <td>{payment["Payment Type"]}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="11" className="text-center">
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           <Pagination>
//             <Pagination.Prev
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             />
//             {[...Array(totalPages)].map((_, index) => (
//               <Pagination.Item
//                 key={index + 1}
//                 active={index + 1 === currentPage}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             />
//           </Pagination>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PaymentHistory;





import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Row, Col, Form, InputGroup, Pagination, Dropdown } from "react-bootstrap";
import { FaDownload, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Papa from "papaparse";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import styled from "styled-components";
import Loader from "react-js-loader";
import _ from "lodash";
import Sidebar from "./Sidebar";
import GenerateInvoice from "./GenerateInvoice";

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

const PaymentHistory = () => {
  const [clinicPhoto, setClinicPhoto] = useState(null);
  const [clinicName, setClinicName] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [payments, setPayments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setDoctorId(decoded.doctor_id);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchClinicDetails();
      fetchPayments();
    }
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      fetchPayments();
    }
  }, [selectedDate]);

  const fetchClinicDetails = async () => {
    try {
      const response = await BaseUrl.get("/doctor/opddays/", {
        params: { doctor_id: doctorId },
      });
      if (response.status === 200 && response.data.length > 0) {
        const data = response.data[0];
        setClinicName(data.clinic_name);
        if (data.doc_file) {
          const fullImageUrl = `${BaseUrl.defaults.baseURL}${data.doc_file}`;
          setClinicPhoto(fullImageUrl);
        }
      }
    } catch (error) {}
  };

  const fetchPaymentsByDateRange = async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.get("/doctor/csv/", {
        params: { start_date: startDate, end_date: endDate },
      });

      if (response.status === 200 && response.data) {
        Papa.parse(response.data, {
          complete: (result) => {
            const validPayments = result.data.filter(
              (row) =>
                row["Patient Name"] && row["Doctor Name"] && row["Amount"]
            );
            setPayments(validPayments);
            setTotalPatients(validPayments.length);
          },
          header: true,
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
      setTotalPatients(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.get("/doctor/csv/", {
        params: { date: selectedDate },
      });

      if (response.status === 200 && response.data) {
        Papa.parse(response.data, {
          complete: (result) => {
            const validPayments = result.data.filter(
              (row) =>
                row["Patient Name"] && row["Doctor Name"] && row["Amount"]
            );
            setPayments(validPayments);
            setTotalPatients(validPayments.length);
          },
          header: true,
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
      setTotalPatients(0);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setLoading(true);
    try {
      if (payments.length === 0) {
        alert("No payments to download!");
        return;
      }

      const fileName =
        startDate && endDate
          ? `Payments_${startDate}_to_${endDate}.xlsx`
          : `Payments_${selectedDate}.xlsx`;

      const ws = XLSX.utils.json_to_sheet(payments);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      XLSX.writeFile(wb, fileName);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPayment = currentPage * rowsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - rowsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil(payments.length / rowsPerPage);

  const fetchSearch = async ({ query = "" } = {}) => {
    setLoading(true);
    try {
      const params = { query };
      const response = await BaseUrl.get("/doctor/paymentsearch/", { params });

      if (response.status === 200 && response.data) {
        Papa.parse(response.data, {
          complete: (result) => {
            const validPayments = result.data.filter(
              (row) =>
                row["Amount"] &&
                row["Patient Name"] &&
                row["Customer Phone"] &&
                row["Appointment Date"]
            );
            setPayments(validPayments);
            setTotalPatients(validPayments.length);
          },
          header: true,
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
      setTotalPatients(0);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      fetchSearch({ query });
    }, 500),
    []
  );

  const handleSearchsChange = (e) => {
    const value = e.target.value.trim();
    setSearchQuery(value);
    debouncedSearch(value);
    if (!value) {
      fetchSearch({});
    }
  };

  const handleGenerateInvoice = (payment) => {
  setSelectedAppointment({
    booked_by: payment["Patient Name"],
    uhid: payment["cf_payment_id"],
    mobile_number: payment["Customer Phone"],
    appointment_id: payment["Appointment_id"],
    patient: payment["Patient_id"],
  });
  setIsInvoiceOpen(true);
};

  const handleCreateInvoice = () => {
    // Implement invoice creation logic here
    setIsInvoiceOpen(false);
    // setSelectedAppointment(null);
  };

  const handleCloseInvoice = () => {
    setIsInvoiceOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div
      className="payment-history-container d-flex"
      style={{ height: "calc(100vh - 4rem)", overflowY: "hidden" }}
    >
      <Sidebar
        selectedMenu={selectedMenu}
        handleMenuClick={handleMenuClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main className="p-4 overflow-y-auto">
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

        <Row className="align-items-center mb-4" style={{ padding: "10px 20px" }}>
          <Col xs="12" sm="6" md="4" className="text-center mb-3 mb-md-0">
            <h5 style={{ color: "#000", fontWeight: "bold", marginBottom: "5px" }}>
              Payments
            </h5>
            <p style={{ fontSize: "16px", color: "#000" }}>
              Payroll{" "}
              <span style={{ fontWeight: "bold" }}>
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </Col>

          <Col xs="12" sm="6" md="4" className="text-center mb-3 mb-md-0">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: "5px 10px",
                fontWeight: "bold",
                color: "#000",
                width: "100%",
                borderRadius: "8px",
              }}
            />
          </Col>

          <Col xs="12" sm="6" md="4" className="text-center">
            {clinicPhoto && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={clinicPhoto}
                  alt="Doctor Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <p
                  style={{
                    margin: "0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#0174BE",
                  }}
                >
                  {clinicName || "Doctor Name"}
                </p>
              </div>
            )}
          </Col>
        </Row>

        <hr />

        <div
          className="filters-section mb-4 p-3"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <Row className="align-items-center justify-content-center">
            <Col xs="auto" className="d-flex align-items-center mb-2 mb-sm-0">
              <div style={{ marginRight: "10px" }}>From</div>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                style={{ minWidth: "180px", height: "40px" }}
                required
              />
            </Col>

            <Col xs="auto" className="d-flex align-items-center mb-2 mb-sm-0">
              <div style={{ marginRight: "10px" }}>To</div>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                style={{ minWidth: "180px", height: "40px" }}
                required
              />
            </Col>

            <Col xs="auto" className="d-flex justify-content-center">
              <Button
                onClick={fetchPaymentsByDateRange}
                style={{
                  backgroundColor: "#0174BE",
                  borderColor: "#0174BE",
                  minWidth: "120px",
                  height: "40px",
                }}
              >
                <FaSearch /> Search
              </Button>
            </Col>
          </Row>
        </div>

        <Row className="align-items-center mb-4 justify-content-between">
          <Col xs={12} md="auto" className="text-center mb-3 mb-md-0">
            <Button
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D7EAF0",
                color: "#000",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px 20px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Total Patient :{" "}
              <strong style={{ color: "#0174BE", fontSize: "18px" }}>
                {totalPatients}
              </strong>
            </Button>
          </Col>

          <Col xs={12} md={6} className="text-center mb-3 mb-md-0">
            <InputGroup style={{ maxWidth: "100%", width: "100%", margin: "0 auto" }}>
              <Form.Control
                type="text"
                placeholder="Search by Patient Name or Transaction wyp is disabled for security reasons"
                value={searchQuery}
                onChange={handleSearchsChange}
                style={{
                  borderRadius: "8px 0 0 8px",
                  borderColor: "#0174BE",
                  height: "50px",
                }}
              />
              <Button
                onClick={() => debouncedSearch(searchQuery)}
                style={{
                  backgroundColor: "#0174BE",
                  color: "#FFFFFF",
                  borderRadius: "0 8px 8px 0",
                  height: "50px",
                }}
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </Col>

          <Col xs={12} md="auto" className="text-center mb-3 mb-md-0">
            <Button
              onClick={downloadExcel}
              style={{
                backgroundColor: "#28A745",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px 20px",
              }}
            >
              <FaDownload style={{ marginRight: "5px" }} /> Download Excel
            </Button>
          </Col>
        </Row>

        <hr />

        <div
          className="table-section p-3"
          style={{ backgroundColor: "#0091A5", borderRadius: "10px" }}
        >
          <h5 className="text-white mb-3">Payroll {selectedDate}</h5>
          <div style={{ overflowX: "auto", maxWidth: "100%" }}>
            <Table
              striped
              bordered
              hover
              style={{ minWidth: "max-content", width: "100%", tableLayout: "auto" }}
            >
              <thead style={{ backgroundColor: "#0174BE", color: "#FFFFFF" }}>
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>S. No</th>
                  <th style={{ whiteSpace: "nowrap" }}>Amount</th>
                  <th style={{ whiteSpace: "nowrap" }}>Patient Name</th>
                  <th style={{ whiteSpace: "nowrap" }}>Patient Phone</th>
                  <th style={{ whiteSpace: "nowrap" }}>Age</th>
                  <th style={{ whiteSpace: "nowrap" }}>Address</th>
                  <th style={{ whiteSpace: "nowrap" }}>Doctor Name</th>
                  <th style={{ whiteSpace: "nowrap" }}>Appointment Date</th>
                  <th style={{ whiteSpace: "nowrap" }}>Transaction ID</th>
                  <th style={{ whiteSpace: "nowrap" }}>Payment Type</th>
                  <th style={{ whiteSpace: "nowrap" }}></th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                      <td>{payment["Amount"]}</td>
                      <td>{payment["Patient Name"]}</td>
                      <td>{payment["Customer Phone"]}</td>
                      <td>{payment["Age"]}</td>
                      <td>{payment["Address"]}</td>
                      <td>{payment["Doctor Name"]}</td>
                      <td>{payment["Appointment Date"]}</td>
                      <td>{payment["cf_payment_id"]}</td>
                      <td>{payment["Payment Type"]}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="link"
                            id={`dropdown-${index}`}
                            style={{ padding: 0, color: "#000" }}
                          >
                            <span style={{ fontSize: "20px", lineHeight: "1" }}>
                              <BsThreeDotsVertical />
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleGenerateInvoice(payment)}
                            >
                              Generate Invoice
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>

        <GenerateInvoice
          isOpen={isInvoiceOpen}
          onCloseInvoice={handleCloseInvoice}
          onCreate={handleCreateInvoice}
          appointment={selectedAppointment}
        />
      </main>
    </div>
  );
};

export default PaymentHistory;