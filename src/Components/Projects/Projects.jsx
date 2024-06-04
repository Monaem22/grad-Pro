import React, { useState, useEffect } from 'react';
import ProjectsCards from '../ProjectsCards/ProjectsCards';
import Style from './Projects.module.css';
import AddProject from '../AddProject/AddProject';

export default function Projects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUserToken = () => {
    // Retrieve the authentication token from the 'access_token' cookie
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'access_token') {
        return decodeURIComponent(value); // Decode the token if necessary
      }
    }
    return null; // Return null if 'access_token' cookie is not found
  };

  useEffect(() => {
    const token = getUserToken();
    // Update isAuthenticated based on whether token is present or not
    setIsAuthenticated(token !== null);
  }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <ProjectsCards />
        </div>
      </div>
      {isAuthenticated && (
        <div className="row">
          <div className="col px-0">
            <AddProject />
          </div>
        </div>
      )}
    </div>
  );
}
