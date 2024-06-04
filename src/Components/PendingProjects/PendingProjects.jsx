import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function PendingProjects() {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/project/AllPendingProjects', { withCredentials: true });
      setPendingProjects(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pending projects:', error);
      setIsLoading(false);
    }
  };

  const handleAcceptProject = async (projectId) => {
    try {
      setIsLoadingAccept(true);
      await axios.post(`https://grad-project-3zvo.onrender.com/app/project/changeProjectStatus/${projectId}`, { status: 'accepted' }, { withCredentials: true });
      fetchPendingProjects();
      toast.success('Project accepted successfully');
    } catch (error) {
      console.error('Error accepting project:', error);
      toast.error('Failed to accept project');
    } finally {
      setIsLoadingAccept(false);
    }
  };

  const handleRejectProject = async (projectId) => {
    try {
      setIsLoadingReject(true);
      await axios.post(`https://grad-project-3zvo.onrender.com/app/project/changeProjectStatus/${projectId}`, { status: 'rejected' }, { withCredentials: true });
      fetchPendingProjects();
      toast.success('Project rejected successfully');
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast.error('Failed to reject project');
    } finally {
      setIsLoadingReject(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toDateString() + ' ' + date.toLocaleTimeString();
    return formattedDate;
  };

  return (
    <div className="container mt-5 mb-5 px-0">
      <h1>Pending Projects</h1>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="ms-2">Loading...</div>
        </div>
      ) : (
        <table className="table table-bordered mt-3 table-striped table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Description</th>
              <th>Owner</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.projectName}</td>
                <td>{project.category}</td>
                <td>{formatDate(project.date)}</td>
                <td>{project.status}</td>
                <td>{project.description}</td>
                <td>{project.owner?.userName}</td>
                <td>
                  <a href={`https://grad-project-3zvo.onrender.com${project.pdf}`} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </td>
                <td>
                  <button
                    className={`btn btn-success me-2 ${isLoadingAccept ? 'disabled' : ''}`}
                    onClick={() => handleAcceptProject(project._id)}
                    disabled={isLoadingAccept}
                  >
                    {isLoadingAccept ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    className={`btn btn-danger ${isLoadingReject ? 'disabled' : ''}`}
                    onClick={() => handleRejectProject(project._id)}
                    disabled={isLoadingReject}
                  >
                    {isLoadingReject ? 'Rejecting...' : 'Reject'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
