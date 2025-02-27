import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <h1>404</h1>
        <h2>דף לא נמצא</h2>
        <p>
          הדף שחיפשת לא נמצא. ייתכן שהכתובת שהקלדת שגויה או שהדף הוסר.
        </p>
        <Link to="/" className="btn btn-primary">
          חזרה לדף הבית
        </Link>
      </div>
      
      <div className="debug-info">
        <h3>מידע לדיבאג:</h3>
        <p>URL: {window.location.href}</p>
        <p>User Agent: {navigator.userAgent}</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default NotFoundPage;
