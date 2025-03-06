import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWeather, 
  fetchAirQuality, 
  fetchPopularRoutes,
  setLocation
} from '../features/weather/weatherSlice';
import WeatherMap from '../components/weather/WeatherMap';
import WeatherDetails from '../components/weather/WeatherDetails';
import SportRecommendation from '../components/weather/SportRecommendation';
import WeeklyForecast from '../components/weather/WeeklyForecast';
import AirQualityInfo from '../components/weather/AirQualityInfo';
import PopularRoutes from '../components/weather/PopularRoutes';
import { Tabs, Tab } from '../components/ui/Tabs';

function WeatherPage() {
  const dispatch = useDispatch();
  const {
    currentWeather, 
    weeklyForecast,
    airQuality,
    popularRoutes,
    location, 
    isLoading, 
    error
  } = useSelector(state => state.weather);
  
  // מצב מקומי לידיעה אם לחצנו על המפה לפחות פעם אחת
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);

  // אם אין לנו מיקום, נגדיר מיקום ברירת מחדל
  useEffect(() => {
    if (!location) {
      // מיקום ברירת מחדל - ירושלים
      const defaultLocation = { latitude: 31.7683, longitude: 35.2137 };
      dispatch(setLocation(defaultLocation));
      
      // נתחיל את הטעינה הראשונית עם מיקום ברירת מחדל
      dispatch(fetchWeather(defaultLocation));
      dispatch(fetchAirQuality(defaultLocation));
      dispatch(fetchPopularRoutes(defaultLocation));
    }
  }, [dispatch, location]);

  // כשהמיקום משתנה, נטען נתונים חדשים
  useEffect(() => {
    if (location) {
      setHasSelectedLocation(true);
      dispatch(fetchWeather(location));
      dispatch(fetchAirQuality(location));
      dispatch(fetchPopularRoutes(location));
    }
  }, [dispatch, location]);

  // פונקציה לבחירת מיקום חדש
  const handleLocationSelect = (newLocation) => {
    dispatch(setLocation(newLocation));
  };

  return (
    <div className="weather-page">
      <div className="container">
        <h1 className="weather-title">מזג אוויר וספורט</h1>
        <p className="weather-description">
          בחר מיקום על המפה לקבלת המלצות ספורט מותאמות למזג האוויר ואיכות האוויר
        </p>
        
        {isLoading && <div className="loading-overlay">טוען נתוני מזג אוויר...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="weather-content">
          <div className="map-container">
            <WeatherMap onLocationSelect={handleLocationSelect} />
          </div>
          
          <div className="weather-sidebar">
            <WeatherDetails />
            {airQuality && <AirQualityInfo airQuality={airQuality} isLoading={isLoading} />}
          </div>
        </div>
        
        {(currentWeather || isLoading) && (
          <div className="weather-tabs-container">
            {isLoading ? (
              <div className="loading-message">טוען נתונים...</div>
            ) : (
              <Tabs defaultTab="recommendations">
                <Tab 
                  id="recommendations" 
                  title="המלצות ספורט" 
                  icon="🏆"
                >
                  <SportRecommendation />
                </Tab>
                
                {weeklyForecast && (
                  <Tab 
                    id="forecast" 
                    title="תחזית שבועית" 
                    icon="📅"
                  >
                    <WeeklyForecast forecast={weeklyForecast} />
                  </Tab>
                )}
                
                {popularRoutes && (
                  <Tab 
                    id="routes" 
                    title="מסלולים פופולריים" 
                    icon="🗺️"
                  >
                    <PopularRoutes 
                      routes={popularRoutes.routes} 
                      heatmapPoints={popularRoutes.points} 
                    />
                  </Tab>
                )}
              </Tabs>
            )}
          </div>
        )}
        
        {!hasSelectedLocation && !isLoading && (
          <div className="choose-location-message">
            <p>בחר מיקום על המפה כדי לצפות בפרטי מזג האוויר והמלצות ספורט</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherPage;
