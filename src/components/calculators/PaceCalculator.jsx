import React, { useState } from 'react';
import '../../styles/calculators.css';

const PaceCalculator = () => {
  const [calculationType, setCalculationType] = useState('pace');
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [paceMinutes, setPaceMinutes] = useState('');
  const [paceSeconds, setPaceSeconds] = useState('');
  const [result, setResult] = useState(null);

  const calculateResult = (e) => {
    e.preventDefault();
    
    // המרת זמן לשניות
    const timeInSeconds = (parseInt(hours || 0) * 3600) + (parseInt(minutes || 0) * 60) + parseInt(seconds || 0);
    const paceInSeconds = (parseInt(paceMinutes || 0) * 60) + parseInt(paceSeconds || 0);
    
    if (calculationType === 'pace') {
      // חישוב קצב (זמן לק"מ)
      if (!distance || timeInSeconds === 0) return;
      
      const paceInSecondsResult = Math.round(timeInSeconds / parseFloat(distance));
      const calculatedPaceMinutes = Math.floor(paceInSecondsResult / 60);
      const calculatedPaceSeconds = paceInSecondsResult % 60;
      
      setResult({
        type: 'pace',
        value: `${calculatedPaceMinutes}:${calculatedPaceSeconds.toString().padStart(2, '0')} דקות לק"מ`
      });
    } else if (calculationType === 'time') {
      // חישוב זמן כולל
      if (!distance || paceInSeconds === 0) return;
      
      const totalTimeInSeconds = Math.round(parseFloat(distance) * paceInSeconds);
      const calculatedHours = Math.floor(totalTimeInSeconds / 3600);
      const calculatedMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const calculatedSeconds = totalTimeInSeconds % 60;
      
      let timeString = '';
      if (calculatedHours > 0) {
        timeString += `${calculatedHours} שעות, `;
      }
      timeString += `${calculatedMinutes} דקות ו-${calculatedSeconds} שניות`;
      
      setResult({
        type: 'time',
        value: timeString
      });
    } else if (calculationType === 'distance') {
      // חישוב מרחק
      if (timeInSeconds === 0 || paceInSeconds === 0) return;
      
      const calculatedDistance = (timeInSeconds / paceInSeconds).toFixed(2);
      
      setResult({
        type: 'distance',
        value: `${calculatedDistance} ק"מ`
      });
    }
  };

  const resetCalculator = () => {
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setPaceMinutes('');
    setPaceSeconds('');
    setResult(null);
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">מחשבון קצב ריצה</h3>
      
      <div className="calculation-type">
        <label>מה ברצונך לחשב?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="pace"
              checked={calculationType === 'pace'}
              onChange={() => setCalculationType('pace')}
            />
            קצב (דקות לק"מ)
          </label>
          <label>
            <input
              type="radio"
              value="time"
              checked={calculationType === 'time'}
              onChange={() => setCalculationType('time')}
            />
            זמן כולל
          </label>
          <label>
            <input
              type="radio"
              value="distance"
              checked={calculationType === 'distance'}
              onChange={() => setCalculationType('distance')}
            />
            מרחק
          </label>
        </div>
      </div>
      
      <form onSubmit={calculateResult}>
        {/* שדה מרחק - מוצג בכל המצבים חוץ מחישוב מרחק */}
        {calculationType !== 'distance' && (
          <div className="form-group">
            <label htmlFor="distance">מרחק (ק"מ)</label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="הכנס מרחק בק״מ"
              min="0.1"
              step="0.01"
              required
            />
          </div>
        )}
        
        {/* שדות זמן - מוצגים בכל המצבים חוץ מחישוב זמן */}
        {calculationType !== 'time' && (
          <div className="form-group time-inputs">
            <label>זמן כולל</label>
            <div className="time-fields">
              <div className="time-field">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="שעות"
                  min="0"
                  max="99"
                />
                <span>שעות</span>
              </div>
              <div className="time-field">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="דקות"
                  min="0"
                  max="59"
                />
                <span>דקות</span>
              </div>
              <div className="time-field">
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="שניות"
                  min="0"
                  max="59"
                />
                <span>שניות</span>
              </div>
            </div>
          </div>
        )}
        
        {/* שדות קצב - מוצגים בכל המצבים חוץ מחישוב קצב */}
        {calculationType !== 'pace' && (
          <div className="form-group pace-inputs">
            <label>קצב (דקות לק"מ)</label>
            <div className="pace-fields">
              <div className="pace-field">
                <input
                  type="number"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(e.target.value)}
                  placeholder="דקות"
                  min="0"
                  max="99"
                  required
                />
                <span>דקות</span>
              </div>
              <div className="pace-field">
                <input
                  type="number"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(e.target.value)}
                  placeholder="שניות"
                  min="0"
                  max="59"
                  required
                />
                <span>שניות</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="calculator-buttons">
          <button type="submit" className="calculate-btn">חשב</button>
          <button type="button" className="reset-btn" onClick={resetCalculator}>אפס</button>
        </div>
      </form>

      {result && (
        <div className="result-container">
          <h4>התוצאה שלך</h4>
          <p className="pace-result">
            {calculationType === 'pace' && 'הקצב שלך: '}
            {calculationType === 'time' && 'הזמן הכולל: '}
            {calculationType === 'distance' && 'המרחק: '}
            <span className="result-value">{result.value}</span>
          </p>
          
          {calculationType === 'pace' && (
            <div className="pace-equivalents">
              <h5>קצבים שווי-ערך למרחקים נפוצים:</h5>
              <table className="pace-table">
                <thead>
                  <tr>
                    <th>מרחק</th>
                    <th>זמן משוער</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>5 ק"מ</td>
                    <td>{calculateTimeForDistance(5)}</td>
                  </tr>
                  <tr>
                    <td>10 ק"מ</td>
                    <td>{calculateTimeForDistance(10)}</td>
                  </tr>
                  <tr>
                    <td>חצי מרתון (21.1 ק"מ)</td>
                    <td>{calculateTimeForDistance(21.1)}</td>
                  </tr>
                  <tr>
                    <td>מרתון (42.2 ק"מ)</td>
                    <td>{calculateTimeForDistance(42.2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  // פונקציה לחישוב זמן עבור מרחק נתון בהתבסס על הקצב המחושב
  function calculateTimeForDistance(dist) {
    if (!result || result.type !== 'pace') return '-';
    
    // המרת הקצב לשניות
    const paceParts = result.value.split(':')[0].split(' ')[0].split(':');
    const paceInSeconds = (parseInt(paceParts[0]) * 60) + parseInt(paceParts[1]);
    
    // חישוב הזמן הכולל בשניות
    const totalSeconds = Math.round(dist * paceInSeconds);
    
    // המרה לפורמט שעות:דקות:שניות
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
};

export default PaceCalculator;
