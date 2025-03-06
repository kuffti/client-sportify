import React, { useState } from 'react';
import '../../styles/calculators.css';

const CalorieCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState(null);

  const activityLevels = {
    sedentary: { label: 'לא פעיל (עבודה משרדית)', factor: 1.2 },
    light: { label: 'פעילות קלה (1-2 אימונים בשבוע)', factor: 1.375 },
    moderate: { label: 'פעילות בינונית (3-5 אימונים בשבוע)', factor: 1.55 },
    active: { label: 'פעילות גבוהה (6-7 אימונים בשבוע)', factor: 1.725 },
    veryActive: { label: 'פעילות גבוהה מאוד (אימונים יומיים אינטנסיביים)', factor: 1.9 }
  };

  const goals = {
    lose: { label: 'ירידה במשקל', factor: 0.8 },
    maintain: { label: 'שמירה על המשקל', factor: 1 },
    gain: { label: 'עלייה במשקל', factor: 1.15 }
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    
    if (!age || !weight || !height) return;
    
    // המרת גובה לסנטימטרים אם הוזן במטרים
    const heightInCm = height < 3 ? height * 100 : height;
    
    // חישוב BMR לפי נוסחת מיפלין-סנט ג'אור
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * heightInCm - 5 * age - 161;
    }
    
    // חישוב TDEE (סך הקלוריות היומי)
    const tdee = bmr * activityLevels[activityLevel].factor;
    
    // התאמה לפי המטרה
    const adjustedCalories = tdee * goals[goal].factor;
    
    // חישוב מאקרו-נוטריאנטים מומלצים
    const protein = Math.round(weight * (goal === 'gain' ? 2.2 : 1.8));
    const fat = Math.round((adjustedCalories * 0.25) / 9); // 25% מהקלוריות מגיעות משומן
    const carbs = Math.round((adjustedCalories - (protein * 4) - (fat * 9)) / 4);
    
    setResult({
      calories: Math.round(adjustedCalories),
      protein,
      fat,
      carbs
    });
  };

  const resetCalculator = () => {
    setGender('male');
    setAge('');
    setWeight('');
    setHeight('');
    setActivityLevel('moderate');
    setGoal('maintain');
    setResult(null);
  };

  return (
    <div className="calculator-card">
      <h3 className="calculator-title">מחשבון צריכת קלוריות יומית</h3>
      <form onSubmit={calculateCalories}>
        <div className="form-group">
          <label>מגדר</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              גבר
            </label>
            <label>
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              אישה
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="age">גיל</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="הכנס גיל"
            min="15"
            max="100"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">משקל (ק"ג)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="הכנס משקל בק״ג"
            min="30"
            max="250"
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
            max="250"
            step="any"
            required
          />
          <small>אם הגובה במטרים, הכנס כך: 1.75</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="activityLevel">רמת פעילות</label>
          <select
            id="activityLevel"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            required
          >
            {Object.entries(activityLevels).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="goal">מטרה</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            {Object.entries(goals).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="calculator-buttons">
          <button type="submit" className="calculate-btn">חשב</button>
          <button type="button" className="reset-btn" onClick={resetCalculator}>אפס</button>
        </div>
      </form>

      {result && (
        <div className="result-container">
          <h4>התוצאות שלך</h4>
          <p className="calories-result">
            צריכת קלוריות יומית מומלצת: <span className="calories-value">{result.calories}</span> קלוריות
          </p>
          
          <h5>חלוקת מאקרו-נוטריאנטים מומלצת:</h5>
          <div className="macros-container">
            <div className="macro-item protein">
              <h6>חלבון</h6>
              <p>{result.protein} גרם</p>
              <p>({Math.round(result.protein * 4)} קלוריות)</p>
            </div>
            <div className="macro-item fat">
              <h6>שומן</h6>
              <p>{result.fat} גרם</p>
              <p>({Math.round(result.fat * 9)} קלוריות)</p>
            </div>
            <div className="macro-item carbs">
              <h6>פחמימות</h6>
              <p>{result.carbs} גרם</p>
              <p>({Math.round(result.carbs * 4)} קלוריות)</p>
            </div>
          </div>
          
          <p className="calorie-info">
            * החישוב מבוסס על נוסחת מיפלין-סנט ג'אור. התוצאות הן הערכה בלבד ואינן מחליפות ייעוץ תזונתי מקצועי.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator;
