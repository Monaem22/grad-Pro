// UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import Style from './UserProfile.module.css';
import ChatMessages from '../ChatMessages/ChatMessages';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false); // State to manage sending message loading

  const params = useParams();

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://grad-project-3zvo.onrender.com/app/user/getUser/${params.id}`, {
        withCredentials: true
      });
      setUserData(response.data.user_data);
      setUserProjects(response.data.user_Projects);
    } catch (error) {
      toast.error('Error fetching profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const response = await axios.post(
        'https://grad-project-3zvo.onrender.com/app/user/chating',
        { receiverID: params.id },
        { withCredentials: true }
      );
      if (response.data.existChat) {
        setChatMessages(response.data.existChat.AllMessages);
        setShowChatModal(true);
      } else {
        setChatMessages([]);
      }
    } catch (error) {
      toast.error('Error starting chat');
    }
  };

  const sendMessage = async () => {
    setIsSendingMessage(true); // Set loading state while sending message
    try {
      const response = await axios.post(
        'https://grad-project-3zvo.onrender.com/app/user/sendMessagePrivte',
        {
          receiverID: params.id,
          intendedMessage: messageInput
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success('Message sent successfully');
        // Update the chat messages with the new message
        setChatMessages(prevMessages => [...prevMessages, response.data.message]);
        // Clear the message input
        setMessageInput('');
        // Close the modal
        setShowChatModal(false); // Close the modal after sending message
      }
    } catch (error) {
      toast.error('Error sending message');
    } finally {
      setIsSendingMessage(false); // Reset loading state after sending message
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className='container mt-5 mb-5'>
      {isLoading ? (
        <div className='text-center'>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              {userData && (
                <div className="mb-5 border p-4 shadow bg-light rounded text-center position-relative">
                  <h2 className="mb-4" style={{ color: 'rgb(27, 93, 165)' }}>User Information</h2>
                  {userData.role === 'admin' && (
                    <span className="ml-1 text-danger"><b>Admin</b></span>
                  )}
                  <br />

                  <div className="row mb-4">
                    <div className="col-md-12">
                      <img
                        src={`https://grad-project-3zvo.onrender.com${userData.image}`}
                        alt="Profile"
                        className="img-fluid rounded-circle mb-3"
                        style={{ width: '200px', height: '200px', border: '2px solid black', objectFit: 'cover', marginRight: '10px' }}
                      />
                      <div>
                        <p className="mb-2 fs-5">
                          <strong>Username:</strong> {userData.userName}
                        </p>
                        <p className="mb-3 fs-5">
                          <strong>Bio:</strong> {userData.bio}
                        </p>
                        <p className="mb-4 fs-5">
                          <strong>Email:</strong> {userData.email}
                        </p>
                        <button
                          onClick={handleStartChat}
                          className="btn btn-primary btn-sm px-4 py-2 text-uppercase fw-bold rounded-pill"
                          style={{ fontSize: '0.9rem', letterSpacing: '1px', backgroundColor: 'rgb(27, 93, 165)' }}
                          data-bs-toggle="modal"
                          data-bs-target="#chatModal"
                        >
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="modal fade" id="chatModal" tabIndex="-1" aria-labelledby="chatModalLabel" aria-hidden="true" style={{ display: showChatModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="chatModalLabel">Chat Modal</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      {showChatModal && (
                        <>
                          <ChatMessages messages={chatMessages} />
                          <div className="mt-3">
                            <textarea
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              className="form-control"
                              rows="3"
                              placeholder="Type your message here..."
                            ></textarea>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button
                          onClick={sendMessage}
                          className="btn btn-primary"
                          disabled={!messageInput.trim() || isSendingMessage} // Disable button if messageInput is empty, contains only whitespace, or while sending message
                          data-bs-dismiss="modal" // Add this attribute to close the modal automatically
                        >
                          {isSendingMessage ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <h2 className="mb-4 text-center" style={{ color: 'rgb(27, 93, 165)' }}>User Projects</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {userProjects.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
                  No projects added yet
                </div>
              )}
              {userProjects.map(project => (
                <div key={project._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease-in-out' }}>
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '1.5rem', color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                      <Link
                        to={`/projectdetails/${project._id}`}
                        style={{ textDecoration: 'none', color: 'rgb(27, 93, 165)' }}
                      >
                        {project.projectName}
                      </Link>
                    </h4>
                    <p style={{ margin: '15px 0', color: '#666', fontSize: '1.1rem' }}>
                      <strong>Description:</strong> {project.description}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '1.1rem' }}>
                      <strong>Category:</strong> {project.category}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link
                      to={`/projectdetails/${project._id}`}
                      style={{ textDecoration: 'none', color: 'rgb(27, 93, 165)', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
