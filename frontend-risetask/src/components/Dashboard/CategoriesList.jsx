// CategoriesList.jsx

import React from 'react';
import * as FaIcons from 'react-icons/fa';
import "./CategoriesList.css";

// The component now receives 'categories' as a prop
const CategoriesList = ({ categories }) => {

    const getIconComponent = (iconName) => {
        const IconComponent = FaIcons[iconName];
        return IconComponent ? <IconComponent /> : <FaIcons.FaQuestionCircle />;
    };

    // We no longer need loading or error states as the parent handles it

    return (
        <div className="card mb-4 shadow-sm border-0">
            <div className="card-header">
                <h5><FaIcons.FaTasks className="me-2 text-orange" /> Categories</h5>
            </div>
            <div className="card-body">
                {categories && categories.length > 0 ? (
                    <div className="categories-grid">
                        {categories.map((cat) => (
                            <div key={cat.name} className="category-box">
                                <div className="category-header">
                                    <span className="category-icon" style={{ color: cat.color }}>
                                        {getIconComponent(cat.icon)}
                                    </span>
                                    <h6 className="category-name">{cat.name}</h6>
                                </div>
                                <div className="category-footer">
                                    <span className="category-count" style={{ color: cat.color }}>
                                        {cat.taskCount}
                                    </span>
                                    <span className="count-label">Tasks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">No categories found</p>
                )}
            </div>
        </div>
    );
};

export default CategoriesList;