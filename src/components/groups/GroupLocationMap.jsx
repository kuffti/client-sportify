import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

function GroupLocationMap({ onLocationSelect }) {
  const [defaultPosition, setDefaultPosition] = useState([31.7683, 35.2137]); // ירושלים כברירת מחדל
  
  // נסה לקבל מיקום נוכחי
  useEffect(() => {
    if (navigator.geolocation) {
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
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}

export default GroupLocationMap;
