import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // סגירת התפריט בלחיצה מחוץ לאלמנט
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);

  const handleLogout = () => {
    setShowProfileMenu(false);  // סגירת התפריט בעת התנתקות
    dispatch(logout());
  };
  
  // פונקציה ליצירת אווטאר מהאות הראשונה של שם המשתמש
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  // פונקציה להחזרת צבע רקע רנדומלי לאווטר לפי שם המשתמש
  const getAvatarColor = () => {
    if (!user?.name) return '#4CAF50'; // ברירת מחדל - צבע ראשי
    
    // רשימת צבעים לאווטרים
    const colors = [
      '#4CAF50', // ירוק
      '#2196F3', // כחול
      '#FF5722', // כתום
      '#9C27B0', // סגול
      '#E91E63', // ורוד
      '#FF9800', // כתום בהיר
      '#795548', // חום
      '#607D8B'  // אפור-כחול
    ];
    
    // חישוב אינדקס צבע לפי שם המשתמש
    const index = user.name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏃</span>
          <span className="logo-text">Sportify</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">דף הבית</Link>
          <Link to="/groups" className="nav-link">קבוצות ספורט</Link>
          <Link to="/weather" className="nav-link">מזג אוויר</Link>
          <Link to="/tips" className="nav-link">טיפים והמלצות</Link>
          <Link to="/calculators" className="nav-link">מחשבונים</Link>
          
          {user ? (
            <>
              <Link to="/community" className="nav-link">קהילה</Link>
              <div className="user-profile-container" ref={profileMenuRef}>
                <button 
                  className="profile-button" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ backgroundColor: getAvatarColor() }}
                >
                  <span className="user-avatar-text">
                    {getUserInitial()}
                  </span>
                  {user.isAdmin && <span className="admin-indicator"></span>}
                </button>
                
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <div className="profile-avatar" style={{ backgroundColor: getAvatarColor() }}>
                        {getUserInitial()}
                      </div>
                      <div className="profile-info">
                        <div className="profile-name">{user.name}</div>
                        <div className="profile-email">{user.email}</div>
                        {user.isAdmin && <div className="admin-badge">מנהל מערכת</div>}
                      </div>
                    </div>
                    
                    <div className="profile-menu-items">
                      <Link to="/profile" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                        <span className="menu-icon">👤</span>
                        הפרופיל שלי
                      </Link>
                      <hr className="menu-divider" />
                      <button 
                        onClick={handleLogout} 
                        className="profile-menu-item logout-btn"
                      >
                        <span className="menu-icon">🚪</span>
                        התנתק
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">התחברות</Link>
              <Link to="/register" className="nav-link btn-register">הרשמה</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
