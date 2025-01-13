// import React, { useEffect, useState } from "react";
// import { FaRegSave } from "react-icons/fa";
// import { MdFileUpload } from "react-icons/md";
// import "../../css/ManageTemplates.css";
// import BaseUrl from "../../api/BaseUrl";
// import { jwtDecode } from "jwt-decode";

// function ManageTemplates() {
//   const [header, setHeaderImage] = useState(null);
//   const [footer, setFooterImage] = useState(null);
//   const [doctorId, setDoctorId] = useState(null);
//   const [templateId, setTemplateId] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setDoctorId(decoded.doctor_id);
//     }
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       const response = await BaseUrl.get(`/patient/image/`, {
//         params: { doctor: doctorId },
//       });
//       if (response.status === 200 && response.data.length > 0) {
//         const { id, header, footer } = response.data[0];
//         setTemplateId(id);
//         setHeaderImage(header);
//         setFooterImage(footer);
//       }
//     } catch (error) {
//       console.error("Failed to fetch templates:", error);
//     }
//   };
//   useEffect(() => {
//       fetchTemplates();

//   }, []);

//   const handleHeaderUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setHeaderImage(file);
//     }
//   };

//   const handleFooterUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFooterImage(file);
//     }
//   };

//   const handleSaveTemplate = async () => {
//     const formData = new FormData();

//     if (header instanceof File) {
//       formData.append("header", header);
//     }
//     if (footer instanceof File) {
//       formData.append("footer", footer);
//     }
//     formData.append("doctor", doctorId);

//     try {
//       let response;
//       if (templateId) {
//         formData.append("image_id", templateId);
//         response = await BaseUrl.put(`/patient/image/`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       } else {
//         response = await BaseUrl.post(`/patient/image/`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       }
//       if (response.status === 201 || response.status === 200) {
//         alert("Template saved successfully!");
//         await fetchTemplates();
//       } else {
//         alert("Failed to save the template. Please try again.");
//       }
//     } catch (error) {
//       alert("An error occurred while saving the template.");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#D9EAFD" }} className="pt-4">
//       <h2 className="text-center">Please upload your template</h2>
//       <p className="text-center text-danger font-weight-bold">(*Please upload Header and Footer of Height = 450px and Width = 2480px)</p>
//       <div className="manage-templates-container mt-4">
//         <div className="button-panel">
//           <label className="upload-button">
//             <MdFileUpload /> Upload Header
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleHeaderUpload}
//               hidden
//             />
//           </label>
//           <label className="upload-button">
//             <MdFileUpload /> Upload Footer
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFooterUpload}
//               hidden
//             />
//           </label>
//           <button className="save-button" onClick={handleSaveTemplate}>
//             <FaRegSave /> Save Template
//           </button>
//         </div>
//         <div className="custom-page">
//           <div className="header-section">
//             {header && (
//               <img
//                 src={
//                   typeof header === "string"
//                     ? BaseUrl.defaults.baseURL + header
//                     : URL.createObjectURL(header)
//                 }
//                 alt="Header"
//                 className="header-image"
//               />
//             )}
//           </div>
//           <div className="page-content">Your content goes here</div>
//           <div className="footer-section">
//             {footer && (
//               <img
//                 src={
//                   typeof footer === "string"
//                     ? BaseUrl.defaults.baseURL + footer
//                     : URL.createObjectURL(footer)
//                 }
//                 alt="Footer"
//                 className="footer-image"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageTemplates;












import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import "../../css/ManageTemplates.css";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";

