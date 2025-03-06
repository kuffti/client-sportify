import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ייבוא בטוח ל-leaflet.heat שעובד גם בבניה וגם בפיתוח
const loadHeatLayer = async () => {
  try {
    // קודם כל ננסה לייבא כמודול כרגיל (אם נתמך)
    await import('leaflet.heat');
    return true;
  } catch (e) {
    console.warn('Failed to import leaflet.heat as a module, falling back to CDN');
    
    // אם נכשל, ננסה להוסיף אותו כסקריפט חיצוני מ-CDN
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Failed to load leaflet.heat from CDN');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }
};

// קומפוננטה להצגת מפת החום
function HeatmapLayer({ points }) {
  const map = useMap();
  
  useEffect(() => {
    if (!points || points.length === 0) return;
    
    // משתני עזר לניקוי
    let heatLayer = null;
    let markers = [];

    // טעינת שכבת החום באופן בטוח
    const initHeatLayer = async () => {
      const heatAvailable = await loadHeatLayer();
      
      if (heatAvailable && L.heatLayer) {
        // יצירת שכבת החום
        heatLayer = L.heatLayer(points, { 
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
        }).addTo(map);
      } else {
        // גיבוי במקרה שלא ניתן לטעון את שכבת החום
        console.warn('Heatmap not available, showing markers instead');
        markers = points.map(point => 
          L.circleMarker([point[0], point[1]], { 
            radius: 5, 
            color: 'red',
            fillOpacity: 0.6
          }).addTo(map)
        );
      }
    };
    
    // אתחול השכבה
    initHeatLayer();
    
    // פונקציית הניקוי
    return () => {
      // הסרת שכבת החום אם קיימת
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
      
      // הסרת הנקודות אם קיימות
      if (markers.length > 0) {
        markers.forEach(marker => map.removeLayer(marker));
      }
    };
  }, [map, points]);

  return null;
}

// קומפוננטה לציור מסלולים פופולריים
function RoutesLayer({ routes }) {
  const map = useMap();
  const routeLayersRef = useRef([]);
  
  useEffect(() => {
    if (!routes || routes.length === 0) return;

    // הסרת שכבות קודמות
    routeLayersRef.current.forEach(layer => map.removeLayer(layer));
    routeLayersRef.current = [];

    // יצירת שכבות מסלול חדשות
    routes.forEach(route => {
      if (!route.points || route.points.length < 2) return;
      
      const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const polyline = L.polyline(route.points, { 
        color: randomColor,
        weight: 5,
        opacity: 0.7 
      }).addTo(map);
      
      polyline.bindTooltip(route.name);
      routeLayersRef.current.push(polyline);
    });

    // התאמת מרכז וזום למסלולים
    if (routes.length > 0 && routes[0].points.length > 0) {
      const bounds = L.latLngBounds(routes.flatMap(route => route.points));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      routeLayersRef.current.forEach(layer => map.removeLayer(layer));
    };
  }, [map, routes]);

  return null;
}

function PopularRoutes({ isLoading, routes, heatmapPoints }) {
  const defaultPosition = [31.7683, 35.2137]; // ירושלים כברירת מחדל
  
  if (isLoading) {
    return <div className="loading-message">טוען מסלולים פופולריים...</div>;
  }

  if (!routes || routes.length === 0) {
    return <div className="empty-message">לא נמצאו מסלולים פופולריים באזור זה</div>;
  }

  return (
    <div className="popular-routes">
      <h3>מסלולים פופולריים באזורך</h3>
      <p>מפת החום מציגה אזורים פופולריים לפעילות ספורטיבית</p>
      
      <div className="routes-map-container">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <HeatmapLayer points={heatmapPoints} />
          <RoutesLayer routes={routes} />
        </MapContainer>
      </div>
      
      <div className="routes-list">
        {routes.map(route => (
          <div className="route-card" key={route.id}>
            <div className="route-header">
              <div className="route-name">{route.name}</div>
              <div className="route-popularity">
                <span className="popularity-icon">🔥</span>
                <span>{route.popularity}%</span>
              </div>
            </div>
            
            <div className="route-details">
              <div className="route-info">
                <div className="route-info-item">
                  <span className="info-icon">📏</span>
                  <span>אורך: {route.length}</span>
                </div>
                <div className="route-info-item">
                  <span className="info-icon">👥</span>
                  <span>פופולרי בקרב רצים וצועדים</span>
                </div>
              </div>
              <div className="route-action">
                <button className="view-route-btn">צפה במפה</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularRoutes;
