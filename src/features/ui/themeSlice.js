import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('theme') === 'dark'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
