// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.css';
// import Navbar from './components/MainNavbar/Navbar';
// import DoctorNavbar from './components/doctor/DoctorNavbar';
// import PatientNavbar from './components/patient/PatientNavbar';
// import CardContainer from './components/lists/CardContainer';
// import './css/MainContainer.css';
// import Medicine from './components/lists/Medicine';
// import LabTest from './components/lists/LabTest';
// import Consult from './components/lists/Consult';
// import FindDoctor from './components/lists/FindDoctor';
// import DoctorLogin from './components/doctor/DoctorLogin';
// import PatientLogin from './components/patient/PatientLogin';
// import DoctorRegister from './components/doctor/DoctorRegister';
// import PatientRegister from './components/patient/PatientRegister';
// import DoctorHome from './components/doctor/DoctorHome';
// import PatientHome from './components/patient/PatientHome';
// import PatientDetails from './components/patient/PatientDetails';
// import DoctorDetails from './components/doctor/DoctorDetails';
// import AppointmentSlot from './components/doctor/AppointmentSlot';
// import PatientSlot from './components/patient/PatientSlot';
// import BookAppointment from './components/patient/BookAppointment';
// import AddSlot from './components/doctor/AddSlot';
// import ManageClinic from './components/doctor/ManageClinic';
// import ClinicDetails from './components/doctor/ClinicDetails';
// import AddClinic from './components/doctor/AddClinic';
// import ClinicHome from './components/clinic/ClinicHome'; // Import ClinicHome
// import ReceptionHome from './components/reception/ReceptionHome'; // Import ReceptionHome
// import ManageReception from './components/doctor/ManageReception';
// import AddReception from './components/doctor/AddReception';
// import ReceptionDetails from './components/doctor/ReceptionDetails';
// import BookedAppointment from './components/doctor/BookedAppointments';
// import BookAppointments from './components/doctor/BookAppointments';
// import MyClinicDetails from './components/clinic/MyClinicDetails';
// import MyReceptionDetails from './components/reception/MyReceptionDetails';
// import ClinicAddSlot from './components/clinic/AddSlot';
// import PatientAppointmentBook from './components/clinic/PatientAppointmentBook';
// import PatientAppointmentBooks from './components/reception/PatientAppointmentBook';
// import ReceptionAddSlot from './components/reception/CreateSlot';
// import ReceptionBookedAppointment from './components/reception/BookedAppointment';
// import ClinicBookedAppointment from './components/clinic/BookedAppointment';
// import MedicalRecords from './components/patient/MedicalRecords';
// import Transaction from './components/patient/Transaction';
// import Footer from './components/MainFooter/Footer';
// import PatientBook from './components/PatientBook';

// function App() {
//   const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);
//   const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(false);

//   const handleDoctorLogin = () => {
//     setIsDoctorLoggedIn(true);
//   };

//   const handlePatientLogin = () => {
//     setIsPatientLoggedIn(true);
//   };

