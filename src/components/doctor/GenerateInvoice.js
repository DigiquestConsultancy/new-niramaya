// import React, { useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { IoMdSend } from "react-icons/io";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// const GenerateInvoice = ({ isOpen, onCloseInvoice, onCreate, appointment }) => {
//   const [services, setServices] = useState([
//     {
//       description: "medicine charges",
//       qty: 1,
//       amount: 1000,
//       discount: 0,
//       total: 1000,
//     },
//     {
//       description: "medicine charges",
//       qty: 1,
//       amount: 1000,
//       discount: 0,
//       total: 1000,
//     },
//   ]);
//   const [additionalDiscount, setAdditionalDiscount] = useState(0);
//   const [paymentMode, setPaymentMode] = useState("Cash");
//   const [paymentAmount, setPaymentAmount] = useState(2000);
//   const [paymentId, setPaymentId] = useState("");
//   const [remarks, setRemarks] = useState("");

//   if (!isOpen) return null;

//   const totalAmount = services.reduce((sum, service) => sum + service.total, 0);
//   const grandTotal = totalAmount - additionalDiscount;

//   const handleServiceChange = (index, field, value) => {
//     setServices((prev) =>
//       prev.map((service, i) =>
//         i === index
//           ? {
//               ...service,
//               [field]: value,
//               total:
//                 field === "qty" || field === "amount" || field === "discount"
//                   ? (field === "qty" ? value : service.qty) *
//                       (field === "amount" ? value : service.amount) -
//                     (field === "discount" ? value : service.discount)
//                   : service.total,
//             }
//           : service
//       )
//     );
//   };

//   const patient = {
//     name: appointment?.booked_by || "N/A",
//     uhid: appointment?.uhid || "N/A",
//     phone: appointment?.mobile_number || "N/A",
//   };

//   return (
//     <div
//       className="modal fade show d-block"
//       tabIndex="-1"
//       style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//     >
//       <style>
//         {`
//           @media (max-width: 576px) {
//             .modal-dialog { margin: 0.5rem; }
//             .table th, .table td { padding: 0.5rem; font-size: 12px; }
//             .form-control, .btn { font-size: 14px; padding: 0.4rem; }
//           }
//         `}
//       </style>
//       <div className="modal-dialog modal-lg modal-dialog-scrollable">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Create Receipt</h5>
//             <button className="btn-close" onClick={onCloseInvoice}></button>
//           </div>
//           <div className="modal-body">
//             <div className="row mb-3">
//               {[
//                 { label: "Name", value: patient.name },
//                 { label: "UHID", value: patient.uhid },
//                 { label: "Phone", value: patient.phone },
//                 { label: "Payment Status", value: "Unbilled" },
//               ].map(({ label, value }, idx) => (
//                 <div key={idx} className="col-12 col-md-6 mb-2">
//                   <label className="form-label" style={{ fontSize: "14px" }}>
//                     {label}
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={value}
//                     disabled
//                     style={{ backgroundColor: "#F7F7F7" }}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="table-responsive">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr style={{ fontSize: "14px" }}>
//                     <th style={{ minWidth: "120px" }}>Service</th>
//                     <th style={{ minWidth: "80px" }}>QTY</th>
//                     <th style={{ minWidth: "100px" }}>Amount</th>
//                     <th style={{ minWidth: "100px" }}>Discount</th>
//                     <th style={{ minWidth: "100px" }}>Total</th>
//                     <th style={{ minWidth: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {services.map((service, index) => (
//                     <tr key={index}>
//                       <td>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={service.description}
//                           onChange={(e) =>
//                             handleServiceChange(
//                               index,
//                               "description",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={service.qty}
//                           onChange={(e) =>
//                             handleServiceChange(
//                               index,
//                               "qty",
//                               parseInt(e.target.value) || 0
//                             )
//                           }
//                           min="1"
//                         />
//                       </td>
//                       <td>
//                         <div className="input-group">
//                           <span className="input-group-text">₹</span>
//                           <input
//                             type="number"
//                             className="form-control"
//                             value={service.amount}
//                             onChange={(e) =>
//                               handleServiceChange(
//                                 index,
//                                 "amount",
//                                 parseInt(e.target.value) || 0
//                               )
//                             }
//                             min="0"
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="input-group">
//                           <span className="input-group-text">₹</span>
//                           <input
//                             type="number"
//                             className="form-control"
//                             value={service.discount}
//                             onChange={(e) =>
//                               handleServiceChange(
//                                 index,
//                                 "discount",
//                                 parseInt(e.target.value) || 0
//                               )
//                             }
//                             min="0"
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="input-group">
//                           <span className="input-group-text">₹</span>
//                           <input
//                             type="number"
//                             className="form-control"
//                             value={service.total}
//                             disabled
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-link text-danger p-0"
//                           onClick={() =>
//                             setServices(services.filter((_, i) => i !== index))
//                           }
//                         >
//                           <RxCross2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <button
//               className="btn text-primary mb-3"
//               onClick={() =>
//                 setServices([
//                   ...services,
//                   { description: "", qty: 1, amount: 0, discount: 0, total: 0 },
//                 ])
//               }
//             >
//               + Add another
//             </button>

