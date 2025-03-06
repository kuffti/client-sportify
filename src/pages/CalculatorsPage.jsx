import React, { useState } from 'react';
import BMICalculator from '../components/calculators/BMICalculator';
import HeartRateCalculator from '../components/calculators/HeartRateCalculator';
import CalorieCalculator from '../components/calculators/CalorieCalculator';
import PaceCalculator from '../components/calculators/PaceCalculator';
import '../styles/calculators.css';

const CalculatorsPage = () => {
  const [activeCalculator, setActiveCalculator] = useState('bmi');

  const calculators = [
    { id: 'bmi', name: 'מחשבון BMI', component: <BMICalculator /> },
    { id: 'heartRate', name: 'מחשבון קצב לב', component: <HeartRateCalculator /> },
    { id: 'calories', name: 'מחשבון קלוריות', component: <CalorieCalculator /> },
    { id: 'pace', name: 'מחשבון קצב ריצה', component: <PaceCalculator /> }
  ];

  return (
    <div className="calculators-page">
      <div className="page-header">
        <h1>מחשבוני ספורט וכושר</h1>
        <p>כלים שימושיים לחישוב מדדים שונים הקשורים לכושר, תזונה ופעילות גופנית</p>
      </div>

      <div className="calculators-container">
        <div className="calculators-nav">
          {calculators.map(calc => (
            <button
              key={calc.id}
              className={`calculator-nav-item ${activeCalculator === calc.id ? 'active' : ''}`}
              onClick={() => setActiveCalculator(calc.id)}
            >
              {calc.name}
            </button>
          ))}
        </div>

        <div className="calculator-content">
          {calculators.find(calc => calc.id === activeCalculator)?.component}
        </div>
      </div>
    </div>
  );
};

export default CalculatorsPage;
