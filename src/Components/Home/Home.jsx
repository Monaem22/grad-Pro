import React, { useEffect, useState } from 'react';
import styles from './Home.module.css'; 
import RandomProjects from '../RandomProjects/RandomProjects';
import WelcomeSenior from '../WelcomeSenior/WelcomeSenior';
import Cookies from 'js-cookie';
import AdminHome from '../AdminHome/AdminHome';
import AboutUs from '../AboutUs/AboutUs';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially set to null

  useEffect(() => {
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

    // Check if the user is not an admin before loading the Voiceflow widget
    if (isLoggedIn && !isAdminLoggedIn()) { // Check isLoggedIn
      const loadVoiceflowWidget = () => {
        // Check if the script has already been loaded
        if (!window.voiceflow) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.onload = function() {
            window.voiceflow.chat.load({
              verify: { projectID: '6632c6d504113b2334087196' },
              url: 'https://general-runtime.voiceflow.com',
              versionID: 'production'
            });
          };
          script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
          document.body.appendChild(script);
        } else {
          // If already loaded, just reload the widget
          window.voiceflow.chat.load({
            verify: { projectID: '6632c6d504113b2334087196' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production'
          });
        }
      };

      loadVoiceflowWidget();
    }

    return () => {
      // Clean up if needed
    };
  }, [isLoggedIn]); // Update dependency array

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
    // Check if the user is logged in when the component mounts
    setIsLoggedIn(!!Cookies.get('access_token')); // Set isLoggedIn based on whether access token exists
  }, []);

  return (
    <>
      {isAdminLoggedIn() ? <AdminHome/> : 
        <>
          <WelcomeSenior/>
          <RandomProjects/>
          <AboutUs/>
          <br />
          <br />
          <br />
        </>
      }
    </>
  );
}