import { useState } from "react";
import "./HomePage.css"; // CSS for styling
import heroImage from "../static-pages/images/heromain.webp";
import aboutImage from "../static-pages/images/about.webp";
import serviceImage1 from "../static-pages/images/service1.webp";
import serviceImage2 from "../static-pages/images/service2.webp";
import serviceImage3 from "../static-pages/images/service3.webp";
import serviceImage4 from "../static-pages/images/service4.webp";
import serviceImage5 from "../static-pages/images/service5.webp";
import serviceImage6 from "../static-pages/images/service6.webp";
import yourImageSrc from "../static-pages/images/form.webp";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaHeartbeat,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// Import doctor images (example images)
import doctor1 from "../static-pages/images/service1.webp";
import doctor2 from "../static-pages/images/service1.webp";
import doctor3 from "../static-pages/images/service8.webp";
import doctor4 from "../static-pages/images/service8.webp";
import doctor5 from "../static-pages/images/service8.webp";
import faqImage from "../static-pages/images/about.webp"; // Import FAQ image
import Footer from "../static-pages/Footer"; // Adjust the path if needed
import Navbar from "../static-pages/Navbar";
import SubNavbar from "../static-pages/SubNavbar";

const settings = {
  dots: true,
  infinite: true,
  speed: 200,
  slidesToShow: 3,
  slidesToScroll: 3,
  autoplay: true, // Enable auto sliding
  autoplaySpeed: 3000, // 3 seconds
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const faqs = [
  {
    question: "How can I book an appointment?",
    answer:
      "You can book an appointment by clicking the 'Request Appointment' button on our homepage or by calling our helpline.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer medical counseling, laboratory testing, surgical operations, and more. Check our services section for details.",
  },
  {
    question: "Do you provide emergency services?",
    answer:
      "Yes, we provide 24/7 emergency services. You can call our emergency hotline for immediate assistance.",
  },
];
const HomePage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div>
      <SubNavbar />
      <Navbar />
      <div className="hero-section">
        {/* Hero Background Image */}
        <div className="hero-bg">
          <img src={heroImage} alt="Hero" className="hero-image" />
        </div>

        {/* Text Content */}
        <div className="hero-content">
          <p className="sub-heading">The Home of Your Hope</p>
          <h1>
            Your Good Health is <br /> Our Responsibility
          </h1>
          <p className="description">
            Get your appointment through online and remain safe at your home.
            <br />
            Because your safety is our first priority.
          </p>
           <Link to="/patientbookappointment">
          <Button className="appointment-btn">Request Appointment</Button>
          </Link>
        </div>

        {/* Emergency Contact Section */}
        <div className="emergency-contact">
          <FaPhoneAlt className="phone-icon" />
          <div>
            <p>Get Emergency Service At 24/7</p>
            <h4>+8 (123) 456 789 12</h4>
          </div>
        </div>
      </div>
      {/* Revised About Section */}
      <div className="about-section">
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>
        <div className="about-content">
          <h4>About Us</h4>
          <h2>We Are Your Trusted Friend</h2>
          <p>
            Medizo is a trusted name of Medical Services who is always at your
            side and your health is our first priority. Medizo Care will be
            administered through plan-based customizable programs that
            incorporate partnership between family members and the care givers
            for long term illness or disease management.
          </p>
          <div className="service-icons">
            <div className="service-item">
              <FaClock className="icon" />
              <div>
                <h5>24/7 Support</h5>
                <p>
                  Our medical team of different department for long term illness
                  writers and editors makes all the
                </p>
              </div>
            </div>
            <div className="service-item">
              <FaHeartbeat className="icon" />
              <div>
                <h5>Emergency Support</h5>
                <p>
                  Our medical team of different department for long term illness
                  writers and editors makes all the
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Service Section with heading and paragraph */}
      <div className="service-section">
        <div className="container">
          <h2>Services That We Provide</h2>
          <p>
            We provide excellent services for your ultimate good health. Here
            some of the services are included for your better understanding that
            we are always at your side.
          </p>
          <div className="row">
            {/* Cards with hover effect */}
            <div className="service-card">
              <img src={serviceImage1} alt="Medical Counselling" />
              <h3>Medical Counselling</h3>
              <p>Description of Medical Counselling...</p>
            </div>
            <div className="service-card">
              <img src={serviceImage2} alt="Laboratory Test" />
              <h3>Laboratory Test</h3>
              <p>Description of Laboratory Testing...</p>
            </div>
            <div className="service-card">
              <img src={serviceImage3} alt="Surgical Operation" />
              <h3>Surgical Operation</h3>
              <p>Description of Surgical Operations...</p>
            </div>
            <div className="service-card">
              <img src={serviceImage4} alt="Service 4" />
              <h3>Service 4</h3>
              <p>Description of Service 4...</p>
            </div>
            <div className="service-card">
              <img src={serviceImage5} alt="Service 5" />
              <h3>Service 5</h3>
              <p>Description of Service 5...</p>
            </div>
            <div className="service-card">
              <img src={serviceImage6} alt="Service 6" />
              <h3>Service 6</h3>
              <p>Description of Service 6...</p>
            </div>
          </div>
        </div>
      </div>
      {/* Full-width Image with Form Section */}
      <div className="full-width-image-with-form">
        <img src={yourImageSrc} alt="Background" className="full-bg-image" />
        <div className="form-overlay">
          <h2>Get in Touch</h2>
          <p>Fill out the form below to learn more about our services.</p>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <select name="departments" id="departments">
              <option value="">Select Department</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="pediatrics">Pediatrics</option>
            </select>
            <textarea placeholder="Your Message"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <div className="doctor-slider-section">
        <h2>Meet Our Expert Doctors</h2>
        {/* <Slider {...settings}>
          <div className="doctor-card">
            <img src={doctor1} alt="Doctor 1" />
            <h4>Dr. Jane Doe</h4>
            <p>Cardiology</p>
          </div>
          <div className="doctor-card">
            <img src={doctor2} alt="Doctor 2" />
            <h4>Dr. John Smith</h4>
            <p>Neurology</p>
          </div>
          <div className="doctor-card">
            <img src={doctor3} alt="Doctor 3" />
            <h4>Dr. Alice Johnson</h4>
            <p>Orthopedics</p>
          </div>
          <div className="doctor-card">
            <img src={doctor4} alt="Doctor 3" />
            <h4>Dr. Alice Johnson</h4>
            <p>Orthopedics</p>
          </div>
          <div className="doctor-card">
            <img src={doctor5} alt="Doctor 3" />
            <h4>Dr. Alice Johnson</h4>
            <p>Orthopedics</p>
          </div>
        </Slider> */}
      </div>
      <div className="faq-section">
        <div className="faq-container">
          {/* Left Side - FAQ List */}
          <div className="faq-content">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  <h4>{faq.question}</h4>
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openIndex === index && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Image */}
          <div className="faq-image">
            <img src={faqImage} alt="FAQ" />
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default HomePage;
