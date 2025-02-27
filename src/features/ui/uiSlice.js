import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  toast: {
    show: false,
    message: '',
    type: 'info' // 'success', 'error', 'info', 'warning'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    }
  }
});

export const { setLoading, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