//             <div className="row mt-3">
//               <div className="col-12 col-md-6 ">
//                 {[
//                   {
//                     label: "Additional Discount",
//                     value: additionalDiscount,
//                     setter: setAdditionalDiscount,
//                     type: "number",
//                   },
//                   {
//                     label: "Paymode",
//                     value: paymentMode,
//                     setter: setPaymentMode,
//                     type: "select",
//                   },
//                   {
//                     label: "Payment Amount",
//                     value: paymentAmount,
//                     setter: setPaymentAmount,
//                     type: "number",
//                   },
//                 ].map(({ label, value, setter, type }, idx) => (
//                   <div key={idx} className="mb-2">
//                     <label className="form-label" style={{ fontSize: "14px" }}>
//                       {label}:
//                     </label>
//                     {type === "select" ? (
//                       <select
//                         className="form-select"
//                         value={value}
//                         onChange={(e) => setter(e.target.value)}
//                       >
//                         <option value="Cash">Cash</option>
//                         <option value="Card">Card</option>
//                         <option value="UPI">UPI</option>
//                       </select>
//                     ) : (
//                       <div className="input-group">
//                         <span className="input-group-text">₹</span>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={value}
//                           onChange={(e) =>
//                             setter(parseInt(e.target.value) || 0)
//                           }
//                           min="0"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="col-12 col-md-6 mb-3">
//                 {[
//                   { label: "Total Amount", value: totalAmount },
//                   { label: "Line Item", value: "- ₹0", color: "red" },
//                   {
//                     label: "Additional Discount",
//                     value: `- ₹${additionalDiscount}`,
//                     color: "red",
//                   },
//                   {
//                     label: "Grand Total",
//                     value: `₹${grandTotal}`,
//                     color: "green",
//                     bold: true,
//                   },
//                   { label: "Amount Paid", value: `₹${paymentAmount}` },
//                 ].map(({ label, value, color, bold }, idx) => (
//                   <div
//                     key={idx}
//                     className="d-flex justify-content-between mb-2"
//                   >
//                     <span
//                       style={{
//                         fontSize: bold ? "16px" : "14px",
//                         fontWeight: bold ? "bold" : "normal",
//                       }}
//                     >
//                       {label}:
//                     </span>
//                     <span
//                       style={{
//                         fontSize: bold ? "16px" : "14px",
//                         color: color || "inherit",
//                         fontWeight: bold ? "bold" : "normal",
//                       }}
//                     >
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="row">
//               {[
//                 {
//                   label: "Payment ID",
//                   value: paymentId,
//                   setter: setPaymentId,
//                   placeholder: "Enter Payment ID (Optional)",
//                 },
//                 { label: "Remarks", value: remarks, setter: setRemarks,  placeholder: "Add any remarks here..." },
//               ].map(({ label, value, setter, placeholder }, idx) => (
//                 <div key={idx} className="col-12 col-md-6">
//                   <label className="form-label" style={{ fontSize: "14px" }}>
//                     {label}
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder={placeholder}
//                     value={value}
//                     onChange={(e) => setter(e.target.value)}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onCloseInvoice}>
//               Cancel
//             </button>
//             <button
//               className="btn"
//               style={{ backgroundColor: "#29725A", color: "white" }}
//               onClick={onCreate}
//             >
//               Create Receipt <IoMdSend />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GenerateInvoice;






