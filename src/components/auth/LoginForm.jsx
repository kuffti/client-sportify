import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/community');
    } catch (err) {
      console.error('שגיאה בהתחברות:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>התחברות</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group"   
      >
        <label>אימייל:</label>
        <input
        style={{color: "black"}}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label>סיסמה:</label>
        <input
          style={{color: "black"}}

          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'מתחבר...' : 'התחבר'}
      </button>
    </form>
  );
}

export default LoginForm;
