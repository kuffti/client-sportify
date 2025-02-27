import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/HomePage.css';

function HomePage() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>ברוכים הבאים ל-Sportify</h1>
          <p className="hero-subtitle">
            המקום המושלם לספורטאים שרוצים להישאר מעודכנים ומחוברים
          </p>
          {!user ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">התחל עכשיו</Link>
              <Link to="/login" className="btn btn-secondary">התחברות</Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/weather" className="btn btn-primary">בדוק את מזג האוויר</Link>
              <Link to="/community" className="btn btn-secondary">הצטרף לקהילה</Link>
            </div>
          )}
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-icon">🏃‍♂️</div>
          <div className="decoration-icon">🌤️</div>
          <div className="decoration-icon">💪</div>
        </div>
      </section>

      <section className="features">
        <h2>למה Sportify?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🌡️</span>
            <h3>תחזית מותאמת אישית</h3>
            <p>קבל המלצות מדויקות לפעילות ספורטיבית על פי מזג האוויר</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👥</span>
            <h3>קהילה תומכת</h3>
            <p>הצטרף לקהילת ספורטאים פעילה ותומכת</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>ממשק ידידותי</h3>
            <p>גישה קלה ונוחה לכל המידע הדרוש לך</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
