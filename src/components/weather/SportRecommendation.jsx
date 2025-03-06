import { useState } from 'react';
import { useSelector } from 'react-redux';

const sportTypes = {
  running: { 
    name: 'ריצה',
    icon: '🏃‍♂️',
    maxTemp: 25,
    minTemp: 5,
    maxWindSpeed: 20,
    maxAQI: 40, // מגבלת איכות אוויר
    alternatives: ['walking', 'yoga', 'gym'],
    details: 'מתאים במיוחד לשעות הבוקר המוקדמות'
  },
  cycling: { 
    name: 'רכיבת אופניים',
    icon: '🚴‍♂️',
    maxTemp: 30,
    minTemp: 10,
    maxWindSpeed: 15,
    maxAQI: 50,
    alternatives: ['running', 'hiking', 'skateboarding'],
    details: 'מומלץ להצטייד במים ובציוד הגנה'
  },
  football: { 
    name: 'כדורגל',
    icon: '⚽',
    maxTemp: 28,
    minTemp: 8,
    maxWindSpeed: 25,
    maxAQI: 45,
    alternatives: ['basketball', 'tennis', 'volleyball'],
    details: 'מומלץ לשחק על דשא בשעות הערב'
  },
  basketball: { 
    name: 'כדורסל',
    icon: '🏀',
    maxTemp: 32,
    minTemp: 5,
    maxWindSpeed: 15,
    maxAQI: 60,
    alternatives: ['football', 'volleyball', 'tennis'],
    details: 'מתאים למגרשים מקורים בכל שעות היום'
  },
  walking: {
    name: 'הליכה',
    icon: '🚶‍♂️',
    maxTemp: 30,
    minTemp: 0,
    maxWindSpeed: 30,
    maxAQI: 70,
    alternatives: ['yoga', 'gym', 'swimming'],
    details: 'פעילות קלה המתאימה לכל רמות הכושר'
  },
  yoga: {
    name: 'יוגה',
    icon: '🧘‍♀️',
    maxTemp: 35,
    minTemp: 10,
    maxWindSpeed: 40,
    maxAQI: 80,
    alternatives: ['gym', 'swimming', 'walking'],
    details: 'מומלץ לתרגל בחוץ בימים נוחים או בפנים בכל מזג אוויר'
  },
  swimming: {
    name: 'שחייה',
    icon: '🏊‍♂️',
    maxTemp: 40,
    minTemp: 15,
    maxWindSpeed: 50,
    maxAQI: 100,
    alternatives: ['gym', 'yoga', 'walking'],
    details: 'פעילות מצוינת שאינה מושפעת ממזג האוויר בבריכה מקורה'
  }
};

function SportRecommendation() {
  const { currentWeather, airQuality } = useSelector(state => state.weather);
  const [selectedSport, setSelectedSport] = useState(null);

  const isSportRecommended = (sportConfig) => {
    if (!currentWeather) return false;

    const temp = currentWeather.temperature;
    const windSpeed = currentWeather.windspeed;
    const aqi = airQuality?.european_aqi || 0;

    return (
      temp >= sportConfig.minTemp &&
      temp <= sportConfig.maxTemp &&
      windSpeed <= sportConfig.maxWindSpeed &&
      aqi <= sportConfig.maxAQI
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

  // מיון הספורט לפי ההתאמה הטובה ביותר למזג האוויר הנוכחי
  const recommendedSports = Object.entries(sportTypes)
    .filter(([_, sport]) => isSportRecommended(sport))
    .sort((a, b) => {
      // דירוג פשוט לפי מרחק מהטמפרטורה האידיאלית של כל ספורט
      const currentTemp = currentWeather.temperature;
      const distanceA = Math.abs((a[1].maxTemp + a[1].minTemp) / 2 - currentTemp);
      const distanceB = Math.abs((b[1].maxTemp + b[1].minTemp) / 2 - currentTemp);
      return distanceA - distanceB;
    })
    .slice(0, 3); // שלוש האפשרויות הטובות ביותר

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
            <p>❌ לא מומלץ בתנאים הנוכחיים</p>
          )}
          <div className="sport-details">
            <p>{sportTypes[selectedSport].details}</p>
            <div className="weather-conditions">
              <span className="condition-item">
                🌡️ {currentWeather.temperature}°C
              </span>
              <span className="condition-item">
                💨 {currentWeather.windspeed} קמ"ש
              </span>
              {airQuality && (
                <span className="condition-item">
                  💨 איכות אוויר: {airQuality.european_aqi} 
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="todays-best">
        <h4>הספורט המומלץ ביותר להיום:</h4>
        {recommendedSports.length > 0 ? (
          <div className="best-sports-grid">
            {recommendedSports.map(([key, sport]) => (
              <div 
                key={key} 
                className={`sport-option best-option ${selectedSport === key ? 'selected' : ''}`}
                onClick={() => handleSportSelect(key)}
              >
                <span className="sport-icon">{sport.icon}</span>
                <div>{sport.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>בתנאי מזג האוויר הנוכחיים, מומלץ להישאר בפנים ולעסוק בפעילות גופנית בחללים סגורים.</p>
        )}
      </div>

      <div className="alternative-sports">
        <h4>כל אפשרויות הספורט:</h4>
        <div className="alternatives-grid">
          {Object.entries(sportTypes).map(([key, sport]) => (
            <div
              key={key}
              className={`sport-option ${selectedSport === key ? 'selected' : ''} ${isSportRecommended(sport) ? 'recommended-option' : ''}`}
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