import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import { FaTrash } from "react-icons/fa"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";

const GenerateInvoice = ({ isOpen, onCloseInvoice, onCreate, appointment }) => {
  const [items, setItems] = useState([]);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [receiptData, setReceiptData] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = totalAmount - additionalDiscount;

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "description" ? value : parseFloat(value) || 0,
              total:
                field === "qty" || field === "amount" || field === "discount"
                  ? (field === "qty" ? parseInt(value) || 0 : item.qty) *
                      (field === "amount" ? parseFloat(value) || 0 : item.amount) -
                    (field === "discount" ? parseFloat(value) || 0 : item.discount)
                  : item.total,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", qty: 1, amount: 0, discount: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const patient = {
    name: appointment?.booked_by || "N/A",
    uhid: appointment?.uhid || "N/A",
    phone: appointment?.mobile_number || "N/A",
  };

  const handleViewPdf = (pdfUrl) => {
    // Construct the PDF URL
    const baseUrl = BaseUrl.defaults.baseURL.replace(/\/$/, ""); // Remove trailing slash
    const normalizedPdfUrl = pdfUrl.replace(/^\/+/, ""); // Remove leading slashes
    const fullPdfUrl = `${baseUrl}/${normalizedPdfUrl}`;

    // Log for debugging
    console.log({ pdfUrl, fullPdfUrl });

    // Open the PDF in a new tab
    window.open(fullPdfUrl, "_blank");
  };

  const handleDeleteReceipt = async (receiptId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("receipt_id", receiptId);

      const response = await BaseUrl.delete("/doctor/receipt/", {
        data: formData,
      });

      setReceiptData((prev) =>
        prev.filter((receipt) => receipt.receipt_id !== receiptId)
      );

      setSuccess(response.data.success || "Receipt deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete receipt");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCreateReceipt = async () => {
    if (
      items.length === 0 ||
      items.some((item) => !item.description || item.qty <= 0 || item.amount < 0)
    ) {
      setError(
        "Please add at least one valid service with description, quantity, and amount."
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    const token = localStorage.getItem("token");
    let doctorId;
    try {
      const decodedToken = jwtDecode(token);
      doctorId = decodedToken.doctor_id;
    } catch (err) {
      setError("Invalid token. Please log in again.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const payload = {
      appointment_id: appointment?.appointment_id,
      patient: appointment?.patient,
      doctor_id: doctorId,
      name: patient.name,
      phone: patient.phone,
      uh_id: patient.uhid,
      payment_status: "Unbilled",
      paymode: paymentMode,
      payment_id: paymentId || null,
      amount_paid: paymentAmount.toString(),
      additional_discount: additionalDiscount.toString(),
      remarks: remarks || null,
      items: items.map((item) => ({
        service_name: item.description,
        qty: item.qty,
        amount: item.amount.toString(),
        discount: item.discount.toString(),
        total: item.total.toString(),
      })),
    };

    try {
      const postResponse = await BaseUrl.post("/doctor/receipt/", payload);
      const getResponse = await BaseUrl.get("/doctor/receipt/", {
        params: {
          patient_id: appointment?.patient,
          appointment_id: appointment?.appointment_id,
        },
      });

      if (getResponse.data.length > 0) {
        setReceiptData(getResponse.data); // Store the receipts in state
        setShowReceiptModal(true); // Open the modal with the receipts
      }

      setSuccess(postResponse.data.success || "Receipt created successfully");
      // setTimeout(() => {
      //   setSuccess("");
      //   onCreate(getResponse.data);
      // }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create receipt");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        display: isOpen ? "block" : "none",
      }}
    >
      <style>
        {`
          @media (max-width: 576px) {
            .modal-dialog { margin: 0.5rem; }
            .table th, .table td { padding: 0.5rem; font-size: 12px; }
            .form-control, .btn { font-size: 14px; padding: 0.4rem; }
          }
        `}
      </style>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Receipt</h5>
            <button className="btn-close" onClick={onCloseInvoice}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}
            <div className="row mb-3">
              {[
                { label: "Name", value: patient.name },
                { label: "UHID", value: patient.uhid },
                { label: "Phone", value: patient.phone },
                { label: "Payment Status", value: "Unbilled" },
              ].map(({ label, value }, idx) => (
                <div key={idx} className="col-12 col-md-6 mb-2">
                  <label className="form-label" style={{ fontSize: "14px" }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={value}
                    disabled
                    style={{ backgroundColor: "#F7F7F7" }}
                  />
                </div>
              ))}
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr style={{ fontSize: "14px" }}>
                    <th style={{ minWidth: "120px" }}>Service</th>
                    <th style={{ minWidth: "80px" }}>QTY</th>
                    <th style={{ minWidth: "100px" }}>Amount</th>
                    <th style={{ minWidth: "100px" }}>Discount</th>
                    <th style={{ minWidth: "100px" }}>Total</th>
                    <th style={{ minWidth: "50px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(index, "description", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          min="1"
                        />
                      </td>
                      <td>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={item.amount}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "amount",
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={item.discount}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "discount",
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={item.total}
                            disabled
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeItem(index)}
                        >
                          <RxCross2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="btn text-primary mb-3" onClick={addItem}>
              + Add another
            </button>

            <div className="row mt-3">
              <div className="col-12 col-md-6">
                {[
                  {
                    label: "Additional Discount",
                    value: additionalDiscount,
                    setter: setAdditionalDiscount,
                    type: "number",
                  },
                  {
                    label: "Paymode",
                    value: paymentMode,
                    setter: setPaymentMode,
                    type: "select",
                  },
                  {
                    label: "Payment Amount",
                    value: paymentAmount,
                    setter: setPaymentAmount,
                    type: "number",
                  },
                ].map(({ label, value, setter, type }, idx) => (
                  <div key={idx} className="mb-2">
                    <label className="form-label" style={{ fontSize: "14px" }}>
                      {label}:
                    </label>
                    {type === "select" ? (
                      <select
                        className="form-select"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                      </select>
                    ) : (
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={value}
                          onChange={(e) =>
                            setter(Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="col-12 col-md-6 mb-3">
                {[
                  { label: "Total Amount", value: totalAmount },
                  { label: "Line Item", value: "- ₹0", color: "red" },
                  {
                    label: "Additional Discount",
                    value: `- ₹${additionalDiscount}`,
                    color: "red",
                  },
                  {
                    label: "Grand Total",
                    value: `₹${grandTotal}`,
                    color: "green",
                    bold: true,
                  },
                  { label: "Amount Paid", value: `₹${paymentAmount}` },
                ].map(({ label, value, color, bold }, idx) => (
                  <div key={idx} className="d-flex justify-content-between mb-2">
                    <span
                      style={{
                        fontSize: bold ? "16px" : "14px",
                        fontWeight: bold ? "bold" : "normal",
                      }}
                    >
                      {label}:
                    </span>
                    <span
                      style={{
                        fontSize: bold ? "16px" : "14px",
                        color: color || "inherit",
                        fontWeight: bold ? "bold" : "normal",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              {[
                {
                  label: "Payment ID",
                  value: paymentId,
                  setter: setPaymentId,
                  placeholder: "Enter Payment ID (Optional)",
                },
                {
                  label: "Remarks",
                  value: remarks,
                  setter: setRemarks,
                  placeholder: "Add any remarks here...",
                },
              ].map(({ label, value, setter, placeholder }, idx) => (
                <div key={idx} className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "14px" }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCloseInvoice}>
              Cancel
            </button>
            <button
              className="btn"
              style={{ backgroundColor: "#29725A", color: "white" }}
              onClick={handleCreateReceipt}
            >
              Create Receipt <IoMdSend />
            </button>
          </div>
        </div>

        {showReceiptModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "block",
            }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Receipt Details</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowReceiptModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <ul className="list-group">
                    {receiptData.map((receipt) => (
                      <li
                        key={receipt.receipt_id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{receipt.patient_name}</span>
                        <span>Receipt ID: {receipt.receipt_id}</span>
                        <div>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleViewPdf(receipt.pdf_url)}
                          >
                             {/* <FaEye size={18} style={{color: "blue"}}/> */}
                             View
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleDeleteReceipt(receipt.receipt_id)}
                          >
                            <FaTrash size={18} style={{color: "red"}} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateInvoice;