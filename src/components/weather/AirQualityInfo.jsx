import React from 'react';

function AirQualityInfo({ airQuality, isLoading }) {
  if (isLoading) {
    return <div className="air-quality">טוען נתוני איכות אוויר...</div>;
  }

  if (!airQuality) {
    return null;
  }

  // פונקציה שמחזירה מחלקת CSS ותיאור לפי מדד איכות האוויר
  const getAirQualityClass = (aqi) => {
    if (aqi <= 20) return { class: 'good', text: 'טובה', recommendation: 'איכות אוויר מצוינת לפעילות ספורטיבית בחוץ' };
    if (aqi <= 40) return { class: 'moderate', text: 'בינונית', recommendation: 'איכות אוויר סבירה לרוב האנשים, אך ייתכן שאנשים רגישים יחוו השפעות' };
    if (aqi <= 60) return { class: 'poor', text: 'ירודה', recommendation: 'מומלץ להפחית פעילות ממושכת בחוץ, במיוחד לאנשים עם בעיות נשימה' };
    return { class: 'very-poor', text: 'גרועה', recommendation: 'מומלץ להימנע מפעילות בחוץ ולהעדיף פעילות במקומות סגורים' };
  };

  const qualityInfo = getAirQualityClass(airQuality.european_aqi);

  return (
    <div className="air-quality">
      <div className="air-quality-title">
        <h3>איכות אוויר</h3>
        <div className="air-index">
          <span className={`air-index-value index-${qualityInfo.class}`}>{airQuality.european_aqi}</span>
          <span>{qualityInfo.text}</span>
        </div>
      </div>
      
      <div className="air-quality-details">
        <div className="air-pollutant">
          <div className="pollutant-name">PM2.5 (חלקיקים זעירים)</div>
          <div className="pollutant-value">{airQuality.pm2_5?.toFixed(1) || 'N/A'} µg/m³</div>
        </div>
        <div className="air-pollutant">
          <div className="pollutant-name">PM10 (חלקיקים)</div>
          <div className="pollutant-value">{airQuality.pm10?.toFixed(1) || 'N/A'} µg/m³</div>
        </div>
        <div className="air-pollutant">
          <div className="pollutant-name">NO₂ (חנקן דו-חמצני)</div>
          <div className="pollutant-value">{airQuality.nitrogen_dioxide?.toFixed(1) || 'N/A'} µg/m³</div>
        </div>
        <div className="air-pollutant">
          <div className="pollutant-name">O₃ (אוזון)</div>
          <div className="pollutant-value">{airQuality.ozone?.toFixed(1) || 'N/A'} µg/m³</div>
        </div>
      </div>
      
      <div className={`air-recommendation ${qualityInfo.class}`}>
        <strong>המלצה: </strong> {qualityInfo.recommendation}
      </div>
    </div>
  );
}

export default AirQualityInfo;
