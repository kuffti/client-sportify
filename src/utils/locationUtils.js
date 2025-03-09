/**
 * מחשב מרחק בין שתי נקודות גיאוגרפיות בקילומטרים
 * @param {number} lat1 - קו רוחב של נקודה 1
 * @param {number} lon1 - קו אורך של נקודה 1
 * @param {number} lat2 - קו רוחב של נקודה 2
 * @param {number} lon2 - קו אורך של נקודה 2
 * @returns {number} - המרחק בקילומטרים
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // המרת מעלות לרדיאנים
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  
  // רדיוס כדור הארץ בקילומטרים
  const earthRadius = 6371;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return distance;
};

/**
 * מחשב זמן הגעה משוער בין שתי נקודות גיאוגרפיות
 * @param {number} distanceKm - מרחק בקילומטרים
 * @param {string} mode - אמצעי תחבורה ('driving', 'walking', 'cycling')
 * @returns {number} - זמן משוער בדקות
 */
export const estimateTravelTime = (distanceKm, mode = 'driving') => {
  // מהירויות ממוצעות בקמ"ש
  const speeds = {
    driving: 50,   // מהירות נסיעה ממוצעת בעיר
    walking: 5,    // מהירות הליכה ממוצעת
    cycling: 15    // מהירות רכיבה על אופניים ממוצעת
  };
  
  const speed = speeds[mode] || speeds.driving;
  
  // זמן בשעות = מרחק / מהירות
  const timeHours = distanceKm / speed;
  
  // המרה לדקות
  return Math.round(timeHours * 60);
};

/**
 * מקבל מרחק וזמן ומחזיר טקסט מעוצב
 * @param {number} distance - מרחק בקילומטרים
 * @param {number} minutes - זמן בדקות
 * @returns {string} - טקסט מעוצב המתאר את המרחק והזמן
 */
export const formatDistanceAndTime = (distance, minutes) => {
  const formattedDistance = distance < 1 ? 
    `${Math.round(distance * 1000)} מטרים` : 
    `${distance.toFixed(1)} ק"מ`;
  
  const formattedTime = minutes < 60 ? 
    `${minutes} דקות` : 
    `${Math.floor(minutes / 60)} שעות ו-${minutes % 60} דקות`;
  
  return `${formattedDistance} (${formattedTime})`;
};

/**
 * מחזיר קישור למפת גוגל עם מסלול ניווט
 * @param {Object} destination - המיקום אליו רוצים להגיע
 * @param {Object} origin - נקודת המוצא (אופציונלי)
 * @param {string} mode - אמצעי תחבורה ('driving', 'walking', 'bicycling', 'transit')
 * @returns {string} - URL לגוגל מפות עם מסלול ניווט
 */
export const getGoogleMapsDirectionsUrl = (destination, origin = null, mode = 'driving') => {
  const destStr = `${destination.latitude},${destination.longitude}`;
  const originParam = origin ? `&origin=${origin.latitude},${origin.longitude}` : '';
  const modeParam = `&travelmode=${mode}`;
  
  return `https://www.google.com/maps/dir/?api=1&destination=${destStr}${originParam}${modeParam}`;
};

/**
 * מחזיר קישור לווייז עם מסלול ניווט
 * @param {Object} destination - המיקום אליו רוצים להגיע
 * @returns {string} - URL לווייז עם מסלול ניווט
 */
export const getWazeDirectionsUrl = (destination) => {
  return `https://waze.com/ul?ll=${destination.latitude},${destination.longitude}&navigate=yes`;
};
