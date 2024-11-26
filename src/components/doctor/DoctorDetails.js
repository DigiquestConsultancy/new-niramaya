import React, { useState, useEffect } from "react";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import { components } from "react-select";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import { Table, Button, Modal } from "react-bootstrap";

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
  const [loadingTimings, setLoadingTimings] = useState(false); // New state for loading timings

  const fetchDoctorDetails = async () => {
    setSuccessMessage("");
    setErrorMessage("");
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
      console.error(error);
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
      alert("Unable to fetch document.");
    }
  };

  const fetchQualifications = async () => {
    setSuccessMessage("");
    setErrorMessage("");
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
      setErrorMessage(
        error.response?.data?.error || "Error fetching qualifications."
      );
    }
  };

  const fetchAddressDetails = async () => {
    setLoadingAddress(true); // Start loader for fetching address
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
      console.error(error);
    } finally {
      setLoadingAddress(false); // Stop loader after fetching address
    }
  };

  const fetchOpdDetails = async () => {
    setLoadingOpd(true); // Start loader for fetching OPD details
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
      setErrorMessage("Failed to fetch OPD details.");
    } finally {
      setLoadingOpd(false); // Stop loader after fetching OPD details
    }
  };

  const fetchOpdTimings = async (opdId) => {
    setLoadingTimings(true); // Start loader for fetching timings
    setSuccessMessage("");
    setErrorMessage("");

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
      setErrorMessage("Failed to fetch OPD timings.");
    } finally {
      setLoadingTimings(false); // Stop loader after fetching timings
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
      setLoadingPersonal(false);
    }

    setTimeout(() => {
      setShowModal(false);
    }, 10000);
  };

  const updateQualifications = async (doctor_id) => {
    setSuccessMessage("");
    setErrorMessage("");
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
  };
  const handleAddressSubmit = async (e) => {
    setLoadingAddress(true);
    setSuccessMessage("");
    setErrorMessage("");
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
      setLoadingAddress(false);
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
      setLoadingOpd(false);
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
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const doctor_id = decodedToken.doctor_id;

      // if (!doctor_id || !opdId) {
      //   setErrorMessage("Doctor ID or OPD ID is missing.");
      //   setModalType("error");
      //   setShowModal(true);
      //   setLoadingTimings(false);
      //   return;
      // }

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
      setErrorMessage(error.response?.data?.error || "");
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoadingTimings(false);
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
      const response = await BaseUrl.delete(
        `/doctor/timeopd/?time_id=${timingToDelete}`
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.success);
        setModalType("success");
        setShowModal(true);
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

      {loadingPersonal && (
        <LoaderWrapper>
          <LoaderImage
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="Loading..."
          />
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
                {/* Display success message in green and error message in red */}
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

      {loadingAddress && (
        <LoaderWrapper>
          <LoaderImage
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="Loading..."
          />
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
      {loadingOpd && (
        <LoaderWrapper>
          <LoaderImage
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="Loading..."
          />
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
    <div
      style={{
        backgroundColor: "#D7EAF0", // Apply background color to entire UI
        minHeight: "200vh", // Make sure the background color covers the whole screen
        fontFamily: "sans-serif",
      }}
    >
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
