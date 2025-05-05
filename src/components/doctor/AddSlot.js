import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import styled from "styled-components";
import Loader from "react-js-loader";
import Sidebar from "./Sidebar";

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
  width: 200px;
  / Reduced size for smaller screens / @media (min-width: 768px) {
    width: 400px;
  }
`;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 4rem);
  overflow-y: hidden;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column; / Stack sidebar and main content on smaller screens /
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const FormWrapper = styled.form`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  color: #000000;

  @media (max-width: 576px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column; / Stack form fields vertically on smaller screens /
  }
`;

const FormColumn = styled.div`
  flex: 1;
  min-width: 0;
  / Prevent overflow / @media (min-width: 768px) {
    min-width: 200px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Required = styled.span`
  color: #dc3545;
  margin-left: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #ffffff;

  &:hover {
    background-color: #0056b3;
  }

  @media (min-width: 768px) {
    width: auto;
    padding: 0.75rem 1.5rem;
  }
`;

const Alert = styled.div`
  font-family: sans-serif;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &.alert-success {
    background-color: #d4edda;
    color: #34a218;
  }

  &.alert-danger {
    background-color: #f8d7da;
    color: #8e0000;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const AddSlot = () => {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    interval_minutes: "",
    leave_days: [],
    doctor_id: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const doctor_id = decodedToken.doctor_id;
        setFormData((prevFormData) => ({
          ...prevFormData,
          doctor_id: doctor_id,
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const day = parseInt(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        leave_days: checked
          ? [...prevFormData.leave_days, day]
          : prevFormData.leave_days.filter((d) => d !== day),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await BaseUrl.post("/doctorappointment/slot/", formData);

      if (response.status === 201) {
        setSuccessMessage(response.data.success);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Error adding slot.");
      }
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const generateIntervalMinutesOptions = () => {
    const options = [];
    for (let i = 5; i <= 60; i += 5) {
      options.push(
        <option key={i} value={i}>
          {i} minutes
        </option>
      );
    }
    return options;
  };

  const dayOptions = [
    { label: "Monday", value: 0 },
    { label: "Tuesday", value: 1 },
    { label: "Wednesday", value: 2 },
    { label: "Thursday", value: 3 },
    { label: "Friday", value: 4 },
    { label: "Saturday", value: 5 },
    { label: "Sunday", value: 6 },
  ];

  const handleLeaveDaysChange = (selectedOptions) => {
    const selectedDays = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, leave_days: selectedDays });
  };

  const today = new Date().toISOString().split("T")[0];
  const isTodaySelected = formData.start_date === today;
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
    className="d-flex"
    style={{
      height: "calc(100vh - 4rem)",
      overflowY: "auto",
      flexDirection: "row",
    }}
  >
      <Sidebar
        selectedMenu={selectedMenu}
        handleMenuClick={handleMenuClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
       <div className="container mt-5">
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

        {errorMessage && <Alert className="alert-danger">{errorMessage}</Alert>}
        {successMessage && (
          <Alert className="alert-success">{successMessage}</Alert>
        )}

        <FormWrapper onSubmit={handleSubmit}>
          <Title>Create Slot</Title>
          <FormRow>
            <FormColumn>
              <Label>
                Start Date<Required>*</Required>
              </Label>
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                min={today}
                required
              />
            </FormColumn>
            <FormColumn>
              <Label>
                End Date<Required>*</Required>
              </Label>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date || today}
                required
              />
            </FormColumn>
            <FormColumn>
              <Label>Leave Days</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={dayOptions}
                value={dayOptions.filter((option) =>
                  formData.leave_days.includes(option.value)
                )}
                onChange={handleLeaveDaysChange}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Label>
                Start Time<Required>*</Required>
              </Label>
              <input
                type="time"
                className="form-control"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                min={isTodaySelected ? currentTime : ""}
                required
              />
            </FormColumn>
            <FormColumn>
              <Label>
                End Time<Required>*</Required>
              </Label>
              <input
                type="time"
                className="form-control"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                min={
                  isTodaySelected && formData.start_time
                    ? formData.start_time
                    : ""
                }
                required
              />
            </FormColumn>
            <FormColumn>
              <Label>
                Interval Minutes<Required>*</Required>
              </Label>
              <select
                className="form-select"
                name="interval_minutes"
                value={formData.interval_minutes}
                onChange={handleChange}
                required
              >
                <option value="">Select interval</option>
                {generateIntervalMinutesOptions()}
              </select>
            </FormColumn>
          </FormRow>
          <SubmitButton type="submit">Add Slot</SubmitButton>
        </FormWrapper>
      </div>
    </div>
  );
};

export default AddSlot;
