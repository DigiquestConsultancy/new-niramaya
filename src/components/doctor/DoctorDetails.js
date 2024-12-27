
import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import { components } from "react-select";
import styled from "styled-components";
import Loader from "react-js-loader";
import { FaTrash } from "react-icons/fa";
import { Table, Button, Modal } from "react-bootstrap";

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
    consultation_fee: "",
    end_day: "",
    doc_file: "",
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
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // "success" or "error"

  const updateProgress = async () => {
    setSuccessMessage("");
    setErrorMessage("");
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
      setErrorMessage("");
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
      console.error(error);
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
      console.error(error);
    }
  };

  // Loader control for address and OPD
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingOpd, setLoadingOpd] = useState(false);
  const [loadingTimings, setLoadingTimings] = useState(false); 

  const fetchDoctorDetails = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      setLoading(true);
      const mobile_number = localStorage.getItem("mobile_number");
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
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      alert("Unable to fetch document.");
    }
    finally {
      setLoading(false);
    }
  };

  const fetchQualifications = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      setLoading(true);
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
      setErrorMessage(
        error.response?.data?.error || "Error fetching qualifications."
      );
    }
    finally {
      setLoading(false);
    }
  };

  const fetchAddressDetails = async () => {
    setLoadingAddress(true); // Start loader for fetching address
    if (!isPersonalComplete) return;

    try {
      setLoading(true);
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpdDetails = async () => {
    setLoadingOpd(true); // Start loader for fetching OPD details
    try {
      setLoading(true);
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
      setErrorMessage("Failed to fetch OPD details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOpdTimings = async (opdId) => {
    setLoadingTimings(true); // Start loader for fetching timings
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);
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
      setErrorMessage("Failed to fetch OPD timings.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "address" && isPersonalComplete) {
      setActiveTab("address");
      fetchAddressDetails();
    } else if (tab === "opd" && isPersonalComplete && isAddressComplete) {
      setActiveTab("opd");
      fetchOpdDetails();
      // fetchOpdTimings();
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
          setProfilePicPreview(reader.result);
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
    setLoadingPersonal(true);
    setSuccessMessage("");
    setErrorMessage("");
    e.preventDefault();

    const errors = {};

    if (!formData.name) {
      errors.name = ["This field may not be blank."];
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = ["Name can only contain letters and spaces."];
    }

    if (!formData.specialization) {
      errors.specialization = ["This field may not be blank."];
    }

    if (!formData.registration_no) {
      errors.registration_no = ["This field may not be blank."];
    } else if (!/^[A-Za-z\d]+$/.test(formData.registration_no)) {
      errors.registration_no = [
        "Registration No must contain only letters and numbers.",
      ];
    }

    if (!formData.gender) {
      errors.gender = ["Select a valid gender."];
    }

    if (!formData.experience) {
      errors.experience = ["This field may not be blank."];
    } else if (!Number.isInteger(parseInt(formData.experience))) {
      errors.experience = ["A valid integer is required."];
    }

    if (!formData.email) {
      errors.email = ["This field may not be blank."];
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = ["Enter a valid email address."];
    }

    if (!formData.mobile_number) {
      errors.mobile_number = ["Mobile number is missing."];
    }

    if (
      formData.date_of_birth &&
      new Date(formData.date_of_birth) > new Date()
    ) {
      errors.date_of_birth = ["Date of birth cannot be in the future."];
    }

    if (!formData.qualification || formData.qualification.length === 0) {
      errors.qualification = ["Please select at least one qualification."];
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoadingPersonal(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;
      const formDataToSubmit = new FormData();

      // Append form data
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("specialization", formData.specialization);
      formDataToSubmit.append("registration_no", formData.registration_no);
      formDataToSubmit.append("gender", formData.gender);
      formDataToSubmit.append("experience", formData.experience);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("mobile_number", formData.mobile_number);
      if (formData.date_of_birth) {
        formDataToSubmit.append("date_of_birth", formData.date_of_birth);
      }

      if (formData.profile_pic) {
        formDataToSubmit.append("profile_pic", formData.profile_pic);
      }

      if (formData.doc_file) {
        formDataToSubmit.append("doc_file", formData.doc_file);
      }

      let response;
      if (isExistingUser) {
        response = await BaseUrl.put(
          `/doctor/doctordetail/?doctor_id=${doctor_id}`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await BaseUrl.post(
          `/doctor/doctordetail/`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setModalMessage(response.data.success || "");
        setModalType("success");
        setShowModal(true);

        setIsExistingUser(true);
        setIsPersonalComplete(true);
        await updateProgress();
        await updateQualifications(doctor_id);
        // setActiveTab('address');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setModalMessage(error.response.data.error);
        setModalType("error");
        setShowModal(true);
      } else {
        setModalMessage("An unexpected error occurred. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setShowModal(false);
    }, 10000);
  };

  const updateQualifications = async (doctor_id) => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      setLoading(true);
      const qualificationsToUpdate = qualifications.map((qual) => ({
        id: qual.value,
        is_selected: formData.qualification.includes(qual.value),
      }));

      const response = await BaseUrl.put(`/doctor/qualifications/`, {
        doctor_id: doctor_id,
        qualifications: qualificationsToUpdate,
      });

      if (response.status === 200) {
        setSuccessMessage("");
        setErrorMessage("");
        fetchQualifications();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error updating qualifications."
      );
      setSuccessMessage("");
    }
    finally {
      setLoading(false);
    }
  };
  const handleAddressSubmit = async (e) => {
    setLoadingAddress(true);
    setSuccessMessage("");
    setErrorMessage("");
    e.preventDefault();
    try {
      setLoading(true);
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
        setLoadingAddress(false);
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

      if (response.status === 200 || response.status === 201) {
        setModalMessage(response.data.success || "");
        setModalType("success");
        setShowModal(true);
        setIsAddressComplete(true);
        await updateProgress();
        // setActiveTab('opd');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setModalMessage(error.response.data.error);
        setModalType("error");
        setShowModal(true);
      } else {
        setModalMessage("");
        setModalType("error");
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setShowModal(false);
    }, 10000);
  };

  const [previousDocFile, setPreviousDocFile] = useState(null);

  const handleOpdSubmit = async (e) => {
    setLoadingOpd(true);
    setSuccessMessage("");
    setErrorMessage("");
    e.preventDefault();

    const errors = {};
    if (!opdData.clinic_name) errors.clinic_name = ["Clinic Name is required."];
    if (!opdData.start_day) errors.start_day = ["Start Day is required."];
    if (!opdData.end_day) errors.end_day = ["End Day is required."];
    if (!opdData.consultation_fee)
      errors.consultation_fee = ["Consultation fee is required."];

    if (Object.keys(errors).length > 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        opd: errors,
      }));
      setLoadingOpd(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("doctor_id", doctor_id);
      formDataToSubmit.append("clinic_name", opdData.clinic_name);
      formDataToSubmit.append("start_day", opdData.start_day);
      formDataToSubmit.append("end_day", opdData.end_day);
      formDataToSubmit.append("consultation_fee", opdData.consultation_fee);

      if (
        opdData.doc_file instanceof File &&
        opdData.doc_file !== previousDocFile
      ) {
        formDataToSubmit.append("doc_file", opdData.doc_file);
      }

      let response;
      if (opdId) {
        response = await BaseUrl.put(
          `/doctor/opddays/?opd_id=${opdId}`,
          formDataToSubmit,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await BaseUrl.post(`/doctor/opddays/`, formDataToSubmit, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.data.success || "");
        setModalType("success");
        setShowModal(true);

        if (!opdId) {
          setOpdId(response.data.id);
        }

        setPreviousDocFile(opdData.doc_file);
        setShowOpdTimings(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "");
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTimings = async () => {
    setLoadingTimings(true);

    const timingErrors = opdData.opd_timings.map((timing, index) => {
      const timingError = {};
      if (!timing.start_time) {
        timingError.start_time = "Start time is required.";
      }
      if (!timing.end_time) {
        timingError.end_time = "End time is required.";
      }
      if (
        timing.start_time &&
        timing.end_time &&
        timing.start_time >= timing.end_time
      ) {
        timingError.end_time = "End time must be after start time.";
      }
      return timingError;
    });

    if (timingErrors.some((error) => Object.keys(error).length > 0)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        opd_timings: timingErrors,
      }));
      setLoadingTimings(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      const promises = opdData.opd_timings.map(async (timing, index) => {
        const formData = new FormData();
        formData.append("opd_id", opdId);
        formData.append("start_time", timing.start_time);
        formData.append("end_time", timing.end_time);

        if (timing.time_id) {
          formData.append("time_id", timing.time_id);
          return BaseUrl.put(`/doctor/timeopd/?opd_id=${opdId}`, formData);
        } else {
          return BaseUrl.post(`/doctor/timeopd/`, formData);
        }
      });

      const responses = await Promise.all(promises);

      const allSuccess = responses.every((response) => {
        return response.status === 201 || response.status === 200;
      });

      if (allSuccess) {
        setSuccessMessage("Timings saved successfully.");
        setModalType("success");
        setShowModal(true);
        setIsOpdComplete(true);
        setProgress(100);

        fetchOpdTimings(opdId);
      } else {
        setModalType("error");
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };


  // //Success msg are displaying
  // //Success msg are displaying

  // const handleSaveTimings = async () => {
  //   setLoadingTimings(true);
  
  //   try {
  //     const promises = opdData.opd_timings.map((timing) => {
  //       const formData = new FormData();
  //       formData.append("opd_id", opdId);
  //       formData.append("start_time", timing.start_time);
  //       formData.append("end_time", timing.end_time);
  
  //       if (timing.time_id) {
  //         formData.append("time_id", timing.time_id);
  //         return BaseUrl.put(`/doctor/timeopd/?opd_id=${opdId}`, formData);
  //       } else {
  //         return BaseUrl.post(`/doctor/timeopd/`, formData);
  //       }
  //     });
  //     await fetchOpdTimings(opdId);
  //     const responses = await Promise.all(promises);
  
  //     responses.forEach((response) => {
  //       setSuccessMessage(response.data.success); 
  //     });
      
  //     setShowModal(true);
  //     setModalType("success");
      
  //   } catch (error) {
  //     console.error(error.response?.data?.error || "An error occurred.");
  //     setShowModal(true);
  //     setModalType("error");
  //     setErrorMessage("Failed to save OPD timings. Please try again.");
  //   } finally {
  //     setLoadingTimings(false);
  //   }
  // };  

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timingToDelete, setTimingToDelete] = useState(null);

  const handleDeleteClick = (timeId) => {
    setTimingToDelete(timeId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTiming = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);
      const response = await BaseUrl.delete(
        `/doctor/timeopd/?time_id=${timingToDelete}`
      );

      if (response.status === 200 || response.status === 204) {
        // setSuccessMessage(response.data.success);
        // setModalType("success");
        // setShowModal(true);
        await fetchOpdTimings(opdId);
      } else if (response.data.error) {
        setErrorMessage(response.data.error);
        setModalType("error");
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setTimingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTimingToDelete(null);
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

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: modalType === "success" ? "green" : "red" }}>
                  {modalMessage}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              className={`form-control ${formErrors.profile_pic ? "is-invalid" : ""}`}
              name="profile_pic"
              style={{ display: "none" }}
              onChange={handleChange}
            />
            {profilePicPreview && (
              <CircularImage src={profilePicPreview} alt="Profile Preview" />
            )}
          </div>
          {formErrors.profile_pic && (
            <p className="text-danger">{formErrors.profile_pic[0]}</p>
          )}
        </div>

        <div className="col-md-6">
          <label>Full Name</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
          />
          {formErrors.name && (
            <p className="text-danger">{formErrors.name[0]}</p>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Specialization</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className={`form-control ${formErrors.specialization ? "is-invalid" : ""}`}
            name="specialization"
            value={formData.specialization}
            required
            onChange={handleChange}
          />
          {formErrors.specialization && (
            <p className="text-danger">{formErrors.specialization[0]}</p>
          )}
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
            onChange={handleQualificationChange}
            className={formErrors.qualification ? "is-invalid" : ""}
          />
          {formErrors.qualification && (
            <p className="text-danger">{formErrors.qualification}</p>
          )}
        </div>

        <div className="col-md-4">
          <label>Experience</label>
          <span className="text-danger">*</span>
          <input
            type="number"
            className={`form-control ${formErrors.experience ? "is-invalid" : ""}`}
            name="experience"
            value={formData.experience}
            required
            onChange={handleChange}
          />
          {formErrors.experience && (
            <p className="text-danger">{formErrors.experience[0]}</p>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Registration No</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className={`form-control ${formErrors.registration_no ? "is-invalid" : ""}`}
            name="registration_no"
            value={formData.registration_no}
            required
            onChange={handleChange}
          />
          {formErrors.registration_no && (
            <p className="text-danger">{formErrors.registration_no[0]}</p>
          )}
        </div>

        <div className="col-md-4">
          <label>Gender</label>
          <span className="text-danger">*</span>
          <select
            className={`form-control ${formErrors.gender ? "is-invalid" : ""}`}
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
          {formErrors.gender && (
            <p className="text-danger">{formErrors.gender[0]}</p>
          )}
        </div>

        <div className="col-md-4">
          <label>Date of Birth</label>
          <input
            type="date"
            className={`form-control ${formErrors.date_of_birth ? "is-invalid" : ""}`}
            name="date_of_birth"
            value={formData.date_of_birth}
            max={today}
            onChange={handleChange}
          />
          {formErrors.date_of_birth && (
            <p className="text-danger">{formErrors.date_of_birth[0]}</p>
          )}
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
            className={`form-control ${formErrors.mobile_number ? "is-invalid" : ""}`}
            name="mobile_number"
            value={formData.mobile_number}
            disabled
          />
          {formErrors.mobile_number && (
            <p className="text-danger">{formErrors.mobile_number[0]}</p>
          )}
        </div>

        <div className="col-md-4">
          <label>Email</label>
          <span className="text-danger">*</span>
          <input
            type="email"
            className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-danger">{formErrors.email[0]}</p>
          )}
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
            className={`form-control ${formErrors.doc_file ? "is-invalid" : ""}`}
            name="doc_file"
            accept=".pdf"
            onChange={handleChange}
          />
          {formErrors.doc_file && (
            <p className="text-danger">{formErrors.doc_file[0]}</p>
          )}
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

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: modalType === "success" ? "green" : "red" }}>
                  {modalMessage}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      onSubmit={handleOpdSubmit}
    >
      <h2>OPD Details</h2>
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

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: modalType === "success" ? "green" : "red" }}>
                  {modalType === "success" ? successMessage : errorMessage}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              className={`form-control ${formErrors.opd?.doc_file ? "is-invalid" : ""}`}
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
          <input
            type="text"
            className={`form-control ${formErrors.opd?.clinic_name ? "is-invalid" : ""}`}
            name="clinic_name"
            value={opdData.clinic_name}
            required
            onChange={(e) => handleOpdChange("clinic_name", e)}
          />
          {formErrors.opd?.clinic_name && (
            <div className="invalid-feedback">
              {formErrors.opd.clinic_name[0]}
            </div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Start Day</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className={`form-control ${formErrors.opd?.start_day ? "is-invalid" : ""}`}
            name="start_day"
            value={opdData.start_day}
            required
            onChange={(e) => handleOpdChange("start_day", e)}
            placeholder="e.g., Monday"
          />
          {formErrors.opd?.start_day && (
            <div className="invalid-feedback">
              {formErrors.opd.start_day[0]}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label>Last Day</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className={`form-control ${formErrors.opd?.end_day ? "is-invalid" : ""}`}
            name="end_day"
            value={opdData.end_day}
            required
            onChange={(e) => handleOpdChange("end_day", e)}
            placeholder="e.g., Friday"
          />
          {formErrors.opd?.end_day && (
            <div className="invalid-feedback">{formErrors.opd.end_day[0]}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Consultation Fee</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className={`form-control ${formErrors.opd?.consultation_fee ? "is-invalid" : ""}`}
            name="consultation_fee"
            value={opdData.consultation_fee}
            required
            onChange={(e) => handleOpdChange("consultation_fee", e)}
          />
          {formErrors.opd?.consultation_fee && (
            <div className="invalid-feedback">
              {formErrors.opd.consultation_fee[0]}
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        Save OPD Details
      </button>

      {showOpdTimings && (
        <div className="row mb-3 mt-4">
          <div className="col-12">
            <h5>OPD Timings</h5>
            {showModal && (
              <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {modalType === "success" ? "Success" : "Error"}
                      </h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setShowModal(false)}
                      >
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p
                        style={{
                          color: modalType === "success" ? "green" : "red",
                        }}
                      >
                        {modalType === "success"
                          ? successMessage
                          : errorMessage}
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>
                  Start Time <span className="text-danger">*</span>
                </th>
                <th>
                  End Time <span className="text-danger">*</span>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {opdData.opd_timings.map((timing, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="time"
                      className="form-control"
                      value={timing.start_time || ""}
                      required
                      onChange={(e) =>
                        handleOpdTimingChange(
                          index,
                          "start_time",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-control"
                      value={timing.end_time || ""}
                      required
                      onChange={(e) =>
                        handleOpdTimingChange(index, "end_time", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteClick(timing.time_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

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

      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this OPD timing?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTiming}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );

  return (
    <div
      style={{
        backgroundColor: "#D7EAF0", 
        minHeight: "200vh", 
        fontFamily: "sans-serif",
      }}
    >
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
      <div
        className="container mt-5"
        style={{ backgroundColor: "#D7EAF0", fontFamily: "sans-serif" }}
      >
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
    </div>
  );
};

export default DoctorDetails;












// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import Select from "react-select";
// import { components } from "react-select";
// import styled from "styled-components";
// import { FaTrash } from "react-icons/fa";
// import { Table, Button, Modal, Row, Col } from "react-bootstrap";
// import Loader from "react-js-loader";
// import SelectCountryList from "react-select-country-list"; // Ensure correct import

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

// const TabWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 30px;
//   border-bottom: 2px solid #ddd;
// `;

// const Tab = styled.div`
//   flex: 1;
//   text-align: center;
//   padding: 10px 0;
//   cursor: pointer;
//   font-weight: bold;
//   border-bottom: ${({ active }) => (active ? "4px solid #007bff" : "none")};
//   color: ${({ active, isCompleted }) =>
//     isCompleted ? "green" : active ? "#007bff" : "#555"};
//   &:hover {
//     color: #007bff;
//   }
// `;

// const UploadButton = styled.div`
//   width: 100px;
//   height: 100px;
//   border: 2px dashed #007bff;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   margin-right: 20px;
//   font-size: 24px;
//   color: #007bff;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #e6f2ff;
//   }
// `;

// const UploadLabel = styled.label`
//   font-size: 16px;
//   font-weight: bold;
//   margin-left: 10px;
// `;

// const CustomOption = (props) => {
//   const { innerRef, innerProps, data, isSelected } = props;

//   return (
//     <components.Option {...props} innerRef={innerRef} innerProps={innerProps}>
//       <input
//         type="checkbox"
//         checked={isSelected}
//         readOnly
//         style={{ marginRight: 10 }}
//       />
//       {data.label}
//     </components.Option>
//   );
// };

// const ProgressBar = ({ progress }) => (
//   <div
//     style={{
//       width: "100%",
//       backgroundColor: "#ddd",
//       height: "25px",
//       borderRadius: "10px",
//       margin: "20px 0",
//     }}
//   >
//     <div
//       style={{
//         width: `${progress}%`,
//         backgroundColor: "#387F39",
//         height: "100%",
//         borderRadius: "10px",
//         textAlign: "center",
//         color: "white",
//         transition: "width 0.5s ease-in-out",
//       }}
//     >
//       {progress}% completed
//     </div>
//   </div>
// );

// const CircularImage = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   object-fit: cover;
//   margin-left: 20px;
// `;

// const DoctorDetails = () => {
//   const [formData, setFormData] = useState({
//     profile_pic: "",
//     name: "",
//     gender: "",
//     date_of_birth: "",
//     address: "",
//     registration_no: "",
//     specialization: "",
//     qualification: [],
//     experience: "",
//     doc_file: "",
//     mobile_number: "",
//     email: "",
//     languages_spoken: "",
//     is_update: false,
//   });

//   const [addressData, setAddressData] = useState({
//     country: "",
//     state: "",
//     city: "",
//     street_address: "",
//     pin_code: "",
//     landmark: "",
//   });

//   const [opdData, setOpdData] = useState({
//     clinic_name: "",
//     start_day: "",
//     consultation_fee: "",
//     countrySpecificFees: [],
//     end_day: "",
//     doc_file: "",
//     opd_timings: [{ start_time: "", end_time: "" }],
//   });

//   const [kycData, setKycData] = useState({
//     vendor_id: "",
//     status: "ACTIVE",
//     name: "",
//     email: "",
//     phone: "",

//     bank: {
//       account_number: "",
//       account_holder: "",
//       ifsc: "",
//     },
//     kyc_details: {
//       account_type: "",
//       business_type: "",
//       uidai: "",
//       gst: "",
//       cin: "",
//       pan: "",
//       passport_number: "",
//     },
//   });

//   const [activeTab, setActiveTab] = useState("personal");
//   const [progress, setProgress] = useState(0);
//   const [addressId, setAddressId] = useState(null);
//   const [opdId, setOpdId] = useState(null);
//   const [isExistingUser, setIsExistingUser] = useState(false);
//   const [qualifications, setQualifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const today = new Date().toISOString().split("T")[0];
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isPersonalComplete, setIsPersonalComplete] = useState(false);
//   const [isAddressComplete, setIsAddressComplete] = useState(false);
//   const [isOpdComplete, setIsOpdComplete] = useState(false);
//   const [showOpdTimings, setShowOpdTimings] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [profilePicPreview, setProfilePicPreview] = useState("");
//   const [clinicPicPreview, setClinicPicPreview] = useState("");
//   const [formErrors, setFormErrors] = useState({});
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState("");
//   const [isKycComplete, setIsKycComplete] = useState(false);
//   const [loadingKyc, setLoadingKyc] = useState(false);
//   const [doctorId, setDoctorId] = useState(null);
//   const [kycDetails, setKycDetails] = useState(null);
//   const [error, setError] = useState(null);
//   const [countrySpecificFees, setCountrySpecificFees] = useState([
//     { country: "", currency: "", amount: "" }, // Default row
//   ]);

//   const [selectedCountry, setSelectedCountry] = useState(null);

//   const handleCountryChange = (value) => {
//     setSelectedCountry(value);
//   };

//   const updateProgress = async () => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const response = await BaseUrl.get(
//         `/doctor/doctorsummary/?doctor_id=${doctor_id}`
//       );
//       const doctorSummary = response.data;

//       if (doctorSummary) {
//         setIsPersonalComplete(doctorSummary.personal_details);
//         setIsAddressComplete(doctorSummary.address);
//         setIsOpdComplete(doctorSummary.opd_days);
//         setIsKycComplete(doctorSummary.kyc);

//         let calculatedProgress = 0;
//         if (doctorSummary.personal_details) calculatedProgress += 25;
//         if (doctorSummary.address) calculatedProgress += 25;
//         if (doctorSummary.opd_days) calculatedProgress += 25;
//         if (doctorSummary.kyc) calculatedProgress += 25;
//         setProgress(calculatedProgress);
//       }
//     } catch (error) {
//       setErrorMessage("");
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       await storeMobileNumberInLocalStorage();
//       await fetchDoctorDetails();
//       await fetchQualifications();
//       await updateProgress();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const storeMobileNumberInLocalStorage = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const decodedToken = jwtDecode(token);
//       const mobile_number = decodedToken.mobile_number;
//       localStorage.setItem("mobile_number", mobile_number);

//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         mobile_number: mobile_number,
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const [loadingAddress, setLoadingAddress] = useState(false);
//   const [loadingOpd, setLoadingOpd] = useState(false);
//   const [loadingTimings, setLoadingTimings] = useState(false);

//   const fetchDoctorDetails = async () => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const mobile_number = localStorage.getItem("mobile_number");
//       if (!mobile_number)
//         throw new Error("Mobile number not found in local storage");

//       const response = await BaseUrl.get(
//         `/doctor/doctordetail/?mobile_number=${mobile_number}`
//       );
//       const doctorDetails = response.data[0];

//       if (doctorDetails) {
//         setIsExistingUser(true);
//         setFormData({
//           ...doctorDetails,
//           qualification: doctorDetails.qualification || [],
//           profile_pic: "",
//           doc_file: "",
//         });

//         const profilePicUrl = doctorDetails.profile_pic
//           ? `${BaseUrl.defaults.baseURL}${doctorDetails.profile_pic}`
//           : "";
//         setProfilePicPreview(profilePicUrl);

//         setIsPersonalComplete(doctorDetails.is_update);
//         await updateProgress();
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDocument = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("No token found. Please login again.");
//         return;
//       }
//       const decodedToken = jwtDecode(token);
//       const doctorId = decodedToken.doctor_id;
//       if (!doctorId) {
//         alert("Doctor ID not found.");
//         return;
//       }
//       const response = await BaseUrl.get(
//         `/doctor/viewdoc/?doctor_id=${doctorId}`,
//         {
//           responseType: "blob",
//         }
//       );
//       const fileUrl = window.URL.createObjectURL(
//         new Blob([response.data], { type: "application/pdf" })
//       );
//       window.open(fileUrl, "_blank");
//     } catch (error) {
//       alert("Unable to fetch document.");
//     }
//   };

//   const fetchQualifications = async () => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Token not found in local storage");

//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;
//       if (!doctor_id) throw new Error("Doctor ID not found in decoded token");

//       const response = await BaseUrl.get(
//         `/doctor/qualifications/?doctor_id=${doctor_id}`
//       );
//       const fetchedQualifications = response.data.map((qual) => ({
//         value: qual.id,
//         label: qual.qualification,
//         is_selected: !!qual.is_selected,
//       }));

//       setQualifications(fetchedQualifications);

//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         qualification: fetchedQualifications
//           .filter((qual) => qual.is_selected)
//           .map((qual) => qual.value),
//       }));
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "Error fetching qualifications."
//       );
//     }
//   };

//   const fetchAddressDetails = async () => {
//     setLoading(true);
//     if (!isPersonalComplete) return;

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const response = await BaseUrl.get(
//         `/doctor/doctoraddres/?doctor_id=${doctor_id}`
//       );
//       const addressDetails = response.data[0];

//       if (addressDetails) {
//         setAddressId(addressDetails.id);
//         setAddressData(addressDetails);
//         setIsAddressComplete(addressDetails.is_update);
//         await updateProgress();
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOpdDetails = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const opdResponse = await BaseUrl.get(
//         `/doctor/opddays/?doctor_id=${doctor_id}`
//       );
//       const opdDetails = opdResponse.data;

//       if (opdDetails.length > 0) {
//         setOpdData({
//           ...opdData,
//           clinic_name: opdDetails[0].clinic_name,
//           start_day: opdDetails[0].start_day,
//           end_day: opdDetails[0].end_day,
//           consultation_fee: opdDetails[0].consultation_fee,
//           doc_file: opdDetails[0].doc_file,
//           countrySpecificFees: [],
//         });
//         setClinicPicPreview(
//           `${BaseUrl.defaults.baseURL}${opdDetails[0].doc_file}`
//         );
//         const opdId = opdDetails[0].id;
//         setOpdId(opdId);

//         // Fetch OPD timings immediately after fetching OPD details
//         await fetchOpdTimings(opdId);
//       }
//       const feeResponse = await BaseUrl.get(
//         `/doctor/fee/?doctor_id=${doctor_id}`
//       );
//       const feeData = feeResponse.data;
//       setOpdData((prevData) => ({
//         ...prevData,
//         countrySpecificFees: Array.isArray(feeData) ? feeData : [],
//       }));
//     } catch (error) {
//       setErrorMessage("Failed to fetch OPD details or consultation fees.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOpdTimings = async (opdId) => {
//     setLoadingTimings(true);
//     setSuccessMessage("");
//     setErrorMessage("");

//     try {
//       const response = await BaseUrl.get(`/doctor/timeopd/?opd_id=${opdId}`);
//       const timings = response.data.map((timing) => ({
//         start_time: timing.start_time,
//         end_time: timing.end_time,
//         time_id: timing.id,
//       }));

//       setOpdData((prevOpdData) => ({
//         ...prevOpdData,
//         opd_timings: timings,
//       }));
//       setShowOpdTimings(true); // Ensure OPD timings are displayed immediately
//     } catch (error) {
//       setErrorMessage();
//     } finally {
//       setLoadingTimings(false);
//     }
//   };

//   const handleTabClick = (tab) => {
//     if (tab === "address" && isPersonalComplete) {
//       setActiveTab("address");
//       fetchAddressDetails();
//     } else if (tab === "opd" && isPersonalComplete && isAddressComplete) {
//       setActiveTab("opd");
//       fetchOpdDetails(); // This will automatically fetch timings as well
//     } else if (tab === "personal") {
//       setActiveTab("personal");
//       fetchDoctorDetails();
//       fetchQualifications();
//     } else if (
//       tab === "kyc" &&
//       isPersonalComplete &&
//       isAddressComplete &&
//       isOpdComplete
//     ) {
//       setActiveTab("kyc");
//       fetchKycDetails();
//     }
//   };

//   const calculateProgress = () => {
//     let currentProgress = 0;
//     if (isPersonalComplete) currentProgress += 25;
//     if (isAddressComplete) currentProgress += 25;
//     if (isOpdComplete) currentProgress += 25;
//     if (isKycComplete) currentProgress += 25;
//     setProgress(currentProgress);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       const file = files[0];
//       if (name === "profile_pic" && file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setProfilePicPreview(reader.result);
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             profile_pic: file,
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else if (name === "doc_file" && file.type === "application/pdf") {
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           doc_file: file,
//         }));
//       } else {
//         alert("Please upload a valid PDF document.");
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleQualificationChange = (selectedOptions) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       qualification: selectedOptions.map((option) => option.value),
//     }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setAddressData((prevAddressData) => ({
//       ...prevAddressData,
//       [name]: value,
//     }));
//   };

//   const handleOpdChange = (field, event) => {
//     if (field === "doc_file") {
//       const file = event.target.files[0];
//       if (file) {
//         setOpdData((prevOpdData) => ({
//           ...prevOpdData,
//           doc_file: file,
//         }));
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setClinicPicPreview(reader.result);
//         };
//         reader.readAsDataURL(file);
//       }
//     } else {
//       setOpdData((prevOpdData) => ({
//         ...prevOpdData,
//         [field]: event.target.value,
//       }));
//     }
//   };

//   const handleCountryFeeChange = (index, field, value) => {
//     const updatedFees = [...opdData.countrySpecificFees];
//     updatedFees[index][field] = value;
//     setOpdData({ ...opdData, countrySpecificFees: updatedFees });
//   };

//   const handleAddCountryFee = () => {
//     setOpdData({
//       ...opdData,
//       countrySpecificFees: [
//         ...opdData.countrySpecificFees,
//         { country: "", currency: "", amount: "" },
//       ],
//     });
//   };

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     e.preventDefault();

//     const errors = {};

//     if (!formData.name) {
//       errors.name = ["This field may not be blank."];
//     } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
//       errors.name = ["Name can only contain letters and spaces."];
//     }

//     if (!formData.specialization) {
//       errors.specialization = ["This field may not be blank."];
//     }

//     if (!formData.registration_no) {
//       errors.registration_no = ["This field may not be blank."];
//     } else if (!/^[A-Za-z\d]+$/.test(formData.registration_no)) {
//       errors.registration_no = [
//         "Registration No must contain only letters and numbers.",
//       ];
//     }

//     if (!formData.gender) {
//       errors.gender = ["Select a valid gender."];
//     }

//     if (!formData.experience) {
//       errors.experience = ["This field may not be blank."];
//     } else if (!Number.isInteger(parseInt(formData.experience))) {
//       errors.experience = ["A valid integer is required."];
//     }

//     if (!formData.email) {
//       errors.email = ["This field may not be blank."];
//     } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
//       errors.email = ["Enter a valid email address."];
//     }

//     if (!formData.mobile_number) {
//       errors.mobile_number = ["Mobile number is missing."];
//     }

//     if (
//       formData.date_of_birth &&
//       new Date(formData.date_of_birth) > new Date()
//     ) {
//       errors.date_of_birth = ["Date of birth cannot be in the future."];
//     }

//     if (!formData.qualification || formData.qualification.length === 0) {
//       errors.qualification = ["Please select at least one qualification."];
//     }

//     setFormErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;
//       const formDataToSubmit = new FormData();

//       formDataToSubmit.append("name", formData.name);
//       formDataToSubmit.append("specialization", formData.specialization);
//       formDataToSubmit.append("registration_no", formData.registration_no);
//       formDataToSubmit.append("gender", formData.gender);
//       formDataToSubmit.append("experience", formData.experience);
//       formDataToSubmit.append("email", formData.email);
//       formDataToSubmit.append("mobile_number", formData.mobile_number);
//       if (formData.date_of_birth) {
//         formDataToSubmit.append("date_of_birth", formData.date_of_birth);
//       }

//       if (formData.profile_pic) {
//         formDataToSubmit.append("profile_pic", formData.profile_pic);
//       }

//       if (formData.doc_file) {
//         formDataToSubmit.append("doc_file", formData.doc_file);
//       }

//       let response;
//       if (isExistingUser) {
//         response = await BaseUrl.put(
//           `/doctor/doctordetail/?doctor_id=${doctor_id}`,
//           formDataToSubmit,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       } else {
//         response = await BaseUrl.post(
//           `/doctor/doctordetail/`,
//           formDataToSubmit,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       }

//       if (response.status === 200 || response.status === 201) {
//         setModalMessage(response.data.success || "");
//         setModalType("success");
//         setShowModal(true);

//         setIsExistingUser(true);
//         setIsPersonalComplete(true);
//         await updateProgress();
//         await updateQualifications(doctor_id);
//         // setActiveTab('address');
//       }
//     } catch (error) {
//       if (error.response?.data?.error) {
//         setModalMessage(error.response.data.error);
//         setModalType("error");
//         setShowModal(true);
//       } else {
//         setModalMessage("An unexpected error occurred. Please try again.");
//         setModalType("error");
//         setShowModal(true);
//       }
//     }

//     setTimeout(() => {
//       setShowModal(false);
//     }, 10000);
//     setLoading(false);
//   };

//   const updateQualifications = async (doctor_id) => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const qualificationsToUpdate = qualifications.map((qual) => ({
//         id: qual.value,
//         is_selected: formData.qualification.includes(qual.value),
//       }));

//       const response = await BaseUrl.put(`/doctor/qualifications/`, {
//         doctor_id: doctor_id,
//         qualifications: qualificationsToUpdate,
//       });

//       if (response.status === 200) {
//         setSuccessMessage("");
//         setErrorMessage("");
//         fetchQualifications();
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "Error updating qualifications."
//       );
//       setSuccessMessage("");
//     }
//   };

//   const handleAddressSubmit = async (e) => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       let response;
//       const errors = {};

//       if (!addressData.country) errors.country = ["Country is required."];
//       if (!addressData.state) errors.state = ["State is required."];
//       if (!addressData.city) errors.city = ["City is required."];
//       if (!addressData.street_address)
//         errors.street_address = ["Street Address is required."];
//       if (!addressData.pin_code) errors.pin_code = ["Pin Code is required."];

//       if (Object.keys(errors).length > 0) {
//         setFormErrors(errors);
//         setLoadingAddress(false);
//         return;
//       }

//       if (addressId) {
//         response = await BaseUrl.put(
//           `/doctor/doctoraddres/?doctor_id=${doctor_id}&address_id=${addressId}`,
//           {
//             ...addressData,
//             mobile_number: localStorage.getItem("mobile_number"),
//             doctor_id,
//             address_id: addressId,
//           }
//         );
//       } else {
//         response = await BaseUrl.post(`/doctor/doctoraddres/`, {
//           ...addressData,
//           doctor_id,
//           mobile_number: localStorage.getItem("mobile_number"),
//         });
//         setAddressId(response.data.id);
//       }

//       if (response.status === 200 || response.status === 201) {
//         setModalMessage(response.data.success || "");
//         setModalType("success");
//         setShowModal(true);
//         setIsAddressComplete(true);
//         await updateProgress();
//         // setActiveTab('opd');
//       }
//     } catch (error) {
//       if (error.response?.data?.error) {
//         setModalMessage(error.response.data.error);
//         setModalType("error");
//         setShowModal(true);
//       } else {
//         setModalMessage("");
//         setModalType("error");
//         setShowModal(true);
//       }
//     } finally {
//       setLoading(false);
//     }

//     setTimeout(() => {
//       setShowModal(false);
//     }, 10000);
//   };

//   const [previousDocFile, setPreviousDocFile] = useState(null);

//   const handleOpdSubmit = async (e) => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     e.preventDefault();

//     const errors = {};
//     if (!opdData.clinic_name) errors.clinic_name = ["Clinic Name is required."];
//     if (!opdData.start_day) errors.start_day = ["Start Day is required."];
//     if (!opdData.end_day) errors.end_day = ["End Day is required."];
//     if (Object.keys(errors).length > 0) {
//       setFormErrors((prevErrors) => ({
//         ...prevErrors,
//         opd: errors,
//       }));
//       setLoadingOpd(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const formDataToSubmit = new FormData();
//       formDataToSubmit.append("doctor_id", doctor_id);
//       formDataToSubmit.append("clinic_name", opdData.clinic_name);
//       formDataToSubmit.append("start_day", opdData.start_day);
//       formDataToSubmit.append("end_day", opdData.end_day);

//       if (
//         opdData.doc_file instanceof File &&
//         opdData.doc_file !== previousDocFile
//       ) {
//         formDataToSubmit.append("doc_file", opdData.doc_file);
//       }

//       let response;
//       if (opdId) {
//         response = await BaseUrl.put(
//           `/doctor/opddays/?opd_id=${opdId}`,
//           formDataToSubmit,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       } else {
//         response = await BaseUrl.post(`/doctor/opddays/`, formDataToSubmit, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       if (response.status === 200 || response.status === 201) {
//         setSuccessMessage(response.data.success || "");
//         setModalType("success");
//         setShowModal(true);
//         fetchOpdDetails();
//         if (!opdId) {
//           setOpdId(response.data.id);
//         }

//         setPreviousDocFile(opdData.doc_file);
//         setShowOpdTimings(true);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || "");
//       setModalType("error");
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveCountry = async (index) => {
//     const fee = opdData.countrySpecificFees[index];
//     try {
//       await BaseUrl.post("/doctor/fee/", {
//         doctor_id: doctorId,
//         country: fee.country,
//         consultation_fee: fee.consultation_fee,
//         currency: fee.currency,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDeleteCountryFee = async (index) => {
//     try {
//       const response = await BaseUrl.delete("/doctor/fee/", {
//         params: {
//           doctor_id: doctorId,
//         },
//       });
//       if (response.status === 204) {
//         await fetchOpdDetails();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSaveTimings = async () => {
//     const timingErrors = opdData.opd_timings.map((timing, index) => {
//       const timingError = {};
//       if (!timing.start_time) {
//         timingError.start_time = "Start time is required.";
//       }
//       if (!timing.end_time) {
//         timingError.end_time = "End time is required.";
//       }
//       if (
//         timing.start_time &&
//         timing.end_time &&
//         timing.start_time >= timing.end_time
//       ) {
//         timingError.end_time = "End time must be after start time.";
//       }
//       return timingError;
//     });

//     if (timingErrors.some((error) => Object.keys(error).length > 0)) {
//       setFormErrors((prevErrors) => ({
//         ...prevErrors,
//         opd_timings: timingErrors,
//       }));
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const promises = opdData.opd_timings.map(async (timing) => {
//         const formData = new FormData();
//         formData.append("opd_id", opdId); // Ensure opdId is included
//         formData.append("start_time", timing.start_time);
//         formData.append("end_time", timing.end_time);

//         if (timing.time_id) {
//           formData.append("time_id", timing.time_id);
//           return BaseUrl.put(
//             `/doctor/timeopd/?time_id=${timing.time_id}`,
//             formData
//           );
//         } else {
//           return BaseUrl.post(`/doctor/timeopd/`, formData);
//         }
//       });

//       const responses = await Promise.all(promises);

//       const allSuccess = responses.every((response) => {
//         return response.status === 201 || response.status === 200;
//       });

//       if (allSuccess) {
//         setSuccessMessage("Timings saved successfully.");
//         setModalType("success");
//         setShowModal(true);
//         setIsOpdComplete(true);
//         setProgress(75);

//         fetchOpdTimings(opdId);
//       } else {
//         setModalType("error");
//         setShowModal(true);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || "");
//       setModalType("error");
//       setShowModal(true);
//       await updateProgress();
//     }
//   };

//   const handleOpdTimingChange = (index, field, value) => {
//     const updatedTimings = opdData.opd_timings.map((timing, i) =>
//       i === index ? { ...timing, [field]: value } : timing
//     );
//     setOpdData((prevOpdData) => ({
//       ...prevOpdData,
//       opd_timings: updatedTimings,
//     }));
//   };

//   const handleAddTiming = () => {
//     setOpdData((prevOpdData) => ({
//       ...prevOpdData,
//       opd_timings: [
//         ...(prevOpdData.opd_timings || []),
//         { start_time: "", end_time: "" },
//       ],
//     }));
//   };

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timingToDelete, setTimingToDelete] = useState(null);

//   const handleDeleteClick = (timeId) => {
//     setTimingToDelete(timeId);
//     setShowDeleteModal(true);
//   };

//   const confirmDeleteTiming = async () => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");

//     try {
//       const response = await BaseUrl.delete(`/doctor/timeopd/?time_id=${timingToDelete}`);

//       if (response.status === 200 || response.status === 204) {
//         // setSuccessMessage(response.data.success);
//         // setModalType("success");
//         // setShowModal(true);
//         await fetchOpdTimings(opdId);

//         setOpdData((prevOpdData) => ({
//           ...prevOpdData,
//           opd_timings: prevOpdData.opd_timings.filter(
//             (timing) => timing.time_id !== timingToDelete
//           ),
//         }));

//         if (opdData.opd_timings.length === 1) {
//           setOpdData((prevOpdData) => ({
//             ...prevOpdData,
//             opd_timings: [],
//           }));
//         }
//       } else if (response.data.error) {
//         // setErrorMessage(response.data.error);
//         // setModalType("error");
//         setShowModal(true);
//       }
//     } catch (error) {
//       // setErrorMessage(error.response?.data?.error);
//       // setModalType("error");
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//       setShowDeleteModal(false);
//       setTimingToDelete(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setTimingToDelete(null);
//   };

//   const renderForm = () => {
//     switch (activeTab) {
//       case "personal":
//         return renderPersonalDetails();
//       case "address":
//         return renderAddressDetails();
//       case "opd":
//         return renderOpdDetails();
//       case "kyc":
//         return renderKycDetails();
//       default:
//         return null;
//     }
//   };

//   const handleKycChange = (field, value) => {
//     if (field.includes(".")) {
//       const fields = field.split(".");
//       setKycData((prevData) => ({
//         ...prevData,
//         [fields[0]]: {
//           ...prevData[fields[0]],
//           [fields[1]]: value,
//         },
//       }));
//     } else {
//       setKycData((prevData) => ({
//         ...prevData,
//         [field]: value,
//       }));
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       setDoctorId(decodedToken.doctor_id);
//     }
//   }, []);

//   const [kycStatus, setKycStatus] = useState("");

//   const fetchKycDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await BaseUrl.get(
//         `/payment/vendor/?vendor_id=${doctorId}`
//       );

//       if (response.status === 200) {
//         const { vendor_details } = response.data;

//         setKycData({
//           name: vendor_details.name || "",
//           email: vendor_details.email || "",
//           phone: vendor_details.phone || "",
//           bank: {
//             account_number: vendor_details.bank_account_number || "",
//             account_holder: vendor_details.bank_account_holder || "",
//             ifsc: vendor_details.bank_ifsc || "",
//           },
//           kyc_details: {
//             business_type: vendor_details.business_type || "",
//             gst:
//               vendor_details.related_docs.find(
//                 (doc) => doc.doc_name === "GSTIN"
//               )?.doc_value || "",
//             pan:
//               vendor_details.related_docs.find((doc) => doc.doc_name === "PAN")
//                 ?.doc_value || "",
//           },
//         });

//         setKycStatus(vendor_details.status);
//         setKycDetails(vendor_details);
//         setModalMessage(response.data.status);
//         setModalType("success");
//         return vendor_details;
//         setIsKycComplete(true);
//         setProgress(100);
//       } else {
//         setModalMessage("Unexpected response from the server.");
//         setModalType("error");
//         return null;
//       }
//     } catch (error) {
//       await updateProgress();
//       let errorMessage = "Failed to fetch KYC details.";

//       if (error.response && error.response.data) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Network error. Please try again later.";
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       setError(errorMessage);
//       setModalMessage(errorMessage);
//       setModalType("error");
//       return null; // Return null if there's an error
//     } finally {
//       setLoading(false);
//       // setShowModal(true);
//     }
//   };

//   const handleSaveKyc = async () => {
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctorId = decodedToken.doctor_id;

//       // Fetch KYC data for the doctor
//       const vendorDetails = await fetchKycDetails(); // Call fetchKycDetails here

//       if (vendorDetails) {
//         // If KYC details exist, perform PATCH request to update KYC
//         const patchPayload = {
//           name: kycData.name,
//           email: kycData.email,
//           phone: kycData.phone,
//           verify_account: true,
//           bank: {
//             account_number: kycData.bank.account_number,
//             account_holder: kycData.bank.account_holder,
//             ifsc: kycData.bank.ifsc,
//           },
//           kyc_details: {
//             business_type: kycData.kyc_details.business_type,
//             gst: kycData.kyc_details.gst,
//             pan: kycData.kyc_details.pan,
//           },
//         };

//         const patchResponse = await BaseUrl.patch(
//           `/payment/vendor/?vendor_id=${doctorId}`,
//           patchPayload,
//           { headers: { "Content-Type": "application/json" } }
//         );

//         if (patchResponse.status === 200 || patchResponse.status === 204) {
//           // setSuccessMessage("KYC details updated successfully!");
//           setShowModal(true);
//           setModalType("success");
//           setModalMessage(patchResponse.data.success);
//         } else {
//           setErrorMessage("Failed to update KYC details.");
//           setShowModal(true);
//           setModalType("error");
//           setModalMessage("Failed to update KYC details.");
//         }
//       } else {
//         // If no KYC data exists, perform POST request to save new data
//         const postPayload = {
//           vendor_id: doctorId,
//           status: "ACTIVE",
//           name: kycData.name,
//           email: kycData.email,
//           phone: kycData.phone,
//           verify_account: true,
//           dashboard_access: true,
//           schedule_option: 2,
//           bank: {
//             account_number: kycData.bank.account_number,
//             account_holder: kycData.bank.account_holder,
//             ifsc: kycData.bank.ifsc,
//           },
//           kyc_details: {
//             business_type: kycData.kyc_details.business_type,
//             gst: kycData.kyc_details.gst,
//             pan: kycData.kyc_details.pan,
//           },
//         };

//         const postResponse = await BaseUrl.post(
//           "/payment/vendor/",
//           postPayload,
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );

//         if (postResponse.status === 201) {
//           setShowModal(true);
//           setModalType("success");
//           setProgress(100);
//           setModalMessage(postResponse.data.success);
//         } else {
//           setErrorMessage("Unexpected response from the server.");
//           setShowModal(true);
//           setModalType("error");
//           setModalMessage("Something went wrong while saving KYC details.");
//         }
//       }
//     } catch (error) {
//       let errorMessage = "Failed to process KYC details.";

//       if (error.response && error.response.data) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Network error. Please try again later.";
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       setErrorMessage(errorMessage);
//       setShowModal(true);
//       setModalType("error");
//       setModalMessage(errorMessage);
//       await updateProgress();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPersonalDetails = () => (
//     <form
//       className="user-profile-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       encType="multipart/form-data"
//     >
//       <h2>Personal Details</h2>

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

//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 {/* Display success message in green and error message in red */}
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <UploadButton
//               onClick={() => document.getElementById("profileUpload").click()}
//             >
//               <span>+</span>
//             </UploadButton>
//             <input
//               id="profileUpload"
//               type="file"
//               className={`form-control ${formErrors.profile_pic ? "is-invalid" : ""}`}
//               name="profile_pic"
//               style={{ display: "none" }}
//               onChange={handleChange}
//             />
//             {profilePicPreview && (
//               <CircularImage src={profilePicPreview} alt="Profile Preview" />
//             )}
//           </div>
//           {formErrors.profile_pic && (
//             <p className="text-danger">{formErrors.profile_pic[0]}</p>
//           )}
//         </div>

//         <div className="col-md-6">
//           <label>Full Name</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
//             name="name"
//             value={formData.name}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.name && (
//             <p className="text-danger">{formErrors.name[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Specialization</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.specialization ? "is-invalid" : ""}`}
//             name="specialization"
//             value={formData.specialization}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.specialization && (
//             <p className="text-danger">{formErrors.specialization[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Qualification</label>
//           <span className="text-danger">*</span>
//           <Select
//             isMulti
//             closeMenuOnSelect={false}
//             hideSelectedOptions={false}
//             components={{ Option: CustomOption }}
//             options={qualifications}
//             value={qualifications.filter((option) =>
//               formData.qualification.includes(option.value)
//             )}
//             onChange={handleQualificationChange}
//             className={formErrors.qualification ? "is-invalid" : ""}
//           />
//           {formErrors.qualification && (
//             <p className="text-danger">{formErrors.qualification}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Experience</label>
//           <span className="text-danger">*</span>
//           <input
//             type="number"
//             className={`form-control ${formErrors.experience ? "is-invalid" : ""}`}
//             name="experience"
//             value={formData.experience}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.experience && (
//             <p className="text-danger">{formErrors.experience[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Registration No</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.registration_no ? "is-invalid" : ""}`}
//             name="registration_no"
//             value={formData.registration_no}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.registration_no && (
//             <p className="text-danger">{formErrors.registration_no[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Gender</label>
//           <span className="text-danger">*</span>
//           <select
//             className={`form-control ${formErrors.gender ? "is-invalid" : ""}`}
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           {formErrors.gender && (
//             <p className="text-danger">{formErrors.gender[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             className={`form-control ${formErrors.date_of_birth ? "is-invalid" : ""}`}
//             name="date_of_birth"
//             value={formData.date_of_birth}
//             max={today}
//             onChange={handleChange}
//           />
//           {formErrors.date_of_birth && (
//             <p className="text-danger">{formErrors.date_of_birth[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Languages Spoken</label>
//           <input
//             type="text"
//             className="form-control"
//             name="languages_spoken"
//             value={formData.languages_spoken}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="col-md-4">
//           <label>Mobile No</label>
//           <span className="text-danger">*</span>
//           <input
//             type="number"
//             className={`form-control ${formErrors.mobile_number ? "is-invalid" : ""}`}
//             name="mobile_number"
//             value={formData.mobile_number}
//             disabled
//           />
//           {formErrors.mobile_number && (
//             <p className="text-danger">{formErrors.mobile_number[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Email</label>
//           <span className="text-danger">*</span>
//           <input
//             type="email"
//             className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
//             name="email"
//             value={formData.email}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.email && (
//             <p className="text-danger">{formErrors.email[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>
//             Upload Document{" "}
//             <small style={{ color: "red", fontSize: "12px" }}>(PDF only)</small>
//           </label>
//           <input
//             id="documentUpload"
//             type="file"
//             className={`form-control ${formErrors.doc_file ? "is-invalid" : ""}`}
//             name="doc_file"
//             accept=".pdf"
//             onChange={handleChange}
//           />
//           {formErrors.doc_file && (
//             <p className="text-danger">{formErrors.doc_file[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4 pt-4">
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={handleViewDocument}
//           >
//             View Uploaded Document
//           </button>
//         </div>
//       </div>

//       <button className="btn btn-primary" onClick={handleSubmit}>
//         Save Personal Details
//       </button>
//     </form>
//   );

//   const renderAddressDetails = () => (
//     <form
//       className="address-details-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       onSubmit={handleAddressSubmit}
//     >
//       <h2>Address Details</h2>
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
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Country</label>
//           <span className="text-danger">*</span>
//           {formErrors.country && (
//             <p className="text-danger">{formErrors.country[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="country"
//             value={addressData.country}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>

//         <div className="col-md-4">
//           <label>State</label>
//           <span className="text-danger">*</span>
//           {formErrors.state && (
//             <p className="text-danger">{formErrors.state[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="state"
//             value={addressData.state}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label>City</label>
//           <span className="text-danger">*</span>
//           {formErrors.city && (
//             <p className="text-danger">{formErrors.city[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="city"
//             value={addressData.city}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Street Address</label>
//           <span className="text-danger">*</span>
//           {formErrors.street_address && (
//             <p className="text-danger">{formErrors.street_address[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="street_address"
//             value={addressData.street_address}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label>Pin Code</label>
//           <span className="text-danger">*</span>
//           {formErrors.pin_code && (
//             <p className="text-danger">{formErrors.pin_code[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="pin_code"
//             value={addressData.pin_code}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label>Landmark</label>
//           <input
//             type="text"
//             className="form-control"
//             name="landmark"
//             value={addressData.landmark}
//             onChange={handleAddressChange}
//           />
//         </div>
//       </div>
//       <button type="submit" className="btn btn-primary">
//         Save Address
//       </button>
//     </form>
//   );

//   const renderOpdDetails = () => (
//     <form
//       className="opd-details-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       onSubmit={handleOpdSubmit}
//     >
//       <h5 className="font-weight-bold">OPD Details</h5>
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
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalType === "success" ? successMessage : errorMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <UploadButton
//               onClick={() => document.getElementById("clinicUpload").click()}
//             >
//               <span>+</span>
//             </UploadButton>
//             <input
//               id="clinicUpload"
//               type="file"
//               className={`form-control ${formErrors.opd?.doc_file ? "is-invalid" : ""}`}
//               name="doc_file"
//               style={{ display: "none" }}
//               onChange={(e) => handleOpdChange("doc_file", e)}
//             />
//             {clinicPicPreview && (
//               <CircularImage src={clinicPicPreview} alt="Clinic Preview" />
//             )}
//           </div>
//         </div>
//         <div className="col-md-6">
//           <label>Clinic Name</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.opd?.clinic_name ? "is-invalid" : ""}`}
//             name="clinic_name"
//             value={opdData.clinic_name}
//             required
//             onChange={(e) => handleOpdChange("clinic_name", e)}
//           />
//           {formErrors.opd?.clinic_name && (
//             <div className="invalid-feedback">
//               {formErrors.opd.clinic_name[0]}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <label>Start Day</label>
//           <span className="text-danger">*</span>
//           <select
//             className={`form-control ${formErrors.opd?.start_day ? "is-invalid" : ""}`}
//             name="start_day"
//             value={opdData.start_day}
//             required
//             onChange={(e) => handleOpdChange("start_day", e)}
//           >
//             <option value="">Select a day</option>
//             <option value="Monday">Monday</option>
//             <option value="Tuesday">Tuesday</option>
//             <option value="Wednesday">Wednesday</option>
//             <option value="Thursday">Thursday</option>
//             <option value="Friday">Friday</option>
//             <option value="Saturday">Saturday</option>
//             <option value="Sunday">Sunday</option>
//           </select>
//           {formErrors.opd?.start_day && (
//             <div className="invalid-feedback">
//               {formErrors.opd.start_day[0]}
//             </div>
//           )}
//         </div>

//         <div className="col-md-6">
//           <label>Last Day</label>
//           <span className="text-danger">*</span>
//           <select
//             className={`form-control ${formErrors.opd?.end_day ? "is-invalid" : ""}`}
//             name="end_day"
//             value={opdData.end_day}
//             required
//             onChange={(e) => handleOpdChange("end_day", e)}
//           >
//             <option value="">Select a day</option>
//             <option value="Monday">Monday</option>
//             <option value="Tuesday">Tuesday</option>
//             <option value="Wednesday">Wednesday</option>
//             <option value="Thursday">Thursday</option>
//             <option value="Friday">Friday</option>
//             <option value="Saturday">Saturday</option>
//             <option value="Sunday">Sunday</option>
//           </select>
//           {formErrors.opd?.end_day && (
//             <div className="invalid-feedback">{formErrors.opd.end_day[0]}</div>
//           )}
//         </div>
//       </div>

//       <button type="submit" className="btn btn-success">
//         Save OPD Details
//       </button>

//       <div className="row mb-4 mt-5">
//         <div className="col-12">
//           <h4 className="font-weight-bold">
//             Country Specific Consultation Fee
//           </h4>
//           <Table striped bordered hover responsive className="custom-table">
//             <thead className="thead-light">
//               <tr>
//                 <th>Country</th>
//                 <th>Currency</th>
//                 <th>Amount</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {opdData.countrySpecificFees.map((fee, index) => (
//                 <tr key={index}>
//                   <td md={4}>
//                     <Select
//                       options={SelectCountryList().getData()}
//                       value={SelectCountryList()
//                         .getData()
//                         .find((option) => option.value === fee.country)}
//                       onChange={(selectedOption) =>
//                         handleCountryFeeChange(
//                           index,
//                           "country",
//                           selectedOption.value
//                         )
//                       }
//                       menuPortalTarget={document.body}
//                       styles={{
//                         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                       }}
//                       placeholder="Select a country"
//                     />
//                   </td>
//                   <td md={3}>
//                     <select
//                       className="form-control"
//                       value={fee.currency || ""}
//                       onChange={(e) =>
//                         handleCountryFeeChange(
//                           index,
//                           "currency",
//                           e.target.value
//                         )
//                       }
//                       required
//                     >
//                       <option value="">Select a currency</option>
//                       <option value="INR">INR</option>
//                       <option value="USD">USD</option>
//                     </select>
//                   </td>
//                   <td md={2}>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Enter fee"
//                       value={fee.consultation_fee || ""}
//                       onChange={(e) =>
//                         handleCountryFeeChange(
//                           index,
//                           "consultation_fee",
//                           e.target.value
//                         )
//                       }
//                       required
//                     />
//                   </td>
//                   <td md={3}>
//                     <Button
//                       onClick={() => handleSaveCountry(index)} // Save the row
//                       variant="outline-primary"
//                     >
//                       Save
//                     </Button>
//                     <FaTrash
//                       className="text-danger ms-3 me-3"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => handleDeleteCountryFee(index)}
//                       title="Delete"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <div className="d-flex justify-content-end">
//             <button
//               type="button"
//               className="btn btn-outline-primary"
//               onClick={handleAddCountryFee}
//             >
//               + Add Countries
//             </button>
//           </div>
//         </div>
//       </div>

//       {showOpdTimings && (
//         <div className="row">
//           <div className="col-12">
//             <h4 className="font-weight-bold">OPD Timings</h4>
//             {showModal && (
//               <div
//                 className="modal fade show d-block"
//                 tabIndex="-1"
//                 role="dialog"
//               >
//                 <div className="modal-dialog" role="document">
//                   <div className="modal-content">
//                     <div className="modal-header">
//                       <h5 className="modal-title">
//                         {modalType === "success" ? "Success" : "Error"}
//                       </h5>
//                       <button
//                         type="button"
//                         className="close"
//                         onClick={() => setShowModal(false)}
//                       >
//                         <span>&times;</span>
//                       </button>
//                     </div>
//                     <div className="modal-body">
//                       <p
//                         style={{
//                           color: modalType === "success" ? "green" : "red",
//                         }}
//                       >
//                         {modalType === "success"
//                           ? successMessage
//                           : errorMessage}
//                       </p>
//                     </div>
//                     <div className="modal-footer">
//                       <button
//                         type="button"
//                         className="btn btn-secondary"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Table striped bordered hover responsive className="custom-table">
//             <thead>
//               <tr>
//                 <th>
//                   Start Time <span className="text-danger">*</span>
//                 </th>
//                 <th>
//                   End Time <span className="text-danger">*</span>
//                 </th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {opdData.opd_timings.length > 0 ? (
//                 opdData.opd_timings.map((timing, index) => (
//                   <tr key={index}>
//                     <td>
//                       <input
//                         type="time"
//                         className="form-control"
//                         value={timing.start_time || ""}
//                         required
//                         onChange={(e) =>
//                           handleOpdTimingChange(
//                             index,
//                             "start_time",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="time"
//                         className="form-control"
//                         value={timing.end_time || ""}
//                         required
//                         onChange={(e) =>
//                           handleOpdTimingChange(
//                             index,
//                             "end_time",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </td>
//                     <td>
//                       <FaTrash
//                         className="text-danger"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleDeleteClick(timing.time_id)}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td>
//                     <input
//                       type="time"
//                       className="form-control"
//                       value=""
//                       onChange={(e) =>
//                         handleOpdTimingChange(0, "start_time", e.target.value)
//                       }
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="time"
//                       className="form-control"
//                       value=""
//                       onChange={(e) =>
//                         handleOpdTimingChange(0, "end_time", e.target.value)
//                       }
//                     />
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           <div className="col-12 d-flex justify-content-between">
//             <button
//               type="button"
//               className="btn btn-success"
//               onClick={handleSaveTimings}
//             >
//               Save Timings
//             </button>
//             <button
//               type="button"
//               className="btn btn-outline-primary"
//               onClick={handleAddTiming}
//             >
//               + Add Timing
//             </button>
//           </div>
//         </div>
//       )}

//       <Modal show={showDeleteModal} onHide={cancelDelete} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this OPD timing?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={cancelDelete}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDeleteTiming}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </form>
//   );

//   const renderKycDetails = () => (
//     <form
//       className="user-profile-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       encType="multipart/form-data"
//     >
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

//       {/* Modal for success/error messages */}
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* KYC Form Fields */}
//       <div className="row">
//         <div className="col-md-4 form-group">
//           <label>Name</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.name}
//             onChange={(e) =>
//               handleKycChange(
//                 "name",
//                 e.target.value.replace(/[^a-zA-Z\s.]/g, "")
//               )
//             }
//           />
//         </div>
//         <div className="col-md-4 form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             value={kycData.email}
//             onChange={(e) => handleKycChange("email", e.target.value)}
//           />
//         </div>
//         <div className="col-md-4 form-group">
//           <label>Phone</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.phone}
//             onChange={(e) =>
//               handleKycChange("phone", e.target.value.replace(/[^0-9]/g, ""))
//             }
//           />
//         </div>
//       </div>

//       {/* <h5>Bank Details</h5> */}

//       <div className="row">
//         <div className="col-md-4 form-group">
//           <label>Account Number</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.bank.account_number}
//             onChange={(e) =>
//               handleKycChange(
//                 "bank.account_number",
//                 e.target.value.replace(/[^0-9]/g, "")
//               )
//             }
//           />
//         </div>
//         <div className="col-md-4 form-group">
//           <label>Account Holder</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.bank.account_holder}
//             onChange={(e) =>
//               handleKycChange(
//                 "bank.account_holder",
//                 e.target.value.replace(/[^a-zA-Z\s.]/g, "")
//               )
//             }
//           />
//         </div>

//         <div className="col-md-4 form-group">
//           <label>IFSC Code</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.bank.ifsc}
//             onChange={(e) => handleKycChange("bank.ifsc", e.target.value)}
//           />
//         </div>
//       </div>

//       {/* <h5>KYC Details</h5> */}

//       <div className="row">
//         <div className="col-md-4 form-group">
//           <label>Business Type</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.kyc_details.business_type}
//             onChange={(e) =>
//               handleKycChange(
//                 "kyc_details.business_type",
//                 e.target.value.replace(/[^a-zA-Z\s]/g, "")
//               )
//             }
//           />
//         </div>
//         {/* <div className="col-md-4 form-group">
//             <label>GSTIN</label>
//             <input
//               type="text"
//               className="form-control"
//               value={kycData.kyc_details.gst}
//               onChange={(e) =>
//                 handleKycChange("kyc_details.gst", e.target.value)
//               }
//             />
//         </div> */}
//         <div className="col-md-4 form-group">
//           <label>PAN</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.kyc_details.pan}
//             onChange={(e) => handleKycChange("kyc_details.pan", e.target.value)}
//           />
//         </div>
//       </div>

//       <Row>
//         <Col>
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={handleSaveKyc}
//             disabled={loadingKyc}
//           >
//             {loadingKyc ? "Saving..." : "Save KYC Details"}
//           </button>
//         </Col>
//         <Col>
//           <h5>
//             Status: <span className="text-danger">{kycStatus}</span>
//           </h5>
//         </Col>
//       </Row>
//     </form>
//   );

//   return (
//     <div
//       style={{
//         backgroundColor: "#D7EAF0", // Apply background color to entire UI
//         minHeight: "200vh", // Make sure the background color covers the whole screen
//         fontFamily: "sans-serif",
//       }}
//     >
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
//       <div
//         className="container mt-3"
//         style={{ backgroundColor: "#D7EAF0", fontFamily: "sans-serif" }}
//       >
//         <TabWrapper style={{ marginBottom: "0", paddingBottom: "0" }}>
//           <Tab
//             active={activeTab === "personal"}
//             isCompleted={isPersonalComplete}
//             onClick={() => handleTabClick("personal")}
//           >
//             Personal Details{" "}
//             {isPersonalComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//           <Tab
//             active={activeTab === "address"}
//             isCompleted={isAddressComplete}
//             onClick={() => handleTabClick("address")}
//           >
//             Address Details{" "}
//             {isAddressComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//           <Tab
//             active={activeTab === "opd"}
//             isCompleted={isOpdComplete}
//             onClick={() => handleTabClick("opd")}
//           >
//             OPD Details{" "}
//             {isOpdComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//           <Tab
//             active={activeTab === "kyc"}
//             isCompleted={isKycComplete}
//             onClick={() => handleTabClick("kyc")}
//           >
//             KYC Details{" "}
//             {isKycComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//         </TabWrapper>

//         <ProgressBar
//           progress={progress}
//           style={{ marginTop: "0", paddingTop: "0" }}
//         />

//         {renderForm()}
//       </div>
//     </div>
//   );
// };

// export default DoctorDetails;















// import React, { useState, useEffect } from "react";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";
// import Select from "react-select";
// import { components } from "react-select";
// import styled from "styled-components";
// import { FaTrash } from "react-icons/fa";
// import { Table, Button, Modal, Row, Col } from "react-bootstrap";
// import Loader from "react-js-loader";
// import SelectCountryList from "react-select-country-list"; // Ensure correct import

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

// const TabWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 30px;
//   border-bottom: 2px solid #ddd;
// `;

// const Tab = styled.div`
//   flex: 1;
//   text-align: center;
//   padding: 10px 0;
//   cursor: pointer;
//   font-weight: bold;
//   border-bottom: ${({ active }) => (active ? "4px solid #007bff" : "none")};
//   color: ${({ active, isCompleted }) =>
//     isCompleted ? "green" : active ? "#007bff" : "#555"};
//   &:hover {
//     color: #007bff;
//   }
// `;

// const UploadButton = styled.div`
//   width: 100px;
//   height: 100px;
//   border: 2px dashed #007bff;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   margin-right: 20px;
//   font-size: 24px;
//   color: #007bff;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #e6f2ff;
//   }
// `;

// const UploadLabel = styled.label`
//   font-size: 16px;
//   font-weight: bold;
//   margin-left: 10px;
// `;

// const CustomOption = (props) => {
//   const { innerRef, innerProps, data, isSelected } = props;

//   return (
//     <components.Option {...props} innerRef={innerRef} innerProps={innerProps}>
//       <input
//         type="checkbox"
//         checked={isSelected}
//         readOnly
//         style={{ marginRight: 10 }}
//       />
//       {data.label}
//     </components.Option>
//   );
// };

// const ProgressBar = ({ progress }) => (
//   <div
//     style={{
//       width: "100%",
//       backgroundColor: "#ddd",
//       height: "25px",
//       borderRadius: "10px",
//       margin: "20px 0",
//     }}
//   >
//     <div
//       style={{
//         width: `${progress}%`,
//         backgroundColor: "#387F39",
//         height: "100%",
//         borderRadius: "10px",
//         textAlign: "center",
//         color: "white",
//         transition: "width 0.5s ease-in-out",
//       }}
//     >
//       {progress}% completed
//     </div>
//   </div>
// );

// const CircularImage = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   object-fit: cover;
//   margin-left: 20px;
// `;

// const DoctorDetails = () => {
//   const [formData, setFormData] = useState({
//     profile_pic: "",
//     name: "",
//     gender: "",
//     date_of_birth: "",
//     address: "",
//     registration_no: "",
//     specialization: "",
//     qualification: [],
//     experience: "",
//     doc_file: "",
//     mobile_number: "",
//     email: "",
//     languages_spoken: "",
//     is_update: false,
//   });

//   const [addressData, setAddressData] = useState({
//     country: "",
//     state: "",
//     city: "",
//     street_address: "",
//     pin_code: "",
//     landmark: "",
//   });

//   const [opdData, setOpdData] = useState({
//     clinic_name: "",
//     start_day: "",
//     consultation_fee: "",
//     countrySpecificFees: [],
//     otherCountryFeeChecked: false,
//     otherCountryFeeCurrency: "",
//     otherCountryFeeAmount: "",
//     end_day: "",
//     doc_file: "",
//     opd_timings: [{ start_time: "", end_time: "" }],
//   });

//   const [kycData, setKycData] = useState({
//     vendor_id: "",
//     status: "ACTIVE",
//     name: "",
//     email: "",
//     phone: "",

//     bank: {
//       account_number: "",
//       account_holder: "",
//       ifsc: "",
//     },
//     kyc_details: {
//       account_type: "",
//       business_type: "",
//       uidai: "",
//       gst: "",
//       cin: "",
//       pan: "",
//       passport_number: "",
//     },
//   });

//   const handleOthersCheckboxChange = (e) => {
//     setOpdData({
//       ...opdData,
//       otherCountryFeeChecked: e.target.checked,
//     });
//   };

//   const handleOthersFeeChange = (field, value) => {
//     setOpdData({
//       ...opdData,
//       [field]: value,
//     });
//   };

//   const handleDefaultCountryFeeChange = (index) => {
//     setOpdData((prevData) => ({
//       ...prevData,
//       defaultCountryFeeIndex: index,
//     }));
//   };

//   const [activeTab, setActiveTab] = useState("personal");
//   const [progress, setProgress] = useState(0);
//   const [addressId, setAddressId] = useState(null);
//   const [opdId, setOpdId] = useState(null);
//   const [isExistingUser, setIsExistingUser] = useState(false);
//   const [qualifications, setQualifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const today = new Date().toISOString().split("T")[0];
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isPersonalComplete, setIsPersonalComplete] = useState(false);
//   const [isAddressComplete, setIsAddressComplete] = useState(false);
//   const [isOpdComplete, setIsOpdComplete] = useState(false);
//   const [showOpdTimings, setShowOpdTimings] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [profilePicPreview, setProfilePicPreview] = useState("");
//   const [clinicPicPreview, setClinicPicPreview] = useState("");
//   const [formErrors, setFormErrors] = useState({});
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState("");
//   const [isKycComplete, setIsKycComplete] = useState(false);
//   const [loadingKyc, setLoadingKyc] = useState(false);
//   const [doctorId, setDoctorId] = useState(null);
//   const [kycDetails, setKycDetails] = useState(null);
//   const [error, setError] = useState(null);
//   const [countryId, setCountryId] = useState(null);
//   const [countrySpecificFees, setCountrySpecificFees] = useState([
//     { country: "", currency: "", amount: "" },
//   ]);

//   const [selectedCountry, setSelectedCountry] = useState(null);

//   const handleCountryChange = (value) => {
//     setSelectedCountry(value);
//   };

//   const updateProgress = async () => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const response = await BaseUrl.get(
//         `/doctor/doctorsummary/?doctor_id=${doctor_id}`
//       );
//       const doctorSummary = response.data;

//       if (doctorSummary) {
//         setIsPersonalComplete(doctorSummary.personal_details);
//         setIsAddressComplete(doctorSummary.address);
//         setIsOpdComplete(doctorSummary.opd_days);
//         setIsKycComplete(doctorSummary.kyc);

//         let calculatedProgress = 0;
//         if (doctorSummary.personal_details) calculatedProgress += 25;
//         if (doctorSummary.address) calculatedProgress += 25;
//         if (doctorSummary.opd_days) calculatedProgress += 25;
//         if (doctorSummary.kyc) calculatedProgress += 25;
//         setProgress(calculatedProgress);
//       }
//     } catch (error) {
//       setErrorMessage("");
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       await storeMobileNumberInLocalStorage();
//       await fetchDoctorDetails();
//       await fetchQualifications();
//       await updateProgress();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const storeMobileNumberInLocalStorage = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const decodedToken = jwtDecode(token);
//       const mobile_number = decodedToken.mobile_number;
//       localStorage.setItem("mobile_number", mobile_number);

//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         mobile_number: mobile_number,
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const [loadingAddress, setLoadingAddress] = useState(false);
//   const [loadingOpd, setLoadingOpd] = useState(false);
//   const [loadingTimings, setLoadingTimings] = useState(false);

//   const fetchDoctorDetails = async () => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const mobile_number = localStorage.getItem("mobile_number");
//       if (!mobile_number)
//         throw new Error("Mobile number not found in local storage");

//       const response = await BaseUrl.get(
//         `/doctor/doctordetail/?mobile_number=${mobile_number}`
//       );
//       const doctorDetails = response.data[0];

//       if (doctorDetails) {
//         setIsExistingUser(true);
//         setFormData({
//           ...doctorDetails,
//           qualification: doctorDetails.qualification || [],
//           profile_pic: "",
//           doc_file: "",
//         });

//         const profilePicUrl = doctorDetails.profile_pic
//           ? `${BaseUrl.defaults.baseURL}${doctorDetails.profile_pic}`
//           : "";
//         setProfilePicPreview(profilePicUrl);

//         setIsPersonalComplete(doctorDetails.is_update);
//         await updateProgress();
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDocument = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("No token found. Please login again.");
//         return;
//       }
//       const decodedToken = jwtDecode(token);
//       const doctorId = decodedToken.doctor_id;
//       if (!doctorId) {
//         alert("Doctor ID not found.");
//         return;
//       }
//       const response = await BaseUrl.get(
//         `/doctor/viewdoc/?doctor_id=${doctorId}`,
//         {
//           responseType: "blob",
//         }
//       );
//       const fileUrl = window.URL.createObjectURL(
//         new Blob([response.data], { type: "application/pdf" })
//       );
//       window.open(fileUrl, "_blank");
//     } catch (error) {
//       alert("Unable to fetch document.");
//     }
//   };

//   const fetchQualifications = async () => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Token not found in local storage");

//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;
//       if (!doctor_id) throw new Error("Doctor ID not found in decoded token");

//       const response = await BaseUrl.get(
//         `/doctor/qualifications/?doctor_id=${doctor_id}`
//       );
//       const fetchedQualifications = response.data.map((qual) => ({
//         value: qual.id,
//         label: qual.qualification,
//         is_selected: !!qual.is_selected,
//       }));

//       setQualifications(fetchedQualifications);

//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         qualification: fetchedQualifications
//           .filter((qual) => qual.is_selected)
//           .map((qual) => qual.value),
//       }));
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "Error fetching qualifications."
//       );
//     }
//   };

//   const fetchAddressDetails = async () => {
//     setLoading(true);
//     if (!isPersonalComplete) return;

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const response = await BaseUrl.get(
//         `/doctor/doctoraddres/?doctor_id=${doctor_id}`
//       );
//       const addressDetails = response.data[0];

//       if (addressDetails) {
//         setAddressId(addressDetails.id);
//         setAddressData(addressDetails);
//         setIsAddressComplete(addressDetails.is_update);
//         await updateProgress();
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

  // const fetchOpdDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     const decodedToken = jwtDecode(token);
  //     const doctor_id = decodedToken.doctor_id;

  //     const opdResponse = await BaseUrl.get(
  //       `/doctor/opddays/?doctor_id=${doctor_id}`
  //     );
  //     const opdDetails = opdResponse.data;

  //     if (opdDetails.length > 0) {
  //       setOpdData({
  //         ...opdData,
  //         clinic_name: opdDetails[0].clinic_name,
  //         start_day: opdDetails[0].start_day,
  //         end_day: opdDetails[0].end_day,
  //         consultation_fee: opdDetails[0].consultation_fee,
  //         doc_file: opdDetails[0].doc_file,
  //         countrySpecificFees: [], // Clear this initially to update below
  //       });

  //       setClinicPicPreview(
  //         `${BaseUrl.defaults.baseURL}${opdDetails[0].doc_file}`
  //       );
  //       const opdId = opdDetails[0].id;
  //       setOpdId(opdId);

  //       // Fetch OPD timings immediately after fetching OPD details
  //       await fetchOpdTimings(opdId);
  //     }

  //     const feeResponse = await BaseUrl.get(
  //       `/doctor/fee/?doctor_id=${doctor_id}`
  //     );
  //     const feeData = feeResponse.data;
  //     setCountryId(feeResponse.data.id);

  //     const countrySpecificFees = Array.isArray(feeData) ? feeData : [];

  //     // Check if "Others" is present in the fee data
  //     const othersFee = countrySpecificFees.find(
  //       (fee) => fee.country === "Others"
  //     );

  //     // If "Others" exists, set its details and check the checkbox
  //     if (othersFee) {
  //       setOpdData((prevData) => ({
  //         ...prevData,
  //         otherCountryFeeChecked: true, // Checkbox should be checked
  //         otherCountryFeeCurrency: othersFee.currency,
  //         otherCountryFeeAmount: othersFee.consultation_fee,
  //         countrySpecificFees: countrySpecificFees.filter(
  //           (fee) => fee.country !== "Others"
  //         ), // Exclude "Others" from the list
  //       }));
  //     } else {
  //       setOpdData((prevData) => ({
  //         ...prevData,
  //         otherCountryFeeChecked: false, // Checkbox should be unchecked
  //         otherCountryFeeCurrency: "",
  //         otherCountryFeeAmount: "",
  //         countrySpecificFees: countrySpecificFees,
  //       }));
  //     }
  //   } catch (error) {
  //     setErrorMessage("Failed to fetch OPD details or consultation fees.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const fetchOpdTimings = async (opdId) => {
//     setLoadingTimings(true);
//     setSuccessMessage("");
//     setErrorMessage("");

//     try {
//       const response = await BaseUrl.get(`/doctor/timeopd/?opd_id=${opdId}`);
//       const timings = response.data.map((timing) => ({
//         start_time: timing.start_time,
//         end_time: timing.end_time,
//         time_id: timing.id,
//       }));

//       setOpdData((prevOpdData) => ({
//         ...prevOpdData,
//         opd_timings: timings,
//       }));
//       setShowOpdTimings(true); // Ensure OPD timings are displayed immediately
//     } catch (error) {
//       setErrorMessage();
//     } finally {
//       setLoadingTimings(false);
//     }
//   };

//   const handleTabClick = (tab) => {
//     if (tab === "address" && isPersonalComplete) {
//       setActiveTab("address");
//       fetchAddressDetails();
//     } else if (tab === "opd" && isPersonalComplete && isAddressComplete) {
//       setActiveTab("opd");
//       fetchOpdDetails(); // This will automatically fetch timings as well
//     } else if (tab === "personal") {
//       setActiveTab("personal");
//       fetchDoctorDetails();
//       fetchQualifications();
//     } else if (
//       tab === "kyc" &&
//       isPersonalComplete &&
//       isAddressComplete &&
//       isOpdComplete
//     ) {
//       setActiveTab("kyc");
//       fetchKycDetails();
//     }
//   };

//   const calculateProgress = () => {
//     let currentProgress = 0;
//     if (isPersonalComplete) currentProgress += 25;
//     if (isAddressComplete) currentProgress += 25;
//     if (isOpdComplete) currentProgress += 25;
//     if (isKycComplete) currentProgress += 25;
//     setProgress(currentProgress);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       const file = files[0];
//       if (name === "profile_pic" && file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setProfilePicPreview(reader.result);
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             profile_pic: file,
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else if (name === "doc_file" && file.type === "application/pdf") {
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           doc_file: file,
//         }));
//       } else {
//         alert("Please upload a valid PDF document.");
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleQualificationChange = (selectedOptions) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       qualification: selectedOptions.map((option) => option.value),
//     }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setAddressData((prevAddressData) => ({
//       ...prevAddressData,
//       [name]: value,
//     }));
//   };

//   const handleOpdChange = (field, event) => {
//     if (field === "doc_file") {
//       const file = event.target.files[0];
//       if (file) {
//         setOpdData((prevOpdData) => ({
//           ...prevOpdData,
//           doc_file: file,
//         }));
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setClinicPicPreview(reader.result);
//         };
//         reader.readAsDataURL(file);
//       }
//     } else {
//       setOpdData((prevOpdData) => ({
//         ...prevOpdData,
//         [field]: event.target.value,
//       }));
//     }
//   };

//   const handleCountryFeeChange = (index, field, value) => {
//     const updatedFees = [...opdData.countrySpecificFees];
//     updatedFees[index][field] = value;
//     setOpdData({ ...opdData, countrySpecificFees: updatedFees });
//   };

//   const handleAddCountryFee = () => {
//     setOpdData({
//       ...opdData,
//       countrySpecificFees: [
//         ...opdData.countrySpecificFees,
//         { country: "", currency: "", amount: "" },
//       ],
//     });
//   };

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     e.preventDefault();

//     const errors = {};

//     if (!formData.name) {
//       errors.name = ["This field may not be blank."];
//     } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
//       errors.name = ["Name can only contain letters and spaces."];
//     }

//     if (!formData.specialization) {
//       errors.specialization = ["This field may not be blank."];
//     }

//     if (!formData.registration_no) {
//       errors.registration_no = ["This field may not be blank."];
//     } else if (!/^[A-Za-z\d]+$/.test(formData.registration_no)) {
//       errors.registration_no = [
//         "Registration No must contain only letters and numbers.",
//       ];
//     }

//     if (!formData.gender) {
//       errors.gender = ["Select a valid gender."];
//     }

//     if (!formData.experience) {
//       errors.experience = ["This field may not be blank."];
//     } else if (!Number.isInteger(parseInt(formData.experience))) {
//       errors.experience = ["A valid integer is required."];
//     }

//     if (!formData.email) {
//       errors.email = ["This field may not be blank."];
//     } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
//       errors.email = ["Enter a valid email address."];
//     }

//     if (!formData.mobile_number) {
//       errors.mobile_number = ["Mobile number is missing."];
//     }

//     if (
//       formData.date_of_birth &&
//       new Date(formData.date_of_birth) > new Date()
//     ) {
//       errors.date_of_birth = ["Date of birth cannot be in the future."];
//     }

//     if (!formData.qualification || formData.qualification.length === 0) {
//       errors.qualification = ["Please select at least one qualification."];
//     }

//     setFormErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;
//       const formDataToSubmit = new FormData();

//       formDataToSubmit.append("name", formData.name);
//       formDataToSubmit.append("specialization", formData.specialization);
//       formDataToSubmit.append("registration_no", formData.registration_no);
//       formDataToSubmit.append("gender", formData.gender);
//       formDataToSubmit.append("experience", formData.experience);
//       formDataToSubmit.append("email", formData.email);
//       formDataToSubmit.append("mobile_number", formData.mobile_number);
//       if (formData.date_of_birth) {
//         formDataToSubmit.append("date_of_birth", formData.date_of_birth);
//       }

//       if (formData.profile_pic) {
//         formDataToSubmit.append("profile_pic", formData.profile_pic);
//       }

//       if (formData.doc_file) {
//         formDataToSubmit.append("doc_file", formData.doc_file);
//       }

//       let response;
//       if (isExistingUser) {
//         response = await BaseUrl.put(
//           `/doctor/doctordetail/?doctor_id=${doctor_id}`,
//           formDataToSubmit,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       } else {
//         response = await BaseUrl.post(
//           `/doctor/doctordetail/`,
//           formDataToSubmit,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       }

//       if (response.status === 200 || response.status === 201) {
//         setModalMessage(response.data.success || "");
//         setModalType("success");
//         setShowModal(true);

//         setIsExistingUser(true);
//         setIsPersonalComplete(true);
//         await updateProgress();
//         await updateQualifications(doctor_id);
//         // setActiveTab('address');
//       }
//     } catch (error) {
//       if (error.response?.data?.error) {
//         setModalMessage(error.response.data.error);
//         setModalType("error");
//         setShowModal(true);
//       } else {
//         setModalMessage("An unexpected error occurred. Please try again.");
//         setModalType("error");
//         setShowModal(true);
//       }
//     }

//     setTimeout(() => {
//       setShowModal(false);
//     }, 10000);
//     setLoading(false);
//   };

//   const updateQualifications = async (doctor_id) => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     try {
//       const qualificationsToUpdate = qualifications.map((qual) => ({
//         id: qual.value,
//         is_selected: formData.qualification.includes(qual.value),
//       }));

//       const response = await BaseUrl.put(`/doctor/qualifications/`, {
//         doctor_id: doctor_id,
//         qualifications: qualificationsToUpdate,
//       });

//       if (response.status === 200) {
//         setSuccessMessage("");
//         setErrorMessage("");
//         fetchQualifications();
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.error || "Error updating qualifications."
//       );
//       setSuccessMessage("");
//     }
//   };

//   const handleAddressSubmit = async (e) => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       let response;
//       const errors = {};

//       if (!addressData.country) errors.country = ["Country is required."];
//       if (!addressData.state) errors.state = ["State is required."];
//       if (!addressData.city) errors.city = ["City is required."];
//       if (!addressData.street_address)
//         errors.street_address = ["Street Address is required."];
//       if (!addressData.pin_code) errors.pin_code = ["Pin Code is required."];

//       if (Object.keys(errors).length > 0) {
//         setFormErrors(errors);
//         setLoadingAddress(false);
//         return;
//       }

//       if (addressId) {
//         response = await BaseUrl.put(
//           `/doctor/doctoraddres/?doctor_id=${doctor_id}&address_id=${addressId}`,
//           {
//             ...addressData,
//             mobile_number: localStorage.getItem("mobile_number"),
//             doctor_id,
//             address_id: addressId,
//           }
//         );
//       } else {
//         response = await BaseUrl.post(`/doctor/doctoraddres/`, {
//           ...addressData,
//           doctor_id,
//           mobile_number: localStorage.getItem("mobile_number"),
//         });
//         setAddressId(response.data.id);
//       }

//       if (response.status === 200 || response.status === 201) {
//         setModalMessage(response.data.success || "");
//         setModalType("success");
//         setShowModal(true);
//         setIsAddressComplete(true);
//         await updateProgress();
//         // setActiveTab('opd');
//       }
//     } catch (error) {
//       if (error.response?.data?.error) {
//         setModalMessage(error.response.data.error);
//         setModalType("error");
//         setShowModal(true);
//       } else {
//         setModalMessage("");
//         setModalType("error");
//         setShowModal(true);
//       }
//     } finally {
//       setLoading(false);
//     }

//     setTimeout(() => {
//       setShowModal(false);
//     }, 10000);
//   };

//   const [previousDocFile, setPreviousDocFile] = useState(null);

//   const handleOpdSubmit = async (e) => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");
//     e.preventDefault();

//     const errors = {};
//     if (!opdData.clinic_name) errors.clinic_name = ["Clinic Name is required."];
//     if (!opdData.start_day) errors.start_day = ["Start Day is required."];
//     if (!opdData.end_day) errors.end_day = ["End Day is required."];
//     if (Object.keys(errors).length > 0) {
//       setFormErrors((prevErrors) => ({
//         ...prevErrors,
//         opd: errors,
//       }));
//       setLoadingOpd(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const formDataToSubmit = new FormData();
//       formDataToSubmit.append("doctor_id", doctor_id);
//       formDataToSubmit.append("clinic_name", opdData.clinic_name);
//       formDataToSubmit.append("start_day", opdData.start_day);
//       formDataToSubmit.append("end_day", opdData.end_day);

//       if (
//         opdData.doc_file instanceof File &&
//         opdData.doc_file !== previousDocFile
//       ) {
//         formDataToSubmit.append("doc_file", opdData.doc_file);
//       }

//       let response;
//       if (opdId) {
//         response = await BaseUrl.put(
//           `/doctor/opddays/?opd_id=${opdId}`,
//           formDataToSubmit,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       } else {
//         response = await BaseUrl.post(`/doctor/opddays/`, formDataToSubmit, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       if (response.status === 200 || response.status === 201) {
//         setSuccessMessage(response.data.success || "");
//         setModalType("success");
//         setShowModal(true);
//         fetchOpdDetails();
//         if (!opdId) {
//           setOpdId(response.data.id);
//         }

//         setPreviousDocFile(opdData.doc_file);
//         setShowOpdTimings(true);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || "");
//       setModalType("error");
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSaveCountry = async (index) => {
//   //   const fee = opdData.countrySpecificFees[index];
//   //   try {
//   //     await BaseUrl.post("/doctor/fee/", {
//   //       doctor_id: doctorId,
//   //       country: fee.country,
//   //       consultation_fee: fee.consultation_fee,
//   //       currency: fee.currency,
//   //     });
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   const handleSaveCountry = async (index) => {
//     const fee = opdData.countrySpecificFees[index];
//     const isExisting = fee.id;
  
//     try {
//       if (isExisting) {
//         // Update existing fee
//         await BaseUrl.put(`/doctor/fee/`, {
//           doctor_id: doctorId,
//           id: fee.id,
//           country: fee.country,
//           consultation_fee: fee.consultation_fee,
//           currency: fee.currency,
//           is_default: opdData.defaultCountryFeeIndex === index, // Set is_default based on the selected default
//         });
//       } else {
//         // Create new fee
//         await BaseUrl.post(`/doctor/fee/`, {
//           doctor_id: doctorId,
//           country: fee.country,
//           consultation_fee: fee.consultation_fee,
//           currency: fee.currency,
//           is_default: opdData.defaultCountryFeeIndex === index, // Set is_default for new entry
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   const handleSaveOthersCountry = async () => {
//     const { otherCountryFeeCurrency, otherCountryFeeAmount } = opdData;
  
//     if (otherCountryFeeCurrency && otherCountryFeeAmount) {
//       try {
//         await BaseUrl.post("/doctor/fee/", {
//           doctor_id: doctorId,
//           country: "Others",
//           consultation_fee: otherCountryFeeAmount,
//           currency: otherCountryFeeCurrency,
//           is_default: opdData.defaultCountryFeeIndex === -1, // Set is_default for "Others" country
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     } else {
//       console.error("Please fill out all fields for the Others fee.");
//     }
//   };
  

//   const handleDeleteCountryFee = async (index) => {
//     const fee = opdData.countrySpecificFees[index];
//     try {
//       const response = await BaseUrl.delete("/doctor/fee/", {
//         params: {
//           doctor_id: doctorId,
//           country_fee_id: fee.id,
//         },
//       });
//       if (response.status === 204) {
//         await fetchOpdDetails();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSaveTimings = async () => {
//     const timingErrors = opdData.opd_timings.map((timing, index) => {
//       const timingError = {};
//       if (!timing.start_time) {
//         timingError.start_time = "Start time is required.";
//       }
//       if (!timing.end_time) {
//         timingError.end_time = "End time is required.";
//       }
//       if (
//         timing.start_time &&
//         timing.end_time &&
//         timing.start_time >= timing.end_time
//       ) {
//         timingError.end_time = "End time must be after start time.";
//       }
//       return timingError;
//     });

//     if (timingErrors.some((error) => Object.keys(error).length > 0)) {
//       setFormErrors((prevErrors) => ({
//         ...prevErrors,
//         opd_timings: timingErrors,
//       }));
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctor_id = decodedToken.doctor_id;

//       const promises = opdData.opd_timings.map(async (timing) => {
//         const formData = new FormData();
//         formData.append("opd_id", opdId); // Ensure opdId is included
//         formData.append("start_time", timing.start_time);
//         formData.append("end_time", timing.end_time);

//         if (timing.time_id) {
//           formData.append("time_id", timing.time_id);
//           return BaseUrl.put(
//             `/doctor/timeopd/?time_id=${timing.time_id}`,
//             formData
//           );
//         } else {
//           return BaseUrl.post(`/doctor/timeopd/`, formData);
//         }
//       });

//       const responses = await Promise.all(promises);

//       const allSuccess = responses.every((response) => {
//         return response.status === 201 || response.status === 200;
//       });

//       if (allSuccess) {
//         setSuccessMessage("Timings saved successfully.");
//         setModalType("success");
//         setShowModal(true);
//         setIsOpdComplete(true);
//         setProgress(75);

//         fetchOpdTimings(opdId);
//       } else {
//         setModalType("error");
//         setShowModal(true);
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.error || "");
//       setModalType("error");
//       setShowModal(true);
//       await updateProgress();
//     }
//   };

//   const handleOpdTimingChange = (index, field, value) => {
//     const updatedTimings = opdData.opd_timings.map((timing, i) =>
//       i === index ? { ...timing, [field]: value } : timing
//     );
//     setOpdData((prevOpdData) => ({
//       ...prevOpdData,
//       opd_timings: updatedTimings,
//     }));
//   };

//   const handleAddTiming = () => {
//     setOpdData((prevOpdData) => ({
//       ...prevOpdData,
//       opd_timings: [
//         ...(prevOpdData.opd_timings || []),
//         { start_time: "", end_time: "" },
//       ],
//     }));
//   };

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timingToDelete, setTimingToDelete] = useState(null);

//   const handleDeleteClick = (timeId) => {
//     setTimingToDelete(timeId);
//     setShowDeleteModal(true);
//   };

//   const confirmDeleteTiming = async () => {
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");

//     try {
//       const response = await BaseUrl.delete(
//         `/doctor/timeopd/?time_id=${timingToDelete}`
//       );

//       if (response.status === 200 || response.status === 204) {
//         // setSuccessMessage(response.data.success);
//         // setModalType("success");
//         // setShowModal(true);
//         await fetchOpdTimings(opdId);

//         setOpdData((prevOpdData) => ({
//           ...prevOpdData,
//           opd_timings: prevOpdData.opd_timings.filter(
//             (timing) => timing.time_id !== timingToDelete
//           ),
//         }));

//         if (opdData.opd_timings.length === 1) {
//           setOpdData((prevOpdData) => ({
//             ...prevOpdData,
//             opd_timings: [],
//           }));
//         }
//       } else if (response.data.error) {
//         // setErrorMessage(response.data.error);
//         // setModalType("error");
//         setShowModal(true);
//       }
//     } catch (error) {
//       // setErrorMessage(error.response?.data?.error);
//       // setModalType("error");
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//       setShowDeleteModal(false);
//       setTimingToDelete(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setTimingToDelete(null);
//   };

//   const renderForm = () => {
//     switch (activeTab) {
//       case "personal":
//         return renderPersonalDetails();
//       case "address":
//         return renderAddressDetails();
//       case "opd":
//         return renderOpdDetails();
//       case "kyc":
//         return renderKycDetails();
//       default:
//         return null;
//     }
//   };

//   const handleKycChange = (field, value) => {
//     if (field.includes(".")) {
//       const fields = field.split(".");
//       setKycData((prevData) => ({
//         ...prevData,
//         [fields[0]]: {
//           ...prevData[fields[0]],
//           [fields[1]]: value,
//         },
//       }));
//     } else {
//       setKycData((prevData) => ({
//         ...prevData,
//         [field]: value,
//       }));
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       setDoctorId(decodedToken.doctor_id);
//     }
//   }, []);

//   const [kycStatus, setKycStatus] = useState("");

//   const fetchKycDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await BaseUrl.get(
//         `/payment/vendor/?vendor_id=${doctorId}`
//       );

//       if (response.status === 200) {
//         const { vendor_details } = response.data;

//         setKycData({
//           name: vendor_details.name || "",
//           email: vendor_details.email || "",
//           phone: vendor_details.phone || "",
//           bank: {
//             account_number: vendor_details.bank_account_number || "",
//             account_holder: vendor_details.bank_account_holder || "",
//             ifsc: vendor_details.bank_ifsc || "",
//           },
//           kyc_details: {
//             business_type: vendor_details.business_type || "",
//             gst:
//               vendor_details.related_docs.find(
//                 (doc) => doc.doc_name === "GSTIN"
//               )?.doc_value || "",
//             pan:
//               vendor_details.related_docs.find((doc) => doc.doc_name === "PAN")
//                 ?.doc_value || "",
//           },
//         });

//         setKycStatus(vendor_details.status);
//         setKycDetails(vendor_details);
//         setModalMessage(response.data.status);
//         setModalType("success");
//         return vendor_details;
//         setIsKycComplete(true);
//         setProgress(100);
//       } else {
//         setModalMessage("Unexpected response from the server.");
//         setModalType("error");
//         return null;
//       }
//     } catch (error) {
//       await updateProgress();
//       let errorMessage = "Failed to fetch KYC details.";

//       if (error.response && error.response.data) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Network error. Please try again later.";
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       setError(errorMessage);
//       setModalMessage(errorMessage);
//       setModalType("error");
//       return null; // Return null if there's an error
//     } finally {
//       setLoading(false);
//       // setShowModal(true);
//     }
//   };

//   const handleSaveKyc = async () => {
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);
//       const doctorId = decodedToken.doctor_id;

//       // Fetch KYC data for the doctor
//       const vendorDetails = await fetchKycDetails(); // Call fetchKycDetails here

//       if (vendorDetails) {
//         // If KYC details exist, perform PATCH request to update KYC
//         const patchPayload = {
//           name: kycData.name,
//           email: kycData.email,
//           phone: kycData.phone,
//           verify_account: true,
//           bank: {
//             account_number: kycData.bank.account_number,
//             account_holder: kycData.bank.account_holder,
//             ifsc: kycData.bank.ifsc,
//           },
//           kyc_details: {
//             business_type: kycData.kyc_details.business_type,
//             gst: kycData.kyc_details.gst,
//             pan: kycData.kyc_details.pan,
//           },
//         };

//         const patchResponse = await BaseUrl.patch(
//           `/payment/vendor/?vendor_id=${doctorId}`,
//           patchPayload,
//           { headers: { "Content-Type": "application/json" } }
//         );

//         if (patchResponse.status === 200 || patchResponse.status === 204) {
//           // setSuccessMessage("KYC details updated successfully!");
//           setShowModal(true);
//           setModalType("success");
//           setModalMessage(patchResponse.data.success);
//         } else {
//           setErrorMessage("Failed to update KYC details.");
//           setShowModal(true);
//           setModalType("error");
//           setModalMessage("Failed to update KYC details.");
//         }
//       } else {
//         // If no KYC data exists, perform POST request to save new data
//         const postPayload = {
//           vendor_id: doctorId,
//           status: "ACTIVE",
//           name: kycData.name,
//           email: kycData.email,
//           phone: kycData.phone,
//           verify_account: true,
//           dashboard_access: true,
//           schedule_option: 2,
//           bank: {
//             account_number: kycData.bank.account_number,
//             account_holder: kycData.bank.account_holder,
//             ifsc: kycData.bank.ifsc,
//           },
//           kyc_details: {
//             business_type: kycData.kyc_details.business_type,
//             gst: kycData.kyc_details.gst,
//             pan: kycData.kyc_details.pan,
//           },
//         };

//         const postResponse = await BaseUrl.post(
//           "/payment/vendor/",
//           postPayload,
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );

//         if (postResponse.status === 201) {
//           setShowModal(true);
//           setModalType("success");
//           setProgress(100);
//           setModalMessage(postResponse.data.success);
//         } else {
//           setErrorMessage("Unexpected response from the server.");
//           setShowModal(true);
//           setModalType("error");
//           setModalMessage("Something went wrong while saving KYC details.");
//         }
//       }
//     } catch (error) {
//       let errorMessage = "Failed to process KYC details.";

//       if (error.response && error.response.data) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Network error. Please try again later.";
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       setErrorMessage(errorMessage);
//       setShowModal(true);
//       setModalType("error");
//       setModalMessage(errorMessage);
//       await updateProgress();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPersonalDetails = () => (
//     <form
//       className="user-profile-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       encType="multipart/form-data"
//     >
//       <h2>Personal Details</h2>

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

//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 {/* Display success message in green and error message in red */}
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <UploadButton
//               onClick={() => document.getElementById("profileUpload").click()}
//             >
//               <span>+</span>
//             </UploadButton>
//             <input
//               id="profileUpload"
//               type="file"
//               className={`form-control ${formErrors.profile_pic ? "is-invalid" : ""}`}
//               name="profile_pic"
//               style={{ display: "none" }}
//               onChange={handleChange}
//             />
//             {profilePicPreview && (
//               <CircularImage src={profilePicPreview} alt="Profile Preview" />
//             )}
//           </div>
//           {formErrors.profile_pic && (
//             <p className="text-danger">{formErrors.profile_pic[0]}</p>
//           )}
//         </div>

//         <div className="col-md-6">
//           <label>Full Name</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
//             name="name"
//             value={formData.name}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.name && (
//             <p className="text-danger">{formErrors.name[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Specialization</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.specialization ? "is-invalid" : ""}`}
//             name="specialization"
//             value={formData.specialization}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.specialization && (
//             <p className="text-danger">{formErrors.specialization[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Qualification</label>
//           <span className="text-danger">*</span>
//           <Select
//             isMulti
//             closeMenuOnSelect={false}
//             hideSelectedOptions={false}
//             components={{ Option: CustomOption }}
//             options={qualifications}
//             value={qualifications.filter((option) =>
//               formData.qualification.includes(option.value)
//             )}
//             onChange={handleQualificationChange}
//             className={formErrors.qualification ? "is-invalid" : ""}
//           />
//           {formErrors.qualification && (
//             <p className="text-danger">{formErrors.qualification}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Experience</label>
//           <span className="text-danger">*</span>
//           <input
//             type="number"
//             className={`form-control ${formErrors.experience ? "is-invalid" : ""}`}
//             name="experience"
//             value={formData.experience}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.experience && (
//             <p className="text-danger">{formErrors.experience[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Registration No</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.registration_no ? "is-invalid" : ""}`}
//             name="registration_no"
//             value={formData.registration_no}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.registration_no && (
//             <p className="text-danger">{formErrors.registration_no[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Gender</label>
//           <span className="text-danger">*</span>
//           <select
//             className={`form-control ${formErrors.gender ? "is-invalid" : ""}`}
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           {formErrors.gender && (
//             <p className="text-danger">{formErrors.gender[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             className={`form-control ${formErrors.date_of_birth ? "is-invalid" : ""}`}
//             name="date_of_birth"
//             value={formData.date_of_birth}
//             max={today}
//             onChange={handleChange}
//           />
//           {formErrors.date_of_birth && (
//             <p className="text-danger">{formErrors.date_of_birth[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Languages Spoken</label>
//           <input
//             type="text"
//             className="form-control"
//             name="languages_spoken"
//             value={formData.languages_spoken}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="col-md-4">
//           <label>Mobile No</label>
//           <span className="text-danger">*</span>
//           <input
//             type="number"
//             className={`form-control ${formErrors.mobile_number ? "is-invalid" : ""}`}
//             name="mobile_number"
//             value={formData.mobile_number}
//             disabled
//           />
//           {formErrors.mobile_number && (
//             <p className="text-danger">{formErrors.mobile_number[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4">
//           <label>Email</label>
//           <span className="text-danger">*</span>
//           <input
//             type="email"
//             className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
//             name="email"
//             value={formData.email}
//             required
//             onChange={handleChange}
//           />
//           {formErrors.email && (
//             <p className="text-danger">{formErrors.email[0]}</p>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>
//             Upload Document{" "}
//             <small style={{ color: "red", fontSize: "12px" }}>(PDF only)</small>
//           </label>
//           <input
//             id="documentUpload"
//             type="file"
//             className={`form-control ${formErrors.doc_file ? "is-invalid" : ""}`}
//             name="doc_file"
//             accept=".pdf"
//             onChange={handleChange}
//           />
//           {formErrors.doc_file && (
//             <p className="text-danger">{formErrors.doc_file[0]}</p>
//           )}
//         </div>

//         <div className="col-md-4 pt-4">
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={handleViewDocument}
//           >
//             View Uploaded Document
//           </button>
//         </div>
//       </div>

//       <button className="btn btn-primary" onClick={handleSubmit}>
//         Save Personal Details
//       </button>
//     </form>
//   );

//   const renderAddressDetails = () => (
//     <form
//       className="address-details-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       onSubmit={handleAddressSubmit}
//     >
//       <h2>Address Details</h2>
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
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Country</label>
//           <span className="text-danger">*</span>
//           {formErrors.country && (
//             <p className="text-danger">{formErrors.country[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="country"
//             value={addressData.country}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>

//         <div className="col-md-4">
//           <label>State</label>
//           <span className="text-danger">*</span>
//           {formErrors.state && (
//             <p className="text-danger">{formErrors.state[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="state"
//             value={addressData.state}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label>City</label>
//           <span className="text-danger">*</span>
//           {formErrors.city && (
//             <p className="text-danger">{formErrors.city[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="city"
//             value={addressData.city}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Street Address</label>
//           <span className="text-danger">*</span>
//           {formErrors.street_address && (
//             <p className="text-danger">{formErrors.street_address[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="street_address"
//             value={addressData.street_address}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label>Pin Code</label>
//           <span className="text-danger">*</span>
//           {formErrors.pin_code && (
//             <p className="text-danger">{formErrors.pin_code[0]}</p>
//           )}
//           <input
//             type="text"
//             className="form-control"
//             name="pin_code"
//             value={addressData.pin_code}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label>Landmark</label>
//           <input
//             type="text"
//             className="form-control"
//             name="landmark"
//             value={addressData.landmark}
//             onChange={handleAddressChange}
//           />
//         </div>
//       </div>
//       <button type="submit" className="btn btn-primary">
//         Save Address
//       </button>
//     </form>
//   );

//   const renderOpdDetails = () => (
//     <form
//       className="opd-details-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       onSubmit={handleOpdSubmit}
//     >
//       <h4 className="font-weight-bold">OPD Details</h4>
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
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalType === "success" ? successMessage : errorMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <UploadButton
//               onClick={() => document.getElementById("clinicUpload").click()}
//             >
//               <span>+</span>
//             </UploadButton>
//             <input
//               id="clinicUpload"
//               type="file"
//               className={`form-control ${formErrors.opd?.doc_file ? "is-invalid" : ""}`}
//               name="doc_file"
//               style={{ display: "none" }}
//               onChange={(e) => handleOpdChange("doc_file", e)}
//             />
//             {clinicPicPreview && (
//               <CircularImage src={clinicPicPreview} alt="Clinic Preview" />
//             )}
//           </div>
//         </div>
//         <div className="col-md-6">
//           <label>Clinic Name</label>
//           <span className="text-danger">*</span>
//           <input
//             type="text"
//             className={`form-control ${formErrors.opd?.clinic_name ? "is-invalid" : ""}`}
//             name="clinic_name"
//             value={opdData.clinic_name}
//             required
//             onChange={(e) => handleOpdChange("clinic_name", e)}
//           />
//           {formErrors.opd?.clinic_name && (
//             <div className="invalid-feedback">
//               {formErrors.opd.clinic_name[0]}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <label>Start Day</label>
//           <span className="text-danger">*</span>
//           <select
//             className={`form-control ${formErrors.opd?.start_day ? "is-invalid" : ""}`}
//             name="start_day"
//             value={opdData.start_day}
//             required
//             onChange={(e) => handleOpdChange("start_day", e)}
//           >
//             <option value="">Select a day</option>
//             <option value="Monday">Monday</option>
//             <option value="Tuesday">Tuesday</option>
//             <option value="Wednesday">Wednesday</option>
//             <option value="Thursday">Thursday</option>
//             <option value="Friday">Friday</option>
//             <option value="Saturday">Saturday</option>
//             <option value="Sunday">Sunday</option>
//           </select>
//           {formErrors.opd?.start_day && (
//             <div className="invalid-feedback">
//               {formErrors.opd.start_day[0]}
//             </div>
//           )}
//         </div>

//         <div className="col-md-6">
//           <label>Last Day</label>
//           <span className="text-danger">*</span>
//           <select
//             className={`form-control ${formErrors.opd?.end_day ? "is-invalid" : ""}`}
//             name="end_day"
//             value={opdData.end_day}
//             required
//             onChange={(e) => handleOpdChange("end_day", e)}
//           >
//             <option value="">Select a day</option>
//             <option value="Monday">Monday</option>
//             <option value="Tuesday">Tuesday</option>
//             <option value="Wednesday">Wednesday</option>
//             <option value="Thursday">Thursday</option>
//             <option value="Friday">Friday</option>
//             <option value="Saturday">Saturday</option>
//             <option value="Sunday">Sunday</option>
//           </select>
//           {formErrors.opd?.end_day && (
//             <div className="invalid-feedback">{formErrors.opd.end_day[0]}</div>
//           )}
//         </div>
//       </div>

//       <button type="submit" className="btn btn-success">
//         Save OPD Details
//       </button>

//       <div className="row mb-4 mt-5">
//         <div className="col-12">
//           <h4 className="font-weight-bold">
//             Country Specific Consultation Fee
//           </h4>
//           <Table striped bordered hover responsive className="custom-table">
//             <thead className="thead-light">
//               <tr>
//                 <th>Country</th>
//                 <th>Currency</th>
//                 <th>Amount</th>
//                 <th>Default</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {opdData.countrySpecificFees.map((fee, index) => (
//                 <tr key={index}>
//                   <td>
//                     <Select
//                       options={SelectCountryList().getData()}
//                       value={SelectCountryList()
//                         .getData()
//                         .find((option) => option.value === fee.country)}
//                       onChange={(selectedOption) =>
//                         handleCountryFeeChange(
//                           index,
//                           "country",
//                           selectedOption.value
//                         )
//                       }
//                       menuPortalTarget={document.body}
//                       styles={{
//                         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                       }}
//                       placeholder="Select a country"
//                     />
//                   </td>
//                   <td>
//                     <select
//                       className="form-control"
//                       value={fee.currency || ""}
//                       onChange={(e) =>
//                         handleCountryFeeChange(
//                           index,
//                           "currency",
//                           e.target.value
//                         )
//                       }
//                       required
//                     >
//                       <option value="">Select a currency</option>
//                       <option value="INR">INR</option>
//                       <option value="USD">USD</option>
//                     </select>
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Enter fee"
//                       value={fee.consultation_fee || ""}
//                       onChange={(e) =>
//                         handleCountryFeeChange(
//                           index,
//                           "consultation_fee",
//                           e.target.value
//                         )
//                       }
//                       required
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="radio"
//                       name="defaultCountryFee"
//                       checked={opdData.defaultCountryFeeIndex === index}
//                       onChange={() => handleDefaultCountryFeeChange(index)}
//                     />
//                   </td>
//                   <td>
//                     <Button
//                       onClick={() => handleSaveCountry(index)}
//                       variant="outline-primary"
//                     >
//                       Save
//                     </Button>
//                     <FaTrash
//                       className="text-danger ms-3 me-3"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => handleDeleteCountryFee(index)}
//                       title="Delete"
//                     />
//                   </td>
//                 </tr>
//               ))}

//               {/* Add "Others" Row */}
//               <tr>
//                 <td>
//                   <input
//                     className="me-2 mt-2"
//                     id="others"
//                     type="checkbox"
//                     checked={opdData.otherCountryFeeChecked}
//                     onChange={handleOthersCheckboxChange}
//                   />
//                   <label htmlFor="others">For Other Countries</label>
//                 </td>
//                 <td>
//                   <select
//                     className="form-control"
//                     value={opdData.otherCountryFeeCurrency || ""}
//                     onChange={(e) =>
//                       handleOthersFeeChange(
//                         "otherCountryFeeCurrency",
//                         e.target.value
//                       )
//                     }
//                     disabled={!opdData.otherCountryFeeChecked}
//                   >
//                     <option value="">Select a currency</option>
//                     <option value="INR">INR</option>
//                     <option value="USD">USD</option>
//                   </select>
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter fee"
//                     value={opdData.otherCountryFeeAmount || ""}
//                     onChange={(e) =>
//                       handleOthersFeeChange(
//                         "otherCountryFeeAmount",
//                         e.target.value
//                       )
//                     }
//                     disabled={!opdData.otherCountryFeeChecked}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="radio"
//                     name="defaultCountryFee"
//                     checked={opdData.defaultCountryFeeIndex === -1}
//                     onChange={() => handleDefaultCountryFeeChange(-1)}
//                   />
//                 </td>
//                 <td>
//                   <Button
//                     onClick={handleSaveOthersCountry}
//                     variant="outline-primary"
//                     disabled={!opdData.otherCountryFeeChecked}
//                   >
//                     Save
//                   </Button>
//                   <FaTrash
//                     className="text-danger ms-3 me-3"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => handleDeleteCountryFee(-1)}
//                     title="Delete"
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </Table>

//           <div className="d-flex justify-content-end">
//             <button
//               type="button"
//               className="btn btn-outline-primary"
//               onClick={handleAddCountryFee}
//             >
//               + Add Countries
//             </button>
//           </div>
//         </div>
//       </div>

//       {showOpdTimings && (
//         <div className="row">
//           <div className="col-12">
//             <h4 className="font-weight-bold">OPD Timings</h4>
//             {showModal && (
//               <div
//                 className="modal fade show d-block"
//                 tabIndex="-1"
//                 role="dialog"
//               >
//                 <div className="modal-dialog" role="document">
//                   <div className="modal-content">
//                     <div className="modal-header">
//                       <h5 className="modal-title">
//                         {modalType === "success" ? "Success" : "Error"}
//                       </h5>
//                       <button
//                         type="button"
//                         className="close"
//                         onClick={() => setShowModal(false)}
//                       >
//                         <span>&times;</span>
//                       </button>
//                     </div>
//                     <div className="modal-body">
//                       <p
//                         style={{
//                           color: modalType === "success" ? "green" : "red",
//                         }}
//                       >
//                         {modalType === "success"
//                           ? successMessage
//                           : errorMessage}
//                       </p>
//                     </div>
//                     <div className="modal-footer">
//                       <button
//                         type="button"
//                         className="btn btn-secondary"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Table striped bordered hover responsive className="custom-table">
//             <thead>
//               <tr>
//                 <th>
//                   Start Time <span className="text-danger">*</span>
//                 </th>
//                 <th>
//                   End Time <span className="text-danger">*</span>
//                 </th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {opdData.opd_timings.length > 0 ? (
//                 opdData.opd_timings.map((timing, index) => (
//                   <tr key={index}>
//                     <td>
//                       <input
//                         type="time"
//                         className="form-control"
//                         value={timing.start_time || ""}
//                         required
//                         onChange={(e) =>
//                           handleOpdTimingChange(
//                             index,
//                             "start_time",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="time"
//                         className="form-control"
//                         value={timing.end_time || ""}
//                         required
//                         onChange={(e) =>
//                           handleOpdTimingChange(
//                             index,
//                             "end_time",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </td>
//                     <td>
//                       <FaTrash
//                         className="text-danger"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleDeleteClick(timing.time_id)}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td>
//                     <input
//                       type="time"
//                       className="form-control"
//                       value=""
//                       onChange={(e) =>
//                         handleOpdTimingChange(0, "start_time", e.target.value)
//                       }
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="time"
//                       className="form-control"
//                       value=""
//                       onChange={(e) =>
//                         handleOpdTimingChange(0, "end_time", e.target.value)
//                       }
//                     />
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           <div className="col-12 d-flex justify-content-between">
//             <button
//               type="button"
//               className="btn btn-success"
//               onClick={handleSaveTimings}
//             >
//               Save Timings
//             </button>
//             <button
//               type="button"
//               className="btn btn-outline-primary"
//               onClick={handleAddTiming}
//             >
//               + Add Timing
//             </button>
//           </div>
//         </div>
//       )}

//       <Modal show={showDeleteModal} onHide={cancelDelete} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this OPD timing?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={cancelDelete}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDeleteTiming}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </form>
//   );

//   const renderKycDetails = () => (
//     <form
//       className="user-profile-form p-4 rounded shadow"
//       style={{
//         backgroundColor: "#f8f9fa",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//       encType="multipart/form-data"
//     >
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

//       {/* Modal for success/error messages */}
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalType === "success" ? "Success" : "Error"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p style={{ color: modalType === "success" ? "green" : "red" }}>
//                   {modalMessage}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* KYC Form Fields */}
//       <div className="row">
//         <div className="col-md-4 form-group">
//           <label>Name</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.name}
//             onChange={(e) =>
//               handleKycChange(
//                 "name",
//                 e.target.value.replace(/[^a-zA-Z\s.]/g, "")
//               )
//             }
//           />
//         </div>
//         <div className="col-md-4 form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             value={kycData.email}
//             onChange={(e) => handleKycChange("email", e.target.value)}
//           />
//         </div>
//         <div className="col-md-4 form-group">
//           <label>Phone</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.phone}
//             onChange={(e) =>
//               handleKycChange("phone", e.target.value.replace(/[^0-9]/g, ""))
//             }
//           />
//         </div>
//       </div>

//       {/* <h5>Bank Details</h5> */}

//       <div className="row">
//         <div className="col-md-4 form-group">
//           <label>Account Number</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.bank.account_number}
//             onChange={(e) =>
//               handleKycChange(
//                 "bank.account_number",
//                 e.target.value.replace(/[^0-9]/g, "")
//               )
//             }
//           />
//         </div>
//         <div className="col-md-4 form-group">
//           <label>Account Holder</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.bank.account_holder}
//             onChange={(e) =>
//               handleKycChange(
//                 "bank.account_holder",
//                 e.target.value.replace(/[^a-zA-Z\s.]/g, "")
//               )
//             }
//           />
//         </div>

//         <div className="col-md-4 form-group">
//           <label>IFSC Code</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.bank.ifsc}
//             onChange={(e) => handleKycChange("bank.ifsc", e.target.value)}
//           />
//         </div>
//       </div>

//       {/* <h5>KYC Details</h5> */}

//       <div className="row">
//         <div className="col-md-4 form-group">
//           <label>Business Type</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.kyc_details.business_type}
//             onChange={(e) =>
//               handleKycChange(
//                 "kyc_details.business_type",
//                 e.target.value.replace(/[^a-zA-Z\s]/g, "")
//               )
//             }
//           />
//         </div>
//         {/* <div className="col-md-4 form-group">
//             <label>GSTIN</label>
//             <input
//               type="text"
//               className="form-control"
//               value={kycData.kyc_details.gst}
//               onChange={(e) =>
//                 handleKycChange("kyc_details.gst", e.target.value)
//               }
//             />
//         </div> */}
//         <div className="col-md-4 form-group">
//           <label>PAN</label>
//           <input
//             type="text"
//             className="form-control"
//             value={kycData.kyc_details.pan}
//             onChange={(e) => handleKycChange("kyc_details.pan", e.target.value)}
//           />
//         </div>
//       </div>

//       <Row>
//         <Col>
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={handleSaveKyc}
//             disabled={loadingKyc}
//           >
//             {loadingKyc ? "Saving..." : "Save KYC Details"}
//           </button>
//         </Col>
//         <Col>
//           <h5>
//             Status: <span className="text-danger">{kycStatus}</span>
//           </h5>
//         </Col>
//       </Row>
//     </form>
//   );

//   return (
//     <div
//       style={{
//         backgroundColor: "#D7EAF0", // Apply background color to entire UI
//         minHeight: "200vh", // Make sure the background color covers the whole screen
//         fontFamily: "sans-serif",
//       }}
//     >
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
//       <div
//         className="container mt-3"
//         style={{ backgroundColor: "#D7EAF0", fontFamily: "sans-serif" }}
//       >
//         <TabWrapper style={{ marginBottom: "0", paddingBottom: "0" }}>
//           <Tab
//             active={activeTab === "personal"}
//             isCompleted={isPersonalComplete}
//             onClick={() => handleTabClick("personal")}
//           >
//             Personal Details{" "}
//             {isPersonalComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//           <Tab
//             active={activeTab === "address"}
//             isCompleted={isAddressComplete}
//             onClick={() => handleTabClick("address")}
//           >
//             Address Details{" "}
//             {isAddressComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//           <Tab
//             active={activeTab === "opd"}
//             isCompleted={isOpdComplete}
//             onClick={() => handleTabClick("opd")}
//           >
//             OPD Details{" "}
//             {isOpdComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//           <Tab
//             active={activeTab === "kyc"}
//             isCompleted={isKycComplete}
//             onClick={() => handleTabClick("kyc")}
//           >
//             KYC Details{" "}
//             {isKycComplete && <span style={{ color: "green" }}></span>}
//           </Tab>
//         </TabWrapper>

//         <ProgressBar
//           progress={progress}
//           style={{ marginTop: "0", paddingTop: "0" }}
//         />

//         {renderForm()}
//       </div>
//     </div>
//   );
// };

// export default DoctorDetails;
