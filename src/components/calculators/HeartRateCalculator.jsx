import React, { useState } from 'react';
import '../../styles/calculators.css';

const HeartRateCalculator = () => {
  const [age, setAge] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [maxHR, setMaxHR] = useState(null);
  const [zones, setZones] = useState(null);

  const calculateHeartRate = (e) => {
    e.preventDefault();
    
    if (!age) return;
    
    // חישוב דופק מקסימלי לפי נוסחת טאנאקה
    const maxHeartRate = Math.round(208 - (0.7 * age));
    setMaxHR(maxHeartRate);
    
    // חישוב אזורי אימון
    const zone1 = {
      name: 'התאוששות קלה',
      min: Math.round(maxHeartRate * 0.5),
      max: Math.round(maxHeartRate * 0.6),
      description: 'אימון קל מאוד, מתאים להתאוששות'
    };
    
    const zone2 = {
      name: 'שריפת שומן',
      min: Math.round(maxHeartRate * 0.6),
      max: Math.round(maxHeartRate * 0.7),
      description: 'אימון קל עד בינוני, מתאים לשריפת שומן ובניית סיבולת בסיסית'
    };
    
    const zone3 = {
      name: 'אירובי',
      min: Math.round(maxHeartRate * 0.7),
      max: Math.round(maxHeartRate * 0.8),
      description: 'אימון בינוני, משפר את היכולת האירובית'
    };
    
    const zone4 = {
      name: 'סף אנאירובי',
      min: Math.round(maxHeartRate * 0.8),
      max: Math.round(maxHeartRate * 0.9),
      description: 'אימון קשה, משפר את הסף האנאירובי'
    };
    
    const zone5 = {
      name: 'VO2 מקסימלי',
      min: Math.round(maxHeartRate * 0.9),
      max: maxHeartRate,
      description: 'אימון מאוד אינטנסיבי, משפר את צריכת החמצן המקסימלית'
    };
    
    setZones([zone1, zone2, zone3, zone4, zone5]);
  };

  const resetCalculator = () => {
    setAge('');
    setRestingHR('');
    setMaxHR(null);
    setZones(null);
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">מחשבון קצב לב ואזורי אימון</h3>
      <form onSubmit={calculateHeartRate}>
        <div className="form-group">
          <label htmlFor="age">גיל</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="הכנס את הגיל שלך"
            min="1"
            max="120"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="restingHR">דופק במנוחה (אופציונלי)</label>
          <input
            type="number"
            id="restingHR"
            value={restingHR}
            onChange={(e) => setRestingHR(e.target.value)}
            placeholder="הכנס דופק במנוחה"
            min="30"
            max="120"
          />
        </div>
        <div className="calculator-buttons">
          <button type="submit" className="calculate-btn">חשב</button>
          <button type="button" className="reset-btn" onClick={resetCalculator}>אפס</button>
        </div>
      </form>

      {maxHR && (
        <div className="result-container">
          <h4>התוצאות שלך</h4>
          <p className="heart-rate-result">
            דופק מקסימלי מוערך: <span className="max-hr">{maxHR}</span> פעימות לדקה
          </p>
          
          <h5>אזורי אימון מומלצים:</h5>
          <div className="heart-rate-zones">
            {zones.map((zone, index) => (
              <div key={index} className={`zone-item zone-${index + 1}`}>
                <h6>{zone.name}</h6>
                <p className="zone-range">{zone.min} - {zone.max} פעימות לדקה</p>
                <p className="zone-percent">({Math.round((zone.min / maxHR) * 100)}% - {Math.round((zone.max / maxHR) * 100)}%)</p>
                <p className="zone-desc">{zone.description}</p>
              </div>
            ))}
          </div>
          <p className="hr-info">
            * החישוב מבוסס על נוסחת טאנאקה. התוצאות הן הערכה בלבד ואינן מחליפות ייעוץ מקצועי.
          </p>
        </div>
      )}
    </div>
  );
};

export default HeartRateCalculator;
