import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import communityReducer from '../features/community/communitySlice';
import uiReducer from '../features/ui/uiSlice';
import themeReducer from '../features/ui/themeSlice';
import weatherReducer from '../features/weather/weatherSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    ui: uiReducer,
    theme: themeReducer,
    weather: weatherReducer
  }
});

export default store;
