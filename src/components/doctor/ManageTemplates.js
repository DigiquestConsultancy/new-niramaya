import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
// import "../../css/ManageTemplates.css";
import BaseUrl from "../../api/BaseUrl";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";

function ManageTemplates() {
  const [header, setHeaderImage] = useState(null);
  const [footer, setFooterImage] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [templateId, setTemplateId] = useState(null);

  const [selectedMenu, setSelectedMenu] = useState("Manage Templates");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

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
    <div
    className="d-flex"
    style={{ height: "calc(100vh - 4rem)", overflowY: "hidden" }}
  >
      <Sidebar
        selectedMenu={selectedMenu}
        handleMenuClick={handleMenuClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
     <main className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-center">Please upload your template</h3>
        <p className="text-center text-danger fw-bold">
          (*Please upload Header and Footer of Height = 450px and Width =
          2480px)
        </p>

        <div className="container-fluid mt-4">
          <div className="row g-3">
            <div className="col-12 col-md-4 d-flex flex-column align-items-center gap-3">
              <label className="btn btn-info w-75 text-white d-flex align-items-center justify-content-center gap-2">
                <MdFileUpload /> Upload Header
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderUpload}
                  hidden
                />
              </label>

              <label className="btn btn-info w-75 text-white d-flex align-items-center justify-content-center gap-2">
                <MdFileUpload /> Upload Footer
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFooterUpload}
                  hidden
                />
              </label>

              <button
                className="btn btn-danger w-75 d-flex align-items-center justify-content-center gap-2"
                onClick={handleSaveTemplate}
              >
                <FaRegSave /> Save Template
              </button>
            </div>

            <div className="col-12 col-md-8 col-lg-6 mx-auto">
              <div
                className="border shadow rounded bg-white d-flex flex-column"
                style={{ height: "75vh" }}
              >
                <div
                  className="border-bottom d-flex align-items-center justify-content-center"
                  style={{ height: "15%" }}
                >
                  {header && (
                    <img
                      src={
                        header instanceof File
                          ? URL.createObjectURL(header)
                          : `${BaseUrl.defaults.baseURL}${header}`
                      }
                      alt="Header"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                    />
                  )}
                </div>
                <div className="flex-fill d-flex justify-content-center align-items-center p-3">
                  <p className="mb-0">Your content goes here</p>
                </div>
                <div
                  className="border-top d-flex align-items-center justify-content-center"
                  style={{ height: "15%" }}
                >
                  {footer && (
                    <img
                      src={
                        footer instanceof File
                          ? URL.createObjectURL(footer)
                          : `${BaseUrl.defaults.baseURL}${footer}`
                      }
                      alt="Footer"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageTemplates;
