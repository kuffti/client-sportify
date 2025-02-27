import { useState } from 'react';
import { useSelector } from 'react-redux';

const sportTypes = {
  running: { 
    name: 'ריצה',
    icon: '🏃‍♂️',
    maxTemp: 25,
    minTemp: 5,
    maxWindSpeed: 20,
    alternatives: ['walking', 'yoga', 'gym'],
    details: 'מתאים במיוחד לשעות הבוקר המוקדמות'
  },
  cycling: { 
    name: 'רכיבת אופניים',
    icon: '🚴‍♂️',
    maxTemp: 30,
    minTemp: 10,
    maxWindSpeed: 15,
    alternatives: ['running', 'hiking', 'skateboarding'],
    details: 'מומלץ להצטייד במים ובציוד הגנה'
  },
  football: { 
    name: 'כדורגל',
    icon: '⚽',
    maxTemp: 28,
    minTemp: 8,
    maxWindSpeed: 25,
    alternatives: ['basketball', 'tennis', 'volleyball'],
    details: 'מומלץ לשחק על דשא בשעות הערב'
  },
  basketball: { 
    name: 'כדורסל',
    icon: '🏀',
    maxTemp: 32,
    minTemp: 5,
    maxWindSpeed: 15,
    alternatives: ['football', 'volleyball', 'tennis'],
    details: 'מתאים למגרשים מקורים בכל שעות היום'
  }
};

function SportRecommendation() {
  const { currentWeather } = useSelector(state => state.weather);
  const [selectedSport, setSelectedSport] = useState(null);

  const isSportRecommended = (sportConfig) => {
    if (!currentWeather) return false;

    const temp = currentWeather.current_weather.temperature;
    const windSpeed = currentWeather.current_weather.windspeed;

    return (
      temp >= sportConfig.minTemp &&
      temp <= sportConfig.maxTemp &&
      windSpeed <= sportConfig.maxWindSpeed
    );
  };

  const getAlternativeSports = (sport) => {
    if (!sport) return [];
    return sport.alternatives.map(name => sportTypes[name]).filter(isSportRecommended);
  };

  const handleSportSelect = (sportKey) => {
    setSelectedSport(sportKey);
  };

  if (!currentWeather) return null;

  return (
    <div className="sport-recommendation">
      <h3>המלצות ספורט להיום</h3>
      
      {selectedSport && (
        <div className={`sport-result ${isSportRecommended(sportTypes[selectedSport]) ? 'recommended' : 'not-recommended'}`}>
          <div className="sport-icon">{sportTypes[selectedSport].icon}</div>
          <h4>{sportTypes[selectedSport].name}</h4>
          {isSportRecommended(sportTypes[selectedSport]) ? (
            <p>✅ מומלץ לפעילות היום!</p>
          ) : (
            <p>❌ לא מומלץ בתנאי מזג האוויר הנוכחיים</p>
          )}
          <div className="sport-details">
            <p>{sportTypes[selectedSport].details}</p>
            <div className="weather-conditions">
              <span className="condition-item">
                🌡️ {currentWeather.current_weather.temperature}°C
              </span>
              <span className="condition-item">
                💨 {currentWeather.current_weather.windspeed} קמ"ש
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="alternative-sports">
        <h4>אפשרויות ספורט מומלצות:</h4>
        <div className="alternatives-grid">
          {Object.entries(sportTypes).map(([key, sport]) => (
            <div
              key={key}
              className={`sport-option ${selectedSport === key ? 'selected' : ''}`}
              onClick={() => handleSportSelect(key)}
            >
              <span className="sport-icon">{sport.icon}</span>
              <div>{sport.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SportRecommendation;
