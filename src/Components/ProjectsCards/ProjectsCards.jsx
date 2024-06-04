import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './ProjectsCards.module.css';
import projectImage from '../../Assets/images/project.png';
import { userContext } from '../../Context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faBookmark as faBookmarkSolid, faBookmark, faShare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';
import toast from 'react-hot-toast';

const ProjectsCards = () => {
  const [projects, setProjects] = useState([]);
  const [intersectedProjects, setIntersectedProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false); // Define isLoadingWishlist state variable
  const [likes, setLikes] = useState({});
  const [likedProjects, setLikedProjects] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistMessages, setWishlistMessages] = useState({});
  const [error, setError] = useState(null);
  const [withCredentials, setWithCredentials] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  let { userToken, setUserToken } = useContext(userContext);
  
  const getUserToken = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'access_token') {
            return decodeURIComponent(value); 
        }
    }
    return null; 
};
  
  async function fetchProjects() {
    setIsLoading(true);
    try {
      const allProjectsResponse = await axios.get('https://grad-project-3zvo.onrender.com/app/project/getAllProjects');
      const allProjects = allProjectsResponse.data.projects_data;
      const uniqueCategories = [...new Set(allProjects.map(project => project.category))];
      setCategories(uniqueCategories);
      setProjects(allProjects);
      const token = getUserToken();
      if (token) {
        setWithCredentials(true); // Set authentication status to true if user is authenticated
        const myProjectsResponse = await axios.get('https://grad-project-3zvo.onrender.com/app/project/AllmyProjects', {
          withCredentials: true
        });
        const myProjects = myProjectsResponse.data.data; // Access the array of projects
        // Find intersected projects
        const intersected = allProjects.filter(project => myProjects.some(myProject => myProject._id === project._id));
        setIntersectedProjects(intersected);
      }
      // Fetch wishlist if user is authenticated
      if (token) {
        const wishlistResponse = await axios.get('https://grad-project-3zvo.onrender.com/app/userFavList/showMyFavoriteList', {
          withCredentials: true
        });
        setWishlist(wishlistResponse.data.myFavoriteList);
      }
    } catch (error) {
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
      const response = await axios.get(`https://grad-project-3zvo.onrender.com/app/projectInteractions/getAllLikes/${project_id}`, {
        withCredentials: true
      });
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
            }
          );
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
  
        // Log the like_id
        console.log('Like ID:', like_id);
  
        await axios.delete(
          `https://grad-project-3zvo.onrender.com/app/projectInteractions/deleteMyLike/${project_id}`, // URL remains without like_id
          {
            withCredentials: true,
            data: { like_Id: like_id } // include like_id in the request body
            
          }
          
        );
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
      console.error('Error updating wishlist:', error);
      setError('Failed to update wishlist. Please try again later.');
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
  const filteredProjects = selectedCategory
  ? projects.filter(project => project.category === selectedCategory)
  : projects;
  useEffect(() => {
    if (userToken !== null) {
      // Set up the default wishlist using itemId if it exists, otherwise use _id
      const defaultWishlist = projects.map((project) => project.itemId || project._id);
    
      // Create initial messages for each project in the wishlist
      const initialMessages = {};
      projects.forEach((project) => {
        const projectId = project.itemId || project._id; // Access itemId if it exists
      });    
      // Update wishlist and messages state with the initial values
      setWishlist(defaultWishlist);
      setWishlistMessages(initialMessages);
    }
  }, [userToken, projects]);
  
  const filterProjects = () => {
    let filteredProjects = [...projects]; // Make a copy of projects array
    
    // If there's a search query, filter by it
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.projectName.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }
  
    // If a category is selected, filter by category
    if (selectedCategory) {
      filteredProjects = filteredProjects.filter(project => project.category === selectedCategory);
    }
  
    setSearchResults(filteredProjects);
  };
  
  useEffect(() => {
    filterProjects();
  }, [searchQuery, selectedCategory]); // Update searchResults whenever searchQuery or selectedCategory changes
  
  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
    filterProjects(); // Trigger filtering when category changes
  }
  

  useEffect(() => {
    filterProjects();
  }, [searchQuery, projects]);
  const handleResetClick = () => {
    setSearchQuery('');
  };
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
 // Calculate total pages
 const totalPages = Math.ceil(searchResults.length / projectsPerPage);

