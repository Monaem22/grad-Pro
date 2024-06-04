import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies library if not already imported

const UserSidebar = ({ activepage }) => {
  const isAdminLoggedIn = () => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      const tokenParts = accessToken.split(' ');
      const token = tokenParts[tokenParts.length - 1];
      const user = JSON.parse(atob(token.split('.')[1]));
      return user.role === 'admin';
    }
    return false;
  };
  

  return (
    <div className="d-flex flex-column">
      {activepage === 'accountsettings' ? (
        <div className="bg-primary text-white p-2 rounded mb-4">
          <i className="fas fa-user-cog"></i>
          <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}> Account Settings</span>
        </div>
      ) : (
        <Link to="/user/AccountSettings" className="link">
          <div className="bg-light rounded p-2 mb-4">
            <i className="fas fa-user-cog"></i>
            <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}> Account Settings</span>
          </div>
        </Link>
      )}

      {activepage === 'ChangePassword' ? (
        <div className="bg-primary text-white p-2 rounded mb-4">
          <i className="fas fa-lock"></i>
          <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}> Change Password</span>
        </div>
      ) : (
        <Link to="/user/ChangePassword" className="link">
          <div className="bg-light rounded p-2 mb-4">
            <i className="fas fa-lock"></i>
            <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}> Change Password</span>
          </div>
        </Link>
      )}

      {!isAdminLoggedIn() && ( // Render only if user is not admin
        <>
          {activepage === 'Transcript' ? (
            <div className="bg-primary text-white p-2 rounded mb-4">
              <i className="fas fa-file-alt"></i>
              <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}>Transcript</span>
            </div>
          ) : (
            <Link to="/user/Transcript" className="link">
              <div className="bg-light rounded p-2 mb-4">
                <i className="fas fa-file-alt"></i>
                <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}>Transcript</span>
              </div>
            </Link>
          )}
        </>
      )}

      {activepage === 'ChatMessages' ? (
        <div className="bg-primary text-white p-2 rounded mb-4">
          <i className="fa-regular fa-comment-dots"></i>
          <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}>Chat Messages</span>
        </div>
      ) : (
        <Link to="/user/ChatMessages" className="link">
          <div className="bg-light rounded p-2 mb-4">
            <i className="fa-regular fa-comment-dots"></i>
            <span className="d-inline-block align-middle ml-2" style={{ lineHeight: '2' }}>Chat Messages</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default UserSidebar;
