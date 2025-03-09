import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommunityPage from './pages/CommunityPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/layout/Toast';
import Loader from './components/layout/Loader';
import WeatherPage from './pages/WeatherPage';
import TipsPage from './pages/TipsPage';
import ProfilePage from './pages/ProfilePage';
import CalculatorsPage from './pages/CalculatorsPage';
import GroupsPage from './pages/GroupsPage';
import GroupsMapPage from './pages/GroupsMapPage'; // ייבוא דף המפה החדש
import './styles/weather.css';
import './styles/groupsMap.css'; // ייבוא סגנון המפה החדש

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
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/map" element={<GroupsMapPage />} /> {/* נתיב למפת הקבוצות */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Toast />
        {isLoading && <Loader />}
      </div>
    </Router>
  );
}

export default App;
