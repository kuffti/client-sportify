import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { calculateDistance } from '../../utils/locationUtils';
import './GroupsMap.css';

// תיקון לאייקונים של Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// יצירת איקונים בצבעים שונים לפי סוג ספורט
const createColorIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// קומפוננטה שמרכזית את המפה על אוסף נקודות
function MapBoundsSetter({ groups }) {
  const map = useMap();
  
  useEffect(() => {
    if (groups && groups.length > 0) {
      // יוצרים גבולות שמכילים את כל הקבוצות
      const bounds = L.latLngBounds(
        groups
          .filter(group => group?.location?.latitude && group?.location?.longitude)
          .map(group => [group.location.latitude, group.location.longitude])
      );
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, groups]);
  
  return null;
}

// קומפוננטה שמציגה את המיקום הנוכחי של המשתמש
function UserLocationMarker({ userLocation }) {
  if (!userLocation) return null;
  
  return (
    <Marker 
      position={[userLocation.latitude, userLocation.longitude]}
      icon={createColorIcon('blue')}
    >
      <Popup>
        <div className="user-location-popup">
          <h3>המיקום שלי</h3>
        </div>
      </Popup>
    </Marker>
  );
}

// מיפוי סוגי ספורט לצבעים
const sportTypeColors = {
  running: 'green',
  football: 'red',
  basketball: 'orange',
  tennis: 'yellow',
  swimming: 'blue',
  cycling: 'violet',
  volleyball: 'gold',
  hiking: 'green',
  yoga: 'pink',
  other: 'grey'
};

function GroupsMap({ selectedGroup }) {
  const { groups } = useSelector(state => state.groups);
  const [userLocation, setUserLocation] = useState(null);
  const [activeGroup, setActiveGroup] = useState(selectedGroup || null);

  useEffect(() => {
    // נסיון לקבל את המיקום הנוכחי
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Error getting user location:", error.message);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      setActiveGroup(selectedGroup);
    }
  }, [selectedGroup]);

  // מרכז ברירת מחדל - ירושלים
  const defaultCenter = [31.7683, 35.2137];
  
  // פונקציה לחישוב מרחק מהמשתמש לקבוצה
  const getDistanceToGroup = (groupLocation) => {
    if (!userLocation || !groupLocation) return null;
    
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      groupLocation.latitude,
      groupLocation.longitude
    );
  };

  // פונקציה ליצירת קישור לניווט
  const getDirectionsUrl = (groupLocation) => {
    if (!groupLocation) return '#';
    
    // יצירת URL לניווט עם גוגל מפות
    return `https://www.google.com/maps/dir/?api=1&destination=${groupLocation.latitude},${groupLocation.longitude}`;
  };

  // פונקציה ליצירת קישור לויז
  const getWazeUrl = (groupLocation) => {
    if (!groupLocation) return '#';
    
    return `https://waze.com/ul?ll=${groupLocation.latitude},${groupLocation.longitude}&navigate=yes`;
  };

  return (
    <div className="groups-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* מרכז את המפה על כל הקבוצות */}
        <MapBoundsSetter groups={groups} />
        
        {/* סימון המיקום של המשתמש */}
        <UserLocationMarker userLocation={userLocation} />
        
        {/* סימון כל הקבוצות */}
        {groups.map(group => {
          if (!group?.location?.latitude || !group?.location?.longitude) return null;
          
          const sportColor = sportTypeColors[group.sportType] || 'grey';
          const icon = createColorIcon(sportColor);
          const isActive = activeGroup && activeGroup._id === group._id;
          const distance = getDistanceToGroup(group.location);
          
          return (
            <Marker 
              key={group._id}
              position={[group.location.latitude, group.location.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => setActiveGroup(group)
              }}
              opacity={isActive ? 1 : 0.7}
            >
              <Popup>
                <div className="group-popup">
                  <h3>{group.name}</h3>
                  <div className="group-type-tag">{group.sportType}</div>
                  <p>תאריך: {new Date(group.activityDate).toLocaleDateString('he-IL')}</p>
                  <p>שעה: {group.activityTime}</p>
                  {distance !== null && (
                    <p className="group-distance">
                      <span>מרחק: {distance.toFixed(1)} ק"מ</span>
                    </p>
                  )}
                  <div className="group-navigation-links">
                    <a 
                      href={getDirectionsUrl(group.location)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="directions-link google"
                    >
                      <span className="nav-icon">🗺️</span>
                      <span>גוגל מפות</span>
                    </a>
                    <a 
                      href={getWazeUrl(group.location)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="directions-link waze"
                    >
                      <span className="nav-icon">🚗</span>
                      <span>ווייז</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="map-legend">
        <h4>מקרא</h4>
        <ul className="legend-items">
          {Object.entries(sportTypeColors).map(([sport, color]) => (
            <li key={sport} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: color }}
              />
              <span className="legend-label">{sport}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroupsMap;
