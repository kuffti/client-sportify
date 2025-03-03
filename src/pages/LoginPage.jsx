import LoginForm from '../components/auth/LoginForm';
import '../styles/auth.css';

function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm />
      {/* הסרנו את האפשרות החוזרת להרשמה שהייתה כאן */}
    </div>
  );
}

export default LoginPage;
