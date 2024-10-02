import React from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../../images/profileIcon.png';

const ProfileIcon = () => {
  return (
    <div className="profile-icon">
      <Link to="/profile">
        <img src={profileIcon} alt="Profile" height="30" />
      </Link>
    </div>
  );
};

export default ProfileIcon;