// Update current projects based on currentPage
const indexOfLastProject = currentPage * projectsPerPage;
const indexOfFirstProject = indexOfLastProject - projectsPerPage;
const currentProjects = searchResults.slice(indexOfFirstProject, indexOfLastProject);

  
  return (
    <>
      <div className={styles.ProjectsCards}>
        <h2><b>Our Projects</b></h2>
        <br />
        <div className="search-bar" style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search for projects..."
        value={searchQuery}
        onChange={handleInputChange}
        style={{
          width: '80%', // Adjusted width to accommodate the reset button
          padding: '10px',
          border: '2px solid #ccc',
          borderRadius: '5px',
          color: 'rgb(27 93 165)',
          fontSize: '20px'
        }}
      />
      {searchQuery && ( // Render reset button only if searchQuery is not empty
        <button
          onClick={handleResetClick}
          style={{
            padding: '8px 10px',
            marginLeft: '10px',
            backgroundColor: 'rgb(27 93 165)',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          x
        </button>
      )}
    </div>
    <div className='container'>
  <select
    value={selectedCategory}
    onChange={handleCategoryChange}
    style={{
      width: '200px',
      height: '40px',
      marginTop: '10px',
      marginRight: '10px',
      padding: '10px',
      border: '2px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      color: 'rgb(27 93 165)',
      marginBottom: '20px'
    }}
  >
    <option value="">Select a category...</option>
    {categories.map(category => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
</div>

        <br />
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
    <div className="row">
    {currentProjects.map((project) => (
        <div key={project._id} className="col-md-4 ">
          <Link to={`/projectdetails/${project._id}`} style={{ textDecoration: 'none' }}>
            <div className={`project py-3 px-2 ${styles.ProjectCard}`}>
              <img
                src={projectImage}
                alt="Project Thumbnail"
              />
              <h3 style={{ color: 'rgb(27 93 165)', fontSize: '1.5em' }} className="h5"><b>{project.projectName}</b></h3>
              <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Category:</strong> {project.category}</p>
              <p style={{ color: 'rgb(27 93 165)', fontSize: '1.2em' }}><strong>Description:</strong> {project.description}</p>
              {withCredentials && intersectedProjects.some(intersected => intersected._id === project._id) && (
  <div style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
    <FontAwesomeIcon icon={faUserPen} size="1x" /> {/* Adjust size as needed */}
    <br />
    My Project
  </div>
)}
          {userToken !== null && (
  <button
    onClick={(event) => {
      event.preventDefault(); // Prevent default behavior
      const like_id = project.like_id; // Assuming project object contains like_id
      if (likedProjects.includes(project._id)) {
        handleUnlikeClick(event, project._id, like_id);
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


{userToken !== null && (
<button
  onClick={(event) => handleWishlistClick(event, project._id)}
  className={`wishlistButton ${wishlist.some((item) => item._id === project._id) ? 'added' : ''}`}
>
  <FontAwesomeIcon icon={wishlist.some((item) => item._id === project._id) ? faBookmarkSolid : faBookmark} /> {wishlist.some((item) => item._id === project._id) ? 'Remove from Wishlist' : 'Add to Wishlist' }
</button>
)}

{wishlist.includes(project._id) && (
  <p style={{ color: 'black' }}>{wishlistMessages[project._id]}</p>
)}
              <button
                onClick={(event) => handleShareClick(event, project)}
                className="shareButton"
              >
                <FontAwesomeIcon icon={faShare} /> Share
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
    <br />
    <nav className="d-flex justify-content-center">
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => setCurrentPage(index + 1)} className="page-link">
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </>
)}
      </div>
      <br />
      {error && <div className="alert alert-danger">{error}</div>}
    </>
  );
};
export default ProjectsCards;