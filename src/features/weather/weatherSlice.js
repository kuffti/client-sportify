import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ latitude, longitude }) => {
    // עדכון ל-API כדי לקבל גם תחזית שבועית וגם נתוני איכות אוויר
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto&forecast_days=7`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchAirQuality = createAsyncThunk(
  'weather/fetchAirQuality',
  async ({ latitude, longitude }) => {
    // API לנתוני איכות אוויר
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchPopularRoutes = createAsyncThunk(
  'weather/fetchPopularRoutes',
  async ({ latitude, longitude }) => {
    // בשלב זה נשתמש בנתונים מדומים
    // במימוש אמיתי היה צריך להתחבר ל-API שמספק נתוני פעילות מצטברים
    return generateMockHeatmapData(latitude, longitude);
  }
);

// פונקציה ליצירת נתוני מפת חום מדומים לצורך הדגמה
const generateMockHeatmapData = (centerLat, centerLng) => {
  const points = [];
  // יצירת 30 נקודות אקראיות באזור המשתמש
  for (let i = 0; i < 30; i++) {
    // נקודות במרחק של עד 2 ק"מ מהמיקום המרכזי
    const lat = centerLat + (Math.random() - 0.5) * 0.04;
    const lng = centerLng + (Math.random() - 0.5) * 0.04;
    // עוצמה אקראית של 1-100
    const intensity = Math.floor(Math.random() * 100) + 1;
    points.push([lat, lng, intensity]);
  }
  
  // יצירת מסלולים פופולריים מדומים
  const routes = [
    {
      id: 1,
      name: "מסלול הפארק המרכזי",
      points: generateRoutePoints(centerLat, centerLng, 0.02, 8),
      popularity: 87,
      length: "3.2 ק\"מ"
    },
    {
      id: 2,
      name: "מסלול הטיילת",
      points: generateRoutePoints(centerLat + 0.01, centerLng - 0.01, 0.015, 6),
      popularity: 65,
      length: "2.5 ק\"מ"
    },
    {
      id: 3,
      name: "הר הצופים",
      points: generateRoutePoints(centerLat - 0.015, centerLng + 0.02, 0.025, 10),
      popularity: 92,
      length: "4.7 ק\"מ"
    }
  ];
  
  return { points, routes };
};

// פונקציה ליצירת נקודות מסלול
const generateRoutePoints = (startLat, startLng, radius, pointCount) => {
  const points = [[startLat, startLng]];
  let currentLat = startLat;
  let currentLng = startLng;
  
  for (let i = 1; i < pointCount; i++) {
    // יצירת נקודה בכיוון אקראי
    const direction = Math.random() * Math.PI * 2;
    const distance = (Math.random() * 0.5 + 0.5) * radius / pointCount;
    
    currentLat += Math.sin(direction) * distance;
    currentLng += Math.cos(direction) * distance;
    
    points.push([currentLat, currentLng]);
  }
  
  return points;
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    weeklyForecast: null,
    airQuality: null,
    popularRoutes: null,
    location: null,
    isLoading: false,
    isLoadingAir: false,
    isLoadingRoutes: false,
    error: null
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // מטפל בתחזית מזג אוויר
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWeather = action.payload.current_weather;
        state.weeklyForecast = action.payload.daily;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // מטפל בנתוני איכות אוויר
      .addCase(fetchAirQuality.pending, (state) => {
        state.isLoadingAir = true;
      })
      .addCase(fetchAirQuality.fulfilled, (state, action) => {
        state.isLoadingAir = false;
        state.airQuality = action.payload.current;
      })
      .addCase(fetchAirQuality.rejected, (state) => {
        state.isLoadingAir = false;
      })
      
      // מטפל בנתיבים פופולריים
      .addCase(fetchPopularRoutes.pending, (state) => {
        state.isLoadingRoutes = true;
      })
      .addCase(fetchPopularRoutes.fulfilled, (state, action) => {
        state.isLoadingRoutes = false;
        state.popularRoutes = action.payload;
      })
      .addCase(fetchPopularRoutes.rejected, (state) => {
        state.isLoadingRoutes = false;
      });
  }
});

export const { setLocation } = weatherSlice.actions;
export default weatherSlice.reducer;
