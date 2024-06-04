import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SysActionsComponent = () => {
  const [sysActions, setSysActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sysActionsPerPage] = useState(20);
  const [pageRange, setPageRange] = useState(5); // Number of page numbers to display

  const fetchSysActions = async () => {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/sysActions/showAllSysActions', { withCredentials: true });
      setSysActions(response.data.AllSysActions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sysActions:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSysActions();
  }, []);

  // Calculate current sysActions to display based on pagination
  const indexOfLastSysAction = currentPage * sysActionsPerPage;
  const indexOfFirstSysAction = indexOfLastSysAction - sysActionsPerPage;
  const currentSysActions = sysActions.slice(indexOfFirstSysAction, indexOfLastSysAction).reverse(); // Reverse the order here

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Calculate page numbers to display
  const totalPageCount = Math.ceil(sysActions.length / sysActionsPerPage);
  const maxPage = Math.min(currentPage + Math.floor(pageRange / 2), totalPageCount);
  const minPage = Math.max(1, maxPage - pageRange + 1);
  const pageNumbers = Array.from({ length: maxPage - minPage + 1 }, (_, i) => minPage + i);

  return (
    <div className="container mt-5 mb-5 px-0">
      <div className="eight">
        <h2 className="mt-5 mb-4 text-center text-dark fw-bold ">All System Actions</h2>
      </div>
      <div className="table-responsive mt-5 mb-5 px-0">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="ms-2">Loading...</div>
          </div>
        ) : (
          <React.Fragment>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentSysActions.map((sysAction, index) => (
                  <tr key={index}>
                    <td>{sysAction.action}</td>
                    <td>{new Date(sysAction.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <ul className="pagination justify-content-center">
              {pageNumbers.map((number, index) => (
                <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button onClick={() => paginate(number)} className="page-link">
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default SysActionsComponent;
