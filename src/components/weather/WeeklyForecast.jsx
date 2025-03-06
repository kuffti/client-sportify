import React from 'react';

function WeeklyForecast({ forecast }) {
  // וידוא שיש נתונים תקינים
  if (!forecast || !forecast.time || forecast.time.length === 0) {
    return (
      <div className="weekly-forecast">
        <p>לא נמצאו נתוני תחזית שבועית</p>
      </div>
    );
  }

  const getRecommendation = (maxTemp, minTemp, precipitation, wind) => {
    // אלגוריתם המלצות פשוט
    if (maxTemp >= 18 && maxTemp <= 28 && precipitation < 5 && wind < 25) {
      return { text: 'יום מצוין לפעילות', class: 'good' };
    } else if (maxTemp > 28 || (precipitation > 5 && precipitation < 20) || (wind >= 25 && wind < 40)) {
      return { text: 'יום סביר לפעילות', class: 'average' };
    } else {
      return { text: 'לא מומלץ לפעילות', class: 'poor' };
    }
  };
  
  const getWeatherIcon = (maxTemp, precipitation, wind) => {
    if (precipitation > 20) return '🌧️'; // גשום מאוד
    if (precipitation > 5) return '🌦️';  // גשם קל
    if (wind > 30) return '💨';          // רוח חזקה
    if (maxTemp > 30) return '☀️';        // חם מאוד
    if (maxTemp < 15) return '❄️';        // קר
    return '🌤️';                         // נעים
  };

  const getBestTimeForActivity = (maxTemp) => {
    if (maxTemp > 30) return 'בוקר מוקדם או ערב';
    if (maxTemp < 15) return 'שעות הצהריים';
    return 'כל שעות היום נוחות';
  };

  return (
    <div className="weekly-forecast">
      <h3 className="forecast-title">תחזית שבועית והמלצות לפעילות</h3>
      <div className="forecast-grid">
        {forecast.time.map((date, idx) => {
          const maxTemp = forecast.temperature_2m_max[idx];
          const minTemp = forecast.temperature_2m_min[idx];
          const precipitation = forecast.precipitation_sum[idx];
          const wind = forecast.windspeed_10m_max[idx];
          const recommendation = getRecommendation(maxTemp, minTemp, precipitation, wind);
          const formattedDate = new Date(date).toLocaleDateString('he-IL', { weekday: 'long', month: 'numeric', day: 'numeric' });
          const icon = getWeatherIcon(maxTemp, precipitation, wind);
          const bestTime = getBestTimeForActivity(maxTemp);

          return (
            <div className="forecast-day" key={date}>
              <div className="forecast-date">{formattedDate}</div>
              <div className="forecast-icon">{icon}</div>
              <div className="temp-range">
                <span className="max-temp">{maxTemp}°</span>
                <span className="min-temp">{minTemp}°</span>
              </div>
              <div className="forecast-stats">
                <div className="forecast-stat">משקעים: {precipitation} מ"מ</div>
                <div className="forecast-stat">רוח: {wind} קמ"ש</div>
                <div className="forecast-stat">זמן מומלץ: {bestTime}</div>
              </div>
              <div className={`forecast-recommendation ${recommendation.class}`}>
                {recommendation.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyForecast;
