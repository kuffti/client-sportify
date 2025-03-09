import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { joinGroup, leaveGroup, deleteGroup } from '../../features/groups/groupsSlice';
import { calculateDistance, estimateTravelTime, getGoogleMapsDirectionsUrl, getWazeDirectionsUrl } from '../../utils/locationUtils';
import { getSportTypeById } from '../../data/sportTypes';

function GroupCard({ group }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showDetails, setShowDetails] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelTimes, setTravelTimes] = useState(null);
  
  // וידוא שהנתונים קיימים לפני הגישה אליהם
  if (!group || !group.participants || !group.creator) {
    return (
      <div className="group-card error">
        <p>שגיאה בטעינת פרטי הקבוצה</p>
      </div>
    );
  }

  // קבלת מיקום המשתמש
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.warn("Error getting user location:", error.message);
        }
      );
    }
  }, []);

  // חישוב מרחקים כאשר יש מיקום משתמש ומיקום קבוצה
  useEffect(() => {
    if (userLocation && group.location?.latitude && group.location?.longitude) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        group.location.latitude,
        group.location.longitude
      );
      
      setDistance(dist);
      
      // חישוב זמני נסיעה עבור אמצעי תחבורה שונים
      setTravelTimes({
        driving: estimateTravelTime(dist, 'driving'),
        walking: estimateTravelTime(dist, 'walking'),
        cycling: estimateTravelTime(dist, 'cycling')
      });
    }
  }, [userLocation, group.location]);

  // האם המשתמש הנוכחי הוא חלק מהקבוצה
  const isParticipant = user && group.participants.some(
    participant => participant && user && participant._id === user._id
  );
  
  // האם המשתמש הנוכחי הוא יוצר הקבוצה
  const isCreator = user && group.creator && user._id === group.creator._id;
  
  // האם הקבוצה מלאה
  const isFull = group.participants.length >= group.maxParticipants;
  
  // פורמט לתאריך
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return 'תאריך לא זמין';
    }
  };
  
  const handleJoin = () => {
    if (!user) {
      alert('עליך להתחבר כדי להצטרף לקבוצות');
      return;
    }
    
    dispatch(joinGroup(group._id));
  };
  
  const handleLeave = () => {
    dispatch(leaveGroup(group._id));
  };
  
  const handleDelete = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הקבוצה?')) {
      dispatch(deleteGroup(group._id));
    }
  };

  // קבלת מידע מורחב על סוג הספורט
  const sportTypeInfo = getSportTypeById(group.sportType);

  return (
    <div className="group-card">
      <div className="group-header">
        <h3>{group.name || 'קבוצה ללא שם'}</h3>
        <div className="group-type" style={{ background: sportTypeInfo.color }}>
          {sportTypeInfo.icon} {sportTypeInfo.name}
        </div>
      </div>
      
      <div className="group-info">
        <div className="info-item">
          <span className="info-icon">📅</span>
          <span>{group.activityDate ? formatDate(group.activityDate) : 'תאריך לא נקבע'}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🕒</span>
          <span>{group.activityTime || 'שעה לא נקבעה'}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">👥</span>
          <span>{group.participants.length}/{group.maxParticipants || 10} משתתפים</span>
        </div>
        <div className="info-item">
          <span className="info-icon">👤</span>
          <span>יוצר: {group.creator?.name || 'לא ידוע'}</span>
        </div>
        
        {/* הצגת מרחק אם קיים */}
        {distance !== null && (
          <div className="info-item distance-info">
            <span className="info-icon">📍</span>
            <span>מרחק: {distance.toFixed(1)} ק"מ</span>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="group-details">
          {group.description && (
            <div className="group-description">
              <h4>על הקבוצה</h4>
              <p>{group.description}</p>
            </div>
          )}
          
          {group.location && (
            <>
              <div className="group-location">
                <h4>מיקום</h4>
                <div className="location-mini-map">
                  <iframe 
                    title={`מיקום קבוצת ${group.name}`}
                    width="100%" 
                    height="150" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={`https://maps.google.com/maps?q=${group.location.latitude},${group.location.longitude}&z=15&output=embed`} 
                  />
                </div>
              </div>
              
              {/* הוספת אפשרויות ניווט */}
              {userLocation && (
                <div className="navigation-options">
                  <h4>הגעה למקום</h4>
                  {travelTimes && (
                    <div className="travel-times">
                      <div className="travel-time-item">
                        <span className="travel-icon">🚗</span>
                        <span>נסיעה: {travelTimes.driving} דקות</span>
                      </div>
                      <div className="travel-time-item">
                        <span className="travel-icon">🚶‍♂️</span>
                        <span>הליכה: {travelTimes.walking} דקות</span>
                      </div>
                      <div className="travel-time-item">
                        <span className="travel-icon">🚴‍♂️</span>
                        <span>אופניים: {travelTimes.cycling} דקות</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="navigation-buttons">
                    <a 
                      href={getGoogleMapsDirectionsUrl(group.location, userLocation, 'driving')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-button google-maps"
                    >
                      <span className="nav-icon">🗺️</span>
                      Google Maps
                    </a>
                    <a 
                      href={getWazeDirectionsUrl(group.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-button waze"
                    >
                      <span className="nav-icon">🚗</span>
                      Waze
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="group-participants">
            <h4>משתתפים</h4>
            <div className="participants-list">
              {group.participants.map(participant => (
                participant && (
                  <div key={participant._id} className="participant">
                    <div className="participant-avatar">
                      {participant.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="participant-name">
                      {participant.name || 'משתתף'}
                      {group.creator && participant._id === group.creator._id && 
                        <span className="creator-badge">יוצר</span>}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="group-actions">
        <button 
          onClick={() => setShowDetails(!showDetails)} 
          className="btn-details"
        >
          {showDetails ? 'הסתר פרטים' : 'הצג פרטים'}
        </button>
        
        {/* הוספת לינק למפת קבוצות */}
        <Link to={`/groups/map?group=${group._id}`} className="btn-view-on-map">
          צפה במפה
        </Link>
        
        {user && (
          isCreator ? (
            <button 
              onClick={handleDelete} 
              className="btn-danger"
            >
              מחק קבוצה
            </button>
          ) : isParticipant ? (
            <button 
              onClick={handleLeave} 
              className="btn-leave"
            >
              עזוב קבוצה
            </button>
          ) : isFull ? (
            <button 
              disabled 
              className="btn-full"
            >
              הקבוצה מלאה
            </button>
          ) : (
            <button 
              onClick={handleJoin} 
              className="btn-join"
            >
              הצטרף לקבוצה
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default GroupCard;
