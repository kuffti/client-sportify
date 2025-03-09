import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { getGroups } from '../features/groups/groupsSlice';
import GroupsMap from '../components/groups/GroupsMap';
import SportTypeFilter from '../components/groups/SportTypeFilter';
import { sportTypes } from '../data/sportTypes';

function GroupsMapPage() {
  const dispatch = useDispatch();
  const { groups, isLoading, error } = useSelector(state => state.groups);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchParams] = useSearchParams();
  
  // טעינה ראשונית של הקבוצות
  useEffect(() => {
    dispatch(getGroups(selectedSport));
  }, [dispatch, selectedSport]);
  
  // בדיקה האם יש פרמטר group בURL
  useEffect(() => {
    const groupId = searchParams.get('group');
    if (groupId && groups.length > 0) {
      const group = groups.find(g => g._id === groupId);
      if (group) {
        setSelectedGroup(group);
        // אם יש קבוצה נבחרת, נגדיר גם את סוג הספורט שלה
        setSelectedSport(group.sportType);
      }
    }
  }, [searchParams, groups]);

  const handleSportSelect = (sportType) => {
    setSelectedSport(sportType);
  };

  const filteredGroups = selectedSport 
    ? groups.filter(g => g && g.sportType === selectedSport) 
    : groups;

  return (
    <div className="groups-map-page">
      <div className="container">
        <div className="page-header">
          <h1>מפת קבוצות ספורט</h1>
          <p>צפה בכל הקבוצות על המפה, חשב מרחקים ותכנן הגעה</p>
          
          <Link to="/groups" className="btn-back">
            <span className="btn-icon">←</span>
            חזרה לרשימת הקבוצות
          </Link>
        </div>
        
        <div className="filter-container">
          <h3>סינון לפי סוג ספורט:</h3>
          <SportTypeFilter 
            sportTypes={sportTypes}
            selectedSport={selectedSport}
            onSportSelect={handleSportSelect}
          />
        </div>
        
        <div className="map-stats">
          <div className="stat-box">
            <span className="stat-value">{filteredGroups.length}</span>
            <span className="stat-label">קבוצות בתצוגה</span>
          </div>
          
          {selectedSport && (
            <div className="stat-box">
              <span className="stat-value">
                {sportTypes.find(s => s.id === selectedSport)?.name || selectedSport}
              </span>
              <span className="stat-label">ספורט נבחר</span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>טוען נתוני קבוצות...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <GroupsMap selectedGroup={selectedGroup} />
        )}
        
        <div className="groups-list-mini">
          <h3>קבוצות על המפה</h3>
          <div className="groups-mini-grid">
            {filteredGroups.map(group => (
              <div 
                key={group._id} 
                className={`group-mini-card ${selectedGroup?._id === group._id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                <div className="group-mini-name">{group.name}</div>
                <div className="group-mini-details">
                  <span>{new Date(group.activityDate).toLocaleDateString('he-IL')}</span>
                  <span>{group.activityTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupsMapPage;
