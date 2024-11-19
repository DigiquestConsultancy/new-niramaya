import React, { useState, useEffect, useCallback } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Loader from "react-js-loader";
import styled from "styled-components";

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
  width: 400px;
`;

const ManageClinic = () => {
  const [clinicDetails, setClinicDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
      setErrorMessage(error.response?.data?.error || "");
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

  const handleRemove = async (clinic_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this clinic?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      const response = await BaseUrl.delete(`/clinic/details/`, {
        data: { clinic_ids: [clinic_id] },
      });
      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setClinicDetails(
          clinicDetails.filter((detail) => detail.clinic_id !== clinic_id)
        );
      } else {
        throw new Error("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
    } finally {
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
    <div
      className={`container-fluid ${loading ? "blur-background" : "none"}`}
      style={{
        backgroundColor: "#D7EAF0",
        padding: "20px",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
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

      <div
        className="d-flex justify-content-between align-items-center flex-wrap"
        style={{ marginBottom: "20px" }}
      >
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
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: "#024CAA",
            color: "#f1f8dc",
            fontFamily: "sans-serif",
            fontSize: "16px",
            marginLeft: "auto",
          }}
          onClick={() => history.push("/doctor/manageclinic/addclinic")}
        >
          Add Clinic
        </button>
      </div>

      <div className="table-responsive" style={{ overflowX: "auto" }}>
        <table
          className="table table-striped"
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: "sans-serif",
            fontSize: "16px",
            whiteSpace: "nowrap",
            tableLayout: "fixed",
            borderRadius: "10px",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeadingStyle}>Mobile Number</th>
              <th style={tableHeadingStyle}>Name</th>
              <th style={tableHeadingStyle}>Gender</th>
              <th style={tableHeadingStyle}>Specialization</th>
              <th style={tableHeadingStyle}>Actions</th>
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
                  <td className="d-flex" style={{ gap: "5px" }}>
                    <button
                      className="btn me-2"
                      style={viewButtonStyle}
                      onClick={() => handleViewDetails(detail.clinic_id)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-danger"
                      style={removeButtonStyle}
                      onClick={() => handleRemove(detail.clinic_id)}
                    >
                      Remove
                    </button>
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
                    <div className="alert alert-success">{successMessage}</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

const mediaStyles = `
  @media (max-width: 768px) {
    h1 {
      font-size: 24px !important;
    }
    th {
      font-size: 16px !important;
    }
    td {
      font-size: 14px !important;
      padding: 10px !important;
    }
    button {
      font-size: 14px !important;
      width: auto !important; /* Ensure buttons are not full-width */
      margin-bottom: 5px !important;
    }
    table {
      table-layout: auto !important;
    }
  }
 
  @media (max-width: 576px) {
    h1 {
      font-size: 20px !important;
    }
    th, td {
      font-size: 12px !important;
      padding: 8px !important;
    }
    button {
      font-size: 12px !important;
      width: auto !important; /* Ensure buttons stay in a row */
    }
    table {
      table-layout: auto !important;
    }
  }
`;

// Inject media query styles dynamically into the document
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = mediaStyles;
// document.head.appendChild(styleSheet);

export default ManageClinic;
