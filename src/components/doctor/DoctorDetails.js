import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import { components } from "react-select";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoaderImage = styled.img`
  width: 400px;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-weight: bold;
  border-bottom: ${({ active }) => (active ? "4px solid #007bff" : "none")};
  color: ${({ active, isCompleted }) =>
    isCompleted ? "green" : active ? "#007bff" : "#555"};
  &:hover {
    color: #007bff;
  }
`;

const UploadButton = styled.div`
  width: 100px;
  height: 100px;
  border: 2px dashed #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 20px;
  font-size: 24px;
  color: #007bff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e6f2ff;
  }
`;

const UploadLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const CustomOption = (props) => {
  const { innerRef, innerProps, data, isSelected } = props;

  return (
    <components.Option {...props} innerRef={innerRef} innerProps={innerProps}>
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        style={{ marginRight: 10 }}
      />
      {data.label}
    </components.Option>
  );
};

const ProgressBar = ({ progress }) => (
  <div
    style={{
      width: "100%",
      backgroundColor: "#ddd",
      height: "25px",
      borderRadius: "10px",
      margin: "20px 0",
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        backgroundColor: "#387F39",
        height: "100%",
        borderRadius: "10px",
        textAlign: "center",
        color: "white",
        transition: "width 0.5s ease-in-out",
      }}
    >
      {progress}% completed
    </div>
  </div>
);

const CircularImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 20px;
`;

const DoctorDetails = () => {
  const [formData, setFormData] = useState({
    profile_pic: "",
    name: "",
    gender: "",
    date_of_birth: "",
    address: "",
    registration_no: "",
    specialization: "",
    qualification: [],
    experience: "",
    doc_file: "",
    mobile_number: "",
    email: "",
    languages_spoken: "",
    is_update: false,
  });

  const [addressData, setAddressData] = useState({
    country: "",
    state: "",
    city: "",
    street_address: "",
    pin_code: "",
    landmark: "",
  });

  const [opdData, setOpdData] = useState({
    clinic_name: "",
    start_day: "",
    end_day: "",
    doc_file: "",
    consultation_fee: "",
    opd_timings: [{ start_time: "", end_time: "" }],
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [progress, setProgress] = useState(0);
  const [addressId, setAddressId] = useState(null);
  const [opdId, setOpdId] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPersonalComplete, setIsPersonalComplete] = useState(false);
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const [isOpdComplete, setIsOpdComplete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOpdTimings, setShowOpdTimings] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [clinicPicPreview, setClinicPicPreview] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const updateProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const response = await BaseUrl.get(
        `/doctor/doctorsummary/?doctor_id=${doctor_id}`
      );
      const doctorSummary = response.data;

      if (doctorSummary) {
        setIsPersonalComplete(doctorSummary.personal_details);
        setIsAddressComplete(doctorSummary.address);
        setIsOpdComplete(doctorSummary.opd_days);

        let calculatedProgress = 0;
        if (doctorSummary.personal_details) calculatedProgress += 50;
        if (doctorSummary.address) calculatedProgress += 25;
        if (doctorSummary.opd_days) calculatedProgress += 25;
        setProgress(calculatedProgress);
      }
    } catch (error) {
      setErrorMessage("Failed to update progress.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await storeMobileNumberInLocalStorage();
      await fetchDoctorDetails();
      await fetchQualifications();
      await updateProgress();
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const storeMobileNumberInLocalStorage = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const mobile_number = decodedToken.mobile_number;
      localStorage.setItem("mobile_number", mobile_number);

      setFormData((prevFormData) => ({
        ...prevFormData,
        mobile_number: mobile_number,
      }));
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const fetchDoctorDetails = async () => {
    try {
      const mobile_number = localStorage.getItem("mobile_number");
      if (!mobile_number)
        throw new Error("Mobile number not found in local storage");

      const response = await BaseUrl.get(
        `/doctor/doctordetail/?mobile_number=${mobile_number}`
      );
      const doctorDetails = response.data[0];

      if (doctorDetails) {
        setIsExistingUser(true);
        setFormData({
          ...doctorDetails,
          qualification: doctorDetails.qualification || [],
          profile_pic: "",
          doc_file: "",
        });

        const profilePicUrl = doctorDetails.profile_pic
          ? `${BaseUrl.defaults.baseURL}${doctorDetails.profile_pic}`
          : "";
        setProfilePicPreview(profilePicUrl);

        setIsPersonalComplete(doctorDetails.is_update);
        await updateProgress();
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  const handleViewDocument = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }
      const decodedToken = jwtDecode(token);
      const doctorId = decodedToken.doctor_id;
      if (!doctorId) {
        alert("Doctor ID not found.");
        return;
      }
      const response = await BaseUrl.get(
        `/doctor/viewdoc/?doctor_id=${doctorId}`,
        {
          responseType: "blob",
        }
      );
      const fileUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("Unable to fetch document.");
    }
  };

  const fetchQualifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found in local storage");

      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;
      if (!doctor_id) throw new Error("Doctor ID not found in decoded token");

      const response = await BaseUrl.get(
        `/doctor/qualifications/?doctor_id=${doctor_id}`
      );
      const fetchedQualifications = response.data.map((qual) => ({
        value: qual.id,
        label: qual.qualification,
        is_selected: !!qual.is_selected,
      }));

      setQualifications(fetchedQualifications);

      setFormData((prevFormData) => ({
        ...prevFormData,
        qualification: fetchedQualifications
          .filter((qual) => qual.is_selected)
          .map((qual) => qual.value),
      }));
    } catch (error) {
      console.error("Error fetching qualifications:", error);
      setErrorMessage(
        error.response?.data?.error || "Error fetching qualifications."
      );
    }
  };

  const fetchAddressDetails = async () => {
    if (!isPersonalComplete) return;

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const response = await BaseUrl.get(
        `/doctor/doctoraddres/?doctor_id=${doctor_id}`
      );
      const addressDetails = response.data[0];

      if (addressDetails) {
        setAddressId(addressDetails.id);
        setAddressData(addressDetails);
        setIsAddressComplete(addressDetails.is_update);
        await updateProgress();
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const fetchOpdDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const response = await BaseUrl.get(
        `/doctor/opddays/?doctor_id=${doctor_id}`
      );
      const opdDetails = response.data;

      if (opdDetails.length > 0) {
        setOpdData({
          clinic_name: opdDetails[0].clinic_name,
          start_day: opdDetails[0].start_day,
          end_day: opdDetails[0].end_day,
          consultation_fee: opdDetails[0].consultation_fee,
          doc_file: opdDetails[0].doc_file,
          opd_timings: [],
        });

        setClinicPicPreview(
          `${BaseUrl.defaults.baseURL}${opdDetails[0].doc_file}`
        );

        const opdIds = opdDetails.map((detail) => detail.id);
        setOpdId(opdIds[0]);
        setIsOpdComplete(true);
        calculateProgress();

        fetchOpdTimings(opdIds[0]);
        setShowOpdTimings(true);
      }
    } catch (error) {
      console.error("Error fetching OPD details:", error);
      setErrorMessage("Failed to fetch OPD details.");
    }
  };

  const fetchOpdTimings = async (opdId) => {
    try {
      const response = await BaseUrl.get(`/doctor/timeopd/?opd_id=${opdId}`);
      const timings = response.data.map((timing) => ({
        start_time: timing.start_time,
        end_time: timing.end_time,
        time_id: timing.id,
      }));

      setOpdData((prevOpdData) => ({
        ...prevOpdData,
        opd_timings: timings,
      }));
    } catch (error) {
      console.error("Error fetching OPD timings:", error);
      setErrorMessage("Failed to fetch OPD timings.");
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "address" && isPersonalComplete) {
      setActiveTab("address");
      fetchAddressDetails();
    } else if (tab === "opd" && isPersonalComplete && isAddressComplete) {
      setActiveTab("opd");
      fetchOpdDetails();
      fetchOpdTimings();
    } else if (tab === "personal") {
      setActiveTab("personal");
      fetchDoctorDetails();
      fetchQualifications();
    }
  };

  const calculateProgress = () => {
    let currentProgress = 0;
    if (isPersonalComplete) currentProgress += 50;
    if (isAddressComplete) currentProgress += 25;
    if (isOpdComplete) currentProgress += 25;
    setProgress(currentProgress);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (name === "profile_pic" && file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            profile_pic: file,
          }));
        };
        reader.readAsDataURL(file);
      } else if (name === "doc_file" && file.type === "application/pdf") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          doc_file: file,
        }));
      } else {
        alert("Please upload a valid PDF document.");
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleQualificationChange = (selectedOptions) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      qualification: selectedOptions.map((option) => option.value),
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevAddressData) => ({
      ...prevAddressData,
      [name]: value,
    }));
  };

  const handleOpdChange = (field, event) => {
    if (field === "doc_file") {
      const file = event.target.files[0];
      if (file) {
        setOpdData((prevOpdData) => ({
          ...prevOpdData,
          doc_file: file,
        }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setClinicPicPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setOpdData((prevOpdData) => ({
        ...prevOpdData,
        [field]: event.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const errors = {};
    if (!formData.name) errors.name = ["This field may not be blank."];
    if (!formData.specialization) errors.specialization = ['This field may not be blank.'];
    if (!formData.registration_no)
      errors.registration_no = ["This field may not be blank."];
    if (!formData.gender) errors.gender = ['"Select a valid gender."'];
    if (!Number.isInteger(parseInt(formData.experience)))
      errors.experience = ["A valid integer is required."];

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      console.log("Form submitted successfully", formData);
    }

    if (!token) {
      setErrorMessage("No token found, please login again.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      if (!doctor_id) {
        throw new Error("Doctor ID not found in token");
      }

      const formDataToSubmit = new FormData();

      if (formData.profile_pic) {
        formDataToSubmit.append("profile_pic", formData.profile_pic);
      }
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("gender", formData.gender);
      formDataToSubmit.append("date_of_birth", formData.date_of_birth);
      formDataToSubmit.append("registration_no", formData.registration_no);
      formDataToSubmit.append("specialization", formData.specialization);
      formDataToSubmit.append("experience", formData.experience);
      formDataToSubmit.append("mobile_number", formData.mobile_number);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("languages_spoken", formData.languages_spoken);

      if (formData.doc_file) {
        formDataToSubmit.append("doc_file", formData.doc_file);
      }

      let response;
      if (isExistingUser) {
        response = await BaseUrl.put(
          `/doctor/doctordetail/?doctor_id=${doctor_id}`,
          formDataToSubmit,
          
        );
      } else {
        response = await BaseUrl.post(
          `/doctor/doctordetail/`,
          formDataToSubmit,
          
        );
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Personal details saved successfully.");
        setIsExistingUser(true);
        setIsPersonalComplete(true);
        await updateProgress();
        await updateQualifications(doctor_id);
      }
    } catch (error) {
      console.error("Error submitting personal details:", error);
      setErrorMessage(
        error.response?.data?.error || "Error submitting personal details."
      );
    }
  };

  const updateQualifications = async (doctor_id) => {
    try {
      const qualificationsToUpdate = qualifications.map((qual) => ({
        id: qual.value,
        is_selected: formData.qualification.includes(qual.value),
      }));

      const response = await BaseUrl.put(`/doctor/qualifications/`, {
        doctor_id: doctor_id,
        qualifications: qualificationsToUpdate,
      });

      if (response.status === 200) {
        setSuccessMessage("Qualifications updated successfully");
        setErrorMessage("");
        fetchQualifications();
      }
    } catch (error) {
      console.error("Error updating qualifications:", error);
      setErrorMessage(
        error.response?.data?.error || "Error updating qualifications."
      );
      setSuccessMessage("");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      let response;
      const errors = {};
      if (!addressData.country) errors.country = ["Country is required."];
      if (!addressData.state) errors.state = ["State is required."];
      if (!addressData.city) errors.city = ["City is required."];
      if (!addressData.street_address)
        errors.street_address = ["Street Address is required."];
      if (!addressData.pin_code) errors.pin_code = ["Pin Code is required."];

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      if (addressId) {
        response = await BaseUrl.put(
          `/doctor/doctoraddres/?doctor_id=${doctor_id}&address_id=${addressId}`,
          {
            ...addressData,
            mobile_number: localStorage.getItem("mobile_number"),
            doctor_id,
            address_id: addressId,
          }
        );
      } else {
        response = await BaseUrl.post(`/doctor/doctoraddres/`, {
          ...addressData,
          doctor_id,
          mobile_number: localStorage.getItem("mobile_number"),
        });
        setAddressId(response.data.id);
      }

      setIsAddressComplete(true);
      await updateProgress();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleOpdSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("doctor_id", doctor_id);
      formDataToSubmit.append("clinic_name", opdData.clinic_name);
      formDataToSubmit.append("start_day", opdData.start_day);
      formDataToSubmit.append("end_day", opdData.end_day);
      formDataToSubmit.append("consultation_fee", opdData.consultation_fee);

      if (opdData.doc_file) {
        formDataToSubmit.append("doc_file", opdData.doc_file);
      }

      const errors = {};
      if (!opdData.clinic_name)
        errors.clinic_name = ["Clinic Name is required."];
      if (!opdData.start_day) errors.start_day = ["Start Day is required."];
      if (!opdData.end_day) errors.end_day = ["Last Day is required."];
      if (!opdData.consultation_fee)
        errors.consultation_fee = ["consultation_fee is required."];

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      let response;
      if (opdId) {
        response = await BaseUrl.put(
          `/doctor/opddays/?opd_id=${opdId}`,
          formDataToSubmit
        );
      } else {
        response = await BaseUrl.post(`/doctor/opddays/`, formDataToSubmit);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("OPD details saved successfully.");
        if (!opdId) {
          setOpdId(response.data.id);
        }
        setShowOpdTimings(true);
      } else {
        throw new Error("Failed to save OPD details.");
      }
    } catch (error) {
      console.error("Error saving OPD details:", error);
      setErrorMessage("Failed to save OPD details.");
    }
  };

  const handleSaveTimings = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      if (!doctor_id || !opdId) {
        setErrorMessage("Doctor ID or OPD ID is missing.");
        return;
      }
      const promises = opdData.opd_timings.map(async (timing, index) => {
        const formData = new FormData();
        formData.append("opd_id", opdId);
        formData.append("start_time", timing.start_time);
        formData.append("end_time", timing.end_time);

        if (timing.time_id) {
          formData.append("time_id", timing.time_id);
          return BaseUrl.put(`/doctor/timeopd/?opd_id=${opdId}`, formData, {});
        } else {
          return BaseUrl.post(`/doctor/timeopd/`, formData, {});
        }
      });
      setSuccessMessage("Timings saved successfully.");
      fetchOpdTimings();
    } catch (error) {
      console.error("Error saving timings:", error);
      setErrorMessage("Failed to save timings.");
    }
  };

  const handleOpdTimingChange = (index, field, value) => {
    const updatedTimings = opdData.opd_timings.map((timing, i) =>
      i === index ? { ...timing, [field]: value } : timing
    );
    setOpdData((prevOpdData) => ({
      ...prevOpdData,
      opd_timings: updatedTimings,
    }));
  };

  const handleAddTiming = () => {
    setOpdData((prevOpdData) => ({
      ...prevOpdData,
      opd_timings: [
        ...(prevOpdData.opd_timings || []),
        { start_time: "", end_time: "" },
      ],
    }));
  };

  const handleDeleteTiming = async (timeId) => {
    try {
      const response = await BaseUrl.delete(
        `/doctor/timeopd/?time_id=${timeId}`
      );

      if (response.status === 204) {
        setSuccessMessage("Timing deleted successfully.");
        setOpdData((prevOpdData) => ({
          ...prevOpdData,
          opd_timings: prevOpdData.opd_timings.filter(
            (timing) => timing.time_id !== timeId
          ),
        }));
      } else {
        throw new Error("Failed to delete timing.");
      }
    } catch (error) {
      console.error("Error deleting timing:", error);
      setErrorMessage("Failed to delete timing.");
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalDetails();
      case "address":
        return renderAddressDetails();
      case "opd":
        return renderOpdDetails();
      default:
        return null;
    }
  };

  const renderPersonalDetails = () => (
    <form
      className="user-profile-form p-4 rounded shadow"
      style={{
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      encType="multipart/form-data"
    >
      <h2>Personal Details</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <div style={{ display: "flex", alignItems: "center" }}>
            <UploadButton
              onClick={() => document.getElementById("profileUpload").click()}
            >
              <span>+</span>
            </UploadButton>
            <input
              id="profileUpload"
              type="file"
              className="form-control"
              name="profile_pic"
              style={{ display: "none" }}
              onChange={handleChange}
            />
            {profilePicPreview && (
              <CircularImage src={profilePicPreview} alt="Profile Preview" />
            )}
          </div>
        </div>

        <div className="col-md-6">
          <label>Full Name</label>
          <span className="text-danger">*</span>
          {formErrors.name && (
            <p className="text-danger">{formErrors.name[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Specialization</label>
          <span className="text-danger">*</span>
          {formErrors.specialization && (
            <p className="text-danger">{formErrors.specialization[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="specialization"
            value={formData.specialization}
            required
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Qualification</label>
          <span className="text-danger">*</span>
          <Select
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option: CustomOption }}
            options={qualifications}
            value={qualifications.filter((option) =>
              formData.qualification.includes(option.value)
            )}
            required
            onChange={handleQualificationChange}
          />
        </div>
        <div className="col-md-4">
          <label>Experience</label>
          <span className="text-danger">*</span>
          {formErrors.experience && (
            <p className="text-danger">{formErrors.experience[0]}</p>
          )}
          <input
            type="number"
            className="form-control"
            name="experience"
            value={formData.experience}
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Registration No</label>
          <span className="text-danger">*</span>
          {formErrors.registration_no && (
            <p className="text-danger">{formErrors.registration_no[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="registration_no"
            value={formData.registration_no}
            required
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Gender</label>
          <span className="text-danger">*</span>
          {formErrors.gender && (
            <p className="text-danger">{formErrors.gender[0]}</p>
          )}
          <select
            className="form-control"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-4">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="date_of_birth"
            value={formData.date_of_birth}
            max={today}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Languages Spoken</label>
          <input
            type="text"
            className="form-control"
            name="languages_spoken"
            value={formData.languages_spoken}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Mobile No</label>
          <span className="text-danger">*</span>
          <input
            type="number"
            className="form-control"
            name="mobile_number"
            value={formData.mobile_number}
            disabled
          />
        </div>
        <div className="col-md-4">
          <label>Email</label>
          <span className="text-danger">*</span>
          {formErrors.email && (
            <p className="text-danger">{formErrors.email[0]}</p>
          )}
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>
            Upload Document{" "}
            <small style={{ color: "red", fontSize: "12px" }}>(PDF only)</small>
          </label>
          <input
            id="documentUpload"
            type="file"
            className="form-control"
            name="doc_file"
            accept=".pdf"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 pt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleViewDocument}
          >
            View Uploaded Document
          </button>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Save Personal Details
      </button>
    </form>
  );

  const renderAddressDetails = () => (
    <form
      className="address-details-form p-4 rounded shadow mt-5"
      style={{
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      onSubmit={handleAddressSubmit}
    >
      <h2>Address Details</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Country</label>
          <span className="text-danger">*</span>
          {formErrors.country && (
            <p className="text-danger">{formErrors.country[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="country"
            value={addressData.country}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label>State</label>
          <span className="text-danger">*</span>
          {formErrors.state && (
            <p className="text-danger">{formErrors.state[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="state"
            value={addressData.state}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label>City</label>
          <span className="text-danger">*</span>
          {formErrors.city && (
            <p className="text-danger">{formErrors.city[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="city"
            value={addressData.city}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Street Address</label>
          <span className="text-danger">*</span>
          {formErrors.street_address && (
            <p className="text-danger">{formErrors.street_address[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="street_address"
            value={addressData.street_address}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label>Pin Code</label>
          <span className="text-danger">*</span>
          {formErrors.pin_code && (
            <p className="text-danger">{formErrors.pin_code[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="pin_code"
            value={addressData.pin_code}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label>Landmark</label>
          <input
            type="text"
            className="form-control"
            name="landmark"
            value={addressData.landmark}
            onChange={handleAddressChange}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Save Address
      </button>
    </form>
  );

  const renderOpdDetails = () => (
    <form
      className="opd-details-form p-4 rounded shadow mt-5"
      style={{
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>OPD Details</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <div style={{ display: "flex", alignItems: "center" }}>
            <UploadButton
              onClick={() => document.getElementById("clinicUpload").click()}
            >
              <span>+</span>
            </UploadButton>
            <input
              id="clinicUpload"
              type="file"
              className="form-control"
              name="doc_file"
              style={{ display: "none" }}
              onChange={(e) => handleOpdChange("doc_file", e)}
            />
            {clinicPicPreview && (
              <CircularImage src={clinicPicPreview} alt="Clinic Preview" />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label>Clinic Name</label>
          <span className="text-danger">*</span>
          {formErrors.clinic_name && (
            <p className="text-danger">{formErrors.clinic_name[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="clinic_name"
            value={opdData.clinic_name}
            onChange={(e) => handleOpdChange("clinic_name", e)}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Start Day</label>
          <span className="text-danger">*</span>
          {formErrors.start_day && (
            <p className="text-danger">{formErrors.start_day[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="start_day"
            value={opdData.start_day}
            onChange={(e) => handleOpdChange("start_day", e)}
            placeholder="e.g., Monday"
            required
          />
        </div>
        <div className="col-md-6">
          <label>Last Day</label>
          <span className="text-danger">*</span>
          {formErrors.end_day && (
            <p className="text-danger">{formErrors.end_day[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="end_day"
            value={opdData.end_day}
            onChange={(e) => handleOpdChange("end_day", e)}
            placeholder="e.g., Friday"
            required
          />
        </div>
        <div className="col-md-6">
          <label>Consultation Fee</label>
          <span className="text-danger">*</span>
          {formErrors.consultation_fee && (
            <p className="text-danger">{formErrors.consultation_fee[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            name="consultation_fee"
            value={opdData.consultation_fee}
            onChange={(e) => handleOpdChange("consultation_fee", e)}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary mt-3"
        onClick={handleOpdSubmit}
      >
        Save OPD Details
      </button>

      {showOpdTimings && (
        <div className="row mb-3 mt-4">
          <div className="col-12">
            <h5>OPD Timings</h5>
          </div>

          {(opdData.opd_timings || []).map((timing, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-5">
                <label>Start Time</label>
                <span className="text-danger">*</span>
                <input
                  type="time"
                  className="form-control"
                  value={timing.start_time || ""}
                  onChange={(e) =>
                    handleOpdTimingChange(index, "start_time", e.target.value)
                  }
                />
              </div>
              <div className="col-md-5">
                <label>End Time</label>
                <span className="text-danger">*</span>
                <input
                  type="time"
                  className="form-control"
                  value={timing.end_time || ""}
                  onChange={(e) =>
                    handleOpdTimingChange(index, "end_time", e.target.value)
                  }
                />
              </div>
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                <FaTrash
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteTiming(timing.time_id)}
                />
              </div>
            </div>
          ))}

          <div className="col-12 d-flex justify-content-between mt-3">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSaveTimings}
            >
              Save Timings
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddTiming}
            >
              + Add Timing
            </button>
          </div>
        </div>
      )}
    </form>
  );

  if (loading) {
    return (
      <LoaderWrapper>
        <LoaderImage
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          alt="Loading..."
        />
      </LoaderWrapper>
    );
  }

  return (
    <div className="container mt-5">
      <TabWrapper style={{ marginBottom: "0", paddingBottom: "0" }}>
        <Tab
          active={activeTab === "personal"}
          isCompleted={isPersonalComplete}
          onClick={() => handleTabClick("personal")}
        >
          Personal Details{" "}
          {isPersonalComplete && <span style={{ color: "green" }}></span>}
        </Tab>
        <Tab
          active={activeTab === "address"}
          isCompleted={isAddressComplete}
          onClick={() => handleTabClick("address")}
        >
          Address Details{" "}
          {isAddressComplete && <span style={{ color: "green" }}></span>}
        </Tab>
        <Tab
          active={activeTab === "opd"}
          isCompleted={isOpdComplete}
          onClick={() => handleTabClick("opd")}
        >
          OPD Details{" "}
          {isOpdComplete && <span style={{ color: "green" }}></span>}
        </Tab>
      </TabWrapper>

      <ProgressBar
        progress={progress}
        style={{ marginTop: "0", paddingTop: "0" }}
      />

      {renderForm()}
    </div>
  );
};

export default DoctorDetails;
