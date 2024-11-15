import React from 'react';
import bottomDirection from '../../assets/bottomDirection.svg'; // Import the image

const Header = () => { 
  return (
    <div className="header-right">
      <div className="role">
        <h3>Admin</h3>
        {/* Use the imported image variable */}
        <img src={bottomDirection} alt="Dropdown Icon" />
      </div>
      <div className="profile">
        <div className="onlineStatus"></div>
      </div>
    </div>
  );
}

export default Header;
