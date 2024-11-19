// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import Select from "react-select";
// import styled from "styled-components";
// import Loader from "react-js-loader";

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

// const AddSlot = () => {
//   const [formData, setFormData] = useState({
//     start_date: "",
//     end_date: "",
//     start_time: "",
//     end_time: "",
//     interval_minutes: "",
//     leave_days: [],
//     doctor_id: "",
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const doctor_id = decodedToken.doctor_id;
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           doctor_id: doctor_id,
//         }));
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       const day = parseInt(value);
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         leave_days: checked
//           ? [...prevFormData.leave_days, day]
//           : prevFormData.leave_days.filter((d) => d !== day),
//       }));
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     try {
//       const response = await BaseUrl.post("/doctorappointment/slot/", formData);
//       if (response.status === 201) {
//         setSuccessMessage(response.data.success);
//         setErrorMessage("");
//       }
//     } catch (error) {
//       setErrorMessage("Error adding slot.");
//       setSuccessMessage("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateIntervalMinutesOptions = () => {
//     const options = [];
//     for (let i = 5; i <= 60; i += 5) {
//       options.push(
//         <option key={i} value={i}>
//           {i} minutes
//         </option>
//       );
//     }
//     return options;
//   };

//   const dayOptions = [
//     { label: "Monday", value: 0 },
//     { label: "Tuesday", value: 1 },
//     { label: "Wednesday", value: 2 },
//     { label: "Thursday", value: 3 },
//     { label: "Friday", value: 4 },
//     { label: "Saturday", value: 5 },
//     { label: "Sunday", value: 6 },
//   ];
//   const handleLeaveDaysChange = (selectedOptions) => {
//     const selectedDays = selectedOptions.map((option) => option.value);
//     setFormData({ ...formData, leave_days: selectedDays });
//   };

//   return (
//     <div className="container mt-5">
//       {loading && (
//         <LoaderWrapper>
//           <LoaderImage>
//             <Loader
//               type="spinner-circle"
//               bgColor="#0091A5"
//               color="#0091A5"
//               title="Loading..."
//               size={100}
//             />
//           </LoaderImage>
//         </LoaderWrapper>
//       )}

//       {errorMessage && (
//         <div
//           className="alert alert-danger"
//           style={{ fontFamily: "sans-serif", color: "#rgb(142 0 0)" }}
//         >
//           {errorMessage}
//         </div>
//       )}
//       {successMessage && (
//         <div
//           className="alert alert-success"
//           style={{ fontFamily: "sans-serif", color: "#rgb(52 122 24)" }}
//         >
//           {successMessage}
//         </div>
//       )}
//       <form
//         className="p-4 shadow"
//         onSubmit={handleSubmit}
//         style={{
//           backgroundColor: "#FFFFFF",
//           borderRadius: "8px",
//           fontFamily: "sans-serif",
//           color: "#000000",
//         }}
//       >
//         <h2>Add Slot</h2>
//         <div className="row mb-3">
//           <div className="col-md-4">
//             <label>Start Date</label>
//             <input
//               type="date"
//               className="form-control"
//               name="start_date"
//               value={formData.start_date}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <label>End Date</label>
//             <input
//               type="date"
//               className="form-control"
//               name="end_date"
//               value={formData.end_date}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <label>Leave Days</label>
//             <Select
//               isMulti
//               closeMenuOnSelect={false}
//               hideSelectedOptions={false}
//               options={dayOptions}
//               value={dayOptions.filter((option) =>
//                 formData.leave_days.includes(option.value)
//               )}
//               onChange={handleLeaveDaysChange}
//             />
//           </div>
//         </div>
//         <div className="row mb-3">
//           <div className="col-md-4">
//             <label>Start Time</label>
//             <input
//               type="time"
//               className="form-control"
//               name="start_time"
//               value={formData.start_time}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <label>End Time</label>
//             <input
//               type="time"
//               className="form-control"
//               name="end_time"
//               value={formData.end_time}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <label>Interval Minutes</label>
//             <select
//               className="form-select"
//               name="interval_minutes"
//               value={formData.interval_minutes}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select interval</option>
//               {generateIntervalMinutesOptions()}
//             </select>
//           </div>
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Add Slot
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddSlot;







import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import styled from "styled-components";
import Loader from "react-js-loader";

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
      setErrorMessage("Error adding slot.");
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

  // Get today's date in YYYY-MM-DD format for date min attribute
  const today = new Date().toISOString().split("T")[0];
  
  // Disable past times on selected date
  const isTodaySelected = formData.start_date === today;
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
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

      {errorMessage && (
        <div
          className="alert alert-danger"
          style={{ fontFamily: "sans-serif", color: "#rgb(142 0 0)" }}
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          className="alert alert-success"
          style={{ fontFamily: "sans-serif", color: "#rgb(52 122 24)" }}
        >
          {successMessage}
        </div>
      )}
      <form
        className="p-4 shadow"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          fontFamily: "sans-serif",
          color: "#000000",
        }}
      >
        <h2>Add Slot</h2>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
          <div className="col-md-4">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date || today}
              required
            />
          </div>
          <div className="col-md-4">
            <label>Leave Days</label>
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
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Start Time</label>
            <input
              type="time"
              className="form-control"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              min={isTodaySelected ? currentTime : ""}
              required
            />
          </div>
          <div className="col-md-4">
            <label>End Time</label>
            <input
              type="time"
              className="form-control"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              min={isTodaySelected && formData.start_time ? formData.start_time : ""}
              required
            />
          </div>
          <div className="col-md-4">
            <label>Interval Minutes</label>
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
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
