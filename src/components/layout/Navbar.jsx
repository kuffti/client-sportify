import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏃</span>
          <span className="logo-text">Sportify</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">דף הבית</Link>
          <Link to="/weather" className="nav-link">מזג אוויר</Link>
          <Link to="/tips" className="nav-link">טיפים והמלצות</Link>
          <Link to="/calculators" className="nav-link">מחשבונים</Link>
          
          {user ? (
            <>
              <Link to="/community" className="nav-link">קהילה</Link>
              <div className="user-menu">
                <div className="user-profile">
                  {user.isAdmin && <span className="admin-badge">מנהל</span>}
                  <Link to="/profile" className="profile-link">
                    <span className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                    <span className="user-name">{user.name || 'משתמש'}</span>
                  </Link>
                </div>
                <button 
                  onClick={() => dispatch(logout())} 
                  className="nav-link logout-btn"
                >
                  התנתק
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">התחברות</Link>
              {/* אנו מציגים רק לינק אחד להרשמה בנאבבר */}
              <Link to="/register" className="nav-link btn-register">הרשמה</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
