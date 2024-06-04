import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyProjects.module.css';
import projectImage from '../../Assets/images/project.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen, faHeart, faBookmark as faBookmarkSolid, faBookmark, faShare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BallTriangle } from 'react-loader-spinner';

const MyProjects = () => {
  
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false); 
  const [likes, setLikes] = useState({});
  const [likedProjects, setLikedProjects] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistMessages, setWishlistMessages] = useState({});
  const [error, setError] = useState(null);
  const [withCredentials, setWithCredentials] = useState(false);

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

  async function fetchProjects() {
    setIsLoading(true);
    try {
      const token = getUserToken();
      if (token) {
        setWithCredentials(true);
        const myProjectsResponse = await axios.get('https://grad-project-3zvo.onrender.com/app/project/AllmyProjects', {
          withCredentials: true
        });
        const myProjects = myProjectsResponse.data.data;
        setProjects(myProjects);
      }

      // Fetch wishlist if user is authenticated
      if (token) {
        const wishlistResponse = await axios.get('https://grad-project-3zvo.onrender.com/app/userFavList/showMyFavoriteList', {
          withCredentials: true
        });
        setWishlist(wishlistResponse.data.myFavoriteList);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchLikes = async (project_id, like_id) => {
    try {
      const response = await axios.get(`https://grad-project-3zvo.onrender.com/app/projectInteractions/getAllLikes/${project_id}`);
      const { number_Of_Likes, Likes_data } = response.data;
      setLikes({ number_Of_Likes, Likes_data });
  
      if (like_id) {
        const deletedLikeIndex = Likes_data.findIndex(like => like._id === like_id);
        if (deletedLikeIndex !== -1) {
          // Delete the like from the state if found
          setLikes(prevLikes => ({
            number_Of_Likes: prevLikes.number_Of_Likes - 1,
            Likes_data: prevLikes.Likes_data.filter((_, index) => index !== deletedLikeIndex)
          }));
        }
      }
    } catch (error) {
     
    }
  };
  
  useEffect(() => {
    const defaultWishlist = projects.map((project) => project._id);
    setWishlist(defaultWishlist);
    const initialMessages = {};
    defaultWishlist.forEach((projectId) => {
    });
    setWishlistMessages(initialMessages);
  }, [projects]);

  const handleImageClick = (event, pdfUrl) => {
    event.preventDefault();
    const applicationId = pdfUrl.split('-')[1].split('.')[0]; // Extracting the application ID
    const pdfDownloadUrl = `https://grad-project-3zvo.onrender.com/app/project/application-${applicationId}.pdf`;
    window.open(pdfDownloadUrl, '_blank');
  };

  const handleLikeClick = async (event, project_id) => {
    event.preventDefault();
    try {
      const token = getUserToken();
  
      if (token) {
        if (likedProjects.includes(project_id)) {
          console.log('Project is already liked.'); // Handle this scenario (e.g., show a message to the user)
        } else {
          setLikedProjects((prevLikedProjects) => [...prevLikedProjects, project_id]);
  
          await axios.post(
            `https://grad-project-3zvo.onrender.com/app/projectInteractions/addlike/${project_id}`,
            {
              isLiked: true,
            },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success('Project has been liked');

          fetchLikes(project_id);
        }
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
     
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUnlikeClick = async (event, project_id, like_id) => {
    event.preventDefault();
    try {
      const token = getUserToken();
  
      if (token) {
        setLikedProjects((prevLikedProjects) =>
          prevLikedProjects.filter((id) => id !== project_id)
        );
  
        await axios.delete(
          `https://grad-project-3zvo.onrender.com/app/projectInteractions/deleteMyLike/${project_id}/${like_id}`, // Include like_id in the URL
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        console.log('Like deleted successfully');
  
        // Fetch likes to update state
        await fetchLikes(project_id, like_id); // Pass project_id and like_id
  
        // Optionally, you may want to refetch the likes or update UI accordingly.
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWishlistClick = async (event, project_id) => {
    event.preventDefault();
    try {
      setIsLoadingWishlist(true);
      const token = getUserToken();
  
      if (token) {
        if (wishlist.some((item) => item._id === project_id)) {
          // Project is already in the wishlist, so remove it
          setWishlist((prevWishlist) =>
            prevWishlist.filter((item) => item._id !== project_id)
          );
          toast.success('Project removed from Wishlist');

          await axios.delete(
            `https://grad-project-3zvo.onrender.com/app/userFavList/removeProjectFromFavoriteList`,
            {
              data: { project_ID: project_id, isAdded: false },
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          // Project is not in the wishlist, so add it
          const projectToAdd = projects.find((item) => item._id === project_id);
          if (projectToAdd) {
            setWishlist((prevWishlist) => [...prevWishlist, projectToAdd]);
            toast.success('Project added to Wishlist');
            await axios.post(
              `https://grad-project-3zvo.onrender.com/app/userFavList/addProjectToFavoriteList`,
              { project_ID: project_id, isAdded: true },
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } else {
            console.error('Project not found.');
          }
        }
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
    
    } finally {
      setIsLoadingWishlist(false);
    }
  };
  
  const handleShareClick = (event, project) => {
    event.preventDefault();

    if (navigator.share) {
      navigator.share({
        title: project.ProjectName,
        text: `Check out this project: ${project.ProjectName}`,
        url: window.location.href,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      console.log('Web Share API is not supported in this browser. You can implement a fallback share mechanism here.');
    }
  };
  
  const handleDeleteClick = async (event, project_id) => {
    event.preventDefault();
    
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");
    
    if (isConfirmed) {
      try {
        const token = getUserToken();

        if (token) {
          await axios.delete(
            `https://grad-project-3zvo.onrender.com/app/project/deleteMyProject/${project_id}`,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success('Deleted Succesfully');

          // Remove the project from the state
          setProjects(prevProjects => prevProjects.filter(project => project._id !== project_id));
  
          console.log('Project deleted successfully');
        } else {
          console.log('User not authenticated. Please log in.');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project. Please try again later.');
      }
    }
  };
  
  const acceptedProjects = projects.filter(project => project.status === 'accepted');
  const pendingProjects = projects.filter(project => project.status === 'pending');
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <div className={styles.ProjectsCards}>
        <h2><b>My Projects</b></h2>
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#3498db"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <>
            {acceptedProjects.length === 0 && pendingProjects.length === 0 ?(
              <p style={{ fontSize: '30px',color:'red', fontWeight: 'normal' }}>No projects to display yet</p>
            ) : (
              <>
              <h3 style={{ color: 'green' }}>Accepted Projects</h3>
                <div className="row">
                  {acceptedProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage).map(project => (
                    <div key={project._id} className="col-md-4">
                      <Link to={`/projectdetails/${project._id}`} style={{ textDecoration: 'none' }}>
                        <div className={`project py-3 px-2 ${styles.ProjectCard}`}>
                          <img src={projectImage} alt="Project Thumbnail" />
                          <h3 style={{ color: 'rgb(27 93 165)', fontSize: '1.5em' }} className="h5"><b>{project.projectName}</b></h3>
                          <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Category:</strong> {project.category}</p>
                          <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Description:</strong> {project.description}</p>
                          {withCredentials && (
                            <div style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
                              <FontAwesomeIcon icon={faUserPen} size="1x" />
                              <br />
                              My Project
                            </div>
                          )}
                         {withCredentials && (
  <button
    onClick={(event) => {
      if (likedProjects.includes(project._id)) {
        handleUnlikeClick(event, project._id, /* insert like_id here */); // Pass the like_id
        toast.success('Project has been unliked');
      } else {
        handleLikeClick(event, project._id);
        toast.success('Project has been liked');
      }
    }}
    className={`likeButton ${likedProjects.includes(project._id) ? 'liked' : ''}`}
  >
    <FontAwesomeIcon icon={faHeart} /> {likedProjects.includes(project._id) ? 'Liked' : 'Like'}
  </button>
)}
                          {withCredentials && (
                            <button
                              onClick={(event) => handleWishlistClick(event, project._id)}
                              className={`wishlistButton ${wishlist.some((item) => item._id === project._id) ? 'added' : ''}`}
                            >
                              <FontAwesomeIcon icon={wishlist.some((item) => item._id === project._id) ? faBookmarkSolid : faBookmarkSolid} /> {wishlist.some((item) => item._id === project._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </button>
                          )}

                          <button
                            onClick={(event) => handleShareClick(event, project)}
                            className="shareButton"
                          >
                            <FontAwesomeIcon icon={faShare} /> Share
                          </button>

                          <button
                            onClick={(event) => handleDeleteClick(event, project._id)}
                            className={`deleteButton`}
                            style={{ marginRight: '5px', color: '#fff', backgroundColor: '#dc3545' }} // Inline style for the delete button
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                          {likes.number_Of_Likes !== undefined && (
                            <span>Likes: {likes.number_Of_Likes}</span>
                          )}
                          {wishlist.includes(project._id) && (
                            <p style={{ color: 'black' }}>{wishlistMessages[project._id]}</p>
                          )}
                        </div>
                      </Link>
                      <br />
                    </div>
                  ))}
                </div>
              </>
            )}

            <nav className="d-flex justify-content-center">
              <ul className="pagination">
                {Array.from({ length: Math.ceil(acceptedProjects.length / projectsPerPage) }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button onClick={() => paginate(index + 1)} className="page-link">
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
              <br />
              <br />
            </nav>

            {pendingProjects.length > 0 && (
              <>
                <h3 style={{ color: 'orange' }}>Pending Projects</h3>
                <div className="row">
                  {pendingProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage).map(project => (
                    <div key={project._id} className="col-md-4">
                      <Link to={`/projectdetails/${project._id}`} style={{ textDecoration: 'none' }}>
                        <div className={`project py-3 px-2 ${styles.ProjectCard}`}>
                          <img src={projectImage} alt="Project Thumbnail" />
                          <h3 style={{ color: 'rgb(27 93 165)', fontSize: '1.5em' }} className="h5"><b>{project.projectName}</b></h3>
                          <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Category:</strong> {project.category}</p>
                          <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Description:</strong> {project.description}</p>
                          {withCredentials && (
                            <div style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
                              <FontAwesomeIcon icon={faUserPen} size="1x" />
                              <br />
                              My Project
                            </div>
                          )}
                          <button
                            onClick={(event) => handleShareClick(event, project)}
                            className="shareButton"
                          >
                            <FontAwesomeIcon icon={faShare} /> Share
                          </button>

                          <button
                            onClick={(event) => handleDeleteClick(event, project._id)}
                            className={`deleteButton`}
                            style={{ marginRight: '5px', color: '#fff', backgroundColor: '#dc3545' }} // Inline style for the delete button
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <br />
                <nav className="d-flex justify-content-center">
                  <ul className="pagination">
                    {Array.from({ length: Math.ceil(pendingProjects.length / projectsPerPage) }, (_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button onClick={() => paginate(index + 1)} className="page-link">
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </>
  );
};

export default MyProjects;