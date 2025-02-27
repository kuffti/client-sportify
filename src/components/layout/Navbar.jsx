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
          {user ? (
            <>
              <Link to="/community" className="nav-link">קהילה</Link>
              <div className="user-profile">
                {user.isAdmin && <span className="admin-badge">מנהל</span>}
                <span className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </span>
                <span className="user-name">{user.name || 'משתמש'}</span>
              </div>
              <button 
                onClick={() => dispatch(logout())} 
                className="nav-link logout-btn"
              >
                התנתק
              </button>
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
