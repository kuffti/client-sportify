import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // וידוא שדות חובה
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setFormError('כל השדות הם חובה');
      return;
    }

    // וידוא אימייל תקין
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('אנא הזן כתובת אימייל תקינה');
      return;
    }

    // וידוא סיסמה
    if (formData.password.length < 6) {
      setFormError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('הסיסמאות אינן תואמות');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      navigate('/community');
    } catch (err) {
      console.error('Registration error:', err);
      // שינוי הטיפול בשגיאה
      setFormError(typeof err === 'string' ? err : err?.message || 'שגיאה בהרשמה');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* שינוי הצגת השגיאות */}
      {error && <div className="error-message">{typeof error === 'string' ? error : error.message}</div>}
      {formError && <div className="error-message">{formError}</div>}
      
      <div className="form-group">
        <label>שם מלא</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>אימייל</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>סיסמה</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label>אימות סיסמה</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <button 
        type="submit" 
        className="auth-btn"
        disabled={isLoading}
      >
        {isLoading ? 'מבצע הרשמה...' : 'הרשמה'}
      </button>
    </form>
  );
}

export default RegisterForm;
