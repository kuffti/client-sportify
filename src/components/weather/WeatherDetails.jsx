import { useSelector } from 'react-redux';

function WeatherDetails() {
  const { currentWeather } = useSelector(state => state.weather);

  if (!currentWeather) return null;

  const getWeatherCondition = (temp, windSpeed) => {
    if (temp > 30) return 'חם מאוד';
    if (temp > 25) return 'חם';
    if (temp > 20) return 'נעים';
    if (temp > 15) return 'קריר';
    return 'קר';
  };

  const weather = currentWeather.current_weather;
  const condition = getWeatherCondition(weather.temperature, weather.windspeed);

  return (
    <div className="weather-details">
      <div className="weather-detail-item">
        <span className="label">טמפרטורה:</span>
        <span className="value">{weather.temperature}°C</span>
        <span className="condition">({condition})</span>
      </div>
      
      <div className="weather-detail-item">
        <span className="label">רוח:</span>
        <span className="value">{weather.windspeed} קמ"ש</span>
        <span className="condition">
          {weather.windspeed > 20 ? '💨 רוח חזקה' : '🌡️ רוח מתונה'}
        </span>
      </div>

      <div className="weather-alert">
        {weather.temperature > 30 && (
          <p className="alert hot">⚠️ מומלץ להצטייד בהרבה מים ולהימנע מפעילות בשעות החמות</p>
        )}
        {weather.windspeed > 25 && (
          <p className="alert windy">⚠️ תנאי רוח חזקים - יש לנקוט משנה זהירות</p>
        )}
      </div>
    </div>
  );
}

export default WeatherDetails;
