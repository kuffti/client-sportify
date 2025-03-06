import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../features/weather/weatherSlice';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// תיקון לאייקונים של Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// קומפוננטה לטיפול באירועי מפה
function MapEvents({ onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    }
  });
  
  return null;
}

// קומפוננטה להצגת הנקודה הנבחרת
function LocationMarker({ position }) {
  return position ? <Marker position={[position.latitude, position.longitude]} /> : null;
}

function WeatherMap({ onLocationSelect }) {
  const dispatch = useDispatch();
  const { location } = useSelector(state => state.weather);
  const defaultPosition = [31.7683, 35.2137]; // ירושלים כברירת מחדל
  
  // אם לא התקבלה פונקציית בחירת מיקום, נשתמש בברירת המחדל
  const handleLocationSelect = onLocationSelect || ((newLocation) => {
    dispatch(setLocation(newLocation));
  });

  // ניסיון לקבל מיקום נוכחי בטעינה הראשונית
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect({ latitude, longitude });
        },
        (error) => {
          console.warn("Error getting location:", error.message);
        }
      );
    }
  }, []);

  return (
    <div className="weather-map">
      <MapContainer
        center={location ? [location.latitude, location.longitude] : defaultPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onLocationSelect={handleLocationSelect} />
        {location && <LocationMarker position={location} />}
      </MapContainer>
    </div>
  );
}

export default WeatherMap;
