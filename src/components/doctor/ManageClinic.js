import React, { useState, useEffect, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Loader from "react-js-loader";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import { Modal } from "react-bootstrap";
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

const ManageClinic = () => {
  const [clinicDetails, setClinicDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetClinicId, setTargetClinicId] = useState(null);
  const history = useHistory();

  const [selectedMenu, setSelectedMenu] = useState("Manage Clinic");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const showTimedMessage = (type, msg) => {
    if (type === "success") {
      setSuccessMessage(msg);
    } else {
      setErrorMessage(msg);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const fetchClinicDetails = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const response = await BaseUrl.get(
        `/clinic/detailsbyid/?doctor_id=${doctor_id}`
      );

      if (response.status === 200) {
        setErrorMessage("");
        setClinicDetails(response.data);
      } else {
        throw new Error("");
      }
    } catch (error) {
      showTimedMessage("error", error.response?.data?.error || "");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClinicDetails();
  }, [fetchClinicDetails]);

  const handleViewDetails = (clinic_id) => {
    history.push(`/doctor/manageclinic/details/${clinic_id}`);
  };

  const confirmDelete = (clinic_id) => {
    setTargetClinicId(clinic_id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await BaseUrl.delete(`/clinic/details/`, {
        data: { clinic_ids: [targetClinicId] },
      });
      if (response.status === 200) {
        showTimedMessage("success", response.data.success);
        setClinicDetails(
          clinicDetails.filter((detail) => detail.clinic_id !== targetClinicId)
        );
      } else {
        throw new Error("");
      }
    } catch (error) {
      showTimedMessage("error", error.response?.data?.error || "");
    } finally {
      setShowConfirmModal(false);
      setTargetClinicId(null);
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClinicDetails = clinicDetails.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(clinicDetails.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar
        selectedMenu={selectedMenu}
        handleMenuClick={handleMenuClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main className="p-4">
        {loading && (
          <LoaderWrapper>
            <Loader>
              <Loader
                type="spinner-circle"
                bgColor={"#0091A5"}
                color={"#0091A5"}
                title={"Loading..."}
                size={100}
              />
            </Loader>
          </LoaderWrapper>
        )}

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
            Clinic Details
          </h1>
          <Button
            className="add"
            onClick={() => history.push("/doctor/manageclinic/addclinic")}
          >
            Add Clinic
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
              {currentClinicDetails.length > 0 ? (
                currentClinicDetails.map((detail) => (
                  <tr key={detail.clinic_id}>
                    <td>{detail.mobile_number}</td>
                    <td>{detail.name}</td>
                    <td>{detail.gender}</td>
                    <td>{detail.specialization}</td>
                    <td>
                      <span onClick={() => handleViewDetails(detail.clinic_id)}>
                        <FaEye
                          style={{
                            fontSize: "24px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        />
                      </span>{" "}
                      <span onClick={() => confirmDelete(detail.clinic_id)}>
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
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {errorMessage && (
                      <div className="alert alert-danger">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="alert alert-success">
                        {successMessage}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>

        {/* Confirmation Modal */}
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this clinic?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Pagination */}
        <div
          className="d-flex justify-content-center mt-4"
          style={{ position: "absolute", bottom: "20px", width: "100%" }}
        >
          <button
            className="btn btn-secondary mx-1"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from(
            {
              length: Math.ceil(clinicDetails.length / itemsPerPage),
            },
            (_, index) => (
              <button
                key={index}
                className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"} mx-1`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            className="btn btn-secondary mx-1"
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(clinicDetails.length / itemsPerPage)
            }
          >
            →
          </button>
        </div>
      </main>
    </div>
  );
};

const tableHeadingStyle = {
  fontFamily: "sans-serif",
  fontWeight: "bold",
  color: "#fff",
  fontSize: "20px",
  padding: "15px",
  backgroundColor: "#0091A5",
};
const viewButtonStyle = {
  backgroundColor: "#024CAA",
  color: "#f1f8dc",
  fontFamily: "sans-serif",
  fontSize: "16px",
};

const removeButtonStyle = {
  backgroundColor: "#BC1B2E",
  color: "#fff",
  fontFamily: "sans-serif",
  fontSize: "16px",
};

export default ManageClinic;
