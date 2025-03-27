
import React from 'react';
import profileIcon from '../../images/profileIcon.png';
 
const ProfileIcon = ({ onClick }) => {
  return (
    <div onClick={onClick} >
      <img src={profileIcon} alt="Profile" style={{height: "2rem", width: "2rem", marginRight: "1rem", cursor: "pointer", color: "#0F518F"}} />
    </div>
  );
};
 
export default ProfileIcon;