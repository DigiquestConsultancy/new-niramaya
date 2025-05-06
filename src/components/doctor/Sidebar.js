// import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { RiMenuFold3Fill } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";
// import { FaClinicMedical } from "react-icons/fa";
// import { RiHospitalFill } from "react-icons/ri";
// import { FaRegClipboard } from "react-icons/fa";
// import { MdPayment } from "react-icons/md";
// import { IoMdSettings } from "react-icons/io";


// const Sidebar = ({ selectedMenu, handleMenuClick }) => {
//   const history = useHistory();
//   const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);
//   const [isAppointmentDropdownOpen, setIsAppointmentDropdownOpen] = useState(false);
//   const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
//   const [isTemplatesDropdownOpen, setIsTemplatesDropdownOpen] = useState(false);

//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//   const toggleDropdown = (setterFunction) => setterFunction((prev) => !prev);

//   const handleNavigation = (path, name) => {
//     handleMenuClick(name);
//     history.push(path);
//   };

//   const menuItems = [{ name: "Dashboard", path: "/doctor/home" }];
//   const DoctorDetails = [{ name: "Doctor Details", path: "/doctor/details" }];
//   const hospitalItems = [
//     { name: "Manage Reception", path: "/doctor/managereception" },
//     { name: "Manage Clinic", path: "/doctor/manageclinic" },
//   ];
//   const AppointmentItems = [
//     { name: "Appointment Slot", path: "/doctor/appointments" },
//     { name: "Create Slot", path: "/doctor/addslot" },
//     { name: "Book Appointment", path: "/doctor/bookappointment" },
//     { name: "Booked Appointment", path: "/doctor/bookedappointment" },
//   ];
//   const paymentItems = [
//     { name: "Payment History", path: "/doctor/paymenthistory" },
//     { name: "Billing", path: "/doctor/paymenthistory" },
//   ];
//   const templates = [
//     { name: "Manage Templates", path: "/doctor/managetemplates" },
//   ];

//   return (
//     <div
//       className="text-white flex-column shadow-lg"
//       style={{
//         width: isCollapsed ? "80px" : "280px",
//         transition: "width 0.3s ease",
//         overflowX: "hidden",
//         height: "calc(100vh - 56px)",
//         background: "linear-gradient(180deg, #1e3a8a, #3b82f6)", 
//         borderRight: "1px solid rgba(255, 255, 255, 0.1)",
//       }}
//     >
//       {/* Sidebar Toggle */}
//       <div className="d-flex justify-content-center align-items-center mt-4 mb-3">
//         <RiMenuFold3Fill
//           className="fs-2 text-white"
//           onClick={toggleSidebar}
//           style={{
//             cursor: "pointer",
//             transition: "transform 0.3s ease",
//             transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
//           }}
//         />
//       </div>

//       <aside className="sidebar-content" style={{ width: "100%" }}>
//         <nav className="px-2">
//           <ul className="list-unstyled">
//             {/* Main Menu Items */}
//             {menuItems.map((menu) => (
//               <li
//                 key={menu.name}
//                 className={`d-flex align-items-center rounded mb-2 ${
//                   selectedMenu === menu.name
//                     ? "bg-blue-700"
//                     : "hover:bg-blue-800"
//                 }`}
//                 onClick={() => handleNavigation(menu.path, menu.name)}
//                 style={{
//                   justifyContent: isCollapsed ? "center" : "flex-start",
//                   padding: "12px 16px",
//                   cursor: "pointer",
//                   transition: "background 0.2s ease",
//                 }}
//               >
//                 <FaClinicMedical className="fs-5" />
//                 {!isCollapsed && (
//                   <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                     {menu.name}
//                   </span>
//                 )}
//               </li>
//             ))}

//             {/* Doctor Details */}
//             {DoctorDetails.map((menu) => (
//               <li
//                 key={menu.name}
//                 className={`d-flex align-items-center rounded mb-2 ${
//                   selectedMenu === menu.name
//                     ? "bg-blue-700"
//                     : "hover:bg-blue-800"
//                 }`}
//                 onClick={() => handleNavigation(menu.path, menu.name)}
//                 style={{
//                   justifyContent: isCollapsed ? "center" : "flex-start",
//                   padding: "12px 16px",
//                   cursor: "pointer",
//                   transition: "background 0.2s ease",
//                 }}
//               >
//                 <FaUserDoctor className="fs-5" />
//                 {!isCollapsed && (
//                   <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                     {menu.name}
//                   </span>
//                 )}
//               </li>
//             ))}

