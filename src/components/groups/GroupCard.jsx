import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { joinGroup, leaveGroup, deleteGroup } from '../../features/groups/groupsSlice';

function GroupCard({ group }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showDetails, setShowDetails] = useState(false);
  
  // וידוא שהנתונים קיימים לפני הגישה אליהם
  if (!group || !group.participants || !group.creator) {
    return (
      <div className="group-card error">
        <p>שגיאה בטעינת פרטי הקבוצה</p>
      </div>
    );
  }

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

  return (
    <div className="group-card">
      <div className="group-header">
        <h3>{group.name || 'קבוצה ללא שם'}</h3>
        <div className="group-type">{group.sportType}</div>
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
