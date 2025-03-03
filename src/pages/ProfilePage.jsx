import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../features/auth/authSlice';
import '../styles/profile.css';

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    // אם אין משתמש מחובר, חזור לדף הבית
    if (!user) {
      navigate('/login');
      return;
    }
    
    // אתחל את הטופס עם נתוני המשתמש הנוכחיים
    setProfileData({
      name: user.name || '',
      email: user.email || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // נקה שגיאות בעת הקלדה
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!profileData.name.trim()) {
        setError('שם הוא שדה חובה');
        return;
      }
      
      await dispatch(updateProfile(profileData)).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('שגיאה בעדכון פרופיל:', err);
      setError(typeof err === 'string' ? err : 'אירעה שגיאה בעדכון הפרופיל');
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <h1 className="profile-title">הפרופיל שלי</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.isAdmin && <span className="admin-badge">מנהל מערכת</span>}
          </div>
        </div>
        
        {error && <div className="error-message" role="alert">{error}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>שם</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>אימייל</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                readOnly // אין אפשרות לשנות אימייל
              />
            </div>
            
            <div className="profile-actions">
              <button 
                type="submit" 
                className="btn-save"
                disabled={isLoading}
              >
                {isLoading ? 'שומר...' : 'שמור שינויים'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  // החזר את הערכים המקוריים
                  setProfileData({
                    name: user.name || '',
                    email: user.email || ''
                  });
                }}
                disabled={isLoading}
              >
                ביטול
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-edit"
            >
              ערוך פרופיל
            </button>
          </div>
        )}
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">פוסטים</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">לייקים</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">תגובות</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
