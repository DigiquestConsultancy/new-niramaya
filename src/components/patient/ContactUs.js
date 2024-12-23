import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../../css/ContactUs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FAQ from "./Faq";
import BaseUrl from "../../api/BaseUrl";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // Reset error
  
    const data = {
      name: formData.name,
      mobile_number: formData.phone,
      email: formData.email,
      message: formData.message,
    };
  
    try {
      await BaseUrl.post("/doctor/contactus/", data);
      alert("Your message has been submitted!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="contact-us">
      <div className="contact-header text-center">
        <h1>Contact Us</h1>
        <p>
          We’re here to support your journey to better health with Niramaya
          Homeopathy.
        </p>
      </div>

      <div className="container">
        <div className="row text-center">
          {/* Email Card */}
          <div className="col-md-4">
            <div className="card contact-card">
              <div className="card-body">
                <h3>Email</h3>
                <p>
                  <a href="mailto:niramayahomeopathy7@gmail.com">
                    niramayahomeopathy7@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="col-md-4">
            <div className="card contact-card">
              <div className="card-body">
                <h3>Phone</h3>
                <p>
                  <a href="tel:+919236185711">+91 9236185711</a>
                </p>
              </div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="col-md-4">
            <div className="card contact-card">
              <div className="card-body">
                <h3>Business Hours</h3>
                <p style={{ fontWeight: 600 }}>
                  Mon – Fri: 9:00 AM – 6:00 PM (EST)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row form-map align-items-start">
          {/* Contact Form Section */}
          <div className="col-lg-6 col-md-12 contact-form-section">
            <form className="contact-form mt-2 mb-5" onSubmit={handleSubmit}>
              <h2 className="text-center mb-5">Leave Your Message</h2>

              {error && <p className="error-message">{error}</p>}

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />

              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />

              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-control"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary mt-3"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Google Map Section */}
          <div className="col-lg-6 col-md-12 map-section">
            <div className="map-container">
              <iframe
                title="Digiquest Consultancy Services pvt. ltd. Gorakhpur"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.0667048146347!2d83.37459457611769!3d26.742247367394288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991450618206461%3A0x7cb9790da14c3972!2sDigiQuest%20Consultancy%20Services%20Private%20Limited!5e0!3m2!1sen!2sin!4v1732861929170!5m2!1sen!2sin"
                width="100%"
                height="510"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <FAQ />

      <div className="social-media mt-5">
        <h3>Follow Us</h3>
        <div className="social-links">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="facebook"
          >
            <FaFacebook size={30} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="twitter"
          >
            <FaTwitter size={30} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin"
          >
            <FaLinkedin size={30} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
