import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, fetchWeather } from '../../features/weather/weatherSlice';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// תיקון לאייקונים של Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// קומפוננטה לטיפול באירועי מפה
function MapEvents() {
  const dispatch = useDispatch();
  
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      dispatch(setLocation({ latitude: lat, longitude: lng }));
      dispatch(fetchWeather({ latitude: lat, longitude: lng }));
    },
  });
  
  return null;
}

function WeatherMap() {
  const dispatch = useDispatch();
  const { location } = useSelector(state => state.weather);
  const defaultPosition = [31.7683, 35.2137]; // ירושלים

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ latitude, longitude }));
          dispatch(fetchWeather({ latitude, longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [dispatch]);

  return (
    <MapContainer
      center={location ? [location.latitude, location.longitude] : defaultPosition}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapEvents />
      {location && (
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            המיקום הנבחר
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default WeatherMap;
