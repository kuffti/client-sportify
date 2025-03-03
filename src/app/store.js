import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import communityReducer from '../features/community/communitySlice';
import uiReducer from '../features/ui/uiSlice';
import weatherReducer from '../features/weather/weatherSlice';
import tipsReducer from '../features/tips/tipsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    ui: uiReducer,
    weather: weatherReducer,
    tips: tipsReducer // הוספת רדיוסר הטיפים
  }
});

export default store;