//             {/* Hospital Dropdown */}
//             <li
//               className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//               onClick={() => toggleDropdown(setIsHospitalDropdownOpen)}
//               style={{
//                 padding: "12px 16px",
//                 cursor: "pointer",
//                 transition: "background 0.2s ease",
//               }}
//             >
//               <RiHospitalFill className="fs-5" />
//               {!isCollapsed && (
//                 <>
//                   <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                     Hospital
//                   </span>
//                   <RiArrowDropDownLine
//                     className="fs-3 ms-auto"
//                     style={{
//                       transform: isHospitalDropdownOpen
//                         ? "rotate(180deg)"
//                         : "rotate(0deg)",
//                       transition: "transform 0.3s ease",
//                     }}
//                   />
//                 </>
//               )}
//             </li>

//             {/* Hospital Dropdown Items */}
//             {isHospitalDropdownOpen && !isCollapsed && (
//               <ul className="list-unstyled ms-4">
//                 {hospitalItems.map((item) => (
//                   <li
//                     key={item.name}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleNavigation(item.path, item.name);
//                     }}
//                     className="py-2 px-3 rounded hover:bg-blue-700"
//                     style={{ fontSize: "1rem", cursor: "pointer" }}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Appointment Dropdown */}
//             <li
//               className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//               onClick={() => toggleDropdown(setIsAppointmentDropdownOpen)}
//               style={{
//                 padding: "12px 16px",
//                 cursor: "pointer",
//                 transition: "background 0.2s ease",
//               }}
//             >
//               <FaRegClipboard className="fs-5" />
//               {!isCollapsed && (
//                 <>
//                   <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                     Appointment
//                   </span>
//                   <RiArrowDropDownLine
//                     className="fs-3 ms-auto"
//                     style={{
//                       transform: isAppointmentDropdownOpen
//                         ? "rotate(180deg)"
//                         : "rotate(0deg)",
//                       transition: "transform 0.3s ease",
//                     }}
//                   />
//                 </>
//               )}
//             </li>

//             {/* Appointment Dropdown Items */}
//             {isAppointmentDropdownOpen && !isCollapsed && (
//               <ul className="list-unstyled ms-4">
//                 {AppointmentItems.map((item) => (
//                   <li
//                     key={item.name}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleNavigation(item.path, item.name);
//                     }}
//                     className="py-2 px-3 rounded hover:bg-blue-700"
//                     style={{ fontSize: "1rem", cursor: "pointer" }}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Payment Dropdown */}
//             <li
//               className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//               onClick={() => toggleDropdown(setIsPaymentDropdownOpen)}
//               style={{
//                 padding: "12px 16px",
//                 cursor: "pointer",
//                 transition: "background 0.2s ease",
//               }}
//             >
//               <MdPayment className="fs-5" />
//               {!isCollapsed && (
//                 <>
//                   <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                     Payment
//                   </span>
//                   <RiArrowDropDownLine
//                     className="fs-3 ms-auto"
//                     style={{
//                       transform: isPaymentDropdownOpen
//                         ? "rotate(180deg)"
//                         : "rotate(0deg)",
//                       transition: "transform 0.3s ease",
//                     }}
//                   />
//                 </>
//               )}
//             </li>

//             {/* Payment Dropdown Items */}
//             {isPaymentDropdownOpen && !isCollapsed && (
//               <ul className="list-unstyled ms-4">
//                 {paymentItems.map((item) => (
//                   <li
//                     key={item.name}
//                     onClick={() => handleNavigation(item.path, item.name)}
//                     className="py-2 px-3 rounded hover:bg-blue-700"
//                     style={{ fontSize: "1rem", cursor: "pointer" }}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
            
