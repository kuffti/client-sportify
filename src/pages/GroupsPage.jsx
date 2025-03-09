import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getGroups } from '../features/groups/groupsSlice';
import GroupsList from '../components/groups/GroupsList';
import CreateGroup from '../components/groups/CreateGroup';
import SportTypeFilter from '../components/groups/SportTypeFilter';
import '../styles/groups.css';

const sportTypes = [
  { id: 'running', name: 'ריצה', icon: '🏃‍♂️' },
  { id: 'football', name: 'כדורגל', icon: '⚽' },
  { id: 'basketball', name: 'כדורסל', icon: '🏀' },
  { id: 'tennis', name: 'טניס', icon: '🎾' },
  { id: 'cycling', name: 'רכיבה על אופניים', icon: '🚴‍♂️' },
  { id: 'swimming', name: 'שחייה', icon: '🏊‍♂️' },
  { id: 'volleyball', name: 'כדורעף', icon: '🏐' },
  { id: 'hiking', name: 'הליכה/טיולים', icon: '🥾' },
  { id: 'yoga', name: 'יוגה', icon: '🧘‍♀️' },
  { id: 'other', name: 'אחר', icon: '🏆' }
];

function GroupsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { groups, isLoading, error } = useSelector(state => state.groups);
  const [selectedSport, setSelectedSport] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    dispatch(getGroups(selectedSport));
  }, [dispatch, selectedSport]);

  const handleSportSelect = (sportType) => {
    setSelectedSport(sportType);
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    if (!user) {
      alert('עליך להתחבר כדי ליצור קבוצה');
      return;
    }
    
    // בודק אם נבחר סוג ספורט
    if (!selectedSport) {
      alert('אנא בחר סוג ספורט תחילה');
      return;
    }
    
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  return (
    <div className="groups-page">
      <div className="container">
        <div className="groups-header">
          <h1>קבוצות ספורט</h1>
          <p>מצא קבוצה להצטרף אליה או צור קבוצה חדשה</p>
          
          {/* כפתור חדש למפת הקבוצות */}
          <Link to="/groups/map" className="btn-view-map">
            <span className="map-icon">🗺️</span>
            צפה במפת הקבוצות
          </Link>
        </div>
        
        <SportTypeFilter 
          sportTypes={sportTypes} 
          selectedSport={selectedSport}
          onSportSelect={handleSportSelect}
        />
        
        {selectedSport && !isCreating && (
          <div className="groups-actions">
            <button className="btn btn-primary create-group-btn" onClick={handleCreateClick}>
              <span className="btn-icon">➕</span> צור קבוצת {sportTypes.find(s => s.id === selectedSport)?.name || 'ספורט'} חדשה
            </button>
          </div>
        )}
        
        {isCreating ? (
          <CreateGroup 
            sportType={selectedSport} 
            sportName={sportTypes.find(s => s.id === selectedSport)?.name || ''} 
            onCancel={handleCancelCreate}
          />
        ) : (
          <GroupsList 
            groups={groups} 
            isLoading={isLoading} 
            error={error} 
            selectedSport={selectedSport}
            sportTypes={sportTypes}
          />
        )}
      </div>
    </div>
  );
}

export default GroupsPage;
