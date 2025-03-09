import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup } from '../../features/groups/groupsSlice';
import GroupLocationMap from './GroupLocationMap';

function CreateGroup({ sportType, sportName, onCancel }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activityDate: '',
    activityTime: '',
    maxParticipants: 10
  });
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [step, setStep] = useState(1); // 1 = פרטי קבוצה, 2 = בחירת מיקום
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleLocationSelect = (newLocation, locationInfo = null) => {
    setLocation(newLocation);
    if (locationInfo) {
      setLocationName(locationInfo.name || '');
    }
  };

  // פונקציה לחיפוש כתובת והמרתה לקואורדינטות
  const searchByAddress = async (e) => {
    e.preventDefault();
    
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    
    try {
      // שימוש ב-OpenStreetMap Nominatim API לחיפוש כתובת
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=1&accept-language=he`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const newLocation = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon)
        };
        
        // עדכון המיקום והשם
        handleLocationSelect(newLocation, {
          name: result.display_name
        });
        
      } else {
        alert('לא נמצאו תוצאות לכתובת זו');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('אירעה שגיאה בחיפוש הכתובת');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      alert('אנא בחר מיקום על המפה או חפש לפי כתובת');
      return;
    }
    
    const groupData = {
      ...formData,
      sportType,
      location: {
        ...location,
        name: locationName  // שמירת שם המיקום
      }
    };
    
    try {
      await dispatch(createGroup(groupData)).unwrap();
      onCancel(); // חזרה לתצוגת הרשימה
    } catch (error) {
      console.error('שגיאה ביצירת קבוצה:', error);
    }
  };
  
  const isDateValid = () => {
    if (!formData.activityDate) return false;
    const selectedDate = new Date(formData.activityDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  return (
    <div className="create-group-container">
      <h2>יצירת קבוצת {sportName}</h2>
      
      {step === 1 ? (
        <form onSubmit={handleNextStep} className="create-group-form">
          <div className="form-group">
            <label>שם הקבוצה</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="הזן שם לקבוצה"
              required
            />
          </div>
          
          <div className="form-group">
            <label>תאריך הפעילות</label>
            <input
              type="date"
              name="activityDate"
              value={formData.activityDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>שעת הפעילות</label>
            <input
              type="time"
              name="activityTime"
              value={formData.activityTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>מספר מקסימלי של משתתפים</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="2"
              max="50"
              required
            />
          </div>
          
          <div className="form-group">
            <label>תיאור הקבוצה (אופציונלי)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="תיאור קצר של הפעילות, פרטים נוספים וכו'"
              rows="4"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">ביטול</button>
            <button 
              type="submit" 
              className="btn-next"
              disabled={!formData.name || !formData.activityDate || !formData.activityTime || !isDateValid()}
            >
              המשך לבחירת מיקום
            </button>
          </div>
        </form>
      ) : (
        <div className="location-selection">
          <p className="location-instructions">בחר את מיקום הפעילות על ידי לחיצה על המפה או חיפוש לפי כתובת</p>
          
          {/* הוספת טופס חיפוש כתובת */}
          <div className="address-search-form">
            <form onSubmit={searchByAddress}>
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="הזן כתובת לחיפוש (לדוגמה: רמת גן, אבא הלל 10)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="address-search-input"
                  required
                />
                <button 
                  type="submit" 
                  className="address-search-button" 
                  disabled={isSearching}
                >
                  {isSearching ? 'מחפש...' : 'חפש'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="location-map-container">
            <GroupLocationMap onLocationSelect={handleLocationSelect} initialLocation={location} />
          </div>
          
          {location && (
            <div className="selected-location">
              <p>
                <strong>המיקום נבחר:</strong> {locationName || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </p>
              <div className="location-name-form">
                <label>שם המקום (רשות):</label>
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="הוסף שם למקום (לדוגמה: מגרש הכדורסל)"
                />
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={handlePrevStep} className="btn-back">חזרה לפרטי הקבוצה</button>
            <button 
              type="button" 
              onClick={handleSubmit} 
              className="btn-submit"
              disabled={!location}
            >
              צור קבוצה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateGroup;