function ManageTemplates() {
  const [header, setHeaderImage] = useState(null);
  const [footer, setFooterImage] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setDoctorId(decoded.doctor_id);
    }
  }, []);
  
  useEffect(() => {
    if (doctorId) {
      fetchTemplates();
    }
  }, [doctorId]);
  
  const fetchTemplates = async () => {
    try {
      const response = await BaseUrl.get(`/patient/image/?doctor=${doctorId}`);
      console.log("doctor id is: " + doctorId);
      if (response.status === 200 && response.data.length > 0) {
        const { id, header, footer } = response.data[0];
        setTemplateId(id);
        setHeaderImage(header);
        setFooterImage(footer);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };
  

  const handleHeaderUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(file);
    }
  };

  const handleFooterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFooterImage(file);
    }
  };

  const handleSaveTemplate = async () => {
    const formData = new FormData();

    if (header instanceof File) {
      formData.append("header", header);
    }
    if (footer instanceof File) {
      formData.append("footer", footer);
    }

    try {
      let response;
      if (templateId) {
        formData.append("image_id", templateId);
        response = await BaseUrl.put(`/patient/image/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        formData.append("doctor", doctorId);
        response = await BaseUrl.post(`/patient/image/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      if (response.status === 201 || response.status === 200) {
        alert("Template saved successfully!");
        await fetchTemplates();
      } else {
        alert("Failed to save the template. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while saving the template.");
    }
  };

  return (
    <div style={{ backgroundColor: "#D9EAFD" }} className="pt-4">
      <h2 className="text-center">Please upload your template</h2>
      <p className="text-center text-danger font-weight-bold">
        (*Please upload Header and Footer of Height = 450px and Width = 2480px)
      </p>
      <div className="manage-templates-container mt-4">
        <div className="button-panel">
          <label className="upload-button">
            <MdFileUpload /> Upload Header
            <input
              type="file"
              accept="image/*"
              onChange={handleHeaderUpload}
              hidden
            />
          </label>
          <label className="upload-button">
            <MdFileUpload /> Upload Footer
            <input
              type="file"
              accept="image/*"
              onChange={handleFooterUpload}
              hidden
            />
          </label>
          <button className="save-button" onClick={handleSaveTemplate}>
            <FaRegSave /> Save Template
          </button>
        </div>
        <div className="custom-page">
          <div className="header-section">
            {header && (
              <img
                src={`${BaseUrl.defaults.baseURL}${header}`}
                alt="Header"
                className="header-image"
              />
            )}
            {/* {header && (
              <img
                src={
                  typeof header === "string"
                    ? `${BaseUrl.defaults.baseURL}${header}`
                    : URL.createObjectURL(header)
                }
                alt="Header"
                className="header-image"
              />
            )} */}
          </div>
          <div className="page-content">Your content goes here</div>
          <div className="footer-section">
            {footer && (
              <img
              src={`${BaseUrl.defaults.baseURL}${footer}`}
                alt="Footer"
                className="footer-image"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTemplates;














// import React, { useEffect, useState } from "react";
// import { FaRegSave } from "react-icons/fa";
// import { MdFileUpload } from "react-icons/md";
// import "../../css/ManageTemplates.css";
// import BaseUrl from "../../api/BaseUrl";
// import {jwtDecode} from "jwt-decode";

// function ManageTemplates() {
//   const [header, setHeaderImage] = useState(null);
//   const [footer, setFooterImage] = useState(null);
//   const [doctorId, setDoctorId] = useState(null);
//   const [templateId, setTemplateId] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setDoctorId(decoded.doctor_id);
//     }
//   }, []);

//   useEffect(() => {
//     if (doctorId) {
//       fetchTemplates();
//     }
//   }, [doctorId]); // Fetch templates when doctorId is updated

//   const fetchTemplates = async () => {
//     try {
//       const response = await BaseUrl.get(`/patient/image/?doctor=${doctorId}`);
//       console.log("API Response:", response.data); // Debugging log
//       if (response.status === 200 && response.data.length > 0) {
//         const { id, header, footer } = response.data[0];
//         setTemplateId(id);
//         setHeaderImage(header);
//         setFooterImage(footer);
//       } else {
//         console.warn("No templates found for this doctor.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch templates:", error);
//     }
//   };

//   const handleHeaderUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setHeaderImage(file);
//     }
//   };

//   const handleFooterUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFooterImage(file);
//     }
//   };

//   const handleSaveTemplate = async () => {
//     const formData = new FormData();

//     if (header instanceof File) {
//       formData.append("header", header);
//     }
//     if (footer instanceof File) {
//       formData.append("footer", footer);
//     }

//     try {
//       let response;
//       if (templateId) {
//         formData.append("image_id", templateId);
//         response = await BaseUrl.put(`/patient/image/`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       } else {
//         formData.append("doctor", doctorId);
//         response = await BaseUrl.post(`/patient/image/`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       }
//       if (response.status === 201 || response.status === 200) {
//         alert("Template saved successfully!");
//         await fetchTemplates();
//       } else {
//         alert("Failed to save the template. Please try again.");
//       }
//     } catch (error) {
//       alert("An error occurred while saving the template.");
//       console.error("Save error:", error);
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#D9EAFD" }} className="pt-4">
//       <h2 className="text-center">Please upload your template</h2>
//       <p className="text-center text-danger font-weight-bold">
//         (*Please upload Header and Footer of Height = 450px and Width = 2480px)
//       </p>
//       <div className="manage-templates-container mt-4">
//         <div className="button-panel">
//           <label className="upload-button">
//             <MdFileUpload /> Upload Header
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleHeaderUpload}
//               hidden
//             />
//           </label>
//           <label className="upload-button">
//             <MdFileUpload /> Upload Footer
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFooterUpload}
//               hidden
//             />
//           </label>
//           <button className="save-button" onClick={handleSaveTemplate}>
//             <FaRegSave /> Save Template
//           </button>
//         </div>
//         <div className="custom-page">
//           <div className="header-section">
//           {header && (
//               <img
//                 src={`${header}`}
//                 alt="Header"
//                 className="header-image"
//               />
//             )}
//             {/* {header ? (
//               <img
//                 src={
//                   typeof header === "string"
//                     ? header
//                     : URL.createObjectURL(header)
//                 }
//                 alt="Header"
//                 className="header-image"
//                 onError={() => console.error("Header image failed to load:", header)}
//               />
//             ) : (
//               <p>No header uploaded</p>
//             )} */}
//           </div>
//           <div className="page-content">Your content goes here</div>
//           <div className="footer-section">
//             {footer ? (
//               <img
//                 src={
//                   typeof footer === "string"
//                     ? footer
//                     : URL.createObjectURL(footer)
//                 }
//                 alt="Footer"
//                 className="footer-image"
//                 onError={() => console.error("Footer image failed to load:", footer)}
//               />
//             ) : (
//               <p>No footer uploaded</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageTemplates;
