import React from 'react';

function SportTypeFilter({ sportTypes, selectedSport, onSportSelect }) {
  return (
    <div className="sport-type-filter">
      <h2>בחר סוג ספורט</h2>
      <div className="sport-type-grid">
        {sportTypes.map((sport) => (
          <div
            key={sport.id}
            className={`sport-type-card ${selectedSport === sport.id ? 'active' : ''}`}
            onClick={() => onSportSelect(sport.id)}
          >
            <div className="sport-icon">{sport.icon}</div>
            <div className="sport-name">{sport.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SportTypeFilter;
