import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/auth.css';

function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>הצטרף לקהילה</h2>
          <p>צור חשבון חדש והתחל את המסע שלך</p>
        </div>
        <RegisterForm />
        <div className="auth-links">
          <p>
            כבר יש לך חשבון?{' '}
            <Link to="/login">התחבר כאן</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
