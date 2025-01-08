
import React from 'react';
import profileIcon from '../../images/profileIcon.png';
 
const ProfileIcon = ({ onClick }) => {
  return (
    <div className="profile-icon" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img src={profileIcon} alt="Profile" height="30" />
    </div>
  );
};
 
export default ProfileIcon;