import React, { useState, useContext, useEffect } from 'react';
import Style from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Assets/images/12.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell, faBookmark, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { userContext } from '../../Context/userContext';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Navbar() {
  const { userToken, setUserToken } = useContext(userContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  function Logout() {
    axios.get('https://grad-project-3zvo.onrender.com/app/auth/logout')
      .then(() => {
        Cookies.remove('access_token');
        setUserToken(null);
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        Cookies.remove('access_token');
        setUserToken(null);
        navigate('/login');
      });
  }

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
  useEffect(() => {
    if (userToken) {
      fetchNotifications();
    }
  }, [userToken]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/Notification/showMyNotifications', {
        withCredentials: true,
      });
      setNotifications(response.data.AllMyNotifications);
      setNotificationCount(response.data.AllMyNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete('https://grad-project-3zvo.onrender.com/app/Notification/deleteAllMyNotification', {
        withCredentials: true,
      });
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleDropdownClick = () => {
    setNotificationCount(0); // Reset notification count to zero
  };

  console.log(isAdminLoggedIn());
  return (
    <>
      <nav
        className={`navbar navbar-expand-lg bg-body-tertiary ${Style.customNavbar} fixed-top`}
        style={{
          fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif',
          lineHeight: '1.2',
          height: '70px',
          fontWeight: 'bold',
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img width={120} src={logo} alt="logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/" style={{ textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Projects" style={{ textDecoration: 'none' }}>
                  Projects
                </Link>
              </li>
              {userToken !== null && !isAdminLoggedIn() && (
                <>
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="#" style={{ textDecoration: 'none' }}>
                      Recommendation
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyWishlist" style={{ textDecoration: 'none' }}>
                      <FontAwesomeIcon icon={faBookmark} style={{ marginRight: '5px' }} /> My Wishlist
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyProjects" style={{ textDecoration: 'none' }}>
                      <FontAwesomeIcon icon={faUserPen} style={{ marginRight: '5px' }} />
                      My Projects
                    </Link>
                  </li>
                </>
              )}

              {userToken !== null && isAdminLoggedIn() && (
                  <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Users" style={{ textDecoration: 'none' }}>
                      Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/SystemActions" style={{ textDecoration: 'none' }}>
                    System Actions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/PendingProjects" style={{ textDecoration: 'none' }}>
                    Pending Projects
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {userToken !== null ? (
                <>
                  <li className="nav-item dropdown">
                    <span
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={handleDropdownClick} // Reset notifications on dropdown click
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faBell} size="lg" />
                      {notificationCount > 0 && (
                        <span className="badge bg-danger rounded-pill" style={{ marginLeft: '5px' }}>{notificationCount}</span>
                      )}
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown" style={{ maxWidth: '600px', maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <li key={index} style={{ padding: '10px', cursor: 'pointer' }}>
                            <Link className="dropdown-item" to={`/ProjectDetails/${notification.project}`}>
                              <div>
                                <h style={{ color: 'rgb(27 93 165)',}}>{notification.content}</h>
                                <p>Date: {new Date(notification.date).toLocaleString()}</p>
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="dropdown-item" style={{ padding: '10px' }}>No notifications</span>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                        <button className="dropdown-item" onClick={clearAllNotifications}>Clear All Notifications</button>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/AccountSettings" style={{ textDecoration: 'none' }}>
                      <FontAwesomeIcon icon={faUserCircle} style={{ marginRight: '5px' }} />
                      My Profile
                    </Link>
                  </li>
                    {/* Help Icon */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/Help" style={{ textDecoration: 'none' }}>
                        <i className="fas fa-question-circle" style={{ marginRight: '5px' }}></i>
                        Help
                      </Link>
                    </li>
                  <li className="nav-item">
                    <span
                      onClick={() => Logout()}
                      className="nav-link cursor-pointer button-33"
                      style={{ textDecoration: 'none' }}
                    >
                      Logout
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link button-33" to="/Login" style={{ textDecoration: 'none' }}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link button-33" to="/Register" style={{ textDecoration: 'none' }}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <br />
      <br />
      <br />
    </>
  );
}
