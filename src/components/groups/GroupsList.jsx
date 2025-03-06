import React from 'react';
import GroupCard from './GroupCard';

function GroupsList({ groups, isLoading, error, selectedSport, sportTypes }) {
  // בדיקה שהנתונים קיימים
  const safeGroups = Array.isArray(groups) ? groups : [];
  
  // סינון קבוצות לפי סוג ספורט אם נבחר
  const filteredGroups = selectedSport 
    ? safeGroups.filter(group => group && group.sportType === selectedSport)
    : safeGroups;

  if (isLoading) {
    return <div className="loading-message">טוען קבוצות...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (filteredGroups.length === 0) {
    return (
      <div className="empty-groups">
        <div className="empty-icon">🤔</div>
        <h3>אין קבוצות {selectedSport ? `ל${sportTypes.find(s => s.id === selectedSport)?.name || 'ספורט זה'}` : ''} כרגע</h3>
        <p>היה הראשון ליצור קבוצה!</p>
      </div>
    );
  }

  return (
    <div className="groups-list">
      <h2>קבוצות {selectedSport ? sportTypes.find(s => s.id === selectedSport)?.name || 'ספורט נבחר' : 'פעילות'}</h2>
      <div className="groups-grid">
        {filteredGroups.map(group => (
          group && <GroupCard key={group._id} group={group} />
        ))}
      </div>
    </div>
  );
}

export default GroupsList;
