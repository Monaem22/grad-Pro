import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Style from './Users.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loadingStates, setLoadingStates] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActions, setUserActions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setGlobalLoading(true);
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/user/getAllUser', { withCredentials: true });
      setUsers(response.data.ALL_users_data);
      setLoadingStates(new Array(response.data.ALL_users_data.length).fill(false));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchUserActions = async (userId) => {
    setGlobalLoading(true);
    try { 
      const response = await axios.get(
        `https://grad-project-3zvo.onrender.com/app/sysActions/showSysActionsOfSpecificUser/${userId}`,
        { withCredentials: true }
      );
      console.log(response.data.allSpecificUserActions);
      setUserActions(response.data.allSpecificUserActions);
      setShowModal(true);
      console.log('showModal set to true:', showModal); // Add this line to check if showModal is true after setting it
    } catch (error) {
      console.error('Error fetching user actions:', error);
    } finally {
      setGlobalLoading(false);
    }
  };
  
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const deleteUser = async (userId, index) => {
    setGlobalLoading(true);
    const updatedLoadingStates = [...loadingStates];
    updatedLoadingStates[index] = true;
    setLoadingStates(updatedLoadingStates);
    try {
      const response = await axios.delete(
        'https://grad-project-3zvo.onrender.com/app/user/deleteUser',
        {
          data: { userId },
          withCredentials: true
        }
      );
      if (response.status === 200 || response.status === 202) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setGlobalLoading(false);
      const updatedLoadingStates = [...loadingStates];
      updatedLoadingStates[index] = false;
      setLoadingStates(updatedLoadingStates);
    }
  };

  const blockOrUnblockUser = async (userId, index, action) => {
    setGlobalLoading(true);
    const updatedLoadingStates = [...loadingStates];
    updatedLoadingStates[index] = true;
    setLoadingStates(updatedLoadingStates);
    try {
      const response = await axios.post(
        action === 'block' ? 'https://grad-project-3zvo.onrender.com/app/user/blockUser' : 'https://grad-project-3zvo.onrender.com/app/user/unblockUser',
        { id: userId },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 202) {
        fetchUsers(); // Refresh user list after blocking/unblocking
      } else {
        console.error(`Failed to ${action} user:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    } finally {
      setGlobalLoading(false);
      const updatedLoadingStates = [...loadingStates];
      updatedLoadingStates[index] = false;
      setLoadingStates(updatedLoadingStates);
    }
  };

  return (
    <div className="container mt-5 mb-5 px-0">
      <div className={`${Style.eight} mt-5`}>
        <h2 className="mb-4 text-center text-dark fw-bold">ALL Users</h2>
      </div>
      <Link className="button-81 mb-4" to="/AddUser">
        Add New User
      </Link>
      <div className="table-responsive mt-5 mb-5 px-0">
        <table className="table table-bordered table-striped table-hover ">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Gmail Account</th>
              <th>Age</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className={Style.hoverableRow}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.Gmail_Acc}</td>
                <td>{user.age}</td>
                <td>{user.role}</td>
                <td>
                  {loadingStates[index] ? (
                    <button type="button" className="btn me-3 mt-2 mb-2 disabled ">
                      <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary me-3"
                        onClick={() => fetchUserActions(user._id)}
                        disabled={globalLoading}
                      >
                        Show Actions
                      </button>
                      {user.isBlocked ? (
                        <button
                          className="btn btn-success me-3"
                          onClick={() => blockOrUnblockUser(user._id, index, 'unblock')}
                          disabled={globalLoading}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning me-3"
                          onClick={() => blockOrUnblockUser(user._id, index, 'block')}
                          disabled={globalLoading}
                        >
                          Block
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUser(user._id, index)}
                        disabled={globalLoading}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal fade show" id="userActionsModal" tabIndex="-1" role="dialog" aria-labelledby="userActionsModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="userActionsModalLabel">User Actions</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <ul>
                  {userActions.map(action => (
                    <li key={action._id}>{action.action}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
