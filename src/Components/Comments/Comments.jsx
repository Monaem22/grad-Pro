import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaTrash, FaEdit, FaCalendarAlt } from 'react-icons/fa'; // Importing Font Awesome icons
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function ProjectDetails() {
  const { id } = useParams();
  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showComments, setShowComments] = useState(false); // State to track whether comments should be displayed
  const [selectedCommentId, setSelectedCommentId] = useState(null); // State to store the selected comment ID
  const [editedComment, setEditedComment] = useState(''); // State to store the edited comment content
  const [ownerImages, setOwnerImages] = useState({}); // State to store comment owner images
  const userId = localStorage.getItem('userId'); // Get user ID from local storage
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
 
  const fetchProjectDetails = async () => {
    try {
      const { data } = await axios.get(`https://grad-project-3zvo.onrender.com/app/project/getSpacificProject/${id}`, {
        withCredentials: true,
      });

      // Extract comment owner images
      const images = {};
      data.data.comments.forEach(comment => {
        if (comment.commentOwner && comment.commentOwner.image) {
          const commentOwnerImageIdWithExtension = comment.commentOwner && comment.commentOwner.image;
          images[comment.commentOwner._id] = `https://grad-project-3zvo.onrender.com${commentOwnerImageIdWithExtension}`;
        }
      });

      setOwnerImages(images);
      setProjectDetails(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error('Error fetching project details:', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`https://grad-project-3zvo.onrender.com/app/projectInteractions/deleteMyComment/${projectDetails._id}`, {
        data: { comment_Id: commentId }, // Pass the commentId as 'comment_Id' in the request body
        withCredentials: true,
      });

      // Display a success toast message
      toast.success('Comment deleted successfully');

      fetchProjectDetails();
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Display an error toast message if deletion fails
      toast.error('Error deleting comment');
    }
  };
  const deleteCommentAdmin = async (commentId) => {
    try {
      if (!isAdminLoggedIn()) {
        toast.error('You do not have permission to delete comments as an admin.');
        return;
      }
  
      await axios.delete(`https://grad-project-3zvo.onrender.com/app/projectInteractions/deleteOneComment/${projectDetails._id}`, {
        data: { comment_Id: commentId }, // Pass the commentId as 'comment_Id' in the request body
        withCredentials: true,
      });
  
      // Display a success toast message
      toast.success('Comment deleted successfully');
  
      fetchProjectDetails();
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Display an error toast message if deletion fails
      toast.error('Error deleting comment');
    }
  };
    const editComment = async (commentId) => {
    try {
      const editedContent = prompt('Enter your edited comment:');
      if (editedContent !== null) {
        await axios.patch(`https://grad-project-3zvo.onrender.com/app/projectInteractions/updateMyComment/${projectDetails._id}`, {
          comment_Id: commentId,
          newContent: editedContent,
        }, {
          withCredentials: true,
        });
        toast.success('Comment edited successfully');
        fetchProjectDetails();
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error('Error editing comment');
    }
  };

  return (
    <div className="container my-5">
      {isLoading ? (
        <p>Loading project details...</p>
      ) : isError ? (
        <p>Error fetching project details.</p>
      ) : (
        <div className="col-md-4">
          <h4>
            <a href="#comments" onClick={(e) => { e.preventDefault(); setShowComments(!showComments); }} style={styles.link}>
              {showComments ? <FaEyeSlash style={styles.icon} /> : <FaEye style={styles.icon} />}
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </a>
          </h4>
          {showComments && projectDetails.comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : showComments ? (
            <div className="comment-section" id="comments" style={styles.commentSection}>
              {projectDetails.comments.map((comment, index) => (
                <div key={comment._id} className="comment-box mb-3 p-3" style={styles.commentBox}>
                  <div style={styles.userIcon}>
                    {ownerImages[comment.commentOwner?._id] ? (
                      <a href={`/projectdetails/${id}/UserProfile/${comment.commentOwner?._id}`}>
                        <img 
                          src={ownerImages[comment.commentOwner._id]} 
                          alt="User" 
                          style={{ 
                            width: '75px', 
                            height: '75px', 
                            borderRadius: '50%', 
                            border: '2px solid black', 
                            objectFit: 'cover', 
                            marginRight: '10px' 
                          }} 
                        />
                      </a>
                    ) : (
                      <a href={`/projectdetails/${id}/UserProfile/${comment.commentOwner?._id}`}>
                        <img alt = 'User' src="/default-user-image.jpg" style={{ width: '75px', height: '75px', borderRadius: '50%', border: '2px solid black', objectFit: 'cover',  marginRight: '10px' }} />
                      </a>
                    )}
                  </div>
                  <p style={styles.commentContent}>
                    <strong>
                      <a href={`/projectdetails/${id}/UserProfile/${comment.commentOwner?._id}`} style={{ color: 'inherit',textDecoration: 'none' }}>
                        {comment.commentOwner?.userName}
                      </a>
                    </strong>: {comment.content}
                  </p>
                  <p style={{ color: 'rgb(27 93 165)' }}>
                    <strong>
                      <FaCalendarAlt style={{ color: 'rgb(27 93 165)' }} />
                    </strong>{" "}
                    {new Date(comment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',  hour: "numeric", minute: "numeric" })}
                  </p>
                  {comment.commentOwner && comment.commentOwner._id === userId && (
                    <div style={styles.actions}>
                      <a href="#" style={styles.link} onClick={() => editComment(comment._id)}>
                        <FaEdit style={styles.icon} />
                        Edit
                      </a>
                      <span style={styles.separator}> | </span>
                      <a href="#" style={styles.link} onClick={() => deleteComment(comment._id)}>
                        <FaTrash style={styles.icon} />
                        Delete
                      </a>
                    </div>
                  )}
                  {isAdminLoggedIn() && comment.commentOwner && comment.commentOwner._id !== userId &&  (
                    <div style={styles.actions}>
                      <a href="#" style={styles.link} onClick={() => deleteCommentAdmin(comment._id)}>
                        <FaTrash style={styles.icon} />
                        Delete
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

const styles = {
  link: {
    textDecoration: 'none',
    color: 'rgb(27 93 165)',
    fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: '5px',
  },
  separator: {
    margin: '0 5px',
  },
  commentSection: {
    marginTop: '20px',
    fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  commentBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  userIcon: {
    marginRight: '10px',
  },
  actions: {
    display: 'flex',
    marginTop: '5px',
  },
  commentContent: {
    marginBottom: '5px',
  },
};
