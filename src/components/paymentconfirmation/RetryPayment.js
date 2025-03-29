import React from 'react';
import { Link } from 'react-router-dom';
import './RetryPayment.css'; 

const Error404 = () => {
  return (
    <div className="niramaya-404-page">
      <div className="niramaya-404-container">
        <img
          src={require('../../images/logon.jpeg')}
          alt="Niramaya Homeopathy Logo"
          className="niramaya-404-logo"
        />

        <h1 className="niramaya-404-heading">404</h1>
        <h2 className="niramaya-404-subheading">Oops! Page Not Found</h2>
        <p className="niramaya-404-message">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="niramaya-404-actions">
          <Link to="/" className="niramaya-home-btn">
            Back to Home
          </Link>
          {/* <Link to="/contact-us" className="niramaya-contact-btn">
            Contact Us
          </Link> */}
        </div>

        <div className="niramaya-404-search">
          <input
            type="text"
            placeholder="Search for treatments or articles..."
            className="niramaya-search-input"
          />
          <button className="niramaya-search-btn">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Error404;