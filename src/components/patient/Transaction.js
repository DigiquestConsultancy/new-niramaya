// import React, { useEffect, useState } from "react";
// import { Table, Container, Spinner } from "react-bootstrap";
// import styled from "styled-components";
// import { jwtDecode } from "jwt-decode";
// import BaseUrl from "../../api/BaseUrl";

// const TableWrapper = styled.div`
//   overflow-x: auto;
//   margin-top: 20px;
// `;

// const StyledTable = styled(Table)`
//   border-collapse: collapse;
//   border-spacing: 0;
//   width: 100%;
//   th,
//   td {
//     text-align: center;
//     vertical-align: middle;
//   }
//   th {
//     background-color: #0091a5;
//     color: white;
//     font-weight: bold;
//   }
//   tr:nth-child(even) {
//     background-color: #f2f2f2;
//   }
//   tr:hover {
//     background-color: #d7eaf0;
//     cursor: pointer;
//   }
//   td {
//     padding: 15px;
//   }
// `;

// const Transaction = () => {
//     const [transactions, setTransactions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const patientToken = localStorage.getItem("patient_token");

//     useEffect(() => {
//         const fetchTransactions = async () => {
//             try {
//                 const decodedToken = jwtDecode(patientToken);
//                 const patientId = decodedToken?.patient_id;
//                 const response = await BaseUrl.get(`/payment/paymenthistory/?patient_id=${patientId}`);
//                 if (response.status === 200) {
//                     setTransactions(response.data);
//                 } else {
//                     throw new Error("Failed to fetch transactions");
//                 }
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchTransactions();
//     }, [patientToken]);

//     return (
//         <Container fluid style={{ backgroundColor: "#FBFBFB" }}>
//             <h2
//                 className="text-center mt-4 mb-4"
//                 style={{ color: "#0091a5", fontWeight: "bold" }}
//             >
//                 Transaction History
//             </h2>
//             <TableWrapper>
//                 <StyledTable bordered hover responsive>
//                     <thead>
//                         <tr>
//                             <th>Patient Name</th>
//                             <th>Patient Phone</th>
//                             <th>Amount</th>
//                             <th>Payment Date/Time</th>
//                             <th>Payment Method</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td colSpan="6" style={{ textAlign: "center" }}>
//                                     <Spinner animation="border" variant="primary" />
//                                 </td>
//                             </tr>
//                         ) : error ? (
//                             <tr>
//                                 <td
//                                     colSpan="6"
//                                     style={{
//                                         textAlign: "center",
//                                         color: "red",
//                                         fontWeight: "bold",
//                                     }}
//                                 >
//                                     {error}
//                                 </td>
//                             </tr>
//                         ) : transactions.length > 0 ? (
//                             transactions.map((transaction) => (
//                                 <tr key={transaction.order_id}>
//                                     <td>{transaction.customer_name}</td>
//                                     <td>{transaction.customer_phone}</td>
//                                     <td>{transaction.amount.toFixed(2)}</td>
//                                     <td>
//                                         {new Date(transaction.payment_completion_time).toLocaleString()}
//                                     </td>
//                                     <td>{transaction.payment_method}</td>
//                                     <td
//                                         style={{
//                                             color:
//                                                 transaction.status === "SUCCESS"
//                                                     ? "green"
//                                                     : transaction.status === "PENDING"
//                                                         ? "orange"
//                                                         : "red",
//                                             fontWeight: "bold",
//                                             fontSize: "12px",
//                                         }}
//                                     >
//                                         {transaction.status}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan="8"
//                                     style={{
//                                         textAlign: "center",
//                                         fontStyle: "italic",
//                                         color: "#666",
//                                     }}
//                                 >
//                                     No transactions available.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </StyledTable>
//             </TableWrapper>
//         </Container>
//     );
// };

// export default Transaction;






import React, { useEffect, useState } from "react";
import { Table, Container, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import BaseUrl from "../../api/BaseUrl";

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const StyledTable = styled(Table)`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  th,
  td {
    text-align: center;
    vertical-align: middle;
  }
  th {
    background-color: #0091a5;
    color: white;
    font-weight: bold;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  tr:hover {
    background-color: #d7eaf0;
    cursor: pointer;
  }
  td {
    padding: 15px;
  }
`;

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const patientToken = localStorage.getItem("patient_token");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const decodedToken = jwtDecode(patientToken);
                const patientId = decodedToken?.patient_id;
                const response = await BaseUrl.get(`/payment/paymenthistory/?patient_id=${patientId}`);
                if (response.status === 200) {
                    setTransactions(response.data);
                } else {
                    throw new Error("Failed to fetch transactions");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [patientToken]);

    return (
        <Container fluid style={{ backgroundColor: "#FBFBFB" }}>
            <h2
                className="text-center mt-4 mb-4"
                style={{ color: "#0091a5", fontWeight: "bold" }}
            >
                Transaction History
            </h2>
            <TableWrapper>
                <StyledTable bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient Phone</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Payment Time</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    <Spinner animation="border" variant="primary" />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    style={{
                                        textAlign: "center",
                                        color: "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {error}
                                </td>
                            </tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((transaction) => {
                                const paymentDateTime = new Date(transaction.payment_completion_time);
                                const paymentDate = paymentDateTime.toLocaleDateString();
                                const paymentTime = paymentDateTime.toLocaleTimeString();
                                return (
                                    <tr key={transaction.order_id}>
                                        <td>{transaction.customer_name}</td>
                                        <td>{transaction.customer_phone}</td>
                                        <td>{transaction.amount.toFixed(2)}</td>
                                        <td>{paymentDate}</td>
                                        <td>{paymentTime}</td>
                                        <td>{transaction.payment_method}</td>
                                        <td
                                            style={{
                                                color:
                                                    transaction.status === "SUCCESS"
                                                        ? "green"
                                                        : transaction.status === "FAILED"
                                                            ? "red"
                                                            : transaction.status === "ACTIVE"
                                                                ? "orange"
                                                                : "black",
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {transaction.status}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    style={{
                                        textAlign: "center",
                                        fontStyle: "italic",
                                        color: "#666",
                                    }}
                                >
                                    No transactions available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </StyledTable>
            </TableWrapper>
        </Container>
    );
};

export default Transaction;
