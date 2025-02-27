import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommunityPage from './pages/CommunityPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage'; // נייבא את דף ה-404
import Toast from './components/layout/Toast';
import Loader from './components/layout/Loader';
import WeatherPage from './pages/WeatherPage';
import './styles/weather.css';

// קונפיגורציה להסרת האזהרות
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.ui);

  return (
    <Router {...routerConfig}>
      <div className="app" dir="rtl">
        <Navbar />
        {/* נסיר זמנית את ThemeToggle */}
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="*" element={<NotFoundPage />} /> {/* כל נתיב אחר יוביל לדף 404 */}
          </Routes>
        </main>
        <Toast />
        {isLoading && <Loader />}
      </div>
    </Router>
  );
}

export default App;
