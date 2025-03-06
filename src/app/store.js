import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import communityReducer from '../features/community/communitySlice';
import uiReducer from '../features/ui/uiSlice';
import weatherReducer from '../features/weather/weatherSlice';
import tipsReducer from '../features/tips/tipsSlice';
import groupsReducer from '../features/groups/groupsSlice';
import themeReducer from '../features/ui/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    ui: uiReducer,
    weather: weatherReducer,
    tips: tipsReducer,
    groups: groupsReducer,
    theme: themeReducer
  }
});

export default store;
