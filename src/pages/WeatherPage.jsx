import WeatherMap from '../components/weather/WeatherMap';
import WeatherDetails from '../components/weather/WeatherDetails';
import SportRecommendation from '../components/weather/SportRecommendation';
import { useSelector } from 'react-redux';

function WeatherPage() {
  const { currentWeather, isLoading, error } = useSelector(state => state.weather);

  return (
    <div className="weather-page">
      <h1>מזג אוויר וספורט</h1>
      <p className="weather-description">
        בחר מיקום על המפה לקבלת המלצות ספורט מותאמות אישית למזג האוויר
      </p>
      
      {isLoading && <div className="loading-overlay">טוען נתוני מזג אוויר...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="weather-content">
        <div className="map-container">
          <WeatherMap />
        </div>
        <div className="weather-sidebar">
          {currentWeather && (
            <>
              <WeatherDetails />
              <SportRecommendation />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