//             {/* Manage Templates */}
//             <li
//               className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//               onClick={() => toggleDropdown(setIsTemplatesDropdownOpen)}
//               style={{
//                 padding: "12px 16px",
//                 cursor: "pointer",
//                 transition: "background 0.2s ease",
//               }}
//             >
//               <IoMdSettings className="fs-5" />
//               {!isCollapsed && (
//                 <>
//                   <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                     Settings
//                   </span>
//                   <RiArrowDropDownLine
//                     className="fs-3 ms-auto"
//                     style={{
//                       transform: isTemplatesDropdownOpen
//                         ? "rotate(180deg)"
//                         : "rotate(0deg)",
//                       transition: "transform 0.3s ease",
//                     }}
//                   />
//                 </>
//               )}
//             </li>

//             {/* Manage Templates Dropdown Items */}
//             {isTemplatesDropdownOpen && !isCollapsed && (
//               <ul className="list-unstyled ms-4">
//                 {templates.map((item) => (
//                   <li
//                     key={item.name}
//                     onClick={() => handleNavigation(item.path, item.name)}
//                     className="py-2 px-3 rounded hover:bg-blue-700"
//                     style={{ fontSize: "1rem", cursor: "pointer" }}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </ul>
//         </nav>
//       </aside>
//     </div>
//   );
// };

// export default Sidebar;








// import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { RiMenuFold3Fill } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";
// import { FaClinicMedical } from "react-icons/fa";
// import { RiHospitalFill } from "react-icons/ri";
// import { FaRegClipboard } from "react-icons/fa";
// import { MdPayment } from "react-icons/md";

// const Sidebar = ({ selectedMenu, handleMenuClick }) => {
//   const history = useHistory();
//   const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);
//   const [isAppointmentDropdownOpen, setIsAppointmentDropdownOpen] = useState(false);
//   const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
//   const [isTemplatesDropdownOpen, setIsTemplatesDropdownOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMenuVisible, setIsMenuVisible] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 1024) {
//         setIsCollapsed(true);
//         setIsMenuVisible(false);
//       } else {
//         setIsCollapsed(false);
//         setIsMenuVisible(true);
//       }
//     };

