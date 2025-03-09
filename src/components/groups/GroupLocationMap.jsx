import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// תיקון לאייקונים של Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// קומפוננטת ביניים למיפוי לחיצות על המפה
function LocationMarker({ onLocationSelect, initialLocation }) {
  const [position, setPosition] = useState(initialLocation ? [initialLocation.latitude, initialLocation.longitude] : null);
  
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  // כאשר נבחר מיקום מחיפוש, נעדכן את הנקודה
  useEffect(() => {
    if (initialLocation && (!position || 
        position[0] !== initialLocation.latitude || 
        position[1] !== initialLocation.longitude)) {
      setPosition([initialLocation.latitude, initialLocation.longitude]);
    }
  }, [initialLocation]);

  // אם יש מיקום ראשוני, נדאג שהמפה תתמקד בו
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

// קומפוננטה שמרכזת את המפה על מיקום נבחר
function MapUpdater({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView([position.latitude, position.longitude], 15);
    }
  }, [position, map]);
  
  return null;
}

function GroupLocationMap({ onLocationSelect, initialLocation }) {
  const [defaultPosition, setDefaultPosition] = useState([31.7683, 35.2137]); // ירושלים כברירת מחדל
  
  // נסה לקבל מיקום נוכחי
  useEffect(() => {
    if (!initialLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDefaultPosition([latitude, longitude]);
        },
        (error) => {
          console.warn("Error getting location:", error.message);
        }
      );
    }
  }, [initialLocation]);

  return (
    <div className="map-container">
      <MapContainer
        center={initialLocation ? [initialLocation.latitude, initialLocation.longitude] : defaultPosition}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationSelect={onLocationSelect} initialLocation={initialLocation} />
        {initialLocation && <MapUpdater position={initialLocation} />}
      </MapContainer>
    </div>
  );
}

export default GroupLocationMap;
