import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div className="home-page">
      {/* הירו סקשן עם אנימציה */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-title-container">
            <h1 className="hero-title">
              <span className="title-animation">ספורט.</span>
              <span className="title-animation delay-1">חברים.</span>
              <span className="title-animation delay-2">קהילה.</span>
            </h1>
          </div>
          <p className="hero-subtitle">
            פלטפורמת ספורט חברתית המחברת בין אנשים שאוהבים להיות פעילים יחד
          </p>
          {!user ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                הצטרפו עכשיו
                <span className="btn-icon">👟</span>
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                התחברות
                <span className="btn-icon">🔑</span>
              </Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/groups" className="btn btn-primary btn-large">
                מצא קבוצת ספורט
                <span className="btn-icon">👥</span>
              </Link>
              <Link to="/community" className="btn btn-secondary btn-large">
                הצטרף לשיחה
                <span className="btn-icon">💬</span>
              </Link>
            </div>
          )}
        </div>

        <div className="hero-background">
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>
      </section>
      
      {/* סקשן תכונות מרכזיות */}
      <section className="features-section">
        <h2 className="section-title">הדרך החדשה להישאר פעילים יחד</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>קבוצות ספורט</h3>
            <p>מצאו אנשים עם תחומי עניין דומים והצטרפו לפעילויות ספורט קבוצתיות</p>
            <Link to="/groups" className="feature-link">חיפוש קבוצות <span className="arrow">→</span></Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <p className="feature-label">חדש!</p>
            <h3>מפת פעילויות</h3>
            <p>גלו פעילויות ומסלולים פופולריים באזורכם על גבי המפה האינטראקטיבית</p>
            <Link to="/groups/map" className="feature-link">צפייה במפה <span className="arrow">→</span></Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌤️</div>
            <h3>מזג אוויר ספורט</h3>
            <p>בדקו את התאמת מזג האוויר לפעילות שלכם וקבלו המלצות מותאמות אישית</p>
            <Link to="/weather" className="feature-link">בדיקת תנאי מזג אוויר <span className="arrow">→</span></Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>קהילת ספורט</h3>
            <p>הצטרפו לשיחות עם ספורטאים אחרים, שתפו טיפים וחוויות</p>
            <Link to="/community" className="feature-link">הצטרפות לשיחה <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>
      
      {/* סקשן סטטיסטיקה */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-value count-up">1,500+</div>
          <div className="stat-label">משתמשים פעילים</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value count-up">250+</div> {/* התיקון כאן - הסרת תג סגירה מיותר */}
          <div className="stat-label">קבוצות ספורט</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value count-up">45+</div>
          <div className="stat-label">ערים וישובים</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value count-up">12+</div>
          <div className="stat-label">סוגי ספורט</div>
        </div>
      </section>
      
      {/* סקשן מחשבונים והכלים */}
      <section className="tools-section">
        <h2 className="section-title">כלים לספורטאים</h2>
        <p className="section-subtitle">מחשבונים ומידע שיעזור לכם לעקוב אחר הביצועים ולשפר את הכושר</p>
        
        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-icon">⚖️</div>
            <h3>מחשבון BMI</h3>
            <p>חשבו את מדד מסת הגוף שלכם וקבלו הערכה לגבי משקל גוף תקין</p>
            <Link to="/calculators" className="tool-link">חישוב עכשיו <span className="arrow">→</span></Link>
          </div>
          
          <div className="tool-card">
            <div className="tool-icon">❤️</div>
            <h3>מחשבון דופק</h3>
            <p>חשבו את טווח הדופק האידיאלי לאימון אפקטיבי בהתאם לגיל ומטרות</p>
            <Link to="/calculators" className="tool-link">חישוב עכשיו <span className="arrow">→</span></Link>
          </div>
          
          <div className="tool-card">
            <div className="tool-icon">🔥</div>
            <h3>שריפת קלוריות</h3>
            <p>בדקו כמה קלוריות אתם שורפים בפעילויות ספורט שונות</p>
            <Link to="/calculators" className="tool-link">חישוב עכשיו <span className="arrow">→</span></Link>
          </div>
          
          <div className="tool-card">
            <div className="tool-icon">💡</div>
            <h3>טיפים והמלצות</h3>
            <p>אוסף מידע מקצועי ושימושי מקהילת הספורטאים שלנו</p>
            <Link to="/tips" className="tool-link">צפייה בטיפים <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>
      
      {/* Call-to-action section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>מוכנים להצטרף לקהילת הספורט שלנו?</h2>
          <p>חברו בין אהבת הספורט לחיבור חברתי משמעותי</p>
          {!user ? (
            <Link to="/register" className="btn btn-cta">
              הצטרפו עכשיו
              <span className="btn-pulse"></span>
            </Link>
          ) : (
            <Link to="/groups" className="btn btn-cta">
              מצא קבוצה עכשיו
              <span className="btn-pulse"></span>
            </Link>
          )}
        </div>
        <div className="cta-decor">
          <div className="pulse-circle"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