//   return (
//     <Router>
//       <div className="App">
//         {isDoctorLoggedIn ? (
//           <DoctorNavbar isLoggedIn={isDoctorLoggedIn} />
//         ) : isPatientLoggedIn ? (
//           <PatientNavbar isLoggedIn={isPatientLoggedIn} />
//         ) : (
//           <Navbar />
//         )}
//         <Switch>
//           <Route exact path="/doctor/login">
//             <DoctorLogin setIsDoctorLoggedIn={handleDoctorLogin} />
//           </Route>
//           <Route exact path="/patient/login">
//             <PatientLogin setIsPatientLoggedIn={handlePatientLogin} />
//           </Route>
//           <Route exact path="/finddoctor" component={FindDoctor} />
//           <Route exact path="/consult" component={Consult} />
//           <Route exact path="/medicine" component={Medicine} />
//           <Route exact path="/labtest" component={LabTest} />
//           <Route exact path="/doctor/register" component={DoctorRegister} />
//           <Route exact path="/patient/register" component={PatientRegister} />
//           <Route exact path="/doctor/home" component={DoctorHome} />
//           <Route exact path="/patient/home" component={PatientHome} />
//           <Route exact path="/patient/details" component={PatientDetails} />
//           <Route exact path="/patient/medicalrecords" component={MedicalRecords} />
//           <Route exact path="/patient/transaction" component={Transaction} />
//           <Route exact path="/doctor/details" component={DoctorDetails} />
//           <Route exact path="/doctor/appointments" component={AppointmentSlot} />
//           <Route exact path="/patient/slots" component={PatientSlot} />
//           <Route exact path="/patient/bookappointment" component={BookAppointment} />
//           <Route exact path="/doctor/bookedappointment" component={BookedAppointment} />
//           <Route exact path="/doctor/bookappointment" component={BookAppointments} />
//           <Route exact path="/doctor/addslot" component={AddSlot} />
//           <Route exact path="/doctor/manageclinic" component={ManageClinic} />
//           <Route exact path="/doctor/manageclinic/addclinic" component={AddClinic} />
//           <Route exact path="/doctor/manageclinic/details/:clinic_id" component={ClinicDetails} />
//           <Route exact path="/doctor/managereception" component={ManageReception} />
//           <Route exact path="/doctor/addreception" component={AddReception} />
//           <Route exact path="/doctor/receptiondetails/:reception_id" component={ReceptionDetails} />
//           <Route exact path="/clinic/home" component={ClinicHome} /> {/* Add ClinicHome Route */}
//           <Route exact path="/clinic/details" component={MyClinicDetails} />
//           <Route exact path="/clinic/createslot" component={ClinicAddSlot} />
//           <Route exact path="/clinic/appointmentbook" component={PatientAppointmentBook} />
//           <Route exact path="/clinic/bookedappointment" component={ClinicBookedAppointment} />
//           <Route exact path="/reception/home" component={ReceptionHome} /> {/* Add ReceptionHome Route */}
//           <Route exact path="/reception/details" component={MyReceptionDetails} />
//           <Route exact path="/reception/appointmentbook" component={PatientAppointmentBooks} />
//           <Route exact path="/reception/createslot" component={ReceptionAddSlot} />
//           <Route exact path="/reception/bookedappointment" component={ReceptionBookedAppointment} />
//           <Route exact path="/" component={CardContainer} />
//           <Route exact path="/patientbook" component={PatientBook} />
//         </Switch>
//         {/* <Footer/> */}
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import CustomNavbar from "./components/MainNavbar/Navbar";
import DoctorNavbar from "./components/doctor/DoctorNavbar";
import PatientNavbar from "./components/patient/PatientNavbar";
import CardContainer from "./components/lists/CardContainer";
import "./css/MainContainer.css";
import Medicine from "./components/lists/Medicine";
import LabTest from "./components/lists/LabTest";
import Consult from "./components/lists/Consult";
import FindDoctor from "./components/lists/FindDoctor";
import DoctorLogin from "./components/doctor/DoctorLogin";
import PatientLogin from "./components/patient/PatientLogin";
import DoctorRegister from "./components/doctor/DoctorRegister";
import PatientRegister from "./components/patient/PatientRegister";
import DoctorHome from "./components/doctor/DoctorHome";
import DoctorPayment from "./components/doctor/PaymentHistory";
import PatientHome from "./components/patient/PatientHome";
import PatientDetails from "./components/patient/PatientDetails";
import DoctorDetails from "./components/doctor/DoctorDetails";
import AppointmentSlot from "./components/doctor/AppointmentSlot";
import PatientSlot from "./components/patient/PatientSlot";
import BookAppointment from "./components/patient/BookAppointment";
import AddSlot from "./components/doctor/AddSlot";
import ManageClinic from "./components/doctor/ManageClinic";
import ClinicDetails from "./components/doctor/ClinicDetails";
import AddClinic from "./components/doctor/AddClinic";
import ClinicHome from "./components/clinic/ClinicHome";
import ReceptionHome from "./components/reception/ReceptionHome";
import ManageReception from "./components/doctor/ManageReception";
import AddReception from "./components/doctor/AddReception";
import ReceptionDetails from "./components/doctor/ReceptionDetails";
import BookedAppointment from "./components/doctor/BookedAppointments";
import BookAppointments from "./components/doctor/BookAppointments";
import MyClinicDetails from "./components/clinic/MyClinicDetails";
import MyReceptionDetails from "./components/reception/MyReceptionDetails";
import ClinicAddSlot from "./components/clinic/AddSlot";
import PatientAppointmentBook from "./components/clinic/PatientAppointmentBook";
import PatientAppointmentBooks from "./components/reception/PatientAppointmentBook";
import ReceptionAddSlot from "./components/reception/CreateSlot";
import ReceptionBookedAppointment from "./components/reception/BookedAppointment";
import ClinicBookedAppointment from "./components/clinic/BookedAppointment";
import MedicalRecords from "./components/patient/MedicalRecords";
import Transaction from "./components/patient/Transaction";
import PatientBook from "./components/PatientBook";
import ContactUs from "./components/patient/ContactUs";
import Checkout from "./components/patient/CheckOut";
import CheckOutBook from "./components/patient/CheckOutBook";

import TermsConditions from "./components/conditions/TermsConditions";
import PrivacyPolicy from "./components/conditions/PrivacyPolicy";
import RefundPolicy from "./components/conditions/RefundPolicy";

import PatientFooter from "./components/MainFooter/PatientFooter";
import DoctorFooter from "./components/MainFooter/DoctorFooter";

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleLogin = (type) => {
    localStorage.setItem("userType", type);
    setUserType(type);
  };

  const getNavbar = () => {
    if (["doctor", "clinic", "reception"].includes(userType)) {
      return <DoctorNavbar isLoggedIn={!!userType} />;
    } else if (userType === "patient") {
      return <PatientNavbar isLoggedIn={!!userType} />;
    }
    return <CustomNavbar />;
  };

  const getFooter = () => {
    switch (userType) {
      case "doctor":
        return <DoctorFooter />;
      case "patient":
        return <PatientFooter />;
      default:
        break;
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {getNavbar()}

        <main className="app-content">
          <Switch>
            <Route exact path="/finddoctor" component={FindDoctor} />
            <Route exact path="/consult" component={Consult} />
            <Route exact path="/medicine" component={Medicine} />
            <Route exact path="/labtest" component={LabTest} />
            <Route exact path="/doctor/login">
              <DoctorLogin setIsDoctorLoggedIn={() => handleLogin("doctor")} />
            </Route>
            <Route exact path="/doctor/register" component={DoctorRegister} />
            <Route exact path="/doctor/home" component={DoctorHome} />
            <Route
              exact
              path="/doctor/paymenthistory"
              component={DoctorPayment}
            />
            <Route
              exact
              path="/doctor/bookedappointment"
              component={BookedAppointment}
            />
            <Route
              exact
              path="/doctor/bookappointment"
              component={BookAppointments}
            />
            <Route exact path="/doctor/addslot" component={AddSlot} />
            <Route exact path="/doctor/manageclinic" component={ManageClinic} />
            <Route
              exact
              path="/doctor/manageclinic/addclinic"
              component={AddClinic}
            />
            <Route
              exact
              path="/doctor/manageclinic/details/:clinic_id"
              component={ClinicDetails}
            />
            <Route
              exact
              path="/doctor/managereception"
              component={ManageReception}
            />
            <Route exact path="/doctor/addreception" component={AddReception} />
            <Route
              exact
              path="/doctor/receptiondetails/:reception_id"
              component={ReceptionDetails}
            />
            <Route
              exact
              path="/doctor/appointments"
              component={AppointmentSlot}
            />
            <Route exact path="/patient/login">
              <PatientLogin
                setIsPatientLoggedIn={() => handleLogin("patient")}
              />
            </Route>
            <Route exact path="/patient/register" component={PatientRegister} />
            <Route exact path="/patient/home" component={PatientHome} />
            <Route exact path="/patient/home/checkout" component={Checkout} />
            <Route exact path="/patient/details" component={PatientDetails} />
            <Route
              exact
              path="/patient/medicalrecords"
              component={MedicalRecords}
            />
            <Route exact path="/patient/transaction" component={Transaction} />
            <Route exact path="/patient/contactus" component={ContactUs} />
            <Route exact path="/doctor/details" component={DoctorDetails} />
            <Route exact path="/patient/slots" component={PatientSlot} />
            <Route
              exact
              path="/patient/bookappointment"
              component={BookAppointment}
            />
            <Route
              exact
              path="/patient/checkoutbook"
              component={CheckOutBook}
            />
            <Route exact path="/clinic/home" component={ClinicHome} />{" "}
            {/* Add ClinicHome Route */}
            <Route exact path="/clinic/details" component={MyClinicDetails} />
            <Route exact path="/clinic/createslot" component={ClinicAddSlot} />
            <Route
              exact
              path="/clinic/appointmentbook"
              component={PatientAppointmentBook}
            />
            <Route
              exact
              path="/clinic/bookedappointment"
              component={ClinicBookedAppointment}
            />
            <Route exact path="/reception/home" component={ReceptionHome} />{" "}
            {/* Add ReceptionHome Route */}
            <Route
              exact
              path="/reception/details"
              component={MyReceptionDetails}
            />
            <Route
              exact
              path="/reception/appointmentbook"
              component={PatientAppointmentBooks}
            />
            <Route
              exact
              path="/reception/createslot"
              component={ReceptionAddSlot}
            />
            <Route
              exact
              path="/reception/bookedappointment"
              component={ReceptionBookedAppointment}
            />
            <Route exact path="/" component={CardContainer} />
            <Route exact path="/patientbook" component={PatientBook} />
            <Route
              exact
              path="/conditions/tearmandconditions"
              component={TermsConditions}
            />
            <Route
              exact
              path="/conditions/privacypolicy"
              component={PrivacyPolicy}
            />
            <Route
              exact
              path="/conditions/refundpolicy"
              component={RefundPolicy}
            />
          </Switch>
        </main>
        {/* <Footer /> */}
        {getFooter()}
      </div>
    </BrowserRouter>
  );
}

export default App;
