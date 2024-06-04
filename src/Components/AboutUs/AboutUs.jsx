import React from 'react';
import img from '../../Assets/images/aboutus.jpg'

export default function AboutUs() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="header">
          <h1 className="title fw-bold mb-4 " style={{ color: 'rgb(27 93 165)' }}>About Us</h1>
          </div>
          <div className="main">
            <p className="description text-dark mb-4">
              Our project aims to connect students with their peers and mentors. The platform provides a seamless
              experience for students and mentors, allowing them to connect with each other and share resources
              and knowledge. Our platform is designed to be user-friendly and intuitive, making it easy for
              students and mentors to find each other and engage in meaningful discussions.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <img className="img-fluid rounded shadow" src={img} alt="About Us Background" />
        </div>
      </div>
    </div>
  );
}

