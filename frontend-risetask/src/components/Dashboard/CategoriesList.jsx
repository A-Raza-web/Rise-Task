// CategoriesList.js
import React from 'react';
import { FaTasks } from "react-icons/fa";

const CategoriesList = ({ categories }) => {
  const orange = { color: "#fd7e14" };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header">
        <h5><FaTasks className="me-2" style={orange} /> Categories</h5>
      </div>
      <div className="card-body">
        {categories && categories.length > 0 ? (
          <ul className="list-group">
            {categories.map((cat, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {cat.name}
                <span className="badge bg-primary rounded-pill">{cat.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;