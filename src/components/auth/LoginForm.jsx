import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import './LoginForm.css';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // נקה הודעת שגיאה כשהמשתמש מתחיל להקליד מחדש
    if (error) setError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result) {
        // ניווט רק אם ההתחברות הצליחה
        navigate('/community');
      }
    } catch (err) {
      console.error('שגיאת התחברות:', err);
      
      // טיפול ממוקד בשגיאות ספציפיות
      if (typeof err === 'string' && err.includes('אימייל או סיסמה שגויים')) {
        setError('פרטי ההתחברות שהזנת שגויים, אנא נסה שוב');
      } else if (err.message && err.message.includes('Network Error')) {
        setError('בעיית תקשורת עם השרת, אנא נסה שוב מאוחר יותר');
      } else {
        setError('אחד או יותר מהפרטים שהזנת שגויים, אנא בדוק ונסה שוב');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('אנא הזן כתובת אימייל');
      return false;
    }
    
    if (!formData.password.trim()) {
      setError('אנא הזן סיסמה');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('אנא הזן כתובת אימייל תקינה');
      return false;
    }
    
    return true;
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>התחברות</h2>
        
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">אימייל:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="הזן את כתובת האימייל שלך"
            autoComplete="email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">סיסמה:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="הזן את הסיסמה שלך"
            autoComplete="current-password"
          />
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </button>
        
        <div className="register-option">
          <p className="login-help">
            עוד לא רשום? <Link to="/register">הירשם עכשיו</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
