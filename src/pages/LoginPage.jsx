import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import '../styles/auth.css';

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>ברוכים השבים!</h2>
          <p>התחבר כדי להמשיך לחוויית Sportify</p>
        </div>
        <LoginForm />
        <div className="auth-links">
          <p>
            אין לך חשבון עדיין?{' '}
            <Link to="/register">הירשם עכשיו</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
