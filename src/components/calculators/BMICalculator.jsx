import React, { useState } from 'react';
import '../../styles/calculators.css';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    
    if (!weight || !height) return;
    
    // המרת גובה לסנטימטרים אם הוזן במטרים
    const heightInM = height > 3 ? height / 100 : height;
    
    // חישוב BMI: משקל (ק"ג) / (גובה (מ') בריבוע)
    const bmiValue = (weight / (heightInM * heightInM)).toFixed(1);
    setBmi(bmiValue);
    
    // קביעת סטטוס לפי ערך ה-BMI
    if (bmiValue < 18.5) {
      setStatus('תת-משקל');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setStatus('משקל תקין');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setStatus('עודף משקל');
    } else {
      setStatus('השמנה');
    }
  };

  const resetCalculator = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setStatus('');
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">מחשבון BMI (מדד מסת גוף)</h3>
      <form onSubmit={calculateBMI}>
        <div className="form-group">
          <label htmlFor="weight">משקל (ק"ג)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="הכנס משקל בק״ג"
            min="1"
            max="300"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">גובה (ס"מ או מ')</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="הכנס גובה בס״מ או במטרים"
            min="0.5"
            max="300"
            step="any"
            required
          />
          <small>אם הגובה במטרים, הכנס כך: 1.75</small>
        </div>
        <div className="calculator-buttons">
          <button type="submit" className="calculate-btn">חשב</button>
          <button type="button" className="reset-btn" onClick={resetCalculator}>אפס</button>
        </div>
      </form>

      {bmi && (
        <div className="result-container">
          <h4>התוצאה שלך</h4>
          <p className="bmi-result">
            BMI: <span className={`bmi-value ${status}`}>{bmi}</span>
          </p>
          <p className="bmi-status">
            סטטוס: <span className={`status-value ${status}`}>{status}</span>
          </p>
          <div className="bmi-scale">
            <div className="scale-item underweight">תת-משקל</div>
            <div className="scale-item normal">תקין</div>
            <div className="scale-item overweight">עודף</div>
            <div className="scale-item obese">השמנה</div>
          </div>
          <p className="bmi-info">
            * מדד BMI הוא כלי להערכה כללית בלבד ואינו מחליף ייעוץ רפואי מקצועי.
          </p>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
