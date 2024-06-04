import React, { useEffect, useState } from 'react';
import { useParams, Link,redirect } from 'react-router-dom';
import axios from 'axios';
import { BallTriangle } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faPaperPlane, faBookmark, faStar, faTrash, faEdit,faEnvelope  } from '@fortawesome/free-solid-svg-icons';
import Comments from '../Comments/Comments';
import toast from 'react-hot-toast';
import Notfound from '../Notfound/Notfound';
import styles from './ProjectDetails.module.css'; // Import CSS module
import Cookies from 'js-cookie';


export default function ProjectDetails() {
  const { id } = useParams();
  const [projectDetails, setProjectDetails] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [OwnerImage, setOwnerImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Add state to track ownership
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false); // Add state for update loading
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Add state to control update form visibility
  const [projectUpdated, setProjectUpdated] = useState(false);


  // Retrieve ownership status from local storage if available
  useEffect(() => {
    const storedIsOwner = localStorage.getItem('isOwner');
    if (storedIsOwner) {
      setIsOwner(JSON.parse(storedIsOwner));
    }
  }, []);

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


  async function getMyUserId() {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/user/showMyProfile', { withCredentials: true });
      const myProfile = response.data.my_Profile;
      const userId = myProfile._id;
      localStorage.setItem('userId', userId); // Store user ID in local storage
      return userId;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  useEffect(() => {
    getMyUserId().then((userId) => {
      getProjectDetails(id, userId); // Fetch project details once user ID is obtained
    });
  }, []);

  async function getProjectDetails(id, userId) {
    try {
      const { data } = await axios.get(`https://grad-project-3zvo.onrender.com/app/project/getSpacificProject/${id}`, {
        withCredentials: true,
      });
  
      // Check if data is empty or null
      if (!data || !data.data) {
        // Do nothing or handle the case where data is empty or null
        return;
      }
  
      setProjectDetails(data.data);
     
      if (data.data.owner.image) {
       
        const imageIdWithExtension =data.data.owner.image
        setOwnerImage(`https://grad-project-3zvo.onrender.com${imageIdWithExtension}`);
      }
      
      const filename = data.data.pdf.split('/').pop(); // Extract filename from path
      setPdfUrl(`https://grad-project-3zvo.onrender.com/app/project/${filename}`);
            
      const owner = data.data.owner._id === userId;
      setIsOwner(owner);
      localStorage.setItem('isOwner', JSON.stringify(owner)); // Store ownership status in local storage
    } catch (error) {
      setIsError(true); // Set error state to true
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleLike = async () => {
    try {
      const token = getUserToken();
      if (token) {
        await axios.post(`https://grad-project-3zvo.onrender.com/app/projectInteractions/addlike/${id}`, {}, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Project has been liked');

      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };
  
  const handleWishlistClick = async (event, projectId) => {
    event.preventDefault();
    try {
      setIsLoadingWishlist(true);
      const token = getUserToken();

      if (token) {
        if (wishlist.some(item => item._id === projectId)) {
          // Remove project from wishlist
          await axios.delete(
            `https://grad-project-3zvo.onrender.com/app/userFavList/removeProjectFromFavoriteList`,
            {
              data: { project_ID: projectId, isAdded: false },
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setWishlist(wishlist.filter(item => item._id !== projectId));
          // Show toaster message for removal
          toast.success('Project removed from wishlist');
        } else {
          // Add project to wishlist
          await axios.post(
            `https://grad-project-3zvo.onrender.com/app/userFavList/addProjectToFavoriteList`,
            { project_ID: projectId, isAdded: true },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setWishlist([...wishlist, { _id: projectId }]);
          // Show toaster message for addition
          toast.success('Project added to wishlist');
        }
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoadingWishlist(false);
    }
  };
  const handleDeleteProject = async () => {
    try {
      // Prompt the user for confirmation before deleting
      const confirmed = window.confirm("Are you sure you want to delete this project?");
      if (!confirmed) return; // If the user cancels, do nothing
      
      setDeleteLoading(true);
      const token = getUserToken();
      if (token) {
        await axios.delete(`https://grad-project-3zvo.onrender.com/app/project/deleteMyProject/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Project has been deleted succesfully');
        window.location.href = '/Projects';
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleDeleteProjectAdmin = async () => {
    try {
      // Prompt the user for confirmation before deleting
      const confirmed = window.confirm("Are you sure you want to delete this project?");
      if (!confirmed) return; // If the user cancels, do nothing
      
      if (!isAdminLoggedIn()) {
        toast.error('You do not have permission to delete projects as an admin.');
        return;
      }
  
      setDeleteLoading(true);
      const token = getUserToken();
      if (token) {
        await axios.delete(`https://grad-project-3zvo.onrender.com/app/project/deleteProject/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Project has been deleted succesfully');
        window.location.href = '/Projects';
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleteLoading(false);
    }
  };
    const handleUpdateProject = async (projectName, category, description) => {
    try {
      setUpdateLoading(true);
      const token = getUserToken();
      if (token) {
        await axios.put(`https://grad-project-3zvo.onrender.com/app/project/updateProjectData/${id}`, {
          projectName,
          category,
          description,
        }, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        // After successfully updating the project, you can redirect the user to another page or perform other actions
        console.log('Project updated successfully!');
        setProjectUpdated(true);
      } else {
        console.log('User not authenticated. Please log in.');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://grad-project-3zvo.onrender.com/app/projectInteractions/addComment/${id}`, {
        content: comment,
      }, {
        withCredentials: true,
      });
      setComment('');
      setCommentSubmitted(true);
      setShowCommentForm(false); // Close the comment form
      window.location.reload();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const token = getUserToken();
      if (token) {
        const wishlistResponse = await axios.get('https://grad-project-3zvo.onrender.com/app/userFavList/showMyFavoriteList', {
          withCredentials: true
        });
        setWishlist(wishlistResponse.data.myFavoriteList);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (projectUpdated) {
      window.location.reload();
      setProjectUpdated(false); // Reset the state variable
    }
  }, [projectUpdated]);
  if (isError) {
    return <Notfound />; // Redirect to NotFoundComponent if an error occurred
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
  
  return (
    <div className="container my-5">
      {/* Print a star icon if the user is the owner */}
      <div className="d-flex align-items-center mb-3">
        {isOwner && <FontAwesomeIcon icon={faStar} style={{ color: 'gold', marginRight: '5px' }} />}
        {isOwner && <p style={{ color: 'black', margin: '0' }}>You are the owner</p>}
        {isOwner && (
          <>
            <button
              className="btn btn-danger ml-auto mr-2"
              disabled={deleteLoading}
              onClick={handleDeleteProject}
              style={{
                marginLeft: '1030px',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {deleteLoading ? <FontAwesomeIcon icon={faTrash} spin /> : <FontAwesomeIcon icon={faTrash} />}
            </button>
            <button
              className="btn btn-info"
              style={{
                marginLeft: 'auto',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                color: "white",
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowUpdateForm((prev) => !prev)} // Toggle showUpdateForm
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
            </button>
          </>
          
        )}
      </div>
      
      {showUpdateForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }} className="card-title">Update Project</h5>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const projectName = formData.get('projectName');
              const category = formData.get('category');
              const description = formData.get('description');
              handleUpdateProject(projectName, category, description);
            }}>
  
              <div className="form-group" style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}>
                <label htmlFor="projectName">Project Name</label>
                <input type="text" className="form-control" id="projectName" name="projectName" required />
              </div>
              <div className="form-group" style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}>
                <label htmlFor="category">Category</label>
                <input type="text" className="form-control" id="category" name="category" required />
              </div>
              <div className="form-group" style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}>
                <label htmlFor="description">Description</label>
                <textarea className="form-control" id="description" name="description" rows="3" required></textarea>
              </div>
              <button type="submit"
                style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}
                className="btn btn-primary" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update'}
              </button>
              <button
                type="button"
                style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}
                className="btn btn-secondary ml-2"
                onClick={() => setShowUpdateForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
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
      ) : isError ? (
        <>
          <p className="text-danger">Error fetching project details.</p>
          <Notfound /> {/* Render the "Not Found" component if an error occurred */}
        </>
      ) : (
        projectDetails && (
          <div className="row">
            <div className="col-md-12">
              <h2 style={{ color: 'rgb(27 93 165)', fontSize: '2em', fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }} className="mb-4"><b>{projectDetails.projectName}</b></h2>
              <p style={{ fontSize: '1.2em', fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}><strong>Description:</strong> {projectDetails.description}</p>
              <iframe title="project-pdf" src={pdfUrl} className="w-100 mb-4" style={{ height: '500px', border: '2px solid black' }}></iframe>
              <div className="mt-4 d-flex">
                <button
                title='Like'
                  className="btn btn-primary like-comment-button"
                  style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                  }}
                  onClick={handleLike} // Call handleLike when the button is clicked
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button
                title='Comment'
                  className="btn btn-success like-comment-button"
                  style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                  }}
                  onClick={() => setShowCommentForm((prev) => !prev)} // Toggle showCommentForm
                >
                  <FontAwesomeIcon icon={faComment} />
                </button>
                <button
                title='Add or remove from wishlist'
                  onClick={(event) => handleWishlistClick(event, projectDetails._id)}
                  className={`btn wishlistButton item ${wishlist.some(item => item._id === projectDetails._id) ? 'added' : ''}`}
                  style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    backgroundColor: 'GhostWhite'
                  }}
                >
                  <FontAwesomeIcon icon={faBookmark} style={{ color: 'Gold', opacity: wishlist.some(item => item._id === projectDetails._id) ? 1 : 0.5 }} />
                </button>
                {!showEmail ? (
  <button
  title={`Click to email ${projectDetails.owner.email}`}
  onClick={() => window.location.href = `mailto:${projectDetails.owner.email}`}
    style={{
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: "10px",
      backgroundColor: "#DB4437", // Gmail red color
      border: "none",
      color:'#FFFFFF' // White color for the envelope icon
    }}
  >
    <FontAwesomeIcon icon={faEnvelope} />
  </button>
) : (
  <p>
    <a href={`mailto:${projectDetails.owner.email}`}>
      {projectDetails.owner.email}
    </a>
  </p>
)}
{isAdminLoggedIn() && !isOwner && (
    <div style={styles.actions}>
        <button
            className="btn btn-danger ml-auto mr-2"
            disabled={deleteLoading}
            onClick={handleDeleteProjectAdmin}
            style={{
                marginLeft: '1030px',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {deleteLoading ? <FontAwesomeIcon icon={faTrash} spin /> : <FontAwesomeIcon icon={faTrash} />}
        </button>
    </div>
)}

              </div>
              {showCommentForm && !commentSubmitted && (
                <form onSubmit={handleCommentSubmit} className="mt-3">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your comment here..."
                      style={{
                        borderRadius: '5px',
                        padding: '10px',
                        fontSize: '1em',
                      }}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-success" style={{ borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </form>
              )}
              {commentSubmitted && (
                <p className="text-success mt-3">Comment submitted successfully!</p>
              )}
              <br />
              <div className="mb-4" style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif', fontSize: '1.2em' }}>
              
              <p>
                {OwnerImage && (
                  <Link to={`UserProfile/${projectDetails.owner._id}`} style={{ textDecoration: 'none' }}>
                    <img alt='Owner' src={OwnerImage} style={{ width: '75px', height: '75px', borderRadius: '50%', border: '2px solid black', objectFit: 'cover',  marginRight: '10px' }} />
                  </Link>
                )}
                  <strong> Created by: <span style={{ color: 'rgb(27 93 165)' }}>
                    <Link  to={`UserProfile/${projectDetails.owner._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {projectDetails.owner.userName}
                    </Link>
                  </span></strong>
                </p>
                <p><strong>Creation Date:</strong> {new Date(projectDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
                <p><strong>Status:</strong> {projectDetails.status}</p>
                <p><strong>Total Likes:</strong> {projectDetails.likes.length}</p>
                <p><strong>Total added to wishlist:</strong> {projectDetails.numberOfUsersAddedThisProjectToFavoriteList}</p>
              </div>
            </div>
          </div>
        )
      )}
      <div className="row">
        <div className="col-md-12">
          <Comments />
        </div>
      </div>
    </div>
  );
}  