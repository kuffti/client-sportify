import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';
import { showToast } from '../ui/uiSlice';

// מצב התחלתי
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null
};

// פעולה אסינכרונית להרשמה
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await api.post('/api/users/register', userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(showToast({
          message: 'ההרשמה הושלמה בהצלחה!',
          type: 'success'
        }));
        return response.data;
      }
    } catch (error) {
      // שיפור הטיפול בשגיאות
      const errorMessage = error.response?.data?.message || 'שגיאה בהרשמה';
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

// פעולה אסינכרונית להתחברות
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/login', userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // הודעה מותאמת אם המשתמש הוא אדמין
        const message = response.data.isAdmin 
          ? 'התחברת בהצלחה עם הרשאות מנהל!' 
          : 'התחברת בהצלחה!';
          
        dispatch(showToast({
          message,
          type: 'success'
        }));
        
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'שגיאה בהתחברות';
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // חוזר על אותו תהליך עבור הרשמה
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
