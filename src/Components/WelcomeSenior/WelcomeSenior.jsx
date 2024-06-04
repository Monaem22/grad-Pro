import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './WelcomeSenior.module.css';
import localImage from '../../Assets/images/homepage.png';


export default function WelcomeSenior() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially set to null

  useEffect(() => {
    setIsLoggedIn(null); // Set to null when starting the fetch
    // Fetch user profile
    axios.get('https://grad-project-3zvo.onrender.com/app/user/showMyProfile', {
      withCredentials: true
    })
    .then(response => {
      // Check if the response contains user profile information
      if (response.data && response.data.my_Profile) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    })
    .catch(error => {
      // Handle errors, maybe redirect to login page
      setIsLoggedIn(false); // Set isLoggedIn to false in case of error
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className ={styles.heading1} style={{ color: 'rgb(27 93 165)',fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}><b>Welcome Senior</b></h1>
        <div className={styles.descriptionContainer}></div>
        <p>
          In this seniors portal, you can access various features such as
          adding your project, navigating old projects students, getting
          recommended project ideas. Take full advantage of the resources
          available here and Good Luck Senior!
        </p>
        {isLoggedIn === null ? (
          // Render loading UI here
          <div>Loading...</div>
        ) : isLoggedIn ? (
          // If the user is logged in, don't display the buttons
          null
        ) : (
          // If the user is not logged in, display the login and register buttons
          <>
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
            <Link to="/register" className={styles.getStartedButton}>
              Get Started
            </Link>
          </>
        )}
      </div>
      <div className={styles.imageContainer}>
        <img alt = "homepage" src={localImage} className={styles.image} />
      </div>
    </div>
  );
}
