import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import Loader from "react-js-loader";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7); /* Slightly opaque background */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const LoaderImage = styled.div`
  width: 500px;
`;

const AppointmentSlot = () => {
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [showBlockSlotModal, setShowBlockSlotModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const slotsPerPage = 18;

  const [showUnblockSlotModal, setShowUnblockSlotModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [blockSlotData, setBlockSlotData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [unblockSlotData, setUnblockSlotData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const history = useHistory();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const storeUserIdInLocalStorage = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token);
        const doctor_id = decodedToken.doctor_id;
        setDoctorId(doctor_id);
        localStorage.setItem("doctor_id", doctor_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    storeUserIdInLocalStorage();
    fetchTodayAppointmentSlots();
  }, []);

  const fetchTodayAppointmentSlots = async () => {
    setLoading(true);
    try {
      const doctor_id = localStorage.getItem("doctor_id");
      const response = await BaseUrl.get("/doctorappointment/todayslot/", {
        params: { doctor_id: doctor_id },
      });
      setLoading(false);
      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage("");
          setAppointmentSlots([]);
        } else {
          setAppointmentSlots(response.data);
          setErrorMessage("");
        }
      } else {
        setErrorMessage("Error fetching appointment slots.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching appointment slots:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while fetching appointment slots."
      );
    }
  };

  const handleViewDateSlot = async () => {
    setLoading(true);
    try {
      if (selectedDate) {
        const response = await BaseUrl.get(`/doctorappointment/slot/`, {
          params: { doctor_id: doctorId, slot_date: selectedDate },
        });

        if (response.status === 200) {
          if (response.data.length === 0) {
            setErrorMessage("");
            setAppointmentSlots([]);
          } else {
            setAppointmentSlots(response.data);
            setErrorMessage("");
          }
        } else {
          setErrorMessage(
            "Error fetching appointment slots for selected date."
          );
        }
      } else {
        setErrorMessage("Please select a date.");
      }
    } catch (error) {
      console.error("Error handling view date slot:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while fetching appointment slots."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAppointmentSlots = async () => {
    setLoading(true);
    try {
      const response = await BaseUrl.get(`/doctorappointment/todayafterslot/`, {
        params: { doctor_id: doctorId },
      });

      if (response.status === 200) {
        setAppointmentSlots(response.data || []);
        setErrorMessage("");
      } else {
        setErrorMessage("Error fetching all appointment slots.");
      }
    } catch (error) {
      console.error("Error fetching all appointment slots:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while fetching appointment slots."
      );
    } finally {
      setLoading(false);
    }
  };

  const groupedSlots = appointmentSlots.reduce((acc, slot) => {
    const date = slot.appointment_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`);
    const hours = time.getUTCHours().toString().padStart(2, "0");
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleBlockSlot = () => {
    setShowBlockSlotModal(true);
  };

  const handleBlockSlotClose = () => {
    setShowBlockSlotModal(false);
  };

  const handleBlockSlotSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await BaseUrl.patch("/doctorappointment/slot/", {
        start_date: blockSlotData.startDate,
        start_time: blockSlotData.startTime,
        end_date: blockSlotData.endDate,
        end_time: blockSlotData.endTime,
        doctor_id: doctorId,
      });

      if (response.status === 200) {
        setShowBlockSlotModal(false);
        fetchAllAppointmentSlots();
      } else {
        setErrorMessage("Error blocking slot.");
      }
    } catch (error) {
      console.error("Error blocking slot:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while blocking the slot."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockSlot = () => {
    setShowUnblockSlotModal(true);
  };

  const handleUnblockSlotClose = () => {
    setShowUnblockSlotModal(false);
  };

  const handleUnblockSlotSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await BaseUrl.patch("/doctorappointment/unblockslot/", {
        start_date: unblockSlotData.startDate,
        start_time: unblockSlotData.startTime,
        end_date: unblockSlotData.endDate,
        end_time: unblockSlotData.endTime,
        doctor_id: doctorId,
      });

      if (response.status === 200) {
        setShowUnblockSlotModal(false);
        fetchAllAppointmentSlots();
        setSuccessMessage(response.data.success);
      } else {
        setErrorMessage("Error unblocking slot.");
      }
    } catch (error) {
      console.error("Error unblocking slot:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while unblocking the slot."
      );
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleNextPage = (date) => {
    setPagination((prev) => ({
      ...prev,
      [date]: (prev[date] || 1) + 1,
    }));
  };

  const handlePrevPage = (date) => {
    setPagination((prev) => ({
      ...prev,
      [date]: (prev[date] || 1) - 1,
    }));
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#D7EAF0",
        // minHeight: "200vh", // Ensure full height
        paddingBottom: "30px",
        position: "relative",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontWeight: "bold",
          color: "#0C1187",
          fontFamily: "sans-serif",
        }}
      >
        Appointment Slots
      </h2>

      {loading && (
        <LoaderWrapper>
          <LoaderImage>
            <Loader
              type="spinner-circle"
              bgColor={"#0091A5"}
              color={"#0091A5"}
              title={"Loading..."}
              size={100}
            />
          </LoaderImage>
        </LoaderWrapper>
      )}

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="d-flex justify-content-end align-items-center mb-3">
        <div>
          <button
            type="button"
            className="btn me-2"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            onClick={() => history.push("/doctor/addslot")}
          >
            Add Slot
          </button>
          <button
            type="button"
            className="btn me-2"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            onClick={handleBlockSlot}
          >
            Block Slot
          </button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            onClick={handleUnblockSlot}
          >
            Unblock Slot
          </button>
        </div>
      </div>

      <form
        className="appointment-slot-form mb-3 p-4 shadow"
        style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      >
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Select Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="col-md-8 d-flex align-items-end">
            <button
              type="button"
              className="btn me-2"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
              onClick={fetchTodayAppointmentSlots}
            >
              View Today Slots
            </button>
            <button
              type="button"
              className="btn me-2"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
              onClick={fetchAllAppointmentSlots}
            >
              View All Slots
            </button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
              onClick={handleViewDateSlot}
            >
              View Date Slot
            </button>
          </div>
        </div>
      </form>

      <style>{`
  .legend {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap; /* Ensures items wrap on smaller screens */
  }
 
  .legend > div {
    display: flex;
    align-items: center;
    margin-right: 20px;
    margin-bottom: 10px; /* Adds spacing between items on smaller screens */
  }
 
  .legend-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }
 
  .legend-text {
    font-size: 16px; /* Smaller font size for better fit */
  }
 
  /* Media query for screens smaller than 600px (adjust as necessary) */
  @media (max-width: 600px) {
    .legend {
      justify-content: flex-start; /* Aligns items to the left on smaller screens */
      flex-direction: column; /* Stacks items vertically */
      align-items: flex-start; /* Aligns items to the left */
    }
 
    .legend > div {
      margin-right: 0; /* Remove right margin to avoid overflow */
    }
 
    .legend-text {
      font-size: 14px; /* Reduce font size further for smaller screens */
    }
  }
`}</style>

      <div className="legend">
        <div>
          <span
            className="legend-dot"
            style={{ backgroundColor: "#f8d7da" }}
          ></span>
          <span className="legend-text">Blocked</span>
        </div>
        <div>
          <span
            className="legend-dot"
            style={{ backgroundColor: "#A0DEFF" }}
          ></span>
          <span className="legend-text">Booked</span>
        </div>
        <div>
          <span
            className="legend-dot"
            style={{ backgroundColor: "#B0D9B1" }}
          ></span>
          <span className="legend-text">Available</span>
        </div>
        <div>
          <span
            className="legend-dot"
            style={{ backgroundColor: "#F45050" }}
          ></span>
          <span className="legend-text">Canceled</span>
        </div>
      </div>

      <div className="row">
        {Object.keys(groupedSlots).map((date, dateIndex) => {
          const totalSlots = groupedSlots[date].length;
          const totalPages = Math.ceil(totalSlots / slotsPerPage);
          const currentPage = pagination[date] || 1;
          const currentSlots = groupedSlots[date].slice(
            (currentPage - 1) * slotsPerPage,
            currentPage * slotsPerPage
          );

          return (
            <div key={dateIndex} className="mb-4">
              <h4 className="text-center mb-3">{formatDate(date)}</h4>
              <div className="row">
                {currentSlots.map((slot, slotIndex) => (
                  <div className="col-md-2 mb-4" key={slotIndex}>
                    <div
                      className="card"
                      style={{
                        backgroundColor: slot.is_blocked
                          ? "#f8d7da"
                          : slot.is_canceled
                            ? "#F45050"
                            : slot.is_booked
                              ? "#A0DEFF"
                              : "#B0D9B1",
                      }}
                    >
                      <div className="card-body text-center">
                        <strong>Slot:</strong>{" "}
                        {formatTime(slot.appointment_slot)}
                        <br />
                        <strong>Status:</strong>{" "}
                        {slot.is_blocked
                          ? "Blocked"
                          : slot.is_canceled
                            ? "Canceled"
                            : slot.is_booked
                              ? "Booked"
                              : "Available"}
                        <br />
                        <strong>Patient:</strong> {slot.booked_by || "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center mt-4">
                <Button
                  className="btn me-2"
                  variant="outline-secondary"
                  onClick={() => handlePrevPage(date)}
                  disabled={currentPage === 1}
                >
                  &larr;
                </Button>
                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  className="btn ms-2"
                  variant="outline-secondary"
                  onClick={() => handleNextPage(date)}
                  disabled={currentPage === totalPages}
                >
                  &rarr;
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal show={showBlockSlotModal} onHide={handleBlockSlotClose}>
        <Modal.Header closeButton>
          <Modal.Title>Block Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBlockSlotSubmit}>
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={blockSlotData.startDate}
                onChange={(e) =>
                  setBlockSlotData({
                    ...blockSlotData,
                    startDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={blockSlotData.endDate}
                onChange={(e) =>
                  setBlockSlotData({
                    ...blockSlotData,
                    endDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={blockSlotData.startTime}
                onChange={(e) =>
                  setBlockSlotData({
                    ...blockSlotData,
                    startTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={blockSlotData.endTime}
                onChange={(e) =>
                  setBlockSlotData({
                    ...blockSlotData,
                    endTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            >
              Block Slot
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showUnblockSlotModal} onHide={handleUnblockSlotClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unblock Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUnblockSlotSubmit}>
            <Form.Group controlId="formUnblockStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={unblockSlotData.startDate}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    startDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formUnblockEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={unblockSlotData.endDate}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    endDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formUnblockStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={unblockSlotData.startTime}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    startTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formUnblockEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={unblockSlotData.endTime}
                onChange={(e) =>
                  setUnblockSlotData({
                    ...unblockSlotData,
                    endTime: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              style={{ backgroundColor: "#199fd9", color: "#f1f8dc" }}
            >
              Unblock Slot
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AppointmentSlot;
