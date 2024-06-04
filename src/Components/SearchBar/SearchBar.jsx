import React, { useState } from "react";
import { MDBBtn, MDBContainer, MDBInput } from "mdb-react-ui-kit";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default category

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearch = () => {
    // Implement your search logic here using the 'searchTerm' and 'selectedCategory' states
    console.log("Searching for:", searchTerm, " in category:", selectedCategory);
  };

  const containerStyle = {
    padding: "5rem 0", // Adjust the padding as needed
    /* Add other container styles here */
  };

  const inputStyle = {
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
  };

  const btnStyle = {
    backgroundColor: "#1e4589",
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
    color: "white",
    transition: "background-color 0.3s ease-in-out",
  };

  return (
    <MDBContainer style={containerStyle}>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          style={inputStyle}
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleInputChange}
        />

        {/* Category Dropdown */}
        <select
          className="form-select"
          style={{ marginLeft: "10px", width: "150px",fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">All</option>
          <option value="Category1">Category 1</option>
          <option value="Category2">Category 2</option>
          {/* Add more categories as needed */}
        </select>

        <button
          className="btn btn-outline-secondary"
          style={btnStyle}
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </MDBContainer>
  );
}
