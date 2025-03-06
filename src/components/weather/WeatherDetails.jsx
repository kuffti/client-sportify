import { useSelector } from 'react-redux';

function WeatherDetails() {
  const { currentWeather } = useSelector(state => state.weather);

  // בדיקה שיש לנו נתונים תקינים לפני הגישה אליהם
  if (!currentWeather || !currentWeather.temperature) {
    return <div className="weather-loading">ממתין לנתוני מזג אוויר...</div>;
  }

  const getWeatherCondition = (temp, windSpeed) => {
    if (temp > 30) return 'חם מאוד';
    if (temp > 25) return 'חם';
    if (temp > 20) return 'נעים';
    if (temp > 15) return 'קריר';
    return 'קר';
  };

  // בדיקה נוספת לפני השימוש בנתונים
  const temp = currentWeather.temperature;
  const windSpeed = currentWeather.windspeed || 0;
  const condition = getWeatherCondition(temp, windSpeed);

  return (
    <div className="weather-details">
      <div className="weather-detail-item">
        <span className="label">טמפרטורה:</span>
        <span className="value">{temp}°C</span>
        <span className="condition">({condition})</span>
      </div>
      
      <div className="weather-detail-item">
        <span className="label">רוח:</span>
        <span className="value">{windSpeed} קמ"ש</span>
        <span className="condition">
          {windSpeed > 20 ? '💨 רוח חזקה' : '🌡️ רוח מתונה'}
        </span>
      </div>

      <div className="weather-alert">
        {temp > 30 && (
          <p className="alert hot">⚠️ מומלץ להצטייד בהרבה מים ולהימנע מפעילות בשעות החמות</p>
        )}
        {windSpeed > 25 && (
          <p className="alert windy">⚠️ תנאי רוח חזקים - יש לנקוט משנה זהירות</p>
        )}
      </div>
    </div>
  );
}

export default WeatherDetails;
