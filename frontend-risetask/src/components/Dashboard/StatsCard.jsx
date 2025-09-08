// StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="col-md-3 mb-3">
      <div className={`card text-white bg-${color} shadow-sm border-0`}>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="card-title">{title}</h6>
              <h3>{value}</h3>
            </div>
            <div className="align-self-center">
              <Icon className="fa-2x opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;