import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom'; 
import projectImage from '../../Assets/images/project.png';
import axios from 'axios';
import styles from './RandomProjects.module.css'; // Import your CSS module here

export default function RandomProjects() {
   const [mostViewedProjects, setMostViewedProjects] = useState([]);

   useEffect(() => {
      axios.get('https://grad-project-3zvo.onrender.com/app/project/getRandomProjecs')
         .then(response => {
            setMostViewedProjects(response.data);
         })
         .catch(error => {
            console.error('Error fetching most viewed projects:', error);
         });
   }, []);

   const settings = {
      arrows: true,
      centerMode: true,
      centerPadding: '0px',
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true,
   };

   return (
      <div className="container mt-5 mb-5 text-center">
         <div className="row">
         <h2 style={{ color: 'rgb(27, 93, 165)', fontSize: '30px',fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}><b>Some of our projects</b></h2>

            <Slider {...settings}>
               {mostViewedProjects.map(project => (
                  <div key={project._id} className={`col-md-4 ${styles.ProjectCards}`}>
                     <Link to={`/projectdetails/${project._id}`} style={{ textDecoration: 'none' }}>
                        <div className={`project py-3 px-2 ${styles.ProjectCard}`}>
                           {/* Assuming you have a projectImage variable */}
                           <img src={projectImage} alt="Project Thumbnail" className={styles.projectImage} />
                           <h3 style={{ color: 'rgb(27 93 165)', fontSize: '1.5em' }} className="h5"><b>{project.projectName}</b></h3>
                           <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Description:</strong> {project.description}</p>
                           <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Category:</strong> {project.category}</p>
                        </div>
                     </Link>
                  </div>
               ))}
            </Slider>
         </div>

         <br/>
         <br/>
         <br/>
      </div>
   );
}