// import React, { useState } from "react";
// import { FaRegSave } from "react-icons/fa";
// import { MdFileUpload } from "react-icons/md";
// import "../../css/ManageTemplates.css";

// function ManageTemplates() {
//   const [headerImage, setHeaderImage] = useState(null);
//   const [footerImage, setFooterImage] = useState(null);

//   const handleHeaderUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setHeaderImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFooterUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setFooterImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div style={{backgroundColor: "#D9EAFD"}}>
//       <h1 className="text-center p-2">Please upload your template</h1>
//       <div className="manage-templates-container mt-4 mb-4">
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
//           <label className="upload-button">
//             <FaRegSave /> Save Template
//           </label>
//         </div>
//         <div className="custom-page">
//           <div className="header-section">
//             {headerImage && (
//               <img src={headerImage} alt="Header" className="header-image" />
//             )}
//           </div>
//           <div className="page-content">Your content goes here</div>
//           <div className="footer-section">
//             {footerImage && (
//               <img src={footerImage} alt="Footer" className="footer-image" />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageTemplates;

// import React, { useState } from "react";
// import { FaRegSave } from "react-icons/fa";
// import { MdFileUpload } from "react-icons/md";
// import "../../css/ManageTemplates.css";
// import BaseUrl from "../../api/BaseUrl";

// function ManageTemplates() {
//   const [header, setHeaderImage] = useState(null);
//   const [footer, setFooterImage] = useState(null);

//   const handleHeaderUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setHeaderImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFooterUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setFooterImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveTemplate = async () => {
//     if (!header || !footer) {
//       alert("Please upload both header and footer images before saving.");
//       return;
//     }

//     try {
//       const response = await BaseUrl.post("/patient/image/", {
//         header,
//         footer,
//       });

//       if (response.status === 200) {
//         alert("Template saved successfully!");
//       } else {
//         alert("Failed to save the template. Please try again.");
//       }
//     } catch (error) {
//       alert("An error occurred while saving the template.");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#D9EAFD" }}>
//       <h2 className="text-center">Please upload your template</h2>
//       <div className="manage-templates-container mt-4 mb-4">
//         <div className="button-panel">
//           <label className="upload-button">
//             <MdFileUpload /> Upload Header
//             <input
//               type="file"
//               accept="image"
//               onChange={handleHeaderUpload}
//               hidden
//             />
//           </label>
//           <label className="upload-button">
//             <MdFileUpload /> Upload Footer
//             <input
//               type="file"
//               accept="image"
//               onChange={handleFooterUpload}
//               hidden
//             />
//           </label>
//           <button className="upload-button" onClick={handleSaveTemplate}>
//             <FaRegSave /> Save Template
//           </button>
//         </div>
//         <div className="custom-page">
//           <div className="header-section">
//             {header && (
//               <img src={header} alt="Header" className="header-image" />
//             )}
//           </div>
//           <div className="page-content">Your content goes here</div>
//           <div className="footer-section">
//             {footer && (
//               <img src={footer} alt="Footer" className="footer-image" />
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

function ManageTemplates() {
  const [header, setHeaderImage] = useState(null);
  const [footer, setFooterImage] = useState(null);

  useEffect(() => {
    // Fetch the initial data when the component mounts
    const fetchTemplates = async () => {
      try {
        const response = await BaseUrl.get("/patient/image/");
        if (response.status === 200 && response.data.length > 0) {
          const { header, footer } = response.data[0]; // Assuming the first object is the one we need
          setHeaderImage(header);
          setFooterImage(footer);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };

    fetchTemplates();
  }, []);

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
    if (!header || !footer) {
      alert("Please upload both header and footer images before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("header", header);
    formData.append("footer", footer);

    try {
      const response = await BaseUrl.post("/patient/image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Template saved successfully!");
      } else {
        alert("Failed to save the template. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while saving the template.");
    }
  };

  return (
    <div style={{ backgroundColor: "#D9EAFD" }}>
      <h2 className="text-center">Please upload your template</h2>
      <div className="manage-templates-container mt-4 mb-4">
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
          <button className="upload-button" onClick={handleSaveTemplate}>
            <FaRegSave /> Save Template
          </button>
        </div>
        <div className="custom-page">
          <div className="header-section">
            {header && (
              <img
                src={
                  typeof header === "string"
                    ? BaseUrl.defaults.baseURL + header // Display fetched URL
                    : URL.createObjectURL(header) // Display uploaded file
                }
                alt="Header"
                className="header-image"
              />
            )}
          </div>
          <div className="page-content">Your content goes here</div>
          <div className="footer-section">
            {footer && (
              <img
                src={
                  typeof footer === "string"
                    ? BaseUrl.defaults.baseURL + footer // Display fetched URL
                    : URL.createObjectURL(footer) // Display uploaded file
                }
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
