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
  const [step, setStep] = useState(1); // 1 = פרטי קבוצה, 2 = בחירת מיקום

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

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      alert('אנא בחר מיקום על המפה');
      return;
    }
    
    const groupData = {
      ...formData,
      sportType,
      location
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
          <p className="location-instructions">בחר את מיקום הפעילות על ידי לחיצה על המפה</p>
          
          <div className="location-map-container">
            <GroupLocationMap onLocationSelect={handleLocationSelect} />
          </div>
          
          {location && (
            <div className="selected-location">
              <p>המיקום נבחר: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
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