//     handleResize(); 
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (window.innerWidth <= 1024) {
//       setIsMenuVisible(!isMenuVisible);
//     }
//   };

//   const toggleDropdown = (setterFunction) => setterFunction((prev) => !prev);

//   const handleNavigation = (path, name) => {
//     handleMenuClick(name);
//     history.push(path);
//     if (window.innerWidth <= 1024) {
//       setIsCollapsed(true);
//       setIsMenuVisible(false);
//     }
//   };

//   const menuItems = [{ name: "Dashboard", path: "/doctor/home" }];
//   const DoctorDetails = [{ name: "Doctor Details", path: "/doctor/details" }];
//   const hospitalItems = [
//     { name: "Manage Reception", path: "/doctor/managereception" },
//     { name: "Manage Clinic", path: "/doctor/manageclinic" },
//   ];
//   const AppointmentItems = [
//     { name: "Appointment Slot", path: "/doctor/appointments" },
//     { name: "Create Slot", path: "/doctor/addslot" },
//     { name: "Book Appointment", path: "/doctor/bookappointment" },
//     { name: "Booked Appointment", path: "/doctor/bookedappointment" },
//   ];
//   const paymentItems = [
//     { name: "Payment History", path: "/doctor/paymenthistory" },
//   ];
//   const templates = [
//     { name: "Manage Templates", path: "/doctor/managetemplates" },
//   ];

//   return (
//     <div
//     className="text-white flex-column shadow-lg"
//     style={{
//       width: isCollapsed
//         ? window.innerWidth <= 1024
//           ? "40px"
//           : "80px"
//         : "280px",
//       transition: "width 0.3s ease",
//       height: window.innerWidth > 1024 ? "calc(100vh - 56px)" : undefined,
//       background:
//         window.innerWidth <= 1024 && isCollapsed
//           ? "transparent"
//           : "linear-gradient(180deg, #1e3a8a, #3b82f6)",
//       borderRight:
//         window.innerWidth <= 1024 && isCollapsed
//           ? "none"
//           : "1px solid rgba(255, 255, 255, 0.1)",
//       position: window.innerWidth <= 1024 ? "absolute" : "relative",
//       zIndex: 1000,
//       overflowX: "hidden",
//     }}
//   >
//       <div
//         className="d-flex justify-content-center align-items-center mt-4 mb-3"
//         style={{
//           background:
//             window.innerWidth <= 1024 && isCollapsed
//               ? "linear-gradient(180deg, #1e3a8a, #3b82f6)"
//               : "transparent",
//           borderRadius: window.innerWidth <= 1024 && isCollapsed ? "8px" : "0",
//           width: window.innerWidth <= 1024 && isCollapsed ? "40px" : "100%",
//           height: window.innerWidth <= 1024 && isCollapsed ? "40px" : "auto",
//           margin: window.innerWidth <= 1024 && isCollapsed ? "0 auto" : "0",
//         }}
//       >
//         <RiMenuFold3Fill
//           className="fs-2 text-white"
//           onClick={toggleSidebar}
//           style={{
//             cursor: "pointer",
//             transition: "transform 0.3s ease",
//             transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
//           }}
//         />
//       </div>

//       <aside className="sidebar-content" style={{ width: "100%" }}>
//         <nav className="px-2">
//           <ul className="list-unstyled">
//             {isMenuVisible && (
//               <>
//                 {menuItems.map((menu) => (
//                   <li
//                     key={menu.name}
//                     className={`d-flex align-items-center rounded mb-2 ${
//                       selectedMenu === menu.name
//                         ? "bg-blue-700"
//                         : "hover:bg-blue-800"
//                     }`}
//                     onClick={() => handleNavigation(menu.path, menu.name)}
//                     style={{
//                       justifyContent: isCollapsed ? "center" : "flex-start",
//                       padding: "12px 16px",
//                       cursor: "pointer",
//                       transition: "background 0.2s ease",
//                     }}
//                   >
//                     <FaClinicMedical className="fs-5" />
//                     {!isCollapsed && (
//                       <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                         {menu.name}
//                       </span>
//                     )}
//                   </li>
//                 ))}

//                 {DoctorDetails.map((menu) => (
//                   <li
//                     key={menu.name}
//                     className={`d-flex align-items-center rounded mb-2 ${
//                       selectedMenu === menu.name
//                         ? "bg-blue-700"
//                         : "hover:bg-blue-800"
//                     }`}
//                     onClick={() => handleNavigation(menu.path, menu.name)}
//                     style={{
//                       justifyContent: isCollapsed ? "center" : "flex-start",
//                       padding: "12px 16px",
//                       cursor: "pointer",
//                       transition: "background 0.2s ease",
//                     }}
//                   >
//                     <FaUserDoctor className="fs-5" />
//                     {!isCollapsed && (
//                       <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                         {menu.name}
//                       </span>
//                     )}
//                   </li>
//                 ))}

//                 <li
//                   className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//                   onClick={() => toggleDropdown(setIsHospitalDropdownOpen)}
//                   style={{
//                     padding: "12px 16px",
//                     cursor: "pointer",
//                     transition: "background 0.2s ease",
//                   }}
//                 >
//                   <RiHospitalFill className="fs-5" />
//                   {!isCollapsed && (
//                     <>
//                       <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                         Hospital
//                       </span>
//                       <RiArrowDropDownLine
//                         className="fs-3 ms-auto"
//                         style={{
//                           transform: isHospitalDropdownOpen
//                             ? "rotate(180deg)"
//                             : "rotate(0deg)",
//                           transition: "transform 0.3s ease",
//                         }}
//                       />
//                     </>
//                   )}
//                 </li>

//                 {isHospitalDropdownOpen && !isCollapsed && (
//                   <ul className="list-unstyled ms-4">
//                     {hospitalItems.map((item) => (
//                       <li
//                         key={item.name}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleNavigation(item.path, item.name);
//                         }}
//                         className={`py-2 px-3 rounded ${
//                           selectedMenu === item.name
//                             ? "bg-blue-700"
//                             : "hover:bg-blue-700"
//                         }`}
//                         style={{ fontSize: "1rem", cursor: "pointer" }}
//                       >
//                         {item.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 <li
//                   className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//                   onClick={() => toggleDropdown(setIsAppointmentDropdownOpen)}
//                   style={{
//                     padding: "12px 16px",
//                     cursor: "pointer",
//                     transition: "background 0.2s ease",
//                   }}
//                 >
//                   <FaRegClipboard className="fs-5" />
//                   {!isCollapsed && (
//                     <>
//                       <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                         Appointment
//                       </span>
//                       <RiArrowDropDownLine
//                         className="fs-3 ms-auto"
//                         style={{
//                           transform: isAppointmentDropdownOpen
//                             ? "rotate(180deg)"
//                             : "rotate(0deg)",
//                           transition: "transform 0.3s ease",
//                         }}
//                       />
//                     </>
//                   )}
//                 </li>

//                 {isAppointmentDropdownOpen && !isCollapsed && (
//                   <ul className="list-unstyled ms-4">
//                     {AppointmentItems.map((item) => (
//                       <li
//                         key={item.name}
//                         onClick={() => handleNavigation(item.path, item.name)}
//                         className={`py-2 px-3 rounded ${
//                           selectedMenu === item.name
//                             ? "bg-blue-700"
//                             : "hover:bg-blue-700"
//                         }`}
//                         style={{ fontSize: "1rem", cursor: "pointer" }}
//                       >
//                         {item.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 <li
//                   className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//                   onClick={() => toggleDropdown(setIsPaymentDropdownOpen)}
//                   style={{
//                     padding: "12px 16px",
//                     cursor: "pointer",
//                     transition: "background 0.2s ease",
//                   }}
//                 >
//                   <MdPayment className="fs-5" />
//                   {!isCollapsed && (
//                     <>
//                       <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                         Payment
//                       </span>
//                       <RiArrowDropDownLine
//                         className="fs-3 ms-auto"
//                         style={{
//                           transform: isPaymentDropdownOpen
//                             ? "rotate(180deg)"
//                             : "rotate(0deg)",
//                           transition: "transform 0.3s ease",
//                         }}
//                       />
//                     </>
//                   )}
//                 </li>

//                 {isPaymentDropdownOpen && !isCollapsed && (
//                   <ul className="list-unstyled ms-4">
//                     {paymentItems.map((item) => (
//                       <li
//                         key={item.name}
//                         onClick={() => handleNavigation(item.path, item.name)}
//                         className={`py-2 px-3 rounded ${
//                           selectedMenu === item.name
//                             ? "bg-blue-700"
//                             : "hover:bg-blue-700"
//                         }`}
//                         style={{ fontSize: "1rem", cursor: "pointer" }}
//                       >
//                         {item.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 <li
//                   className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
//                   onClick={() => toggleDropdown(setIsTemplatesDropdownOpen)}
//                   style={{
//                     padding: "12px 16px",
//                     cursor: "pointer",
//                     transition: "background 0.2s ease",
//                   }}
//                 >
//                   <MdPayment className="fs-5" />
//                   {!isCollapsed && (
//                     <>
//                       <span className="ms-3" style={{ fontSize: "1.1rem" }}>
//                         Manage Templates
//                       </span>
//                       <RiArrowDropDownLine
//                         className="fs-3 ms-auto"
//                         style={{
//                           transform: isTemplatesDropdownOpen
//                             ? "rotate(180deg)"
//                             : "rotate(0deg)",
//                           transition: "transform 0.3s ease",
//                         }}
//                       />
//                     </>
//                   )}
//                 </li>

//                 {isTemplatesDropdownOpen && !isCollapsed && (
//                   <ul className="list-unstyled ms-4">
//                     {templates.map((item) => (
//                       <li
//                         key={item.name}
//                         onClick={() => handleNavigation(item.path, item.name)}
//                         className={`py-2 px-3 rounded ${
//                           selectedMenu === item.name
//                             ? "bg-blue-700"
//                             : "hover:bg-blue-700"
//                         }`}
//                         style={{ fontSize: "1rem", cursor: "pointer" }}
//                       >
//                         {item.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </>
//             )}
//           </ul>
//         </nav>
//       </aside>
//     </div>
//   );
// };

// export default Sidebar;




import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiMenuFold3Fill } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { RiHospitalFill } from "react-icons/ri";
import { FaRegClipboard } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const Sidebar = ({ selectedMenu, handleMenuClick }) => {
  const history = useHistory();
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);
  const [isAppointmentDropdownOpen, setIsAppointmentDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isTemplatesDropdownOpen, setIsTemplatesDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
        setIsMenuVisible(false);
      } else {
        setIsCollapsed(false);
        setIsMenuVisible(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (window.innerWidth <= 1024) {
      setIsMenuVisible(!isMenuVisible);
    }
  };

  const closeAllDropdowns = () => {
    setIsHospitalDropdownOpen(false);
    setIsAppointmentDropdownOpen(false);
    setIsPaymentDropdownOpen(false);
    setIsTemplatesDropdownOpen(false);
  };

  const toggleDropdown = (setterFunction, currentState) => {
    closeAllDropdowns(); // Close all dropdowns
    setterFunction(!currentState); // Toggle the clicked dropdown
  };

  const handleDropdownClick = (setterFunction, currentState) => {
    toggleDropdown(setterFunction, currentState);
  };

  const handleNavigation = (path, name) => {
    handleMenuClick(name);
    history.push(path);
    if (window.innerWidth <= 1024) {
      setIsCollapsed(true);
      setIsMenuVisible(false);
    }
  };

  const menuItems = [{ name: "Dashboard", path: "/doctor/home" }];
  const DoctorDetails = [{ name: "Doctor Details", path: "/doctor/details" }];
  const hospitalItems = [
    { name: "Manage Reception", path: "/doctor/managereception" },
    { name: "Manage Clinic", path: "/doctor/manageclinic" },
  ];
  const AppointmentItems = [
    { name: "Appointment Slot", path: "/doctor/appointments" },
    { name: "Create Slot", path: "/doctor/addslot" },
    { name: "Book Appointment", path: "/doctor/bookappointment" },
    { name: "Booked Appointment", path: "/doctor/bookedappointment" },
  ];
  const paymentItems = [
    { name: "Payment History", path: "/doctor/paymenthistory" },
  ];
  const templates = [
    { name: "Manage Templates", path: "/doctor/managetemplates" },
  ];

  return (
    <div
      className="text-white flex-column shadow-lg"
      style={{
        width: isCollapsed
          ? window.innerWidth <= 1024
            ? "40px"
            : "80px"
          : "280px",
        transition: "width 0.3s ease",
        height: window.innerWidth > 1024 ? "calc(100vh - 56px)" : "auto",
        maxHeight: window.innerWidth <= 1024 ? "100vh" : undefined,
        overflowY: window.innerWidth <= 1024 && !isCollapsed ? "auto" : "auto",
        background:
          window.innerWidth <= 1024 && isCollapsed
            ? "transparent"
            : "linear-gradient(180deg, #1e3a8a, #3b82f6)",
        borderRight:
          window.innerWidth <= 1024 && isCollapsed
            ? "none"
            : "1px solid rgba(255, 255, 255, 0.1)",
        position: window.innerWidth <= 1024 ? "absolute" : "relative",
        zIndex: 1000,
        overflowX: "hidden",
      }}
    >
      <div
        className="d-flex justify-content-center align-items-center mt-4 mb-3"
        style={{
          background:
            window.innerWidth <= 1024 && isCollapsed
              ? "linear-gradient(180deg, #1e3a8a, #3b82f6)"
              : "transparent",
          borderRadius: window.innerWidth <= 1024 && isCollapsed ? "8px" : "0",
          width: window.innerWidth <= 1024 && isCollapsed ? "40px" : "100%",
          height: window.innerWidth <= 1024 && isCollapsed ? "40px" : "auto",
          margin: window.innerWidth <= 1024 && isCollapsed ? "0 auto" : "0",
        }}
      >
        <RiMenuFold3Fill
          className="fs-2 text-white"
          onClick={toggleSidebar}
          style={{
            cursor: "pointer",
            transition: "transform 0.3s ease",
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      <aside className="sidebar-content" style={{ width: "100%" }}>
        <nav className="px-2">
          <ul className="list-unstyled">
            {isMenuVisible && (
              <>
                {menuItems.map((menu) => (
                  <li
                    key={menu.name}
                    className={`d-flex align-items-center rounded mb-2 ${
                      selectedMenu === menu.name
                        ? "bg-blue-700"
                        : "hover:bg-blue-800"
                    }`}
                    onClick={() => handleNavigation(menu.path, menu.name)}
                    style={{
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaClinicMedical className="fs-5" />
                    {!isCollapsed && (
                      <span className="ms-3" style={{ fontSize: "1.1rem" }}>
                        {menu.name}
                      </span>
                    )}
                  </li>
                ))}

                {DoctorDetails.map((menu) => (
                  <li
                    key={menu.name}
                    className={`d-flex align-items-center rounded mb-2 ${
                      selectedMenu === menu.name
                        ? "bg-blue-700"
                        : "hover:bg-blue-800"
                    }`}
                    onClick={() => handleNavigation(menu.path, menu.name)}
                    style={{
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <FaUserDoctor className="fs-5" />
                    {!isCollapsed && (
                      <span className="ms-3" style={{ fontSize: "1.1rem" }}>
                        {menu.name}
                      </span>
                    )}
                  </li>
                ))}

                <li
                  className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
                  onClick={() => handleDropdownClick(setIsHospitalDropdownOpen, isHospitalDropdownOpen)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  <RiHospitalFill className="fs-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ms-3" style={{ fontSize: "1.1rem" }}>
                        Hospital
                      </span>
                      <RiArrowDropDownLine
                        className="fs-3 ms-auto"
                        style={{
                          transform: isHospitalDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </>
                  )}
                </li>

                {isHospitalDropdownOpen && !isCollapsed && (
                  <ul className="list-unstyled ms-4">
                    {hospitalItems.map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(item.path, item.name);
                          setIsHospitalDropdownOpen(false);
                        }}
                        className={`py-2 px-3 rounded ${
                          selectedMenu === item.name
                            ? "bg-blue-700"
                            : "hover:bg-blue-700"
                        }`}
                        style={{ fontSize: "1rem", cursor: "pointer" }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}

                <li
                  className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
                  onClick={() => handleDropdownClick(setIsAppointmentDropdownOpen, isAppointmentDropdownOpen)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  <FaRegClipboard className="fs-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ms-3" style={{ fontSize: "1.1rem" }}>
                        Appointment
                      </span>
                      <RiArrowDropDownLine
                        className="fs-3 ms-auto"
                        style={{
                          transform: isAppointmentDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </>
                  )}
                </li>

                {isAppointmentDropdownOpen && !isCollapsed && (
                  <ul className="list-unstyled ms-4">
                    {AppointmentItems.map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(item.path, item.name);
                          setIsAppointmentDropdownOpen(false);
                        }}
                        className={`py-2 px-3 rounded ${
                          selectedMenu === item.name
                            ? "bg-blue-700"
                            : "hover:bg-blue-700"
                        }`}
                        style={{ fontSize: "1rem", cursor: "pointer" }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}

                <li
                  className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
                  onClick={() => handleDropdownClick(setIsPaymentDropdownOpen, isPaymentDropdownOpen)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  <MdPayment className="fs-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ms-3" style={{ fontSize: "1.1rem" }}>
                        Payment
                      </span>
                      <RiArrowDropDownLine
                        className="fs-3 ms-auto"
                        style={{
                          transform: isPaymentDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </>
                  )}
                </li>

                {isPaymentDropdownOpen && !isCollapsed && (
                  <ul className="list-unstyled ms-4">
                    {paymentItems.map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(item.path, item.name);
                          setIsPaymentDropdownOpen(false);
                        }}
                        className={`py-2 px-3 rounded ${
                          selectedMenu === item.name
                            ? "bg-blue-700"
                            : "hover:bg-blue-700"
                        }`}
                        style={{ fontSize: "1rem", cursor: "pointer" }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}

                <li
                  className="d-flex align-items-center rounded mb-2 hover:bg-blue-800"
                  onClick={() => handleDropdownClick(setIsTemplatesDropdownOpen, isTemplatesDropdownOpen)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  <MdPayment className="fs-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ms-3" style={{ fontSize: "1.1rem" }}>
                        Manage Templates
                      </span>
                      <RiArrowDropDownLine
                        className="fs-3 ms-auto"
                        style={{
                          transform: isTemplatesDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </>
                  )}
                </li>

                {isTemplatesDropdownOpen && !isCollapsed && (
                  <ul className="list-unstyled ms-4">
                    {templates.map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(item.path, item.name);
                          setIsTemplatesDropdownOpen(false);
                        }}
                        className={`py-2 px-3 rounded ${
                          selectedMenu === item.name
                            ? "bg-blue-700"
                            : "hover:bg-blue-700"
                        }`}
                        style={{ fontSize: "1rem", cursor: "pointer" }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;