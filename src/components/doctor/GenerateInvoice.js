import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const GenerateInvoice = ({ isOpen, onCloseInvoice, onCreate, appointment }) => {
  const [services, setServices] = useState([
    {
      description: "medicine charges",
      qty: 1,
      amount: 1000,
      discount: 0,
      total: 1000,
    },
    {
      description: "medicine charges",
      qty: 1,
      amount: 1000,
      discount: 0,
      total: 1000,
    },
  ]);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState(2000);
  const [paymentId, setPaymentId] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  const totalAmount = services.reduce((sum, service) => sum + service.total, 0);
  const grandTotal = totalAmount - additionalDiscount;

  const handleServiceChange = (index, field, value) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? {
              ...service,
              [field]: value,
              total:
                field === "qty" || field === "amount" || field === "discount"
                  ? (field === "qty" ? value : service.qty) *
                      (field === "amount" ? value : service.amount) -
                    (field === "discount" ? value : service.discount)
                  : service.total,
            }
          : service
      )
    );
  };

  const patient = {
    name: appointment?.booked_by || "N/A",
    uhid: appointment?.uhid || "N/A",
    phone: appointment?.mobile_number || "N/A",
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={service.description}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={service.qty}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "qty",
                              parseInt(e.target.value) || 0
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
                            value={service.amount}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "amount",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={service.discount}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "discount",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={service.total}
                            disabled
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() =>
                            setServices(services.filter((_, i) => i !== index))
                          }
                        >
                          <RxCross2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="btn text-primary mb-3"
              onClick={() =>
                setServices([
                  ...services,
                  { description: "", qty: 1, amount: 0, discount: 0, total: 0 },
                ])
              }
            >
              + Add another
            </button>

            <div className="row mt-3">
              <div className="col-12 col-md-6 ">
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
                            setter(parseInt(e.target.value) || 0)
                          }
                          min="0"
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
                  <div
                    key={idx}
                    className="d-flex justify-content-between mb-2"
                  >
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
                { label: "Remarks", value: remarks, setter: setRemarks,  placeholder: "Add any remarks here..." },
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
              onClick={onCreate}
            >
              Create Receipt <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;
