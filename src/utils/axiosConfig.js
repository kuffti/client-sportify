import axios from 'axios';

// יצירת מופע של אקסיוס עם קונפיגורציה בסיסית
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// מידלוור לבקשות יוצאות - מוסיף טוקן אוטומטית
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    console.error('שגיאה בהגדרת הבקשה:', error);
    return Promise.reject(error);
  }
);

// מידלוור לתשובות - טיפול בשגיאות
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // לוגים מפורטים לדיבוג
    if (error.response) {
      console.error(`שגיאת API: ${error.config.method.toUpperCase()} ${error.config.url}`, {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('שגיאה - לא התקבלה תשובה מהשרת:', error.request);
    } else {
      console.error('שגיאה בהגדרת הבקשה:', error.message);
    }
    
    // חשוב: החזרת דחייה כדי שהטיפול בשגיאה ימשיך במקרא
    return Promise.reject(error);
  }
);

export default api;
